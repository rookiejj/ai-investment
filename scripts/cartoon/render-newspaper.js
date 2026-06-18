#!/usr/bin/env node
/**
 * 신문 1면 hero PNG 로컬 렌더러 — 품질 검증용.
 *
 * 사용:
 *   node scripts/cartoon/render-newspaper.js
 *     → preview-A-newspaper.html 단일 + 최신 5탭 헤드라인 → newspaper.png
 *
 *   node scripts/cartoon/render-newspaper.js --all
 *     → scripts/cartoon/out/preview-*.html 모두 렌더 → out/*.png (HTML 파일명 매칭)
 *
 *   node scripts/cartoon/render-newspaper.js --catchphrase "한 줄 카피"
 *     → 단일 + catchphrase 갈아끼움
 *
 *   node scripts/cartoon/render-newspaper.js <html_path> [png_path]
 *     → 임의 HTML 렌더 (B mockup·variants 등). 토큰 있으면 치환, 없으면 그대로.
 *
 * 토큰: {{DATE_KO}} {{VOL_NO}} {{CATCHPHRASE}}
 *       {{HEAD_KR}} {{SUB_KR}} {{HEAD_STOCKS}} {{SUB_STOCKS}}
 *       {{HEAD_AI}}  {{SUB_AI}}  {{HEAD_COMMODITY}} {{SUB_COMMODITY}}
 *       {{HEAD_UNICORN}} {{SUB_UNICORN}}
 *
 * 데이터 소스: Supabase read-tab-data Edge Function (DB tab_updates entries[0]).
 *   로컬 *-update.js는 stale일 수 있어 직접 안 씀.
 * catchphrase: --catchphrase 인자 우선, 없으면 기본 fallback.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pickDistinctHeadlines } = require('./headline-dedup');
const { normalizeFinanceTerms } = require('./normalize');

// --catchphrase "..."  --all  파싱
const args = process.argv.slice(2);
let catchphrase = null;
let renderAll = false;
const cleanArgs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--catchphrase' && args[i + 1]) {
    catchphrase = args[i + 1]; i++;
  } else if (args[i] === '--all') {
    renderAll = true;
  } else {
    cleanArgs.push(args[i]);
  }
}

const OUT_DIR = path.resolve('scripts/cartoon/out');

// 렌더할 (input, output) 쌍 결정
let pairs = [];
if (renderAll) {
  const files = fs.readdirSync(OUT_DIR)
    .filter(f => /^preview-.*\.html$/.test(f) && !f.startsWith('_'))
    .sort();
  if (!files.length) { console.error('preview-*.html 파일 없음'); process.exit(1); }
  pairs = files.map(f => {
    const base = f.replace(/^preview-/, '').replace(/\.html$/, '');
    return {
      input: path.join(OUT_DIR, f),
      output: path.join(OUT_DIR, `${base}.png`),
    };
  });
} else {
  const inputArg = cleanArgs[0] || 'scripts/cartoon/out/preview-A-newspaper.html';
  const defaultOut = inputArg.includes('infographic')
    ? 'scripts/cartoon/out/infographic.png'
    : 'scripts/cartoon/out/newspaper.png';
  const input = path.resolve(inputArg);
  if (!fs.existsSync(input)) { console.error(`HTML 없음: ${input}`); process.exit(1); }
  pairs = [{ input, output: path.resolve(cleanArgs[1] || defaultOut) }];
}

// ----- 데이터 추출 (Supabase DB) -----
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';

function pickFromEntry(entry) {
  if (!entry) return { head: '', sub: '' };
  const raw = entry.summary || entry.text || '';
  const lines = String(raw).split('\n').map(s => s.trim()).filter(Boolean);
  return { head: lines[0] || '', sub: lines[1] || '' };
}

async function fetchTabUpdates() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/read-tab-data`);
  if (!res.ok) throw new Error(`read-tab-data ${res.status}`);
  const j = await res.json();
  return j.updates || {};
}

const KST_DATE = new Date(Date.now() + 9 * 3600 * 1000);
const days = ['일', '월', '화', '수', '목', '금', '토'];
const dateKo = `${KST_DATE.getUTCFullYear()}년 ${KST_DATE.getUTCMonth() + 1}월 ${KST_DATE.getUTCDate()}일 ${days[KST_DATE.getUTCDay()]}요일`;
const dayOfYear = Math.floor((KST_DATE - new Date(Date.UTC(KST_DATE.getUTCFullYear(), 0, 0))) / 86400000);
const volNo = `VOL. MMXXVI · No. ${dayOfYear}`;

const TAB_IDS = { KR: 'kr', STOCKS: 'stocks', AI: 'ai', COMMODITY: 'commodity', UNICORN: 'unicorn' };

(async () => {
  // 데이터는 한 번만 fetch (모든 variant 공유)
  let updates = null;
  const needsData = pairs.some(p => fs.readFileSync(p.input, 'utf8').includes('{{'));
  if (needsData) {
    updates = await fetchTabUpdates();
    console.log('[render] DB read-tab-data fetch 완료');
    for (const [key, tabId] of Object.entries(TAB_IDS)) {
      const entry = (updates[tabId] || [])[0];
      console.log(`  ${key.padEnd(10)} ${entry?.date || entry?.time || '?'}  ${pickFromEntry(entry).head}`);
    }
    console.log(`  날짜: ${dateKo}`);
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 1500 },
    deviceScaleFactor: 2,
  });

  console.log(`\n[render] ${pairs.length}개 PNG 생성:`);
  for (const { input, output } of pairs) {
    let html = fs.readFileSync(input, 'utf8');
    const isTemplate = html.includes('{{');

    if (isTemplate) {
      const tokens = {
        '{{DATE_KO}}': dateKo,
        '{{VOL_NO}}': volNo,
        '{{CATCHPHRASE}}': normalizeFinanceTerms((catchphrase || '신고가 행진과\\n호르무즈, 같은 무대').replace(/\\n/g, '<br>')),
      };
      // 탭 간 헤드라인 중복 제거 — 같은 사건이 여러 탭 첫 줄에 올라온 날에도 1면 중복 방지
      const heads = pickDistinctHeadlines(updates);
      for (const [key, tabId] of Object.entries(TAB_IDS)) {
        const entry = (updates[tabId] || [])[0];
        const { head, sub } = pickFromEntry(entry);
        tokens[`{{HEAD_${key}}}`] = normalizeFinanceTerms(heads[tabId] || head) || '(데이터 없음)';
        tokens[`{{SUB_${key}}}`] = sub || '';
      }
      for (const [tok, val] of Object.entries(tokens)) {
        html = html.split(tok).join(val);
      }
    }

    const tmpHtml = isTemplate
      ? path.join(path.dirname(input), `_render_${path.basename(input)}`)
      : input;
    if (isTemplate) fs.writeFileSync(tmpHtml, html);

    const page = await ctx.newPage();
    await page.goto('file://' + tmpHtml);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts && document.fonts.ready);
    // JS가 외부 데이터 fetch 후 window.READY=true 셋하면 그 시점 기다림 (mockup에서 셋)
    try { await page.waitForFunction('window.READY === true', { timeout: 4000 }); } catch {}
    await page.waitForTimeout(400);

    const el = await page.$('.page');
    if (!el) {
      console.error(`  ✗ ${path.basename(input)}: .page 셀렉터 못 찾음`);
      await page.close();
      if (isTemplate && tmpHtml !== input) fs.unlinkSync(tmpHtml);
      continue;
    }
    await el.screenshot({ path: output, omitBackground: false });
    await page.close();
    if (isTemplate && tmpHtml !== input) fs.unlinkSync(tmpHtml);

    const sz = fs.statSync(output).size;
    console.log(`  ✓ ${path.relative(process.cwd(), output)}  (${(sz / 1024).toFixed(1)}KB)`);
  }

  await browser.close();
})().catch((e) => {
  console.error('render fail:', e.message);
  process.exit(1);
});
