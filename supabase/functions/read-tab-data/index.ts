/**
 * read-tab-data — 클라이언트·발송·발행 워크플로용 read 단일 진입점.
 *
 * 5탭 종목 데이터(tab_data) + main 헤드라인(tab_updates is_archive=false) 한 번에.
 * 응답 크기 작음(~80KB gzip)·캐시 5분으로 RPS 부담 적음.
 *
 * 인증 없음 — public. RLS의 anon SELECT 정책 + service-role-only write 이중 방어.
 *
 * GET https://....supabase.co/functions/v1/read-tab-data
 * 응답:
 * {
 *   "version": "20260514-0710",
 *   "tabs": {
 *     "kr":        { data, META?, BL? },
 *     "stocks":    { ... },
 *     "ai":        { ... },
 *     "commodity": { ... },
 *     "unicorn":   { ... }
 *   },
 *   "updates": {
 *     "kr":        [ { date, summary, changes, raw }, ... ],  // 최신 5건
 *     ...
 *   }
 * }
 *
 * archive(mentions 깊이 30일)는 별도 read-tab-archive로 lazy fetch.
 *
 * 배포: supabase functions deploy read-tab-data --no-verify-jwt
 */

const TABS = ["kr", "stocks", "ai", "commodity", "unicorn"];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const secretKey = Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY") ?? "";
  if (!supabaseUrl || !secretKey) {
    return new Response("Supabase env missing", { status: 500 });
  }

  // tab_data 5탭 + tab_updates main (is_archive=false) 5건씩 병렬 fetch
  const headers = {
    "apikey": secretKey,
    "Authorization": `Bearer ${secretKey}`,
    "Accept": "application/json",
  };

  try {
    const [dataRes, updRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/tab_data?select=tab_id,payload,version,updated_at`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/tab_updates?is_archive=eq.false&select=tab_id,entry_date,summary,changes,raw,id&order=tab_id.asc,entry_date.desc,id.desc`, { headers }),
    ]);
    if (!dataRes.ok) {
      return new Response(`tab_data ${dataRes.status}`, { status: 502 });
    }
    if (!updRes.ok) {
      return new Response(`tab_updates ${updRes.status}`, { status: 502 });
    }
    const dataRows = await dataRes.json();
    const updRows = await updRes.json();

    const tabs: Record<string, unknown> = {};
    const updates: Record<string, unknown[]> = {};
    let version = "unknown";
    for (const tab of TABS) {
      tabs[tab] = null;
      updates[tab] = [];
    }
    for (const row of dataRows) {
      tabs[row.tab_id] = row.payload;
      version = row.version || version;  // 가장 최신 version 사용 (모든 탭 같은 값이라 OK)
    }
    for (const row of updRows) {
      const arr = updates[row.tab_id];
      if (arr && arr.length < 5) {
        arr.push(row.raw); // raw entry 그대로 (date·summary·changes·entries 등 원형)
      }
    }

    const body = JSON.stringify({ version, tabs, updates });
    return new Response(body, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        // Cloudflare·브라우저 CDN: 5분 캐시 + stale-while-revalidate
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    return new Response(`fetch failed: ${(e as Error).message}`, { status: 502 });
  }
});
