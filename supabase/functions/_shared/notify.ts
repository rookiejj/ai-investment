/**
 * notify-telegram 공통 호출 helper.
 *
 * Edge Function 진입·종료 시 호출. best-effort — 알림 실패가 본 작업 망치지 않게 silent.
 *
 * 호출 예:
 *   await notify("Daily Send", "start");
 *   await notify("Daily Send", "success", `${count}명 발송`);
 *   await notify("Daily Send", "failure", err.message);
 */
export async function notify(
  source: string,
  status: "start" | "success" | "failure" | "unknown",
  detail?: string,
): Promise<void> {
  const url = Deno.env.get("NOTIFY_URL") ??
    "https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/notify-telegram";
  const secret = Deno.env.get("NOTIFY_SECRET");
  if (!secret) return; // secret 미설정 = 알림 비활성, silent
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Notify-Secret": secret,
      },
      body: JSON.stringify({ source, status, detail }),
    });
  } catch {
    // best-effort, 본 작업에 영향 X
  }
}
