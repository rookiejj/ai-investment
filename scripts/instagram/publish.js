#!/usr/bin/env node
/**
 * Briefick — 인스타그램 캐러셀 게시
 *
 * 단계:
 *   1) scripts/instagram/out/01.png ~ 07.png + meta.json 로드
 *   2) Supabase Storage(공개 버킷)에 업로드 → 공개 URL 7개 확보
 *   3) IG Graph API:
 *        a. 슬라이드별 children 컨테이너 7개 생성 (is_carousel_item=true)
 *        b. CAROUSEL 부모 컨테이너 생성 (children=[id1..id7], caption)
 *        c. media_publish 로 게시
 *
 * 필수 ENV:
 *   META_ACCESS_TOKEN          IG Graph API 장기 토큰
 *   IG_BUSINESS_USER_ID        IG 비즈니스 계정 ID (숫자)
 *   SUPABASE_URL               https://xxx.supabase.co
 *   SUPABASE_SECRET_KEY        Supabase secret 키 (Storage 업로드용, RLS 우회)
 *
 * 선택 ENV:
 *   IG_CAROUSEL_BUCKET   기본값 'instagram-carousel'
 *   IG_DRY_RUN=1         업로드·게시하지 않고 캡션·URL만 출력
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { buildCaption } = require('./caption');

const OUT_DIR = path.join(__dirname, 'out');
const SLIDE_FILES = ['01.png','02.png','03.png','04.png','05.png','06.png','07.png'];
const GRAPH_VERSION = 'v21.0';

function reqEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`필수 환경 변수 누락: ${name}`);
  return v;
}

function kstNowIsoDate() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000 + now.getTimezoneOffset() * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 1차: supabase-js 사용. 실패 시 2차: raw fetch로 재시도해서 supabase-js 레이어 문제와 서버 레이어 문제를 구분.
async function uploadToStorage(supabase, bucket, datePath, file, ctx) {
  const local = path.join(OUT_DIR, file);
  const buf = fs.readFileSync(local);
  const remote = `posts/${datePath}/${file}`;

  // 1차 시도 — supabase-js
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(remote, buf, { contentType: 'image/png', upsert: true });
    if (error) {
      console.warn(`  ⚠ supabase-js 업로드 실패: ${error.message} (status=${error.statusCode || 'n/a'})`);
      // 2차로 진행
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(remote);
      if (!data?.publicUrl) throw new Error(`publicUrl 조회 실패: ${remote}`);
      return data.publicUrl;
    }
  } catch (e) {
    console.warn(`  ⚠ supabase-js 예외: ${e.name}: ${e.message}`);
    if (e.cause) console.warn(`     cause: ${e.cause.code || ''} ${e.cause.message || e.cause}`);
  }

  // 2차 시도 — raw fetch (Uint8Array 사용, Buffer 호환성 문제 회피)
  console.log(`  ↻ raw fetch 폴백 시도 (${file})`);
  const url = `${ctx.url}/storage/v1/object/${bucket}/${remote}`;
  const body = new Uint8Array(buf.byteLength);
  body.set(buf);
  let res, text;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ctx.key}`,
        'apikey': ctx.key,
        'Content-Type': 'image/png',
        'x-upsert': 'true',
        'cache-control': 'max-age=3600',
      },
      body,
    });
    text = await res.text();
  } catch (e) {
    throw new Error(
      `raw fetch 업로드 실패(${file}): ${e.name}: ${e.message}\n` +
      `  cause: ${e.cause?.code || ''} ${e.cause?.message || e.cause || ''}\n` +
      `  → URL: ${url}\n` +
      `  → 가능 원인: GitHub Actions ↔ Supabase 네트워크 차단·DNS·TLS 문제`
    );
  }
  if (!res.ok) {
    throw new Error(
      `raw fetch 업로드 실패(${file}): HTTP ${res.status}\n` +
      `  서버 응답: ${text.slice(0, 500)}\n` +
      `  → URL: ${url}\n` +
      `  → 가능 원인: 버킷 정책(MIME 제한·파일 사이즈 제한)·키 권한·storage.objects RLS`
    );
  }
  // 성공 → publicUrl 직접 구성
  return `${ctx.url}/storage/v1/object/public/${bucket}/${remote}`;
}

async function igPost(endpoint, params, token) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}`;
  const body = new URLSearchParams({ ...params, access_token: token });
  const res = await fetch(url, { method: 'POST', body });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`Graph API 오류 ${endpoint}: ${JSON.stringify(json.error || json)}`);
  }
  return json;
}

async function igGet(endpoint, params, token) {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}`);
  for (const [k,v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('access_token', token);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`Graph API GET 오류 ${endpoint}: ${JSON.stringify(json.error || json)}`);
  }
  return json;
}

// 컨테이너 status_code가 FINISHED 될 때까지 폴링 (최대 90초)
// CAROUSEL parent는 children 7장 묶음 처리라 더 길게 잡는다.
async function waitContainerReady(igUserId, containerId, token, label) {
  const MAX_TRIES = 30;       // 30회 × 3초 = 최대 90초
  const INTERVAL_MS = 3000;
  for (let i = 0; i < MAX_TRIES; i++) {
    const j = await igGet(containerId, { fields: 'status_code,status' }, token);
    if (j.status_code === 'FINISHED') return;
    if (j.status_code === 'ERROR' || j.status_code === 'EXPIRED') {
      throw new Error(`${label} 컨테이너 실패: ${JSON.stringify(j)}`);
    }
    await new Promise(r => setTimeout(r, INTERVAL_MS));
  }
  console.warn(`경고: ${label} 컨테이너 status 폴링 90초 타임아웃, publish 강행`);
}

// media_publish 일시 실패(9007/2207027 "준비 안 됨") 재시도
// IG는 status가 FINISHED여도 내부 마무리에 추가 시간이 필요한 경우가 흔함.
async function publishWithRetry(igUserId, creationId, token) {
  const MAX_TRIES = 6;        // 6회 × 7초 = 최대 42초 추가 대기
  const INTERVAL_MS = 7000;
  let lastErr;
  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      return await igPost(`${igUserId}/media_publish`, { creation_id: creationId }, token);
    } catch (e) {
      lastErr = e;
      const transient = /9007|2207027|Media ID is not available|준비/.test(e.message);
      if (!transient) throw e;
      console.warn(`  ↻ publish 재시도 ${i+1}/${MAX_TRIES}: ${e.message.slice(0, 120)}`);
      await new Promise(r => setTimeout(r, INTERVAL_MS));
    }
  }
  throw lastErr;
}

async function main() {
  // 0) 입력 검증
  if (!fs.existsSync(path.join(OUT_DIR, 'meta.json'))) {
    throw new Error('meta.json 없음. 먼저 render-slides.js를 실행해.');
  }
  for (const f of SLIDE_FILES) {
    if (!fs.existsSync(path.join(OUT_DIR, f))) throw new Error(`슬라이드 누락: ${f}`);
  }
  const meta = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'meta.json'), 'utf8'));
  const caption = buildCaption(meta);
  const dryRun = process.env.IG_DRY_RUN === '1';

  console.log('--- 캡션 미리보기 ---');
  console.log(caption);
  console.log('---------------------');

  if (dryRun) {
    console.log('IG_DRY_RUN=1 — 업로드/게시 생략.');
    return;
  }

  const TOKEN     = reqEnv('META_ACCESS_TOKEN');
  const IG_USER   = reqEnv('IG_BUSINESS_USER_ID');
  const SB_URL    = reqEnv('SUPABASE_URL');
  const SB_KEY    = reqEnv('SUPABASE_SECRET_KEY');
  const BUCKET    = process.env.IG_CAROUSEL_BUCKET || 'instagram-carousel';

  // 환경 점검 — 흔한 실수 (https:// 누락·legacy 키) 즉시 표면화
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(SB_URL)) {
    console.warn(`⚠ SUPABASE_URL 포맷 의심: '${SB_URL}'`);
    console.warn(`  → 정상 예시: 'https://xxxxxxx.supabase.co'`);
  }
  if (!SB_KEY.startsWith('sb_secret_') && !SB_KEY.startsWith('eyJ')) {
    console.warn(`⚠ SUPABASE_SECRET_KEY 포맷 의심 — sb_secret_... 또는 eyJ...(legacy) 시작이어야 함`);
  }
  console.log(`Supabase: ${SB_URL.replace(/\/$/, '')} · 버킷: ${BUCKET}`);
  console.log(`IG User: ${IG_USER}`);

  // 1) Storage 업로드
  const supabase = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
  const datePath = kstNowIsoDate();
  console.log(`[1/3] Storage 업로드 → ${BUCKET}/posts/${datePath}/`);
  const ctx = { url: SB_URL.replace(/\/$/, ''), key: SB_KEY };
  // 키 형식 진단 (값 노출 X — 접두사·길이만)
  const prefix = SB_KEY.slice(0, 10);
  console.log(`  · 키 진단: 접두사='${prefix}...' 길이=${SB_KEY.length}`);
  const publicUrls = [];
  for (const f of SLIDE_FILES) {
    const url = await uploadToStorage(supabase, BUCKET, datePath, f, ctx);
    console.log(`  ✓ ${f} → ${url}`);
    publicUrls.push(url);
  }

  // 2) children 컨테이너 7개
  console.log('[2/3] IG children 컨테이너 생성');
  const childrenIds = [];
  for (let i = 0; i < publicUrls.length; i++) {
    const j = await igPost(`${IG_USER}/media`, {
      image_url: publicUrls[i],
      is_carousel_item: 'true',
    }, TOKEN);
    console.log(`  ✓ child ${i+1}/7 id=${j.id}`);
    childrenIds.push(j.id);
  }

  // children FINISHED 대기
  for (let i = 0; i < childrenIds.length; i++) {
    await waitContainerReady(IG_USER, childrenIds[i], TOKEN, `child ${i+1}`);
  }

  // 3) CAROUSEL 부모
  console.log('[3/3] CAROUSEL 부모 컨테이너 생성 + publish');
  const parent = await igPost(`${IG_USER}/media`, {
    media_type: 'CAROUSEL',
    children: childrenIds.join(','),
    caption,
  }, TOKEN);
  console.log(`  ✓ parent id=${parent.id}`);

  await waitContainerReady(IG_USER, parent.id, TOKEN, 'parent');
  // FINISHED 직후에도 IG 내부 큐가 마무리 안 된 경우가 흔해 5초 버퍼 후 publish 시도.
  await new Promise(r => setTimeout(r, 5000));

  const published = await publishWithRetry(IG_USER, parent.id, TOKEN);
  console.log(`✓ 게시 완료: media_id=${published.id}`);
}

main().catch(err => {
  console.error('게시 실패:', err.message);
  process.exit(1);
});
