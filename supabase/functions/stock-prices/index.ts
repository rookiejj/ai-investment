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
  extended?: boolean;
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

async function yahooChartOne(symbol: string, attempt = 1): Promise<Price | null> {
  // 15분봉 + prePost 포함으로 정규세션 + 프리·애프터마켓 + 24h 자산 모두 커버
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=15m&range=1d&includePrePost=true`;
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, "Accept": "application/json" },
    });
    // 429/5xx — 짧게 대기 후 1회 재시도
    if ((r.status === 429 || r.status >= 500) && attempt === 1) {
      await new Promise((res) => setTimeout(res, 500 + Math.random() * 1000));
      return yahooChartOne(symbol, 2);
    }
    if (!r.ok) return null;
    const j = await r.json();
    const result = j?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) return null;

    // 마지막 non-null bar close = 가장 최신 가격 (프리/정규/애프터 모두 포함)
    const ts: number[] = result?.timestamp ?? [];
    const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
    let lastPrice: number | null = null;
    let lastTime: number | null = null;
    for (let i = closes.length - 1; i >= 0; i--) {
      if (closes[i] != null) {
        lastPrice = Number(closes[i]);
        lastTime = ts[i] ?? null;
        break;
      }
    }

    const regTime = Number(meta.regularMarketTime ?? 0);
    const regPx = Number(meta.regularMarketPrice ?? 0);

    // regularMarket이 마지막 봉보다 최신이면 그쪽 우선 (한국 종목 정규장 직후
    // 15분 봉이 아직 close되지 않아 직전 거래일 종가가 잡히는 케이스 방지).
    // 미국 프리/애프터마켓처럼 regTime 이후 봉이 있으면 lastTime > regTime이라 그대로.
    if (regTime > 0 && regPx > 0 && (lastTime == null || regTime > lastTime)) {
      lastPrice = regPx;
      lastTime = regTime;
    }

    const price = lastPrice;
    if (price == null) {
      // 응답은 왔지만 데이터 비어있음 — 1회 재시도
      if (attempt === 1) {
        await new Promise((res) => setTimeout(res, 300 + Math.random() * 700));
        return yahooChartOne(symbol, 2);
      }
      return null;
    }

    // 정규세션 시각 이후 데이터면 extended hours (프리/애프터마켓)
    const isExtended = lastTime != null && regTime > 0 && lastTime > regTime + 60;

    // baseline 선택:
    //   - 정규세션 중: previousClose (=전일 정규 종가)
    //   - 프리/애프터마켓: regularMarketPrice (=가장 최근 정규세션 종가, 즉 직전 일자 종가)
    // Yahoo API에서 prePost 시간대엔 previousClose가 "그저께" 값이라 baseline 잘못 잡힘.
    const regularPx = Number(meta.regularMarketPrice ?? 0);
    const baseline = isExtended && regularPx > 0
      ? regularPx
      : Number(meta.previousClose ?? meta.chartPreviousClose ?? 0);
    const change = baseline > 0 ? price - baseline : undefined;
    const changePct = baseline > 0 ? ((price - baseline) / baseline) * 100 : undefined;

    return {
      price,
      prevClose: baseline || undefined,
      change,
      changePct,
      currency: meta.currency,
      time: lastTime ?? meta.regularMarketTime,
      ...(isExtended ? { extended: true } : {}),
    } as Price;
  } catch {
    return null;
  }
}

// 동시성 제어된 batch fetch
async function batchPrices(symbols: string[], concurrency = 10): Promise<Record<string, Price>> {
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
    // 한국 — KS·KQ 둘 다 fetch, 더 최신 데이터 쪽 사용
    // Yahoo가 KOSDAQ 종목의 .KS 엔드포인트에 오래된 ghost data를 반환하는 경우 회피
    for (const tk of kr) {
      const ks = raw[`${tk}.KS`];
      const kq = raw[`${tk}.KQ`];
      const ksOk = ks?.price != null;
      const kqOk = kq?.price != null;
      if (ksOk && kqOk) {
        const ksTime = Number(ks.time ?? 0);
        const kqTime = Number(kq.time ?? 0);
        if (kqTime > ksTime) prices[tk] = { ...kq, exchange: "KQ" };
        else prices[tk] = { ...ks, exchange: "KS" };
      } else if (ksOk) {
        prices[tk] = { ...ks, exchange: "KS" };
      } else if (kqOk) {
        prices[tk] = { ...kq, exchange: "KQ" };
      }
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
