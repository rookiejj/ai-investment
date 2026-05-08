#!/usr/bin/env node
// 오늘의 1컷 만화 — update.js 요약을 받아 풍자적 편집만화 PNG 생성.
//
// 무료 파이프라인 (Gemini 2.5 Flash Image / "Nano Banana"):
//   1. data/*-update.js의 최신 entry summary를 읽음 (한국·미국 마켓)
//   2. 핵심 이벤트 1~2건 뽑아 메타포 시나리오 매칭 → 한국어 프롬프트 빌드
//   3. Gemini API로 이미지 생성 (한국어 텍스트 렌더링 가능)
//   4. scripts/cartoon/out/YYYY-MM-DD-HHMM.png 저장
//
// 환경변수:
//   GEMINI_API_KEY — Google AI Studio API 키 (.env에서 로드)
//
// 사용:
//   node scripts/cartoon/generate.js
//   node scripts/cartoon/generate.js --prompt-only   (프롬프트만 출력)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// .env 로드 (zero deps)
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

function loadUpdates(file, varName) {
  const t = fs.readFileSync(path.join(ROOT, 'data', file), 'utf8');
  return new Function(t + `;return typeof ${varName}!=="undefined"?${varName}:[];`)();
}

function todayKST() {
  return new Date(Date.now() + 9 * 3600 * 1000);
}

function todayStamp() {
  const d = todayKST();
  const y = d.getUTCFullYear(), m = String(d.getUTCMonth() + 1).padStart(2, '0'), day = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0'), mm = String(d.getUTCMinutes()).padStart(2, '0'), ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${day}-${hh}${mm}${ss}`;
}

// N번째 entry의 summary 모두 모아 헤드라인 (0 = 가장 최신)
function headlinesAt(index) {
  const tabs = [
    {file: 'kr-stocks-update.js', var: 'updates', label: '한국'},
    {file: 'stocks-update.js', var: 'updates', label: '미국'},
    {file: 'ai-update.js', var: 'UPDATES', label: 'AI'},
    {file: 'commodity-update.js', var: 'updates', label: '원자재'},
    {file: 'unicorn-update.js', var: 'updates', label: '유니콘'},
  ];
  const out = {};
  let dateRef = '';
  for (const t of tabs) {
    try {
      const upd = loadUpdates(t.file, t.var);
      const entry = upd[index];
      if (!entry) { out[t.label] = []; continue; }
      const lines = (entry.summary || '').split('\n').map(s => s.trim()).filter(Boolean);
      out[t.label] = lines;
      if (!dateRef && entry.date) dateRef = entry.date;
    } catch { out[t.label] = []; }
  }
  out.__dateRef = dateRef;
  return out;
}

const todaysHeadlines = () => headlinesAt(0);

// 화풍 프리셋 — --style 플래그로 선택. 사용처별로 다른 톤 적용 가능.
const STYLES = {
  '1950s': `1950s American newspaper political cartoon style, single panel. Heavy ink crosshatching, sepia-toned limited palette, exaggerated caricature in vintage editorial tradition, classic ink-wash shading, hand-lettered captions, mid-century WSJ/NYT op-ed page look. 1080×1350 portrait (4:5) format — vertical, taller than wide.`,
  'mad-mag': `Mad Magazine style satirical cartoon, single panel. Wildly exaggerated caricature with rubber-hose proportions, loud primary colors, busy chaotic composition with multiple gags happening at once, bold outlines, screaming faces, sound-effect text bursts. Garish 1970s magazine print look. 1080×1350 portrait (4:5) format — vertical, taller than wide.`,
  'ghibli': `Studio Ghibli inspired hand-painted watercolor illustration, single panel editorial scene. Warm soft tones, painterly clouds and atmospheric lighting, expressive but gentle character design, dreamlike composition with rich background detail. 1080×1350 portrait (4:5) format — vertical, taller than wide.`,
  'pixar': `Pixar-style 3D rendered editorial scene, single still frame. Clean polished CGI with cinematic lighting, optimistic tone, expressive but realistic character proportions, beautiful background detail with depth-of-field. 1080×1350 portrait (4:5) format — vertical, taller than wide.`,
  'k-webtoon': `Korean webtoon style illustration, single panel. Flat cel-shaded colors with crisp linework, expressive manhwa character faces, dynamic posing, vibrant accent colors against neutral backgrounds, modern digital art finish. 1080×1350 portrait (4:5) format — vertical, taller than wide.`,
};

