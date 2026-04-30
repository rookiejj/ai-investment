/**
 * 솔라피 발송 결과 Webhook 수신기
 *
 * 솔라피가 발송 결과 확정 시 본 엔드포인트로 POST 전송.
 * 인증: 쿼리 파라미터 ?s=<SOLAPI_WEBHOOK_SECRET>
 *
 * 동작:
 *   1) send_logs의 매칭 레코드 업데이트 (status, provider_message, provider_msg_id)
 *   2) subscribers.delivery_state 재계산·갱신
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

function deriveDeliveryState(msg: string | null | undefined, code?: string): string {
  const combined = `${code ?? ""} ${msg ?? ""}`.toLowerCase();
  if (!combined.trim()) return "unknown";
  // SOLAPI/카카오 결과 코드 우선 매칭
  if (/\b3050\b/.test(combined) || combined.includes("72시간") || combined.includes("미사용")) return "not_friend";
  if (/\b3120\b/.test(combined)) return "paused_ad";          // 광고성 메시지 수신 거부
  if (/\b(3130|3140|3160)\b/.test(combined)) return "blocked";
  // 텍스트 폴백
  if (combined.includes("friend") || combined.includes("친구")) return "not_friend";
  if (combined.includes("block") || combined.includes("차단")) return "blocked";
  if (combined.includes("광고") || combined.includes("수신거부") || combined.includes("ad_") || combined.includes("marketing")) return "paused_ad";
  return "unknown";
}

function isSuccess(code: string, msg: string): boolean {
  if (!code) return false;
  // 솔라피 성공 코드: 4000 혹은 API별로 다름. msg에 '성공'도 허용.
  if (code === "4000" || code === "0000") return true;
  if (/success|성공/i.test(msg)) return true;
  return false;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("s") ?? req.headers.get("x-webhook-secret");
    if (!secret || secret !== Deno.env.get("SOLAPI_WEBHOOK_SECRET")) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    // 솔라피는 단일 객체 또는 배열로 전송. 둘 다 지원.
    const events: Array<Record<string, unknown>> = Array.isArray(body)
      ? body
      : Array.isArray((body as Record<string, unknown>).messages)
        ? (body as { messages: Array<Record<string, unknown>> }).messages
        : [body];

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SECRET_KEY")!,
    );

    let processed = 0;
    for (const e of events) {
      const phone = String(e.to ?? e.receiver ?? e.receiverPhone ?? e.phone ?? "").replace(/[^0-9]/g, "");
      if (!phone) continue;
      const code = String(e.statusCode ?? e.status ?? e.resultCode ?? "");
      const msg = String(e.statusMessage ?? e.message ?? e.resultMessage ?? "");
      const groupId = e.groupId ? String(e.groupId) : null;
      const messageId = e.messageId ? String(e.messageId) : null;
      const delivered = isSuccess(code, msg);
      const finalStatus = delivered ? "success" : "fail";
      const deliveryState = delivered ? "ok" : deriveDeliveryState(msg, code);
      const providerMsg = `${code}${code && msg ? ": " : ""}${msg}`.slice(0, 400);

      // send_logs: 동일 groupId + phone 최신 1건
      let logQuery = supabase
        .from("send_logs")
        .select("id")
        .eq("phone", phone)
        .order("sent_at", { ascending: false })
        .limit(1);
      if (groupId) logQuery = logQuery.eq("provider_code", groupId);
      const { data: logRow } = await logQuery.maybeSingle();
      if (logRow?.id) {
        await supabase.from("send_logs").update({
          status: finalStatus,
          provider_message: providerMsg,
          provider_msg_id: messageId ?? groupId,
        }).eq("id", logRow.id);
      }

      // subscribers.delivery_state 갱신 — unknown은 분류 모호 시 기존 상태 유지
      if (deliveryState !== "unknown") {
        await supabase.from("subscribers").update({ delivery_state: deliveryState })
          .eq("phone", phone);
      }

      processed++;
    }

    return Response.json({ ok: true, processed });
  } catch (err) {
    console.error("[solapi-webhook]", err);
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
});
