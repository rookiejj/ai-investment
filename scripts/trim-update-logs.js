#!/usr/bin/env node
/**
 * *-update.js entries 2건 한도 트림.
 *
 * 룰 (2026-05-14~): git의 *-update.js는 sandbox 작업 컨텍스트라 깊이 필요 없음.
 * 옛 entries 1건(중복 회피용 직전 cron 결과) + 새 entry 1건만 유지.
 * 더 깊은 dedup은 DB source_hash가 자동 처리.
 *
 * 멱등 — 이미 2건 이하면 skip.
 */

const fs = require('fs');
const path = require('path');

const LIMIT = 2;
const DATA_DIR = path.resolve(__dirname, '..', 'data');

const FILES = [
  { file: 'kr-stocks-update.js',   varName: 'updates' },
  { file: 'stocks-update.js',      varName: 'updates' },
  { file: 'ai-update.js',          varName: 'UPDATES' },
  { file: 'commodity-update.js',   varName: 'updates' },
  { file: 'unicorn-update.js',     varName: 'updates' },
];

function trimFile({ file, varName }) {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) {
    console.log(`  ${file}: 파일 없음 — skip`);
    return;
  }
  const src = fs.readFileSync(full, 'utf8');
  // entries 배열 평가
  let entries;
  try {
    entries = new Function(`${src};return typeof ${varName}!=="undefined"?${varName}:null;`)();
  } catch (e) {
    console.log(`  ${file}: 평가 실패 — ${e.message.slice(0, 80)}`);
    return;
  }
  if (!Array.isArray(entries)) {
    console.log(`  ${file}: ${varName} 배열 아님 — skip`);
    return;
  }
  if (entries.length <= LIMIT) {
    console.log(`  ${file}: 이미 ${entries.length}건 ≤ ${LIMIT} — skip`);
    return;
  }
  const trimmed = entries.slice(0, LIMIT);

  // 파일의 앞 prefix(헤더 주석)과 뒤 suffix는 유지하고 배열만 교체
  // 안전한 방식: const VAR = ... 뒤 배열 부분만 stringify로 교체. 헤더는 옛 파일 그대로 prepend.
  const headerMatch = src.match(/^([\s\S]*?const\s+\w+\s*=\s*)/);
  const header = headerMatch ? headerMatch[1] : `const ${varName} = `;
  const newSrc = `${header}${JSON.stringify(trimmed, null, 2)};\n`;
  fs.writeFileSync(full, newSrc);
  console.log(`  ${file}: ${entries.length} → ${LIMIT}건`);
}

console.log(`[trim-update-logs] 한도 ${LIMIT}건`);
for (const f of FILES) trimFile(f);
console.log('[trim-update-logs] done');
