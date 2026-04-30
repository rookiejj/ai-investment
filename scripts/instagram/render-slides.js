#!/usr/bin/env node
/**
 * Briefick — 인스타그램 캐러셀 슬라이드 렌더러
 *
 * 5개 *-update.js 최신 엔트리의 summary를 파싱해서
 * 1080×1350 PNG 7장(표지 1 + 5탭 + CTA)을 생성한다.
 *
 * 탭·표지 슬라이드는 Unsplash에서 콘텐츠 관련 사진을 받아
 * BG로 깔고 다크 그라데이션 + 흰 텍스트로 렌더한다.
 * UNSPLASH_ACCESS_KEY 없으면 다크 단색 BG로 폴백.
 *
 * 출력: scripts/instagram/out/01.png ~ 07.png + meta.json
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { fetchImageDataUri } = require('./image-source');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, 'out');
const TEMPLATE = path.join(__dirname, 'template.html');
const SITE_URL = 'https://roysbriefing.vercel.app';
const HANDLE = 'briefick';

const TABS = [
  { key: 'stocks',    file: 'stocks-update.js',    var: 'updates', emoji: '🇺🇸', label: '미국 마켓' },
  { key: 'kr',        file: 'kr-stocks-update.js', var: 'updates', emoji: '🇰🇷', label: '한국 마켓' },
  { key: 'ai',        file: 'ai-update.js',        var: 'UPDATES', emoji: '🤖', label: 'AI 기업' },
  { key: 'commodity', file: 'commodity-update.js', var: 'updates', emoji: '🛢️', label: '원자재·크립토' },
  { key: 'unicorn',   file: 'unicorn-update.js',   var: 'updates', emoji: '🦄', label: '유니콘' },
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

// 숫자·% 강조 (브랜드 그린)
function highlightNumbers(text) {
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
    return `      <div class="bullet-row"><div class="bullet-mark"></div><div class="bullet-text">${html}</div></div>`;
  }).join('\n');
}

function buildTabSlideHtml(template, ctx) {
  let html = template;
  html = html.replace(/<div class="tab-emoji"[^>]*>[\s\S]*?<\/div>/, `<div class="tab-emoji" data-bind="tab.emoji">${ctx.emoji}</div>`);
  html = html.replace(/<div class="tab-title"[^>]*>[\s\S]*?<\/div>/, `<div class="tab-title" data-bind="tab.label">${escapeHtml(ctx.label)}</div>`);
  html = html.replace(/<div class="tab-body[^"]*"[^>]*>[\s\S]*?<\/div>\s*<div class="tab-footer">/, `<div class="tab-body text-on-photo" data-bind="tab.bullets">\n${ctx.bulletsHtml}\n    </div>\n  <div class="tab-footer">`);
  html = html.replace(/<div class="tab-footer-left"[^>]*>[\s\S]*?<\/div>/, `<div class="tab-footer-left" data-bind="tab.dateLabel">${escapeHtml(ctx.dateLabel)}</div>`);
  return html;
}

// 단일 슬라이드만 보이도록 다른 슬라이드 .slide 요소를 display:none 처리
function singleSlideCss(which) {
  return `<style>.slide[data-slide]{display:none!important}.slide[data-slide="${which}"]{display:flex!important}</style>`;
}

// 슬라이드 root에 BG 이미지 인젝션. dataUri 없으면 no-photo 그대로.
function applyBg(html, slideClass, dataUri) {
  if (!dataUri) return html;
  const target = `class="slide ${slideClass} no-photo"`;
  const replacement = `class="slide ${slideClass} has-photo" style="--bg-image: url('${dataUri}')"`;
  return html.replace(target, replacement);
}

async function renderSlide(browser, html, outPath) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: outPath, type: 'png', fullPage: false, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const baseTemplate = fs.readFileSync(TEMPLATE, 'utf8');
  const d = kstNow();
  const dateLabel = tabFooterDate(d);
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || '';

  if (!accessKey) {
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('⚠⚠⚠  UNSPLASH_ACCESS_KEY 미설정  ⚠⚠⚠');
    console.warn('   → 사진 BG 없이 다크 단색으로 렌더됩니다 (모든 슬라이드 까만 배경).');
    console.warn('   → GitHub Settings → Secrets에 UNSPLASH_ACCESS_KEY 등록 후 다시 실행.');
    console.warn('   → 키 발급: https://unsplash.com/developers (무료 가입)');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  // 1) 데이터 로드
  const tabPayloads = TABS.map(t => {
    const entry = loadLatestEntry(t.file, t.var);
    const bullets = entry ? summaryToBullets(entry.summary) : [];
    return { ...t, bullets };
  });

  // 2) 이미지 사전 페치 — 같은 게시물 내 중복 방지를 위해 순차 호출 + usedIds 공유
  console.log('이미지 페치 시작 (Unsplash, 중복 방지 모드) …');
  const allFirstBullets = tabPayloads.map(t => t.bullets[0]).filter(Boolean);
  const coverBullets = [allFirstBullets[0] || '', allFirstBullets[1] || ''];
  const usedIds = new Set();

  const coverImg = await fetchImageDataUri({ tabKey: 'cover', bullets: coverBullets, accessKey, usedIds });
  if (coverImg) console.log(`  ✓ cover: query="${coverImg.query}" id=${coverImg.photo?.id}`);
  else          console.log(`  · cover: 이미지 없음 (다크 폴백)`);

  const imgByTab = {};
  for (const t of tabPayloads) {
    const r = await fetchImageDataUri({ tabKey: t.key, bullets: t.bullets, accessKey, usedIds });
    imgByTab[t.key] = r || null;
    if (r) console.log(`  ✓ ${t.key}: query="${r.query}" matched=${r.matched || '(default)'} id=${r.photo?.id}`);
    else   console.log(`  · ${t.key}: 이미지 없음 (다크 폴백)`);
  }

  // 3) Playwright 시작
  const browser = await chromium.launch();

  try {
    // SLIDE 1 — 표지
    {
      let html = baseTemplate
        .replace('</head>', `${singleSlideCss('cover')}</head>`)
        .replace(/data-bind="cover\.dateLabel">[^<]*</, `data-bind="cover.dateLabel">${escapeHtml(coverDateLabel(d))}<`)
        .replace(/data-bind="cover\.domain">[^<]*</, `data-bind="cover.domain">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ''))}<`);
      html = applyBg(html, 'cover', coverImg?.dataUri || null);
      await renderSlide(browser, html, path.join(OUT_DIR, '01.png'));
      console.log('✓ 01.png (cover)');
    }

    // SLIDE 2~6 — 탭별 (5불릿 그대로, 사진 BG)
    for (let i = 0; i < tabPayloads.length; i++) {
      const t = tabPayloads[i];
      const bulletsHtml = buildBulletsHtml(t.bullets);
      let html = buildTabSlideHtml(baseTemplate, {
        emoji: t.emoji, label: t.label, bulletsHtml, dateLabel,
      }).replace('</head>', `${singleSlideCss('tab')}</head>`);
      html = applyBg(html, 'tab', imgByTab[t.key]?.dataUri || null);

      const outName = `0${i+2}.png`;
      await renderSlide(browser, html, path.join(OUT_DIR, outName));
      console.log(`✓ ${outName} (${t.label}, bullets=${t.bullets.length})`);
    }

    // SLIDE 7 — CTA (사진 없음)
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

  // 캡션·어트리뷰션용 메타파일
  const photoMeta = (img) => img ? {
    query: img.query,
    matched: img.matched,
    photoId: img.photo?.id || null,
    photographer: img.photo?.user?.name || null,
    photographerUrl: img.photo?.user?.links?.html || null,
    sourceUrl: img.photo?.links?.html || null,
  } : null;

  const meta = {
    date: `${d.year}-${String(d.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`,
    dow: d.dow,
    photos: {
      cover: photoMeta(coverImg),
      tabs:  Object.fromEntries(Object.entries(imgByTab).map(([k,v]) => [k, photoMeta(v)])),
    },
    tabs: tabPayloads.map(t => ({ key: t.key, emoji: t.emoji, label: t.label, bullets: t.bullets })),
  };
  fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  console.log('✓ meta.json');
  console.log(`\n출력 위치: ${OUT_DIR}`);
}

main().catch(err => {
  console.error('렌더 실패:', err);
  process.exit(1);
});
