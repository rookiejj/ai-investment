#!/usr/bin/env node
// 매일 자동 갱신되는 5탭 헤드라인을 SEO 정적 HTML로 변환.
//
// 입력: data/{kr-stocks,stocks,ai,commodity,unicorn}-update.js의 entries[0]
// 출력:
//   /daily/YYYY-MM-DD.html        ← 그날 헤드라인 페이지
//   /daily/index.html             ← 최근 60개 카드 그리드
//   /sitemap.xml                  ← 모든 daily 페이지 + 메인
//   /robots.txt                   ← sitemap 가리키기
//
// 페이지 날짜는 stocks(가장 안정적) entries[0].date의 KST 날짜 prefix를 사용.
// 멱등 — 같은 날 재실행하면 같은 파일 생성, git이 변경 없으면 커밋 없음.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOMAIN = 'https://briefick.com';

const TABS = [
  { id: 'kr',        emoji: '🇰🇷', label: '한국 마켓',     file: 'kr-stocks-update.js' },
  { id: 'stocks',    emoji: '🇺🇸', label: '미국 마켓',     file: 'stocks-update.js' },
  { id: 'ai',        emoji: '🤖', label: 'AI 기업',       file: 'ai-update.js' },
  { id: 'commodity', emoji: '🛢️', label: '원자재·크립토', file: 'commodity-update.js' },
  { id: 'unicorn',   emoji: '🦄', label: '유니콘·프리IPO', file: 'unicorn-update.js' },
];

// ─── 데이터 로더 ────────────────────────────────────────
function loadUpdates(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // updates 배열 + 호환 entries — daily-send와 동일 패턴
  const updates = new Function(`${src};return typeof updates!=="undefined"?updates:[];`)();
  return updates || [];
}

function loadCompanyKo() {
  const src = fs.readFileSync(path.join(ROOT, 'data', 'company-ko.js'), 'utf8');
  const map = new Function(`${src};return typeof COMPANY_KO!=="undefined"?COMPANY_KO:{};`)();
  return Object.entries(map).sort((a, b) => b[0].length - a[0].length);
}

function makeLocalizer(pairs) {
  return function localize(text) {
    if (!text) return text;
    let r = String(text);
    for (const [en, ko] of pairs) {
      const esc = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      r = r.replace(new RegExp('(?<![A-Za-z0-9])' + esc + '(?![A-Za-z0-9])', 'g'), ko);
    }
    return r;
  };
}

// ─── 탭별 entry 수집 ────────────────────────────────────
function collectTabs(localize) {
  const result = [];
  for (const tab of TABS) {
    const fp = path.join(ROOT, 'data', tab.file);
    if (!fs.existsSync(fp)) continue;
    const updates = loadUpdates(fp);
    const top = updates[0];
    if (!top) continue;
    // ai 탭은 entries 형식도 있음 — summary가 없으면 skip
    const summary = top.summary;
    if (!summary || typeof summary !== 'string') continue;
    result.push({
      ...tab,
      date: top.date || '',
      summary: localize(summary.trim()),
      changes: Array.isArray(top.changes)
        ? top.changes.map(c => ({ ...c, detail: localize(c.detail || '') }))
        : [],
    });
  }
  return result;
}

