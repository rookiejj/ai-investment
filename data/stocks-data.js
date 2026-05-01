// US Stocks Atlas - data source
// Edit this file to update stocks. index.html auto-renders from here.

const data = [
  {
    title: "🤖 AI 플랫폼",
    tag: "모델·엔터프라이즈 SW",
    stocks: [
      { tk:"MSFT", nm:"Microsoft", rs:"4/29 장후 Q1 FY26 매출 $77.7B +18% EPS $4.13 비트·Azure $21.5B +38% CC 용량 한계로 +40% 잠재·OpenAI 지분 손실 -$0.41 EPS·FY26 CapEx 증가율 FY25 초과 가속 가이던스·GAAP $3.72 +13%", r1:"282", p1:"101", r2:"325", p2:"118" },
      { tk:"GOOGL", nm:"Alphabet", rs:"4/29 장후 Q1 매출 $109.9B +22% 컨센 $107.1B 비트·EPS $5.11 vs 컨센 $2.62 압도·Cloud $20.03B +63% 백로그 $460B QoQ 두 배·CapEx $180~190B 상향·Pichai '컴퓨트 제약' 직접 언급", r1:"403", p1:"132", r2:"455", p2:"148" },
      { tk:"META", nm:"Meta", rs:"4/29 장후 Q1 매출 $56.31B +33% 컨센 $55.45B 비트·EPS $10.44(세제혜택 $8B 포함, 조정 $7.31)·영업이익률 41%·CapEx $125~145B 상향($115~135B에서)·Q2 $58~61B·DAP 3.56B 컨센 3.62B 미스·AH -6%", r1:"201", p1:"66", r2:"235", p2:"72" },
      { tk:"ORCL", nm:"Oracle", rs:"4/28 OpenAI 매출 미스 WSJ 보도로 -4% 급락·$300B 5년 컴퓨트 공급 계약 펀딩 우려 부각·Oracle '기술 채택 가속·신규 5.5 모델 모멘텀' 적극 방어·RPO $553B", r1:"57", p1:"12", r2:"68", p2:"15" },
      { tk:"PLTR", nm:"Palantir", rs:"카프 CEO 테크놀로지컬 리퍼블릭 22개조 선언·AI 억지력 독트린 공개·비판 여론 촉발·주가 $146 YTD -12%", r1:"4.5", p1:"0.6", r2:"7.2", p2:"1.5" },
      { tk:"CRM", nm:"Salesforce", rs:"Agentforce·Data Cloud", r1:"42", p1:"7.6", r2:"46", p2:"8.5" },
      { tk:"NOW", nm:"ServiceNow", rs:"Q1 매출 $3.77B +22%·EPS $0.97·중동 온프레 대형딜 -75bp 헤드윈드·4/23 -17.7% 폭락 YTD -33%·2026 구독매출 가이던스 $15.74~15.78B 상향", r1:"11", p1:"2.2", r2:"13", p2:"3.0" },
    ]
  },
  {
    title: "🔩 반도체",
    tag: "AI칩·파운드리·장비·메모리",
    stocks: [
      { tk:"NVDA", nm:"NVIDIA", rs:"4/29 GOOGL Cloud +63% 백로그 $460B·MSFT Azure +38% 용량 한계·META CapEx $125~145B 상향·AMZN AWS +28% 비트로 메가캡 4사 일제 AI 인프라 가속 재확인·OpenAI 매출 미스 우려 부분 상쇄·5/20 Q1 FY27 컨센 $78B·Rubin 풀프로덕션", r1:"216", p1:"117", r2:"337", p2:"192" },
      { tk:"AVGO", nm:"Broadcom", rs:"4/29 META CapEx 상향 + GOOGL TPU 8세대 8t/8i 수요 가속으로 4/28 OpenAI 미스發 -4% 일부 회복·MTIA·TPU 공동설계 백로그 $73B 견조", r1:"64", p1:"23", r2:"88", p2:"34" },
      { tk:"TSM", nm:"TSMC", rs:"Q1 $35.7B 확정·Q2 가이던스 $39~40.2B 상향·GM 65.5~67.5%·26년 USD +30%·CapEx 상단", r1:"117", p1:"55", r2:"153", p2:"70" },
      { tk:"ASML", nm:"ASML", rs:"Q1 €8.8B EPS €7.15 비트·수요>공급 지속·2026 €36~40B·EUV 독점", r1:"33", p1:"9", r2:"42", p2:"12" },
      { tk:"LRCX", nm:"Lam Research", rs:"HBM·NAND 장비", r1:"18", p1:"5", r2:"22", p2:"6.3" },
      { tk:"MU", nm:"Micron", rs:"Q1 FY26 $13.6B 사상 최대·HBM4 2Q 램프·26년 전량 완판", r1:"37", p1:"8", r2:"79", p2:"23" },
      { tk:"AMD", nm:"AMD", rs:"4/28 OpenAI 매출 미스 보도로 -3% 조정·전주 +12% 후 차익실현·Stifel 목표가 $320 유지·5/6 Q1 실적 발표 컨센 매출 $7.1B 점검대", r1:"26", p1:"3.5", r2:"34", p2:"5.5" },
    ]
  },
  {
    title: "🏢 데이터센터",
    tag: "REIT·서버·네트워킹·GPU클라우드",
    stocks: [
      { tk:"DLR", nm:"Digital Realty", rs:"글로벌 DC REIT", r1:"5.8", p1:"0.6", r2:"6.4", p2:"0.8" },
      { tk:"EQIX", nm:"Equinix", rs:"상호접속 허브", r1:"9.1", p1:"1.0", r2:"9.9", p2:"1.2" },
      { tk:"ANET", nm:"Arista", rs:"AI 클러스터 스위칭·2026 성장 25% 가이던스 상향", r1:"9.0", p1:"3.5", r2:"11", p2:"4.2" },
      { tk:"DELL", nm:"Dell Tech", rs:"AI 서버 ISG", r1:"102", p1:"5.0", r2:"115", p2:"6.2" },
      { tk:"CRWV", nm:"CoreWeave", rs:"GPU 클라우드·NVIDIA 2대주주 투자·Dell 파트너 확장", r1:"5.1", p1:"-1.2", r2:"12.5", p2:"-0.5" },
      { tk:"CSCO", nm:"Cisco", rs:"AI 네트워킹·보안", r1:"54", p1:"11", r2:"58", p2:"12.5" },
      { tk:"HPE", nm:"HP Enterprise", rs:"AI 서버·GreenLake 하이브리드", r1:"33", p1:"2.0", r2:"38", p2:"2.5" },
    ]
  },
  {
    title: "❄️ 냉각 시스템",
    tag: "액체냉각·HVAC",
    stocks: [
      { tk:"VRT", nm:"Vertiv", rs:"액냉·전력관리 백로그 $15B", r1:"10.2", p1:"1.5", r2:"13.5", p2:"2.3" },
      { tk:"MOD", nm:"Modine", rs:"DC 냉각 CIS", r1:"2.6", p1:"0.18", r2:"3.0", p2:"0.23" },
      { tk:"TT", nm:"Trane Tech", rs:"HVAC 열관리 리더", r1:"21", p1:"2.9", r2:"23", p2:"3.3" },
      { tk:"JCI", nm:"Johnson Controls", rs:"빌딩·DC HVAC", r1:"23", p1:"2.0", r2:"24", p2:"2.3" },
      { tk:"CARR", nm:"Carrier", rs:"열관리·히트펌프", r1:"22", p1:"2.4", r2:"24", p2:"2.8" },
      { tk:"LII", nm:"Lennox Intl", rs:"상업 HVAC", r1:"5.6", p1:"0.78", r2:"6.0", p2:"0.88" },
      { tk:"GNRC", nm:"Generac", rs:"발전기·에너지 스토리지·DC백업", r1:"4.0", p1:"0.35", r2:"4.5", p2:"0.45" },
    ]
  },
  {
    title: "💧 물·수자원",
    tag: "DC 냉각수 수요",
    stocks: [
      { tk:"XYL", nm:"Xylem", rs:"수처리·펌프 1위", r1:"8.9", p1:"0.95", r2:"9.5", p2:"1.1" },
      { tk:"AWK", nm:"American Water", rs:"최대 상수도 유틸", r1:"4.7", p1:"1.1", r2:"5.0", p2:"1.2" },
      { tk:"ECL", nm:"Ecolab", rs:"DC 물관리 솔루션", r1:"16", p1:"2.1", r2:"17", p2:"2.4" },
      { tk:"WTS", nm:"Watts Water", rs:"배관·유량제어", r1:"2.2", p1:"0.27", r2:"2.3", p2:"0.30" },
      { tk:"ROP", nm:"Roper Tech", rs:"Neptune 수도계량", r1:"7.4", p1:"1.6", r2:"8.0", p2:"1.8" },
      { tk:"PNR", nm:"Pentair", rs:"수처리·수영장", r1:"4.2", p1:"0.65", r2:"4.4", p2:"0.72" },
      { tk:"WTRG", nm:"Essential Utilities", rs:"수도·가스 유틸리티", r1:"1.8", p1:"0.30", r2:"1.9", p2:"0.32" },
    ]
  },
  {
    title: "⚡ 전력·그리드",
    tag: "발전설비·송배전",
    stocks: [
      { tk:"GEV", nm:"GE Vernova", rs:"Q1 매출 $9.34B·조정 EBITDA $896M +96%·백로그 $163B·DC 주문 Q1만 $2.4B 2025 전년 초과·2026 가이던스 매출 $44.5~45.5B·FCF $6.5~7.5B 상향·프리장 +8%", r1:"38", p1:"2.4", r2:"45", p2:"4.2" },
      { tk:"ETN", nm:"Eaton", rs:"전력관리 DC", r1:"27", p1:"4.2", r2:"29", p2:"4.8" },
      { tk:"PWR", nm:"Quanta Svcs", rs:"송전망 시공 1위", r1:"26", p1:"1.3", r2:"29", p2:"1.6" },
      { tk:"HUBB", nm:"Hubbell", rs:"전력 유틸 장비", r1:"5.9", p1:"0.85", r2:"6.3", p2:"0.95" },
      { tk:"NEE", nm:"NextEra", rs:"재생+원전 최대 유틸", r1:"27", p1:"7.5", r2:"29", p2:"8.2" },
      { tk:"PH", nm:"Parker Hannifin", rs:"전력·산업 모션", r1:"20", p1:"3.2", r2:"21", p2:"3.6" },
      { tk:"AME", nm:"AMETEK", rs:"전자계측·전력 장비", r1:"7.0", p1:"1.5", r2:"7.5", p2:"1.7" },
    ]
  },
  {
    title: "☢️ 원자력·SMR",
    tag: "가동원전·연료·차세대",
    stocks: [
      { tk:"CEG", nm:"Constellation", rs:"Calpine 통합·AI PPA", r1:"27", p1:"2.9", r2:"30", p2:"3.5" },
      { tk:"VST", nm:"Vistra", rs:"Meta 2.6GW PPA·Comanche Peak 1.2GW·원전+가스", r1:"18", p1:"2.6", r2:"20", p2:"3.0" },
      { tk:"BWXT", nm:"BWX Tech", rs:"해군원자로·SMR 연료", r1:"2.9", p1:"0.33", r2:"3.2", p2:"0.38" },
      { tk:"LEU", nm:"Centrus", rs:"HALEU 농축", r1:"0.45", p1:"0.05", r2:"0.55", p2:"0.07" },
      { tk:"OKLO", nm:"Oklo", rs:"고속로 SMR", r1:"0.0", p1:"-0.08", r2:"0.05", p2:"-0.10" },
      { tk:"CCJ", nm:"Cameco", rs:"우라늄 채굴 메이저", r1:"3.2", p1:"0.45", r2:"3.8", p2:"0.60" },
      { tk:"TLN", nm:"Talen Energy", rs:"원전+가스 발전·DC PPA", r1:"4.5", p1:"0.8", r2:"5.0", p2:"1.0" },
    ]
  },
  {
    title: "🧬 바이오·헬스케어",
    tag: "GLP-1·종양·로봇수술",
    stocks: [
      { tk:"LLY", nm:"Eli Lilly", rs:"4/30 Q1 매출 $19.8B +56% 컨센 $17.62B 압도·EPS $8.55 컨센 $6.66 압도·Mounjaro $8.7B +125%·Zepbound $4.2B +80%·해외 매출 +81%·FY26 가이던스 매출 $82~85B·EPS $35.50~37.00 상향·Foundayo FDA 비만 적응증 승인", r1:"82", p1:"30", r2:"85", p2:"36" },
      { tk:"NVO", nm:"Novo Nordisk", rs:"OpenAI 전사 AI 파트너십·Wegovy 경구제·2026 매출 -5~-13% 가이던스", r1:"47", p1:"15", r2:"43", p2:"13" },
      { tk:"ISRG", nm:"Intuitive Surgical", rs:"da Vinci 로봇수술", r1:"8.8", p1:"2.6", r2:"10", p2:"3.0" },
      { tk:"VRTX", nm:"Vertex Pharma", rs:"낭포성섬유증·통증", r1:"11", p1:"4.0", r2:"12.5", p2:"4.6" },
      { tk:"REGN", nm:"Regeneron", rs:"Eylea·종양", r1:"14", p1:"4.2", r2:"15", p2:"4.7" },
      { tk:"MRK", nm:"Merck", rs:"4/30 Q1 매출 $16.29B +5% 컨센 상회·Keytruda $8.03B +12% 견조·Cidara 인수 차지로 GAAP EPS -$1.28·FY26 EPS 가이던스 $5.04~5.16 소폭 상향·동물의약 +13%·주가 +4.6%", r1:"66", p1:"19", r2:"68", p2:"20" },
      { tk:"ABBV", nm:"AbbVie", rs:"Skyrizi·Rinvoq 면역·종양", r1:"56", p1:"8", r2:"62", p2:"11" },
    ]
  },
  {
    title: "🛢️ 에너지",
    tag: "석유메이저·LNG·유전서비스",
    stocks: [
      { tk:"XOM", nm:"ExxonMobil", rs:"5/1 Q1 매출 $85.14B 컨센 $81.24B 상회·조정 EPS $1.16 컨센 $1.20 미세 미스·GAAP EPS $1.00·순익 $4.2B vs $7.7B(-45%)·일회성 별도 시 $8.8B/EPS $2.09·Permian·Guyana 생산 가속·자사주 환원 유지", r1:"332", p1:"29", r2:"345", p2:"32" },
      { tk:"CVX", nm:"Chevron", rs:"5/1 Q1 조정 EPS $1.41 컨센 $0.97 +45% 압도(2020.10 이후 최대 상회폭)·매출 $48.61B 컨센 $51.39B 미스·순익 $2.2B vs $3.5B(-36%)·업스트림 $3.9B +4% Hess 통합 생산 +15%·차기 분기 자체 회복 가이던스", r1:"189", p1:"12", r2:"195", p2:"14" },
      { tk:"LNG", nm:"Cheniere", rs:"미 최대 LNG 수출·Brent 7월 $108.17 -2%·WTI $101.94 -3% 디에스컬레이션 후퇴·이란 평화안 파키스탄 중재 전달·트럼프 '불만족'·호르무즈 통항 정상의 5~8% 잔존으로 유럽·아시아 프리미엄 분기 추가 연장", r1:"16", p1:"3.5", r2:"18", p2:"4.2" },
      { tk:"SLB", nm:"Schlumberger", rs:"Q1 매출 $8.72B 컨센 $8.65B 상회·EPS $0.52 컨센 부합·EBITDA 마진 -346bp·중동 디스럽션 $200M 초과", r1:"37", p1:"4.5", r2:"39", p2:"5.0" },
      { tk:"COP", nm:"ConocoPhillips", rs:"4/30 장후 Q1 EPS $1.89 컨센 $1.62 상회·매출 $16.05B 컨센 상회·FCF $2.4B·생산 2.31M boe/d·자사주+배당 $2B 환원·Willow 프로젝트 50% 진척·Brent 장중 $126 4년 최고 후 -3% $114 종가", r1:"60", p1:"11", r2:"64", p2:"12" },
      { tk:"KMI", nm:"Kinder Morgan", rs:"가스 파이프라인", r1:"16", p1:"2.7", r2:"17", p2:"3.0" },
      { tk:"EOG", nm:"EOG Resources", rs:"셰일 E&P 고효율", r1:"23", p1:"5.5", r2:"24", p2:"5.8" },
    ]
  },
  {
    title: "🌱 친환경·청정기술",
    tag: "태양광·리튬·수소·산업가스",
    stocks: [
      { tk:"FSLR", nm:"First Solar", rs:"미 박막 태양광", r1:"4.8", p1:"1.3", r2:"5.8", p2:"1.7" },
      { tk:"ENPH", nm:"Enphase", rs:"마이크로인버터", r1:"1.5", p1:"0.2", r2:"1.9", p2:"0.3" },
      { tk:"ALB", nm:"Albemarle", rs:"리튬 글로벌 1위", r1:"5.5", p1:"0.2", r2:"6.2", p2:"0.5" },
      { tk:"BE", nm:"Bloom Energy", rs:"고체산화물 연료전지·DC 전력", r1:"2.0", p1:"0.05", r2:"3.2", p2:"0.20" },
      { tk:"LIN", nm:"Linde", rs:"산업가스·수소 1위", r1:"34", p1:"7.0", r2:"36", p2:"7.7" },
      { tk:"APD", nm:"Air Products", rs:"수소·산업가스", r1:"12.5", p1:"2.6", r2:"13.2", p2:"2.9" },
      { tk:"RUN", nm:"Sunrun", rs:"주택용 태양광·ESS 1위", r1:"1.9", p1:"-0.1", r2:"2.2", p2:"0.05" },
    ]
  },
  {
    title: "🚗 자동차·모빌리티",
    tag: "EV·레거시·자율주행",
    stocks: [
      { tk:"TSLA", nm:"Tesla", rs:"Q1 2026 컨콜에서 Cybercab Giga Texas 양산 공식 개시 확인·NHTSA 2,500대 자율차 연 한도 적용 면제·Musk 무인 FSD 고객 전개 'Q4 추정'·실질 매출은 2027년 이후·6월 자체 라이드헤일링 런치 목표 유지", r1:"95", p1:"3.8", r2:"109", p2:"7.2" },
      { tk:"TM", nm:"Toyota", rs:"하이브리드 강자", r1:"305", p1:"28", r2:"315", p2:"30" },
      { tk:"GM", nm:"General Motors", rs:"4/28 장전 Q1 매출 $44.02B 컨센 $43.03B 비트·EPS $2.78 컨센 $2.72 비트·트럼프 관세 협상 진행으로 풀해 가이던스 신뢰 철회·자사주 매입 일시 중단·$2B ASR Q2 마무리·컨콜 4/30로 연기", r1:"185", p1:"10", r2:"190", p2:"11" },
      { tk:"RIVN", nm:"Rivian", rs:"R2 양산 개시·VW JV", r1:"4.5", p1:"-3.6", r2:"6.9", p2:"-1.9" },
      { tk:"MBLY", nm:"Mobileye", rs:"ADAS·자율주행 칩", r1:"1.8", p1:"0.2", r2:"2.1", p2:"0.3" },
      { tk:"UBER", nm:"Uber", rs:"라이드·배송·로보택시", r1:"47", p1:"5.5", r2:"54", p2:"7.0" },
      { tk:"F", nm:"Ford", rs:"F-150·EV 전환·상용차", r1:"176", p1:"5.0", r2:"180", p2:"5.5" },
    ]
  },
  {
    title: "✈️ 항공우주·방산",
    tag: "전투기·미사일·우주·위성",
    stocks: [
      { tk:"LMT", nm:"Lockheed Martin", rs:"Q1 EPS $6.44 컨센 $6.77 미스·매출 $18.0B 컨센 $18.4B 미스·FCF -$291M 음전환·풀해 매출 $80B·FCF $6.8B 가이던스 재확인·주가 -6.3%", r1:"72", p1:"6.5", r2:"75", p2:"7.0" },
      { tk:"RTX", nm:"RTX Corp", rs:"Q1 EPS $1.78 비트(+21% YoY)·매출 $22.1B +9%·Raytheon 섹그 +10%·가이던스 EPS $6.70~6.90 상향·FCF $1.9B", r1:"82", p1:"6.5", r2:"88", p2:"7.5" },
      { tk:"NOC", nm:"Northrop Grumman", rs:"B-21·전략무기", r1:"42", p1:"4.0", r2:"44", p2:"4.3" },
      { tk:"GD", nm:"General Dynamics", rs:"잠수함·Gulfstream", r1:"49", p1:"4.2", r2:"52", p2:"4.6" },
      { tk:"BA", nm:"Boeing", rs:"Q1 매출 $22.22B·EPS -$0.20 대폭 비트·상업기 143대 2019 이후 최대·총 백로그 $695B 사상 최고·풀해 FCF $1~3B 가이던스·737 월 47대 여름 증산·MAX7/10 연말 인증", r1:"89.5", p1:"2.2", r2:"80", p2:"3.5" },
      { tk:"RKLB", nm:"Rocket Lab", rs:"Neutron 4Q26 재지연·$816M SDA 수주·국방 프라임 전환", r1:"0.60", p1:"-0.15", r2:"0.90", p2:"-0.08" },
      { tk:"LHX", nm:"L3Harris", rs:"전자전·ISR·위성통신", r1:"21", p1:"2.0", r2:"23", p2:"2.3" },
    ]
  },
  {
    title: "⚛️ 양자·크립토",
    tag: "고변동 테마 (양자3+크립토3)",
    stocks: [
      { tk:"IONQ", nm:"IonQ", rs:"DARPA HARQ 수주·광자 얽힘 상용 최초 실증·주간 +50%·SkyWater $1.8B 인수 진행", r1:"0.05", p1:"-0.30", r2:"0.12", p2:"-0.35" },
      { tk:"RGTI", nm:"Rigetti", rs:"초전도 양자", r1:"0.012", p1:"-0.08", r2:"0.025", p2:"-0.10" },
      { tk:"QBTS", nm:"D-Wave", rs:"어닐링 양자", r1:"0.015", p1:"-0.07", r2:"0.030", p2:"-0.08" },
      { tk:"COIN", nm:"Coinbase", rs:"미 최대 거래소", r1:"7.5", p1:"2.3", r2:"9.0", p2:"2.9" },
      { tk:"MSTR", nm:"Strategy", rs:"BTC 5/1 $76,247 -1.2% 4월 +13% 후 횡보·100EMA $75,623 / 200EMA $82,228 사이 박스권·Fear&Greed 26 공포·총 818,334 BTC 평단 $75,537 평가익 축소·세일러 1M BTC 목표 유지", r1:"0.5", p1:"-0.2", r2:"0.55", p2:"-0.15" },
      { tk:"MARA", nm:"Marathon Digital", rs:"BTC 채굴", r1:"0.75", p1:"0.10", r2:"1.0", p2:"0.20" },
      { tk:"RIOT", nm:"Riot Platforms", rs:"BTC 채굴·인프라", r1:"0.35", p1:"0.05", r2:"0.50", p2:"0.10" },
    ]
  },
  {
    title: "🔒 사이버보안",
    tag: "AI 시대 필수 인프라",
    stocks: [
      { tk:"CRWD", nm:"CrowdStrike", rs:"Falcon 플랫폼·ARR 41% CAGR", r1:"4.8", p1:"0.65", r2:"5.8", p2:"1.1" },
      { tk:"PANW", nm:"Palo Alto", rs:"CyberArk $25B 인수 2/11 완료·ID 시큐리티 통합", r1:"9.1", p1:"1.6", r2:"11", p2:"2.0" },
      { tk:"ZS", nm:"Zscaler", rs:"제로트러스트 클라우드", r1:"2.6", p1:"0.25", r2:"3.2", p2:"0.38" },
      { tk:"FTNT", nm:"Fortinet", rs:"통합 보안 어플라이언스", r1:"6.0", p1:"1.75", r2:"6.7", p2:"2.0" },
      { tk:"NET", nm:"Cloudflare", rs:"엣지 네트워크·보안", r1:"1.9", p1:"0.15", r2:"2.4", p2:"0.25" },
      { tk:"S", nm:"SentinelOne", rs:"AI 기반 EDR", r1:"0.85", p1:"-0.10", r2:"1.05", p2:"0.02" },
      { tk:"OKTA", nm:"Okta", rs:"ID 보안·제로트러스트", r1:"2.7", p1:"0.20", r2:"3.2", p2:"0.35" },
    ]
  },
  {
    title: "💳 핀테크·결제",
    tag: "소비·금리 사이클 수혜",
    stocks: [
      { tk:"V", nm:"Visa", rs:"4/28 장후 Q2 FY26 매출 $11.23B 컨센 $10.96B 비트·조정 EPS $3.31 컨센 $3.09 비트·결제량 +9%·크로스보더 +12%·신규 $20B 자사주 매입 승인", r1:"40", p1:"20", r2:"43", p2:"22" },
      { tk:"MA", nm:"Mastercard", rs:"4/30 Q1 매출 $8.4B +16% 컨센 상회·EPS $4.60 컨센 $4.41 상회·크로스보더 거래량 +13%·결제처리 +9%·VAS +22%·자사주 매입 $4B 집행", r1:"34", p1:"16", r2:"38", p2:"18" },
      { tk:"AXP", nm:"American Express", rs:"프리미엄 카드 플랫폼", r1:"68", p1:"10.5", r2:"74", p2:"11.8" },
      { tk:"PYPL", nm:"PayPal", rs:"온라인 결제·턴어라운드", r1:"32", p1:"4.5", r2:"34", p2:"5.0" },
      { tk:"XYZ", nm:"Block", rs:"Square·Cash App", r1:"25", p1:"1.5", r2:"28", p2:"2.2" },
      { tk:"FI", nm:"Fiserv", rs:"가맹점 결제 인프라", r1:"21", p1:"3.8", r2:"22.5", p2:"4.3" },
      { tk:"GPN", nm:"Global Payments", rs:"가맹점 결제 솔루션", r1:"10", p1:"1.8", r2:"10.5", p2:"2.0" },
    ]
  },
  {
    title: "🏦 금융·은행",
    tag: "규제완화·M&A 부활 테마",
    stocks: [
      { tk:"JPM", nm:"JPMorgan", rs:"Q1 매출 50.5B·순익 16.5B·트레이딩 11.6B 사상 최고", r1:"186", p1:"57", r2:"193", p2:"58" },
      { tk:"GS", nm:"Goldman Sachs", rs:"Q1 EPS $17.55·주식트레이딩 $5.33B 사상 최고·IB +48%", r1:"55", p1:"14", r2:"63", p2:"18" },
      { tk:"MS", nm:"Morgan Stanley", rs:"Q1 고객자산 $9T 돌파·$10T 목표·WM 유입 강세", r1:"62", p1:"13", r2:"70", p2:"16" },
      { tk:"BAC", nm:"Bank of America", rs:"Q1 매출 30.3B +7%·EPS $1.11 +25%·NII $15.7B +9%", r1:"105", p1:"28", r2:"113", p2:"33" },
      { tk:"SCHW", nm:"Charles Schwab", rs:"Q1 EPS $1.43 기록·매출 $6.5B +16%·고객자산 $11.8T·일평균 990만 트레이드", r1:"21", p1:"7.0", r2:"23", p2:"8.0" },
      { tk:"BLK", nm:"BlackRock", rs:"Q1 AUM $13.9T·iShares 순유입 $132B 기록", r1:"21", p1:"6.8", r2:"23", p2:"7.6" },
      { tk:"WFC", nm:"Wells Fargo", rs:"Q1 매출 21.5B·EPS 1.60 비트·대출 +11%·ROE 12.2%", r1:"83", p1:"19", r2:"88", p2:"22" },
    ]
  },
  {
    title: "🤖 로봇·자동화",
    tag: "AI 피지컬 확장",
    stocks: [
      { tk:"ABB", nm:"ABB Ltd", rs:"산업 로봇·전동화", r1:"33", p1:"4.2", r2:"35", p2:"4.7" },
      { tk:"ROK", nm:"Rockwell Auto", rs:"공장 자동화 1위", r1:"8.3", p1:"1.1", r2:"8.8", p2:"1.3" },
      { tk:"EMR", nm:"Emerson Elec", rs:"프로세스 자동화", r1:"17.5", p1:"3.0", r2:"18.5", p2:"3.3" },
      { tk:"CGNX", nm:"Cognex", rs:"머신비전 팩토리 자동화 1위", r1:"1.07", p1:"0.17", r2:"1.17", p2:"0.22" },
      { tk:"TER", nm:"Teradyne", rs:"반도체 테스트·협동로봇", r1:"3.0", p1:"0.55", r2:"3.4", p2:"0.70" },
      { tk:"ZBRA", nm:"Zebra Tech", rs:"물류 스캐너·로봇", r1:"5.0", p1:"0.55", r2:"5.4", p2:"0.70" },
      { tk:"PATH", nm:"UiPath", rs:"RPA·AI 자동화 플랫폼", r1:"1.5", p1:"0.10", r2:"1.8", p2:"0.18" },
    ]
  },
  {
    title: "🛒 소비·리테일",
    tag: "방어+성장 혼합",
    stocks: [
      { tk:"AMZN", nm:"Amazon", rs:"4/29 장후 Q1 매출 $181.5B +17%·AWS $37.59B +28% 3년 만 최고 성장률 컨센 +26% 비트·AWS 영업익 $14.2B·EPS $2.78·Q2 가이던스 $194~199B +16~19%·연간 CapEx $200B 유지·이커머스 견조", r1:"717", p1:"78", r2:"800", p2:"95" },
      { tk:"WMT", nm:"Walmart", rs:"최대 오프라인 리테일", r1:"681", p1:"19.4", r2:"725", p2:"21" },
      { tk:"COST", nm:"Costco", rs:"회원제 창고형 1위", r1:"270", p1:"8.1", r2:"295", p2:"8.8" },
      { tk:"HD", nm:"Home Depot", rs:"홈 리모델링 1위", r1:"160", p1:"15.5", r2:"166", p2:"16.5" },
      { tk:"CMG", nm:"Chipotle", rs:"QSR 고성장", r1:"11.5", p1:"1.7", r2:"13", p2:"2.0" },
      { tk:"LULU", nm:"Lululemon", rs:"프리미엄 애슬레저·2026 가이던스 하향·Texas 조사 악재", r1:"11", p1:"1.8", r2:"11.8", p2:"2.0" },
      { tk:"SBUX", nm:"Starbucks", rs:"Q2 매출 $9.53B 사상 최대·EPS $0.50 컨센 $0.42 상회·순익 +33% YoY·글로벌 동일점포 +6.2% 컨센 +4% 상회·미국 +7.1% 트래픽 2분기 연속 양전환·FY26 SSS 가이던스 5%로 상향(기존 3%)·EPS $2.25~2.45·프리장 +5%", r1:"36", p1:"3.5", r2:"38", p2:"4.0" },
    ]
  },
];