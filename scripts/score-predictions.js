#!/usr/bin/env node
// 예측 스코어카드 자동 채점기
// Usage: node scripts/score-predictions.js
// - prices-snapshot.json 의 날짜와 일치하는 entry 의 null result 를 자동 채점
// - 채점된 파일 내용을 stdout 으로 출력 (변경 없으면 아무것도 출력 안 함)

const fs = require('fs');
const path = require('path');

const THRESHOLD = 0.5; // 이 임계값 이상/이하면 방향 채점, 미만은 적중 처리

const snapPath = path.resolve(__dirname, '../data/prices-snapshot.json');
const scorePath = path.resolve(__dirname, '../data/prediction-scorecard.js');

const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
const src = fs.readFileSync(scorePath, 'utf8');
const data = new Function(src + ';return PREDICTION_SCORECARD;')();

const snapDate = snap.asOfKst.slice(0, 10);
let changed = false;

data.forEach(entry => {
  if (entry.date !== snapDate) return;
  entry.predictions.forEach(pred => {
    if (pred.result !== null || !pred.ticker) return;
    const price = snap.prices[pred.ticker];
    if (!price || price.chg == null) return;

    pred.actual = price.chg;
    const chg = price.chg;

    if (chg >= THRESHOLD) {
      pred.result = pred.direction === 'up' ? 'hit' : 'miss';
    } else if (chg <= -THRESHOLD) {
      pred.result = pred.direction === 'down' ? 'hit' : 'miss';
    } else {
      pred.result = 'hit'; // ±0.5% 미만 소폭 움직임 = 적중 처리
    }
    changed = true;
  });
});

if (!changed) {
  process.stderr.write('채점할 항목 없음 (날짜 불일치 또는 이미 채점 완료)\n');
  process.exit(0);
}

const output = `// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = ${JSON.stringify(data, null, 2)};
`;

process.stdout.write(output);
process.stderr.write(`채점 완료: ${snapDate} 기준 변경된 항목 있음\n`);
