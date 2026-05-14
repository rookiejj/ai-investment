#!/usr/bin/env node
/**
 * fetch-from-db — DB에서 5탭 payload·updates·archive를 받아 로컬 *.js 파일로 재생성.
 *
 * sandbox·로컬 디버깅 시작 직전 한 번 호출. 정적 *-data.js·*-update.js·*-update-archive.js
 * 파일을 DB의 가장 최신 상태로 일관화. 파일은 .gitignore에 들어가 git에 안 들어감 —
 * sandbox는 이 파일들을 Edit해서 변경 표현, sync-to-db.js로 DB만 갱신.
 *
 * 사용:
 *   node scripts/fetch-from-db.js
 *
 * 출력:
 *   data/kr-stocks-data.js       (const data = ...)
 *   data/kr-stocks-update.js     (const updates = ...)
 *   data/kr-stocks-update-archive.js (const updatesArchive = ...)
 *   (5탭 모두 동일 패턴, AI는 META·BL·UPDATES 변수명 유지)
 *   data/version.js              (const DATA_VERSION = "...")
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_FN_URL = process.env.SUPABASE_FN_URL ||
  'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1';
const DATA_DIR = path.resolve(__dirname, '..', 'data');

const TABS = [
  { id: 'kr',        dataFile: 'kr-stocks-data.js',    updateFile: 'kr-stocks-update.js',    archiveFile: 'kr-stocks-update-archive.js',    updVar: 'updates' },
  { id: 'stocks',    dataFile: 'stocks-data.js',       updateFile: 'stocks-update.js',       archiveFile: 'stocks-update-archive.js',       updVar: 'updates' },
  { id: 'ai',        dataFile: 'ai-data.js',           updateFile: 'ai-update.js',           archiveFile: 'ai-update-archive.js',           updVar: 'UPDATES' },
  { id: 'commodity', dataFile: 'commodity-data.js',    updateFile: 'commodity-update.js',    archiveFile: 'commodity-update-archive.js',    updVar: 'updates' },
  { id: 'unicorn',   dataFile: 'unicorn-data.js',      updateFile: 'unicorn-update.js',      archiveFile: 'unicorn-update-archive.js',      updVar: 'updates' },
];

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

// payload({data, META?, BL?}) → JS 파일 텍스트
function dataFileBody(payload) {
  const lines = [];
  if (payload.META) lines.push(`const META = ${JSON.stringify(payload.META, null, 2)};`);
  if (payload.BL)   lines.push(`const BL = ${JSON.stringify(payload.BL,   null, 2)};`);
  lines.push(`const data = ${JSON.stringify(payload.data ?? [], null, 2)};`);
  return lines.join('\n\n') + '\n';
}

function updateFileBody(entries, varName) {
  return `const ${varName} = ${JSON.stringify(entries, null, 2)};\n`;
}

function archiveFileBody(entries) {
  return `const updatesArchive = ${JSON.stringify(entries, null, 2)};\n`;
}

async function main() {
  console.log(`[fetch-from-db] ${SUPABASE_FN_URL}`);

  const [mainResp, archiveResp] = await Promise.all([
    fetchJson(`${SUPABASE_FN_URL}/read-tab-data?_=${Date.now()}`),
    fetchJson(`${SUPABASE_FN_URL}/read-tab-archive?_=${Date.now()}`),
  ]);

  const version = mainResp.version || 'unknown';
  console.log(`  version=${version}`);

  for (const tab of TABS) {
    const payload = mainResp.tabs?.[tab.id] || { data: [] };
    const updates = mainResp.updates?.[tab.id] || [];
    const archive = archiveResp.archive?.[tab.id] || [];

    fs.writeFileSync(path.join(DATA_DIR, tab.dataFile),    dataFileBody(payload));
    fs.writeFileSync(path.join(DATA_DIR, tab.updateFile),  updateFileBody(updates, tab.updVar));
    fs.writeFileSync(path.join(DATA_DIR, tab.archiveFile), archiveFileBody(archive));
    console.log(`  ${tab.id.padEnd(10)} data·update(${updates.length})·archive(${archive.length})`);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, 'version.js'),
    `const DATA_VERSION = "${version}";\n`,
  );
  console.log(`[fetch-from-db] done`);
}

main().catch(e => { console.error(e.message || e); process.exit(1); });
