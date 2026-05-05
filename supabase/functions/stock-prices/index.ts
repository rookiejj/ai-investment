/**
 * stock-prices — 미국·한국 주식 + 원자재·크립토 시세 (15분 지연)
 *
 *   GET /stock-prices              → Yahoo fetch + Supabase Storage 저장 + JSON 응답
 *
 * 운영 패턴: pg_cron이 매 15분 GET 호출 → Storage `prices/latest.json` 갱신 →
 * 프론트는 Storage public URL에서 정적 fetch (Edge Function 직접 호출 안 함).
 *
 * 데이터 소스: Yahoo Finance v8 chart endpoint (per-symbol, 인증 불요)
 *   - 미국: 그대로 (AAPL, NVDA …)
 *   - 한국: .KS / .KQ 둘 다 시도해 매칭
 *   - 원자재: 선물 심볼 (CL=F WTI · GC=F 금 · HG=F 구리 …)
 *   - 크립토: BTC-USD · ETH-USD …
 *
 * 티커 목록은 배포된 사이트의 data/*.js를 fetch해 추출.
 * 인증 없음 — --no-verify-jwt 배포 필수.
 */

import { createClient } from "supabase";

const SITE_URL = Deno.env.get("BRIEFING_SITE_URL") ?? "https://roysbriefing.vercel.app";
const BUCKET = "prices";
const FILE = "latest.json";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// 원자재·크립토 심볼 매핑 (commodity-data.js의 tk → Yahoo 심볼)
// 일반 통화 심볼은 그대로 못 쓰고 선물·페어 심볼이 따로 있음.
const COMMODITY_YH: Record<string, string> = {
  // 크립토
  "BTC": "BTC-USD",
  "ETH": "ETH-USD",
  "SOL": "SOL-USD",
  "XRP": "XRP-USD",
  // 귀금속
  "GC": "GC=F",   // 금
  "SI": "SI=F",   // 은
  "PL": "PL=F",   // 백금
  "PA": "PA=F",   // 팔라듐
  // 에너지
  "CL": "CL=F",   // WTI
  "BZ": "BZ=F",   // 브렌트
  "NG": "NG=F",   // 천연가스
  "MTF": "MTF=F", // 석탄 (Newcastle, Yahoo 미지원 가능 — null 처리)
  // 산업금속
  "HG": "HG=F",   // 구리
  "ALI": "ALI=F", // 알루미늄
  "NI": "NI=F",   // 니켈
  "TIO": "TIO=F", // 철광석
  // 배터리·농산물 — Yahoo 미지원이 많아 일부만
  // (LITH·COBALT 등은 Yahoo가 안 줌, null로 두면 됨)
};

interface Price {
  price: number;
  prevClose?: number;
  change?: number;
  changePct?: number;
  currency?: string;
  time?: number;
  exchange?: string;
}

async function fetchTickers(): Promise<{ us: string[]; kr: string[]; commodity: string[] }> {
  const grab = async (path: string): Promise<string[]> => {
    const url = `${SITE_URL}${path}?_=${Date.now()}`;
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error(`fetch ${path}: ${r.status}`);
    const text = await r.text();
    const data = new Function(text + ";return data;")() as Array<{ stocks?: Array<{ tk: string }> }>;
    const out: string[] = [];
    for (const cat of data ?? []) for (const s of (cat.stocks ?? [])) if (s.tk) out.push(s.tk);
    return out;
  };
  const [us, kr, commodity] = await Promise.all([
    grab("/data/stocks-data.js"),
    grab("/data/kr-stocks-data.js"),
    grab("/data/commodity-data.js"),
  ]);
  return { us, kr, commodity };
}

async function yahooChartOne(symbol: string): Promise<Price | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, "Accept": "application/json" },
    });
    if (!r.ok) return null;
    const j = await r.json();
    const meta = j?.chart?.result?.[0]?.meta;
    if (!meta || meta.regularMarketPrice == null) return null;
    const price = Number(meta.regularMarketPrice);
    const prev = Number(meta.previousClose ?? meta.chartPreviousClose ?? 0);
    const change = prev > 0 ? price - prev : undefined;
    const changePct = prev > 0 ? ((price - prev) / prev) * 100 : undefined;
    return {
      price,
      prevClose: prev || undefined,
      change,
      changePct,
      currency: meta.currency,
      time: meta.regularMarketTime,
    };
  } catch {
    return null;
  }
}

// 동시성 제어된 batch fetch
async function batchPrices(symbols: string[], concurrency = 16): Promise<Record<string, Price>> {
  const out: Record<string, Price> = {};
  for (let i = 0; i < symbols.length; i += concurrency) {
    const batch = symbols.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (sym) => [sym, await yahooChartOne(sym)] as const),
    );
    for (const [sym, p] of results) {
      if (p) out[sym] = p;
    }
  }
  return out;
}

let _bucketReady = false;
async function ensureBucket(supabase: ReturnType<typeof createClient>) {
  if (_bucketReady) return;
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error && !String(error.message || "").includes("already exists")) {
      throw new Error(`createBucket: ${error.message}`);
    }
  }
  _bucketReady = true;
}

Deno.serve(async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const t0 = Date.now();
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("BRIEFICK_SUPABASE_SECRET_KEY")!,
    );
    await ensureBucket(supabase);
    const { us, kr, commodity } = await fetchTickers();

    // 미국: 그대로
    const usSymbols = us;

    // 한국: .KS와 .KQ 둘 다 query
    const krKsSymbols = kr.map((t) => `${t}.KS`);
    const krKqSymbols = kr.map((t) => `${t}.KQ`);

    // 원자재·크립토: 매핑 테이블 활용 (없으면 skip)
    const comSymbolsMap: Record<string, string> = {};
    for (const tk of commodity) {
      const yh = COMMODITY_YH[tk];
      if (yh) comSymbolsMap[tk] = yh;
    }
    const comSymbols = Object.values(comSymbolsMap);

    const allSymbols = [...usSymbols, ...krKsSymbols, ...krKqSymbols, ...comSymbols];
    const raw = await batchPrices(allSymbols);

    // 결과 매핑: 원래 ticker 기준으로 정리
    const prices: Record<string, Price> = {};

    // 미국
    for (const tk of us) {
      if (raw[tk]) prices[tk] = raw[tk];
    }
    // 한국 — KS 우선, 없으면 KQ
    for (const tk of kr) {
      const ks = raw[`${tk}.KS`];
      const kq = raw[`${tk}.KQ`];
      if (ks?.price != null) prices[tk] = { ...ks, exchange: "KS" };
      else if (kq?.price != null) prices[tk] = { ...kq, exchange: "KQ" };
    }
    // 원자재·크립토 — 원래 tk(BTC, GC 등)로 다시 매핑
    for (const [tk, yh] of Object.entries(comSymbolsMap)) {
      if (raw[yh]) prices[tk] = raw[yh];
    }

    const body = {
      updatedAt: new Date().toISOString(),
      elapsedMs: Date.now() - t0,
      requested: allSymbols.length,
      count: Object.keys(prices).length,
      prices,
    };

    // Storage에 저장 — 프론트는 이 URL을 직접 읽음
    const json = JSON.stringify(body);
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(FILE, new Blob([json], { type: "application/json" }), { upsert: true });
    if (upErr) console.warn("[stock-prices] storage upload failed:", upErr.message);

    return new Response(json, {
      status: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
