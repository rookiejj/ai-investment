#!/usr/bin/env node
// 자동 갱신 에이전트용 섹터 로테이션 계산기
// Usage: node scripts/calc-sector-rotation.js
// Output: { date, kr, us } JSON — sector-rotation.js 배열 맨 앞에 prepend용

const fs = require('fs');
const path = require('path');

const snap = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/prices-snapshot.json'), 'utf8'));

function calcSectors(dataFile) {
  const src = fs.readFileSync(path.resolve(__dirname, '..', dataFile), 'utf8');
  const sectors = new Function(src + ';return data;')();
  const map = {};
  sectors.forEach(s => {
    const label = s.title.replace(/^\S+\s/, '');
    s.stocks.forEach(st => {
      const p = snap.prices[st.tk];
      if (!map[label]) map[label] = [];
      if (p && p.chg != null) map[label].push(p.chg);
    });
  });
  const result = {};
  Object.entries(map).forEach(([k, v]) => {
    if (v.length) result[k] = parseFloat((v.reduce((a, b) => a + b, 0) / v.length).toFixed(2));
  });
  return result;
}

const entry = {
  date: snap.asOfKst.slice(0, 10),
  kr: calcSectors('data/kr-stocks-data.js'),
  us: calcSectors('data/stocks-data.js'),
};

console.log(JSON.stringify(entry, null, 2));
console.error(`\n계산 완료: ${entry.date} | KR ${Object.keys(entry.kr).length}섹터, US ${Object.keys(entry.us).length}섹터`);
