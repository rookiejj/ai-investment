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

async function uploadToStorage(supabase, bucket, datePath, file) {
  const local = path.join(OUT_DIR, file);
  const buf = fs.readFileSync(local);
  const remote = `posts/${datePath}/${file}`;
  let result;
  try {
    result = await supabase.storage
      .from(bucket)
      .upload(remote, buf, { contentType: 'image/png', upsert: true });
  } catch (e) {
    // 네트워크 단절·DNS 실패·TLS 오류 등 저수준 에러
    throw new Error(
      `Storage 업로드 실패(${file}): ${e.message}\n` +
      `  → 점검: SUPABASE_URL이 'https://xxx.supabase.co' 형식인지, 프로젝트가 일시정지(paused) 상태가 아닌지`
    );
  }
  const { error } = result;
  if (error) {
    // supabase-js 응답 객체에 담긴 에러 (인증·권한·버킷 누락 등)
    throw new Error(
      `Storage 업로드 실패(${file}): ${error.message}\n` +
      `  → 점검: 버킷 '${bucket}'이 존재하고 public인지, SUPABASE_SECRET_KEY가 새 포맷(sb_secret_...)인지`
    );
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(remote);
  if (!data?.publicUrl) throw new Error(`publicUrl 조회 실패: ${remote}`);
  return data.publicUrl;
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

// children 컨테이너의 status_code가 FINISHED 될 때까지 폴링 (최대 30초)
async function waitContainerReady(igUserId, containerId, token, label) {
  for (let i = 0; i < 15; i++) {
    const j = await igGet(containerId, { fields: 'status_code,status' }, token);
    if (j.status_code === 'FINISHED') return;
    if (j.status_code === 'ERROR' || j.status_code === 'EXPIRED') {
      throw new Error(`${label} 컨테이너 실패: ${JSON.stringify(j)}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  // 타임아웃이라도 일단 publish 시도 — 작은 이미지는 빠르게 끝남
  console.warn(`경고: ${label} 컨테이너 status 폴링 타임아웃, publish 강행`);
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
  const publicUrls = [];
  for (const f of SLIDE_FILES) {
    const url = await uploadToStorage(supabase, BUCKET, datePath, f);
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

  const published = await igPost(`${IG_USER}/media_publish`, {
    creation_id: parent.id,
  }, TOKEN);
  console.log(`✓ 게시 완료: media_id=${published.id}`);
}

main().catch(err => {
  console.error('게시 실패:', err.message);
  process.exit(1);
});
