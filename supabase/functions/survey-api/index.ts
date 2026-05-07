/**
 * 설문 API Edge Function
 *
 * 공개 액션 (token 불필요):
 *   action='get'      → { id }                           → { ok, survey } | { error: 'not_found'|'inactive' }
 *   action='submit'   → { id, selected_index }           → { ok } | { error: 'duplicate'|... }
 *
 * 관리자 액션 (token 필수, admin-api와 동일 검증):
 *   action='list'     → { token }                        → { rows: [...with response_count] }
 *   action='create'   → { token, title, question, options } → { ok, id } — id는 YYYYMM-NN 자동
 *   action='update'   → { token, id, title?, question?, options?, active? } → { ok }
 *                       (응답이 1건+ 있으면 options 변경 차단)
 *   action='delete'   → { token, id }                    → { ok } — 응답까지 cascade 삭제
 *   action='results'  → { token, id }                    → { survey, counts: [int...], total }
 *
 * 인증·token 검증은 admin-api와 동일한 ADMIN_SESSION_SECRET 사용.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization",
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

// admin-api와 동일한 토큰 검증 (HMAC of expiry timestamp)
async function hmacHex(key: string, data: string): Promise<string> {
  const k = new TextEncoder().encode(key);
  const d = new TextEncoder().encode(data);
  const ck = await crypto.subtle.importKey("raw", k, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", ck, d);
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyToken(token: string, secret: string): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [expStr, sig] = token.split(".");
  const exp = parseInt(expStr, 10);
  if (!exp || Date.now() > exp) return false;
  const expected = (await hmacHex(secret, expStr)).slice(0, 32);
  return expected === sig;
}

// 클라이언트 IP 추출 — Edge proxy 헤더 우선
function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${ip}:${salt}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 이번 달(KST) YYYYMM
function thisMonthKST(): string {
  const now = new Date(Date.now() + 9 * 3600 * 1000);
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

// deno-lint-ignore no-explicit-any
async function nextSurveyId(supabase: any): Promise<string> {
  const yyyymm = thisMonthKST();
  const { data } = await supabase
    .from("surveys")
    .select("id")
    .like("id", `${yyyymm}-%`)
    .order("id", { ascending: false })
    .limit(1);
  const last = data?.[0]?.id as string | undefined;
  const lastSeq = last ? parseInt(last.slice(-2), 10) || 0 : 0;
  return `${yyyymm}-${String(lastSeq + 1).padStart(2, "0")}`;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") ?? "";
  const cors = corsHeaders(origin);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method not allowed" }, { status: 405, cors });

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");
    const sessionSecret = Deno.env.get("ADMIN_SESSION_SECRET") ?? "";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );

    // ─── 공개: get ─── 설문 조회 (active=true만 노출)
    if (action === "get") {
      const id = String(body.id ?? "").trim();
      if (!id) return json({ ok: false, error: "id required" }, { status: 400, cors });
      const { data, error } = await supabase
        .from("surveys")
        .select("id, title, question, options, active")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return json({ ok: false, error: "not_found" }, { status: 404, cors });
      if (!data.active) return json({ ok: false, error: "inactive" }, { status: 410, cors });
      return json({ ok: true, survey: data }, { cors });
    }

    // ─── 공개: submit ─── 응답 제출 (IP 해시로 중복 차단)
    if (action === "submit") {
      const id = String(body.id ?? "").trim();
      const idx = Number(body.selected_index);
      if (!id || !Number.isInteger(idx) || idx < 0) {
        return json({ ok: false, error: "invalid input" }, { status: 400, cors });
      }
      // 설문 존재·활성 확인 + options 길이 체크
      const { data: survey, error: sErr } = await supabase
        .from("surveys")
        .select("id, options, active")
        .eq("id", id)
        .maybeSingle();
      if (sErr) throw sErr;
      if (!survey) return json({ ok: false, error: "not_found" }, { status: 404, cors });
      if (!survey.active) return json({ ok: false, error: "inactive" }, { status: 410, cors });
      const opts = Array.isArray(survey.options) ? survey.options : [];
      if (idx >= opts.length) return json({ ok: false, error: "out of range" }, { status: 400, cors });

      const ip = clientIp(req);
      const ipHash = ip !== "unknown" && sessionSecret ? await hashIp(ip, sessionSecret) : null;
      const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);

      const { error: insErr } = await supabase.from("survey_responses").insert({
        survey_id: id,
        selected_index: idx,
        ip_hash: ipHash,
        user_agent: ua,
      });
      if (insErr) {
        // unique 제약 위반 = 중복 응답
        if (insErr.code === "23505") return json({ ok: false, error: "duplicate" }, { status: 409, cors });
        throw insErr;
      }
      return json({ ok: true }, { cors });
    }

    // ─── 이하 관리자 액션: token 필수 ───
    const token = String(body.token ?? "");
    if (!sessionSecret || !(await verifyToken(token, sessionSecret))) {
      return json({ ok: false, error: "unauthorized" }, { status: 401, cors });
    }

    if (action === "list") {
      const { data: surveys, error } = await supabase
        .from("surveys")
        .select("id, title, question, options, active, created_at, updated_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // 응답 수 집계
      const ids = (surveys ?? []).map((s) => s.id);
      const counts: Record<string, number> = {};
      if (ids.length) {
        const { data: rs } = await supabase
          .from("survey_responses")
          .select("survey_id")
          .in("survey_id", ids);
        for (const r of rs ?? []) counts[(r as { survey_id: string }).survey_id] = (counts[(r as { survey_id: string }).survey_id] ?? 0) + 1;
      }
      const rows = (surveys ?? []).map((s) => ({ ...s, response_count: counts[s.id] ?? 0 }));
      return json({ ok: true, rows }, { cors });
    }

    if (action === "create") {
      const title = String(body.title ?? "").trim();
      // question 필드는 더 이상 별도 입력 받지 않음 — title이 곧 질문 (DB 호환 위해 동일 값 저장)
      const question = typeof body.question === "string" && body.question.trim() ? body.question.trim() : title;
      const options = Array.isArray(body.options) ? body.options.map((o: unknown) => String(o)).filter((s: string) => s.trim()) : [];
      if (!title || options.length < 2) {
        return json({ ok: false, error: "title, options(>=2) required" }, { status: 400, cors });
      }
      const id = await nextSurveyId(supabase);
      const { error } = await supabase.from("surveys").insert({ id, title, question, options, active: true });
      if (error) throw error;
      return json({ ok: true, id }, { cors });
    }

    if (action === "update") {
      const id = String(body.id ?? "").trim();
      if (!id) return json({ ok: false, error: "id required" }, { status: 400, cors });

      const patch: Record<string, unknown> = {};
      if (typeof body.title === "string") {
        patch.title = body.title.trim();
        // title 변경 시 question도 동일하게 sync (UI는 title만 받음)
        patch.question = body.title.trim();
      }
      if (typeof body.question === "string") patch.question = body.question.trim();
      if (typeof body.active === "boolean") patch.active = body.active;
      if (Array.isArray(body.options)) {
        // 옵션 변경은 응답 0건일 때만 허용
        const { count } = await supabase
          .from("survey_responses")
          .select("id", { count: "exact", head: true })
          .eq("survey_id", id);
        if ((count ?? 0) > 0) {
          return json({ ok: false, error: "options locked — responses already exist" }, { status: 409, cors });
        }
        const opts = body.options.map((o: unknown) => String(o)).filter((s: string) => s.trim());
        if (opts.length < 2) return json({ ok: false, error: "options(>=2) required" }, { status: 400, cors });
        patch.options = opts;
      }
      if (Object.keys(patch).length === 0) {
        return json({ ok: false, error: "nothing to update" }, { status: 400, cors });
      }
      const { error } = await supabase.from("surveys").update(patch).eq("id", id);
      if (error) throw error;
      return json({ ok: true }, { cors });
    }

    if (action === "delete") {
      const id = String(body.id ?? "").trim();
      if (!id) return json({ ok: false, error: "id required" }, { status: 400, cors });
      const { error } = await supabase.from("surveys").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true }, { cors });
    }

    if (action === "results") {
      const id = String(body.id ?? "").trim();
      if (!id) return json({ ok: false, error: "id required" }, { status: 400, cors });
      const { data: survey, error: sErr } = await supabase
        .from("surveys")
        .select("id, title, question, options, active, created_at")
        .eq("id", id)
        .maybeSingle();
      if (sErr) throw sErr;
      if (!survey) return json({ ok: false, error: "not_found" }, { status: 404, cors });
      const opts = Array.isArray(survey.options) ? survey.options : [];
      const counts = new Array(opts.length).fill(0);
      const { data: rs } = await supabase
        .from("survey_responses")
        .select("selected_index")
        .eq("survey_id", id);
      for (const r of rs ?? []) {
        const idx = (r as { selected_index: number }).selected_index;
        if (idx >= 0 && idx < counts.length) counts[idx]++;
      }
      const total = counts.reduce((a, b) => a + b, 0);
      return json({ ok: true, survey, counts, total }, { cors });
    }

    return json({ ok: false, error: "unknown action" }, { status: 400, cors });
  } catch (err) {
    console.error("[survey-api]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, { status: 500, cors });
  }
});
