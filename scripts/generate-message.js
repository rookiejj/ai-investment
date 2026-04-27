#!/usr/bin/env node
/**
 * 브리픽 일일 카카오 친구톡 메시지 생성기
 *
 * 탭별 포맷:
 *   • 최신 1건 : MM-DD HH:MM + full summary
 *   + 직전 1건 : HH:MM + 25자 내외 축약 (단어 경계 정돈)
 *
 * 사용:
 *   node scripts/generate-message.js
 *   node scripts/generate-message.js --json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://roysbriefing.vercel.app';
const LIMIT = 1000;
const PER_TAB = 1;

const TABS = [
  { file: 'stocks-update.js',    var: 'updates', emoji: '🇺🇸', label: '미국 마켓' },
  { file: 'kr-stocks-update.js', var: 'updates', emoji: '🇰🇷', label: '한국 마켓' },
  { file: 'ai-update.js',        var: 'UPDATES', emoji: '🤖', label: 'AI 기업' },
  { file: 'etf-update.js',       var: 'updates', emoji: '🌍', label: '글로벌 ETF' },
  { file: 'unicorn-update.js',   var: 'updates', emoji: '🦄', label: '유니콘' },
  { file: 'commodity-update.js', var: 'updates', emoji: '📉', label: '시장·원자재' },
];

function loadEntries(file, varName, n) {
  const src = fs.readFileSync(path.join(ROOT, 'data', file), 'utf8');
  const list = new Function(
    `${src};return typeof ${varName}!=="undefined"?${varName}:[];`
  )();
  if (!Array.isArray(list)) return [];
  return list
    .slice(0, n)
    .filter(e => e && e.summary)
    .map(e => ({ date: e.date || '', summary: String(e.summary).trim() }));
}

function kstDateLabel() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000 + now.getTimezoneOffset() * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const dow = ['일', '월', '화', '수', '목', '금', '토'][kst.getUTCDay()];
  return `${y}-${m}-${d} (${dow})`;
}

// 단어 경계 정돈: em dash → 쉼표/중간점 → 공백 우선순위로 자연스러운 지점에서 끊음
function smartCut(s, max) {
  const raw = s.trim();
  if (raw.length <= max) return raw;
  const window = raw.slice(0, max);
  const minKeep = Math.floor(max * 0.5);

  const emIdx = Math.max(window.lastIndexOf(' — '), window.lastIndexOf('—'));
  if (emIdx >= minKeep) return raw.slice(0, emIdx).trimEnd() + '…';

  let lastSep = -1;
  for (let i = 0; i < window.length; i++) {
    if (window[i] === ',' || window[i] === '·') lastSep = i;
  }
  if (lastSep >= minKeep) return raw.slice(0, lastSep).trimEnd() + '…';

  const sp = window.lastIndexOf(' ');
  if (sp >= minKeep) return raw.slice(0, sp).trimEnd() + '…';

  return raw.slice(0, max - 1) + '…';
}

function buildTabBlock(tab) {
  const lines = [`${tab.emoji} ${tab.label}`, ''];
  const [first] = tab.entries;
  if (first) lines.push(`• ${first.summary}`);
  return lines.join('\n');
}

function buildMessage(tabs) {
  const parts = [`📊 브리픽 · ${kstDateLabel()}`];
  for (const tab of tabs) {
    if (!tab.entries.length) continue;
    parts.push(buildTabBlock(tab));
  }
  parts.push(`▸ 전체 보기\n${SITE_URL}`);
  return parts.join('\n\n');
}

function main() {
  const asJson = process.argv.includes('--json');

  const tabs = [];
  for (const t of TABS) {
    const entries = loadEntries(t.file, t.var, PER_TAB);
    if (!entries.length) {
      process.stderr.write(`[warn] ${t.file} summary 없음\n`);
      continue;
    }
    tabs.push({ ...t, entries });
  }

  const msg = buildMessage(tabs);
  const overflow = msg.length > LIMIT;

  if (asJson) {
    process.stdout.write(JSON.stringify({
      generatedAt: new Date().toISOString(),
      charCount: msg.length,
      limit: LIMIT,
      overflow,
      message: msg,
    }, null, 2) + '\n');
  } else {
    process.stdout.write(msg + '\n');
  }

  process.stderr.write(`\n[글자수 ${msg.length} / ${LIMIT}${overflow ? ' · 초과' : ''}]\n`);
}

main();
