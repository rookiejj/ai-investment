// Unicorn & Pre-IPO Atlas - data source
// 비상장 유니콘·프리IPO 기업. index.html 자동 렌더링.

const data = [
  {
    title: "🤖 AI·ML",
    tag: "프론티어 모델·AI 인프라",
    stocks: [
      { nm:"OpenAI", rs:"ChatGPT·GPT-5·AGI 추구", val:"$852B", round:"$122B 펀딩", sector:"AGI", ipo:"2026 말 $1T+" },
      { nm:"Anthropic", rs:"ARR 3월 $190B→4월 $300B 2배·$800B 신규 오퍼 수령·Opus 4.7 GA", val:"$380B", round:"Feb '26 Series G $30B @ $350B pre", sector:"프론티어 AI", ipo:"2026.10 $60B+ 조달 협상" },
      { nm:"Databricks", rs:"레이크하우스·AI 통합·ARR $5.4B", val:"$134B", round:"Series L ($11B)", sector:"데이터·AI", ipo:"2026 H2 S-1" },
      { nm:"Cerebras", rs:"OpenAI 3년 $20B 다년 계약 확정·워런트 지분 옵션·4월 말 프라이싱·티커 CBRS", val:"$23B", round:"4월 말 프라이싱·$2B 조달", sector:"AI 하드웨어", ipo:"2026.04 나스닥·$22~25B" },
      { nm:"Safe Superintelligence", rs:"Sutskever 창업·제품 전무·Alphabet·NVIDIA 베팅 AGI 연구소", val:"$32B", round:"Series B ($2B, 2025-04)", sector:"AGI 안전", ipo:"미정" },
      { nm:"Thinking Machines Lab", rs:"Murati 창업·Tinker API·NVIDIA GW 파트너십·$50B 라운드 난항", val:"$12B", round:"Seed ($2B, 2025-07)", sector:"멀티모달 AI", ipo:"미정" },
      { nm:"Cohere", rs:"엔터프라이즈 LLM·ARR $240M+·프론티어 모델 제공사", val:"$7B", round:"Series D 확장 ($600M)", sector:"엔터프라이즈 LLM", ipo:"2026 CFO 영입" },
    ]
  },
  {
    title: "💳 핀테크",
    tag: "결제·뱅킹·HR·SMB",
    stocks: [
      { nm:"Stripe", rs:"결제 인프라 1위·TPV $1.9T", val:"$159B", round:"2/26 텐더오퍼", sector:"결제", ipo:"IPO 비우선" },
      { nm:"Revolut", rs:"디지털 뱅킹·매출 $9B·흑자", val:"$75B", round:"세컨더리 $100B 추진", sector:"네오뱅크", ipo:"2026 H2" },
      { nm:"Ramp", rs:"법인카드·지출관리·ARR $1B+", val:"$32B", round:"Series F ($300M)", sector:"법인 핀테크", ipo:"미정" },
      { nm:"Plaid", rs:"금융 데이터 API·오픈뱅킹", val:"$8B", round:"텐더오퍼 (업라운드)", sector:"핀테크 인프라", ipo:"2026 H2" },
      { nm:"Gusto", rs:"SMB HR·급여 30만 고객·2023 FCF 양전환", val:"$10B", round:"Series F ($175M, 2025-10)", sector:"HR·급여 핀테크", ipo:"미정 (IPO 후보)" },
      { nm:"Checkout.com", rs:"피크 $40B→$12B 재평가·2025 흑자 전환·유럽 최대 독립 게이트웨이", val:"$12B", round:"세컨더리 (2025-09)", sector:"글로벌 결제", ipo:"미정" },
      { nm:"Mercury", rs:"ARR $650M·30만 SMB 고객·$248B 거래량·$5B+ 신규 라운드 협상", val:"$3.5B", round:"Series C ($300M, 2025-03)", sector:"SMB 뱅킹·재무관리", ipo:"미정" },
    ]
  },
  {
    title: "🏢 엔터프라이즈 SW",
    tag: "생산성·AI 개발·협업",
    stocks: [
      { nm:"Canva", rs:"ARR $3.3B+·AI 생성 디자인·12월 $134B 업라운드", val:"$134B", round:"2025-12 Insight·Fidelity·JPM", sector:"디자인", ipo:"2026 H2 Blackbird 지지" },
      { nm:"Perplexity AI", rs:"AI 검색·Computer 에이전트·ARR $500M +335% YoY", val:"$22.6B", round:"Series E-6", sector:"AI 검색", ipo:"2027" },
      { nm:"Notion", rs:"AI 워크스페이스·문서·위키", val:"$11B", round:"세컨더리 ($270M)", sector:"생산성", ipo:"미정" },
      { nm:"Discord", rs:"커뮤니티 플랫폼·1/6 S-1 비밀 제출·나스닥 로드쇼 준비", val:"$15B", round:"Series I", sector:"소셜", ipo:"2026 H1 목표(지연 가능)" },
      { nm:"Airtable", rs:"노코드 데이터베이스·자동화", val:"$4B", round:"세컨더리 (다운)", sector:"노코드", ipo:"미정" },
      { nm:"Cursor", rs:"ARR $2B 돌파·$60B 신규 라운드 협상 중·AI IDE 1위", val:"$29.3B", round:"Series D ($2.3B, 2025-11)", sector:"AI 코딩", ipo:"미정" },
      { nm:"Hugging Face", rs:"Google·NVIDIA·AMD 공동 투자·오픈 AI 모델 허브 표준", val:"$4.5B", round:"Series D ($235M, 2023-08)", sector:"오픈소스 AI 허브", ipo:"미정" },
    ]
  },
  {
    title: "🚀 우주·모빌리티·방산",
    tag: "발사체·자율주행·자율무기·피지컬 AI",
    stocks: [
      { nm:"SpaceX", rs:"Starlink·Starship·xAI 합병·2025 통합매출 $18.7B(Starlink $11.4B)·6/15 프라이싱·PIF $5B", val:"$1.25T", round:"S-1 비밀 제출·$75B 조달", sector:"우주", ipo:"2026.06.15 프라이싱·$1.75T 사상 최대" },
      { nm:"Zipline", rs:"드론 배송·누적 200만 건", val:"$7.6B", round:"Series H ($800M)", sector:"드론·물류", ipo:"2027" },
      { nm:"Vast", rs:"민간 우주정거장·NASA 후보·$500M 조달", val:"$20B", round:"Series B ($500M, 2026-03)", sector:"우주 인프라", ipo:"미정" },
      { nm:"Relativity Space", rs:"Eric Schmidt CEO·Terran R 2026년 말 첫 발사 목표", val:"$4.2B", round:"Angel (Schmidt, 2025-01)", sector:"3D 프린트 로켓", ipo:"미정" },
      { nm:"Waymo", rs:"연 1,500만 트립·11개 도시 확장·자율주행 최대 유니콘", val:"$126B", round:"Series D ($16B, 2026-02)", sector:"자율주행 로보택시", ipo:"미정 (2027 흑자 목표)" },
      { nm:"Anduril", rs:"방산 AI·Lattice OS·Series H 최대 $8B 협상·2차시장 $73B+", val:"$60B", round:"Series G (2024-08)", sector:"방산 AI", ipo:"단기 아님(Luckey)" },
      { nm:"Figure AI", rs:"휴머노이드 로봇·BMW 공장 90K+ 파트 로딩·피지컬 AI", val:"$39B", round:"Series C ($1B)", sector:"휴머노이드 로봇", ipo:"미정" },
    ]
  },
  {
    title: "🧬 바이오·헬스",
    tag: "AI 신약·BCI·디지털 헬스",
    stocks: [
      { nm:"Insitro", rs:"AI 기반 신약 발굴 플랫폼", val:"$2.4B", round:"Series C", sector:"AI 바이오", ipo:"미정" },
      { nm:"Color Health", rs:"유전체·예방의학·AI 진단", val:"$4.6B", round:"Series E", sector:"디지털 헬스", ipo:"미정" },
      { nm:"Xaira Therapeutics", rs:"AI 신약 발굴·ARCH·NVIDIA", val:"$3.5B", round:"론칭 라운드 ($1.3B)", sector:"AI 바이오", ipo:"미정" },
      { nm:"Neuralink", rs:"12명 이식 완료·양산·Blindsight 시각 복원 착수", val:"$9B", round:"Series E ($650M, 2025-06)", sector:"BCI", ipo:"미정" },
      { nm:"Verily", rs:"Alphabet 지분 축소·독립법인 전환·AI 정밀 헬스 플랫폼", val:"미공개", round:"Series X ($300M, 2026-03)", sector:"정밀 의료·AI 진단", ipo:"미정" },
      { nm:"Devoted Health", rs:"메디케어 어드밴티지 46.6만 멤버·전년 +121%·29개주·AI 진단", val:"$13B", round:"Series F-Prime ($317M, 2026-01)", sector:"메디케어 AI", ipo:"미정" },
      { nm:"Sword Health", rs:"AI 기반 근골격 치료·Hinge 경쟁사·글로벌 확장", val:"$3B", round:"Series E ($130M, 2024-06)", sector:"디지털 MSK 치료", ipo:"미정" },
    ]
  },
  {
    title: "₿ 크립토·Web3",
    tag: "거래소·인프라·분석·커스터디",
    stocks: [
      { nm:"Kraken", rs:"크립토 거래소 3위·co-CEO Sethi 공개 확인·Deutsche Börse $200M", val:"$13.3B", round:"IPO 비밀 신청 (4/14)", sector:"크립토 거래소", ipo:"2026 Q3 목표" },
      { nm:"Ripple", rs:"XRP·크로스보더 결제·Citadel 투자", val:"$40B", round:"$500M (Citadel·Fortress)", sector:"블록체인 결제", ipo:"IPO 미정 (경영진 부정)" },
      { nm:"ConsenSys", rs:"이더리움 인프라·MetaMask", val:"$10B", round:"IPO 협의 (GS·JPM)", sector:"Web3 인프라", ipo:"2026 H2" },
      { nm:"Fireblocks", rs:"디지털자산 커스터디·TRES $130M 인수(1/7)·기관 보안", val:"$8B", round:"Series F", sector:"디지털자산", ipo:"2027" },
      { nm:"Chainalysis", rs:"블록체인 분석·컴플라이언스", val:"$8.6B", round:"Series G", sector:"블록체인 분석", ipo:"2027" },
      { nm:"Alchemy", rs:"이더리움·솔라나 RPC·4월 Solana $20M 개발자 펀드", val:"$10.2B", round:"Series C1 ($200M, 2022-02)", sector:"Web3 인프라", ipo:"미정" },
      { nm:"Anchorage Digital", rs:"미 연방 인가 크립토 은행·$200-400M 추가 조달 협상", val:"$4.2B", round:"Tether $100M (2026-02)", sector:"기관 크립토 커스터디", ipo:"2027 검토" },
    ]
  },
];
