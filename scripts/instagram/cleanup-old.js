#!/usr/bin/env node
/**
 * cleanup-old — instagram-carousel 버킷의 오래된 발행 원본 정리.
 *
 * publish.js는 매 발행마다 posts/YYYY-MM-DD/HHMMSS/ 아래에 캐러셀 PNG + 릴스 mp4를
 * 업로드하고 삭제는 안 한다. 하루치 ~10~15MB(png+mp4) 영구 적재 → 연 ~4GB+.
 *
 * 이 원본은 "발행 순간에만" 필요하다: Instagram Graph API가 image_url/video_url을
 * 받아 자체 서버로 재호스팅하므로, 발행 완료 후 Supabase 원본은 dead weight.
 * 웹사이트·다른 코드는 이 버킷을 참조하지 않는다(발행 전용). → 지난 날짜는 삭제 안전.
 *
 * 동작: posts/ 하위 날짜 폴더(YYYY-MM-DD) 중 최신 KEEP_DAYS일치만 남기고
 *       그보다 오래된 날짜 폴더의 모든 객체를 bulk delete.
 *
 * 안전장치:
 *   - 날짜 폴더명은 YYYY-MM-DD 고정폭 → 문자열 정렬 = 시간 정렬. 최신 KEEP_DAYS개 보존.
 *   - best effort: 실패해도 항상 exit 0 — 발행 파이프라인을 막지 않는다.
 *
 * 사용:
 *   BRIEFICK_SUPABASE_SECRET_KEY=<service key> [IG_KEEP_DAYS=7] node scripts/instagram/cleanup-old.js
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';
const SECRET = process.env.BRIEFICK_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
const BUCKET = process.env.IG_CAROUSEL_BUCKET || 'instagram-carousel';
const KEEP_DAYS = Math.max(1, parseInt(process.env.IG_KEEP_DAYS || '7', 10));
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const H = () => ({ Authorization: `Bearer ${SECRET}`, apikey: SECRET, 'Content-Type': 'application/json' });

async function list(prefix) {
  let all = [], offset = 0;
  for (;;) {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
      method: 'POST', headers: H(),
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } }),
    });
    if (!r.ok) { console.log(`[ig-cleanup] list ${r.status} @${prefix}`); return all; }
    const rows = await r.json();
    if (!rows.length) break;
    all = all.concat(rows);
    if (rows.length < 1000) break;
    offset += 1000;
  }
  return all;
}

// prefix 아래 모든 파일 경로(full path) 재귀 수집
async function collectFiles(prefix) {
  let out = [];
  for (const o of await list(prefix)) {
    if (o.id === null) out = out.concat(await collectFiles(prefix + o.name + '/'));
    else out.push(prefix + o.name);
  }
  return out;
}

async function main() {
  if (!SECRET) { console.log('[ig-cleanup] BRIEFICK_SUPABASE_SECRET_KEY 없음 — skip'); return; }

  const dates = (await list('posts/'))
    .filter(o => o.id === null && DATE_RE.test(o.name))
    .map(o => o.name)
    .sort()
    .reverse(); // 최신 먼저

  const keep = dates.slice(0, KEEP_DAYS);
  const drop = dates.slice(KEEP_DAYS);
  console.log(`[ig-cleanup] 날짜 폴더 ${dates.length}개 (KEEP ${KEEP_DAYS}일: ${keep.join(', ') || '없음'})`);
  if (!drop.length) { console.log('[ig-cleanup] 삭제 대상 없음'); return; }

  let paths = [];
  for (const d of drop) paths = paths.concat(await collectFiles(`posts/${d}/`));
  console.log(`[ig-cleanup] 삭제 대상 ${drop.length}일 · ${paths.length}개 파일 (${drop[drop.length - 1]} ~ ${drop[0]})`);
  if (!paths.length) return;

  // bulk delete — 200개씩 배치
  let deleted = 0;
  for (let i = 0; i < paths.length; i += 200) {
    const batch = paths.slice(i, i + 200);
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
      method: 'DELETE', headers: H(), body: JSON.stringify({ prefixes: batch }),
    });
    if (!r.ok) { console.log(`[ig-cleanup] delete ${r.status}: ${(await r.text()).slice(0, 200)}`); continue; }
    deleted += batch.length;
  }
  console.log(`[ig-cleanup] ${deleted}개 파일 삭제 완료`);
}

main().catch(e => console.log('[ig-cleanup] fail(무시):', e.message)).finally(() => process.exit(0));