// 그날의 실제 헤드라인을 프롬프트에 직접 주입 — 모델이 매번 다른 장면 합성
function buildPrompt(headlines, styleKey) {
  const baseStyle = STYLES[styleKey] || STYLES['1950s'];

  // 5개 탭 첫 줄을 그대로 모델에게 — 각 entry마다 다른 헤드라인이라 자연스레 다른 장면 도출
  const lines = [];
  for (const [k, ls] of Object.entries(headlines)) {
    if (k.startsWith('__')) continue;
    if (ls.length) lines.push(`【${k}】 ${ls[0]}`);
  }
  const situation = lines.join('\n');

  return `${baseStyle}

오늘의 시장 상황 (아래 사건들을 한 화면에 풍자·은유로 통합 표현):
${situation}

지시:
- 위 사건 중 가장 임팩트 큰 1~2건을 화면 중심으로, 나머지는 배경·소품으로 자연스럽게 녹이기.
- 등장 종목·기업명을 캐릭터로 의인화 (예: "AMD"·"삼성전자"·"한화에어로"·"PLTR" 등 실제 사건 주체를 그대로 사용).
- 한국어 말풍선 1~2개로 핵심 메시지를 짧고 또렷하게 표시 — 정확한 한국어 한글 글자.
- 차트·라벨·플래카드 등 소품에 한국어/영문 텍스트 자연스럽게 표기 (수치는 정확히).
- 시장이 상승장이면 밝고 흥겨운 톤, 하락·긴장 분위기면 그에 맞는 표정·구도.
- 화면 우하단 모서리에 작게 "오늘의 브리픽" 워터마크.`;
}

// 화풍 → Supabase Storage 파일명 매핑.
// 모든 화풍을 같은 흐름으로 저장하고 사용처(홈페이지·인스타)에서 분기.
// 추후 새 화풍 추가 시 이 객체에 한 줄만 추가.
const STYLE_STORAGE = {
  '1950s': 'today-news.png',       // 홈페이지 + 오전 캐러셀
  'mad-mag': 'today-magazine.png', // 저녁 Reels (현재) + 추후 오전 캐러셀 옵션
};

// Supabase Storage 업로드 — public bucket 'cartoon'에 화풍별 파일로 갱신
async function uploadToSupabase(buf, file) {
  const url = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';
  const key = process.env.BRIEFICK_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('BRIEFICK_SUPABASE_SECRET_KEY 환경변수 필요 (Supabase secret key)');
  const bucket = 'cartoon';

  // 버킷 생성 (이미 있으면 무시) — POST bucket
  const bucketUrl = `${url}/storage/v1/bucket`;
  const ensureRes = await fetch(bucketUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'apikey': key },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  });
  if (!ensureRes.ok && ensureRes.status !== 409) {
    const t = await ensureRes.text();
    if (!t.includes('already exists')) console.warn(`[bucket] ${ensureRes.status}: ${t}`);
  }

  // 파일 업로드 (upsert)
  const uploadUrl = `${url}/storage/v1/object/${bucket}/${file}`;
  const r = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'apikey': key,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
      'Cache-Control': 'public, max-age=300',
    },
    body: buf,
  });
  if (!r.ok) throw new Error(`upload ${r.status}: ${await r.text()}`);
  const publicUrl = `${url}/storage/v1/object/public/${bucket}/${file}`;
  return publicUrl;
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경변수 누락 — .env에 추가하거나 export 필요');
  }
  // nano-banana-pro-preview ($0.13/장) — 한국어 렌더링 정확도 때문에 복귀.
  // gemini-2.5-flash-image($0.04/장)로 다운그레이드 시도했으나 한글 자모 hallucination이 심해
  // 워터마크·말풍선 글자가 깨짐("오늘"→"오들" 등). 비용 3배지만 품질 우선.
  // KST 시간대 분기로 매 실행 1장만 생성해 일일 비용은 ~$0.26 수준.
  const model = process.env.GEMINI_IMAGE_MODEL || 'nano-banana-pro-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  // 모든 화풍을 4:5 portrait로 통일 — 홈페이지 카툰 슬롯이 같은 비율로 렌더링되도록.
  // 프롬프트의 "1080×1350" 문구만으로는 모델이 가끔 1:1 정사각을 뱉어 화풍별 불일치 발생.
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { imageConfig: { aspectRatio: '4:5' } },
  };
  console.log(`[fetch] Gemini API ${model}`);
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const errText = await r.text();
    throw new Error(`Gemini API ${r.status}: ${errText}`);
  }
  const j = await r.json();
  // 응답에서 inlineData(base64 image) 추출
  const parts = j?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    if (p.inlineData?.data) {
      return Buffer.from(p.inlineData.data, 'base64');
    }
    if (p.inline_data?.data) {  // 호환성: snake_case도 시도
      return Buffer.from(p.inline_data.data, 'base64');
    }
  }
  throw new Error(`이미지 데이터 없음. 응답: ${JSON.stringify(j).slice(0, 500)}`);
}

