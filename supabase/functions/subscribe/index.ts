/**
 * 브리픽 구독 Edge Function
 *
 * 웹 구독 폼에서 호출. 전화번호·이름·광고 수신 동의를 받아 subscribers 테이블에 upsert.
 *
 * POST body:
 *   { phone: "01012345678", name?: "홍길동", ad_consent: true, honeypot?: "" }
 *
 * 응답:
 *   { ok: true, status: "registered" | "reactivated" | "already_subscribed" }
 *   { ok: false, error: string }
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

// 공개 구독 엔드포인트. 오용 방어는 phone 검증·honeypot·upsert 멱등성으로 커버.
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

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "method not allowed" }, { status: 405, cors });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const phone     = typeof body.phone === "string" ? body.phone : "";
    const name      = typeof body.name === "string" ? body.name.trim() : "";
    const adConsent = body.ad_consent === true;
    const honeypot  = typeof body.honeypot === "string" ? body.honeypot : "";

    // 봇 방지: honeypot 필드가 채워지면 성공 응답만 돌려 조용히 무시
    if (honeypot) {
      return json({ ok: true, status: "registered" }, { cors });
    }

    if (!adConsent) {
      return json({ ok: false, error: "광고 수신 동의가 필요합니다." }, { status: 400, cors });
    }

    const cleaned = phone.replace(/[^0-9]/g, "");
    if (!/^01[016789]\d{7,8}$/.test(cleaned)) {
      return json({ ok: false, error: "전화번호 형식이 올바르지 않습니다." }, { status: 400, cors });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing, error: selErr } = await supabase
      .from("subscribers")
      .select("id, status")
      .eq("phone", cleaned)
      .maybeSingle();
    if (selErr) throw selErr;

    const nowIso = new Date().toISOString();

    if (existing) {
      if (existing.status === "active" || existing.status === "paused") {
        return json({ ok: true, status: "already_subscribed" }, { cors });
      }
      // cancelled / expired → 재구독
      const { error: updErr } = await supabase
        .from("subscribers")
        .update({
          status: "active",
          name: name || null,
          expires_at: null,
          metadata: {
            ad_consent_at:   nowIso,
            reactivated_at:  nowIso,
            source:          "web",
          },
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      return json({ ok: true, status: "reactivated" }, { cors });
    }

    const { error: insErr } = await supabase.from("subscribers").insert({
      phone: cleaned,
      name: name || null,
      metadata: {
        ad_consent_at:       nowIso,
        channel_friended_at: nowIso,
        source:              "web",
      },
    });
    if (insErr) throw insErr;

    return json({ ok: true, status: "registered" }, { cors });
  } catch (err) {
    console.error("[subscribe]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
