#!/usr/bin/env node
// update.js 누적 엔트리를 entries 개수 한도 이하로 트리밍 (최근 entry 우선).
//
// 배경: 자동 갱신 트리거 환경(트리거 sandbox)이 git push 403 차단 + MCP push_files API의
// JSON body 사이즈 한계(~50KB 부근)로 큰 *-update.js를 GitHub로 되돌릴 수 없는 이슈가 있음.
//
// 5/11 archive 인프라 도입(scripts/rotate-archive.js + archive-rotate.yml)으로 mentions 깊이는
// archive에서 ~30일 보장. main은 화면 노출(TL;DR=entries[0]) + archive 사고 시 폴백만 담당하면 충분.
// → byte 한도 → entries 개수 한도(기본 5건)로 변경.
//
// 5건 = 약 1주일치(통합 후). 한도는 상한이라 짧은 탭(kr·commodity 4건)은 그대로 유지.
// main 사이즈 ~12~15KB로 sandbox push 한계(~50KB) 여유 대폭 증가.
//
// 화면이 사용하는 entry 개수:
//   - 헤드라인 TL;DR / 캘린더 / 대안자산: entries[0]만
//   - 종목 deep-dive 모달 mentions: main 5건 + archive 30일치 (dedup 후 12건 cap)
//   - generate-message·cartoon: entries[0]만
//   - daily-send 친구톡: PER_TAB=1 (entries[0]만)
//   - render-slides 인스타: entries[0] summary의 5줄(불릿)
//
// 사용:
//   node scripts/trim-update-logs.js               # 모든 update.js 5건으로 트리밍
//   node scripts/trim-update-logs.js --max 3       # 3건 한도 (더 공격적)
//   node scripts/trim-update-logs.js --dry         # 실제 쓰기 안 하고 결과만 보기

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  'data/stocks-update.js',
  'data/kr-stocks-update.js',
  'data/ai-update.js',
  'data/commodity-update.js',
  'data/unicorn-update.js',
  'data/jp-stocks-update.js',
];

function parseArg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i < 0 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}
const MAX_ENTRIES = Number(parseArg('--max', 5));
const DRY = process.argv.includes('--dry');

// top-level entry 경계(`}` 다음 `,` 또는 공백 위치) 목록을 반환.
// brace-depth tracking으로 문자열·주석 안 `{}` 무시.
function findEntryBoundaries(src) {
  const arrOpenMatch = src.match(/(const|let|var)\s+\w+\s*=\s*\[/);
  if (!arrOpenMatch) throw new Error('array 선언 못 찾음');
  const arrStart = arrOpenMatch.index + arrOpenMatch[0].length;

  const boundaries = [];
  let i = arrStart;
  let depth = 0;
  let inString = null;
  let inLineComment = false;
  let inBlockComment = false;
  let arrayClose = -1;

  while (i < src.length) {
    const c = src[i], next = src[i + 1];
    if (inLineComment) { if (c === '\n') inLineComment = false; i++; continue; }
    if (inBlockComment) { if (c === '*' && next === '/') { inBlockComment = false; i += 2; continue; } i++; continue; }
    if (inString) { if (c === '\\') { i += 2; continue; } if (c === inString) inString = null; i++; continue; }
    if (c === '/' && next === '/') { inLineComment = true; i += 2; continue; }
    if (c === '/' && next === '*') { inBlockComment = true; i += 2; continue; }
    if (c === '"' || c === "'" || c === '`') { inString = c; i++; continue; }
    if (c === '{') { depth++; i++; continue; }
    if (c === '}') {
      depth--;
      if (depth === 0) {
        let j = i + 1;
        while (j < src.length && /\s/.test(src[j])) j++;
        if (src[j] === ',') j++;
        boundaries.push(j);
      }
      i++; continue;
    }
    if (c === ']' && depth === 0) { arrayClose = i; break; }
    i++;
  }
  if (arrayClose < 0) throw new Error('array 닫는 ] 못 찾음');
  return { arrStart, boundaries, arrayClose };
}

// 최근(배열 앞쪽) entry max개만 남긴다. 짧으면(이미 max 이하) 그대로.
function trimToMaxEntries(src, maxEntries) {
  const { arrStart, boundaries, arrayClose } = findEntryBoundaries(src);
  if (boundaries.length === 0) return null;
  if (boundaries.length <= maxEntries) return null;  // 한도 이하 — 트리밍 불필요

  const tail = src.slice(arrayClose);
  const head = src.slice(0, arrStart);

  let entriesText = src.slice(arrStart, boundaries[maxEntries - 1]);
  if (entriesText.endsWith(',')) entriesText = entriesText.slice(0, -1);
  const trimmed = head + entriesText + '\n' + tail;
  return {
    trimmed,
    keptEntries: maxEntries,
    totalEntries: boundaries.length,
    afterBytes: Buffer.byteLength(trimmed),
  };
}

let totalBefore = 0, totalAfter = 0;
for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.warn(`[skip] ${rel} 없음`); continue; }
  const src = fs.readFileSync(abs, 'utf8');
  const beforeBytes = Buffer.byteLength(src);
  totalBefore += beforeBytes;

  const result = trimToMaxEntries(src, MAX_ENTRIES);

  if (!result) {
    // entry 수가 한도 이하 — 그대로 유지
    const { boundaries } = findEntryBoundaries(src);
    console.log(`[skip] ${rel}: ${boundaries.length}개 (한도 ${MAX_ENTRIES}개 이하, 트리밍 불필요)`);
    totalAfter += beforeBytes;
    continue;
  }

  console.log(`[trim] ${rel}: ${result.totalEntries}개 → ${result.keptEntries}개  (${(beforeBytes/1024).toFixed(1)}KB → ${(result.afterBytes/1024).toFixed(1)}KB)`);
  if (!DRY) fs.writeFileSync(abs, result.trimmed);
  totalAfter += result.afterBytes;
}

console.log(`\n총합: ${(totalBefore/1024).toFixed(1)}KB → ${(totalAfter/1024).toFixed(1)}KB${DRY ? '  (--dry, 쓰지 않음)' : ''}`);
