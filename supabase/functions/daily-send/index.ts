/**
 * 브리픽 일일 카카오 친구톡 발송 Edge Function (알리고 — VPS 프록시 경유)
 *
 * 1) GitHub Contents API로 data/*-update.js 6개 fetch
 * 2) 탭별 최신 2건(헤드라인 + 단어경계 축약)으로 메시지 조립
 * 3) subscribers WHERE status='active' AND paid_until > now() 조회
 * 4) 알리고 친구톡 API를 VPS 프록시 경유로 호출 (500명 청크)
 *    → 알리고가 IP 화이트리스트 강제라 동적 IP인 Edge Function에서 직접 호출 불가
 *    → VPS(115.68.224.225)의 Node 프록시가 X-Proxy-Secret 인증 후 알리고 호출
 * 5) send_logs INSERT
 *
 * 필수 ENV (supabase secrets):
 *   ALIGO_PROXY_URL     (예: https://proxy.briefick.com/friend/send)
 *   ALIGO_PROXY_SECRET  (VPS .env의 PROXY_SHARED_SECRET와 동일 값)
 *   GITHUB_TOKEN        (private repo 접근)
 * 선택 ENV:
 *   GITHUB_OWNER / GITHUB_REPO / GITHUB_BRANCH
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const GITHUB_OWNER  = Deno.env.get("GITHUB_OWNER")  ?? "rookiejj";
const GITHUB_REPO   = Deno.env.get("GITHUB_REPO")   ?? "ai-investment";
const GITHUB_BRANCH = Deno.env.get("GITHUB_BRANCH") ?? "main";
const GITHUB_TOKEN  = Deno.env.get("GITHUB_TOKEN");

import { notify } from "../_shared/notify.ts";

const LIMIT = 1000;
const PER_TAB = 1;
const BATCH_SIZE = 500;

type Tab = { id: string; emoji: string; label: string; };
type Entry = { date: string; summary: string; };
type TabWithEntries = Tab & { entries: Entry[] };
type Subscriber = { id: string; phone: string; name: string | null };

const TABS: Tab[] = [
  { id: "kr",        emoji: "🇰🇷", label: "한국 마켓" },
  { id: "stocks",    emoji: "🇺🇸", label: "미국 마켓" },
  { id: "ai",        emoji: "🤖", label: "AI 기업" },
  { id: "commodity", emoji: "🛢️", label: "원자재·크립토" },
  { id: "unicorn",   emoji: "🦄", label: "유니콘" },
];

// ═══ 영문 회사명·티커 → 한글 치환 ═════════════════════
// data/company-ko.js를 GitHub raw로 fetch해 친구톡 본문 한글화.
// index.html의 localizeText와 동일 룰: 길이 내림차순 + 영문 알파벳·숫자 단어 경계.

let _companyKoPairs: Array<[string, string]> = [];

async function loadCompanyKoMap(): Promise<void> {
  try {
    const url = GITHUB_TOKEN
      ? `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/company-ko.js?ref=${GITHUB_BRANCH}`
      : `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/data/company-ko.js`;
    const headers: Record<string, string> = {};
    if (GITHUB_TOKEN) {
      headers["Authorization"] = `token ${GITHUB_TOKEN}`;
      headers["Accept"] = "application/vnd.github.raw";
    }
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`status=${res.status}`);
    const src = await res.text();
    const map = new Function(
      `${src};return typeof COMPANY_KO!=="undefined"?COMPANY_KO:{};`
    )() as Record<string, string>;
    _companyKoPairs = Object.entries(map).sort((a, b) => b[0].length - a[0].length);
  } catch (e) {
    console.warn("[warn] company-ko load failed, fallback empty map", e);
    _companyKoPairs = [];
  }
}

function localizeText(text: string): string {
  if (!text) return text;
  let r = String(text);
  for (const [en, ko] of _companyKoPairs) {
    const esc = en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    r = r.replace(new RegExp("(?<![A-Za-z0-9])" + esc + "(?![A-Za-z0-9])", "g"), ko);
  }
  return r;
}

// ═══ Supabase DB fetch (tab_updates) ════════════════════
// 기존 GitHub raw fetch 폐기 — 2026-05-14 DB 전환. 같은 Supabase 프로젝트라 service role 직접.

async function fetchTabEntries(
  supabase: ReturnType<typeof createClient>,
  tab: Tab,
): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("tab_updates")
    .select("entry_date,summary,raw")
    .eq("tab_id", tab.id)
    .eq("is_archive", false)
    .order("entry_date", { ascending: false })
    .limit(PER_TAB);
  if (error) {
    throw new Error(`fetch ${tab.id} failed: ${error.message}`);
  }
  if (!data) return [];
  return data
    .filter((row) => {
      // AI탭은 raw에 entries 형식으로 summary 없을 수 있음. 그건 skip (친구톡 본문엔 안 들어감)
      return row.summary && typeof row.summary === "string";
    })
    .map((row) => ({
      date: row.entry_date ?? "",
      summary: localizeText(String(row.summary ?? "").trim()),
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

// 알리고는 SOLAPI와 달리 표준화된 실패 사유 코드를 제공하지 않음 (rslt_message 자연어만).
// 사유별 분류는 의미 없는 키워드 매칭이라 ok/fail/unknown 3단계로만 구분.
// - ok: 발송 성공
// - fail: 그룹 전체 실패 (errMsg 있음)
// - unknown: 부분 실패 (폰별 결과 모름)
// 자연어 사유는 send_logs.provider_message에 그대로 보관 — 필요 시 관리자가 직접 확인.

// ═══ 알리고 프록시 호출 (VPS 경유) ══════════════════════
// 알리고 API는 IP 화이트리스트가 강제라 동적 IP인 Edge Function에서 직접 호출 불가.
// VPS(115.68.224.225)에 작은 Node 프록시를 띄워두고 Edge Function이 그쪽으로 호출.
// 프록시는 X-Proxy-Secret 헤더로 인증, 알리고 API key·senderkey는 VPS .env에 보관.

type AligoSendResult = {
  code: number;
  message: string;
  info: {
    type?: string;
    mid?: number;
    current?: string;
    unit?: number;
    total?: number;
    scnt?: number;
    fcnt?: number;
  } | null;
  raw: unknown;
};

// VPS 프록시가 button 미전달 시 기본 버튼(name: '1분 브리핑 보러가기',
// URL: vercel.app)을 자동 추가하는 동작이 있어, 매번 명시 전달해 덮어씀.
const DAILY_BUTTON_NAME = "오늘의 브리핑 보러가기";
const DAILY_BUTTON_URL  = "https://briefick.com";

async function aligoSendFriendtalk(opts: {
  proxyUrl: string;
  proxySecret: string;
  receivers: Subscriber[];
  message: string;
}): Promise<AligoSendResult> {
  const { proxyUrl, proxySecret, receivers, message } = opts;
  const phones = receivers.map((r) => r.phone);
  const button = {
    button: [{
      name: DAILY_BUTTON_NAME,
      linkType: "WL",
      linkTypeName: "웹링크",
      linkMo: DAILY_BUTTON_URL,
      linkPc: DAILY_BUTTON_URL,
    }],
  };
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": proxySecret,
    },
    body: JSON.stringify({ phones, message, button }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`aligo proxy ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  }
  return {
    code: Number(json.code ?? -1),
    message: typeof json.message === "string" ? json.message : "",
    info: json.info ?? null,
    raw: json,
  };
}

// ═══ Handler ═══════════════════════════════════════════

Deno.serve(async (req) => {
  const startedAt = Date.now();
  let isManual = false;
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
    // body.customMessage 가 있으면 update.js 조립 대신 본문 그대로 사용 (공지 발송)
    const reqBody = await req.json().catch(() => ({} as Record<string, unknown>));
    const rawIds = (reqBody as { subscriberIds?: unknown }).subscriberIds;
    const subscriberIds: string[] | null = Array.isArray(rawIds)
      ? rawIds.filter((x): x is string => typeof x === "string" && x.length > 0)
      : null;
    const customMessageRaw = (reqBody as { customMessage?: unknown }).customMessage;
    const customMessage = typeof customMessageRaw === "string" && customMessageRaw.trim().length > 0
      ? customMessageRaw
      : null;

    // 매뉴얼 호출(공지·선택 발송)은 알림 skip. 매일 cron만 알림.
    isManual = Boolean(subscriberIds || customMessage);
    if (!isManual && !dryRun) {
      await notify("Daily Send", "start");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );

    // 1) 메시지 조립 — 공지(customMessage) 또는 update.js 자동 조립
    let message: string;
    let rawMessage: string;
    let truncated = false;
    let tabCount = 0;
    if (customMessage) {
      message = customMessage;
      rawMessage = customMessage;
    } else {
      // 한글 매핑 먼저 로드 — fetchTabEntries에서 summary localize 시 사용
      await loadCompanyKoMap();
      const tabs: TabWithEntries[] = [];
      for (const t of TABS) {
        const entries = await fetchTabEntries(supabase, t);
        if (entries.length) tabs.push({ ...t, entries });
      }
      tabCount = tabs.length;
      rawMessage = buildMessage(tabs);
      message = fitToLimit(tabs, LIMIT);
      truncated = message.length < rawMessage.length;
      if (truncated) {
        console.warn(`[warn] message truncated even-share: ${rawMessage.length}→${message.length}`);
      }
    }
    const templateCode = customMessage ? "notice" : "daily_news";

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
        tabCount,
        message,
        templateCode,
        elapsedMs: Date.now() - startedAt,
      });
    }

    if (!subs || subs.length === 0) {
      return Response.json({ ok: true, sent: 0, note: "no active subscribers", charCount: message.length });
    }

    // 3) 알리고 프록시 발송 (VPS 경유)
    const proxyUrl    = Deno.env.get("ALIGO_PROXY_URL")!;
    const proxySecret = Deno.env.get("ALIGO_PROXY_SECRET")!;
    if (!proxyUrl || !proxySecret) {
      return Response.json({ ok: false, error: "aligo proxy env missing" }, { status: 500 });
    }

    const batchId = crypto.randomUUID();
    const logs: Array<Record<string, unknown>> = [];
    // 상태별 id 집합 — 발송 후 subscribers.delivery_state 일괄 갱신
    const stateGroups: Record<string, string[]> = { ok: [], fail: [], unknown: [] };

    for (let i = 0; i < subs.length; i += BATCH_SIZE) {
      const batch = subs.slice(i, i + BATCH_SIZE);
      let result: AligoSendResult | null = null;
      let errMsg: string | null = null;
      try {
        result = await aligoSendFriendtalk({
          proxyUrl, proxySecret,
          receivers: batch, message,
        });
        if (result.code !== 0) {
          errMsg = `aligo code=${result.code}: ${result.message}`;
        }
      } catch (e) {
        errMsg = e instanceof Error ? e.message : String(e);
      }

      // 알리고는 per-phone 실패 정보를 안 줌 — 부분 실패면 어느 폰이 실패했는지 모름.
      // - 전체 실패(errMsg): 모두 status=fail · delivery_state=fail
      // - 부분 실패(fcnt > 0): 폰별 결과 모르므로 status=success(그룹 전송 자체는 성공) + delivery_state=unknown (갱신 skip)
      // - 전체 성공: 모두 ok
      const fcnt = result?.info?.fcnt ?? 0;
      const total = result?.info?.total ?? batch.length;
      const partialFailed = !errMsg && fcnt > 0;
      const groupId = result?.info?.mid ? String(result.info.mid) : null;

      for (const s of batch) {
        const failed = !!errMsg;
        const providerMsg = errMsg ?? (partialFailed ? `partial: ${fcnt}/${total} failed` : "ok");
        logs.push({
          subscriber_id: s.id,
          phone: s.phone,
          message,
          char_count: message.length,
          status: failed ? "fail" : "success",
          message_type: "friendtalk",
          template_code: templateCode,
          provider: "aligo",
          provider_code: groupId,
          provider_message: providerMsg,
          provider_msg_id: groupId,
          batch_id: batchId,
        });
        const state = failed ? "fail" : (partialFailed ? "unknown" : "ok");
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

    if (!isManual) {
      await notify(
        "Daily Send",
        fail === 0 ? "success" : "failure",
        `발송 ${success}건 / 실패 ${fail}건`,
      );
    }

    return Response.json({
      ok: fail === 0,
      sent: success, failed: fail,
      charCount: message.length,
      batchId,
      elapsedMs: Date.now() - startedAt,
    });
  } catch (err) {
    console.error("[fatal]", err);
    if (!isManual) {
      await notify(
        "Daily Send",
        "failure",
        err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
      );
    }
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
});
