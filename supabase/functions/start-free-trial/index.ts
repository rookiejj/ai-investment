/**
 * 14일 무료 체험 시작 Edge Function
 *
 * 결제 없이 14일간 브리픽을 이용할 수 있는 무료 체험을 시작합니다.
 * 번호당 1회만 허용 (trial_starts_at IS NOT NULL 이면 거절).
 *
 * POST body: { phone: "01012345678", ad_consent: true }
 * 응답:
 *   { ok: true, status: "trial_started", trial_ends_at: "2026-09-15T..." }
 *   { ok: false, error: string, code?: "already_trialed" | "already_subscribed" }
 */

import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendTrialAlimtalk } from "../_shared/alimtalk.ts";

const TRIAL_DAYS = 14;

function corsHeaders(origin: string): Record<string, string> {
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
    const phone     = typeof body.phone === "string" ? body.phone : "";
    const adConsent = body.ad_consent === true;

    if (!adConsent) {
      return json({ ok: false, error: "광고 수신 동의가 필요합니다." }, { status: 400, cors });
    }
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (!/^01[016789]\d{7,8}$/.test(cleaned)) {
      return json({ ok: false, error: "전화번호 형식이 올바르지 않습니다." }, { status: 400, cors });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );

    const { data: existing, error: selErr } = await supabase
      .from("subscribers")
      .select("id, status, paid_until, trial_starts_at")
      .eq("phone", cleaned)
      .maybeSingle();
    if (selErr) throw selErr;

    // 이미 체험 사용한 번호
    if (existing?.trial_starts_at) {
      return json({ ok: false, error: "이미 무료 체험을 사용하신 번호입니다.", code: "already_trialed" }, { status: 409, cors });
    }

    // 현재 유료 구독 중
    const paidUntilMs = existing?.paid_until ? new Date(existing.paid_until).getTime() : 0;
    if (existing?.status === "active" && paidUntilMs > Date.now()) {
      return json({ ok: false, error: "현재 구독 중인 번호입니다.", code: "already_subscribed" }, { status: 409, cors });
    }

    const nowIso = new Date().toISOString();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
    const trialEndIso = trialEnd.toISOString();

    if (existing) {
      // 기존 만료/취소 구독자 → 체험 활성화
      const { error: updErr } = await supabase
        .from("subscribers")
        .update({
          status: "active",
          paid_until: trialEndIso,
          trial_starts_at: nowIso,
          metadata: {
            ad_consent_at:  nowIso,
            source:         "web-trial",
            reactivated_at: nowIso,
          },
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
    } else {
      // 신규 번호 → 체험 구독자 생성
      const { error: insErr } = await supabase.from("subscribers").insert({
        phone: cleaned,
        status: "active",
        paid_until: trialEndIso,
        trial_starts_at: nowIso,
        metadata: {
          ad_consent_at:       nowIso,
          channel_friended_at: nowIso,
          source:              "web-trial",
        },
      });
      if (insErr) throw insErr;
    }

    // 알림톡 발송 (실패해도 체험 시작은 성공 처리)
    // KST 날짜 → YYYY-MM-DD (UTC+9 보정 후 ISO slice)
    const trialEndsKst = new Date(trialEnd.getTime() + 9 * 60 * 60 * 1000);
    const trialEndsDate = trialEndsKst.toISOString().slice(0, 10);  // "2026-09-15"
    const alimtalkResult = await sendTrialAlimtalk({ phone: cleaned, trialEndsDate });
    if (!alimtalkResult.ok) {
      console.warn("[start-free-trial] alimtalk failed:", alimtalkResult.error);
    }

    return json({ ok: true, status: "trial_started", trial_ends_at: trialEndIso }, { cors });
  } catch (err) {
    console.error("[start-free-trial]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
