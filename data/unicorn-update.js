// Unicorn & Pre-IPO - Update Log
const updates = [
  {
    date: "2026-04-15 21:38 KST",
    badge: "개별",
    summary: "Perplexity ARR $500M 돌파 반영 (Computer 에이전트·업라운드)",
    changes: [
      { type: "수치 갱신", sector: "엔터프라이즈 SW",
        detail: "Perplexity AI ARR $454M → $500M 상향. 2026년 4월 기준 연환산 매출 $500M 돌파, 전년 대비 +335% 가속(2025 $232M 대비 2배+). 2월 AI 에이전트 'Computer' 출시와 사용량 기반 가격 레이어 도입이 주요 촉매. 밸류 $22.6B 유지(2026 초반 Series E-6 종결).", time: "2026-04-15 21:38 KST" },
    ]
  },
  {
    date: "2026-04-15 12:40 KST",
    summary: "Anthropic $800B 오퍼·Cerebras 4월 IPO 가격 임박·SpaceX $1.75T 로드쇼 확정",
    changes: [
      { type: "수치 갱신", sector: "AI·ML",
        detail: "Anthropic VC $800B 밸류 신규 펀딩 오퍼 수신(4/14 Bloomberg). 2월 Series G pre-money $350B의 2배 이상, ARR $30B(연초 $9B 대비 3배 이상 가속)가 촉매. round 필드를 'Series G ($30B)' → '$800B 오퍼 수신(4/14)'로 갱신. rs도 'VC $800B 오퍼·Series G 2배+' 문구로 반영. 공식 수락은 아직 없으며 val은 기존 $380B(Series G 포스트) 유지." },
      { type: "수치 갱신", sector: "AI·ML",
        detail: "Cerebras 4월 IPO 가격 결정 임박. Morgan Stanley 주관으로 $2B 조달, $22~25B 공모 가격대 가이드. 6개월 전 $8.1B 대비 약 3배. rs를 'WSE-3·OpenAI $10B·MS 주관 $2B 공모', round를 '4월 IPO 가격 임박·$2B 조달'로 갱신." },
      { type: "수치 갱신", sector: "우주·모빌리티",
        detail: "SpaceX IPO 세부 일정 공식화(CNBC/Reuters 4/7). 6/8 로드쇼, 6/11 1,500명 리테일 투자자 이벤트. MS·BofA·Citi·JPM·GS 주관, 16개 추가 은행. 리테일 30% 할당 전례 없는 규모. 목표 $1.75T·$75B 조달. 기존 val $1.25T는 xAI 합병 후 combined 기준, ipo 필드는 '$1.75T~2T' 밴드 유지." }
    ]
  },
  {
    date: "2026-04-14 07:23 KST",
    summary: "SpaceX IPO 목표 밸류에이션 및 로드쇼 일정 갱신",
    changes: [
      { type: "수치 갱신", sector: "우주·모빌리티",
        detail: "SpaceX IPO 공식 목표 정정: 기존 '$2T+ 추진' → $1.75T 목표. S-1 비밀 제출(4/1) 후 로드쇼 6/8, 소매 이벤트 6/11 일정 공식화. 조달 목표 $50~75B. 상장 후 가격이 $2T+ 도달 가능성은 있으나 공모 목표는 $1.75T." }
    ]
  },
  {
    date: "2026-04-13 21:16 KST",
    summary: "재검증 — Navan 상장 확인·제외, 밸류에이션 10건 정정, Anduril 편입",
    changes: [
      { type: "제외(상장)", sector: "핀테크", detail: "Navan 2025.10 나스닥 IPO(NAVN) 확인. Anduril($60B 방산AI·美 육군 $20B 계약) 편입." },
      { type: "수치 정정", sector: "AI·ML", detail: "Anthropic 라운드명 Series H→Series G 정정 (공식 발표 기준)." },
      { type: "수치 갱신", sector: "핀테크", detail: "Ramp $13B→$32B(Series F $300M, ARR $1B+), Plaid 다운라운드→업라운드 정정." },
      { type: "수치 갱신", sector: "엔터프라이즈 SW", detail: "Perplexity AI $20B→$22.6B(ARR $454M), Canva ARR $4B→$6B+(IPO 2026 H2 전망)." },
      { type: "수치 갱신", sector: "바이오·헬스", detail: "Xaira $1B+→$3.5B(펀딩 $1.3B), Cohere $6.8B→$7B." },
      { type: "수치 갱신", sector: "크립토·Web3", detail: "Kraken $12B→$20B($800M 조달, IPO 보류), Ripple IPO 전망→경영진 IPO 부정." },
      { type: "수치 갱신", sector: "우주·모빌리티", detail: "Stoke Space $3B→$3.4B(Series D $860M 확장)." },
    ]
  },
  {
    date: "2026-04-13 20:52 KST",
    summary: "7개 기업 제외(상장·인수) + 대체 편입, 전체 밸류에이션 갱신",
    changes: [
      { type: "제외(상장)", sector: "핀테크", detail: "Klarna(2025.9 NYSE IPO), Chime(2025.6 나스닥 IPO) 제외. Ramp($13B 법인카드), Navan($9.4B 법인출장) 편입." },
      { type: "제외(상장)", sector: "엔터프라이즈 SW", detail: "Figma(2025.7 NYSE IPO) 제외. Perplexity AI($20B AI 검색) 편입." },
      { type: "제외(인수)", sector: "우주·모빌리티", detail: "Relativity Space(Eric Schmidt 인수) 제외. Stoke Space($3B 재사용 로켓) 편입." },
      { type: "제외(상장/인수)", sector: "바이오·헬스", detail: "Eikon Therapeutics(2026.2 IPO), Groq(NVIDIA $20B 인수) 제외. Figure AI($39B 휴머노이드), Xaira Therapeutics($1B+ AI 신약) 편입." },
      { type: "제외(상장)", sector: "크립토·Web3", detail: "Circle(2025.6 NYSE IPO) 제외. Kraken($12B 크립토 거래소) 편입." },
      { type: "밸류에이션 갱신", sector: "AI·ML", detail: "Anthropic $120B→$380B(Series H $30B), Databricks $62B→$134B(Series L), Scale AI $14B→$29B(Meta 투자), Cerebras $8B→$22B(IPO 로드쇼)." },
      { type: "밸류에이션 갱신", sector: "핀테크", detail: "Stripe $65B→$159B(2/26 텐더오퍼), Revolut $45B→$75B, Plaid $13B→$8B(다운라운드)." },
      { type: "밸류에이션 갱신", sector: "우주·모빌리티", detail: "Boom $8B→$1.5B(대폭 하락·피벗), Zipline $4.2B→$7.6B, Vast $1.5B→$20B(+1,233%)." },
      { type: "밸류에이션 갱신", sector: "크립토·Web3", detail: "Ripple $11B→$40B(Citadel·Fortress 투자), ConsenSys $7B→$10B(IPO 협의)." },
      { type: "밸류에이션 갱신", sector: "바이오·헬스", detail: "Cohere $5.5B→$6.8B(ARR $240M, CFO 영입)." },
      { type: "기타", sector: "엔터프라이즈 SW", detail: "Airtable $11B→$4B(세컨더리 다운). Discord IPO 비밀 신청(나스닥)." },
    ]
  },
  {
    date: "2026-04-13 15:07 KST",
    summary: "Stripe 밸류에이션 보정",
    changes: [
      { type: "수치 갱신", sector: "핀테크", detail: "Stripe 밸류에이션 $95B→$65B. 프라이빗 마켓 직원 주식 매각 기준 $65B 반영." },
    ]
  },
  {
    date: "2026-04-13 12:30 KST",
    summary: "유니콘·프리IPO 6개 카테고리 30개 기업 초기 구성",
    changes: [
      { type: "신규 구성", sector: "전체",
        detail: "6개 카테고리 구성: AI·ML, 핀테크, 엔터프라이즈 SW, 우주·모빌리티, 바이오·헬스, 크립토·Web3. 총 30개 비상장 기업." },
    ]
  },
];
