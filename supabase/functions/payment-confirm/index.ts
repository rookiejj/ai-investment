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

// 가격 플랜 — 클라이언트(index.html PRICE_PLANS)와 동기화 필수.
// 갤럭시아 테스트 채널은 실제 청구 안 됨 — 정가로 결제 흐름 검증.
// 라이브 채널 전환 시에도 그대로 정가 적용.
const TEST_MODE = false;
const PRICE_PLANS: Record<string, { months: number; amount: number; testAmount: number; productName: string }> = {
  "1m":  { months: 1,  amount: 2900,  testAmount: 100, productName: "1개월 구독" },
  "6m":  { months: 6,  amount: 13800, testAmount: 100, productName: "6개월 구독" },
  "12m": { months: 12, amount: 22800, testAmount: 100, productName: "12개월 구독" },
};
const DEFAULT_PLAN = "1m";
function planExpectedAmount(key: string): number {
  const p = PRICE_PLANS[key] ?? PRICE_PLANS[DEFAULT_PLAN];
  return TEST_MODE ? p.testAmount : p.amount;
}

const SHOP_NAME    = "브리픽";

// 결제 완료 알림톡 본문 — 알리고 콘솔 등록 템플릿(UH_6779)과 동일한 문구.
// 변수는 #{상점명}·#{상품명}·#{만료일} 자리에 실제 값 치환해 발송.
const PAYMENT_TEMPLATE_BODY =
`안녕하세요! #{상점명} 입니다.

#{상품명} 결제가 완료되었습니다.

내일부터 뉴스를 받아보실 수 있으며, 고객님의 서비스 제공 만료일은 #{만료일} 입니다.

자동 결제가 되지 않는 상품으로, 만료일 전에 재결제가 필요합니다.`;

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

// ═══ 알리고 알림톡 (VPS 프록시 경유) ═══════════════════
// SOLAPI HMAC 인증 코드는 알리고 전환으로 제거.
// 친구톡과 동일하게 동적 IP의 Edge Function이 알리고 IP 화이트리스트를 통과 못 해
// VPS 프록시(briefick.duckdns.org/alimtalk/send)를 경유한다.

async function sendPaymentAlimtalk(opts: {
  phone: string;
  expiryDate: string;   // YYYY-MM-DD
  productName: string;
}): Promise<{ ok: boolean; mid?: string; error?: string }> {
  const proxyUrl    = Deno.env.get("ALIGO_PROXY_ALIMTALK_URL");
  const proxySecret = Deno.env.get("ALIGO_PROXY_SECRET");
  const tplCode     = Deno.env.get("ALIGO_PAYMENT_TPL_CODE");
  if (!proxyUrl || !proxySecret || !tplCode) {
    return { ok: false, error: "aligo proxy env missing (ALIGO_PROXY_ALIMTALK_URL/ALIGO_PROXY_SECRET/ALIGO_PAYMENT_TPL_CODE)" };
  }

  // 등록된 템플릿 본문에 변수 치환 — 알리고는 송신 메시지가 등록 템플릿과 일치해야 통과
  const message = PAYMENT_TEMPLATE_BODY
    .replace("#{상점명}", SHOP_NAME)
    .replace("#{상품명}", opts.productName)
    .replace("#{만료일}", opts.expiryDate);

  // AC(채널추가) 버튼 — 알리고 등록 템플릿(UH_6779)의 버튼 이름과 정확히 일치해야 노출.
  // 공백 한 칸 차이라도 미일치 시 버튼이 사라지므로 등록 그대로 "채널추가" 사용.
  const button = {
    button: [{ name: "채널추가", linkType: "AC", linkTypeName: "채널추가" }],
  };

  try {
    const res = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Proxy-Secret": proxySecret,
      },
      body: JSON.stringify({
        phones: [opts.phone],
        message,
        tpl_code: tplCode,
        button,
      }),
    });
    const j = await res.json();
    if (!res.ok || j.code !== 0) {
      return { ok: false, error: `aligo proxy ${res.status} code=${j.code ?? "?"}: ${j.message ?? JSON.stringify(j).slice(0, 300)}` };
    }
    return { ok: true, mid: j.info?.mid ? String(j.info.mid) : undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
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
    const planKey        = typeof body.plan === "string" && PRICE_PLANS[body.plan] ? body.plan : DEFAULT_PLAN;
    const plan           = PRICE_PLANS[planKey];
    // 클라이언트가 보낸 expected_amount는 참고용. 권위는 서버 PRICE_PLANS.
    const expectedAmount = planExpectedAmount(planKey);

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
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    // 캘린더 기준 월 단위 연장 — Date.setMonth 사용. 30일 단위 단순 곱셈은 6개월=180일로 캘린더와 어긋남.
    function addMonths(date: Date, months: number): Date {
      const d = new Date(date);
      d.setMonth(d.getMonth() + months);
      return d;
    }

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
      // 기존 만료일이 미래면 그 위에 더하고, 과거면 지금부터
      const baseDate = existing.paid_until && new Date(existing.paid_until).getTime() > nowMs
        ? new Date(existing.paid_until)
        : new Date(nowMs);
      newPaidUntil = addMonths(baseDate, plan.months);

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
      newPaidUntil = addMonths(new Date(nowMs), plan.months);
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

    // 5) 결제 완료 알림톡 발송 (실패해도 결제 자체는 성공 처리)
    const expiryDate = newPaidUntil.toISOString().slice(0, 10);
    const alim = await sendPaymentAlimtalk({ phone: cleaned, expiryDate, productName: plan.productName });
    await supabase.from("send_logs").insert({
      subscriber_id: subscriberId,
      phone: cleaned,
      message: `결제 완료 알림 (${plan.productName}, 만료일 ${expiryDate})`,
      char_count: 0,
      status: alim.ok ? "success" : "fail",
      message_type: "alimtalk",
      template_code: "payment_complete",
      provider: "aligo",
      provider_code: alim.mid ?? null,
      provider_message: alim.ok ? "ok" : (alim.error ?? ""),
      provider_msg_id: alim.mid ?? null,
    });
    if (!alim.ok) {
      console.error("[payment-confirm] alimtalk failed:", alim.error);
    }

    return json({
      ok: true,
      status,
      paid_until: newPaidUntil.toISOString(),
      alimtalk_sent: alim.ok,
    }, { cors });
  } catch (err) {
    console.error("[payment-confirm]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
