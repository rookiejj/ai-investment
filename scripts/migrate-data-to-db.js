#!/usr/bin/env node
/**
 * Phase 1: 기존 data/*.js (5탭 data + update + update-archive) → Supabase DB 초기 import.
 *
 * 한 번 실행하면 멱등 — 같은 source_hash는 dedup unique index가 차단.
 * 첫 실행 후 sandbox는 듀얼 라이팅 (파일 write + DB UPSERT) 시작.
 *
 * 사용:
 *   SUPABASE_URL=https://....supabase.co \
 *   BRIEFICK_SUPABASE_SECRET_KEY=sb_secret_... \
 *   node scripts/migrate-data-to-db.js
 *
 * 새 키 시스템(sb_secret_...) — Supabase Dashboard → Project Settings → API Keys → Secret keys.
 * RLS bypass 가능하니 절대 클라이언트·git에 노출 X. 기존 인스타 publish.js와 동일 env var 사용.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SECRET_KEY   = process.env.BRIEFICK_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
if (!SUPABASE_URL || !SECRET_KEY) {
  console.error('SUPABASE_URL·BRIEFICK_SUPABASE_SECRET_KEY 필요');
  process.exit(1);
}

const DATA_DIR = path.resolve(__dirname, '..', 'data');

const TABS = [
  { id: 'kr',        dataFile: 'kr-stocks-data.js',   updateFile: 'kr-stocks-update.js',   archiveFile: 'kr-stocks-update-archive.js' },
  { id: 'stocks',    dataFile: 'stocks-data.js',      updateFile: 'stocks-update.js',      archiveFile: 'stocks-update-archive.js' },
  { id: 'ai',        dataFile: 'ai-data.js',          updateFile: 'ai-update.js',          archiveFile: 'ai-update-archive.js' },
  { id: 'commodity', dataFile: 'commodity-data.js',   updateFile: 'commodity-update.js',   archiveFile: 'commodity-update-archive.js' },
  { id: 'unicorn',   dataFile: 'unicorn-data.js',     updateFile: 'unicorn-update.js',     archiveFile: 'unicorn-update-archive.js' },
];

// data/*.js 파일을 통째로 평가해서 그 안의 const 변수를 객체로 회수.
// AI탭의 META·BL·data 다중 export까지 호환.
function evalDataFile(file) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const wrapped = `${src}
    return {
      data:           typeof data           !== 'undefined' ? data           : null,
      META:           typeof META           !== 'undefined' ? META           : null,
      BL:             typeof BL             !== 'undefined' ? BL             : null,
      updates:        typeof updates        !== 'undefined' ? updates        : null,
      updatesArchive: typeof updatesArchive !== 'undefined' ? updatesArchive : null,
    };`;
  return new Function(wrapped)();
}

// "2026-05-12 19:10 KST" → ISO with +09:00
function kstToISO(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  const [, Y, M, D, h, mm, ss] = m;
  return `${Y}-${M}-${D}T${h}:${mm}:${ss || '00'}+09:00`;
}

function sha(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, 32);
}

// AI탭 entries 형식 / 다른 탭 summary+changes 형식 모두 hash 키 안정화
function entryHash(tabId, entry) {
  if (entry.entries) {
    // AI 형식: { date, entries: [{text, time}] }
    return sha(tabId + '|' + (entry.date || '') + '|' + (entry.entries[0]?.text || '').slice(0, 200));
  }
  // 일반 형식: { date, summary, changes }
  return sha(tabId + '|' + (entry.date || '') + '|' + (entry.summary || '').slice(0, 200));
}

async function supabaseRequest(method, pathSegment, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathSegment}`, {
    method,
    headers: {
      'apikey': SECRET_KEY,
      'Authorization': `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${method} ${pathSegment} ${res.status}: ${t.slice(0, 300)}`);
  }
}

async function upsertTabData(tabId, evaluated, version) {
  // ai탭은 META·BL·data 셋 다 / 다른 탭은 data만
  const payload = {};
  if (evaluated.META !== null) payload.META = evaluated.META;
  if (evaluated.BL   !== null) payload.BL   = evaluated.BL;
  payload.data = evaluated.data;

  await supabaseRequest('POST', 'tab_data', [{
    tab_id: tabId,
    payload,
    version,
  }]);
  console.log(`  [data] ${tabId} upsert (payload size ~${JSON.stringify(payload).length}B)`);
}

async function upsertEntries(tabId, entries, isArchive) {
  if (!entries || !entries.length) return 0;
  const rows = entries
    .map(e => {
      const ts = kstToISO(e.date);
      if (!ts) return null;
      return {
        tab_id: tabId,
        entry_date: ts,
        summary: e.summary || null,
        changes: e.changes || null,
        raw: e,
        is_archive: isArchive,
        source_hash: entryHash(tabId, e),
      };
    })
    .filter(Boolean);

  // chunk 100건씩
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    await supabaseRequest('POST', 'tab_updates?on_conflict=tab_id,source_hash', chunk);
  }
  console.log(`  [updates] ${tabId} ${isArchive ? 'archive' : 'main'} ${rows.length}건`);
  return rows.length;
}

async function main() {
  // version.js의 DATA_VERSION 추출
  let version = 'unknown';
  try {
    const verSrc = fs.readFileSync(path.join(DATA_DIR, 'version.js'), 'utf8');
    const m = verSrc.match(/DATA_VERSION\s*=\s*["']([^"']+)["']/);
    if (m) version = m[1];
  } catch {}
  console.log(`version: ${version}`);

  for (const tab of TABS) {
    console.log(`\n=== ${tab.id} ===`);
    try {
      const evaluated = evalDataFile(tab.dataFile);
      await upsertTabData(tab.id, evaluated, version);

      const updateEval = evalDataFile(tab.updateFile);
      await upsertEntries(tab.id, updateEval.updates, false);

      // archive 파일은 없는 탭도 있을 수 있음
      let archiveEval;
      try {
        archiveEval = evalDataFile(tab.archiveFile);
      } catch (e) {
        console.log(`  [updates] ${tab.id} archive 파일 없음/스킵 (${e.message.slice(0, 60)})`);
        continue;
      }
      await upsertEntries(tab.id, archiveEval.updatesArchive, true);
    } catch (e) {
      console.error(`  [error] ${tab.id}: ${e.message}`);
    }
  }
  console.log('\n완료');
}

main().catch(e => { console.error(e); process.exit(1); });
