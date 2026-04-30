#!/usr/bin/env node
/**
 * 슬라이드 BG 이미지 소싱 — Unsplash 검색 + 인물 필터
 *
 * 동작:
 *   1) 탭의 첫 불릿에서 키워드 후보 추출 (영문 티커·한글 토큰)
 *   2) KEYWORD_TO_QUERY 매핑 → 인물 없는 사물·장소 쿼리로 변환
 *   3) Unsplash search/photos 호출 (orientation=portrait, content_filter=high)
 *   4) 결과의 tags 배열에서 person/people/face 등이 들어간 이미지 제외
 *   5) 첫 통과 항목의 raw URL 다운로드 → base64 data URI 반환
 *   6) 어떤 단계든 실패하면 카테고리 디폴트로 폴백, 그것도 실패면 null
 *
 * 사용 (render-slides.js):
 *   const { fetchImageDataUri } = require('./image-source');
 *   const dataUri = await fetchImageDataUri({ tabKey, bullets, accessKey });
 *
 * 환경변수:
 *   UNSPLASH_ACCESS_KEY  Unsplash API 액세스 키 (Demo 50/hr 또는 Production 5000/hr)
 */

// 인물 사진 차단용 태그 키워드
const PEOPLE_TAGS = [
  'person', 'people', 'man', 'woman', 'face', 'portrait', 'human',
  'model', 'boy', 'girl', 'child', 'baby', 'crowd', 'selfie',
  'beard', 'hair', 'eye', 'lips', 'smile',
];

