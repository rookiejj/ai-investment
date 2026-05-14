#!/usr/bin/env node
/**
 * sync-to-db — 5탭 *-data.js / *-update.js (entries[0])를 Supabase로 동기화.
 *
 * sandbox가 모든 데이터 편집·트리밍·lint·version 갱신 완료 후 한 줄로 호출.
 * 기존 GitHub push_files(파일 path)와 별개·동시 진행 — 한쪽 fail해도 다른 쪽 fallback.
 *
 * 사용:
 *   SUPABASE_URL=https://....supabase.co \
 *   BRIEFICK_WRITE_SECRET=<secret> \
 *   node scripts/sync-to-db.js
 *
 * exit code:
 *   0 — 5탭 모두 또는 일부 성공 (best effort, 부분 성공도 정상으로 간주)
 *   1 — 환경변수 누락·init fail (5탭 모두 호출조차 안 됐을 때)
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';
const WRITE_SECRET = process.env.BRIEFICK_WRITE_SECRET;
if (!WRITE_SECRET) {
  console.error('BRIEFICK_WRITE_SECRET 필요');
  process.exit(1);
}

const DATA_DIR = path.resolve(__dirname, '..', 'data');

const TABS = [
  { id: 'kr',        dataFile: 'kr-stocks-data.js',   updateFile: 'kr-stocks-update.js' },
  { id: 'stocks',    dataFile: 'stocks-data.js',      updateFile: 'stocks-update.js' },
  { id: 'ai',        dataFile: 'ai-data.js',          updateFile: 'ai-update.js' },
  { id: 'commodity', dataFile: 'commodity-data.js',   updateFile: 'commodity-update.js' },
  { id: 'unicorn',   dataFile: 'unicorn-data.js',     updateFile: 'unicorn-update.js' },
];

function evalDataFile(file) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const wrapped = `${src}
    return {
      data:    typeof data    !== 'undefined' ? data    : null,
      META:    typeof META    !== 'undefined' ? META    : null,
      BL:      typeof BL      !== 'undefined' ? BL      : null,
      updates: typeof updates !== 'undefined' ? updates : (typeof UPDATES !== 'undefined' ? UPDATES : null),
    };`;
  return new Function(wrapped)();
}

function readVersion() {
  try {
    const src = fs.readFileSync(path.join(DATA_DIR, 'version.js'), 'utf8');
    const m = src.match(/DATA_VERSION\s*=\s*["']([^"']+)["']/);
    return m ? m[1] : 'unknown';
  } catch {
    return 'unknown';
  }
}

async function callEdgeFn(name, body) {
  const url = `${SUPABASE_URL}/functions/v1/${name}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Briefick-Secret': WRITE_SECRET,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${name} ${res.status}: ${text.slice(0, 200)}`);
  }
  try { return JSON.parse(text); } catch { return { ok: true, raw: text }; }
}

async function writeTabData(tabId, evaluated, version) {
  const payload = {};
  if (evaluated.META !== null) payload.META = evaluated.META;
  if (evaluated.BL   !== null) payload.BL   = evaluated.BL;
  payload.data = evaluated.data;
  return callEdgeFn('write-tab-data', { tab_id: tabId, payload, version });
}

async function writeTabUpdate(tabId, entry) {
  return callEdgeFn('write-tab-update', { tab_id: tabId, entry });
}

async function syncTab(tab, version) {
  const summary = { tab: tab.id, data: false, update: false, error: null };
  try {
    const evaluated = evalDataFile(tab.dataFile);
    await writeTabData(tab.id, evaluated, version);
    summary.data = true;

    const updateEval = evalDataFile(tab.updateFile);
    const entries = updateEval.updates || [];
    // entries[0]만 보냄 — 가장 최근. dedup으로 멱등 보장.
    if (entries.length > 0) {
      const result = await writeTabUpdate(tab.id, entries[0]);
      summary.update = true;
      summary.deduped = !!result?.deduped;
    } else {
      summary.update = true; // entries 없는 탭도 정상으로 간주
    }
  } catch (e) {
    summary.error = (e.message || String(e)).slice(0, 200);
  }
  return summary;
}

async function main() {
  const version = readVersion();
  console.log(`[sync-to-db] version=${version}`);

  const results = [];
  for (const tab of TABS) {
    const r = await syncTab(tab, version);
    results.push(r);
    const status = r.error ? `FAIL: ${r.error}` :
      `OK${r.deduped ? ' (deduped)' : ''}`;
    console.log(`  ${r.tab.padEnd(10)} data=${r.data?'✓':'✗'} update=${r.update?'✓':'✗'} ${status}`);
  }

  const fails = results.filter(r => r.error).length;
  console.log(`[sync-to-db] ${TABS.length - fails}/${TABS.length} 성공`);

  // best effort: 어떤 결과든 exit 0 (파일 push가 fallback이라 sandbox 흐름 안 멈춤)
  process.exit(0);
}

main().catch(e => {
  console.error('[sync-to-db] unexpected:', e);
  process.exit(0); // best effort
});
