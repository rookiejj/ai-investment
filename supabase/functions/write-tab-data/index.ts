/**
 * write-tab-data — 시장별 종목·핀맵 데이터(payload) UPSERT 단일 진입점.
 *
 * sandbox·자동 갱신 워크플로가 호출. 내부에서 service_role(secret key)로
 * tab_data 테이블에 UPSERT. 호출 측은 payload·version·tab_id만 전달.
 *
 * 인증: X-Briefick-Secret 헤더 (BRIEFICK_WRITE_SECRET secret 일치)
 *
 * Body: {
 *   tab_id: 'kr'|'stocks'|'ai'|'commodity'|'unicorn'|'jp',
 *   payload: object,    // *-data.js 변수 묶음 (data, META, BL 등)
 *   version: string,    // "20260514-0710" 등 KST YYYYMMDD-HHmm
 * }
 *
 * 응답: { ok: true, updated_at: "..." } 또는 4xx/5xx + 에러 메시지
 *
 * 배포: supabase functions deploy write-tab-data --no-verify-jwt
 *
 * 필요한 Supabase secrets:
 *   - SUPABASE_URL (Edge 환경에선 자동 주입되기도 함)
 *   - BRIEFICK_SUPABASE_SECRET_KEY (sb_secret_..., RLS bypass용)
 *   - BRIEFICK_WRITE_SECRET (호출 측 인증용 임의 강 문자열)
 */

import { notify } from "../_shared/notify.ts";

const VALID_TABS = new Set(["kr", "stocks", "ai", "commodity", "unicorn", "jp"]);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const writeSecret = Deno.env.get("BRIEFICK_WRITE_SECRET");
  if (!writeSecret) {
    return new Response("BRIEFICK_WRITE_SECRET not configured", { status: 500 });
  }
  if (req.headers.get("X-Briefick-Secret") !== writeSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const secretKey = Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY") ?? "";
  if (!supabaseUrl || !secretKey) {
    return new Response("SUPABASE_URL·BRIEFICK_SUPABASE_SECRET_KEY not configured", { status: 500 });
  }

  let body: { tab_id?: string; payload?: unknown; version?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const tab_id = String(body.tab_id ?? "");
  if (!VALID_TABS.has(tab_id)) {
    return new Response(`invalid tab_id: ${tab_id}`, { status: 400 });
  }
  if (!body.payload || typeof body.payload !== "object") {
    return new Response("payload required (object)", { status: 400 });
  }
  const version = String(body.version ?? "").trim();
  if (!version) {
    return new Response("version required", { status: 400 });
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/tab_data?on_conflict=tab_id`, {
      method: "POST",
      headers: {
        "apikey": secretKey,
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([{
        tab_id,
        payload: body.payload,
        version,
        updated_at: new Date().toISOString(),
      }]),
    });
    if (!res.ok) {
      const t = await res.text();
      await notify("write-tab-data", "failure", `${tab_id} ${res.status}: ${t.slice(0, 200)}`);
      return new Response(`upsert ${res.status}: ${t.slice(0, 300)}`, { status: 502 });
    }
    const rows = await res.json();
    return new Response(JSON.stringify({ ok: true, tab_id, updated_at: rows[0]?.updated_at }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    await notify("write-tab-data", "failure", (e as Error).message.slice(0, 200));
    return new Response(`fetch failed: ${(e as Error).message}`, { status: 502 });
  }
});
