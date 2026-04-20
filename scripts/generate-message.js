#!/usr/bin/env node
/**
 * 브리픽 일일 카카오 친구톡 메시지 생성기
 *
 * 각 탭의 최신 summary를 뽑아 카카오 친구톡 포맷으로 출력.
 * 사용:
 *   node scripts/generate-message.js                # stdout
 *   node scripts/generate-message.js > out/brief.txt
 *   node scripts/generate-message.js --json         # JSON 메타 포함
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://rookiejj.github.io/ai-investment/';
const LIMIT = 1000;

const TABS = [
  { file: 'stocks-update.js',    var: 'updates', emoji: '🇺🇸', label: '미국 마켓' },
  { file: 'kr-stocks-update.js', var: 'updates', emoji: '🇰🇷', label: '한국 마켓' },
  { file: 'ai-update.js',        var: 'UPDATES', emoji: '🤖', label: 'AI 기업' },
  { file: 'etf-update.js',       var: 'updates', emoji: '🌍', label: '글로벌 ETF' },
  { file: 'unicorn-update.js',   var: 'updates', emoji: '🦄', label: '유니콘' },
  { file: 'commodity-update.js', var: 'updates', emoji: '📉', label: '시장·원자재' },
];

function loadLatest(file, varName) {
  const src = fs.readFileSync(path.join(ROOT, 'data', file), 'utf8');
  const list = new Function(
    `${src};return typeof ${varName}!=="undefined"?${varName}:[];`
  )();
  if (!Array.isArray(list) || list.length === 0) return null;
  const e = list[0];
  return { date: e.date || '', summary: (e.summary || '').trim() };
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

function render(entries) {
  const lines = [];
  lines.push(`📊 브리픽 · ${kstDateLabel()}`);
  lines.push('━━━━━━━━━━━━━━━━');
  for (const e of entries) {
    lines.push('');
    lines.push(`${e.emoji} ${e.label}`);
    lines.push(e.summary);
  }
  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━');
  lines.push('▸ 전체 보기');
  lines.push(SITE_URL);
  return lines.join('\n');
}

function main() {
  const asJson = process.argv.includes('--json');

  const entries = [];
  for (const tab of TABS) {
    const d = loadLatest(tab.file, tab.var);
    if (!d) {
      process.stderr.write(`[warn] ${tab.file} 최신 summary 없음\n`);
      continue;
    }
    entries.push({ ...tab, ...d });
  }

  const msg = render(entries);

  if (asJson) {
    process.stdout.write(JSON.stringify({
      generatedAt: new Date().toISOString(),
      charCount: msg.length,
      limit: LIMIT,
      overflow: msg.length > LIMIT,
      entries: entries.map(({ emoji, label, date, summary }) => ({ emoji, label, date, summary })),
      message: msg,
    }, null, 2) + '\n');
  } else {
    process.stdout.write(msg + '\n');
  }

  process.stderr.write(`\n[글자수 ${msg.length} / ${LIMIT}${msg.length > LIMIT ? ' · 초과' : ''}]\n`);
}

main();