// 영문 티커·고유명사·키워드 → 사물·장소 쿼리 (인물 회피 의도 반영)
const KEYWORD_TO_QUERY = {
  // === 미국 메가캡·대형주 ===
  'NVDA':    'data center server racks',
  'NVIDIA':  'data center server racks',
  'AAPL':    'apple store storefront',
  'APPLE':   'apple store',
  'MSFT':    'microsoft headquarters building',
  'GOOGL':   'google office building',
  'GOOG':    'google office',
  'GOOGLE':  'google headquarters',
  'META':    'social network abstract',
  'AMZN':    'amazon warehouse',
  'AMAZON':  'amazon warehouse',
  'TSLA':    'electric car charging',
  'TESLA':   'electric vehicle factory',
  'AVGO':    'semiconductor chip closeup',
  'AMD':     'semiconductor wafer',
  'TSM':     'semiconductor fabrication',
  'INTC':    'silicon chip macro',
  'V':       'credit card payment terminal',
  'MA':      'credit card abstract',
  'XOM':     'oil refinery night',
  'CVX':     'oil pump jack sunset',
  'COP':     'oil drilling rig',
  'LNG':     'lng tanker ship',
  'SBUX':    'coffee shop interior',
  'NFLX':    'cinema screen abstract',
  'DIS':     'theme park castle',
  'JPM':     'wall street bank building',
  'GS':      'wall street skyline',

  // === 크립토 ===
  'BTC':       'bitcoin physical coin',
  'BITCOIN':   'bitcoin coin closeup',
  'ETH':       'ethereum coin abstract',
  'ETHEREUM':  'ethereum digital abstract',
  'SOL':       'cryptocurrency abstract',
  'XRP':       'cryptocurrency network',
  'MSTR':      'bitcoin vault',

  // === 거시·정책 ===
  'FOMC':    'federal reserve building',
  'POWELL':  'federal reserve building exterior',
  'YELLEN':  'us treasury building',
  'FED':     'federal reserve building columns',
  'CPI':     'inflation chart abstract',
  'GDP':     'economy growth chart',
  '연준':     'federal reserve building',
  '한은':     'bank of korea seoul',
  '한국은행': 'bank of korea seoul',
  'BOJ':     'tokyo financial district',

  // === 원자재 ===
  'BRENT':   'oil platform sea',
  'WTI':     'oil drilling rig sunset',
  'OIL':     'oil refinery industrial',
  'GOLD':    'gold bars stack',
  '금':      'gold bullion bars',
  'SILVER':  'silver bars',
  '구리':    'copper wire industrial',
  'COPPER':  'copper mining',
  '리튬':    'lithium battery factory',
  'LITHIUM': 'lithium mining',

  // === 시장·인덱스 ===
  '코스피':  'seoul skyline night financial',
  'KOSPI':   'seoul financial district',
  '나스닥':  'wall street night skyline',
  'NASDAQ':  'new york stock exchange',
  'NYSE':    'new york stock exchange building',
  'S&P':     'wall street trading floor',

  // === 한국 종목 (코드 + 영문) ===
  '005930':  'samsung semiconductor fab',     // 삼성전자
  '000660':  'sk hynix semiconductor',        // SK하이닉스
  '005380':  'hyundai motor factory',         // 현대차
  '000270':  'kia motor factory',             // 기아
  '035420':  'tech office workspace',         // 네이버
  '035720':  'tech office workspace',         // 카카오
  '373220':  'battery factory',               // LG에너지솔루션
  '247540':  'battery production line',       // 에코프로비엠
  '012450':  'defense industry tank',         // 한화에어로스페이스
  '329180':  'shipyard cranes',               // HD현대중공업
  '042660':  'shipbuilding shipyard',         // 한화오션
  '삼성전자': 'samsung semiconductor fab',
  '하이닉스': 'sk hynix semiconductor',
  '현대차':   'hyundai car factory',

  // === AI 기업 ===
  'OPENAI':    'ai neural network abstract',
  'CHATGPT':   'ai chat abstract',
  'CLAUDE':    'ai abstract neural',
  'ANTHROPIC': 'ai neural network',
  'XAI':       'ai abstract glowing',
  'MISTRAL':   'ai abstract france',
  'GEMINI':    'ai abstract',
  'DEEPMIND':  'ai neural network',

  // === 기술 키워드 ===
  'GPU':       'gpu graphics card closeup',
  'TPU':       'silicon chip macro',
  'HBM':       'memory chip closeup',
  'DRAM':      'memory module',
  'SMR':       'small modular reactor',
  '원자력':    'nuclear power plant',
  'NUCLEAR':   'nuclear power plant cooling tower',
  '데이터센터': 'data center server',

  // === 산업 ===
  '조선':     'shipyard cranes industrial',
  'SHIPYARD': 'shipyard industrial',
  '방산':     'defense industry abstract',
  'DEFENSE':  'military equipment industrial',
  '바이오':   'laboratory science abstract',
  'BIOTECH':  'biotech laboratory',
  'PHARMA':   'pharmaceutical laboratory',
  '제약':     'pharmaceutical lab',
  '게임':     'gaming console abstract',
  'GAMING':   'gaming setup',
  '엔터':     'concert stage lights',
  'K-POP':    'concert stage lights',
  '화장품':   'cosmetic products flatlay',
  'COSMETIC': 'cosmetic products',
  '식품':     'food production line',
  'FOOD':     'food industry',
  '건설':     'construction crane skyline',
  '리테일':   'retail store interior',
  '핀테크':   'fintech abstract digital',
  'FINTECH':  'fintech digital payment',

  // === 유니콘·VC ===
  '스페이스X': 'rocket launch',
  'SPACEX':    'rocket launch',
  'STRIPE':    'fintech payment abstract',
  'DATABRICKS':'data abstract code',
  'CANVA':     'design tools abstract',
  'CHIME':     'mobile banking abstract',
  'NEURALINK': 'brain neural abstract',
};

// 카테고리별 디폴트 (매핑 실패 시 폴백)
const CATEGORY_DEFAULTS = {
  stocks:    'wall street new york night',
  kr:        'seoul financial district night',
  ai:        'data center server racks dark',
  commodity: 'oil refinery night industrial',
  unicorn:   'silicon valley tech office',
  cover:     'stock market chart abstract dark',
};

// 첫 불릿(또는 합본)에서 매핑 가능한 키워드 후보 추출
function extractCandidates(bullets) {
  const txt = (bullets || []).slice(0, 2).join(' ').trim();
  if (!txt) return [];
  const out = [];
  // 영문 대문자 토큰 (티커·약어)
  const upper = txt.match(/\b[A-Z][A-Z0-9&]{1,7}\b/g) || [];
  out.push(...upper);
  // 한글 2~6자 토큰
  const ko = txt.match(/[가-힣]{2,6}/g) || [];
  out.push(...ko);
  // 숫자 6자리 한국 종목코드
  const krCode = txt.match(/\b\d{6}\b/g) || [];
  out.push(...krCode);
  return out;
}

