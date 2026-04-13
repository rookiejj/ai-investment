// US Stocks Atlas - data source
// Edit this file to update stocks. index.html auto-renders from here.

const data = [
  {
    title: "🤖 AI 플랫폼",
    tag: "모델·엔터프라이즈 SW",
    stocks: [
      { tk:"MSFT", nm:"Microsoft", rs:"Azure AI·Copilot·OpenAI", r25:"282", p25:"101", r26:"325", p26:"118" },
      { tk:"GOOGL", nm:"Alphabet", rs:"Gemini·TPU·검색", r25:"403", p25:"132", r26:"455", p26:"148" },
      { tk:"META", nm:"Meta", rs:"Llama·광고 AI", r25:"201", p25:"66", r26:"235", p26:"72" },
      { tk:"ORCL", nm:"Oracle", rs:"OCI·Stargate RPO $523B", r25:"57", p25:"12", r26:"68", p26:"15" },
      { tk:"PLTR", nm:"Palantir", rs:"AIP 국방·상용", r25:"4.5", p25:"0.6", r26:"7.2", p26:"1.5" },
      { tk:"CRM", nm:"Salesforce", rs:"Agentforce·Data Cloud", r25:"42", p25:"7.6", r26:"46", p26:"8.5" },
    ]
  },
  {
    title: "🔩 반도체",
    tag: "AI칩·파운드리·장비·메모리",
    stocks: [
      { tk:"NVDA", nm:"NVIDIA", rs:"Blackwell·Rubin·CUDA 해자", r25:"216", p25:"117", r26:"337", p26:"192" },
      { tk:"AVGO", nm:"Broadcom", rs:"커스텀 ASIC·AI 백로그 $73B", r25:"64", p25:"23", r26:"88", p26:"34" },
      { tk:"TSM", nm:"TSMC", rs:"Q1 $35.6B 사상 최대·첨단공정", r25:"117", p25:"55", r26:"150", p26:"68" },
      { tk:"ASML", nm:"ASML", rs:"EUV 독점", r25:"33", p25:"9", r26:"40", p26:"11" },
      { tk:"LRCX", nm:"Lam Research", rs:"HBM·NAND 장비", r25:"18", p25:"5", r26:"22", p26:"6.3" },
      { tk:"MU", nm:"Micron", rs:"HBM4 램프·26년 전량 완판", r25:"37", p25:"8", r26:"79", p26:"23" },
    ]
  },
  {
    title: "🏢 데이터센터",
    tag: "REIT·서버·네트워킹·GPU클라우드",
    stocks: [
      { tk:"DLR", nm:"Digital Realty", rs:"글로벌 DC REIT", r25:"5.8", p25:"0.6", r26:"6.4", p26:"0.8" },
      { tk:"EQIX", nm:"Equinix", rs:"상호접속 허브", r25:"9.1", p25:"1.0", r26:"9.9", p26:"1.2" },
      { tk:"ANET", nm:"Arista", rs:"AI 클러스터 스위칭", r25:"9.0", p25:"3.5", r26:"11", p26:"4.2" },
      { tk:"DELL", nm:"Dell Tech", rs:"AI 서버 ISG", r25:"102", p25:"5.0", r26:"115", p26:"6.2" },
      { tk:"CRWV", nm:"CoreWeave", rs:"GPU 클라우드·백로그 $66.8B", r25:"5.1", p25:"-1.2", r26:"12.5", p26:"-0.5" },
      { tk:"CSCO", nm:"Cisco", rs:"AI 네트워킹·보안", r25:"54", p25:"11", r26:"58", p26:"12.5" },
    ]
  },
  {
    title: "❄️ 냉각 시스템",
    tag: "액체냉각·HVAC",
    stocks: [
      { tk:"VRT", nm:"Vertiv", rs:"액냉·전력관리 백로그 $15B", r25:"10.2", p25:"1.5", r26:"13.5", p26:"2.3" },
      { tk:"MOD", nm:"Modine", rs:"DC 냉각 CIS", r25:"2.6", p25:"0.18", r26:"3.0", p26:"0.23" },
      { tk:"TT", nm:"Trane Tech", rs:"HVAC 열관리 리더", r25:"21", p25:"2.9", r26:"23", p26:"3.3" },
      { tk:"JCI", nm:"Johnson Controls", rs:"빌딩·DC HVAC", r25:"23", p25:"2.0", r26:"24", p26:"2.3" },
      { tk:"CARR", nm:"Carrier", rs:"열관리·히트펌프", r25:"22", p25:"2.4", r26:"24", p26:"2.8" },
      { tk:"LII", nm:"Lennox Intl", rs:"상업 HVAC", r25:"5.6", p25:"0.78", r26:"6.0", p26:"0.88" },
    ]
  },
  {
    title: "💧 물·수자원",
    tag: "DC 냉각수 수요",
    stocks: [
      { tk:"XYL", nm:"Xylem", rs:"수처리·펌프 1위", r25:"8.9", p25:"0.95", r26:"9.5", p26:"1.1" },
      { tk:"AWK", nm:"American Water", rs:"최대 상수도 유틸", r25:"4.7", p25:"1.1", r26:"5.0", p26:"1.2" },
      { tk:"ECL", nm:"Ecolab", rs:"DC 물관리 솔루션", r25:"16", p25:"2.1", r26:"17", p26:"2.4" },
      { tk:"WTS", nm:"Watts Water", rs:"배관·유량제어", r25:"2.2", p25:"0.27", r26:"2.3", p26:"0.30" },
      { tk:"ROP", nm:"Roper Tech", rs:"Neptune 수도계량", r25:"7.4", p25:"1.6", r26:"8.0", p26:"1.8" },
      { tk:"PNR", nm:"Pentair", rs:"수처리·수영장", r25:"4.2", p25:"0.65", r26:"4.4", p26:"0.72" },
    ]
  },
  {
    title: "⚡ 전력·그리드",
    tag: "발전설비·송배전",
    stocks: [
      { tk:"GEV", nm:"GE Vernova", rs:"가스터빈 80GW 백로그", r25:"38", p25:"2.4", r26:"45", p26:"3.8" },
      { tk:"ETN", nm:"Eaton", rs:"전력관리 DC", r25:"27", p25:"4.2", r26:"29", p26:"4.8" },
      { tk:"PWR", nm:"Quanta Svcs", rs:"송전망 시공 1위", r25:"26", p25:"1.3", r26:"29", p26:"1.6" },
      { tk:"HUBB", nm:"Hubbell", rs:"전력 유틸 장비", r25:"5.9", p25:"0.85", r26:"6.3", p26:"0.95" },
      { tk:"NEE", nm:"NextEra", rs:"재생+원전 최대 유틸", r25:"27", p25:"7.5", r26:"29", p26:"8.2" },
      { tk:"PH", nm:"Parker Hannifin", rs:"전력·산업 모션", r25:"20", p25:"3.2", r26:"21", p26:"3.6" },
    ]
  },
  {
    title: "☢️ 원자력·SMR",
    tag: "가동원전·연료·차세대",
    stocks: [
      { tk:"CEG", nm:"Constellation", rs:"Calpine 통합·AI PPA", r25:"27", p25:"2.9", r26:"30", p26:"3.5" },
      { tk:"VST", nm:"Vistra", rs:"원전+가스", r25:"18", p25:"2.6", r26:"20", p26:"3.0" },
      { tk:"BWXT", nm:"BWX Tech", rs:"해군원자로·SMR 연료", r25:"2.9", p25:"0.33", r26:"3.2", p26:"0.38" },
      { tk:"LEU", nm:"Centrus", rs:"HALEU 농축", r25:"0.45", p25:"0.05", r26:"0.55", p26:"0.07" },
      { tk:"OKLO", nm:"Oklo", rs:"고속로 SMR", r25:"0.0", p25:"-0.08", r26:"0.05", p26:"-0.10" },
      { tk:"CCJ", nm:"Cameco", rs:"우라늄 채굴 메이저", r25:"3.2", p25:"0.45", r26:"3.8", p26:"0.60" },
    ]
  },
  {
    title: "🧬 바이오·헬스케어",
    tag: "GLP-1·종양·로봇수술",
    stocks: [
      { tk:"LLY", nm:"Eli Lilly", rs:"Mounjaro·Foundayo 경구 GLP-1 승인", r25:"65", p25:"22", r26:"81", p26:"28" },
      { tk:"NVO", nm:"Novo Nordisk", rs:"Wegovy 경구제 $149·가격 압력", r25:"47", p25:"15", r26:"43", p26:"13" },
      { tk:"ISRG", nm:"Intuitive Surgical", rs:"da Vinci 로봇수술", r25:"8.8", p25:"2.6", r26:"10", p26:"3.0" },
      { tk:"VRTX", nm:"Vertex Pharma", rs:"낭포성섬유증·통증", r25:"11", p25:"4.0", r26:"12.5", p26:"4.6" },
      { tk:"REGN", nm:"Regeneron", rs:"Eylea·종양", r25:"14", p25:"4.2", r26:"15", p26:"4.7" },
      { tk:"MRK", nm:"Merck", rs:"Keytruda 종양", r25:"64", p25:"18", r26:"68", p26:"20" },
    ]
  },
  {
    title: "🛢️ 에너지",
    tag: "석유메이저·LNG·유전서비스",
    stocks: [
      { tk:"XOM", nm:"ExxonMobil", rs:"통합 메이저", r25:"332", p25:"29", r26:"345", p26:"32" },
      { tk:"CVX", nm:"Chevron", rs:"상류·정유·기록적 생산", r25:"189", p25:"12", r26:"195", p26:"14" },
      { tk:"LNG", nm:"Cheniere", rs:"미 최대 LNG 수출", r25:"16", p25:"3.5", r26:"18", p26:"4.2" },
      { tk:"SLB", nm:"Schlumberger", rs:"유전서비스 1위", r25:"37", p25:"4.5", r26:"39", p26:"5.0" },
      { tk:"COP", nm:"ConocoPhillips", rs:"상류 E&P", r25:"60", p25:"10", r26:"64", p26:"11" },
      { tk:"KMI", nm:"Kinder Morgan", rs:"가스 파이프라인", r25:"16", p25:"2.7", r26:"17", p26:"3.0" },
    ]
  },
  {
    title: "🌱 친환경·청정기술",
    tag: "태양광·리튬·수소·산업가스",
    stocks: [
      { tk:"FSLR", nm:"First Solar", rs:"미 박막 태양광", r25:"4.8", p25:"1.3", r26:"5.8", p26:"1.7" },
      { tk:"ENPH", nm:"Enphase", rs:"마이크로인버터", r25:"1.5", p25:"0.2", r26:"1.9", p26:"0.3" },
      { tk:"ALB", nm:"Albemarle", rs:"리튬 글로벌 1위", r25:"5.5", p25:"0.2", r26:"6.2", p26:"0.5" },
      { tk:"BE", nm:"Bloom Energy", rs:"고체산화물 연료전지·DC 전력", r25:"2.0", p25:"0.05", r26:"3.2", p26:"0.20" },
      { tk:"LIN", nm:"Linde", rs:"산업가스·수소 1위", r25:"34", p25:"7.0", r26:"36", p26:"7.7" },
      { tk:"APD", nm:"Air Products", rs:"수소·산업가스", r25:"12.5", p25:"2.6", r26:"13.2", p26:"2.9" },
    ]
  },
  {
    title: "🚗 자동차·모빌리티",
    tag: "EV·레거시·자율주행",
    stocks: [
      { tk:"TSLA", nm:"Tesla", rs:"EV·FSD·로보택시", r25:"95", p25:"3.8", r26:"109", p26:"7.2" },
      { tk:"TM", nm:"Toyota", rs:"하이브리드 강자", r25:"305", p25:"28", r26:"315", p26:"30" },
      { tk:"GM", nm:"General Motors", rs:"레거시 EV 전환", r25:"185", p25:"10", r26:"190", p26:"11" },
      { tk:"RIVN", nm:"Rivian", rs:"R2 양산 개시·VW JV", r25:"4.5", p25:"-3.6", r26:"6.9", p26:"-1.9" },
      { tk:"MBLY", nm:"Mobileye", rs:"ADAS·자율주행 칩", r25:"1.8", p25:"0.2", r26:"2.1", p26:"0.3" },
      { tk:"UBER", nm:"Uber", rs:"라이드·배송·로보택시", r25:"47", p25:"5.5", r26:"54", p26:"7.0" },
    ]
  },
  {
    title: "✈️ 항공우주·방산",
    tag: "전투기·미사일·우주·위성",
    stocks: [
      { tk:"LMT", nm:"Lockheed Martin", rs:"F-35·미사일", r25:"72", p25:"7.0", r26:"75", p26:"7.5" },
      { tk:"RTX", nm:"RTX Corp", rs:"패트리엇·엔진", r25:"82", p25:"6.5", r26:"86", p26:"7.2" },
      { tk:"NOC", nm:"Northrop Grumman", rs:"B-21·전략무기", r25:"42", p25:"4.0", r26:"44", p26:"4.3" },
      { tk:"GD", nm:"General Dynamics", rs:"잠수함·Gulfstream", r25:"49", p25:"4.2", r26:"52", p26:"4.6" },
      { tk:"BA", nm:"Boeing", rs:"흑자 전환·인도 700대 목표", r25:"89.5", p25:"2.2", r26:"80", p26:"3.5" },
      { tk:"RKLB", nm:"Rocket Lab", rs:"Neutron·SDA·HASTE 수주 확대", r25:"0.60", p25:"-0.15", r26:"0.90", p26:"-0.08" },
    ]
  },
  {
    title: "⚛️ 양자·크립토",
    tag: "고변동 테마 (양자3+크립토3)",
    stocks: [
      { tk:"IONQ", nm:"IonQ", rs:"이온트랩 양자", r25:"0.05", p25:"-0.30", r26:"0.12", p26:"-0.35" },
      { tk:"RGTI", nm:"Rigetti", rs:"초전도 양자", r25:"0.012", p25:"-0.08", r26:"0.025", p26:"-0.10" },
      { tk:"QBTS", nm:"D-Wave", rs:"어닐링 양자", r25:"0.015", p25:"-0.07", r26:"0.030", p26:"-0.08" },
      { tk:"COIN", nm:"Coinbase", rs:"미 최대 거래소", r25:"7.5", p25:"2.3", r26:"9.0", p26:"2.9" },
      { tk:"MSTR", nm:"Strategy", rs:"BTC 77만개 트레저리", r25:"0.5", p25:"-0.2", r26:"0.55", p26:"-0.15" },
      { tk:"MARA", nm:"Marathon Digital", rs:"BTC 채굴", r25:"0.75", p25:"0.10", r26:"1.0", p26:"0.20" },
    ]
  },
  {
    title: "🔒 사이버보안",
    tag: "AI 시대 필수 인프라",
    stocks: [
      { tk:"CRWD", nm:"CrowdStrike", rs:"Falcon 플랫폼·ARR 41% CAGR", r25:"4.8", p25:"0.65", r26:"5.8", p26:"1.1" },
      { tk:"PANW", nm:"Palo Alto", rs:"CyberArk $25B 인수·통합 보안", r25:"9.1", p25:"1.6", r26:"11", p26:"2.0" },
      { tk:"ZS", nm:"Zscaler", rs:"제로트러스트 클라우드", r25:"2.6", p25:"0.25", r26:"3.2", p26:"0.38" },
      { tk:"FTNT", nm:"Fortinet", rs:"통합 보안 어플라이언스", r25:"6.0", p25:"1.75", r26:"6.7", p26:"2.0" },
      { tk:"NET", nm:"Cloudflare", rs:"엣지 네트워크·보안", r25:"1.9", p25:"0.15", r26:"2.4", p26:"0.25" },
      { tk:"S", nm:"SentinelOne", rs:"AI 기반 EDR", r25:"0.85", p25:"-0.10", r26:"1.05", p26:"0.02" },
    ]
  },
  {
    title: "💳 핀테크·결제",
    tag: "소비·금리 사이클 수혜",
    stocks: [
      { tk:"V", nm:"Visa", rs:"글로벌 결제망 1위", r25:"40", p25:"20", r26:"43", p26:"22" },
      { tk:"MA", nm:"Mastercard", rs:"결제망 2위·크로스보더", r25:"33", p25:"15", r26:"37", p26:"17" },
      { tk:"AXP", nm:"American Express", rs:"프리미엄 카드 플랫폼", r25:"68", p25:"10.5", r26:"74", p26:"11.8" },
      { tk:"PYPL", nm:"PayPal", rs:"온라인 결제·턴어라운드", r25:"32", p25:"4.5", r26:"34", p26:"5.0" },
      { tk:"XYZ", nm:"Block", rs:"Square·Cash App", r25:"25", p25:"1.5", r26:"28", p26:"2.2" },
      { tk:"FI", nm:"Fiserv", rs:"가맹점 결제 인프라", r25:"21", p25:"3.8", r26:"22.5", p26:"4.3" },
    ]
  },
  {
    title: "🏦 금융·은행",
    tag: "규제완화·M&A 부활 테마",
    stocks: [
      { tk:"JPM", nm:"JPMorgan", rs:"미 최대 은행", r25:"186", p25:"57", r26:"192", p26:"56" },
      { tk:"GS", nm:"Goldman Sachs", rs:"IB 백로그 4년 최고·트레이딩", r25:"55", p25:"14", r26:"60", p26:"16" },
      { tk:"MS", nm:"Morgan Stanley", rs:"자산관리·IB", r25:"62", p25:"13", r26:"66", p26:"14.5" },
      { tk:"BAC", nm:"Bank of America", rs:"소매·상업은행", r25:"105", p25:"28", r26:"110", p26:"31" },
      { tk:"SCHW", nm:"Charles Schwab", rs:"리테일 브로커·자산관리", r25:"21", p25:"7.0", r26:"23", p26:"8.0" },
      { tk:"BLK", nm:"BlackRock", rs:"글로벌 자산운용 1위", r25:"21", p25:"6.8", r26:"23", p26:"7.6" },
    ]
  },
  {
    title: "🤖 로봇·자동화",
    tag: "AI 피지컬 확장",
    stocks: [
      { tk:"ABB", nm:"ABB Ltd", rs:"산업 로봇·전동화", r25:"33", p25:"4.2", r26:"35", p26:"4.7" },
      { tk:"ROK", nm:"Rockwell Auto", rs:"공장 자동화 1위", r25:"8.3", p25:"1.1", r26:"8.8", p26:"1.3" },
      { tk:"EMR", nm:"Emerson Elec", rs:"프로세스 자동화", r25:"17.5", p25:"3.0", r26:"18.5", p26:"3.3" },
      { tk:"CGNX", nm:"Cognex", rs:"머신비전 팩토리 자동화 1위", r25:"1.07", p25:"0.17", r26:"1.17", p26:"0.22" },
      { tk:"TER", nm:"Teradyne", rs:"반도체 테스트·협동로봇", r25:"3.0", p25:"0.55", r26:"3.4", p26:"0.70" },
      { tk:"ZBRA", nm:"Zebra Tech", rs:"물류 스캐너·로봇", r25:"5.0", p25:"0.55", r26:"5.4", p26:"0.70" },
    ]
  },
  {
    title: "🛒 소비·리테일",
    tag: "방어+성장 혼합",
    stocks: [
      { tk:"AMZN", nm:"Amazon", rs:"AWS·Trainium $20B·이커머스", r25:"717", p25:"78", r26:"800", p26:"95" },
      { tk:"WMT", nm:"Walmart", rs:"최대 오프라인 리테일", r25:"681", p25:"19.4", r26:"725", p26:"21" },
      { tk:"COST", nm:"Costco", rs:"회원제 창고형 1위", r25:"270", p25:"8.1", r26:"295", p26:"8.8" },
      { tk:"HD", nm:"Home Depot", rs:"홈 리모델링 1위", r25:"160", p25:"15.5", r26:"166", p26:"16.5" },
      { tk:"CMG", nm:"Chipotle", rs:"QSR 고성장", r25:"11.5", p25:"1.7", r26:"13", p26:"2.0" },
      { tk:"LULU", nm:"Lululemon", rs:"프리미엄 애슬레저", r25:"11", p25:"1.8", r26:"11.8", p26:"2.0" },
    ]
  },
];