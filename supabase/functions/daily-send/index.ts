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
const PER_TAB = 2;
const SHORT_CUT = 25;
const BATCH_SIZE = 500;
const SOLAPI_API = "https://api.solapi.com";

type Tab = { file: string; var: string; emoji: string; label: string; };
type Entry = { date: string; summary: string; };
type TabWithEntries = Tab & { entries: Entry[] };
type Subscriber = { id: string; phone: string; name: string | null };

const TABS: Tab[] = [
  { file: "stocks-update.js",    var: "updates", emoji: "🇺🇸", label: "미국 마켓" },
  { file: "kr-stocks-update.js", var: "updates", emoji: "🇰🇷", label: "한국 마켓" },
  { file: "ai-update.js",        var: "UPDATES", emoji: "🤖", label: "AI 기업" },
  { file: "etf-update.js",       var: "updates", emoji: "🌍", label: "글로벌 ETF" },
  { file: "unicorn-update.js",   var: "updates", emoji: "🦄", label: "유니콘" },
  { file: "commodity-update.js", var: "updates", emoji: "📉", label: "시장·원자재" },
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
  const lines = [`${tab.emoji} ${tab.label}`];
  const [first, second] = tab.entries;
  if (first) lines.push(`• ${first.summary}`);
  if (second) lines.push(`• ${smartCut(second.summary, SHORT_CUT)}`);
  return lines.join("\n");
}
function buildMessage(tabs: TabWithEntries[]): string {
  const parts = [`📊 브리픽 · ${kstDateLabel()}\n━━━━━━━━━━━━━━━━`];
  for (const t of tabs) if (t.entries.length) parts.push(buildTabBlock(t));
  parts.push(`━━━━━━━━━━━━━━━━\n▸ 전체 보기\n${SITE_URL}`);
  return parts.join("\n\n");
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
    const url = new URL(req.url);
    const dryRun = url.searchParams.get("dry") === "1"
      || url.searchParams.get("dryRun") === "1";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) 메시지 조립
    const tabs: TabWithEntries[] = [];
    for (const t of TABS) {
      const entries = await fetchTabEntries(t);
      if (entries.length) tabs.push({ ...t, entries });
    }
    const message = buildMessage(tabs);
    if (message.length > LIMIT) {
      console.warn(`[warn] message exceeds limit: ${message.length}/${LIMIT}`);
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

    // 3) 활성 구독자 조회 (유료 유효 + 무료 NULL 모두 포함)
    const { data: subs, error: subErr } = await supabase
      .from("subscribers")
      .select("id, phone, name")
      .eq("status", "active")
      .returns<Subscriber[]>();
    if (subErr) throw subErr;

    if (dryRun) {
      return Response.json({
        ok: true, dryRun: true,
        charCount: message.length, limit: LIMIT,
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

      const failedTos = new Set((result?.failedMessageList ?? []).map((f) => f.to));
      for (const s of batch) {
        const failed = !!errMsg || failedTos.has(s.phone);
        logs.push({
          subscriber_id: s.id,
          phone: s.phone,
          message,
          char_count: message.length,
          status: failed ? "fail" : "success",
          aligo_code: result?.groupId ?? null,
          aligo_message: errMsg ?? (failed ? "solapi failedMessageList" : "ok"),
          aligo_msg_id: result?.groupId ?? null,
          batch_id: batchId,
        });
      }

      if (errMsg) {
        console.error(`[error] batch ${i / BATCH_SIZE + 1}`, errMsg);
        break;
      }
    }

    const { error: logErr } = await supabase.from("send_logs").insert(logs);
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
