#!/usr/bin/env node
/**
 * 신문 1면 hero PNG 자동 생성 (2026-05-14~).
 *
 * 이전: Gemini nano-banana-pro로 1컷 만화 PNG 생성 (~$0.13/장 × 2회/일)
 * 이후: Playwright HTML→PNG로 5탭 헤드라인 신문 1면 PNG 생성 (비용 0)
 *
 * 흐름:
 *   1. Supabase read-tab-data → 5탭 최신 entries[0].summary 첫 줄
 *   2. data/.catchphrase 파일 있으면 그 한 줄(또는 두 줄) 사용
 *   3. scripts/cartoon/template.html 토큰 치환 후 Playwright로 1080×1350 PNG 캡처
 *   4. Supabase Storage cartoon/today.png에 PUT (frontend·인스타·OG 모두 같은 경로)
 *
 * 사용:
 *   node scripts/cartoon/generate.js
 *     → out/today.png 저장 + (BRIEFICK_SUPABASE_SECRET_KEY 있으면) Storage 업로드
 *   node scripts/cartoon/generate.js --upload
 *     → 명시적 업로드 (env 누락 시 실패)
 *   node scripts/cartoon/generate.js --no-upload
 *     → 로컬 PNG만 (검증용)
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';
const SECRET = process.env.BRIEFICK_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
const TEMPLATE = path.resolve(__dirname, 'template.html');
const OUT_DIR = path.resolve(__dirname, 'out');
const OUT_PNG = path.join(OUT_DIR, 'today.png');
const CATCHPHRASE_FILE = path.resolve(__dirname, '..', '..', 'data', '.catchphrase');

const args = process.argv.slice(2);
const noUpload = args.includes('--no-upload');
const forceUpload = args.includes('--upload');

// ─── 데이터 ─────────────────────────────────────────────
async function fetchUpdates() {
  const r = await fetch(`${SUPABASE_URL}/functions/v1/read-tab-data?_=${Date.now()}`);
  if (!r.ok) throw new Error(`read-tab-data ${r.status}`);
  const j = await r.json();
  return j.updates || {};
}

function pickHeadline(entry) {
  if (!entry) return '';
  const raw = entry.summary || entry.text || '';
  const lines = String(raw).split('\n').map(s => s.trim()).filter(Boolean);
  return lines[0] || '';
}

function readCatchphrase() {
  if (fs.existsSync(CATCHPHRASE_FILE)) {
    const txt = fs.readFileSync(CATCHPHRASE_FILE, 'utf8').trim();
    if (txt) return txt.replace(/\n/g, '<br>');
  }
  // fallback — sandbox가 .catchphrase 아직 안 만든 케이스
  return '오늘의 시장 한 줄로';
}

// ─── 렌더 ───────────────────────────────────────────────
async function renderPng(html) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmp = path.join(OUT_DIR, '_render_template.html');
  fs.writeFileSync(tmp, html);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1120, height: 1400 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  try {
    await page.goto('file://' + tmp);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(600);
    const el = await page.$('.page');
    if (!el) throw new Error('.page 셀렉터 못 찾음 — template.html 확인');
    await el.screenshot({ path: OUT_PNG, omitBackground: false });
  } finally {
    await browser.close();
    try { fs.unlinkSync(tmp); } catch {}
  }
  return OUT_PNG;
}

// ─── 업로드 ─────────────────────────────────────────────
async function uploadToSupabase(buf, file = 'today.png') {
  if (!SECRET) throw new Error('BRIEFICK_SUPABASE_SECRET_KEY 필요');
  const bucket = 'cartoon';
  // bucket ensure (이미 있으면 409 무시)
  const ensureRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SECRET}`, 'Content-Type': 'application/json', 'apikey': SECRET },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  });
  if (!ensureRes.ok && ensureRes.status !== 409) {
    const t = await ensureRes.text();
    if (!t.includes('already exists')) console.warn(`[bucket] ${ensureRes.status}: ${t}`);
  }
  // PUT (upsert)
  const upRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${file}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SECRET}`,
      'apikey': SECRET,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
      'Cache-Control': 'public, max-age=300',
    },
    body: buf,
  });
  if (!upRes.ok) throw new Error(`upload ${upRes.status}: ${(await upRes.text()).slice(0,200)}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${file}`;
}

// ─── main ───────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  console.log('[newspaper] 1. read-tab-data fetch');
  const updates = await fetchUpdates();

  const KST = new Date(Date.now() + 9 * 3600 * 1000);
  const days = ['일','월','화','수','목','금','토'];
  const dateKo = `${KST.getUTCFullYear()}년 ${KST.getUTCMonth()+1}월 ${KST.getUTCDate()}일 ${days[KST.getUTCDay()]}요일`;
  const dayOfYear = Math.floor((KST - new Date(Date.UTC(KST.getUTCFullYear(),0,0))) / 86400000);
  const volNo = `VOL. MMXXVI · No. ${dayOfYear}`;

  const TAB_IDS = { KR:'kr', STOCKS:'stocks', AI:'ai', COMMODITY:'commodity', UNICORN:'unicorn' };
  const tokens = {
    '{{DATE_KO}}': dateKo,
    '{{VOL_NO}}': volNo,
    '{{CATCHPHRASE}}': readCatchphrase(),
  };
  for (const [key, tab] of Object.entries(TAB_IDS)) {
    const entry = (updates[tab] || [])[0];
    tokens[`{{HEAD_${key}}}`] = pickHeadline(entry) || '(데이터 없음)';
    tokens[`{{SUB_${key}}}`] = ''; // sub 줄은 더 이상 사용 안 함 (디자인 변경 후)
    console.log(`  ${key.padEnd(10)} ${entry?.date || '?'}  ${tokens[`{{HEAD_${key}}}`]}`);
  }
  console.log(`  catchphrase: ${tokens['{{CATCHPHRASE}}'].replace(/<br>/g, ' / ')}`);

  console.log('[newspaper] 2. template 치환 + Playwright 렌더');
  let html = fs.readFileSync(TEMPLATE, 'utf8');
  for (const [tok, val] of Object.entries(tokens)) html = html.split(tok).join(val);
  await renderPng(html);
  const sz = fs.statSync(OUT_PNG).size;
  console.log(`  ✓ ${path.relative(process.cwd(), OUT_PNG)}  (${(sz / 1024).toFixed(1)}KB)`);

  const shouldUpload = forceUpload || (!noUpload && SECRET);
  if (shouldUpload) {
    console.log('[newspaper] 3. Supabase Storage 업로드 (cartoon/today.png)');
    const url = await uploadToSupabase(fs.readFileSync(OUT_PNG));
    console.log(`  ✓ ${url}`);
  } else if (!SECRET) {
    console.log('[newspaper] 3. 업로드 skip (BRIEFICK_SUPABASE_SECRET_KEY 없음)');
  } else {
    console.log('[newspaper] 3. 업로드 skip (--no-upload)');
  }

  console.log(`[newspaper] done in ${Date.now() - t0}ms`);
}

main().catch(e => {
  console.error('[newspaper] fail:', e.message);
  process.exit(1);
});
