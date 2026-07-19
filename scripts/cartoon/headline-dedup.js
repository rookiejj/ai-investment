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
function sharedCount(tokensA, tokensB) {
  let shared = 0;
  for (const t of tokensA) if (tokensB.has(t)) shared++;
  return shared;
}

function isDuplicate(tokensA, tokensB) {
  if (!tokensA.size || !tokensB.size) return false;
  return sharedCount(tokensA, tokensB) >= 2;
}

// 강한 중복 임계 — 이 이상이면 프레이밍 도메인이 달라도 "같은 사건"으로 병합한다.
// 약한 중복(정확히 2개, 예: 배경 사건 G7 한 토큰 + 우연 겹침)은 도메인 예외로 각 줄 유지하되,
// 3개 이상 공유하면 꼬리말만 자기 탭용으로 바꾼 동일 사건이므로 1면에 한 번만 노출.
// (사고: 2026-07-18 Oracle 감원·Stargate $500B 를 kr·stocks·ai·unicorn 4탭이 첫 줄로 올려
//  각 owner 가 달라 4중복 통과 → 1면 5줄 중 4줄 도배. STRONG 병합으로 차단.)
const STRONG_DUP = 3;

function summaryLines(entry) {
  if (!entry) return [];
  const raw = entry.summary || entry.text || '';
  return String(raw).split('\n').map(s => s.trim()).filter(Boolean);
}

// updates: { kr:[entry,...], stocks:[...], ... } (read-tab-data 응답의 .updates)
// 반환: { kr:'헤드라인', stocks:'...', ... } — 탭 간 중복 제거된 1면 헤드라인.
// ─── 도메인 소유권 분류 ────────────────────────────────────
// 각 탭(도메인)의 식별 키워드. 한 줄을 어느 탭이 "소유"하는지 판정하는 근거.
// 토큰은 tokenize() 출력 형태와 동일해야 매칭됨(약어 대문자·한글 노운).
const DOMAIN_KW = {
  kr: new Set([
    'KOSPI', '코스피', '코스닥', 'KOSDAQ', '삼성전자', 'SK하이닉스', '외국인', '외인',
    '원화', '원달러', '한국', '이재명', '한미', '한은', '한국은행', '코스피', '증시', '한미전략투자공사',
  ]),
  stocks: new Set([
    'FOMC', 'Fed', 'Warsh', 'Powell', 'dot', 'plot', '나스닥', '다우', 'Nasdaq', 'Treasury',
    'ADBE', 'NVDA', 'AAPL', 'MSFT', 'SPCX', 'SpaceX', 'CapEx', 'RPO', '연준',
  ]),
  ai: new Set([
    'GPT', 'Gemini', 'Claude', 'Anthropic', 'OpenAI', 'Altman', 'Hassabis', 'Amodei',
    'LLM', 'xAI', 'Mistral', 'Llama', 'DeepMind', 'Fable', 'Kindle', 'Vertex', 'iris',
  ]),
  commodity: new Set([
    'WTI', '브렌트', '원유', 'OPEC', '호르무즈', 'BTC', 'ETH', 'SOL', 'XRP', '비트코인', '이더',
    '금', '은', '구리', '니켈', '리튬', '원자재', '농산물', '천연가스', '플래티널', '플래티넘', 'spot', '이란',
  ]),
  unicorn: new Set([
    'Series', '펀딩', 'Databricks', 'Anduril', 'Plaid', 'Shield', 'Saronic', 'Polymarket',
    'Discord', 'secondary', 'primary', '라운드', '밸류에이션', '비상장', '프리IPO',
  ]),
};

// 한 줄의 소유 도메인 판정. 키워드 최다 매칭 도메인.
// 동점이면 그 줄이 현재 있는 탭(fallbackTab) 우선 — 자기 탭에서 쓴 자기 도메인 줄 보호.
// 매칭 0이면 fallbackTab(자기 탭) — 일반 줄은 자기 탭 소유로 본다.
function classifyOwner(tokens, fallbackTab) {
  const scores = {};
  let max = 0;
  for (const [d, kw] of Object.entries(DOMAIN_KW)) {
    let s = 0;
    for (const t of tokens) if (kw.has(t)) s++;
    scores[d] = s;
    if (s > max) max = s;
  }
  if (max === 0) return fallbackTab;
  if ((scores[fallbackTab] || 0) === max) return fallbackTab; // 동점 → 자기 탭
  for (const [d, s] of Object.entries(scores)) if (s === max) return d;
  return fallbackTab;
}

