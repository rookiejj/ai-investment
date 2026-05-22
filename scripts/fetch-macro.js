#!/usr/bin/env node
/**
 * FRED 매크로 지표 갱신 — data/macro-data.js 자동 작성
 *
 * 출처: FRED (Federal Reserve Economic Data) / St. Louis Fed
 * API: https://fred.stlouisfed.org/docs/api/fred/
 *
 * 필수 ENV:
 *   FRED_API_KEY  - FRED API 키 (https://research.stlouisfed.org/useraccount/apikey)
 *
 * 선택 ENV:
 *   DRY_RUN=1     - 파일 쓰기 없이 결과만 stdout 출력
 *
 * 사용:
 *   FRED_API_KEY=xxx node scripts/fetch-macro.js
 *   FRED_API_KEY=xxx DRY_RUN=1 node scripts/fetch-macro.js
 *
 *   # cron 예시 (매일 오전 7:00 KST — 美 종가 확보 시점)
 *   0 7 * * * cd /path/to/briefick && FRED_API_KEY=xxx node scripts/fetch-macro.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const FRED_API_KEY = process.env.FRED_API_KEY;
if (!FRED_API_KEY) {
  console.error('FRED_API_KEY 환경변수 필수');
  process.exit(1);
}
const DRY_RUN = process.env.DRY_RUN === '1';

// 지표 정의 — fmt: 표시 형식, cat: 카테고리, unit: 단위
const INDICATORS = [
  // 금리
  { id:'DGS10',     cat:'rates', nm:'미국 10년 국채금리', unit:'%',   fmt:'pct',  desc:'장기 금리 벤치마크 — 모기지·기업채 직접 영향' },
  { id:'DGS2',      cat:'rates', nm:'미국 2년 국채금리',  unit:'%',   fmt:'pct',  desc:'단기 금리 — 연준 정책 기대 직접 반영' },
  { id:'T10Y2Y',    cat:'rates', nm:'10y-2y 스프레드',    unit:'%p',  fmt:'pct',  desc:'장단기 금리차 — 음수면 경기 침체 시그널' },
  { id:'FEDFUNDS',  cat:'rates', nm:'연방기금금리',       unit:'%',   fmt:'pct',  desc:'연준 정책금리 — 월간 평균' },
  // 환율
  { id:'DTWEXBGS',  cat:'fx',    nm:'달러 인덱스(Broad)', unit:'',    fmt:'idx',  desc:'美 무역가중 달러 강도 — 26통화 바스킷' },
  { id:'DEXKOUS',   cat:'fx',    nm:'원/달러',            unit:'원',  fmt:'krw',  desc:'한국 원화·달러 환율 — 1달러당 원' },
  { id:'DEXJPUS',   cat:'fx',    nm:'엔/달러',            unit:'엔',  fmt:'jpy',  desc:'일본 엔화·달러 환율 — 1달러당 엔' },
  { id:'DEXCHUS',   cat:'fx',    nm:'위안/달러',          unit:'위안',fmt:'cny',  desc:'중국 위안·달러 환율 — 1달러당 위안' },
  // 원자재
  { id:'DCOILWTICO',     cat:'cmdty', nm:'WTI 원유',     unit:'$/배럴', fmt:'usd',  desc:'서부 텍사스 중질유 — 미국 원유 벤치마크' },
  { id:'DCOILBRENTEU',   cat:'cmdty', nm:'브렌트 원유',  unit:'$/배럴', fmt:'usd',  desc:'북해 브렌트 — 글로벌 원유 벤치마크' },
  // 금: FRED 직매핑 시리즈 폐기(2025). 금 가격은 commodity-data.js 큐레이션에서 별도 제공.
  // 고용
  { id:'UNRATE',    cat:'labor', nm:'미국 실업률',        unit:'%',   fmt:'pct',  desc:'월간 실업률 — 노동시장 핵심 지표' },
  { id:'PAYEMS',    cat:'labor', nm:'비농업 고용(총)',    unit:'백만명',fmt:'jobs', desc:'미국 비농업 부문 총고용 — 단위 백만명' },
  // 물가
  { id:'CPIAUCSL',  cat:'price', nm:'미국 CPI (YoY)',     unit:'%',   fmt:'yoy',  desc:'소비자물가 전년동월비 — 헤드라인 인플레' },
  { id:'PCEPI',     cat:'price', nm:'미국 PCE (YoY)',     unit:'%',   fmt:'yoy',  desc:'연준 선호 물가 지표 PCE 전년동월비' },
  // 통화
  { id:'M2SL',      cat:'money', nm:'M2 통화량 (YoY)',    unit:'%',   fmt:'yoy',  desc:'M2 통화량 전년동월비 — 유동성 지표' },
  { id:'WALCL',     cat:'money', nm:'연준 자산 (YoY)',    unit:'%',   fmt:'yoy',  desc:'연준 대차대조표 총자산 YoY — QT/QE 추세' },
];

const CATEGORIES = {
  rates: { title:'📈 금리',         tag:'장단기·정책금리' },
  fx:    { title:'💱 환율',         tag:'달러·주요국 통화' },
  cmdty: { title:'🛢 원자재',       tag:'원유·금' },
  labor: { title:'💼 고용',         tag:'실업·NFP' },
  price: { title:'📊 물가',         tag:'CPI·PCE' },
  money: { title:'💰 통화·유동성',  tag:'M2·연준 자산' },
};

function fetchFred(seriesId, limit = 400) {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}` +
              `&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error_code) return reject(new Error(`${seriesId}: ${json.error_message}`));
          resolve(json.observations || []);
        } catch (e) { reject(new Error(`${seriesId} parse: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

// FRED returns descending order. Skip "." (missing) values.
const isValid = (o) => o && o.value !== '.' && o.value !== '';
const pickLatest = (obs) => obs.find(isValid);

function pickAtDaysBack(obs, days) {
  const latest = pickLatest(obs);
  if (!latest) return null;
  const cutoff = new Date(latest.date);
  cutoff.setDate(cutoff.getDate() - days);
  return obs.find(o => isValid(o) && new Date(o.date) <= cutoff);
}

function pickEndOfLastYear(obs) {
  const latest = pickLatest(obs);
  if (!latest) return null;
  const py = new Date(latest.date).getFullYear() - 1;
  return obs.find(o => isValid(o) && new Date(o.date).getFullYear() === py);
}

function pickMonthsBack(obs, months) {
  const latest = pickLatest(obs);
  if (!latest) return null;
  const cutoff = new Date(latest.date);
  cutoff.setMonth(cutoff.getMonth() - months);
  return obs.find(o => isValid(o) && new Date(o.date) <= cutoff);
}

function fmtValue(value, fmt) {
  const n = parseFloat(value);
  if (isNaN(n)) return value;
  switch (fmt) {
    case 'pct':  return n.toFixed(2);
    case 'idx':  return n.toFixed(2);
    case 'usd':  return n.toFixed(2);
    case 'gold': return Math.round(n).toString();
    case 'krw':  return n.toFixed(2);
    case 'jpy':  return n.toFixed(2);
    case 'cny':  return n.toFixed(4);
    case 'jobs': return (n / 1000).toFixed(2); // 천명 → 백만명
    case 'yoy':  return n.toFixed(2);
    default:     return n.toString();
  }
}

// % 단위 지표는 절대값 차(pp), 그 외는 상대 변화율(%)
function fmtChange(latest, prev, fmt) {
  if (!latest || !prev) return null;
  const a = parseFloat(latest.value);
  const b = parseFloat(prev.value);
  if (isNaN(a) || isNaN(b) || b === 0) return null;
  if (['pct', 'yoy'].includes(fmt)) {
    const diff = a - b;
    return (diff >= 0 ? '+' : '') + diff.toFixed(2) + 'p';
  } else {
    const pct = ((a - b) / b) * 100;
    return (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
  }
}

function calcYoY(latest, twelveBack) {
  if (!latest || !twelveBack) return null;
  const a = parseFloat(latest.value);
  const b = parseFloat(twelveBack.value);
  if (isNaN(a) || isNaN(b) || b === 0) return null;
  return ((a - b) / b) * 100;
}

function nowKST() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const k = new Date(utcMs + 9 * 3600000);
  const pad = n => String(n).padStart(2, '0');
  return `${k.getFullYear()}-${pad(k.getMonth()+1)}-${pad(k.getDate())} ${pad(k.getHours())}:${pad(k.getMinutes())} KST`;
}

(async () => {
  const buckets = {};
  for (const c of Object.keys(CATEGORIES)) buckets[c] = { ...CATEGORIES[c], items: [] };

  for (const ind of INDICATORS) {
    process.stderr.write(`  ${ind.id.padEnd(22)} `);
    let obs;
    try { obs = await fetchFred(ind.id, 400); }
    catch (e) { process.stderr.write(`FAIL ${e.message}\n`); continue; }

    const latest = pickLatest(obs);
    if (!latest) { process.stderr.write('no data\n'); continue; }

    let displayValue, d1, w1, ytd, y1;

    if (ind.fmt === 'yoy') {
      const yoy = calcYoY(latest, pickMonthsBack(obs, 12));
      displayValue = yoy !== null ? yoy.toFixed(2) : latest.value;
      const prevMonth = pickMonthsBack(obs, 1);
      const prevYoy  = calcYoY(prevMonth, pickMonthsBack(obs, 13));
      if (yoy !== null && prevYoy !== null) {
        const dd = yoy - prevYoy;
        d1 = (dd >= 0 ? '+' : '') + dd.toFixed(2) + 'p';  // 전월 대비 YoY 변화(pp)
      }
    } else {
      displayValue = fmtValue(latest.value, ind.fmt);
      d1  = fmtChange(latest, pickAtDaysBack(obs, 1),   ind.fmt);
      w1  = fmtChange(latest, pickAtDaysBack(obs, 7),   ind.fmt);
      ytd = fmtChange(latest, pickEndOfLastYear(obs),   ind.fmt);
      y1  = fmtChange(latest, pickAtDaysBack(obs, 365), ind.fmt);
    }

    buckets[ind.cat].items.push({
      nm:    ind.nm,
      tk:    ind.id,
      value: displayValue,
      unit:  ind.unit,
      date:  latest.date,
      d1:    d1  || '—',
      w1:    w1  || '—',
      ytd:   ytd || '—',
      y1:    y1  || '—',
      desc:  ind.desc,
    });

    process.stderr.write(`${displayValue}${ind.unit ? ' '+ind.unit : ''}\n`);
  }

  const data = Object.values(buckets).filter(b => b.items.length > 0);
  const META = { updated: nowKST(), source: 'FRED / St. Louis Fed' };

  const out =
`// Macro Indicators — FRED 자동 갱신
// 출처: FRED (Federal Reserve Economic Data) / St. Louis Fed
// 갱신: scripts/fetch-macro.js
//
// 단위 메모:
//   - pct/yoy: percentage points (절대 차) → d1·ytd 표기는 "+0.05p" 형식
//   - 그 외: 상대 변화율 % → "+1.23%" 형식

const META = ${JSON.stringify(META, null, 2)};

const data = ${JSON.stringify(data, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { data, META };
}
`;

  if (DRY_RUN) {
    process.stdout.write(out);
  } else {
    const outPath = path.join(__dirname, '..', 'data', 'macro-data.js');
    fs.writeFileSync(outPath, out, 'utf8');
    console.log(`✓ data/macro-data.js — ${INDICATORS.length}개 지표, ${META.updated}`);
  }
})().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
