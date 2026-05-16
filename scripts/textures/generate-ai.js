// Gemini AI 텍스쳐 생성 — reference 6종을 사진 디테일까지 재현.
// 모델: nano-banana-pro-preview (Gemini 이미지 생성, REST API v1beta)
// 결과: assets/textures/ai-<name>-<size>.png

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../assets/textures');

const API_KEY = process.env.GEMINI_API_KEY || readDotEnv();
function readDotEnv(){
  try {
    const txt = fs.readFileSync(path.resolve(__dirname, '../../.env'), 'utf8');
    const m = txt.match(/GEMINI_API_KEY=([^\n]+)/);
    return m ? m[1].trim() : null;
  } catch { return null; }
}
if (!API_KEY) { console.error('GEMINI_API_KEY missing'); process.exit(1); }

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'nano-banana-pro-preview';

const SIZES = [
  { name: '4x5', aspectRatio: '4:5' },
  { name: '1x1', aspectRatio: '1:1' },
];

const TEXTURES = [
  {
    name: 'grainy-noise',
    prompt: `A high-resolution abstract background texture in the style of grainy noise art posters. Soft radial gradient from light lavender violet at upper-center, transitioning through medium periwinkle and deep indigo, fading to almost-black at the lower edges. Covered with very heavy, coarse film grain noise — strong organic graininess like an over-exposed analog photograph, the grain particles are visible and tactile across the entire frame. The lighter center has brighter grain, the dark edges have denser darker grain. No text, no logos, no objects, no people. Pure abstract noise texture. Cinematic, moody, contemporary design poster aesthetic. Full-bleed, no borders, no margins.`
  },
  {
    name: 'halftone',
    prompt: `A high-resolution abstract black-and-white halftone pattern texture. Classic newspaper-print halftone dot pattern where dot size varies smoothly from a bright nearly-white area in the upper-left (very small sparse dots on white) gradually transitioning to a dense pitch-black area in the lower-right (large dots on black background, or sparse small white dots on black). Strong contrast between light and dark zones. Dots arranged in a regular grid pattern, moiré-like aesthetic. Stylish, modern, retro print design poster look. No text, no logos. Pure pattern texture. Full-bleed, no borders, no margins.`
  },
  {
    name: 'light-leak',
    prompt: `A high-resolution abstract light leak texture. Deep dark teal blue-green background. On top, swirling organic curves and sweeps of warm orange glow blending into red, like analog film light leaks or a long-exposure photograph of fire. The orange light forms abstract curving shapes — a large bright orange sweep on the left, smaller warm glows on the right, all with soft Gaussian blur. Heavy film grain over the whole image. Cinematic, vintage analog photography aesthetic. No text, no logos, no objects. Full-bleed, no borders, no margins.`
  },
  {
    name: 'fractal-glass',
    prompt: `A high-resolution abstract fractal glass texture. Vertical streaks of fluted/ribbed glass with light refraction — the kind seen through bathroom privacy glass or vintage modernist windows. Cool blue-violet color palette: dusty lavender, sky blue, pale steel grey, deeper navy in shadow areas. Strong vertical streaks of varying widths showing light bouncing through textured glass. Some bright pearl-white highlights, some darker indigo shadows between streaks. Smooth gradient lighting overall — brighter in the center-right, darker at edges. Holographic iridescent feel. No text, no logos, no objects. Full-bleed, no borders, no margins.`
  },
  {
    name: 'cardboard',
    prompt: `A high-resolution photographic texture of crumpled brown kraft paper / cardboard. Warm tan-beige to medium brown color (think shipping box, paper bag). Heavy realistic crinkles, creases, folds, soft wrinkles visible across the entire surface. Some areas brighter where the paper catches light on raised folds, deeper shadows in the valleys of the crumples. Subtle paper fiber texture visible. Natural, organic, tactile. No text, no logos, no objects. Pure crumpled paper texture photograph. Full-bleed, no borders, no margins.`
  },
  {
    name: 'plastic-wrap',
    prompt: `A high-resolution photographic texture of crumpled black plastic wrap / cellophane. Dark near-black background with extremely sharp bright white specular highlights along the sharp edges of plastic creases and folds. The plastic has been balled up and stretched — sharp angular wrinkles catch the light dramatically. High-contrast black-and-white aesthetic, like a fashion photography close-up. Glossy, reflective, with crisp angular highlights on every fold and crease. No text, no logos, no objects. Pure crumpled plastic wrap texture photograph. Full-bleed, no borders, no margins.`
  },
];

async function genOne(prompt, aspectRatio, outPath){
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { imageConfig: { aspectRatio } },
  };
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const errText = await r.text();
    throw new Error(`${r.status}: ${errText.slice(0,200)}`);
  }
  const j = await r.json();
  const parts = j?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const data = p.inlineData?.data || p.inline_data?.data;
    if (data) {
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      return true;
    }
  }
  throw new Error(`no image in response: ${JSON.stringify(j).slice(0,300)}`);
}

async function run(){
  for (const size of SIZES) {
    for (const t of TEXTURES) {
      const outPath = path.join(OUT_DIR, `ai-${t.name}-${size.name}.png`);
      process.stdout.write(`→ ${path.basename(outPath)} ... `);
      try {
        await genOne(t.prompt, size.aspectRatio, outPath);
        console.log('✓');
      } catch (e) {
        console.log(`✗ ${e.message?.slice(0,140)}`);
      }
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
