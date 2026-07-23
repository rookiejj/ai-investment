#!/usr/bin/env node
/**
 * fetch-earnings-calendar — 우리 유니버스(stocks/kr-stocks-data.js)의 다음 실적일을
 *   Yahoo에서 긁어 data/calendar-events.js 의 autoEarnings 배열로 자동 반영.
 *
 * 왜: 기존 캘린더는 매일 에이전트가 조사 중 눈에 띈 일정을 하나씩 fixed에 넣는 ad-hoc 방식이라
 *   실적 일정이 듬성듬성(오늘 이후 4개 수준). 실적일은 결정론적·사전 공시라 체계적으로 긁는 게 맞다.
 *   시세 스냅샷(snapshot-prices)과 동일 패턴: sandbox는 외부망 차단이라 GitHub Actions 러너가 대행.
 *
 * 격리 설계: 손으로 큐레이션하는 `fixed`(섹션 주석 포함)는 절대 안 건드린다.
 *   기계 관리분은 `const autoEarnings = [...]` 별도 배열. calendarEvents가 fixed.concat(autoEarnings).
 *   재실행 멱등 — autoEarnings 블록만 통째 교체.
 *
 * 사용: node scripts/fetch-earnings-calendar.js
 *   env EARNINGS_LIMIT=N (로컬 테스트용, 앞 N개 티커만), EARNINGS_WINDOW_DAYS(기본 45)
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const CAL_FILE = path.join(DATA_DIR, 'calendar-events.js');
const UA = 'Mozilla/5.0';
const WINDOW_DAYS = Number(process.env.EARNINGS_WINDOW_DAYS || 45);
const LIMIT = process.env.EARNINGS_LIMIT ? Number(process.env.EARNINGS_LIMIT) : 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 유니버스 로드 (nm + tk) ───────────────────────────────
function loadUniverse(file, market) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const data = new Function(src + ';return typeof data!=="undefined"?data:[];')();
  const out = [];
  for (const cat of data) for (const s of (cat.stocks || [])) {
    if (s.tk && s.nm) out.push({ tk: String(s.tk), nm: s.nm, market });
  }
  // 중복 티커 제거 (dual-list)
  const seen = new Set();
  return out.filter((s) => (seen.has(s.tk) ? false : seen.add(s.tk)));
}

// ── Yahoo 쿠키+crumb (quoteSummary 인증) ──────────────────
async function getYahooAuth() {
  const r = await fetch('https://fc.yahoo.com', { headers: { 'User-Agent': UA } });
  const cookies = (r.headers.getSetCookie ? r.headers.getSetCookie() : [])
    .map((c) => c.split(';')[0]).join('; ');
  const cr = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
    headers: { 'User-Agent': UA, 'Cookie': cookies },
  });
  const crumb = await cr.text();
  if (!crumb || crumb.length > 30 || crumb.includes('<')) throw new Error('crumb 획득 실패');
  return { cookies, crumb };
}

// KR 6자리 → Yahoo 심볼 후보 (.KS 코스피 우선, .KQ 코스닥 폴백)
function yahooSymbols(s) {
  if (s.market === 'kr') return [`${s.tk}.KS`, `${s.tk}.KQ`];
  return [s.tk];
}

async function fetchEarnings(sym, auth) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(sym)}?modules=calendarEvents&crumb=${encodeURIComponent(auth.crumb)}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Cookie': auth.cookies } });
  if (!r.ok) return null;
  const j = await r.json();
  const e = j?.quoteSummary?.result?.[0]?.calendarEvents?.earnings;
  const raw = e?.earningsDate?.[0]?.raw;
  if (!raw) return null;
  const isEstimate = !!e?.earningsDateIsEstimate || (e?.earningsDate?.length > 1);
  return { date: new Date(raw * 1000).toISOString().slice(0, 10), isEstimate };
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + WINDOW_DAYS * 86400000).toISOString().slice(0, 10);

  let universe = [...loadUniverse('stocks-data.js', 'us'), ...loadUniverse('kr-stocks-data.js', 'kr')];
  if (LIMIT) universe = universe.slice(0, LIMIT);
  console.log(`[earnings] 유니버스 ${universe.length}종목 · 윈도우 ${today}~${maxDate}`);

  const auth = await getYahooAuth();
  console.log(`[earnings] Yahoo crumb 획득 (${auth.crumb.length}자)`);

  const entries = [];
  let ok = 0, miss = 0;
  const CONC = 4;
  for (let i = 0; i < universe.length; i += CONC) {
    const batch = universe.slice(i, i + CONC);
    await Promise.all(batch.map(async (s) => {
      let found = null;
      for (const sym of yahooSymbols(s)) {
        try { found = await fetchEarnings(sym, auth); } catch { found = null; }
        if (found) break;
      }
      if (!found) { miss++; return; }
      if (found.date < today || found.date > maxDate) { return; } // 윈도우 밖
      ok++;
      entries.push({
        cat: 'earnings',
        impact: 2,
        title: `${s.nm} 실적`,
        date: found.date,
        desc: found.isEstimate ? '실적 발표 예정 (잠정)' : '실적 발표 예정',
        tickers: [s.tk],
        src: 'auto-earnings',
      });
    }));
    await sleep(250); // Yahoo 스로틀 회피
  }

  entries.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  console.log(`[earnings] 수집 완료: 윈도우 내 ${entries.length}건 (조회성공 ${ok}·미제공 ${miss})`);

  writeAutoEarnings(entries);
  console.log(`[earnings] calendar-events.js autoEarnings 반영 (${entries.length}건)`);
}

// ── calendar-events.js에 autoEarnings 블록 주입 (멱등) ─────
function writeAutoEarnings(entries) {
  let src = fs.readFileSync(CAL_FILE, 'utf8');
  // 1) 기존 autoEarnings 블록 제거
  src = src.replace(/\n\/\/ === AUTO-EARNINGS[\s\S]*?const autoEarnings = \[[\s\S]*?\];\n/, '\n');
  // 2) calendarEvents 라인을 concat 형태로 통일
  src = src.replace(
    /const calendarEvents = \{[^}]*\};?/,
    'const calendarEvents = { recurring, fixed: fixed.concat(typeof autoEarnings !== "undefined" ? autoEarnings : []) };'
  );
  // 3) autoEarnings 블록을 calendarEvents 라인 직전에 삽입
  const block = [
    '',
    '// === AUTO-EARNINGS (scripts/fetch-earnings-calendar.js 자동 생성 — 손대지 말 것) ===',
    'const autoEarnings = ' + JSON.stringify(entries, null, 2) + ';',
    '',
  ].join('\n');
  src = src.replace(/const calendarEvents = /, block + 'const calendarEvents = ');
  fs.writeFileSync(CAL_FILE, src);
}

main().catch((e) => { console.error('[earnings] fail:', e.message); process.exit(1); });
