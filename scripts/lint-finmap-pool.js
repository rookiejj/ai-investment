#!/usr/bin/env node
// 시장 핀맵 풀 데이터 검증
// - sector-pool.js의 모든 ticker가 형식 검증 통과
// - 한국 ticker는 kr-stocks-data.js 큐레이션 OR sector-pool.js의 KR_NAME_OVERRIDE에
//   한글명 매핑이 있어야 통과 (없으면 영문명/raw ticker로 노출돼 사용자에게 의미 없음)
// - 미국 ticker는 Yahoo 영문명 자동 사용 가능, 형식 검증만
//
// 사용: node scripts/lint-finmap-pool.js
// 실패 시 exit 1, 누락된 종목 리스트 출력

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POOL_PATH = path.join(ROOT, 'data', 'sector-pool.js');
const KR_DATA_PATH = path.join(ROOT, 'data', 'kr-stocks-data.js');
const STOCKS_DATA_PATH = path.join(ROOT, 'data', 'stocks-data.js');

function evalFile(filePath) {
  const t = fs.readFileSync(filePath, 'utf8');
  return new Function(t + ';return {SECTOR_POOL:typeof SECTOR_POOL!=="undefined"?SECTOR_POOL:null,KR_NAME_OVERRIDE:typeof KR_NAME_OVERRIDE!=="undefined"?KR_NAME_OVERRIDE:null,US_NAME_OVERRIDE:typeof US_NAME_OVERRIDE!=="undefined"?US_NAME_OVERRIDE:null,data:typeof data!=="undefined"?data:null};')();
}

function loadCuratedKRMap() {
  const e = evalFile(KR_DATA_PATH);
  const map = {};
  for (const cat of (e.data || [])) {
    for (const s of (cat.stocks || [])) {
      if (s.tk) map[s.tk] = s.nm || s.tk;
    }
  }
  return map;
}

function loadCuratedUSSet() {
  const e = evalFile(STOCKS_DATA_PATH);
  const set = new Set();
  for (const cat of (e.data || [])) {
    for (const s of (cat.stocks || [])) {
      if (s.tk) set.add(s.tk);
    }
  }
  return set;
}

const tickerOf = (entry) => (typeof entry === 'string') ? [entry, null] : (Array.isArray(entry) ? [entry[0], entry[1] || null] : [null, null]);

function main() {
  const poolFile = evalFile(POOL_PATH);
  const pool = poolFile.SECTOR_POOL || poolFile.data;
  const krOverride = poolFile.KR_NAME_OVERRIDE || {};
  const usOverride = poolFile.US_NAME_OVERRIDE || {};
  const curatedKR = loadCuratedKRMap();
  const curatedUS = loadCuratedUSSet();

  const issues = [];

  // 미국 풀 — ticker 형식만
  for (const [sec, list] of Object.entries(pool.stocks || {})) {
    if (!Array.isArray(list)) {
      issues.push(`stocks/${sec}: list가 배열 아님`);
      continue;
    }
    for (const entry of list) {
      const [tk] = tickerOf(entry);
      if (!tk) {
        issues.push(`stocks/${sec}: invalid entry ${JSON.stringify(entry)}`);
        continue;
      }
      if (!/^[A-Z][A-Z0-9.-]{0,5}$/.test(tk)) {
        issues.push(`stocks/${sec}: 미국 ticker 형식 위반 "${tk}"`);
      }
    }
  }

  // 한국 풀 — ticker 형식 + 한글명 lookup 검증
  for (const [sec, list] of Object.entries(pool.kr || {})) {
    if (!Array.isArray(list)) {
      issues.push(`kr/${sec}: list가 배열 아님`);
      continue;
    }
    for (const entry of list) {
      const [tk, inlineNm] = tickerOf(entry);
      if (!tk) {
        issues.push(`kr/${sec}: invalid entry ${JSON.stringify(entry)}`);
        continue;
      }
      if (!/^\d{6}$/.test(tk)) {
        issues.push(`kr/${sec}: 한국 ticker 형식 위반 "${tk}" (6자리 숫자여야 함)`);
        continue;
      }
      // 이름 lookup 가능 경로:
      //  (a) 인라인 [tk, nm] 형태
      //  (b) kr-stocks-data.js 큐레이션
      //  (c) KR_NAME_OVERRIDE 매핑
      const hasName = inlineNm || curatedKR[tk] || krOverride[tk];
      if (!hasName) {
        issues.push(`kr/${sec}: "${tk}" 한글명 없음 — KR_NAME_OVERRIDE에 추가 또는 [tk,nm] 인라인 또는 kr-stocks-data.js 큐레이션 필요`);
      }
    }
  }

  // dead 매핑 검사 (KR·US 모두) — override에 있지만 풀에 없는 entry는 정리 권장
  const allKrPoolTks = new Set();
  for (const list of Object.values(pool.kr || {})) {
    for (const entry of (list || [])) {
      const [tk] = tickerOf(entry);
      if (tk) allKrPoolTks.add(tk);
    }
  }
  for (const tk of Object.keys(krOverride)) {
    if (!allKrPoolTks.has(tk)) {
      issues.push(`KR_NAME_OVERRIDE: "${tk}" (${krOverride[tk]}) — 풀에 없음, 사용 안 됨 (제거 권장)`);
    }
  }
  const allUsPoolTks = new Set();
  for (const list of Object.values(pool.stocks || {})) {
    for (const entry of (list || [])) {
      const [tk] = tickerOf(entry);
      if (tk) allUsPoolTks.add(tk);
    }
  }
  for (const tk of Object.keys(usOverride)) {
    if (!allUsPoolTks.has(tk) && !curatedUS.has(tk)) {
      issues.push(`US_NAME_OVERRIDE: "${tk}" (${usOverride[tk]}) — 풀·큐레이션 어디에도 없음 (제거 권장)`);
    }
  }

  if (issues.length === 0) {
    console.log('✓ finmap pool lint: 0 issues');
    process.exit(0);
  }
  console.log(`✗ finmap pool lint: ${issues.length} issues`);
  for (const i of issues) console.log('  ' + i);
  process.exit(1);
}

main();
