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
  { file: 'unicorn-update.js',   var: 'updates', emoji: '🦄', label: '유니콘' },
  { file: 'commodity-update.js', var: 'updates', emoji: '🛢️', label: '원자재·크립토' },
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
  if (first) {
    for (const raw of first.summary.split('\n')) {
      const line = raw.trim();
      if (line) lines.push(`• ${line}`);
    }
  }
  return lines.join('\n');
}

function buildMessage(tabs) {
  const parts = [`📊 브리픽 · ${kstDateLabel()}`];
  for (const tab of tabs) {
    if (!tab.entries.length) continue;
    parts.push(buildTabBlock(tab));
  }
  return parts.join('\n\n');
}

// 한도 초과 시 모든 탭 보존 + 줄 단위 균등 cut (daily-send와 동일 규칙)
function fitToLimit(tabs, max) {
  const full = buildMessage(tabs);
  if (full.length <= max) return full;
  const valid = tabs.filter(t => t.entries.length > 0);
  if (!valid.length) return full;

  const headerLen = `📊 브리픽 · ${kstDateLabel()}`.length;
  const sepLen = 2;
  const tabHeaderLen = valid.map(t => `${t.emoji} ${t.label}\n\n`.length);
  const tabHeaderTotal = tabHeaderLen.reduce((a, b) => a + b, 0);
  const remaining = max - headerLen - sepLen * valid.length - tabHeaderTotal;
  if (remaining <= 0) return full.slice(0, max);

  const perTab = Math.floor(remaining / valid.length);
  const taken = [];
  const usedChars = [];
  for (const t of valid) {
    const lines = (t.entries[0]?.summary ?? '')
      .split('\n').map(s => s.trim()).filter(Boolean);
    const kept = [];
    let used = 0;
    for (const line of lines) {
      const cost = 2 + line.length + 1;
      if (used + cost > perTab) break;
      kept.push(line);
      used += cost;
    }
    taken.push(kept);
    usedChars.push(used);
  }
  let leftover = remaining - usedChars.reduce((a, b) => a + b, 0);
  if (leftover > 0) {
    for (let i = 0; i < valid.length && leftover > 0; i++) {
      const allLines = (valid[i].entries[0]?.summary ?? '')
        .split('\n').map(s => s.trim()).filter(Boolean);
      let used = usedChars[i];
      for (let j = taken[i].length; j < allLines.length; j++) {
        const cost = 2 + allLines[j].length + 1;
        if (cost > leftover) break;
        taken[i].push(allLines[j]);
        used += cost;
        leftover -= cost;
      }
      usedChars[i] = used;
    }
  }
  const trimmedTabs = valid.map((t, i) => ({
    ...t,
    entries: [{ ...t.entries[0], summary: taken[i].join('\n') }],
  }));
  return buildMessage(trimmedTabs);
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

  const rawMsg = buildMessage(tabs);
  const msg = fitToLimit(tabs, LIMIT);
  const truncated = msg.length < rawMsg.length;
  const overflow = msg.length > LIMIT;

  if (asJson) {
    process.stdout.write(JSON.stringify({
      generatedAt: new Date().toISOString(),
      charCount: msg.length,
      rawCharCount: rawMsg.length,
      truncated,
      limit: LIMIT,
      overflow,
      message: msg,
    }, null, 2) + '\n');
  } else {
    process.stdout.write(msg + '\n');
  }

  const note = truncated ? ` · 원본 ${rawMsg.length}자 트림` : '';
  process.stderr.write(`\n[글자수 ${msg.length} / ${LIMIT}${overflow ? ' · 초과' : ''}${note}]\n`);
}

main();
