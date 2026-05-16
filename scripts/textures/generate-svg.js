// SVG procedural 텍스쳐 생성 — 6종 × 2크기(4:5·1:1) = 12장 PNG.
// Playwright headless로 SVG/HTML 렌더 후 PNG 캡쳐.
// reference: scripts/textures/reference/ 의 6개 텍스쳐 분위기 재현.
// 결과: assets/textures/svg-<name>-<size>.png

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../assets/textures');

const SIZES = [
  { name: '4x5', w: 1080, h: 1350 },
  { name: '1x1', w: 1080, h: 1080 },
];

// ── 각 텍스쳐: viewBox에 무관하게 비율 채움. preserveAspectRatio="xMidYMid slice"
// SVG 본문은 1080x1350 가정으로 그리되 size에 맞춰 viewBox 동적.

function svgGrainyNoise(w, h){return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="bg" cx="58%" cy="38%" r="85%">
      <stop offset="0%" stop-color="#d6c8ff"/>
      <stop offset="22%" stop-color="#a08fed"/>
      <stop offset="55%" stop-color="#4a3f8e"/>
      <stop offset="100%" stop-color="#0a0716"/>
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="3" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0.85 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <filter id="grain2">
      <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="7" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0.95
                             0 0 0 0 0.95
                             0 0 0 0 1
                             0 0 0 0.18 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.45"/>
  <rect width="100%" height="100%" filter="url(#grain2)" style="mix-blend-mode:screen"/>
</svg>`;}

function svgHalftone(w, h){return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fafafa"/>
      <stop offset="40%" stop-color="#ababab"/>
      <stop offset="70%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#000"/>
    </linearGradient>
    <radialGradient id="dotMask" cx="35%" cy="35%" r="80%">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="7" cy="7" r="5" fill="#fff"/>
    </pattern>
    <pattern id="dots2" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse">
      <circle cx="4.5" cy="4.5" r="2.6" fill="#fff"/>
    </pattern>
    <mask id="m1"><rect width="100%" height="100%" fill="url(#dotMask)"/></mask>
    <mask id="m2"><rect width="100%" height="100%" fill="url(#dotMask)" style="filter:invert(1)"/></mask>
  </defs>
  <rect width="100%" height="100%" fill="#000"/>
  <rect width="100%" height="100%" fill="url(#dots)" mask="url(#m1)"/>
  <rect width="100%" height="100%" fill="url(#dots2)" mask="url(#m2)" opacity="0.5"/>
  <rect width="100%" height="100%" fill="url(#hbg)" style="mix-blend-mode:multiply" opacity="0.4"/>
</svg>`;}

function svgLightLeak(w, h){return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="leak1" cx="42%" cy="55%" r="42%">
      <stop offset="0%" stop-color="#ffb47a" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#ff6b35" stop-opacity="0.85"/>
      <stop offset="70%" stop-color="#cc2e22" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0a2024" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="leak2" cx="78%" cy="35%" r="35%">
      <stop offset="0%" stop-color="#ff8540" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="#cc4422" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0a2024" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="leak3" cx="15%" cy="20%" r="30%">
      <stop offset="0%" stop-color="#ff9558" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0a2024" stop-opacity="0"/>
    </radialGradient>
    <filter id="ll-blur" x="0" y="0" width="100%" height="100%">
      <feGaussianBlur stdDeviation="35"/>
    </filter>
    <filter id="ll-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0.32 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#0c2428"/>
  <g filter="url(#ll-blur)">
    <ellipse cx="${w*0.42}" cy="${h*0.55}" rx="${w*0.5}" ry="${h*0.4}" fill="url(#leak1)"/>
    <ellipse cx="${w*0.78}" cy="${h*0.35}" rx="${w*0.45}" ry="${h*0.3}" fill="url(#leak2)"/>
    <ellipse cx="${w*0.15}" cy="${h*0.2}" rx="${w*0.35}" ry="${h*0.2}" fill="url(#leak3)"/>
  </g>
  <rect width="100%" height="100%" filter="url(#ll-grain)" style="mix-blend-mode:overlay"/>
</svg>`;}

function svgFractalGlass(w, h){return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="fbg" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0%" stop-color="#3d4d8a"/>
      <stop offset="25%" stop-color="#7286b8"/>
      <stop offset="50%" stop-color="#b8c2d8"/>
      <stop offset="75%" stop-color="#506680"/>
      <stop offset="100%" stop-color="#2a3548"/>
    </linearGradient>
    <filter id="streaks" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="turbulence" baseFrequency="0.005 0.18" numOctaves="3" seed="11" stitchTiles="stitch" result="turb"/>
      <feDisplacementMap in="SourceGraphic" in2="turb" scale="55" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="fg-grain">
      <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0.15 0"/>
    </filter>
  </defs>
  <g filter="url(#streaks)">
    <rect width="100%" height="100%" fill="url(#fbg)"/>
    <!-- 수직 streaks bright bands -->
    <g opacity="0.5">
      ${Array.from({length:14}).map((_,i)=>{
        const x=(i+0.5)*(w/14)+ (i%3===0?20:-10);
        return `<rect x="${x-12}" y="0" width="24" height="${h}" fill="#f0f4ff" opacity="${0.18+(i%4)*0.08}"/>`;
      }).join('\n      ')}
    </g>
    <g opacity="0.32">
      ${Array.from({length:24}).map((_,i)=>{
        const x=i*(w/24)+(i%2?12:-8);
        return `<rect x="${x-4}" y="0" width="8" height="${h}" fill="#cad2ec"/>`;
      }).join('\n      ')}
    </g>
  </g>
  <rect width="100%" height="100%" filter="url(#fg-grain)" style="mix-blend-mode:overlay"/>
</svg>`;}

