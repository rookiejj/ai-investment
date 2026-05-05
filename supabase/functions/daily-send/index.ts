/**
 * 브리픽 일일 카카오 친구톡 발송 Edge Function (솔라피 SOLAPI)
 *
 * 1) GitHub Contents API로 data/*-update.js 6개 fetch
 * 2) 탭별 최신 2건(헤드라인 + 단어경계 축약)으로 메시지 조립
 * 3) subscribers WHERE status='active' AND paid_until > now() 조회
 * 4) 솔라피 친구톡(CTA) API로 발송 (500명 청크)
 * 5) send_logs INSERT
 *
 * 필수 ENV (supabase secrets):
 *   SOLAPI_API_KEY
 *   SOLAPI_API_SECRET
 *   SOLAPI_PFID         (카카오 발신프로필 ID, KA01PF로 시작)
 *   SOLAPI_SENDER       (SMS 폴백용 발신번호 · 친구톡에는 미사용 가능)
 *   GITHUB_TOKEN        (private repo 접근)
 * 선택 ENV:
 *   GITHUB_OWNER / GITHUB_REPO / GITHUB_BRANCH
 *   SITE_URL
 *   DISABLE_SMS_FALLBACK=Y  (친구톡 실패 시 SMS 대체 발송 비활성화, 기본 활성)
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const GITHUB_OWNER  = Deno.env.get("GITHUB_OWNER")  ?? "rookiejj";
const GITHUB_REPO   = Deno.env.get("GITHUB_REPO")   ?? "ai-investment";
const GITHUB_BRANCH = Deno.env.get("GITHUB_BRANCH") ?? "main";
const GITHUB_TOKEN  = Deno.env.get("GITHUB_TOKEN");
const SITE_URL = Deno.env.get("SITE_URL")
  ?? "https://roysbriefing.vercel.app";
const DISABLE_SMS_FALLBACK = Deno.env.get("DISABLE_SMS_FALLBACK") === "Y";

const LIMIT = 1000;
const PER_TAB = 1;
const BATCH_SIZE = 500;
const SOLAPI_API = "https://api.solapi.com";

type Tab = { file: string; var: string; emoji: string; label: string; };
type Entry = { date: string; summary: string; };
type TabWithEntries = Tab & { entries: Entry[] };
type Subscriber = { id: string; phone: string; name: string | null };

const TABS: Tab[] = [
  { file: "kr-stocks-update.js", var: "updates", emoji: "🇰🇷", label: "한국 마켓" },
  { file: "stocks-update.js",    var: "updates", emoji: "🇺🇸", label: "미국 마켓" },
  { file: "ai-update.js",        var: "UPDATES", emoji: "🤖", label: "AI 기업" },
  { file: "unicorn-update.js",   var: "updates", emoji: "🦄", label: "유니콘" },
  { file: "commodity-update.js", var: "updates", emoji: "🛢️", label: "원자재·크립토" },
];

// ═══ GitHub fetch ═══════════════════════════════════════

async function fetchTabEntries(tab: Tab): Promise<Entry[]> {
  const url = GITHUB_TOKEN
    ? `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/${tab.file}?ref=${GITHUB_BRANCH}`
    : `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/data/${tab.file}`;
  const headers: Record<string, string> = {};
  if (GITHUB_TOKEN) {
    headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    headers["Accept"] = "application/vnd.github.raw";
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`fetch ${tab.file} failed ${res.status}: ${body.slice(0, 200)}`);
  }
  const src = await res.text();
  const list = new Function(
    `${src};return typeof ${tab.var}!=="undefined"?${tab.var}:[];`
  )() as unknown[];
  if (!Array.isArray(list)) return [];
  return list
    .slice(0, PER_TAB)
    .filter((e): e is { date?: string; summary?: string } =>
      !!e && typeof (e as { summary?: string }).summary === "string")
    .map((e) => ({
      date: (e.date ?? "").toString(),
      summary: String(e.summary ?? "").trim(),
    }));
}

// ═══ Message composition ═══════════════════════════════

function kstDateLabel(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000 + now.getTimezoneOffset() * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][kst.getUTCDay()];
  return `${y}-${m}-${d} (${dow})`;
}
function smartCut(s: string, max: number): string {
  const raw = s.trim();
  if (raw.length <= max) return raw;
  const w = raw.slice(0, max);
  const minKeep = Math.floor(max * 0.5);
  const emIdx = Math.max(w.lastIndexOf(" — "), w.lastIndexOf("—"));
  if (emIdx >= minKeep) return raw.slice(0, emIdx).trimEnd() + "…";
  let lastSep = -1;
  for (let i = 0; i < w.length; i++) {
    if (w[i] === "," || w[i] === "·") lastSep = i;
  }
  if (lastSep >= minKeep) return raw.slice(0, lastSep).trimEnd() + "…";
  const sp = w.lastIndexOf(" ");
  if (sp >= minKeep) return raw.slice(0, sp).trimEnd() + "…";
  return raw.slice(0, max - 1) + "…";
}
function buildTabBlock(tab: TabWithEntries): string {
  const lines = [`${tab.emoji} ${tab.label}`, ""];
  const [first] = tab.entries;
  if (first) {
    for (const raw of first.summary.split("\n")) {
      const line = raw.trim();
      if (line) lines.push(`• ${line}`);
    }
  }
  return lines.join("\n");
}
function buildMessage(tabs: TabWithEntries[]): string {
  const parts = [`📊 브리픽 · ${kstDateLabel()}`];
  for (const t of tabs) if (t.entries.length) parts.push(buildTabBlock(t));
  return parts.join("\n\n");
}

// 합산이 한도 초과 시 모든 탭 보존하며 줄 단위로 균등 cut.
// 각 탭에 동일 budget 분배 → 한도 초과한 탭은 끝 줄부터 제거 (중간 자르기·"…" 없음)
function fitToLimit(tabs: TabWithEntries[], max: number): string {
  const full = buildMessage(tabs);
  if (full.length <= max) return full;
  const valid = tabs.filter((t) => t.entries.length > 0);
  if (!valid.length) return full;

  const header = `📊 브리픽 · ${kstDateLabel()}`;
  const headerLen = header.length;
  const sepLen = 2; // "\n\n"
  const tabHeaderLen = valid.map((t) => `${t.emoji} ${t.label}\n\n`.length);
  const tabHeaderTotal = tabHeaderLen.reduce((a, b) => a + b, 0);
  const remaining = max - headerLen - sepLen * valid.length - tabHeaderTotal;
  if (remaining <= 0) return full.slice(0, max);

  // 1차 패스: 탭별 평균 budget 적용
  const perTab = Math.floor(remaining / valid.length);
  const taken: string[][] = [];
  const usedChars: number[] = [];
  for (const t of valid) {
    const lines = (t.entries[0]?.summary ?? "")
      .split("\n").map((s) => s.trim()).filter(Boolean);
    const kept: string[] = [];
    let used = 0;
    for (const line of lines) {
      const cost = 2 + line.length + 1; // "• " + line + "\n"
      if (used + cost > perTab) break;
      kept.push(line);
      used += cost;
    }
    taken.push(kept);
    usedChars.push(used);
  }

  // 2차 패스: 사용 안 한 budget을 다른 탭에 재분배
  let leftover = remaining - usedChars.reduce((a, b) => a + b, 0);
  if (leftover > 0) {
    for (let i = 0; i < valid.length && leftover > 0; i++) {
      const allLines = (valid[i].entries[0]?.summary ?? "")
        .split("\n").map((s) => s.trim()).filter(Boolean);
      let used = usedChars[i];
      for (let j = taken[i].length; j < allLines.length; j++) {
        const cost = 2 + allLines[j].length + 1;
        if (cost > leftover) break;
        taken[i].push(allLines[j]);
        used += cost;
        leftover -= cost;
      }
      usedChars[i] = used;
    }
  }

  // 재조립
  const trimmedTabs = valid.map((t, i) => ({
    ...t,
    entries: [{ ...t.entries[0], summary: taken[i].join("\n") }],
  }));
  return buildMessage(trimmedTabs);
}

// 솔라피 실패 메시지를 구독자 수신 상태로 정규화
// SOLAPI/카카오 결과 코드 우선 매칭, 그 외는 텍스트 키워드로 폴백
function deriveDeliveryState(msg: string | null | undefined): string {
  if (!msg) return "unknown";
  const m = msg.toLowerCase();
  // 결과 코드 우선
  if (/\b3050\b/.test(m)) return "not_friend";              // 친구가 아님
  if (/\b3120\b/.test(m)) return "paused_ad";               // 광고성 메시지 수신 거부
  if (/\b(3130|3140|3160)\b/.test(m)) return "blocked";     // 차단
  // 텍스트 폴백
  if (m.includes("friend") || m.includes("친구") || m.includes("수신거부 친구")) return "not_friend";
  if (m.includes("block") || m.includes("차단")) return "blocked";
  if (m.includes("광고") || m.includes("수신거부") || m.includes("ad ") || m.includes("ad_") || m.includes("marketing")) return "paused_ad";
  return "unknown";
}

// ═══ SOLAPI HMAC auth ══════════════════════════════════

async function solapiAuthHeader(apiKey: string, apiSecret: string): Promise<string> {
  const date = new Date().toISOString();
  const salt = crypto.randomUUID().replace(/-/g, "");
  const msg = date + salt;
  const keyBytes = new TextEncoder().encode(apiSecret);
  const dataBytes = new TextEncoder().encode(msg);
  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", cryptoKey, dataBytes);
  const sig = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${sig}`;
}

type SolapiSendResult = {
  groupId: string;
  groupInfo: { count: { total: number; registeredFailed?: number } };
  failedMessageList: Array<{ to: string; statusMessage: string }>;
  raw: unknown;
};

async function solapiSendFriendtalk(opts: {
  apiKey: string;
  apiSecret: string;
  pfId: string;
  sender: string;
  receivers: Subscriber[];
  message: string;
}): Promise<SolapiSendResult> {
  const { apiKey, apiSecret, pfId, sender, receivers, message } = opts;

  const messages = receivers.map((r) => ({
    to: r.phone,
    from: sender,
    text: message,
    type: "CTA",
    kakaoOptions: {
      pfId,
      disableSms: DISABLE_SMS_FALLBACK,
      bms: { targeting: "I" },  // I = 채널 친구만
      buttons: [{
        buttonType: "WL",
        buttonName: "전체 뉴스 보기",
        linkMo: SITE_URL,
        linkPc: SITE_URL,
      }],
    },
  }));

  const auth = await solapiAuthHeader(apiKey, apiSecret);
  const res = await fetch(`${SOLAPI_API}/messages/v4/send-many`, {
    method: "POST",
    headers: {
      "Authorization": auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`solapi ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  }
  return {
    groupId: json.groupId,
    groupInfo: json.groupInfo,
    failedMessageList: json.failedMessageList ?? [],
    raw: json,
  };
}

// ═══ Handler ═══════════════════════════════════════════

Deno.serve(async (req) => {
  const startedAt = Date.now();
  try {
    // verify_jwt=false로 배포되므로 자체 인증 필수
    const cronSecret = Deno.env.get("CRON_SECRET");
    const headerSecret = req.headers.get("x-cron-secret")
      ?? (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!cronSecret || headerSecret !== cronSecret) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const dryRun = url.searchParams.get("dry") === "1"
      || url.searchParams.get("dryRun") === "1";

    // body.subscriberIds 가 있으면 해당 active 구독자만 발송 (운영 대시보드 선택 발송용)
    const reqBody = await req.json().catch(() => ({} as Record<string, unknown>));
    const rawIds = (reqBody as { subscriberIds?: unknown }).subscriberIds;
    const subscriberIds: string[] | null = Array.isArray(rawIds)
      ? rawIds.filter((x): x is string => typeof x === "string" && x.length > 0)
      : null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );

    // 1) 메시지 조립
    const tabs: TabWithEntries[] = [];
    for (const t of TABS) {
      const entries = await fetchTabEntries(t);
      if (entries.length) tabs.push({ ...t, entries });
    }
    const rawMessage = buildMessage(tabs);
    const message = fitToLimit(tabs, LIMIT);
    const truncated = message.length < rawMessage.length;
    if (truncated) {
      console.warn(`[warn] message truncated even-share: ${rawMessage.length}→${message.length}`);
    }

    // 2) 만료된 구독자 상태 최신화 (paid_until이 과거인 active → expired)
    const nowIso = new Date().toISOString();
    const { error: expErr, count: expiredCount } = await supabase
      .from("subscribers")
      .update({ status: "expired" }, { count: "exact" })
      .eq("status", "active")
      .not("paid_until", "is", null)
      .lte("paid_until", nowIso)
      .select("id", { count: "exact", head: true });
    if (expErr) console.warn("[warn] expire update failed", expErr);
    if (expiredCount && expiredCount > 0) {
      console.log(`[info] expired ${expiredCount} subscriber(s)`);
    }

    // 3) 활성 구독자 조회 (subscriberIds 필터 있으면 해당 ID만)
    let subQ = supabase
      .from("subscribers")
      .select("id, phone, name")
      .eq("status", "active");
    if (subscriberIds && subscriberIds.length > 0) {
      subQ = subQ.in("id", subscriberIds);
    }
    const { data: subs, error: subErr } = await subQ.returns<Subscriber[]>();
    if (subErr) throw subErr;

    if (dryRun) {
      return Response.json({
        ok: true, dryRun: true,
        charCount: message.length, rawCharCount: rawMessage.length, limit: LIMIT,
        truncated,
        overflow: message.length > LIMIT,
        activeSubscribers: subs?.length ?? 0,
        tabCount: tabs.length,
        message,
        elapsedMs: Date.now() - startedAt,
      });
    }

    if (!subs || subs.length === 0) {
      return Response.json({ ok: true, sent: 0, note: "no active subscribers", charCount: message.length });
    }

    // 3) 솔라피 발송
    const apiKey    = Deno.env.get("SOLAPI_API_KEY")!;
    const apiSecret = Deno.env.get("SOLAPI_API_SECRET")!;
    const pfId      = Deno.env.get("SOLAPI_PFID")!;
    const sender    = Deno.env.get("SOLAPI_SENDER")!;
    if (!apiKey || !apiSecret || !pfId || !sender) {
      return Response.json({ ok: false, error: "solapi env missing" }, { status: 500 });
    }

    const batchId = crypto.randomUUID();
    const logs: Array<Record<string, unknown>> = [];
    // 상태별 id 집합 — 발송 후 subscribers.delivery_state 일괄 갱신
    const stateGroups: Record<string, string[]> = { ok: [], not_friend: [], blocked: [], paused_ad: [], unknown: [] };

    for (let i = 0; i < subs.length; i += BATCH_SIZE) {
      const batch = subs.slice(i, i + BATCH_SIZE);
      let result: SolapiSendResult | null = null;
      let errMsg: string | null = null;
      try {
        result = await solapiSendFriendtalk({
          apiKey, apiSecret, pfId, sender,
          receivers: batch, message,
        });
      } catch (e) {
        errMsg = e instanceof Error ? e.message : String(e);
      }

      const failedMap = new Map<string, string>();
      for (const f of result?.failedMessageList ?? []) {
        failedMap.set(f.to, f.statusMessage ?? "");
      }

      for (const s of batch) {
        const failedMsg = failedMap.get(s.phone);
        const failed = !!errMsg || failedMap.has(s.phone);
        const providerMsg = errMsg ?? (failed ? (failedMsg || "solapi failedMessageList") : "ok");
        logs.push({
          subscriber_id: s.id,
          phone: s.phone,
          message,
          char_count: message.length,
          status: failed ? "fail" : "success",
          message_type: "friendtalk",
          template_code: "daily_news",
          provider: "solapi",
          provider_code: result?.groupId ?? null,
          provider_message: providerMsg,
          provider_msg_id: result?.groupId ?? null,
          batch_id: batchId,
        });
        const state = failed ? deriveDeliveryState(providerMsg) : "ok";
        stateGroups[state].push(s.id);
      }

      if (errMsg) {
        console.error(`[error] batch ${i / BATCH_SIZE + 1}`, errMsg);
        break;
      }
    }

    const { error: logErr } = await supabase.from("send_logs").insert(logs);

    // subscribers.delivery_state 배치 갱신
    // unknown(시스템 이슈·시간대 제약·길이 초과 등 수신자 본인 책임 아닌 실패)은 갱신 skip — 기존 상태 유지
    for (const [state, ids] of Object.entries(stateGroups)) {
      if (ids.length === 0) continue;
      if (state === "unknown") continue;
      const { error: updErr } = await supabase
        .from("subscribers")
        .update({ delivery_state: state })
        .in("id", ids);
      if (updErr) console.error(`[warn] delivery_state update (${state})`, updErr);
    }
    if (logErr) console.error("[error] log insert", logErr);

    const success = logs.filter((l) => l.status === "success").length;
    const fail = logs.filter((l) => l.status === "fail").length;

    return Response.json({
      ok: fail === 0,
      sent: success, failed: fail,
      charCount: message.length,
      batchId,
      elapsedMs: Date.now() - startedAt,
    });
  } catch (err) {
    console.error("[fatal]", err);
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
});
