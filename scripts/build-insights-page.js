#!/usr/bin/env node
// scripts/build-insights-page.js
// data/daily-insight.js → insights.html (크롤 가능한 정적 HTML)
// 자동 갱신 트리거의 마커 commit 단계에서 호출됨

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'data/daily-insight.js'), 'utf8');

const mod = new Function(src + '\nreturn DAILY_INSIGHTS;')();
if (!Array.isArray(mod) || !mod.length) {
  console.error('DAILY_INSIGHTS 파싱 실패');
  process.exit(1);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function firstSentence(body) {
  const first = body.split(/\n\n+/)[0] || '';
  return first.length > 80 ? first.slice(0, 80) + '…' : first;
}

function bodyToHtml(body) {
  return body
    .split(/\n\n+/)
    .map(p => `    <p>${esc(p.trim())}</p>`)
    .join('\n');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00+09:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

const latest = mod[0];
const pageTitle = '투자 지식 — 자산 간 인과관계 | 브리픽';
const pageDesc = mod.slice(0, 3).map(d => d.title).join(' · ');

// FAQPage 스키마
const faqItems = mod.map(d => ({
  '@type': 'Question',
  name: d.title,
  acceptedAnswer: {
    '@type': 'Answer',
    text: d.body.replace(/\n/g, ' ').slice(0, 500),
  },
}));

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: '브리픽 투자 지식',
  description: '자산 간 인과관계를 매일 하나씩. 달러·금리·환율·주식의 연결 메커니즘.',
  url: 'https://briefick.com/insights.html',
  mainEntity: faqItems,
};

// 목록 아이템
const listItems = mod.map(d => `    <li><a href="#insight-${esc(d.date)}"><strong>${esc(d.title)}</strong><span>${esc(d.assets && d.assets.length ? d.assets.join(' · ') + ' · ' : '') + esc(firstSentence(d.body))}</span></a></li>`).join('\n');

// 본문 아티클
const articles = mod.map(d => `  <article id="insight-${esc(d.date)}">
    <h2>${esc(d.title)}</h2>
    <p class="meta"><time datetime="${esc(d.date)}">${formatDate(d.date)}</time>${d.assets && d.assets.length ? ` · ${d.assets.map(esc).join(' · ')}` : ''}</p>
${bodyToHtml(d.body)}
  </article>`).join('\n\n');

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pageTitle}</title>
<meta name="description" content="${esc(pageDesc)}">
<link rel="canonical" href="https://briefick.com/insights.html">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${esc(pageDesc)}">
<meta property="og:url" content="https://briefick.com/insights.html">
<meta property="og:type" content="website">
<meta property="og:image" content="https://briefick.com/assets/og-image-20260513.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://briefick.com/assets/og-image-20260513.png">
<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css">
<style>
:root{--bg:#fafafa;--panel:#fff;--fg:#0d0d0d;--fg2:#333;--mut:#666;--sub:#999;--border:rgba(0,0,0,0.06);--acc:#18E299;--acc-deep:#0fa76e}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg2);font:15px/1.55 Pretendard,-apple-system,sans-serif;min-height:100vh}
a{color:inherit;text-decoration:none}
.back-home{display:inline-flex;padding:14px 20px;color:var(--mut);font-size:14px}
.wrap{min-height:calc(100vh - 48px);display:flex;flex-direction:column;align-items:center;padding:8px 20px 60px;gap:16px}
.card{background:var(--panel);border-radius:20px;padding:32px 28px;width:100%;max-width:720px;box-shadow:0 8px 28px rgba(0,0,0,0.06)}
.brand{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.brand img{width:36px;height:36px;border-radius:50%;object-fit:cover}
.brand span{font:700 16px/1 Pretendard,sans-serif;color:var(--fg)}
h1{font:700 24px/1.3 Pretendard,sans-serif;color:var(--fg);margin-bottom:8px;letter-spacing:-0.5px}
.lead{color:var(--mut);font-size:14px;margin-bottom:28px;line-height:1.55}
ul{list-style:none;display:flex;flex-direction:column;gap:6px}
li a{display:block;padding:14px 16px;border-radius:10px;background:#f6f7f6;transition:background 0.15s}
li a:hover{background:#d4fae8}
li a strong{display:block;font-size:14px;color:var(--fg);font-weight:600;margin-bottom:4px}
li a span{display:block;font-size:13px;color:var(--mut);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cta{margin-top:28px;padding-top:22px;border-top:1px solid var(--border);text-align:center}
.cta a{display:inline-block;padding:12px 22px;background:var(--acc);color:#001a0e;border-radius:12px;font-weight:700}
.cta a:hover{background:var(--acc-deep);color:#fff}
article{scroll-margin-top:24px}
article h2{font:700 20px/1.35 Pretendard,sans-serif;color:var(--fg);margin-bottom:10px;letter-spacing:-0.3px}
.meta{font-size:13px;color:var(--mut);margin-bottom:18px}
article p{font-size:15px;line-height:1.75;color:var(--fg2);margin-bottom:14px}
@media(max-width:520px){.card{padding:24px 18px}h1{font-size:22px}article h2{font-size:18px}}
</style>
</head>
<body>
<a class="back-home" href="/">← 실시간 대시보드</a>
<main class="wrap">
<div class="card">
  <header class="brand">
    <img src="/assets/briefick_profile_640.jpeg" alt="브리픽" width="36" height="36" loading="lazy">
    <span>브리픽 · 투자 지식</span>
  </header>
  <h1>투자 지식 아카이브</h1>
  <p class="lead">왜 그런지 아는 투자. 자산 간 인과관계를 매일 하나씩. 달러·금리·환율·주식의 연결 메커니즘.</p>
  <ul>
${listItems}
  </ul>
  <div class="cta"><a href="/">실시간 대시보드 보기 →</a></div>
</div>

${articles}
</main>
</body>
</html>`;

const outPath = path.join(root, 'insights.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`insights.html 생성 완료 (${mod.length}건, latest: ${latest.date})`);
