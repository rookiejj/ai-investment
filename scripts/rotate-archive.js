#!/usr/bin/env node
/**
 * Archive rotate — main update.js의 entries를 archive에 mirror, 30일 cutoff 적용.
 *
 * 흐름:
 *   1. main(*-update.js)의 모든 entries 읽음
 *   2. archive(*-update-archive.js)의 모든 entries 읽음
 *   3. main + archive 합쳐 dedup (date + changes[0].time + detail snippet)
 *   4. 30일 넘은 entries 삭제
 *   5. date desc 정렬해 archive 파일 재작성
 *
 * 호출:
 *   node scripts/rotate-archive.js              # 5탭 전체
 *   node scripts/rotate-archive.js stocks       # 특정 탭만
 *
 * 멱등: 같은 main 상태에서 여러 번 돌려도 결과 동일.
 */

const fs = require('fs');
const path = require('path');

// 탭별 main 변수명 (ai만 대문자 UPDATES, 나머지는 소문자 updates)
const TAB_CONFIG = [
  { tab: 'stocks',    mainVar: 'updates' },
  { tab: 'kr-stocks', mainVar: 'updates' },
  { tab: 'ai',        mainVar: 'UPDATES' },
  { tab: 'unicorn',   mainVar: 'updates' },
  { tab: 'commodity', mainVar: 'updates' },
];
const TABS = TAB_CONFIG.map(c => c.tab);
const CUTOFF_DAYS = 30;
const DATA_DIR = path.join(__dirname, '..', 'data');

function loadEntries(filePath, varName) {
  if (!fs.existsSync(filePath)) return [];
  const src = fs.readFileSync(filePath, 'utf8');
  try {
    return new Function(src + `;return typeof ${varName} !== "undefined" ? ${varName} : [];`)();
  } catch (e) {
    console.error(`[parse fail] ${filePath}: ${e.message}`);
    return [];
  }
}

function dedupKey(entry) {
  const date = entry.date || '';
  const firstTime = (entry.changes && entry.changes[0] && entry.changes[0].time) || '';
  const snippet = (
    (entry.changes && entry.changes[0] && entry.changes[0].detail) ||
    (entry.entries && entry.entries[0] && entry.entries[0].text) ||
    entry.summary ||
    ''
  ).slice(0, 40);
  return `${date}|${firstTime}|${snippet}`;
}

function parseDate(str) {
  if (!str) return new Date(NaN);
  // "2026-05-11 07:25 KST" → ISO
  const iso = str.replace(' KST', '+09:00').replace(' ', 'T');
  return new Date(iso);
}

function rotateOne(cfg) {
  const { tab, mainVar } = cfg;
  const mainPath = path.join(DATA_DIR, `${tab}-update.js`);
  const archivePath = path.join(DATA_DIR, `${tab}-update-archive.js`);

  const main = loadEntries(mainPath, mainVar);
  const archive = loadEntries(archivePath, 'updatesArchive');

  // main 먼저(최신 우선) + archive 뒤(옛). dedup으로 archive에 있는 main 중복 제거.
  const merged = [];
  const seen = new Set();
  for (const entry of [...main, ...archive]) {
    const k = dedupKey(entry);
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(entry);
  }

  // 30일 cutoff (KST 기준 30일 전 자정)
  const now = Date.now();
  const cutoff = now - CUTOFF_DAYS * 24 * 3600 * 1000;
  const kept = merged.filter(e => {
    const d = parseDate(e.date);
    if (isNaN(d)) return false;
    return d.getTime() >= cutoff;
  });

  // date desc 정렬
  kept.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const header = `// ${tab} update archive — 사용자 모달 mentions용 (30일 보존)
// scripts/rotate-archive.js + .github/workflows/archive-rotate.yml 자동 갱신.
// 직접 편집 금지 — main(*-update.js)에서 사고가 흡수돼 결국 덮어 쓰임.
`;
  const out = header + 'const updatesArchive = ' + JSON.stringify(kept, null, 2) + ';\n';
  fs.writeFileSync(archivePath, out);

  console.log(`[${tab}] kept ${kept.length} entries (cutoff ${CUTOFF_DAYS}d)`);
  return kept.length;
}

const target = process.argv[2];
const configs = target ? TAB_CONFIG.filter(c => c.tab === target) : TAB_CONFIG;
if (target && configs.length === 0) {
  console.error(`unknown tab: ${target}`);
  process.exit(1);
}

let total = 0;
for (const cfg of configs) {
  total += rotateOne(cfg);
}
console.log(`\n총 ${total} entries 보존`);
