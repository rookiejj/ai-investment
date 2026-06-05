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
import { pickBonusEvent, recordRedemption } from "../_shared/promo.ts";
import { sendPaymentAlimtalk } from "../_shared/alimtalk.ts";

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

// 보너스 일수는 promo_events 테이블에서 결제 시점에 동적으로 결정.
// 정책 변경/이벤트 추가는 SQL 로 promo_events 에 row 추가 — 코드 변경 불필요.
// 자세한 정책은 _shared/promo.ts 와 CLAUDE.md "프로모 이벤트 운영" 섹션 참조.
// 결제 완료 알림톡 발송은 _shared/alimtalk.ts (payment-webhook 과 공용).

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
      .select("id, status, paid_until, last_payment_id")
      .eq("phone", cleaned)
      .maybeSingle();
    if (selErr) throw selErr;

    // 멱등 가드: 이 paymentId 가 이미 처리됐으면(webhook 등) 재연장 금지.
    // paymentId 는 매 결제 고유(랜덤)라 정상 흐름에선 절대 매칭되지 않음 — 중복 처리만 차단.
    if (existing?.last_payment_id === paymentId) {
      return json({
        ok: true, status: "extended", paid_until: existing.paid_until,
        alimtalk_sent: false, bonus_days: 0, bonus_event: null, first_payment_bonus_days: 0,
        note: "already_processed",
      }, { cors });
    }

    // 적용 가능한 promo 이벤트 1개 결정 (자격 + 미수령, 가장 큰 보너스).
    const userCtx = {
      hadPriorPayment: !!existing?.last_payment_id,
      isReturning:     !!existing && existing.status !== "active",
    };
    const bonusEvent = await pickBonusEvent(supabase, cleaned, userCtx);
    const bonusDays  = bonusEvent?.bonus_days ?? 0;

    let subscriberId: string;
    let status: "registered" | "extended";
    let newPaidUntil: Date;

    function addBonusDays(d: Date, days: number): Date {
      if (!days) return d;
      const r = new Date(d);
      r.setDate(r.getDate() + days);
      return r;
    }

    // 구독 기간은 결제일 기준 1개월 (캘린더 기준, setMonth) + 보너스 일수.
    // "발송 시작"(다음 날 아침) 은 단순 알림 — 만료일 계산의 기준이 아님.
    if (existing) {
      // 기존 만료일이 미래면 그 위에 더하고, 과거면 결제 시점부터
      const baseDate = existing.paid_until && new Date(existing.paid_until).getTime() > nowMs
        ? new Date(existing.paid_until)
        : new Date(nowMs);
      newPaidUntil = addBonusDays(addMonths(baseDate, plan.months), bonusDays);

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
      newPaidUntil = addBonusDays(addMonths(new Date(nowMs), plan.months), bonusDays);
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

    // 보너스 이벤트 적용 기록 — subscriber upsert 후 (subscriber_id 확보 필요)
    if (bonusEvent) {
      await recordRedemption(supabase, bonusEvent, {
        subscriberId,
        phone: cleaned,
        paymentId,
      });
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
    // 만료일은 KST 기준 — toISOString().slice(0,10) 은 UTC 라 KST 자정 직후 1일 차이 발생.
    const expiryDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(newPaidUntil);
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
      bonus_days: bonusDays,
      bonus_event: bonusEvent ? { code: bonusEvent.code, name: bonusEvent.name } : null,
      // 구 클라이언트 호환 (≤2026-05-20)
      first_payment_bonus_days: bonusDays,
    }, { cors });
  } catch (err) {
    console.error("[payment-confirm]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