// ─── 탭별 불릿 dedup (도메인 소유권 기반) ──────────────────
// 같은 사건이 여러 탭에 있으면 **소유 도메인 탭이 가져가고, 빌려온 탭에선 제거**한다.
// 처리 순서가 아니라 도메인이 우선권. (예: FOMC는 kr이 먼저여도 stocks가 소유 → kr에서 제거)
// 단, 같은 사건이라도 *프레이밍 도메인이 다르면 다른 줄*로 본다 — 같은 토큰을 공유해도
// 소유 도메인이 다르면 병합하지 않음. (예: "G7-이재명 출국"=kr 소유, "G7-AI 3강"=ai 소유 → 둘 다 유지)
// 반환: { kr:[줄,...], ... } — 각 탭 원래 순서 보존, max개 한도.
function dedupeBulletsByTab(updates, order = PREEMPT_ORDER, max = 5) {
  // 1) 모든 탭의 후보 줄을 인스턴스로 수집 + 소유 도메인 판정
  const instances = [];
  for (const tab of order) {
    summaryLines((updates[tab] || [])[0]).forEach((line, idx) => {
      const tokens = tokenize(line);
      instances.push({ tab, idx, line, tokens, owner: classifyOwner(tokens, tab) });
    });
  }
  // 2) 클러스터링. 두 줄은 다음 중 하나면 같은 그룹:
  //    (a) 강한 중복(공유 토큰 ≥ STRONG_DUP) — 프레이밍 도메인 달라도 병합 (동일 사건 도배 차단)
  //    (b) 같은 소유 도메인 + 약한 중복(≥2) — 같은 사건·같은 프레이밍
  // (a) 덕에 "Oracle 감원+Stargate" 를 탭마다 꼬리말만 바꿔 올려도 1면엔 한 번만 남는다.
  // (b) 덕에 "G7-이재명 출국"(kr)·"G7-AI 3강"(ai) 처럼 배경만 겹치는 다른 사건은 각각 유지.
  const groups = [];
  for (const inst of instances) {
    const g = groups.find(gr => gr.members.some(m => {
      const sh = sharedCount(m.tokens, inst.tokens);
      return sh >= STRONG_DUP || (m.owner === inst.owner && sh >= 2);
    }));
    if (g) g.members.push(inst);
    else groups.push({ members: [inst] });
  }
  // 3) 그룹마다 keeper 선정 — 자기 도메인을 소유한 "홈" 줄(tab===owner) 우선,
  //    그중 선점 우선순위 높은 탭. 홈 줄이 없으면 선점 우선순위만으로.
  const prio = t => { const i = order.indexOf(t); return i < 0 ? 999 : i; };
  const keep = new Set();
  for (const g of groups) {
    const home = g.members.filter(m => m.tab === m.owner);
    const pool = home.length ? home : g.members;
    const keeper = pool.slice().sort((a, b) => prio(a.tab) - prio(b.tab))[0];
    keep.add(keeper);
  }
  // 4) 탭별로 원래 순서대로 keeper만 추려 반환
  const result = {};
  for (const tab of order) {
    result[tab] = instances
      .filter(i => i.tab === tab && keep.has(i))
      .sort((a, b) => a.idx - b.idx)
      .map(i => i.line)
      .slice(0, max);
  }
  return result;
}

// 표지(1면) 헤드라인 — 탭별 dedup 결과의 첫 줄. 슬라이드 첫 불릿과 일관.
function pickDistinctHeadlines(updates, order = PREEMPT_ORDER) {
  const deduped = dedupeBulletsByTab(updates, order, 5);
  const result = {};
  for (const tab of order) {
    const lines = summaryLines((updates[tab] || [])[0]);
    result[tab] = (deduped[tab] || [])[0] || lines[0] || ''; // 전부 제거된 극단 케이스 폴백
  }
  return result;
}

module.exports = { pickDistinctHeadlines, dedupeBulletsByTab, classifyOwner, tokenize, isDuplicate, DOMAIN_KW, PREEMPT_ORDER };
