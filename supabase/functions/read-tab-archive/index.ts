/**
 * read-tab-archive — 종목 모달 mentions(헤드라인 30일 깊이)용 archive 데이터.
 *
 * read-tab-data는 main 5건만 빠르게. archive(는 30일치 ~수십~수백 건)는 클라이언트가
 * 종목 모달 첫 열기 시 lazy fetch. 응답 크기 ~120KB gzip 정도.
 *
 * GET https://....supabase.co/functions/v1/read-tab-archive
 * 응답:
 * {
 *   "archive": {
 *     "kr":        [ raw entry, ... ],  // entry_date desc, 30일치
 *     ...
 *   }
 * }
 *
 * 배포: supabase functions deploy read-tab-archive --no-verify-jwt
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

  const headers = {
    "apikey": secretKey,
    "Authorization": `Bearer ${secretKey}`,
    "Accept": "application/json",
  };

  try {
    // archive=true 30일치. tab_updates 트리거가 main → archive 회전 자동, 30일 cutoff는
    // trim_tab_updates_archive() 함수로 cron에서 별개 실행. 여기선 단순히 archive 전체 반환.
    const res = await fetch(
      `${supabaseUrl}/rest/v1/tab_updates?is_archive=eq.true&select=tab_id,entry_date,raw&order=tab_id.asc,entry_date.desc`,
      { headers },
    );
    if (!res.ok) {
      return new Response(`tab_updates ${res.status}`, { status: 502 });
    }
    const rows = await res.json();

    const archive: Record<string, unknown[]> = {};
    for (const tab of TABS) archive[tab] = [];
    for (const row of rows) {
      const arr = archive[row.tab_id];
      if (arr) arr.push(row.raw);
    }

    return new Response(JSON.stringify({ archive }), {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (e) {
    return new Response(`fetch failed: ${(e as Error).message}`, { status: 502 });
  }
});
