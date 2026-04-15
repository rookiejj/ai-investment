// Unicorn & Pre-IPO Atlas - data source
// 비상장 유니콘·프리IPO 기업. index.html 자동 렌더링.

const data = [
  {
    title: "🤖 AI·ML",
    tag: "프론티어 모델·AI 인프라",
    stocks: [
      { nm:"OpenAI", rs:"ChatGPT·GPT-5·AGI 추구", val:"$852B", round:"$122B 펀딩", sector:"AGI", ipo:"2026 말 $1T+" },
      { nm:"Anthropic", rs:"ARR $30B·VC $800B 오퍼·Series G 2배+", val:"$380B", round:"$800B 오퍼 수신(4/14)", sector:"프론티어 AI", ipo:"2026.10 $400B+" },
      { nm:"Databricks", rs:"레이크하우스·AI 통합·ARR $5.4B", val:"$134B", round:"Series L ($11B)", sector:"데이터·AI", ipo:"2026 H2 S-1" },
      { nm:"Scale AI", rs:"데이터 라벨링·RLHF·Meta 전략투자", val:"$29B", round:"Meta 투자 ($14.3B)", sector:"AI 인프라", ipo:"2027" },
      { nm:"Cerebras", rs:"WSE-3·OpenAI $10B·MS 주관 $2B 공모", val:"$23B", round:"4월 IPO 가격 임박·$2B 조달", sector:"AI 하드웨어", ipo:"2026 4월 IPO·$22~25B" },
    ]
  },
  {
    title: "💳 핀테크",
    tag: "결제·뱅킹·BNPL",
    stocks: [
      { nm:"Stripe", rs:"결제 인프라 1위·TPV $1.9T", val:"$159B", round:"2/26 텐더오퍼", sector:"결제", ipo:"IPO 비우선" },
      { nm:"Revolut", rs:"디지털 뱅킹·매출 $9B·흑자", val:"$75B", round:"세컨더리 $100B 추진", sector:"네오뱅크", ipo:"2026 H2" },
      { nm:"Ramp", rs:"법인카드·지출관리·ARR $1B+", val:"$32B", round:"Series F ($300M)", sector:"법인 핀테크", ipo:"미정" },
      { nm:"Plaid", rs:"금융 데이터 API·오픈뱅킹", val:"$8B", round:"텐더오퍼 (업라운드)", sector:"핀테크 인프라", ipo:"2026 H2" },
      { nm:"Anduril", rs:"방산 AI·자율무기·美 육군 $20B", val:"$60B", round:"Series G", sector:"방산 AI", ipo:"2026 검토" },
    ]
  },
  {
    title: "🏢 엔터프라이즈 SW",
    tag: "생산성·디자인·협업",
    stocks: [
      { nm:"Canva", rs:"디자인 플랫폼·AI 생성·ARR $6B+", val:"$42B", round:"세컨더리", sector:"디자인", ipo:"2026 H2" },
      { nm:"Perplexity AI", rs:"AI 검색·Computer 에이전트·ARR $500M +335% YoY", val:"$22.6B", round:"Series E-6", sector:"AI 검색", ipo:"2027" },
      { nm:"Notion", rs:"AI 워크스페이스·문서·위키", val:"$11B", round:"세컨더리 ($270M)", sector:"생산성", ipo:"미정" },
      { nm:"Discord", rs:"커뮤니티 플랫폼·IPO 비밀 신청", val:"$15B", round:"Series I", sector:"소셜", ipo:"2026 나스닥" },
      { nm:"Airtable", rs:"노코드 데이터베이스·자동화", val:"$4B", round:"세컨더리 (다운)", sector:"노코드", ipo:"미정" },
    ]
  },
  {
    title: "🚀 우주·모빌리티",
    tag: "발사체·위성·UAM",
    stocks: [
      { nm:"SpaceX", rs:"Starlink·Starship·xAI 합병", val:"$1.25T", round:"S-1 비밀 제출 (4/1)", sector:"우주", ipo:"6월 IPO 목표 $1.75T~2T" },
      { nm:"Stoke Space", rs:"완전 재사용 로켓·2단 회수", val:"$3.4B", round:"Series D ($860M)", sector:"우주", ipo:"미정" },
      { nm:"Boom Supersonic", rs:"초음속 여객기·DC 터빈 피벗", val:"$1.5B", round:"Series B ($300M)", sector:"항공", ipo:"미정" },
      { nm:"Zipline", rs:"드론 배송·누적 200만 건", val:"$7.6B", round:"Series H ($800M)", sector:"드론·물류", ipo:"2027" },
      { nm:"Vast", rs:"민간 우주정거장·NASA 후보", val:"$20B", round:"Series A ($500M)", sector:"우주 인프라", ipo:"미정" },
    ]
  },
  {
    title: "🧬 바이오·헬스",
    tag: "AI 신약·디지털 헬스",
    stocks: [
      { nm:"Insitro", rs:"AI 기반 신약 발굴 플랫폼", val:"$2.4B", round:"Series C", sector:"AI 바이오", ipo:"미정" },
      { nm:"Figure AI", rs:"휴머노이드 로봇·산업·헬스", val:"$39B", round:"Series C ($1B)", sector:"피지컬 AI", ipo:"미정" },
      { nm:"Color Health", rs:"유전체·예방의학·AI 진단", val:"$4.6B", round:"Series E", sector:"디지털 헬스", ipo:"미정" },
      { nm:"Cohere", rs:"엔터프라이즈 LLM·ARR $240M+", val:"$7B", round:"Series D 확장 ($600M)", sector:"엔터프라이즈 AI", ipo:"2026 CFO영입" },
      { nm:"Xaira Therapeutics", rs:"AI 신약 발굴·ARCH·NVIDIA", val:"$3.5B", round:"론칭 라운드 ($1.3B)", sector:"AI 바이오", ipo:"미정" },
    ]
  },
  {
    title: "₿ 크립토·Web3",
    tag: "스테이블코인·인프라·분석",
    stocks: [
      { nm:"Kraken", rs:"크립토 거래소 3위·$800M 조달", val:"$20B", round:"$800M (11/25)", sector:"크립토 거래소", ipo:"IPO 보류 (시황)" },
      { nm:"Ripple", rs:"XRP·크로스보더 결제·Citadel 투자", val:"$40B", round:"$500M (Citadel·Fortress)", sector:"블록체인 결제", ipo:"IPO 미정 (경영진 부정)" },
      { nm:"ConsenSys", rs:"이더리움 인프라·MetaMask", val:"$10B", round:"IPO 협의 (GS·JPM)", sector:"Web3 인프라", ipo:"2026 H2" },
      { nm:"Fireblocks", rs:"디지털자산 커스터디·보안", val:"$8B", round:"Series F", sector:"디지털자산", ipo:"2027" },
      { nm:"Chainalysis", rs:"블록체인 분석·컴플라이언스", val:"$8.6B", round:"Series G", sector:"블록체인 분석", ipo:"2027" },
    ]
  },
];
