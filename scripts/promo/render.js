#!/usr/bin/env node
/**
 * Briefick — 마케팅 프로모 캐러셀 렌더러
 *
 * scripts/promo/template.html 의 .slide[data-slide] 각각을 1080×1350 PNG로 굽는다.
 * 데일리 콘텐츠 캐러셀(scripts/instagram)과 별개인, 재사용 가능한 "광고용" 세트.
 *
 * 훅 → 문제 → 해결 → 증거(카톡 목업) → 차별점 → CTA 순서.
 * 슬라이드 추가/삭제는 template.html에서 .slide[data-slide="N"] 블록만 늘리면 됨.
 *
 * 출력: scripts/promo/out/01.png, 02.png, ...
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, 'out');
const TEMPLATE = path.join(__dirname, 'template.html');
const OWL = path.join(ROOT, 'assets', 'briefick_profile_640.jpeg');

const W = 1080, H = 1350;

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let html = fs.readFileSync(TEMPLATE, 'utf8');

  // 마스코트(올빼미)를 data URI로 인젝션 — data-owl 속성 가진 모든 img에
  const owlBuf = fs.readFileSync(OWL);
  const owlUri = `data:image/jpeg;base64,${owlBuf.toString('base64')}`;
  html = html.replace(/(<img[^>]*\bdata-owl\b[^>]*\bsrc=")[^"]*(")/g, `$1${owlUri}$2`);

  // 1페이지 풀블리드 히어로 사진 인젝션 (hero/owl.png) — __HERO__ 플레이스홀더 치환
  const heroPath = path.join(__dirname, 'hero', 'owl.png');
  if (fs.existsSync(heroPath)) {
    const heroUri = `data:image/png;base64,${fs.readFileSync(heroPath).toString('base64')}`;
    html = html.replace('__HERO__', heroUri);
  }

  // 슬라이드 개수 파악
  const slideCount = (html.match(/data-slide="\d+"/g) || []).length;
  if (!slideCount) throw new Error('template.html에서 .slide[data-slide] 를 찾지 못함');
  console.log(`[promo] 슬라이드 ${slideCount}장 렌더 시작`);

  const browser = await chromium.launch();
  try {
    for (let n = 1; n <= slideCount; n++) {
      // 슬라이드 n만 보이게 — 나머지 .slide 숨김
      const css = `<style>.slide[data-slide]{display:none!important}.slide[data-slide="${n}"]{display:flex!important}</style>`;
      const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
      await page.setContent(html.replace('</head>', `${css}</head>`), { waitUntil: 'networkidle' });
      await page.evaluate(async () => { if (document.fonts && document.fonts.ready) await document.fonts.ready; });
      await page.waitForTimeout(300);
      const outName = `${String(n).padStart(2, '0')}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, outName), type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
      await page.close();
      console.log(`✓ ${outName}`);
    }
  } finally {
    await browser.close();
  }
  console.log(`\n출력 위치: ${OUT_DIR}`);
}

main().catch(err => { console.error('렌더 실패:', err); process.exit(1); });