function pickQuery(tabKey, bullets) {
  const cands = extractCandidates(bullets);
  for (const c of cands) {
    const upper = c.toUpperCase();
    if (KEYWORD_TO_QUERY[upper]) return { query: KEYWORD_TO_QUERY[upper], matched: upper };
    if (KEYWORD_TO_QUERY[c])     return { query: KEYWORD_TO_QUERY[c],     matched: c };
  }
  return { query: CATEGORY_DEFAULTS[tabKey] || 'abstract dark', matched: null };
}

function hasPersonTag(photo) {
  const tags = (photo?.tags || []).map(t => (t?.title || t?.source?.title || '').toLowerCase());
  return tags.some(t => PEOPLE_TAGS.some(p => t.includes(p)));
}

async function searchUnsplash(query, accessKey) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'portrait');
  url.searchParams.set('content_filter', 'high');
  url.searchParams.set('per_page', '15');
  const res = await fetch(url, {
    headers: {
      'Authorization': `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
  });
  if (!res.ok) throw new Error(`Unsplash search 실패 ${res.status}`);
  const json = await res.json();
  return Array.isArray(json?.results) ? json.results : [];
}

async function downloadAsBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`이미지 다운로드 실패 ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ct  = res.headers.get('content-type') || 'image/jpeg';
  return `data:${ct};base64,${buf.toString('base64')}`;
}

// Unsplash 사용 통계 트리거 (가이드라인 준수): /photos/{id}/download 호출
async function pingDownloadEndpoint(photoId, accessKey) {
  try {
    await fetch(`https://api.unsplash.com/photos/${photoId}/download`, {
      headers: { 'Authorization': `Client-ID ${accessKey}` },
    });
  } catch { /* best-effort */ }
}

/**
 * 메인: 탭에 맞는 BG 이미지 데이터 URI 반환.
 * @param {Set<string>} [usedIds] — 이미 사용한 photo.id 집합. 같은 게시물 내 중복 회피.
 * @returns {Promise<{ dataUri: string, query: string, matched: string|null, photo: object } | null>}
 */
async function fetchImageDataUri({ tabKey, bullets, accessKey, usedIds }) {
  if (!accessKey) return null;
  const used = usedIds instanceof Set ? usedIds : new Set();
  const { query, matched } = pickQuery(tabKey, bullets);

  const tryQueries = [query];
  if (CATEGORY_DEFAULTS[tabKey] && CATEGORY_DEFAULTS[tabKey] !== query) {
    tryQueries.push(CATEGORY_DEFAULTS[tabKey]); // 1차 결과 부족 시 폴백
  }
  // 모든 쿼리 결과가 used와 충돌하는 극단 상황 대비: 중립 쿼리 추가
  tryQueries.push('abstract dark texture', 'minimalist gradient dark');

  for (const q of tryQueries) {
    let results = [];
    try { results = await searchUnsplash(q, accessKey); }
    catch (e) { console.warn(`  ⚠ Unsplash 검색 실패 (${q}):`, e.message); continue; }
    if (!results.length) continue;

    // 인물 차단 + 이미 쓴 ID 차단
    const candidates = results.filter(p => !hasPersonTag(p) && !used.has(p.id));
    const picked = candidates[0];
    if (!picked) continue;

    const imgUrl = picked.urls?.raw
      ? `${picked.urls.raw}&w=1080&h=1350&fit=crop&q=80&fm=jpg`
      : picked.urls?.regular;
    if (!imgUrl) continue;

    try {
      const dataUri = await downloadAsBase64(imgUrl);
      pingDownloadEndpoint(picked.id, accessKey); // fire-and-forget
      used.add(picked.id);
      return { dataUri, query: q, matched, photo: picked };
    } catch (e) {
      console.warn(`  ⚠ 이미지 다운로드 실패:`, e.message);
      continue;
    }
  }
  return null;
}

module.exports = { fetchImageDataUri, pickQuery, KEYWORD_TO_QUERY, CATEGORY_DEFAULTS };
