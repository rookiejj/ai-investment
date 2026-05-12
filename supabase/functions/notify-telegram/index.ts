/**
 * notify-telegram — 운영 알림 단일 진입점
 *
 * 모든 cron·워크플로의 시작/끝 알림을 Telegram Bot API로 중계.
 * 토큰은 이 함수의 Supabase secret에만 박혀 다른 곳에 노출 0.
 *
 * 인증: X-Notify-Secret 헤더 (NOTIFY_SECRET secret과 일치)
 * Body: { source: string, status: 'start' | 'success' | 'failure' | 'unknown', detail?: string }
 *
 * 호출 예 (curl):
 *   curl -X POST https://<project>.supabase.co/functions/v1/notify-telegram \
 *     -H "X-Notify-Secret: <secret>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"source":"Cartoon Generate","status":"success","detail":"today.png 12.3MB"}'
 *
 * 배포: supabase functions deploy notify-telegram --no-verify-jwt
 *
 * 필요한 secrets:
 *   - TELEGRAM_BOT_TOKEN (BotFather가 발급한 봇 HTTP API token)
 *   - TELEGRAM_CHAT_ID (수신자 chat id)
 *   - NOTIFY_SECRET (호출 측 인증용 임의 secret, 강한 랜덤 문자열)
 */

const ICONS: Record<string, string> = {
  start: "🟡",
  success: "✅",
  failure: "❌",
  unknown: "❓",
};

const LABELS: Record<string, string> = {
  start: "시작",
  success: "성공",
  failure: "실패",
  unknown: "모름",
};

function kstNow(): string {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const HH = String(d.getUTCHours()).padStart(2, "0");
  const MM = String(d.getUTCMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${HH}:${MM} KST`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const notifySecret = Deno.env.get("NOTIFY_SECRET");
  if (!notifySecret) {
    return new Response("NOTIFY_SECRET not configured", { status: 500 });
  }
  if (req.headers.get("X-Notify-Secret") !== notifySecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    return new Response("TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not configured", { status: 500 });
  }

  let body: { source?: string; status?: string; detail?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const source = String(body.source || "Unknown");
  const status = String(body.status || "unknown");
  const icon = ICONS[status] || ICONS.unknown;
  const label = LABELS[status] || LABELS.unknown;
  const detail = body.detail ? ` — ${String(body.detail).slice(0, 300)}` : "";
  const text = `${icon} [${source}] ${label} (${kstNow()})${detail}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      const t = await res.text();
      return new Response(`telegram ${res.status}: ${t.slice(0, 200)}`, { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(`fetch failed: ${(e as Error).message}`, { status: 502 });
  }
});
