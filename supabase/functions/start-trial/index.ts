/**
 * 7일 무료 체험 활성화 Edge Function
 *
 * payment-confirm 과 형제 — PortOne 검증 없이 트라이얼 슬롯만 발급.
 * 번호당 1회 제한 (subscribers.trial_used_at).
 *
 * POST body: { phone, ad_consent }
 * 응답:
 *   { ok: true, status: "registered", paid_until: "ISO8601", alimtalk_sent: boolean }
 *   { ok: false, error: "..." }
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const TRIAL_DAYS = 7;
const SHOP_NAME = "브리픽";
const TRIAL_PRODUCT_NAME = "7일 무료 체험";

// 알림톡은 결제완료 템플릿(UH_6779)을 재활용.
// "결제가 완료되었습니다" 문구는 무료 체험에도 통용되도록 productName="7일 무료 체험"으로 치환.
// 별도 템플릿 승인이 떨어지면 분리할 것 — 현재는 즉시 배포 우선.
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

async function sendTrialAlimtalk(opts: {
  phone: string;
  expiryDate: string;
}): Promise<{ ok: boolean; mid?: string; error?: string }> {
  const proxyUrl    = Deno.env.get("ALIGO_PROXY_ALIMTALK_URL");
  const proxySecret = Deno.env.get("ALIGO_PROXY_SECRET");
  const tplCode     = Deno.env.get("ALIGO_PAYMENT_TPL_CODE");
  if (!proxyUrl || !proxySecret || !tplCode) {
    return { ok: false, error: "aligo proxy env missing" };
  }
  const message = PAYMENT_TEMPLATE_BODY
    .replace("#{상점명}", SHOP_NAME)
    .replace("#{상품명}", TRIAL_PRODUCT_NAME)
    .replace("#{만료일}", opts.expiryDate);
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
    const phone     = typeof body.phone === "string" ? body.phone : "";
    const adConsent = body.ad_consent === true;

    if (!adConsent) return json({ ok: false, error: "광고 수신 동의가 필요합니다." }, { status: 400, cors });

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
      .select("id, status, paid_until, trial_used_at, last_payment_id")
      .eq("phone", cleaned)
      .maybeSingle();
    if (selErr) throw selErr;

    // 자격 검증 — check-subscription 과 동일 규칙
    if (existing && (existing.trial_used_at || existing.last_payment_id)) {
      return json({ ok: false, error: "이 번호로는 이미 무료 체험을 사용하셨거나 결제 이력이 있습니다." }, { status: 409, cors });
    }

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const paidUntil = new Date(nowMs + TRIAL_DAYS * 86400000);
    const expiryDate = paidUntil.toISOString().slice(0, 10);

    let subscriberId: string;
    if (existing) {
      const { error: updErr } = await supabase
        .from("subscribers")
        .update({
          status: "active",
          paid_until: paidUntil.toISOString(),
          trial_used_at: nowIso,
          expires_at: null,
          metadata: {
            ad_consent_at: nowIso,
            source: "web-trial",
          },
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      subscriberId = existing.id;
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("subscribers")
        .insert({
          phone: cleaned,
          status: "active",
          paid_until: paidUntil.toISOString(),
          trial_used_at: nowIso,
          metadata: {
            ad_consent_at:       nowIso,
            channel_friended_at: nowIso,
            source:              "web-trial",
          },
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      subscriberId = inserted.id;
    }

    // 안내 알림톡 — 실패해도 트라이얼 자체는 성공 처리
    const alim = await sendTrialAlimtalk({ phone: cleaned, expiryDate });
    await supabase.from("send_logs").insert({
      subscriber_id: subscriberId,
      phone: cleaned,
      message: `7일 무료 체험 시작 알림 (만료일 ${expiryDate})`,
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
      console.error("[start-trial] alimtalk failed:", alim.error);
    }

    return json({
      ok: true,
      status: "registered",
      paid_until: paidUntil.toISOString(),
      alimtalk_sent: alim.ok,
    }, { cors });
  } catch (err) {
    console.error("[start-trial]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
