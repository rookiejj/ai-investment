// 표지(신문 1면) 헤드라인 탭 간 중복 제거
// ─────────────────────────────────────────────────────────────
// 왜 필요한가: 표지는 각 탭 summary의 "첫 줄"을 한 줄씩 끌어와 쌓는다.
// G7 정상회의·매크로 사건처럼 하나가 전 시장을 덮는 날엔 update 에이전트가
// 같은 사건을 여러 탭 첫 줄에 올려, 표지에 동일 헤드라인이 2~3번 중복된다.
// (실제 사고: 2026-06-15 kr·stocks·ai 셋 다 "G7 에비앙 개막"으로 1면 3중복)
//
// 처리: CLAUDE.md [탭 간 사건 중복 방지 - 선점 우선] 순서대로 탭을 돌며,
// 이미 채택된 헤드라인과 핵심 토큰이 겹치면 그 탭의 *다음 summary 줄*로 대체.
// 모든 줄이 겹치면 첫 줄로 폴백(빈 자리 방지).

// 선점 우선순위 (CLAUDE.md 명세). 표시 순서가 아니라 dedup 채택 우선순위.
const PREEMPT_ORDER = ['kr', 'stocks', 'ai', 'unicorn', 'commodity'];

// 토큰 비교에서 무시할 조사·일반 접속어. 사건 식별력 없는 단어.
const STOPWORDS = new Set([
  '개막', '확정', '돌입', '예정', '시작', '진입', '카운트다운', '동시', '참석',
  '첫', '및', '대비', '관련', '오늘', '내일', '이번', '최대', '최고', '신고가',
  '전망', '기대', '예상', '발표', '공개', '출시', 'D-day', 'Dday',
]);

// 헤드라인에서 식별력 있는 토큰 집합 추출.
// 숫자·통화·% 같은 변동치는 제거(같은 사건이라도 수치는 달라질 수 있음).
// 길이 2+ 한글/라틴 토큰, 또는 G7·AI·WTI 같은 대문자 약어를 남긴다.
function tokenize(line) {
  if (!line) return new Set();
  const cleaned = String(line)
    // 수치 제거 — 단, 알파벳에 붙은 숫자(G7·SPCX·P500)는 약어이므로 보존(앞이 라틴문자면 안 깎음)
    .replace(/(?<![A-Za-z])[0-9][0-9.,]*\s*(%|％|원|달러|억|조|만|bp|배|위|일|월|년)?/g, ' ')
    .replace(/[$￦€¥•·\-–—()[\]{}'"“”‘’,.!?:;/\\|+]/g, ' ');                  // 기호 제거
  const out = new Set();
  for (const raw of cleaned.split(/\s+/)) {
    const t = raw.trim();
    if (!t) continue;
    const isAbbr = /^[A-Z][A-Z0-9]{1,5}$/.test(t);        // G7, AI, WTI, SPCX, FOMC
    const isWord = t.length >= 2 && /[가-힣A-Za-z]/.test(t); // 에비앙, Altman, 이재명
    if (!(isAbbr || isWord)) continue;
    if (STOPWORDS.has(t)) continue;
    out.add(t);
  }
  return out;
}

// 두 헤드라인이 "같은 사건"인지 판정.
// 식별 토큰 2개 이상 공유 → 중복으로 본다.
// (서로 다른 사건이 고유명사 2개를 우연히 공유할 확률은 낮음)
function isDuplicate(tokensA, tokensB) {
  if (!tokensA.size || !tokensB.size) return false;
  let shared = 0;
  for (const t of tokensA) if (tokensB.has(t)) shared++;
  return shared >= 2;
}

function summaryLines(entry) {
  if (!entry) return [];
  const raw = entry.summary || entry.text || '';
  return String(raw).split('\n').map(s => s.trim()).filter(Boolean);
}

// updates: { kr:[entry,...], stocks:[...], ... } (read-tab-data 응답의 .updates)
// 반환: { kr:'헤드라인', stocks:'...', ... } — 탭 간 중복 제거된 1면 헤드라인.
function pickDistinctHeadlines(updates, order = PREEMPT_ORDER) {
  const used = [];           // 이미 채택된 헤드라인 토큰 집합들
  const result = {};
  for (const tab of order) {
    const lines = summaryLines((updates[tab] || [])[0]);
    let chosen = '';
    for (const line of lines) {
      const tok = tokenize(line);
      if (!used.some(u => isDuplicate(u, tok))) { chosen = line; used.push(tok); break; }
    }
    if (!chosen && lines.length) {  // 모든 줄이 기존과 겹침 → 첫 줄 폴백
      chosen = lines[0];
      used.push(tokenize(chosen));
    }
    result[tab] = chosen;
  }
  return result;
}

module.exports = { pickDistinctHeadlines, tokenize, isDuplicate, PREEMPT_ORDER };
