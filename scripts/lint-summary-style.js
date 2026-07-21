#!/usr/bin/env node
/**
 * lint-summary-style — summary 줄이 [주체+핵심숫자]-[쉬운 풀이말] 가독성 규칙을 지키는지 검사.
 *
 * 규칙 (CLAUDE.md [summary 작성 규칙]):
 *   - 줄당 metric 숫자 ≤ 2개. (가격·등락률·금액·배수만 카운트)
 *   - 금액 단위는 한글+통화. 영어 약어(B·T·M달러)·$ 금지.
 *
 * "metric 숫자"만 센다 — 모델 버전(GPT-5.6·Kimi K3·Atlas 950)·날짜(7/24·D-3)·
 *   기간(5개월·10일·4분기)은 clutter가 아니므로 제외. 이게 오탐 방지의 핵심.
 *
 * 대상: data/*-update.js 5탭의 updates[0].summary 모든 줄.
 * 출력: 위반 목록 + 요약 한 줄(TELEGRAM_DETAIL= 로 stdout). exit 0 (non-blocking).
 *
 * 사용: node scripts/lint-summary-style.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const TABS = [
  { id: 'kr',        label: '한국',   file: 'kr-stocks-update.js' },
  { id: 'stocks',    label: '미국',   file: 'stocks-update.js' },
  { id: 'ai',        label: 'AI',     file: 'ai-update.js' },
  { id: 'commodity', label: '원자재', file: 'commodity-update.js' },
  { id: 'unicorn',   label: '유니콘', file: 'unicorn-update.js' },
];

const MAX_METRICS = 2; // 줄당 metric 숫자 상한

// metric 숫자 = ① 숫자+금융단위(조·억·달러·원·bp·배·만대·억달러…) ② %  ③ 콤마 묶음 가격(6,516)
// 모델버전·날짜·기간은 매칭 안 됨(단위가 없거나 시간단위라).
const METRIC_RE = /[+-]?\d[\d,]*\.?\d*\s*(억달러|조원|억원|만달러|조|억|원|달러|bp|배|만대|만주|%|％)|(?<![\d/.])\d{1,3}(?:,\d{3})+(?![\d/])/g;
// 영어 금액 약어·달러기호 (한글 단위 규칙 위반): $숫자, 또는 숫자+B/T/M
const ENG_UNIT_RE = /\$\s?\d|\b\d[\d.]*\s?[BTM]\b/;

function readSummaryLines(file) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const arr = new Function(src + ';return typeof updates!=="undefined"?updates:(typeof UPDATES!=="undefined"?UPDATES:[]);')();
  const s = (arr && arr[0] && arr[0].summary) || '';
  return String(s).split('\n').map((l) => l.trim()).filter(Boolean);
}
function countMetrics(line) {
  const m = line.match(METRIC_RE);
  return m ? m.length : 0;
}

const violations = [];
for (const t of TABS) {
  let lines;
  try { lines = readSummaryLines(t.file); }
  catch (e) { console.error(`[lint] ${t.id} 읽기 실패: ${e.message}`); continue; }
  lines.forEach((line, i) => {
    const metrics = countMetrics(line);
    if (metrics > MAX_METRICS) {
      violations.push({ tab: t.label, line: i + 1, kind: `숫자 ${metrics}개`, text: line });
    }
    if (ENG_UNIT_RE.test(line)) {
      violations.push({ tab: t.label, line: i + 1, kind: '영어단위($/B/T/M)', text: line });
    }
  });
}

console.log('════ summary 스타일 검사 (줄당 metric 숫자 ≤ ' + MAX_METRICS + ') ════');
if (!violations.length) {
  console.log('✓ 위반 0건 — 전 탭 통과');
  console.log('TELEGRAM_STATUS=success');
  console.log('TELEGRAM_DETAIL=summary 스타일 통과 (5탭)');
  process.exit(0);
}
for (const v of violations) {
  console.log(`✗ [${v.tab}] ${v.line}번째 줄 (${v.kind})`);
  console.log(`   ${v.text}`);
}
// 텔레그램 detail용 컴팩트 요약 (300자 슬라이스 대비 짧게)
const compact = violations.map((v) => `${v.tab}L${v.line}(${v.kind})`).join(' · ');
console.log(`\n총 ${violations.length}건 위반`);
console.log('TELEGRAM_STATUS=failure');
console.log(`TELEGRAM_DETAIL=summary 스타일 위반 ${violations.length}건 - ${compact}`);
process.exit(0); // non-blocking — 알림만, 파이프라인 안 막음
