#!/usr/bin/env node
// update.js 누적 엔트리를 byte 한도 이하로 트리밍 (최근 entry 우선).
//
// 배경: 자동 갱신 트리거 환경(트리거 sandbox)이 git push 403 차단 + MCP push_files API의
// JSON body 사이즈 한계(~50KB 부근)로 큰 *-update.js를 GitHub로 되돌릴 수 없는 이슈가 있음.
// 5/9 오전 사고 — *-data.js만 푸시되고 *-update.js가 못 푸시되며 헤드라인이 5/8 그대로 표시.
//
// 해결: 각 update.js를 byte 한도 이하로 트리밍 (오래된 entry부터 잘라냄).
// 잘려나간 옛 entry는 git history에 영원히 남으니 정보 자체는 보존.
//
// byte 기준 이유: entry 개수만으로는 detail 본문 길이 들쭉날쭉이라 일관 못 함
// (예: ai-update.js 49개 = 96.9KB / unicorn-update.js 44개 = 77.6KB).
//
// 화면이 사용하는 entry 개수:
//   - 헤드라인 TL;DR / 캘린더 / 대안자산: entry[0]만
//   - 종목 deep-dive 모달 mentions: 최근 12건
//   - generate-message·cartoon: entry[0]만
// 기본 40KB — 자동 갱신 세션이 새 entry(~2-3KB) prepend할 헤드룸 확보 + push_files
// 한계(~50KB) 안전 마진. 50KB로 했더니 prepend 후 한도 초과해 push 실패한 사고 있었음(2026-05-09).
// 40KB면 보통 10~16개 entry — 사용자 노출 영역(TL;DR=entry[0], 모달 mentions=12건) 영향 0.
//
// 사용:
//   node scripts/trim-update-logs.js               # 모든 update.js 40KB로 트리밍
//   node scripts/trim-update-logs.js --max-kb 30   # 30KB 한도 (더 공격적)
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
const MAX_BYTES = Number(parseArg('--max-kb', 40)) * 1024;
const DRY = process.argv.includes('--dry');

// top-level entry 경계(`}` 다음 `,` 또는 공백 위치) 목록을 반환.
// 인덱스 i = i번째 entry 직후 컷 포인트. brace-depth tracking으로 문자열·주석 안 `{}` 무시.
function findEntryBoundaries(src) {
  const arrOpenMatch = src.match(/(const|let|var)\s+\w+\s*=\s*\[/);
  if (!arrOpenMatch) throw new Error('array 선언 못 찾음');
  const arrStart = arrOpenMatch.index + arrOpenMatch[0].length;

  const boundaries = [];  // entry N 직후 (포함 가능한 trailing , + 공백 제외) 위치
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

// 파일이 maxBytes 이하가 되도록 가장 큰 N을 찾아 entry[0..N)만 유지.
// entry는 가장 최근(prepend 룰이라 배열 앞쪽)을 우선.
function trimToMaxBytes(src, maxBytes) {
  const { arrStart, boundaries, arrayClose } = findEntryBoundaries(src);
  if (boundaries.length === 0) return null;

  const tail = src.slice(arrayClose);  // `]` 부터 파일 끝까지 (라이선스·후행 코드)
  const head = src.slice(0, arrStart);  // 파일 시작부터 `[` 직후
  const headBytes = Buffer.byteLength(head);
  const tailBytes = Buffer.byteLength(tail);

  // entry N개를 남겼을 때 결과 byte 시뮬레이션. UTF-8 byte 단위로 (한글은 char 1 = byte 3).
  let bestN = 0;
  for (let n = 1; n <= boundaries.length; n++) {
    let entriesText = src.slice(arrStart, boundaries[n - 1]);
    if (entriesText.endsWith(',')) entriesText = entriesText.slice(0, -1);
    const size = headBytes + Buffer.byteLength(entriesText) + 1 + tailBytes;
    if (size <= maxBytes) {
      bestN = n;
    } else {
      break;
    }
  }

  if (bestN === boundaries.length) return null;  // 전체가 한도 안 — 트리밍 불필요
  if (bestN === 0) {
    // 첫 entry조차 한도 초과 — 매우 비정상, 그대로 두고 경고
    return { error: '첫 entry조차 maxBytes 초과', totalEntries: boundaries.length };
  }

  let entriesText = src.slice(arrStart, boundaries[bestN - 1]);
  if (entriesText.endsWith(',')) entriesText = entriesText.slice(0, -1);
  const trimmed = head + entriesText + '\n' + tail;
  return {
    trimmed,
    keptEntries: bestN,
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

  const result = trimToMaxBytes(src, MAX_BYTES);

  if (!result) {
    console.log(`[skip] ${rel}: ${(beforeBytes/1024).toFixed(1)}KB (한도 ${MAX_BYTES/1024}KB 이하, 트리밍 불필요)`);
    totalAfter += beforeBytes;
    continue;
  }
  if (result.error) {
    console.warn(`[warn] ${rel}: ${result.error} (${result.totalEntries} entries)`);
    totalAfter += beforeBytes;
    continue;
  }

  console.log(`[trim] ${rel}: ${result.totalEntries}개 → ${result.keptEntries}개  (${(beforeBytes/1024).toFixed(1)}KB → ${(result.afterBytes/1024).toFixed(1)}KB)`);
  if (!DRY) fs.writeFileSync(abs, result.trimmed);
  totalAfter += result.afterBytes;
}

console.log(`\n총합: ${(totalBefore/1024).toFixed(1)}KB → ${(totalAfter/1024).toFixed(1)}KB${DRY ? '  (--dry, 쓰지 않음)' : ''}`);