function svgCardboard(w, h){return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c9a781"/>
      <stop offset="40%" stop-color="#b6916b"/>
      <stop offset="80%" stop-color="#9c7a55"/>
      <stop offset="100%" stop-color="#8a6745"/>
    </linearGradient>
    <filter id="paper-noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="9" stitchTiles="stitch"/>
      <feColorMatrix values="0.4 0 0 0 0.2
                             0.3 0 0 0 0.15
                             0.2 0 0 0 0.08
                             0 0 0 1.2 -0.1"/>
    </filter>
    <filter id="crease" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="turbulence" baseFrequency="0.012" numOctaves="2" seed="14"/>
      <feDisplacementMap in="SourceGraphic" in2="turb" scale="18"/>
      <feColorMatrix values="0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0.4 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#cbg)"/>
  <rect width="100%" height="100%" filter="url(#paper-noise)" opacity="0.55" style="mix-blend-mode:multiply"/>
  <!-- 구겨진 자국 — 비대칭 linear streaks -->
  <g opacity="0.35" style="mix-blend-mode:multiply">
    <path d="M0,${h*0.18} Q${w*0.3},${h*0.22} ${w*0.55},${h*0.16} T${w},${h*0.2}" stroke="#5c3f24" stroke-width="2" fill="none"/>
    <path d="M${w*0.12},0 Q${w*0.18},${h*0.4} ${w*0.32},${h*0.6} T${w*0.45},${h}" stroke="#6b4a2a" stroke-width="2.5" fill="none"/>
    <path d="M${w*0.72},${h*0.05} Q${w*0.68},${h*0.45} ${w*0.78},${h*0.7} T${w*0.85},${h}" stroke="#5c3f24" stroke-width="2" fill="none"/>
    <path d="M0,${h*0.72} Q${w*0.4},${h*0.78} ${w*0.7},${h*0.68} T${w},${h*0.78}" stroke="#6b4a2a" stroke-width="1.8" fill="none"/>
  </g>
  <g opacity="0.18" style="mix-blend-mode:screen">
    <path d="M0,${h*0.2} Q${w*0.3},${h*0.24} ${w*0.55},${h*0.18} T${w},${h*0.22}" stroke="#fff3d8" stroke-width="3" fill="none"/>
    <path d="M${w*0.14},0 Q${w*0.2},${h*0.4} ${w*0.34},${h*0.6} T${w*0.47},${h}" stroke="#fff3d8" stroke-width="3" fill="none"/>
  </g>
</svg>`;}

function svgPlasticWrap(w, h){return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="pwbg" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#3a3a3a"/>
      <stop offset="60%" stop-color="#181818"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
    <filter id="wrinkles" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="turbulence" baseFrequency="0.02 0.025" numOctaves="4" seed="21" stitchTiles="stitch" result="turb"/>
      <feDisplacementMap in="SourceGraphic" in2="turb" scale="65" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="speculars">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="33" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1
                             0 0 0 0 1
                             0 0 0 0 1
                             0 0 0 8 -3.5"/>
    </filter>
    <filter id="pw-grain">
      <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="1" seed="6" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0.2 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#pwbg)"/>
  <g filter="url(#wrinkles)">
    <!-- Sharp diagonal highlights -->
    <g opacity="0.85">
      ${Array.from({length:8}).map((_,i)=>{
        const x1=Math.random()*w, y1=Math.random()*h, x2=x1+(Math.random()-0.5)*w*0.6, y2=y1+(Math.random()-0.5)*h*0.6;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="${1+Math.random()*3}" opacity="${0.3+Math.random()*0.4}"/>`;
      }).join('\n      ')}
    </g>
  </g>
  <rect width="100%" height="100%" filter="url(#speculars)" style="mix-blend-mode:screen" opacity="0.9"/>
  <rect width="100%" height="100%" filter="url(#pw-grain)" style="mix-blend-mode:overlay"/>
</svg>`;}

const TEXTURES = [
  { name: 'grainy-noise',  fn: svgGrainyNoise },
  { name: 'halftone',      fn: svgHalftone },
  { name: 'light-leak',    fn: svgLightLeak },
  { name: 'fractal-glass', fn: svgFractalGlass },
  { name: 'cardboard',     fn: svgCardboard },
  { name: 'plastic-wrap',  fn: svgPlasticWrap },
];

async function run(){
  const browser = await chromium.launch();
  try {
    for (const size of SIZES) {
      const ctx = await browser.newContext({
        viewport: { width: size.w, height: size.h },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      for (const t of TEXTURES) {
        const svg = t.fn(size.w, size.h);
        const html = `<!doctype html><html><head><style>
          html,body{margin:0;padding:0;background:#000;width:${size.w}px;height:${size.h}px;overflow:hidden}
          svg{display:block;width:${size.w}px;height:${size.h}px}
        </style></head><body>${svg}</body></html>`;
        await page.setContent(html, { waitUntil: 'load' });
        const outPath = path.join(OUT_DIR, `svg-${t.name}-${size.name}.png`);
        await page.screenshot({ path: outPath, omitBackground: false, fullPage: false, clip: { x: 0, y: 0, width: size.w, height: size.h } });
        console.log(`✓ ${path.relative(process.cwd(), outPath)}`);
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
