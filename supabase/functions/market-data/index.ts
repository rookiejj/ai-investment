// market-data — /trading 터미널용 시세 프록시 (프로덕션: Cloudflare Pages + Supabase 경로).
//
// 왜 프록시인가: 브라우저는 Yahoo Finance 를 CORS 로 직접 못 부른다. 서버(Edge Function)가
// 대신 받아 CORS 헤더 붙여 돌려준다. 로컬/Docker 에선 trading/server/server.js 가 동일 역할.
//
// 데이터 출처: Yahoo Finance v8 chart endpoint (공식 무료, 약 15분 지연). 키 불필요.
// quote 도 v8 chart meta 로 구함 — v7 quote 는 crumb/cookie 요구라 회피(stock-prices 와 동일 전략).
//
// 엔드포인트 (GET):
//   ?type=chart&symbol=AAPL&range=1y&interval=1d   → { symbol, currency, meta, candles[], dataState }
//   ?type=quote&symbols=AAPL,MSFT,^GSPC            → { quotes: { SYM: {...} } }
//
// 가짜 데이터 금지 정책: 데이터를 못 구하면 그 심볼은 dataState:"unavailable" 로 표기하고
// 숫자를 채우지 않는다. 프론트가 "데이터 없음" 으로 표시한다.

const YH = "https://query1.finance.yahoo.com/v8/finance/chart";
// ⚠ Yahoo 는 흔한 풀 Chrome UA 를 429 로 차단한다. 짧은 "Mozilla/5.0" 은 통과(실측 2026-06).
const UA = "Mozilla/5.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200, cache = "public, max-age=30, s-maxage=30") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": cache },
  });
}

async function fetchChart(symbol: string, range: string, interval: string) {
  const url = `${YH}/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&includePrePost=false`;
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "*/*", "Accept-Language": "en-US,en;q=0.9" } });
  if (!r.ok) throw new Error(`yahoo ${r.status}`);
  const j = await r.json();
  const res = j?.chart?.result?.[0];
  if (!res) throw new Error("no result");
  return res;
}

function toCandles(res: any) {
  const ts: number[] = res.timestamp || [];
  const q = res.indicators?.quote?.[0] || {};
  const adj = res.indicators?.adjclose?.[0]?.adjclose;
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open?.[i], h = q.high?.[i], l = q.low?.[i], c = q.close?.[i], v = q.volume?.[i];
    if (o == null || c == null || h == null || l == null) continue; // 결손 캔들 스킵 — 가짜로 안 채움
    out.push({ t: ts[i], o, h, l, c, v: v ?? 0, ac: adj?.[i] ?? c });
  }
  return out;
}

async function handleChart(symbol: string, range: string, interval: string) {
  const res = await fetchChart(symbol, range, interval);
  const meta = res.meta || {};
  return {
    symbol: meta.symbol || symbol,
    currency: meta.currency || null,
    exchange: meta.exchangeName || null,
    meta: {
      regularMarketPrice: meta.regularMarketPrice ?? null,
      previousClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
      regularMarketTime: meta.regularMarketTime ?? null,
      marketState: null,
      instrumentType: meta.instrumentType ?? null,
    },
    candles: toCandles(res),
    dataState: "delayed", // Yahoo ~15분 지연
  };
}

async function handleQuote(symbols: string[]) {
  const quotes: Record<string, unknown> = {};
  await Promise.all(symbols.map(async (sym) => {
    try {
      const res = await fetchChart(sym, "5d", "1d");
      const m = res.meta || {};
      const price = m.regularMarketPrice ?? null;
      const prev = m.chartPreviousClose ?? m.previousClose ?? null;
      if (price == null) { quotes[sym] = { dataState: "unavailable" }; return; }
      const change = (prev != null) ? price - prev : null;
      const changePct = (prev != null && prev !== 0) ? (change! / prev) * 100 : null;
      quotes[sym] = {
        price, prevClose: prev, change, changePct,
        currency: m.currency || null,
        time: m.regularMarketTime ?? null,
        dataState: "delayed",
      };
    } catch {
      quotes[sym] = { dataState: "unavailable" };
    }
  }));
  return { quotes };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const u = new URL(req.url);
    const type = u.searchParams.get("type") || "quote";
    if (type === "chart") {
      const symbol = u.searchParams.get("symbol");
      if (!symbol) return json({ error: "symbol required" }, 400);
      const range = u.searchParams.get("range") || "1y";
      const interval = u.searchParams.get("interval") || "1d";
      const data = await handleChart(symbol, range, interval);
      return json(data);
    }
    if (type === "quote") {
      const symbols = (u.searchParams.get("symbols") || "").split(",").map((s) => s.trim()).filter(Boolean);
      if (!symbols.length) return json({ error: "symbols required" }, 400);
      const data = await handleQuote(symbols.slice(0, 40));
      return json(data);
    }
    return json({ error: "unknown type" }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message || e), dataState: "error" }, 502, "no-store");
  }
});