function parseArg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i < 0 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

async function main() {
  const promptOnly = process.argv.includes('--prompt-only');
  const noOpen = process.argv.includes('--no-open');
  const noLatest = process.argv.includes('--no-latest');
  const upload = process.argv.includes('--upload');
  const index = Number(parseArg('--index', 0));
  const tag = parseArg('--tag', '');
  const styleKey = parseArg('--style', '1950s');
  const customOut = parseArg('--output', '');
  const headlines = headlinesAt(index);
  console.log(`[headlines] index=${index}${headlines.__dateRef ? ` (date=${headlines.__dateRef})` : ''}`);
  for (const [k, lines] of Object.entries(headlines)) {
    if (k.startsWith('__')) continue;
    if (lines.length) console.log(`  ${k}: ${lines[0]}`);
  }
  console.log(`[style] ${styleKey}`);

  const prompt = buildPrompt(headlines, styleKey);
  console.log('\n[prompt]');
  console.log(prompt);

  if (promptOnly) {
    console.log('\n[prompt-only mode] API 호출 생략.');
    return;
  }

  console.log('\n[generating image...]');
  const buf = await callGemini(prompt);
  const stamp = todayStamp();
  const idxPart = index > 0 ? `-idx${index}` : '';
  const stylePart = styleKey !== '1950s' ? `-${styleKey}` : '';
  const tagPart = tag ? `-${tag}` : '';
  const out = customOut || path.join(OUT_DIR, `${stamp}${idxPart}${stylePart}${tagPart}.png`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
  console.log(`[saved] ${out}  (${(buf.length / 1024).toFixed(1)} KB)`);

  // 메인 페이지(로컬)가 참조할 latest는 index=0(최신) 1950s 스타일에서만 갱신.
  // --no-latest로 명시 회피 가능 (인스타용 cartoon 생성 시 사용).
  if (index === 0 && styleKey === '1950s' && !noLatest) {
    const latest = path.join(OUT_DIR, 'latest.png');
    fs.writeFileSync(latest, buf);
    console.log(`[saved] ${latest}  (로컬 메인 페이지가 참조)`);
  }

  // Supabase Storage 업로드 — index=0(최신) + STYLE_STORAGE에 매핑된 화풍만 업로드
  // 매핑 없는 화풍(pixar·k-webtoon 등)은 로컬 파일만 저장하고 Storage 갱신 skip
  // today-latest.png에도 함께 업로드 — 홈페이지는 이 파일만 읽어 항상 가장 최근 카툰 노출
  // (시각 기반 분기 폐기, 화풍별 파일은 인스타 워크플로용으로 유지).
  if (upload && index === 0) {
    const storageFile = STYLE_STORAGE[styleKey];
    if (storageFile) {
      try {
        const publicUrl = await uploadToSupabase(buf, storageFile);
        console.log(`[uploaded] ${publicUrl}`);
        const latestUrl = await uploadToSupabase(buf, 'today-latest.png');
        console.log(`[uploaded] ${latestUrl}`);
      } catch (e) {
        console.error(`[upload failed] ${e.message}`);
        process.exit(1);
      }
    } else {
      console.log(`[skip upload] style=${styleKey}는 Storage 매핑 없음 — 로컬 저장만`);
    }
  }

  if (process.platform === 'darwin' && !noOpen) {
    require('child_process').exec(`open "${out}"`);
    console.log('[opened in default viewer]');
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
