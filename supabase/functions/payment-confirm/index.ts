/**
 * 포트원 V2 결제 검증 + 구독 등록/연장
 *
 * 클라이언트가 PortOne.requestPayment() 완료 후 paymentId·phone·ad_consent를 POST.
 * 서버에서 포트원 API로 결제 조회·검증 후 subscribers upsert, payments 이력 기록.
 *
 * POST body:
 *   { paymentId, phone, ad_consent, expected_amount }
 *
 * 응답:
 *   { ok: true, status: "registered"|"extended", paid_until: "ISO8601" }
 *   { ok: false, error: "..." }
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const PORTONE_API = "https://api.portone.io";
const EXPECTED_AMOUNT_DEFAULT = 100;        // 월 구독 상품 가격 (원)
const MONTH_DAYS = 30;                       // 1개월 = 30일로 단순 계산

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
  if (req.method !== "POST") {
    return json({ ok: false, error: "method not allowed" }, { status: 405, cors });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const paymentId      = typeof body.paymentId === "string" ? body.paymentId : "";
    const phone          = typeof body.phone === "string" ? body.phone : "";
    const adConsent      = body.ad_consent === true;
    const expectedAmount = typeof body.expected_amount === "number"
      ? body.expected_amount
      : EXPECTED_AMOUNT_DEFAULT;

    if (!paymentId) return json({ ok: false, error: "paymentId 누락" }, { status: 400, cors });
    if (!adConsent) return json({ ok: false, error: "광고 수신 동의가 필요합니다." }, { status: 400, cors });

    const cleaned = phone.replace(/[^0-9]/g, "");
    if (!/^01[016789]\d{7,8}$/.test(cleaned)) {
      return json({ ok: false, error: "전화번호 형식이 올바르지 않습니다." }, { status: 400, cors });
    }

    // 1) 포트원 결제 조회
    const apiSecret = Deno.env.get("PORTONE_API_SECRET");
    if (!apiSecret) return json({ ok: false, error: "server misconfigured" }, { status: 500, cors });

    const pRes = await fetch(`${PORTONE_API}/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `PortOne ${apiSecret}` },
    });
    if (!pRes.ok) {
      const text = await pRes.text();
      return json({ ok: false, error: `portone fetch ${pRes.status}: ${text.slice(0, 200)}` },
        { status: 502, cors });
    }
    const payment = await pRes.json();

    // 2) 결제 검증
    if (payment.status !== "PAID") {
      return json({ ok: false, error: `결제가 완료되지 않았습니다 (status=${payment.status})` },
        { status: 400, cors });
    }
    const paidAmount = payment.amount?.total ?? 0;
    if (paidAmount < expectedAmount) {
      return json({ ok: false, error: `결제 금액 불일치 (expected=${expectedAmount}, paid=${paidAmount})` },
        { status: 400, cors });
    }

    // 3) 구독 등록/연장
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const nowMs = Date.now();
    const extendMs = MONTH_DAYS * 24 * 3600 * 1000;
    const nowIso = new Date(nowMs).toISOString();

    const { data: existing, error: selErr } = await supabase
      .from("subscribers")
      .select("id, status, paid_until")
      .eq("phone", cleaned)
      .maybeSingle();
    if (selErr) throw selErr;

    let subscriberId: string;
    let status: "registered" | "extended";
    let newPaidUntil: Date;

    if (existing) {
      // 기존 만료일이 미래면 그 위에 더하고, 과거면 지금부터 1개월
      const base = existing.paid_until && new Date(existing.paid_until).getTime() > nowMs
        ? new Date(existing.paid_until).getTime()
        : nowMs;
      newPaidUntil = new Date(base + extendMs);

      const { error: updErr } = await supabase
        .from("subscribers")
        .update({
          status: "active",
          paid_until: newPaidUntil.toISOString(),
          last_payment_id: paymentId,
          payment_provider: "portone",
          expires_at: null,
          metadata: {
            ad_consent_at: nowIso,
            source: "web-paid",
          },
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      subscriberId = existing.id;
      status = "extended";
    } else {
      newPaidUntil = new Date(nowMs + extendMs);
      const { data: inserted, error: insErr } = await supabase
        .from("subscribers")
        .insert({
          phone: cleaned,
          status: "active",
          paid_until: newPaidUntil.toISOString(),
          last_payment_id: paymentId,
          payment_provider: "portone",
          metadata: {
            ad_consent_at:       nowIso,
            channel_friended_at: nowIso,
            source:              "web-paid",
          },
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      subscriberId = inserted.id;
      status = "registered";
    }

    // 4) 결제 이력
    await supabase.from("payments").insert({
      subscriber_id: subscriberId,
      payment_id: paymentId,
      provider: "portone",
      amount: paidAmount,
      currency: payment.currency ?? "KRW",
      status: "paid",
      order_name: payment.orderName ?? null,
      paid_at: payment.paidAt ?? nowIso,
      raw_response: payment,
    });

    return json({ ok: true, status, paid_until: newPaidUntil.toISOString() }, { cors });
  } catch (err) {
    console.error("[payment-confirm]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