// ─── 날짜 파싱 ──────────────────────────────────────────
function extractDate(dateStr) {
  // "2026-05-20 07:10 KST" → "2026-05-20"
  const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function dayOfWeekKo(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return ['일', '월', '화', '수', '목', '금', '토'][date.getUTCDay()];
}

function dateLabel(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일 (${dayOfWeekKo(yyyyMmDd)})`;
}

// ─── HTML escape ───────────────────────────────────────
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── 페이지 HTML 생성 ───────────────────────────────────
function buildDailyHtml(pageDate, tabs) {
  const dayLabel = dateLabel(pageDate);

  // 첫 줄 헤드라인 모음 (kr → stocks → ai)
  const headlineLines = tabs
    .slice(0, 3)
    .map(t => t.summary.split('\n')[0]?.trim())
    .filter(Boolean);
  const description = headlineLines.join(' · ').slice(0, 200);
  const title = `${dayLabel} 시황 — 미국·한국 주식·AI·원자재·유니콘 | 브리픽`;
  const canonical = `${DOMAIN}/daily/${pageDate}`;
  const ogImage = `${DOMAIN}/assets/og-image-20260513.png`;
  const publishedISO = `${pageDate}T07:00:00+09:00`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: `${dayLabel} 시황 — 5탭 통합 헤드라인`,
    description,
    datePublished: publishedISO,
    dateModified: publishedISO,
    inLanguage: 'ko-KR',
    author: { '@type': 'Organization', name: '브리픽', url: DOMAIN },
    publisher: {
      '@type': 'Organization',
      name: '브리픽',
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/assets/favicon-192.png` },
    },
    image: ogImage,
    mainEntityOfPage: canonical,
    articleSection: ['미국 주식', '한국 주식', 'AI 기업', '원자재·크립토', '유니콘'],
    keywords: '시황,미국 주식,한국 주식,AI 기업,원자재,크립토,유니콘,IPO,투자 대시보드,브리픽',
  };

  const sections = tabs.map(t => {
    const lines = t.summary.split('\n').map(s => s.trim()).filter(Boolean);
    const liHtml = lines.map(l => `      <li>${esc(l)}</li>`).join('\n');
    const detailsHtml = t.changes.length
      ? `\n  <details class="depth">\n    <summary>상세 보기 (${t.changes.length}건)</summary>\n${t.changes
          .map(c => `    <article class="ch"><h3>${esc(c.sector || '')}</h3><p>${esc(c.detail || '')}</p></article>`)
          .join('\n')}\n  </details>`
      : '';
    return `<section class="tab">
  <h2><span class="emj" aria-hidden="true">${t.emoji}</span> ${esc(t.label)}</h2>
  <ul class="sum">
${liHtml}
  </ul>${detailsHtml}
</section>`;
  }).join('\n\n');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="keywords" content="시황,미국 주식,한국 주식,AI 기업,원자재,크립토,유니콘,IPO,투자 대시보드,브리픽,${pageDate}">
<meta name="author" content="브리픽">
<meta name="naver-site-verification" content="94e282ae9b4b0a4379c03d4dbc7c4e5ad3b1649b">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">

<meta property="og:title" content="${esc(dayLabel)} 시황 | 브리픽">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="브리픽">
<meta property="og:locale" content="ko_KR">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:published_time" content="${publishedISO}">
<meta property="article:section" content="Finance">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(dayLabel)} 시황 | 브리픽">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">

