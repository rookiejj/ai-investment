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
const { dedupeBulletsByTab } = require('../cartoon/headline-dedup');
// Unsplash 사진 BG 폐기 (5/12) — 모든 슬라이드를 7번 CTA와 같은 단조·트렌디한 그라데이션
// 고정. 사진 키워드 매칭 노이즈 + Unsplash 의존 제거. 코드는 dead로 남겨 두지 않고 미사용.
// const { fetchImageDataUri } = require('./image-source');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, 'out');
const TEMPLATE = path.join(__dirname, 'template.html');
const TEXTURES_DIR = path.join(ROOT, 'assets', 'textures');
const SITE_URL = 'https://briefick.com';
const HANDLE = 'briefick';

// 슬라이드 02~07 배경 — assets/textures/ai-*-4x5.png 6종 중 1개 랜덤.
// 첫 장(cover)은 publish 워크플로가 cartoon.png로 swap. 한 포스팅 안에선 같은 텍스쳐 유지.
function pickTextureForRun() {
  if (!fs.existsSync(TEXTURES_DIR)) return null;
  const files = fs.readdirSync(TEXTURES_DIR).filter(f => /^ai-.*-4x5\.png$/.test(f));
  if (!files.length) return null;
  const pick = files[Math.floor(Math.random() * files.length)];
  const buf = fs.readFileSync(path.join(TEXTURES_DIR, pick));
  return {
    name: pick.replace(/\.png$/, ''),
    dataUri: `data:image/png;base64,${buf.toString('base64')}`,
  };
}

// 02~07 슬라이드 HEAD에 주입할 background override. 단색 다크 오버레이로 가독성 보호.
// 녹색 글로우 그라데이션은 텍스쳐 위에서 AI 같아 보여 사용자 요청으로 제거(2026-05-16).
function textureBgCss(dataUri) {
  return `<style>
    .slide.no-photo, .slide.cta {
      background:
        linear-gradient(rgba(8,12,18,0.62), rgba(8,12,18,0.78)),
        url('${dataUri}') center/cover no-repeat !important;
    }
  </style>`;
}

const TABS = [
  { key: 'kr',        emoji: '🇰🇷', label: '한국 마켓' },
  { key: 'stocks',    emoji: '🇺🇸', label: '미국 마켓' },
  { key: 'ai',        emoji: '🤖', label: 'AI 기업' },
  { key: 'commodity', emoji: '🛢️', label: '원자재·크립토' },
  { key: 'unicorn',   emoji: '🦄', label: '유니콘' },
];

const SUPABASE_FN_URL = process.env.SUPABASE_FN_URL ||
  'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1';

async function fetchTabData() {
  const r = await fetch(`${SUPABASE_FN_URL}/read-tab-data?_=${Date.now()}`);
  if (!r.ok) throw new Error(`read-tab-data ${r.status}`);
  return r.json();  // { version, tabs, updates }
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

// applyBg 폐기 (5/12) — 모든 탭 슬라이드가 CTA와 같은 단조 그라데이션 BG로 고정.
// template.html의 .slide.no-photo 클래스가 자연 적용됨.

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

  // 1) 데이터 로드 — Supabase Edge Function에서 5탭 main entries 한 번에
  const tabResp = await fetchTabData();
  // 탭 간 불릿 전역 dedup — 앞 탭이 쓴 줄과 겹치는 불릿은 뒤 탭에서 첫 줄·하단 모두 제거
  const deduped = dedupeBulletsByTab(tabResp.updates || {});
  const tabPayloads = TABS.map(t => {
    const bullets = (deduped[t.key] || []).slice(0, 5);
    return { ...t, bullets };
  });

  // 2) 이번 발행분 텍스쳐 BG 1개 랜덤 선택 — 02~07 슬라이드 공통 적용
  const texture = pickTextureForRun();
  console.log(texture ? `[texture] BG: ${texture.name}` : '[texture] 텍스쳐 없음 — 다크 단색 폴백');
  const texCss = texture ? textureBgCss(texture.dataUri) : '';

  // 3) Playwright 시작
  const browser = await chromium.launch();

  try {
    // SLIDE 1 — 표지 (publish에서 cartoon.png로 swap. 텍스쳐 미적용 — 신문 카툰 톤 보존)
    {
      let html = baseTemplate
        .replace('</head>', `${singleSlideCss('cover')}</head>`)
        .replace(/data-bind="cover\.dateLabel">[^<]*</, `data-bind="cover.dateLabel">${escapeHtml(coverDateLabel(d))}<`);
      await renderSlide(browser, html, path.join(OUT_DIR, '01.png'));
      console.log('✓ 01.png (cover, 다크 그라데이션 BG)');
    }

    // SLIDE 2~6 — 탭별 (5불릿, 같은 텍스쳐 BG)
    for (let i = 0; i < tabPayloads.length; i++) {
      const t = tabPayloads[i];
      const bulletsHtml = buildBulletsHtml(t.bullets);
      const html = buildTabSlideHtml(baseTemplate, {
        emoji: t.emoji, label: t.label, bulletsHtml, dateLabel,
      }).replace('</head>', `${singleSlideCss('tab')}${texCss}</head>`);

      const outName = `0${i+2}.png`;
      await renderSlide(browser, html, path.join(OUT_DIR, outName));
      console.log(`✓ ${outName} (${t.label}, bullets=${t.bullets.length})`);
    }

    // SLIDE 7 — CTA (같은 텍스쳐 BG)
    {
      const html = baseTemplate.replace('</head>', `${singleSlideCss('cta')}${texCss}</head>`)
        .replace(/data-bind="cta\.domain">[^<]*</, `data-bind="cta.domain">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ''))}<`)
        .replace(/data-bind="cta\.handle">[^<]*</, `data-bind="cta.handle">@${HANDLE}<`);
      await renderSlide(browser, html, path.join(OUT_DIR, '07.png'));
      console.log('✓ 07.png (cta)');
    }
  } finally {
    await browser.close();
  }

  // 캡션·어트리뷰션용 메타파일 — texture는 발행 분포 점검·디버깅용
  const meta = {
    date: `${d.year}-${String(d.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`,
    dow: d.dow,
    texture: texture ? texture.name : null,
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
