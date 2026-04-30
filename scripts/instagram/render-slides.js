#!/usr/bin/env node
/**
 * Briefick — 인스타그램 캐러셀 슬라이드 렌더러
 *
 * 5개 *-update.js 최신 엔트리의 summary를 파싱해서
 * 1080×1350 PNG 7장(표지 1 + 5탭 + CTA)을 생성한다.
 *
 * 출력: scripts/instagram/out/01.png ~ 07.png
 *
 * 사용:
 *   node scripts/instagram/render-slides.js
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, 'out');
const TEMPLATE = path.join(__dirname, 'template.html');
const SITE_URL = 'https://roysbriefing.vercel.app';
const HANDLE = 'briefick';

const TABS = [
  { file: 'stocks-update.js',    var: 'updates', emoji: '🇺🇸', label: '미국 마켓' },
  { file: 'kr-stocks-update.js', var: 'updates', emoji: '🇰🇷', label: '한국 마켓' },
  { file: 'ai-update.js',        var: 'UPDATES', emoji: '🤖', label: 'AI 기업' },
  { file: 'commodity-update.js', var: 'updates', emoji: '🛢️', label: '원자재·크립토' },
  { file: 'unicorn-update.js',   var: 'updates', emoji: '🦄', label: '유니콘' },
];

function loadLatestEntry(file, varName) {
  const src = fs.readFileSync(path.join(ROOT, 'data', file), 'utf8');
  const list = new Function(
    `${src};return typeof ${varName}!=="undefined"?${varName}:[];`
  )();
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[0];
}

function summaryToBullets(summary) {
  if (!summary) return [];
  return String(summary)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function kstNow() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000 + now.getTimezoneOffset() * 60 * 1000);
  return {
    year:  kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day:   kst.getUTCDate(),
    dow:   ['일','월','화','수','목','금','토'][kst.getUTCDay()],
    dowEn: ['SUN','MON','TUE','WED','THU','FRI','SAT'][kst.getUTCDay()],
  };
}

function coverDateLabel(d) {
  const m = String(d.month).padStart(2,'0');
  const day = String(d.day).padStart(2,'0');
  return `${d.year}.${m}.${day} · ${d.dowEn}`;
}

function tabFooterDate(d) {
  const m = String(d.month).padStart(2,'0');
  const day = String(d.day).padStart(2,'0');
  return `${d.year}.${m}.${day} KST`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 숫자·% 강조: 가격·등락률·% 등을 grand-deep 색으로 살짝 강조
function highlightNumbers(text) {
  // 이미 escape된 텍스트 들어옴. HTML 안전.
  return text
    .replace(/([+\-]?\d[\d,]*\.?\d*\s*%)/g, '<span class="num">$1</span>')
    .replace(/(\$[\d,]+\.?\d*[BMK]?)/g, '<span class="num">$1</span>')
    .replace(/(₩?[\d,]+\.?\d*\s*조원?|[\d,]+\s*천억원?)/g, '<span class="num">$1</span>');
}

function buildBulletsHtml(bullets) {
  if (!bullets.length) {
    return '<div class="bullet-row"><div class="bullet-mark"></div><div class="bullet-text">오늘 새 갱신 없음.</div></div>';
  }
  return bullets.map(b => {
    const safe = escapeHtml(b);
    const html = highlightNumbers(safe);
    return `<div class="bullet-row"><div class="bullet-mark"></div><div class="bullet-text">${html}</div></div>`;
  }).join('\n');
}

function buildTabSlideHtml(template, ctx) {
  let html = template;
  html = html.replace(/<div class="tab-emoji"[^>]*>[\s\S]*?<\/div>/, `<div class="tab-emoji" data-bind="tab.emoji">${ctx.emoji}</div>`);
  html = html.replace(/<div class="tab-title"[^>]*>[\s\S]*?<\/div>/, `<div class="tab-title" data-bind="tab.label">${escapeHtml(ctx.label)}</div>`);
  html = html.replace(/<div class="tab-page-num"[^>]*>[\s\S]*?<\/div>/, `<div class="tab-page-num" data-bind="tab.pageNum">${ctx.pageNum}</div>`);
  html = html.replace(/<div class="tab-body"[^>]*>[\s\S]*?<\/div>\s*<div class="tab-footer">/, `<div class="tab-body" data-bind="tab.bullets">${ctx.bulletsHtml}</div>\n  <div class="tab-footer">`);
  html = html.replace(/<div class="tab-footer-left"[^>]*>[\s\S]*?<\/div>/, `<div class="tab-footer-left" data-bind="tab.dateLabel">${escapeHtml(ctx.dateLabel)}</div>`);
  return html;
}

// 단일 슬라이드만 보이도록 다른 슬라이드 .slide 요소를 display:none 처리
function singleSlideCss(which) {
  const map = { cover: 'cover', tab: 'tab', cta: 'cta' };
  const keep = map[which];
  return `<style>.slide[data-slide]{display:none!important}.slide[data-slide="${keep}"]{display:flex!important}</style>`;
}

async function renderSlide(browser, html, outPath) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  // 폰트 로딩 대기
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: outPath, type: 'png', fullPage: false, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const baseTemplate = fs.readFileSync(TEMPLATE, 'utf8');
  const d = kstNow();
  const dateLabel = tabFooterDate(d);

  // 1) 데이터 로드
  const tabPayloads = TABS.map(t => {
    const entry = loadLatestEntry(t.file, t.var);
    const bullets = entry ? summaryToBullets(entry.summary) : [];
    return { ...t, bullets };
  });

  // 2) Playwright 시작
  const browser = await chromium.launch();

  try {
    // SLIDE 1 — 표지
    {
      const html = baseTemplate.replace('</head>', `${singleSlideCss('cover')}</head>`)
        .replace(/data-bind="cover\.dateLabel">[^<]*</, `data-bind="cover.dateLabel">${escapeHtml(coverDateLabel(d))}<`)
        .replace(/data-bind="cover\.domain">[^<]*</, `data-bind="cover.domain">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ''))}<`);
      await renderSlide(browser, html, path.join(OUT_DIR, '01.png'));
      console.log('✓ 01.png (cover)');
    }

    // SLIDE 2~6 — 탭별
    for (let i = 0; i < tabPayloads.length; i++) {
      const t = tabPayloads[i];
      const pageNum = `${String(i+2).padStart(2,'0')} / 07`;
      const bulletsHtml = buildBulletsHtml(t.bullets);
      const tabHtml = buildTabSlideHtml(baseTemplate, {
        emoji: t.emoji, label: t.label, pageNum, bulletsHtml, dateLabel,
      });
      const html = tabHtml.replace('</head>', `${singleSlideCss('tab')}</head>`);
      const outName = `0${i+2}.png`;
      await renderSlide(browser, html, path.join(OUT_DIR, outName));
      console.log(`✓ ${outName} (${t.label}, bullets=${t.bullets.length})`);
    }

    // SLIDE 7 — CTA
    {
      const html = baseTemplate.replace('</head>', `${singleSlideCss('cta')}</head>`)
        .replace(/data-bind="cta\.domain">[^<]*</, `data-bind="cta.domain">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ''))}<`)
        .replace(/data-bind="cta\.handle">[^<]*</, `data-bind="cta.handle">@${HANDLE}<`)
        .replace(/data-bind="cta\.domainBottom">[^<]*</, `data-bind="cta.domainBottom">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ''))}<`)
        .replace(/data-bind="cta\.handleBottom">[^<]*</, `data-bind="cta.handleBottom">${HANDLE}<`);
      await renderSlide(browser, html, path.join(OUT_DIR, '07.png'));
      console.log('✓ 07.png (cta)');
    }
  } finally {
    await browser.close();
  }

  // 캡션 페이로드 메타파일 (publish.js가 사용)
  const meta = {
    date: `${d.year}-${String(d.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`,
    dow: d.dow,
    tabs: tabPayloads.map(t => ({ key: t.file.replace('-update.js',''), emoji: t.emoji, label: t.label, bullets: t.bullets })),
  };
  fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  console.log('✓ meta.json');
  console.log(`\n출력 위치: ${OUT_DIR}`);
}

main().catch(err => {
  console.error('렌더 실패:', err);
  process.exit(1);
});
