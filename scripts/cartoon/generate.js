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
  const hh = String(d.getUTCHours()).padStart(2, '0'), mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}-${hh}${mm}`;
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

// 그날의 실제 헤드라인을 프롬프트에 직접 주입 — 모델이 매번 다른 장면 합성
function buildPrompt(headlines) {
  const baseStyle = `한국 풍자 만화 화풍의 디테일한 1컷 편집만화. 손그림 수채화·잉크 톤, 캐릭터 표정 풍부하고 과장됨, 다양한 등장인물·소품·말풍선이 한 화면에 빼곡하게 배치된 활기찬 구도. 따뜻한 어스 톤 위주, 한국 일러스트레이션 스타일. 1080×1080 정사각.`;

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

// Supabase Storage 업로드 — public bucket 'cartoon'에 today.png로 갱신
async function uploadToSupabase(buf) {
  const url = process.env.SUPABASE_URL || 'https://ytvcgoldauysvnqckzze.supabase.co';
  const key = process.env.BRIEFICK_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('BRIEFICK_SUPABASE_SECRET_KEY 환경변수 필요 (Supabase secret key)');
  const bucket = 'cartoon';
  const file = 'today.png';

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
  // nano-banana-pro-preview — 한국어 텍스트 렌더링 가장 안정적인 신규 모델
  // 대안: gemini-3-pro-image-preview / gemini-2.5-flash-image
  const model = process.env.GEMINI_IMAGE_MODEL || 'nano-banana-pro-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
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
  const upload = process.argv.includes('--upload');
  const index = Number(parseArg('--index', 0));
  const tag = parseArg('--tag', '');
  const headlines = headlinesAt(index);
  console.log(`[headlines] index=${index}${headlines.__dateRef ? ` (date=${headlines.__dateRef})` : ''}`);
  for (const [k, lines] of Object.entries(headlines)) {
    if (k.startsWith('__')) continue;
    if (lines.length) console.log(`  ${k}: ${lines[0]}`);
  }

  const prompt = buildPrompt(headlines);
  console.log('\n[prompt]');
  console.log(prompt);

  if (promptOnly) {
    console.log('\n[prompt-only mode] API 호출 생략.');
    return;
  }

  console.log('\n[generating image...]');
  const buf = await callGemini(prompt);
  const stamp = todayStamp();
  const suffix = tag ? `-${tag}` : (index > 0 ? `-idx${index}` : '');
  const out = path.join(OUT_DIR, `${stamp}${suffix}.png`);
  fs.writeFileSync(out, buf);
  console.log(`[saved] ${out}  (${(buf.length / 1024).toFixed(1)} KB)`);

  // 메인 페이지가 참조할 latest는 index=0(최신 헤드라인)일 때만 갱신
  if (index === 0) {
    const latest = path.join(OUT_DIR, 'latest.png');
    fs.writeFileSync(latest, buf);
    console.log(`[saved] ${latest}  (로컬 메인 페이지가 참조)`);
  }

  // Supabase Storage 업로드 — production 메인 페이지가 fetch
  if (upload && index === 0) {
    try {
      const publicUrl = await uploadToSupabase(buf);
      console.log(`[uploaded] ${publicUrl}`);
    } catch (e) {
      console.error(`[upload failed] ${e.message}`);
      process.exit(1);
    }
  }

  if (process.platform === 'darwin' && !noOpen) {
    require('child_process').exec(`open "${out}"`);
    console.log('[opened in default viewer]');
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
