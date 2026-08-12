#!/usr/bin/env node
// scripts/build-insights-page.js
// data/daily-insight.js → insights.html (크롤 가능한 정적 HTML)
// 자동 갱신 트리거의 마커 commit 단계에서 호출됨

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'data/daily-insight.js'), 'utf8');

// eval로 DAILY_INSIGHTS 추출
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

// 단락 분리 (\n\n) → <p> 태그
function bodyToHtml(body) {
  return body
    .split(/\n\n+/)
    .map(p => `<p>${esc(p.trim())}</p>`)
    .join('\n    ');
}

const latest = mod[0];
const pageTitle = `투자 지식 — ${esc(latest.title)}`;
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

const articles = mod.map(d => `  <article>
    <h2>${esc(d.title)}</h2>
    <p class="meta"><time datetime="${esc(d.date)}">${esc(d.date)}</time>${d.assets && d.assets.length ? ` · ${d.assets.map(esc).join(' · ')}` : ''}</p>
    ${bodyToHtml(d.body)}
  </article>`).join('\n\n');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <meta name="description" content="${esc(pageDesc)}">
  <link rel="canonical" href="https://briefick.com/insights.html">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${esc(pageDesc)}">
  <meta property="og:url" content="https://briefick.com/insights.html">
  <meta property="og:type" content="website">
  <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
  <style>
    body { font-family: -apple-system, 'Noto Sans KR', sans-serif; max-width: 720px; margin: 0 auto; padding: 24px 16px; color: #1a1a1a; line-height: 1.7; }
    header { margin-bottom: 40px; border-bottom: 2px solid #0fa76e; padding-bottom: 16px; }
    header a { text-decoration: none; color: inherit; }
    h1 { font-size: 1.4rem; font-weight: 700; margin: 0 0 6px; }
    .tagline { font-size: 0.9rem; color: #555; margin: 0; }
    article { margin-bottom: 48px; }
    h2 { font-size: 1.2rem; font-weight: 700; margin: 0 0 8px; color: #111; }
    .meta { font-size: 0.8rem; color: #888; margin: 0 0 14px; }
    p { margin: 0 0 12px; font-size: 0.95rem; }
    footer { margin-top: 48px; border-top: 1px solid #eee; padding-top: 16px; font-size: 0.8rem; color: #888; }
    footer a { color: #0fa76e; text-decoration: none; }
  </style>
</head>
<body>
<header>
  <a href="https://briefick.com">
    <h1>브리픽 투자 지식</h1>
    <p class="tagline">왜 그런지 아는 투자. 자산 간 인과관계를 매일 하나씩.</p>
  </a>
</header>
<main>
${articles}
</main>
<footer>
  <p><a href="https://briefick.com">브리픽</a> — 매일 아침 카카오톡으로 받는 1분 마켓 브리핑</p>
  <p>최근 갱신: ${esc(latest.date)}</p>
</footer>
</body>
</html>`;

const outPath = path.join(root, 'insights.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`insights.html 생성 완료 (${mod.length}건, latest: ${latest.date})`);
