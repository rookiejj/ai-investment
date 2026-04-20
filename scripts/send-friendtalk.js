#!/usr/bin/env node
/**
 * 알리고 카카오 친구톡 일일 발송 스크립트
 *
 * 알리고 API 공식 문서: https://smartsms.aligo.in/admin/api/spec.html
 * (엔드포인트·파라미터는 알리고 문서에 맞게 조정 필요)
 *
 * 필수 ENV:
 *   ALIGO_API_KEY      - 알리고 API 키
 *   ALIGO_USER_ID      - 알리고 사용자 ID
 *   ALIGO_SENDER_KEY   - 카카오 비즈니스 채널 발신프로필 키
 *   ALIGO_SENDER       - 발신자 전화번호 (사전 등록된 번호)
 *
 * 선택 ENV:
 *   SUBSCRIBERS_FILE   - 구독자 JSON 파일 (기본 scripts/subscribers.json)
 *   DRY_RUN=1          - 실제 발송 없이 payload만 출력
 *   FAILOVER=Y         - 친구톡 실패 시 SMS 대체 발송 (기본 N)
 *
 * 사용:
 *   DRY_RUN=1 node scripts/send-friendtalk.js
 *   node scripts/send-friendtalk.js
 *
 *   # cron 예시 (매일 오전 8:30 KST)
 *   30 8 * * * cd /path/to/ai-investment && node scripts/send-friendtalk.js
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const API_BASE = 'https://kakaoapi.aligo.in/akv10';
const BATCH_SIZE = 500;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`[error] ENV ${name} 필요`);
    process.exit(1);
  }
  return v;
}

function loadSubscribers() {
  const file = process.env.SUBSCRIBERS_FILE
    || path.join(__dirname, 'subscribers.json');
  if (!fs.existsSync(file)) {
    console.error(`[error] 구독자 파일 없음: ${file}`);
    console.error('scripts/subscribers.example.json 참고');
    process.exit(1);
  }
  const list = JSON.parse(fs.readFileSync(file, 'utf8'));
  return list.filter(s => s.active !== false && s.phone);
}

function generateMessage() {
  const out = execFileSync('node',
    [path.join(__dirname, 'generate-message.js')],
    { encoding: 'utf8' });
  return out.trim();
}

async function issueToken(apiKey, userId) {
  const form = new URLSearchParams({ apikey: apiKey, userid: userId });
  const res = await fetch(`${API_BASE}/token/create/60/s/`, {
    method: 'POST',
    body: form,
  });
  const j = await res.json();
  if (String(j.code) !== '0') {
    throw new Error(`토큰 발급 실패: ${j.message || JSON.stringify(j)}`);
  }
  return j.token;
}

async function sendChunk({ apiKey, userId, token, senderKey, sender,
                           receivers, message, failover }) {
  const form = new URLSearchParams();
  form.set('apikey', apiKey);
  form.set('userid', userId);
  form.set('token', token);
  form.set('senderkey', senderKey);
  form.set('sender', sender);
  form.set('failover', failover);
  receivers.forEach((r, i) => {
    const n = i + 1;
    form.set(`receiver_${n}`, r.phone);
    form.set(`message_${n}`, message);
    if (r.name) form.set(`recv_name_${n}`, r.name);
  });
  const res = await fetch(`${API_BASE}/friend/send/`, {
    method: 'POST',
    body: form,
  });
  return res.json();
}

async function main() {
  const dryRun = process.env.DRY_RUN === '1';
  const apiKey    = requireEnv('ALIGO_API_KEY');
  const userId    = requireEnv('ALIGO_USER_ID');
  const senderKey = requireEnv('ALIGO_SENDER_KEY');
  const sender    = requireEnv('ALIGO_SENDER');
  const failover  = process.env.FAILOVER === 'Y' ? 'Y' : 'N';

  const subscribers = loadSubscribers();
  const message = generateMessage();

  console.log(`[info] 구독자 ${subscribers.length}명 · 메시지 ${message.length}자`);

  if (!subscribers.length) {
    console.error('[warn] 활성 구독자 0명, 종료');
    return;
  }

  if (dryRun) {
    console.log('--- DRY RUN ---');
    console.log('수신:', subscribers.map(s => s.phone).join(','));
    console.log('--- MESSAGE ---');
    console.log(message);
    return;
  }

  const token = await issueToken(apiKey, userId);

  const chunks = [];
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    chunks.push(subscribers.slice(i, i + BATCH_SIZE));
  }

  for (const [idx, chunk] of chunks.entries()) {
    const result = await sendChunk({
      apiKey, userId, token, senderKey, sender,
      receivers: chunk, message, failover,
    });
    console.log(`[chunk ${idx + 1}/${chunks.length}]`, JSON.stringify(result));
    if (String(result.code) !== '0') {
      console.error(`[error] 청크 ${idx + 1} 실패, 후속 청크 중단`);
      process.exit(1);
    }
  }

  console.log('[ok] 발송 완료');
}

main().catch(err => {
  console.error('[fatal]', err.message);
  process.exit(1);
});
