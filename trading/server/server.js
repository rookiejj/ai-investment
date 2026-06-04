#!/usr/bin/env node
/**
 * trading 로컬/Docker 서버 — 정적 파일 서빙 + 시세 프록시.
 *
 * 의존성 0 (Node 내장 모듈만) — npm install 없이 `node server/server.js` 로 실행.
 * 프로덕션(Cloudflare+Supabase)에선 정적은 Pages, 프록시는 Edge Function(market-data)이 담당.
 * 이 서버는 로컬 개발과 단독 Docker 배포에서 그 둘을 한 프로세스로 합친 것.
 *
 * 라우트:
 *   GET /api/health                         → { ok:true }
 *   GET /api/market-data?type=chart&symbol&range&interval
 *   GET /api/market-data?type=quote&symbols=a,b,c
 *   그 외                                    → trading/ 정적 파일
 *
 * 데이터 출처: Yahoo Finance v8 chart (무료·약 15분 지연·키 불필요).
 * 가짜 데이터 금지: 못 구하면 dataState:"unavailable"/"error" 로 표기, 숫자 안 채움.
 */
'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 8080;
const ROOT = path.resolve(__dirname, '..'); // trading/
const YH_HOSTS = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];
// ⚠ Yahoo 는 흔한 풀 Chrome UA 를 429 로 차단한다. 짧은 'Mozilla/5.0' 은 통과(실측 2026-06).
const UA = 'Mozilla/5.0';
const cache = new Map(); // path -> {ts, data}
const CACHE_TTL = 20000;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.map': 'application/json',
};

function getOnce(host, pathq) {
  return new Promise((resolve, reject) => {
    const req = https.get({ host, path: pathq, headers: {
      'User-Agent': UA, 'Accept': '*/*', 'Accept-Language': 'en-US,en;q=0.9',
    } }, (res) => {
      const code = res.statusCode;
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        if (code < 200 || code >= 300) return reject(Object.assign(new Error('yahoo ' + code), { code }));
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => req.destroy(new Error('timeout')));
  });
}

// 호스트 로테이션 + 429/5xx 재시도 + 단기 캐시
async function yahooJson(pathq) {
  const hit = cache.get(pathq);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;
  let lastErr;
  for (let attempt = 0; attempt < YH_HOSTS.length * 2; attempt++) {
    const host = YH_HOSTS[attempt % YH_HOSTS.length];
    try {
      const data = await getOnce(host, pathq);
      cache.set(pathq, { ts: Date.now(), data });
      return data;
    } catch (e) {
      lastErr = e;
      if (e.code === 429 || (e.code >= 500 && e.code < 600)) { await sleep(250 + attempt * 200); continue; }
      throw e;
    }
  }
  throw lastErr || new Error('yahoo failed');
}

async function fetchChart(symbol, range, interval) {
  const pathq = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&includePrePost=false`;
  const j = await yahooJson(pathq);
  const res = j && j.chart && j.chart.result && j.chart.result[0];
  if (!res) throw new Error('no result');
  return res;
}

function toCandles(res) {
  const ts = res.timestamp || [];
  const q = (res.indicators && res.indicators.quote && res.indicators.quote[0]) || {};
  const adj = res.indicators && res.indicators.adjclose && res.indicators.adjclose[0] && res.indicators.adjclose[0].adjclose;
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open && q.open[i], h = q.high && q.high[i], l = q.low && q.low[i], c = q.close && q.close[i], v = q.volume && q.volume[i];
    if (o == null || c == null || h == null || l == null) continue;
    out.push({ t: ts[i], o, h, l, c, v: v == null ? 0 : v, ac: (adj && adj[i] != null) ? adj[i] : c });
  }
  return out;
}

async function handleChart(p) {
  const res = await fetchChart(p.symbol, p.range || '1y', p.interval || '1d');
  const m = res.meta || {};
  return {
    symbol: m.symbol || p.symbol, currency: m.currency || null, exchange: m.exchangeName || null,
    meta: {
      regularMarketPrice: m.regularMarketPrice != null ? m.regularMarketPrice : null,
      previousClose: m.chartPreviousClose != null ? m.chartPreviousClose : (m.previousClose != null ? m.previousClose : null),
      regularMarketTime: m.regularMarketTime != null ? m.regularMarketTime : null,
      instrumentType: m.instrumentType != null ? m.instrumentType : null,
    },
    candles: toCandles(res), dataState: 'delayed',
  };
}

async function quoteOne(sym) {
  try {
    const res = await fetchChart(sym, '5d', '1d');
    const m = res.meta || {};
    const price = m.regularMarketPrice != null ? m.regularMarketPrice : null;
    const prev = m.chartPreviousClose != null ? m.chartPreviousClose : (m.previousClose != null ? m.previousClose : null);
    if (price == null) return { dataState: 'unavailable' };
    const change = prev != null ? price - prev : null;
    const changePct = (prev != null && prev !== 0) ? (change / prev) * 100 : null;
    return { price, prevClose: prev, change, changePct, currency: m.currency || null, time: m.regularMarketTime != null ? m.regularMarketTime : null, dataState: 'delayed' };
  } catch (e) { return { dataState: 'unavailable' }; }
}

// 동시성 3으로 제한 (Yahoo 429 회피)
async function handleQuote(symbols) {
  const quotes = {};
  const queue = symbols.slice();
  const worker = async () => { while (queue.length) { const s = queue.shift(); quotes[s] = await quoteOne(s); } };
  await Promise.all([worker(), worker(), worker()]);
  return { quotes };
}

function sendJson(res, obj, status, cache) {
  res.writeHead(status || 200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': cache || 'public, max-age=30',
  });
  res.end(JSON.stringify(obj));
}

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  // 디렉터리 traversal 방어
  const filePath = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.stat(filePath, (err, st) => {
    let target = filePath;
    if (err || st.isDirectory()) target = path.join(filePath, 'index.html');
    fs.readFile(target, (e, data) => {
      if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found'); }
      const ext = path.extname(target).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = u.pathname;
  if (pathname === '/api/health') return sendJson(res, { ok: true, provider: 'yahoo', note: 'delayed ~15min' });
  if (pathname === '/api/market-data') {
    try {
      const type = u.searchParams.get('type') || 'quote';
      if (type === 'chart') {
        const symbol = u.searchParams.get('symbol');
        if (!symbol) return sendJson(res, { error: 'symbol required' }, 400);
        return sendJson(res, await handleChart({ symbol, range: u.searchParams.get('range'), interval: u.searchParams.get('interval') }));
      }
      if (type === 'quote') {
        const symbols = (u.searchParams.get('symbols') || '').split(',').map(s => s.trim()).filter(Boolean);
        if (!symbols.length) return sendJson(res, { error: 'symbols required' }, 400);
        return sendJson(res, await handleQuote(symbols.slice(0, 40)));
      }
      return sendJson(res, { error: 'unknown type' }, 400);
    } catch (e) {
      return sendJson(res, { error: String(e && e.message || e), dataState: 'error' }, 502, 'no-store');
    }
  }
  return serveStatic(req, res, pathname);
});

server.listen(PORT, () => console.log(`[trading] http://localhost:${PORT}  (static + /api/market-data proxy → Yahoo, ~15min delayed)`));
