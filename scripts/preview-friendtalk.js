#!/usr/bin/env node
/**
 * preview-friendtalk — 로컬 data/*-update.js 로 친구톡 본문을 미리보기 (읽기 전용).
 *
 * 왜: 카톡 친구톡을 실제로 만드는 daily-send Edge Function 은 Supabase DB(tab_updates)를
 *   읽는다. DB 는 git push → db-sync 로만 갱신되므로, 로컬에서 summary 를 고쳐도 daily-send
 *   미리보기엔 안 뜬다(프로덕션 DB 내용만 보임). 이 스크립트는 daily-send 의 포맷 로직을
 *   그대로 포팅해 로컬 파일 기준으로 친구톡 본문을 출력한다 → push 없이 내용 반복 작업 가능.
 *
 * 🔒 프로덕션 영향 0: 네트워크 호출 없음, 파일 쓰기 없음. 로컬 파일 read + 터미널 출력만.
 *   push 를 하지 않는 한 인스타·친구톡·DB 어디에도 영향 없음.
 *
 * ⚠️ 포맷 로직은 supabase/functions/daily-send/index.ts 의 미러다. daily-send 의
 *   buildTabBlock·buildMessage·fitToLimit·localizeText·상수(LIMIT·MAX_LINES_PER_TAB·TABS)가
 *   바뀌면 이 파일도 맞춰 갱신할 것. (달력 schedule 블록은 동적이라 미포함 — 순수 콘텐츠 미리보기.)
 *
 * 사용: node scripts/preview-friendtalk.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');

// ── daily-send 상수 미러 ──────────────────────────────────
const LIMIT = 1000;
const MAX_LINES_PER_TAB = 3;
const TABS = [
  { id: 'kr',        emoji: '🇰🇷', label: '한국 마켓',      file: 'kr-stocks-update.js' },
  { id: 'stocks',    emoji: '🇺🇸', label: '미국 마켓',      file: 'stocks-update.js' },
  { id: 'ai',        emoji: '🤖', label: 'AI 기업',        file: 'ai-update.js' },
  { id: 'commodity', emoji: '🛢️', label: '원자재·크립토', file: 'commodity-update.js' },
  { id: 'unicorn',   emoji: '🦄', label: '유니콘',         file: 'unicorn-update.js' },
];

// ── company-ko.js 로드 → localizeText (daily-send 미러) ────
function loadCompanyKo() {
  try {
    const src = fs.readFileSync(path.join(DATA_DIR, 'company-ko.js'), 'utf8');
    const map = new Function(src + ';return typeof COMPANY_KO!=="undefined"?COMPANY_KO:{};')();
    return Object.entries(map).sort((a, b) => b[0].length - a[0].length);
  } catch (e) {
    console.warn('[preview] company-ko 로드 실패, 한글화 skip:', e.message);
    return [];
  }
}
const _pairs = loadCompanyKo();
function localizeText(text) {
  if (!text) return text;
  let r = String(text);
  for (const [en, ko] of _pairs) {
    const esc = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    r = r.replace(new RegExp('(?<![A-Za-z0-9])' + esc + '(?![A-Za-z0-9])', 'g'), ko);
  }
  return r;
}

// ── 로컬 update 파일에서 updates[0].summary 추출 ───────────
function readSummary(file) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  // 파일마다 최상위 변수명이 다름 (updates / UPDATES). 둘 다 시도.
  const arr = new Function(
    src + ';return typeof updates!=="undefined"?updates:(typeof UPDATES!=="undefined"?UPDATES:[]);'
  )();
  const e = (arr && arr[0]) || {};
  return { summary: String(e.summary || ''), date: e.date || '' };
}

// ── daily-send 포맷 미러 ──────────────────────────────────
function kstDateLabel() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000 + now.getTimezoneOffset() * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const dow = ['일', '월', '화', '수', '목', '금', '토'][kst.getUTCDay()];
  return `${y}-${m}-${d} (${dow})`;
}
function buildTabBlock(tab) {
  const bullets = [];
  for (const raw of (tab.summary || '').split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    bullets.push(`• ${line}`);
    if (bullets.length >= MAX_LINES_PER_TAB) break;
  }
  return [`${tab.emoji} ${tab.label}`, '', bullets.join('\n\n')].join('\n');
}
function buildMessage(tabs) {
  const parts = [`📊 브리픽 · ${kstDateLabel()}`];
  for (const t of tabs) if (t.summary) parts.push(buildTabBlock(t));
  return parts.join('\n\n');
}
function fitToLimit(tabs, max) {
  const full = buildMessage(tabs);
  if (full.length <= max) return full;
  const valid = tabs.filter((t) => t.summary);
  if (!valid.length) return full;
  const header = `📊 브리픽 · ${kstDateLabel()}`;
  const sepLen = 2;
  const tabHeaderTotal = valid.map((t) => `${t.emoji} ${t.label}\n\n`.length).reduce((a, b) => a + b, 0);
  const remaining = max - header.length - sepLen * valid.length - tabHeaderTotal;
  if (remaining <= 0) return full.slice(0, max);
  const perTab = Math.floor(remaining / valid.length);
  const linesOf = (t) => t.summary.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, MAX_LINES_PER_TAB);
  const taken = [];
  const usedChars = [];
  for (const t of valid) {
    const kept = [];
    let used = 0;
    for (const line of linesOf(t)) {
      const cost = 2 + line.length + 2;
      if (used + cost > perTab) break;
      kept.push(line); used += cost;
    }
    taken.push(kept); usedChars.push(used);
  }
  let leftover = remaining - usedChars.reduce((a, b) => a + b, 0);
  if (leftover > 0) {
    for (let i = 0; i < valid.length && leftover > 0; i++) {
      const all = linesOf(valid[i]);
      for (let j = taken[i].length; j < all.length; j++) {
        const cost = 2 + all[j].length + 2;
        if (cost > leftover) break;
        taken[i].push(all[j]); leftover -= cost;
      }
    }
  }
  const trimmed = valid.map((t, i) => ({ ...t, summary: taken[i].join('\n') }));
  return buildMessage(trimmed);
}

// ── scratch 오버라이드 로드 ───────────────────────────────
// scratch/summaries.json 이 있으면 그 탭은 실험값으로 대체 (실제 data/*.js 안 건드림).
// 형식: { "kr": "줄1\n줄2\n...", "stocks": "...", ... } — 있는 탭만 오버라이드.
function loadScratch() {
  const p = path.resolve(__dirname, '..', 'scratch', 'summaries.json');
  if (!fs.existsSync(p)) return {};
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.warn('[preview] scratch/summaries.json 파싱 실패:', e.message); return {}; }
}
const scratch = loadScratch();
const usingScratch = Object.keys(scratch).length > 0;

// ── 실행 ──────────────────────────────────────────────────
const tabs = TABS.map((t) => {
  const override = scratch[t.id];
  const src = override != null ? { summary: String(override), date: '(scratch)' } : readSummary(t.file);
  return { ...t, summary: localizeText(src.summary), rawSummary: src.summary, date: src.date, fromScratch: override != null };
});

const body = fitToLimit(tabs, LIMIT);

console.log('═'.repeat(60));
console.log('친구톡 미리보기 (발송 안 됨)');
if (usingScratch) {
  const ex = tabs.filter((t) => t.fromScratch).map((t) => t.id).join(', ');
  console.log(`소스: scratch 실험값 [${ex}] + 나머지 data/*.js`);
} else {
  console.log('소스: data/*-update.js (scratch/summaries.json 없음)');
}
console.log('═'.repeat(60));
console.log(body);
console.log('═'.repeat(60));
console.log(`글자수 ${body.length} / ${LIMIT}${body.length > LIMIT ? '  ⚠️ 한도 초과' : '  ✓'}`);

// 탭별 진단: 친구톡엔 상위 3줄만 나감 — 4·5번째 줄은 안 감을 알려준다.
console.log('\n── 탭별 진단 (친구톡은 탭당 상위 ' + MAX_LINES_PER_TAB + '줄만 발송) ──');
for (const t of tabs) {
  const lines = t.rawSummary.split('\n').map((s) => s.trim()).filter(Boolean);
  const sent = Math.min(lines.length, MAX_LINES_PER_TAB);
  const dropped = lines.length - sent;
  console.log(`${t.emoji} ${t.label.padEnd(10)} ${lines.length}줄 작성 → ${sent}줄 발송` +
    (dropped > 0 ? `  (${dropped}줄 미발송: ${lines.slice(MAX_LINES_PER_TAB).map((l) => l.slice(0, 20) + '…').join(' / ')})` : ''));
}
console.log('\n🔒 이 명령은 로컬 파일만 읽고 아무것도 발송·업로드하지 않습니다.');
