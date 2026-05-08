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

const SITE_URL = Deno.env.get("BRIEFING_SITE_URL") ?? "https://briefick.com";
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
  marketCap?: number;
  name?: string;
}

// Yahoo crumb 인증 — marketCap 가져오는 v7/quote 엔드포인트는 cookie+crumb 필수
let _yahooCookie: string | null = null;
let _yahooCrumb: string | null = null;
async function getYahooAuth(): Promise<{ cookie: string; crumb: string } | null> {
  if (_yahooCookie && _yahooCrumb) {
    return { cookie: _yahooCookie, crumb: _yahooCrumb };
  }
  try {
    // 1) Yahoo 도메인에서 쿠키 발급
    const r1 = await fetch("https://fc.yahoo.com/", {
      headers: { "User-Agent": UA },
    });
    const setCookie = r1.headers.get("set-cookie") || "";
    // Set-Cookie 헤더에서 name=value 부분만 추출 (path=, domain=, expires= 등 attribute 제거)
    const cookieParts: string[] = [];
    for (const part of setCookie.split(/,(?=[^;]+=)/)) {
      const first = part.split(";")[0]?.trim();
      if (first && first.includes("=") && !/^(path|domain|expires|max-age|secure|httponly|samesite)/i.test(first)) {
        cookieParts.push(first);
      }
    }
    const cookie = cookieParts.join("; ");
    if (!cookie) return null;
    // 2) crumb 발급
    const r2 = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
      headers: { "User-Agent": UA, "Cookie": cookie },
    });
    if (!r2.ok) return null;
    const crumb = (await r2.text()).trim();
    if (!crumb) return null;
    _yahooCookie = cookie;
    _yahooCrumb = crumb;
    return { cookie, crumb };
  } catch {
    return null;
  }
}

interface QuoteData {
  marketCap?: number;
  price?: number;
  changePct?: number;
  prevClose?: number;
  time?: number;
  currency?: string;
  name?: string;
  // Extended hours — chart bar가 없어도 quote에서 누적 가격을 줘서 thin 종목 AH 보강
  postMarketPrice?: number;
  postMarketTime?: number;
  postMarketChangePercent?: number;
  preMarketPrice?: number;
  preMarketTime?: number;
  preMarketChangePercent?: number;
}

// v7/finance/quote 엔드포인트로 시총·시세 일괄 fetch (배치 단위)
// 풀 추가 종목은 chart endpoint 호출량 부담을 피하려고 quote에서 시세도 같이 추출
async function fetchQuotes(symbols: string[]): Promise<Record<string, QuoteData>> {
  const auth = await getYahooAuth();
  if (!auth) return {};
  const out: Record<string, QuoteData> = {};
  const BATCH = 50;

  const extract = (q: Record<string, unknown>) => {
    const sym = q.symbol as string | undefined;
    if (!sym) return;
    const data: QuoteData = {};
    if (q.marketCap != null) data.marketCap = Number(q.marketCap);
    if (q.regularMarketPrice != null) data.price = Number(q.regularMarketPrice);
    if (q.regularMarketChangePercent != null) data.changePct = Number(q.regularMarketChangePercent);
    if (q.regularMarketPreviousClose != null) data.prevClose = Number(q.regularMarketPreviousClose);
    if (q.regularMarketTime != null) data.time = Number(q.regularMarketTime);
    if (q.currency != null) data.currency = String(q.currency);
    // 확장 거래 — chart 15분 봉 미생성 thin 종목 AH 보강용
    if (q.postMarketPrice != null) data.postMarketPrice = Number(q.postMarketPrice);
    if (q.postMarketTime != null) data.postMarketTime = Number(q.postMarketTime);
    if (q.postMarketChangePercent != null) data.postMarketChangePercent = Number(q.postMarketChangePercent);
    if (q.preMarketPrice != null) data.preMarketPrice = Number(q.preMarketPrice);
    if (q.preMarketTime != null) data.preMarketTime = Number(q.preMarketTime);
    if (q.preMarketChangePercent != null) data.preMarketChangePercent = Number(q.preMarketChangePercent);
    // 종목명: longName 우선, shortName 폴백 — 풀 추가 종목 사용자 표시용
    const nm = (q.longName || q.shortName) as string | undefined;
    if (nm) data.name = nm;
    out[sym] = data;
  };

  for (let i = 0; i < symbols.length; i += BATCH) {
    const batch = symbols.slice(i, i + BATCH);
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${batch.map(encodeURIComponent).join(",")}&crumb=${encodeURIComponent(auth.crumb)}`;
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, "Cookie": auth.cookie } });
      if (r.status === 401) {
        _yahooCookie = null; _yahooCrumb = null;
        const fresh = await getYahooAuth();
        if (!fresh) return out;
        const r2 = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${batch.map(encodeURIComponent).join(",")}&crumb=${encodeURIComponent(fresh.crumb)}`, {
          headers: { "User-Agent": UA, "Cookie": fresh.cookie },
        });
        if (!r2.ok) continue;
        const j = await r2.json();
        for (const q of (j?.quoteResponse?.result || [])) extract(q);
        continue;
      }
      if (!r.ok) continue;
      const j = await r.json();
      for (const q of (j?.quoteResponse?.result || [])) extract(q);
    } catch { /* skip batch */ }
  }
  return out;
}

