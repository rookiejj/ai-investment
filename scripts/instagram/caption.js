#!/usr/bin/env node
/**
 * 인스타그램 캐러셀 캡션·해시태그 생성기
 *
 * 정책:
 *  - 캡션 본문에 마켓별 뉴스 정보를 넣지 않는다 (슬라이드에서 다 보여줌).
 *  - 헤더(브랜드·날짜) → 프로필 링크 강조 CTA → 해시태그 구조.
 *  - 가변 해시태그는 슬라이드 콘텐츠(meta.tabs.bullets)에서 티커·키워드 자동 추출.
 *
 * 사용:
 *   const { buildCaption } = require('./caption');
 *   const text = buildCaption(meta);
 */

const HANDLE = 'briefick';
const SITE_URL = 'https://roysbriefing.vercel.app';

const STATIC_TAGS = [
  '브리픽', 'briefick', '주식', '투자', '경제', 'AI',
  '미국주식', '한국주식', '코스피', '나스닥',
  '매일브리핑', '시황', '재테크',
];

// summary 안의 영문 티커(2~5자 대문자) 추출
function extractTickers(text) {
  const matches = text.match(/\b[A-Z]{2,5}\b/g) || [];
  const stop = new Set(['AI','EPS','CEO','CFO','CPI','GDP','OPEC','FOMC','ETF','IPO','API','SEC','LLM','SUV','EV','EU','US','UK','KST','AH','CC','QoQ','YoY','YTD','GAAP','NM','NA','MAU','DAU','SaaS','GPU','TPU','TSV','SMR','DRAM','HBM','LNG','WTI','M&A']);
  return matches.filter(t => !stop.has(t));
}

function extractKoreanKeywords(text) {
  const matches = text.match(/[가-힣]{2,6}/g) || [];
  const stop = new Set([
    '동결','상회','하회','부합','갱신','발표','확정','동시','일제','연속','오늘','어제','이후','대비',
    '컨센','컨센서스','매출','영업익','영업이익','이익','반등','매도','매수','강세','약세','지수','시간외','마감','종가','신고가',
    '회사','기업','시장','분기','연간','전년','전기','이상','이하','이내','수준','정도','부분','일부','전체',
    '계획','전망','가능','예상','이번','지난','다음','올해','내년','월간','분간','이내',
    '이슈','내용','사항','관련','때문','이유','중요','역시','특히','다소','약간','조금','상승','하락','감소','증가',
    '브리핑','오늘의','시장','요약','한국','미국','반영',
  ]);
  return matches.filter(t => !stop.has(t));
}

function uniqByCount(arr) {
  const c = new Map();
  for (const x of arr) c.set(x, (c.get(x) || 0) + 1);
  return [...c.entries()].sort((a,b) => b[1] - a[1]).map(([k]) => k);
}

function buildHeader(meta) {
  return `${meta.date} (${meta.dow}) 브리픽 데일리`;
}

function buildCTA() {
  // 인스타 피드 캡션의 URL은 클릭 안 됨 → Bio 링크로 유도
  return [
    '매일 아침 5개 시장의 핵심만 정리.',
    '',
    '👉 전체 보기 — 프로필 링크 클릭',
    `📷 @${HANDLE}`,
    `🔗 ${SITE_URL.replace(/^https?:\/\//, '')}`,
  ].join('\n');
}

function buildHashtagBlock(meta) {
  const allText = meta.tabs.flatMap(t => t.bullets || []).join(' ');
  const tickers = extractTickers(allText);
  const koWords = extractKoreanKeywords(allText);

  const topTickers = uniqByCount(tickers).slice(0, 8);
  const topKo = uniqByCount(koWords).slice(0, 6);

  const all = [...STATIC_TAGS, ...topTickers, ...topKo];
  const seen = new Set();
  const out = [];
  for (const t of all) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(`#${t}`);
  }
  return out.join(' ');
}

function hasAnyPhoto(meta) {
  const p = meta?.photos;
  if (!p) return false;
  if (p.cover) return true;
  return Object.values(p.tabs || {}).some(Boolean);
}

function buildCaption(meta) {
  const header   = buildHeader(meta);
  const cta      = buildCTA();
  const credit   = hasAnyPhoto(meta) ? '\n\n📸 이미지: Unsplash' : '';
  const tagBlock = buildHashtagBlock(meta);

  return `${header}\n\n${cta}${credit}\n\n${tagBlock}`;
}

module.exports = { buildCaption };

// CLI 실행
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const metaPath = path.join(__dirname, 'out', 'meta.json');
  if (!fs.existsSync(metaPath)) {
    console.error('meta.json 없음. 먼저 render-slides.js 실행할 것.');
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  console.log(buildCaption(meta));
}
