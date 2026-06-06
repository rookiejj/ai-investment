/**
 * 구독 상태 조회 Edge Function
 * 결제 전 번호가 이미 구독 중인지 확인해 UI에서 재결제 의사를 받음.
 *
 * POST body: { phone }
 * 응답:
 *   { ok: true, exists: boolean, status, paid_until, subscription_active,
 *     eligible_events: [{ code, name, bonus_days }],
 *     trial_eligible: boolean   // 구 클라이언트 호환 — eligible_events 비어있지 않으면 true
 *   }
 *
 * eligible_events: 이 번호가 결제 시 받을 수 있는 promo 이벤트 목록.
 *   자세한 정책은 _shared/promo.ts 참조 — 자격 매칭(first_payment/all/returning) +
 *   미수령 필터, 보너스 큰 순 정렬. 클라이언트는 첫 번째 항목을 우선 노출.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";
import { getEligibleEvents } from "../_shared/promo.ts";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body: unknown, init: ResponseInit & { cors: Record<string, string> }) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...init.cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") ?? "";
  const cors = corsHeaders(origin);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method not allowed" }, { status: 405, cors });

  try {
    const body = await req.json().catch(() => ({}));
    const phone = typeof body.phone === "string" ? body.phone : "";
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (!/^01[016789]\d{7,8}$/.test(cleaned)) {
      return json({ ok: false, error: "전화번호 형식이 올바르지 않습니다." }, { status: 400, cors });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );
    const { data, error } = await supabase
      .from("subscribers")
      .select("status, paid_until, last_payment_id")
      .eq("phone", cleaned)
      .maybeSingle();
    if (error) throw error;

    const userCtx = {
      hadPriorPayment: !!data?.last_payment_id,
      isReturning:     !!data && data.status !== "active",
    };
    const eligible = await getEligibleEvents(supabase, cleaned, userCtx);
    const eligibleOut = eligible.map((e) => ({
      code: e.code, name: e.name, bonus_days: e.bonus_days, bonus_months: e.bonus_months ?? 0,
    }));

    if (!data) {
      return json({
        ok: true, exists: false, status: "new", paid_until: null,
        subscription_active: false,
        eligible_events: eligibleOut,
        trial_eligible: eligibleOut.length > 0,  // 구 클라이언트 호환
      }, { cors });
    }

    const now = Date.now();
    const paidUntilMs = data.paid_until ? new Date(data.paid_until).getTime() : 0;
    const subscriptionActive = data.status === "active" && paidUntilMs > now;

    return json({
      ok: true,
      exists: true,
      status: data.status,
      paid_until: data.paid_until,
      subscription_active: subscriptionActive,
      eligible_events: eligibleOut,
      trial_eligible: eligibleOut.length > 0,
    }, { cors });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
