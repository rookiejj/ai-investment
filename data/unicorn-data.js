// Unicorn & Pre-IPO Atlas - data source
// 비상장 유니콘·프리IPO 기업. index.html 자동 렌더링.

const data = [
  {
    title: "🤖 AI·ML",
    tag: "프론티어 모델·AI 인프라",
    stocks: [
      { nm:"OpenAI", rs:"ChatGPT·GPT-5·AGI 추구", val:"$840B", round:"$122B 펀딩", sector:"AGI", ipo:"2026 말" },
      { nm:"Anthropic", rs:"Claude·안전 AI·B2B 매출 1위", val:"$120B", round:"Series G ($35B)", sector:"프론티어 AI", ipo:"2026 Q4" },
      { nm:"Databricks", rs:"데이터 레이크하우스·AI 통합", val:"$62B", round:"Series J ($10B)", sector:"데이터·AI", ipo:"2027" },
      { nm:"Scale AI", rs:"데이터 라벨링·RLHF·평가", val:"$14B", round:"Series F ($1B)", sector:"AI 인프라", ipo:"2027" },
      { nm:"Cerebras", rs:"웨이퍼급 AI칩·WSE-3", val:"$8B", round:"IPO 재추진", sector:"AI 하드웨어", ipo:"2026 H2" },
    ]
  },
  {
    title: "💳 핀테크",
    tag: "결제·뱅킹·BNPL",
    stocks: [
      { nm:"Stripe", rs:"글로벌 결제 인프라 1위", val:"$65B", round:"직원 주식 매각", sector:"결제", ipo:"2026 H2" },
      { nm:"Klarna", rs:"BNPL·AI 쇼핑 어시스턴트", val:"$15B", round:"Series H", sector:"BNPL", ipo:"2026 Q2" },
      { nm:"Revolut", rs:"디지털 뱅킹·크립토·글로벌", val:"$45B", round:"Series F", sector:"네오뱅크", ipo:"2027" },
      { nm:"Chime", rs:"미국 네오뱅크 1위·무수수료", val:"$25B", round:"Series H", sector:"네오뱅크", ipo:"2026" },
      { nm:"Plaid", rs:"금융 데이터 API·오픈뱅킹", val:"$13B", round:"Series D", sector:"핀테크 인프라", ipo:"미정" },
    ]
  },
  {
    title: "🏢 엔터프라이즈 SW",
    tag: "생산성·디자인·협업",
    stocks: [
      { nm:"Canva", rs:"디자인 플랫폼·AI 생성·1.7억 MAU", val:"$40B", round:"Series F", sector:"디자인", ipo:"2027" },
      { nm:"Figma", rs:"UI 디자인 협업·Adobe 인수 무산", val:"$12.5B", round:"Series E", sector:"디자인", ipo:"미정" },
      { nm:"Notion", rs:"AI 워크스페이스·문서·위키", val:"$10B", round:"Series C", sector:"생산성", ipo:"미정" },
      { nm:"Discord", rs:"커뮤니티 플랫폼·2억 MAU", val:"$15B", round:"Series I", sector:"소셜", ipo:"2027" },
      { nm:"Airtable", rs:"노코드 데이터베이스·자동화", val:"$11B", round:"Series F", sector:"노코드", ipo:"미정" },
    ]
  },
  {
    title: "🚀 우주·모빌리티",
    tag: "발사체·위성·UAM",
    stocks: [
      { nm:"SpaceX", rs:"Starlink·Starship·xAI 합병", val:"$1.25T", round:"합병 완료", sector:"우주", ipo:"$1.75T IPO 추진" },
      { nm:"Relativity Space", rs:"3D프린팅 로켓·Terran R", val:"$4.2B", round:"Series E", sector:"우주", ipo:"미정" },
      { nm:"Boom Supersonic", rs:"초음속 여객기 Overture", val:"$8B", round:"Series C", sector:"항공", ipo:"미정" },
      { nm:"Zipline", rs:"드론 배송·의료·리테일", val:"$4.2B", round:"Series F", sector:"드론·물류", ipo:"2027" },
      { nm:"Vast", rs:"민간 우주정거장 Haven-1", val:"$1.5B", round:"Series B", sector:"우주 인프라", ipo:"미정" },
    ]
  },
  {
    title: "🧬 바이오·헬스",
    tag: "AI 신약·디지털 헬스",
    stocks: [
      { nm:"Insitro", rs:"AI 기반 신약 발굴 플랫폼", val:"$2.4B", round:"Series C", sector:"AI 바이오", ipo:"미정" },
      { nm:"Eikon Therapeutics", rs:"초해상도 현미경+AI 신약", val:"$3.5B", round:"Series C", sector:"AI 바이오", ipo:"미정" },
      { nm:"Color Health", rs:"유전체·예방의학·AI 진단", val:"$4.6B", round:"Series E", sector:"디지털 헬스", ipo:"미정" },
      { nm:"Groq", rs:"LPU AI 추론 반도체·초저지연", val:"$2.8B", round:"Series D", sector:"AI 하드웨어", ipo:"미정" },
      { nm:"Cohere", rs:"엔터프라이즈 LLM·RAG 특화", val:"$5.5B", round:"Series D", sector:"엔터프라이즈 AI", ipo:"2027" },
    ]
  },
  {
    title: "₿ 크립토·Web3",
    tag: "스테이블코인·인프라·분석",
    stocks: [
      { nm:"Circle", rs:"USDC 발행사·결제 인프라", val:"$9B", round:"IPO 추진", sector:"스테이블코인", ipo:"2026" },
      { nm:"Ripple", rs:"XRP·크로스보더 결제·ODL", val:"$11B", round:"자체 자금", sector:"블록체인 결제", ipo:"미정" },
      { nm:"ConsenSys", rs:"이더리움 인프라·MetaMask", val:"$7B", round:"Series D", sector:"Web3 인프라", ipo:"미정" },
      { nm:"Fireblocks", rs:"디지털자산 커스터디·보안", val:"$8B", round:"Series F", sector:"디지털자산", ipo:"2027" },
      { nm:"Chainalysis", rs:"블록체인 분석·컴플라이언스", val:"$8.6B", round:"Series G", sector:"블록체인 분석", ipo:"2027" },
    ]
  },
];
