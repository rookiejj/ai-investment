#!/usr/bin/env node
/**
 * cleanup-old — cartoon 버킷의 오래된 dated PNG 정리.
 *
 * generate.js는 매 실행마다 today-YYYYMMDD-HHMM.png 를 새로 upsert하고 삭제는 안 한다.
 * 하루 2장(KST 08·20시)씩 영구 적재 → 연 ~410MB. 프론트는 latest.txt가 가리키는 1장만
 * 읽으므로 옛 파일은 안 보일 뿐 Storage엔 쌓인다. 이 스크립트가 최신 KEEP개만 남기고 삭제.
 *
 * 안전장치:
 *   - dated 파일명(today-YYYYMMDD-HHMM.png)은 고정폭이라 이름 내림차순 = 시간 내림차순.
 *     최신 KEEP개를 남기므로 latest.txt가 가리키는 최신 파일은 항상 보존.
 *   - latest.txt가 가리키는 파일은 추가로 삭제 대상에서 명시 제외(이중 안전).
 *   - best effort: 실패해도 항상 exit 0 — 발행 파이프라인을 막지 않는다.
 *
 * 사용:
 *   BRIEFICK_SUPABASE_SECRET_KEY=<service key> [CARTOON_KEEP=30] node scripts/cartoon/cleanup-old.js
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';
const SECRET = process.env.BRIEFICK_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
const BUCKET = 'cartoon';
const KEEP = Math.max(2, parseInt(process.env.CARTOON_KEEP || '30', 10)); // 최신 30장 ≈ 15일

const DATED_RE = /^today-\d{8}-\d{4}\.png$/;

async function main() {
  if (!SECRET) { console.log('[cleanup] BRIEFICK_SUPABASE_SECRET_KEY 없음 — skip'); return; }
  const headers = { 'Authorization': `Bearer ${SECRET}`, 'apikey': SECRET, 'Content-Type': 'application/json' };

  // 1) latest.txt가 가리키는 파일(절대 삭제 금지)
  let latest = '';
  try {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/latest.txt?_=${Date.now()}`);
    if (r.ok) latest = (await r.text()).trim();
  } catch { /* 무시 */ }

  // 2) 버킷 전체 나열 (service key라야 RLS 통과)
  const listRes = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST', headers,
    body: JSON.stringify({ prefix: '', limit: 1000, sortBy: { column: 'name', order: 'desc' } }),
  });
  if (!listRes.ok) { console.log(`[cleanup] list ${listRes.status} — skip`); return; }
  const objs = await listRes.json();

  const dated = objs.map(o => o.name).filter(n => DATED_RE.test(n)).sort().reverse(); // 최신 먼저
  console.log(`[cleanup] dated PNG ${dated.length}장 (KEEP ${KEEP}, latest=${latest || '?'})`);

  const toDelete = dated.slice(KEEP).filter(n => n !== latest);
  if (!toDelete.length) { console.log('[cleanup] 삭제 대상 없음'); return; }

  // 3) bulk delete
  const delRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE', headers,
    body: JSON.stringify({ prefixes: toDelete }),
  });
  if (!delRes.ok) { console.log(`[cleanup] delete ${delRes.status}: ${(await delRes.text()).slice(0, 200)}`); return; }
  console.log(`[cleanup] ${toDelete.length}장 삭제 (가장 오래된: ${toDelete[toDelete.length - 1]})`);
}

main().catch(e => { console.log('[cleanup] fail(무시):', e.message); }).finally(() => process.exit(0));
