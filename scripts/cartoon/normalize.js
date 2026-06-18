/**
 * 신문 1면 catchphrase·헤드라인의 흔한 한글 금융 용어 오타를 렌더 직전 기계 교정.
 *
 * 배경(2026-06-19): 자동화 에이전트가 data/.catchphrase 에 "코스피"를 "조스피"로
 *   한 글자 깨뜨려 써넣었고, 그대로 1면 hero에 박혀 라이브에 노출됨. 본문(DB summary)은
 *   "KOSPI"라 정상이었으나 사람이 쓰는 catchphrase에서만 사고. CLAUDE.md 지침만으론
 *   LLM 오타를 못 막으므로, lint-jargon.sh 와 같은 "기계적 검증" 한 단계를 렌더에 둔다.
 *
 * 원칙: 명백한 깨짐만 교정. 애매한 치환은 넣지 않는다(오교정 위험).
 */

// [틀린 표기(정규식), 올바른 표기] — 정상 한국어에 안 나타나는 명백한 깨짐만.
const FIXES = [
  [/조스피/g, '코스피'],   // 코스피 ← 코→조 깨짐 (2026-06-19 관측 사고)
  [/조스닥/g, '코스닥'],   // 코스닥 ← 코→조 깨짐 (동일 계열)
  [/코스탁/g, '코스닥'],   // 코스닥 ← 닥→탁 깨짐 (KOSDAQ 어미)
  [/나스탁/g, '나스닥'],   // 나스닥 ← 닥→탁 깨짐/변형표기 (NASDAQ 어미)
];

function normalizeFinanceTerms(s) {
  if (s == null) return s;
  let out = String(s);
  for (const [re, to] of FIXES) out = out.replace(re, to);
  return out;
}

module.exports = { normalizeFinanceTerms };
