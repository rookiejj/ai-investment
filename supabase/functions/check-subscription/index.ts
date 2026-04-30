/**
 * 구독 상태 조회 Edge Function
 * 결제 전 번호가 이미 구독 중인지 확인해 UI에서 재결제 의사를 받음.
 *
 * POST body: { phone }
 * 응답:
 *   { ok: true, exists: boolean, status: "new"|"active"|"paused"|"expired"|"cancelled",
 *     paid_until: string|null, subscription_active: boolean }
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

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
      Deno.env.get("SUPABASE_SECRET_KEY")!,
    );
    const { data, error } = await supabase
      .from("subscribers")
      .select("status, paid_until")
      .eq("phone", cleaned)
      .maybeSingle();
    if (error) throw error;

    if (!data) {
      return json({ ok: true, exists: false, status: "new", paid_until: null, subscription_active: false }, { cors });
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
    }, { cors });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
