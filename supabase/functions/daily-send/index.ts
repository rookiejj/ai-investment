/**
 * 브리픽 일일 카카오 친구톡 발송 Edge Function
 *
 * 1) GitHub raw에서 data/*-update.js 6개 fetch
 * 2) 탭별 최신 2건(헤드라인 + 단어경계 축약)으로 메시지 조립
 * 3) subscribers WHERE status='active' 조회
 * 4) 알리고 API로 친구톡 발송 (500명 청크)
 * 5) send_logs INSERT
 *
 * 필수 ENV (supabase secrets):
 *   ALIGO_API_KEY
 *   ALIGO_USER_ID
 *   ALIGO_SENDER_KEY
 *   ALIGO_SENDER
 *   GITHUB_TOKEN        (private repo일 때 필수, public이면 생략 가능)
 * 선택 ENV:
 *   GITHUB_OWNER        (기본 rookiejj)
 *   GITHUB_REPO         (기본 ai-investment)
 *   GITHUB_BRANCH       (기본 main)
 *   SITE_URL
 *   FAILOVER            (Y/N, 기본 N)
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

type Tab = {
  file: string;
  var: string;
  emoji: string;
  label: string;
};

type Entry = {
  date: string;
  summary: string;
};

type TabWithEntries = Tab & { entries: Entry[] };

const GITHUB_OWNER  = Deno.env.get("GITHUB_OWNER")  ?? "rookiejj";
const GITHUB_REPO   = Deno.env.get("GITHUB_REPO")   ?? "ai-investment";
const GITHUB_BRANCH = Deno.env.get("GITHUB_BRANCH") ?? "main";
const GITHUB_TOKEN  = Deno.env.get("GITHUB_TOKEN");  // private repo 시 필수
const SITE_URL = Deno.env.get("SITE_URL")
  ?? "https://rookiejj.github.io/ai-investment/";
const FAILOVER = Deno.env.get("FAILOVER") === "Y" ? "Y" : "N";

const LIMIT = 1000;
const PER_TAB = 2;
const SHORT_CUT = 25;
const BATCH_SIZE = 500;

const TABS: Tab[] = [
  { file: "stocks-update.js",    var: "updates", emoji: "🇺🇸", label: "미국 마켓" },
  { file: "kr-stocks-update.js", var: "updates", emoji: "🇰🇷", label: "한국 마켓" },
  { file: "ai-update.js",        var: "UPDATES", emoji: "🤖", label: "AI 기업" },
  { file: "etf-update.js",       var: "updates", emoji: "🌍", label: "글로벌 ETF" },
  { file: "unicorn-update.js",   var: "updates", emoji: "🦄", label: "유니콘" },
  { file: "commodity-update.js", var: "updates", emoji: "📉", label: "시장·원자재" },
];

// ═══ Data fetch ════════════════════════════════════════

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
  if (!res.ok) throw new Error(`fetch ${tab.file} failed: ${res.status}`);
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

// ═══ Message composition ════════════════════════════════

function kstDateLabel(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000 + now.getTimezoneOffset() * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][kst.getUTCDay()];
  return `${y}-${m}-${d} (${dow})`;
}

function fmtFullDateTime(dateStr: string): string {
  const m = String(dateStr).match(/^\d{4}-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/);
  return m ? `${m[1]}-${m[2]} ${m[3]}` : "";
}

function fmtTimeOnly(dateStr: string): string {
  const m = String(dateStr).match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}:\d{2})/);
  return m ? m[1] : "";
}

// em dash → 쉼표/중간점 → 공백 우선으로 자연스러운 지점에서 컷
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
  if (first) {
    const dt = fmtFullDateTime(first.date);
    lines.push(dt ? `• ${dt}  ${first.summary}` : `• ${first.summary}`);
  }
  if (second) {
    const t = fmtTimeOnly(second.date);
    const cut = smartCut(second.summary, SHORT_CUT);
    lines.push(t ? `  + ${t}  ${cut}` : `  + ${cut}`);
  }
  return lines.join("\n");
}

function buildMessage(tabs: TabWithEntries[]): string {
  const parts = [`📊 브리픽 · ${kstDateLabel()}\n━━━━━━━━━━━━━━━━`];
  for (const t of tabs) {
    if (t.entries.length) parts.push(buildTabBlock(t));
  }
  parts.push(`━━━━━━━━━━━━━━━━\n▸ 전체 보기\n${SITE_URL}`);
  return parts.join("\n\n");
}

// ═══ Aligo API ════════════════════════════════════════

async function issueAligoToken(apiKey: string, userId: string): Promise<string> {
  const form = new URLSearchParams({ apikey: apiKey, userid: userId });
  const res = await fetch("https://kakaoapi.aligo.in/akv10/token/create/60/s/", {
    method: "POST",
    body: form,
  });
  const j = await res.json();
  if (String(j.code) !== "0") {
    throw new Error(`aligo token fail: ${j.message ?? JSON.stringify(j)}`);
  }
  return j.token;
}

type Subscriber = { id: string; phone: string; name: string | null };

async function sendFriendtalkBatch(opts: {
  apiKey: string;
  userId: string;
  token: string;
  senderKey: string;
  sender: string;
  receivers: Subscriber[];
  message: string;
}): Promise<Record<string, unknown>> {
  const { apiKey, userId, token, senderKey, sender, receivers, message } = opts;
  const form = new URLSearchParams();
  form.set("apikey", apiKey);
  form.set("userid", userId);
  form.set("token", token);
  form.set("senderkey", senderKey);
  form.set("sender", sender);
  form.set("failover", FAILOVER);
  receivers.forEach((r, i) => {
    const n = i + 1;
    form.set(`receiver_${n}`, r.phone);
    form.set(`message_${n}`, message);
    if (r.name) form.set(`recv_name_${n}`, r.name);
  });
  const res = await fetch("https://kakaoapi.aligo.in/akv10/friend/send/", {
    method: "POST",
    body: form,
  });
  return await res.json();
}

// ═══ Handler ══════════════════════════════════════════

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

    // 2) 구독자 조회 (dry-run에서도 수만 확인)
    const { data: subs, error: subErr } = await supabase
      .from("subscribers")
      .select("id, phone, name")
      .eq("status", "active")
      .returns<Subscriber[]>();
    if (subErr) throw subErr;

    if (dryRun) {
      return Response.json({
        ok: true,
        dryRun: true,
        charCount: message.length,
        limit: LIMIT,
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

    // 3) 알리고 발송
    const apiKey    = Deno.env.get("ALIGO_API_KEY")!;
    const userId    = Deno.env.get("ALIGO_USER_ID")!;
    const senderKey = Deno.env.get("ALIGO_SENDER_KEY")!;
    const sender    = Deno.env.get("ALIGO_SENDER")!;

    const token = await issueAligoToken(apiKey, userId);
    const batchId = crypto.randomUUID();
    const logs: Array<Record<string, unknown>> = [];

    for (let i = 0; i < subs.length; i += BATCH_SIZE) {
      const batch = subs.slice(i, i + BATCH_SIZE);
      const result = await sendFriendtalkBatch({
        apiKey, userId, token, senderKey, sender,
        receivers: batch, message,
      });
      const ok = String(result.code ?? "") === "0";
      for (const s of batch) {
        logs.push({
          subscriber_id: s.id,
          phone: s.phone,
          message,
          char_count: message.length,
          status: ok ? "success" : "fail",
          aligo_code: String(result.code ?? ""),
          aligo_message: String(result.message ?? ""),
          aligo_msg_id: result.msg_id != null ? String(result.msg_id) : null,
          batch_id: batchId,
        });
      }
      if (!ok) {
        console.error(`[error] batch ${i / BATCH_SIZE + 1} failed`, result);
        break;
      }
    }

    // 4) 로그 기록
    const { error: logErr } = await supabase.from("send_logs").insert(logs);
    if (logErr) console.error("[error] log insert", logErr);

    const success = logs.filter((l) => l.status === "success").length;
    const fail = logs.filter((l) => l.status === "fail").length;
    const elapsedMs = Date.now() - startedAt;

    return Response.json({
      ok: fail === 0,
      sent: success,
      failed: fail,
      charCount: message.length,
      batchId,
      elapsedMs,
    });
  } catch (err) {
    console.error("[fatal]", err);
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
});