// 호환용 wrapper (marketCap만)
async function fetchMarketCaps(symbols: string[]): Promise<Record<string, number>> {
  const q = await fetchQuotes(symbols);
  const out: Record<string, number> = {};
  for (const [sym, d] of Object.entries(q)) {
    if (d.marketCap) out[sym] = d.marketCap;
  }
  return out;
}

async function fetchTickers(): Promise<{ us: string[]; kr: string[]; commodity: string[]; usPool: string[]; krPool: string[] }> {
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
  // sector-pool.js: { stocks: {sector: [tk,...]}, kr: {...} } 객체
  // URL fetch 실패 시 빈 풀로 fallback (다음 cron에서 자동 복구)
  const grabPool = async (): Promise<{ us: string[]; kr: string[] }> => {
    try {
      const url = `${SITE_URL}/data/sector-pool.js?_=${Date.now()}`;
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) return { us: [], kr: [] };
      const text = await r.text();
      const pool = new Function(text + ";return data;")() as { stocks?: Record<string, string[]>; kr?: Record<string, string[]> };
      const us = Array.from(new Set(Object.values(pool.stocks ?? {}).flat()));
      const kr = Array.from(new Set(Object.values(pool.kr ?? {}).flat()));
      return { us, kr };
    } catch {
      return { us: [], kr: [] };
    }
  };
  const [us, kr, commodity, pool] = await Promise.all([
    grab("/data/stocks-data.js"),
    grab("/data/kr-stocks-data.js"),
    grab("/data/commodity-data.js"),
    grabPool(),
  ]);
  return { us, kr, commodity, usPool: pool.us, krPool: pool.kr };
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
    const nowSec = Date.now() / 1000;
    const STALE_SEC = 30 * 60; // 30분 — extended 데이터 freshness 임계

    // regularMarket이 마지막 봉보다 최신이면 그쪽 우선 (한국 종목 정규장 직후
    // 15분 봉이 아직 close되지 않아 직전 거래일 종가가 잡히는 케이스 방지).
    // 미국 프리/애프터마켓처럼 regTime 이후 봉이 있으면 lastTime > regTime이라 그대로.
    if (regTime > 0 && regPx > 0 && (lastTime == null || regTime > lastTime)) {
      lastPrice = regPx;
      lastTime = regTime;
    }

    // 미국 휴장 idle 처리 — 마지막 봉이 extended(정규 종료 후)인데 30분+ 경과면
    // AH/프리 거래 없는 idle 시간대(KST 09:00~17:00 등)로 보고 정규 종가로 fallback.
    // 데이터 timestamp 기준이라 DST·timezone 변동 자동 대응.
    if (regTime > 0 && regPx > 0 && lastTime != null && lastTime > regTime + 60 && lastTime < nowSec - STALE_SEC) {
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
    const { us, kr, commodity, usPool, krPool } = await fetchTickers();

    // 풀(섹터 풀)은 큐레이션 7종목 union 추가 후보로 시총 fetch에 포함.
    // 시세까지 fetch하면 호출량이 두 배로 늘어 부담 — 시세는 큐레이션 종목만,
    // 시총은 큐레이션 + 풀 합쳐서 가져와 핀맵 동적 선별 가능하게.
    const usAll = Array.from(new Set([...us, ...usPool]));
    const krAll = Array.from(new Set([...kr, ...krPool]));

    // 미국: 시세는 큐레이션만, 풀 추가 종목은 시총만
    const usSymbols = us;

    // 한국: .KS와 .KQ 둘 다 query (큐레이션만 시세, 풀 추가는 시총만)
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

    // 시총 일괄 fetch — 큐레이션 + 풀 union (핀맵이 풀에서 시총 상위 7 동적 선별)
    // 한국 풀 종목은 거래소 미정 → .KS와 .KQ 둘 다 시도해 더 큰 쪽 사용
    const mcapSymbols: string[] = [...usAll];
    const mcapToTk: Record<string, string> = {};
    for (const tk of usAll) mcapToTk[tk] = tk;
    // 한국: 큐레이션은 prices에 결정된 거래소, 풀 추가분은 양쪽 시도
    for (const tk of kr) {
      const p = prices[tk];
      const ex = p?.exchange || "KS";
      const sym = `${tk}.${ex}`;
      mcapSymbols.push(sym);
      mcapToTk[sym] = tk;
    }
    const krOnlyPool = krPool.filter((t) => !kr.includes(t));
    for (const tk of krOnlyPool) {
      mcapToTk[`${tk}.KS`] = tk;
      mcapToTk[`${tk}.KQ`] = tk;
      mcapSymbols.push(`${tk}.KS`, `${tk}.KQ`);
    }
    const quotes = await fetchQuotes(mcapSymbols);

    // 풀 종목 시총·시세 처리
    let mcapCount = 0;
    for (const [sym, qd] of Object.entries(quotes)) {
      const tk = mcapToTk[sym];
      if (!tk) continue;
      if (qd.marketCap) {
        if (prices[tk]) {
          // 큐레이션 종목: 같은 종목이 KS·KQ 양쪽에서 잡힐 경우 더 큰 값(정상 거래소) 우선
          const cur = prices[tk].marketCap || 0;
          if (qd.marketCap > cur) prices[tk].marketCap = qd.marketCap;
        } else {
          // 풀 추가 종목: 시세도 quote에서 같이 추출해 prices에 추가
          // 이미 prices[tk]가 있으면 위 분기, 없으면 여기 — 거래소 모호 시 더 큰 시총 쪽 우선
          const cur = prices[tk]?.marketCap || 0;
          if (qd.marketCap > cur) {
            prices[tk] = {
              price: qd.price ?? 0,
              prevClose: qd.prevClose,
              changePct: qd.changePct,
              currency: qd.currency,
              time: qd.time,
              marketCap: qd.marketCap,
              name: qd.name,
              exchange: sym.endsWith(".KS") ? "KS" : (sym.endsWith(".KQ") ? "KQ" : undefined),
            };
          }
        }
        mcapCount++;
      }
    }

    // 미국 종목 AH/PreMarket 보강 — chart 15분 봉 미생성 thin 종목(PL·RDW·ASTS·LUNR 등)이
    // 정규장 종가만 보이던 문제. quote의 postMarketPrice·preMarketPrice는 체결 1건이라도
    // 있으면 누적 가격을 줘서 chart bar 부재 시에도 확장 거래 가격 노출 가능.
    // 단 30분+ 지난 post/pre는 idle stale로 보고 적용 안 함 — chart 측 idle fallback과 일관.
    let extCount = 0;
    const STALE_SEC_AUG = 30 * 60;
    const nowSecAug = Date.now() / 1000;
    for (const tk of usAll) {
      const qd = quotes[tk];
      const px = prices[tk];
      if (!qd || !px) continue;
      const chartTime = Number(px.time ?? 0);
      const postTime = Number(qd.postMarketTime ?? 0);
      const preTime = Number(qd.preMarketTime ?? 0);
      const baseline = Number(qd.price ?? px.prevClose ?? 0);
      const postFresh = postTime > 0 && (nowSecAug - postTime) < STALE_SEC_AUG;
      const preFresh = preTime > 0 && (nowSecAug - preTime) < STALE_SEC_AUG;

      // post 우선 (장 마감 후 가장 신선한 데이터) — fresh 한정
      if (postFresh && postTime > chartTime && qd.postMarketPrice && qd.postMarketPrice > 0 && baseline > 0) {
        const newPx = qd.postMarketPrice;
        const pct = qd.postMarketChangePercent != null
          ? Number(qd.postMarketChangePercent)
          : ((newPx - baseline) / baseline) * 100;
        prices[tk] = {
          ...px,
          price: newPx,
          time: postTime,
          changePct: pct,
          change: (pct / 100) * baseline,
          prevClose: baseline,
          extended: true,
        };
        extCount++;
      } else if (preFresh && preTime > chartTime && qd.preMarketPrice && qd.preMarketPrice > 0 && baseline > 0) {
        const newPx = qd.preMarketPrice;
        const pct = qd.preMarketChangePercent != null
          ? Number(qd.preMarketChangePercent)
          : ((newPx - baseline) / baseline) * 100;
        prices[tk] = {
          ...px,
          price: newPx,
          time: preTime,
          changePct: pct,
          change: (pct / 100) * baseline,
          prevClose: baseline,
          extended: true,
        };
        extCount++;
      }
    }
    console.log(`[ext-hours] ${extCount} US tickers updated with post/pre market price`);

    const body = {
      updatedAt: new Date().toISOString(),
      elapsedMs: Date.now() - t0,
      requested: allSymbols.length,
      count: Object.keys(prices).length,
      mcapCount,
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