<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css">
<style>
:root{
  --bg:#fafafa;--panel:#fff;--fg:#0d0d0d;--fg2:#333;--mut:#666;--sub:#999;
  --border:rgba(0,0,0,0.06);--border-md:rgba(0,0,0,0.1);
  --acc:#18E299;--acc-deep:#0fa76e;--acc-light:#d4fae8;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg2);font:15px/1.6 Pretendard,-apple-system,system-ui,sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh}
a{color:inherit;text-decoration:none}
a:hover{color:var(--acc-deep)}

.back-home{display:inline-flex;align-items:center;padding:14px 20px;color:var(--mut);font-size:14px}

.wrap{min-height:calc(100vh - 48px);display:flex;align-items:flex-start;justify-content:center;padding:8px 20px 60px}
.card{background:var(--panel);border-radius:20px;padding:32px 28px;width:100%;max-width:760px;box-shadow:0 8px 28px rgba(0,0,0,0.06)}

.brand{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.brand img{width:36px;height:36px;border-radius:50%;object-fit:cover}
.brand span{font:700 16px/1 Pretendard,sans-serif;color:var(--fg);letter-spacing:-0.3px}

h1{font:700 26px/1.3 Pretendard,sans-serif;color:var(--fg);letter-spacing:-0.5px;margin-bottom:10px}
.lead{color:var(--mut);font-size:14px;margin-bottom:32px;line-height:1.55}

.tab{padding:20px 0;border-top:1px solid var(--border)}
.tab:first-of-type{border-top:none;padding-top:8px}
.tab h2{font:700 18px/1.3 Pretendard,sans-serif;color:var(--fg);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.emj{font-size:22px}

.sum{list-style:none;display:flex;flex-direction:column;gap:8px}
.sum li{padding-left:14px;position:relative;color:var(--fg2);font-size:15px;line-height:1.55}
.sum li::before{content:"·";position:absolute;left:2px;color:var(--acc-deep);font-weight:700}

.depth{margin-top:14px;border-top:1px dashed var(--border);padding-top:12px}
.depth summary{color:var(--mut);font-size:13px;cursor:pointer;padding:6px 0}
.depth summary:hover{color:var(--acc-deep)}
.ch{margin-top:12px;padding:12px 14px;background:#f6f7f6;border-radius:10px}
.ch h3{font:600 13px/1.3 Pretendard,sans-serif;color:var(--acc-deep);margin-bottom:6px}
.ch p{font-size:14px;line-height:1.6;color:var(--fg2)}

.cta{margin-top:36px;padding-top:24px;border-top:1px solid var(--border);text-align:center}
.cta .btn{display:inline-block;padding:14px 24px;background:var(--acc);color:#001a0e;border-radius:12px;font-weight:700;margin-bottom:14px}
.cta .btn:hover{background:var(--acc-deep);color:#fff}
.cta .link{display:block;color:var(--mut);font-size:13px;margin-top:4px}

footer.site{margin-top:40px;color:var(--sub);font-size:12px;text-align:center;line-height:1.7}
footer.site a{color:var(--mut)}

@media (max-width:520px){
  .card{padding:24px 18px;border-radius:16px}
  h1{font-size:22px}
  .tab h2{font-size:17px}
  .sum li{font-size:14px}
}
</style>
</head>
<body>
<a class="back-home" href="/">← 실시간 대시보드</a>
<main class="wrap">
<article class="card">
  <header class="brand">
    <img src="/assets/briefick_profile_640.jpeg" alt="브리픽 로고" width="36" height="36" loading="lazy">
    <span>브리픽 · 일일 시황</span>
  </header>

  <h1>${esc(dayLabel)} 시황</h1>
  <p class="lead">미국·한국 주식, AI 기업, 원자재·크립토, 유니콘·프리IPO 5개 도메인의 그날 헤드라인. 매일 KST 07시·19시 자동 업데이트.</p>

${sections}

  <div class="cta">
    <a class="btn" href="/">실시간 대시보드 보기 →</a>
    <a class="link" href="/daily/">지난 시황 모아보기</a>
  </div>

  <footer class="site">
    브리픽 · 매일 자동 갱신되는 통합 투자 대시보드<br>
    <a href="/">briefick.com</a> · <a href="/terms">이용약관</a> · <a href="/privacy">개인정보처리방침</a>
  </footer>
</article>
</main>
</body>
</html>
`;
}

// ─── 인덱스 페이지 (최근 N개) ──────────────────────────
function buildIndexHtml(dailyPages) {
  const items = dailyPages
    .map(p => {
      const lbl = dateLabel(p.date);
      const head = (p.headline || '').slice(0, 80);
      return `    <li><a href="/daily/${p.date}"><strong>${esc(lbl)}</strong><span>${esc(head)}</span></a></li>`;
    })
    .join('\n');

  const title = '지난 시황 모아보기 — 매일 자동 갱신 | 브리픽';
  const description = '미국·한국 주식, AI 기업, 원자재·크립토, 유니콘 5개 도메인의 일일 헤드라인 아카이브. 매일 자동 업데이트.';
  const canonical = `${DOMAIN}/daily/`;

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="naver-site-verification" content="94e282ae9b4b0a4379c03d4dbc7c4e5ad3b1649b">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:image" content="${DOMAIN}/assets/og-image-20260513.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${DOMAIN}/assets/og-image-20260513.png">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css">
<style>
:root{--bg:#fafafa;--panel:#fff;--fg:#0d0d0d;--fg2:#333;--mut:#666;--sub:#999;--border:rgba(0,0,0,0.06);--acc:#18E299;--acc-deep:#0fa76e}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg2);font:15px/1.55 Pretendard,-apple-system,sans-serif;min-height:100vh}
a{color:inherit;text-decoration:none}
.back-home{display:inline-flex;padding:14px 20px;color:var(--mut);font-size:14px}
.wrap{min-height:calc(100vh - 48px);display:flex;align-items:flex-start;justify-content:center;padding:8px 20px 60px}
.card{background:var(--panel);border-radius:20px;padding:32px 28px;width:100%;max-width:720px;box-shadow:0 8px 28px rgba(0,0,0,0.06)}
.brand{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.brand img{width:36px;height:36px;border-radius:50%;object-fit:cover}
.brand span{font:700 16px/1 Pretendard,sans-serif;color:var(--fg)}
h1{font:700 24px/1.3 Pretendard,sans-serif;color:var(--fg);margin-bottom:8px;letter-spacing:-0.5px}
.lead{color:var(--mut);font-size:14px;margin-bottom:28px;line-height:1.55}
ul{list-style:none;display:flex;flex-direction:column;gap:6px}
li a{display:block;padding:14px 16px;border-radius:10px;background:#f6f7f6;transition:background 0.15s}
li a:hover{background:var(--acc-light,#d4fae8)}
li a strong{display:block;font-size:14px;color:var(--fg);font-weight:600;margin-bottom:4px}
li a span{display:block;font-size:13px;color:var(--mut);line-height:1.5;-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}
.cta{margin-top:28px;padding-top:22px;border-top:1px solid var(--border);text-align:center}
.cta a{display:inline-block;padding:12px 22px;background:var(--acc);color:#001a0e;border-radius:12px;font-weight:700}
.cta a:hover{background:var(--acc-deep);color:#fff}
@media (max-width:520px){.card{padding:24px 18px}h1{font-size:22px}}
</style>
</head>
<body>
<a class="back-home" href="/">← 실시간 대시보드</a>
<main class="wrap">
<article class="card">
  <header class="brand">
    <img src="/assets/briefick_profile_640.jpeg" alt="브리픽" width="36" height="36" loading="lazy">
    <span>브리픽 · 지난 시황</span>
  </header>
  <h1>지난 시황 모아보기</h1>
  <p class="lead">미국·한국 주식, AI 기업, 원자재·크립토, 유니콘 5개 도메인의 일일 헤드라인 아카이브. 매일 KST 07시·19시 자동 업데이트.</p>
  <ul>
${items || '    <li><span class="lead">아직 발행된 페이지가 없습니다.</span></li>'}
  </ul>
  <div class="cta"><a href="/">실시간 대시보드 보기 →</a></div>
</article>
</main>
</body>
</html>
`;
}

// ─── sitemap.xml ───────────────────────────────────────
function buildSitemap(dailyPages) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${DOMAIN}/`, changefreq: 'hourly', priority: '1.0', lastmod: today },
    { loc: `${DOMAIN}/daily/`, changefreq: 'daily', priority: '0.9', lastmod: today },
    ...dailyPages.map(p => ({
      loc: `${DOMAIN}/daily/${p.date}`,
      changefreq: 'never',
      priority: '0.7',
      lastmod: p.date,
    })),
  ];
  const body = urls
    .map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

// ─── robots.txt ────────────────────────────────────────
function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
}

// ─── 기존 daily 페이지 스캔 (date·headline 추출) ───────
function scanExistingPages(dailyDir) {
  if (!fs.existsSync(dailyDir)) return [];
  const files = fs.readdirSync(dailyDir).filter(f => /^\d{4}-\d{2}-\d{2}\.html$/.test(f));
  const pages = [];
  for (const f of files) {
    const date = f.replace('.html', '');
    const src = fs.readFileSync(path.join(dailyDir, f), 'utf8');
    const m = src.match(/<meta name="description" content="([^"]+)"/);
    pages.push({ date, headline: m ? m[1] : '' });
  }
  return pages.sort((a, b) => b.date.localeCompare(a.date));
}

// ─── main ──────────────────────────────────────────────
function main() {
  const koPairs = loadCompanyKo();
  const localize = makeLocalizer(koPairs);
  const tabs = collectTabs(localize);

  if (tabs.length === 0) {
    console.error('[build-daily-page] no tabs collected — aborting');
    process.exit(1);
  }

  // 페이지 날짜 결정 — stocks 기준, 없으면 첫 탭
  const stocksTab = tabs.find(t => t.id === 'stocks') || tabs[0];
  const pageDate = extractDate(stocksTab.date);
  if (!pageDate) {
    console.error('[build-daily-page] failed to extract date from:', stocksTab.date);
    process.exit(1);
  }

  const dailyDir = path.join(ROOT, 'daily');
  if (!fs.existsSync(dailyDir)) fs.mkdirSync(dailyDir, { recursive: true });

  // 1) 오늘 페이지
  const dailyHtml = buildDailyHtml(pageDate, tabs);
  const outPath = path.join(dailyDir, `${pageDate}.html`);
  fs.writeFileSync(outPath, dailyHtml);
  console.log(`[build-daily-page] wrote /daily/${pageDate}.html (${dailyHtml.length} bytes)`);

  // 2) 인덱스 — 기존 페이지들 다시 스캔 (오늘 포함)
  const allPages = scanExistingPages(dailyDir).slice(0, 60);
  fs.writeFileSync(path.join(dailyDir, 'index.html'), buildIndexHtml(allPages));
  console.log(`[build-daily-page] wrote /daily/index.html (${allPages.length} pages)`);

  // 3) sitemap.xml
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(allPages));
  console.log(`[build-daily-page] wrote /sitemap.xml`);

  // 4) robots.txt
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), buildRobots());
  console.log(`[build-daily-page] wrote /robots.txt`);
}

main();
