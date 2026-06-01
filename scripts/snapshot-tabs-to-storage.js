#!/usr/bin/env node
/**
 * snapshot-tabs-to-storage — read-tab-data·read-tab-archive 응답을 정적 JSON으로 Storage에 박는다.
 *
 * 왜 필요한가 (2026-06-01, Supabase 무료 플랜 전환 후 헤드라인 로딩 지연 대응):
 *   기존 헤드라인 로딩은 매 방문마다 read-tab-data Edge Function → Postgres 2쿼리 직격.
 *   Cloudflare가 함수 응답을 캐시하지 않고(cf-cache-status: DYNAMIC), index.html이
 *   ?_=Date.now() 캐시버스터까지 붙여 모든 로드가 DB를 그대로 친다. 무료 플랜의 작은
 *   컴퓨트 + 잦은 콜드스타트가 이 직격 경로에 100% 노출돼 TTFB가 느려졌다.
 *
 *   이 스크립트는 db-sync(데이터 갱신) 직후 함수 응답을 그대로 떠서 public Storage에 올린다.
 *   Storage 객체는 Cloudflare CDN이 정상 캐시 → 프론트는 정적 파일을 먼저 읽어 DB·함수를
 *   읽기 경로에서 우회. DB는 여전히 source of truth, 함수는 폴백으로 유지된다.
 *
 * 흐름:
 *   1. read-tab-data  → { version, tabs, updates }  → tabs/latest.json
 *   2. read-tab-archive → { archive }               → tabs/archive.json
 *   둘 다 db-sync 직후라 DB 최신 상태를 반영.
 *
 * 사용:
 *   SUPABASE_URL=https://....supabase.co \
 *   BRIEFICK_SUPABASE_SECRET_KEY=<service key> \
 *   node scripts/snapshot-tabs-to-storage.js
 *
 * exit code: 항상 0 (best effort — 실패해도 프론트는 함수 폴백으로 정상 동작).
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';
const SECRET = process.env.BRIEFICK_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
const BUCKET = 'tabs';
// 데이터는 하루 몇 번만 갱신 — 2분 캐시 + stale-while-revalidate로 충분히 신선하면서 CDN 캐시 확보.
const CACHE_CONTROL = 'public, max-age=120, stale-while-revalidate=600';

if (!SECRET) {
  console.error('[snapshot-tabs] BRIEFICK_SUPABASE_SECRET_KEY 필요 — skip');
  process.exit(0);
}

async function fetchFn(name) {
  const r = await fetch(`${SUPABASE_URL}/functions/v1/${name}?_=${Date.now()}`);
  if (!r.ok) throw new Error(`${name} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SECRET}`, 'Content-Type': 'application/json', 'apikey': SECRET },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  if (!res.ok && res.status !== 409) {
    const t = await res.text();
    if (!t.includes('already exists')) console.warn(`[snapshot-tabs] bucket ${res.status}: ${t}`);
  }
}

async function upload(file, obj) {
  const body = JSON.stringify(obj);
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${file}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SECRET}`,
      'apikey': SECRET,
      'Content-Type': 'application/json',
      'x-upsert': 'true',
      'Cache-Control': CACHE_CONTROL,
    },
    body,
  });
  if (!res.ok) throw new Error(`upload ${file} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  console.log(`[snapshot-tabs] ${file} ✓ (${(body.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  await ensureBucket();

  // 헤드라인+종목 데이터 (read-tab-data 구조 그대로)
  try {
    const tabData = await fetchFn('read-tab-data');
    if (tabData && tabData.tabs && tabData.updates) {
      await upload('latest.json', tabData);
    } else {
      console.warn('[snapshot-tabs] read-tab-data 응답 구조 이상 — latest.json skip');
    }
  } catch (e) {
    console.warn('[snapshot-tabs] latest.json 실패:', e.message || e);
  }

  // 아카이브 (read-tab-archive 구조 그대로) — 비차단 lazy 로드용
  try {
    const archive = await fetchFn('read-tab-archive');
    if (archive && archive.archive) {
      await upload('archive.json', archive);
    } else {
      console.warn('[snapshot-tabs] read-tab-archive 응답 구조 이상 — archive.json skip');
    }
  } catch (e) {
    console.warn('[snapshot-tabs] archive.json 실패:', e.message || e);
  }
}

main().then(() => process.exit(0)).catch(e => {
  console.error('[snapshot-tabs] unexpected:', e);
  process.exit(0); // best effort
});
