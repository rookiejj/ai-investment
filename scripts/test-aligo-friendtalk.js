#!/usr/bin/env node
// 알리고 친구톡 발송 1회 테스트.
//
// 사용:
//   ALIGO_API_KEY=... ALIGO_USER_ID=... ALIGO_SENDERKEY=... \
//   TEST_PHONE=01012345678 \
//   node scripts/test-aligo-friendtalk.js
//
// 옵션:
//   TEST_MESSAGE     본문 (기본: 브리픽 알리고 친구톡 테스트 안내)
//   TEST_MODE=Y      실제 발송 안 하고 검증만 (요금 안 나감)
//
// 알리고 친구톡 API: POST https://kakaoapi.aligo.in/akv10/friend/send/
// 응답 code 0 = 성공, 음수 = 실패. 실제 도달 여부는 폰으로 확인.

const REQUIRED = ['ALIGO_API_KEY', 'ALIGO_USER_ID', 'ALIGO_SENDERKEY', 'ALIGO_SENDER', 'TEST_PHONE'];
const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('필수 env 누락:', missing.join(', '));
  process.exit(1);
}

const API_KEY = process.env.ALIGO_API_KEY;
const USER_ID = process.env.ALIGO_USER_ID;
const SENDERKEY = process.env.ALIGO_SENDERKEY;
const PHONE = process.env.TEST_PHONE.replace(/[^0-9]/g, '');
const MESSAGE = process.env.TEST_MESSAGE
  || `[브리픽] 알리고 친구톡 테스트입니다.\n이 메시지가 도착하면 발송 채널이 정상입니다.\n시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`;
const TEST_MODE = process.env.TEST_MODE === 'Y' ? 'Y' : 'N';
const SITE_URL = 'https://roysbriefing.vercel.app';

// 친구톡 본문 + CTA 버튼 1개
const button = {
  button: [
    {
      name: '1분 브리핑 보러가기',
      linkType: 'WL',
      linkTypeName: '웹링크',
      linkMo: SITE_URL,
      linkPc: SITE_URL,
    },
  ],
};

const form = new URLSearchParams();
form.set('apikey', API_KEY);
form.set('userid', USER_ID);
form.set('senderkey', SENDERKEY);
form.set('sender', process.env.ALIGO_SENDER.replace(/[^0-9]/g, ''));  // 알리고 사전등록 발신번호 필수
form.set('receiver_1', PHONE);
form.set('subject_1', '브리픽');
form.set('message_1', MESSAGE);
form.set('button_1', JSON.stringify(button));
form.set('failover', 'N');               // SMS 폴백 비활성 — 친구톡 단독 검증용
form.set('testMode', TEST_MODE);

const url = 'https://kakaoapi.aligo.in/akv10/friend/send/';

console.log('═══ 알리고 친구톡 테스트 ═══');
console.log('  대상  :', PHONE);
console.log('  본문  :', MESSAGE.slice(0, 60).replace(/\n/g, ' / ') + '…');
console.log('  testMode:', TEST_MODE, TEST_MODE === 'Y' ? '(실제 발송 안 됨)' : '(실제 발송)');
console.log('  URL   :', url);
console.log('');

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = null; }
    console.log('HTTP', res.status);
    console.log('응답:', json ? JSON.stringify(json, null, 2) : text);
    if (json && json.code === 0) {
      console.log('\n✅ API 호출 성공. 폰으로 친구톡 도착 여부 확인.');
      console.log('   message_id:', json.info?.mid || json.message_id || '-');
    } else {
      console.log('\n❌ 실패. 응답 message·code 확인.');
      process.exit(2);
    }
  } catch (err) {
    console.error('네트워크 오류:', err.message);
    process.exit(3);
  }
})();
