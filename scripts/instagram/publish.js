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
 *   BRIEFICK_SUPABASE_SECRET_KEY        Supabase secret 키 (Storage 업로드용, RLS 우회)
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

// KST 날짜 + 시·분·초 — 같은 날 여러 번 실행 시 경로 충돌·CDN 캐시 회피
function kstNowDatePath() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000 + now.getTimezoneOffset() * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}/${hh}${mm}${ss}`;
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

// IG Graph API transient 에러 분류.
// 누적 사례:
//   - 9007 / error_subcode 2207027: media_publish "Media ID is not available" (FINISHED 후 내부 마무리 지연)
//   - error_subcode 2207085: "일반 내부 오류" (Meta 측 일시 내부 장애, 보통 1~5분 내 자동 회복)
//   - code 1 / error_subcode 99: generic "An unknown error" (IG fetcher 일시 장애)
//   - code -1: 내부 서버 오류 (subcode 2207085 등과 동반 출현)
//   - code 4 / 17 / 32: throttling·일시 서버 오류
//   - "Application request limit reached": app-level rate limit (보통 5~15분 윈도우)
// Meta가 직접 `is_transient: true` 플래그를 줄 때도 있으므로 그것도 함께 검증.
const TRANSIENT_PATTERNS = [
  /"is_transient"\s*:\s*true/,
  /"error_subcode"\s*:\s*(99|2207027|2207085)\b/,
  /"code"\s*:\s*9007\b/,
  /"code"\s*:\s*-1(?!\d)/,
  /"code"\s*:\s*1(?!\d)/,
  /"code"\s*:\s*4(?!\d)/,
  /"code"\s*:\s*17(?!\d)/,
  /"code"\s*:\s*32(?!\d)/,
  /Application request limit reached/i,
  /unknown error/i,
  /내부 서버 오류|내부 오류|준비/,
];

function isTransientGraphError(err) {
  const m = err?.message || '';
  return TRANSIENT_PATTERNS.some(p => p.test(m));
}

// rate limit은 transient 중에서도 회복 시간이 길다 → 별도 baseline으로 분리.
function isRateLimitError(err) {
  const m = err?.message || '';
  return (
    /Application request limit reached/i.test(m) ||
    /"code"\s*:\s*(4|17|32)(?!\d)/.test(m) ||
    /rate limit/i.test(m)
  );
}

// 지수 백오프 + ±15% jitter. rate limit이면 baseline 길게(60s).
// cap 5분에 도달하면 그대로 유지되므로 오래 걸려도 결국 통과 가능.
function computeBackoffMs(err, attempt) {
  const isRate = isRateLimitError(err);
  const base = isRate ? 60_000 : 7_000;
  const multiplier = isRate ? 1.5 : 1.6;
  const cap = 300_000; // 5 min
  const exp = Math.min(base * Math.pow(multiplier, attempt), cap);
  const jitter = (Math.random() * 0.3 - 0.15) * exp; // ±15%
  return Math.max(1000, Math.floor(exp + jitter));
}

// children 컨테이너 생성 재시도 — IG fetcher가 Supabase Storage 첫 fetch 실패 시 자주 발생.
// 8회 + 백오프로 최대 ~15분 커버 (Meta 일시 장애 자체 회복 시간을 충분히 흡수).
async function createChildWithRetry(igUserId, imageUrl, token) {
  const MAX_TRIES = 8;
  let lastErr;
  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      return await igPost(`${igUserId}/media`, {
        image_url: imageUrl,
        is_carousel_item: 'true',
      }, token);
    } catch (e) {
      lastErr = e;
      if (!isTransientGraphError(e)) throw e;
      const wait = computeBackoffMs(e, i);
      console.warn(`  ↻ child 재시도 ${i+1}/${MAX_TRIES} (${Math.round(wait/1000)}s 후): ${e.message.slice(0, 120)}`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// 게시 성공 검증 — 두 단계 교차 확인.
// Meta API가 publish 호출에 fatal/2207085 등을 반환해도 실제 게시는 커밋된 케이스가 있다.
// 컨테이너 status_code 단일 검증은 신뢰도가 낮아(케이스 따라 PUBLISHED로 안 transition됨)
// IG 사용자 최근 미디어 목록을 백업으로 사용해 실제 포스팅 존재 여부를 직접 확인한다.
//
//   - 1차: 컨테이너 status_code === 'PUBLISHED' (싸고 빠름, 일부 케이스만 잡힘)
//   - 2차: IG /me/media에서 캡션 prefix 매칭 + 30분 이내 timestamp (가장 신뢰 가능)
async function verifyPublished(igUserId, containerId, captionPrefix, token) {
  // 1) 컨테이너 status_code — 가장 빠른 길
  try {
    const j = await igGet(containerId, { fields: 'status_code,status' }, token);
    if (j.status_code === 'PUBLISHED') {
      return { method: 'status_code', mediaId: containerId, detail: 'status_code=PUBLISHED' };
    }
    // 진단 로그: status_code가 PUBLISHED 아니면 어떤 값인지 노출
    console.log(`  🔍 container status_code=${j.status_code || 'n/a'}`);
  } catch (e) {
    console.warn(`  ⚠ status_code 조회 실패: ${e.message.slice(0, 80)}`);
  }

  // 2) IG 최근 미디어 목록 — 캡션 prefix 매칭 + 최근 30분 이내 timestamp
  // 캡션 첫 줄("2026-05-01 (금) 브리픽 데일리" 등)로 우리 게시물 식별.
  if (captionPrefix) {
    try {
      const j = await igGet(`${igUserId}/media`, {
        fields: 'id,caption,timestamp',
        limit: 5,
      }, token);
      const items = j.data || [];
      const cutoffMs = Date.now() - 30 * 60 * 1000;
      for (const item of items) {
        if (!item.timestamp || !item.caption) continue;
        const ts = new Date(item.timestamp).getTime();
        if (ts >= cutoffMs && item.caption.startsWith(captionPrefix)) {
          return { method: 'recent_media', mediaId: item.id, detail: `media_id=${item.id} ts=${item.timestamp}` };
        }
      }
      console.log(`  🔍 최근 미디어 ${items.length}개 중 매칭 없음 (prefix='${captionPrefix.slice(0, 40)}')`);
    } catch (e) {
      console.warn(`  ⚠ 최근 미디어 조회 실패: ${e.message.slice(0, 80)}`);
    }
  }

  return null;
}

// media_publish 재시도 — 발행 단계는 가장 크리티컬하므로 12회 + 백오프로 ~30분 커버.
// rate limit 윈도우(보통 5~15분)와 Meta 측 일시 장애를 모두 통과시키는 게 목표.
// 추가로 매 실패 직후 verifyPublished()로 false-failure(API는 실패라 답하지만
// 실제 게시는 성공한 케이스)를 자체 회복 — verification 성공 시 retry 즉시 종료.
async function publishWithRetry(igUserId, creationId, token, captionPrefix) {
  const MAX_TRIES = 12;
  let lastErr;
  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      return await igPost(`${igUserId}/media_publish`, { creation_id: creationId }, token);
    } catch (e) {
      lastErr = e;

      // 매 실패 직후 게시 검증 — 실제 게시 성공이면 retry 즉시 종료 (대기 시간 절약)
      const verify = await verifyPublished(igUserId, creationId, captionPrefix, token);
      if (verify) {
        console.log(`  ✓ 게시 검증 완료 (${verify.method}) — ${verify.detail} — Meta API는 실패 응답했으나 실제 게시 완료 (false-failure 자체 회복)`);
        return { id: verify.mediaId, false_failure_recovered: true, verify };
      }

      if (!isTransientGraphError(e)) throw e;
      const wait = computeBackoffMs(e, i);
      console.warn(`  ↻ publish 재시도 ${i+1}/${MAX_TRIES} (${Math.round(wait/1000)}s 후): ${e.message.slice(0, 120)}`);
      await new Promise(r => setTimeout(r, wait));
    }
  }

  // 모든 재시도 실패 — verification이 retry 루프보다 늦게 도달했을 가능성에 대비해 최종 한 번 더.
  const finalVerify = await verifyPublished(igUserId, creationId, captionPrefix, token);
  if (finalVerify) {
    console.log(`  ✓ 게시 검증 완료 (${finalVerify.method}, retry 종료 후) — ${finalVerify.detail}`);
    return { id: finalVerify.mediaId, false_failure_recovered: true, verify: finalVerify };
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
  const SB_KEY    = reqEnv('BRIEFICK_SUPABASE_SECRET_KEY');
  const BUCKET    = process.env.IG_CAROUSEL_BUCKET || 'instagram-carousel';

  // 환경 점검 — 흔한 실수 (https:// 누락·legacy 키) 즉시 표면화
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(SB_URL)) {
    console.warn(`⚠ SUPABASE_URL 포맷 의심: '${SB_URL}'`);
    console.warn(`  → 정상 예시: 'https://xxxxxxx.supabase.co'`);
  }
  if (!SB_KEY.startsWith('sb_secret_') && !SB_KEY.startsWith('eyJ')) {
    console.warn(`⚠ BRIEFICK_SUPABASE_SECRET_KEY 포맷 의심 — sb_secret_... 또는 eyJ...(legacy) 시작이어야 함`);
  }
  console.log(`Supabase: ${SB_URL.replace(/\/$/, '')} · 버킷: ${BUCKET}`);
  console.log(`IG User: ${IG_USER}`);

  // 1) Storage 업로드
  const supabase = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
  const datePath = kstNowDatePath();
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

  // Storage 업로드 직후 IG fetcher가 Cloudflare 캐시 워밍 전 fetch 시도 시
  // "unknown error"가 자주 발생 — 5초 버퍼.
  console.log('  · Storage→IG 안정화 5초 대기');
  await new Promise(r => setTimeout(r, 5000));

  // 2) children 컨테이너 7개 (transient 에러 시 자동 재시도)
  console.log('[2/3] IG children 컨테이너 생성');
  const childrenIds = [];
  for (let i = 0; i < publicUrls.length; i++) {
    const j = await createChildWithRetry(IG_USER, publicUrls[i], TOKEN);
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

  // verifyPublished()용 캡션 prefix — 첫 줄(날짜+브리픽 데일리 헤더)이 매일 고유해 매칭 키로 사용.
  const captionPrefix = caption.split('\n')[0].trim();
  const published = await publishWithRetry(IG_USER, parent.id, TOKEN, captionPrefix);
  if (published.false_failure_recovered) {
    console.log(`✓ 게시 완료 (false-failure 자체 회복, ${published.verify?.method || 'unknown'}): ${published.verify?.detail || `container_id=${parent.id}`}`);
  } else {
    console.log(`✓ 게시 완료: media_id=${published.id}`);
  }
}

main().catch(err => {
  console.error('게시 실패:', err.message);
  process.exit(1);
});
