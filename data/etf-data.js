// Global ETF Atlas - data source
// 글로벌 테마별 대표 ETF. index.html 자동 렌더링.

const data = [
  {
    title: "🤖 AI·반도체",
    tag: "인공지능·칩·데이터센터",
    stocks: [
      { tk:"SMH", nm:"VanEck Semiconductor", rs:"반도체 25종·MVIS·AUM $52B·AI 최대 수혜", aum:"52", er:"0.35%", ytd:"+25%", y1:"+120%" },
      { tk:"SOXX", nm:"iShares Semiconductor", rs:"반도체 30종·ICE 지수", aum:"20.6", er:"0.34%", ytd:"+33%", y1:"+100%" },
      { tk:"BOTZ", nm:"Global X Robotics & AI", rs:"로봇·AI 자동화", aum:"3.56", er:"0.68%", ytd:"+15%", y1:"+32%" },
      { tk:"AIQ", nm:"Global X AI & Tech", rs:"AI·빅데이터·클라우드·AUM $7.9B 확대", aum:"7.86", er:"0.68%", ytd:"+15%", y1:"+30%" },
      { tk:"QTUM", nm:"Defiance Quantum", rs:"양자컴퓨팅·머신러닝·AUM 3배 증가", aum:"3.7", er:"0.40%", ytd:"+6%", y1:"+70%" },
      { tk:"IGV", nm:"iShares Tech-Software", rs:"AI 대체 압박 미 대형 소프트웨어 종합·iShares", aum:"10.7", er:"0.39%", ytd:"-26%", y1:"-15%" },
      { tk:"WCLD", nm:"WisdomTree Cloud", rs:"신흥 클라우드 SaaS 순수 테마·BVP 나스닥", aum:"0.38", er:"0.45%", ytd:"-19%", y1:"-16%" },
    ]
  },
  {
    title: "🛡️ 방산·보안",
    tag: "방위산업·사이버보안",
    stocks: [
      { tk:"ITA", nm:"iShares US Aerospace", rs:"미국 방산·항공우주", aum:"16", er:"0.40%", ytd:"+5%", y1:"+45%" },
      { tk:"PPA", nm:"Invesco Aerospace", rs:"방산·항공우주 확장", aum:"6.5", er:"0.58%", ytd:"+14%", y1:"+26%" },
      { tk:"XAR", nm:"SPDR S&P Aerospace", rs:"S&P 방산·항공·AUM 3배 확대", aum:"5.7", er:"0.35%", ytd:"+13%", y1:"+40%" },
      { tk:"CIBR", nm:"First Trust Cybersecurity", rs:"사이버보안 순수 테마", aum:"7", er:"0.60%", ytd:"+17%", y1:"+32%" },
      { tk:"HACK", nm:"ETFMG Prime Cyber", rs:"사이버보안·정보보호", aum:"2.5", er:"0.60%", ytd:"0%", y1:"+8%" },
      { tk:"SHLD", nm:"Global X Defense Tech", rs:"AI·사이버·첨단 방산 기술·2026 대표주", aum:"8.7", er:"0.50%", ytd:"+19%", y1:"+75%" },
      { tk:"PAVE", nm:"Global X Infrastructure", rs:"미 인프라 재건·건설·엔지니어링·소재", aum:"12.4", er:"0.47%", ytd:"+4%", y1:"+12%" },
    ]
  },
  {
    title: "⚡ 에너지·원자력",
    tag: "석유·가스·우라늄",
    stocks: [
      { tk:"XLE", nm:"Energy Select SPDR", rs:"Brent $106 돌파·주간 +18% 급등·WTI $97·Jones Act 90일 연장에도 호르무즈 봉쇄 지속·XOM·CVX·COP 마진 확대 연장", aum:"38", er:"0.09%", ytd:"+28%", y1:"+18%" },
      { tk:"URA", nm:"Global X Uranium", rs:"우라늄·원전 생태계·연초 조정 국면", aum:"4", er:"0.69%", ytd:"+6%", y1:"+30%" },
      { tk:"NLR", nm:"VanEck Uranium+Nuclear", rs:"원자력 밸류체인", aum:"1.5", er:"0.60%", ytd:"+22%", y1:"+35%" },
      { tk:"AMLP", nm:"Alerian MLP", rs:"MLP 파이프라인·배당", aum:"10", er:"0.85%", ytd:"+12%", y1:"+20%" },
      { tk:"XOP", nm:"SPDR Oil & Gas E&P", rs:"석유·가스 탐사·생산·호르무즈 재봉쇄로 재반등 구도 복귀", aum:"5", er:"0.35%", ytd:"+30%", y1:"+18%" },
      { tk:"VDE", nm:"Vanguard Energy", rs:"Vanguard 에너지 광역 저보수·엑슨·쉐브론·호르무즈 재점화로 재평가", aum:"13.2", er:"0.09%", ytd:"+22%", y1:"+18%" },
      { tk:"IEO", nm:"iShares US Oil & Gas E&P", rs:"미 석유·가스 탐사·생산 순수·iShares", aum:"0.60", er:"0.38%", ytd:"+6%", y1:"+10%" },
    ]
  },
  {
    title: "🌱 클린에너지",
    tag: "태양광·풍력·리튬·수소",
    stocks: [
      { tk:"ICLN", nm:"iShares Global Clean", rs:"글로벌 클린에너지·정책 모멘텀 약화", aum:"2.1", er:"0.40%", ytd:"+6%", y1:"+10%" },
      { tk:"TAN", nm:"Invesco Solar", rs:"태양광 순수 테마·관세·보조금 축소 부담", aum:"2", er:"0.67%", ytd:"-1%", y1:"+8%" },
      { tk:"QCLN", nm:"First Trust Nasdaq Clean", rs:"나스닥 클린에너지", aum:"1.5", er:"0.58%", ytd:"+35%", y1:"+25%" },
      { tk:"LIT", nm:"Global X Lithium & Battery", rs:"리튬·배터리 밸류체인", aum:"4", er:"0.75%", ytd:"+10%", y1:"+18%" },
      { tk:"PBW", nm:"Invesco WilderHill Clean", rs:"와일더힐 청정에너지", aum:"0.8", er:"0.62%", ytd:"+20%", y1:"+15%" },
      { tk:"FAN", nm:"First Trust Wind Energy", rs:"글로벌 풍력 발전 순수 테마·First Trust", aum:"0.26", er:"0.60%", ytd:"+15%", y1:"+78%" },
      { tk:"HYDR", nm:"Global X Hydrogen", rs:"수소 경제 밸류체인 전반·Global X 고성장", aum:"0.063", er:"0.50%", ytd:"+57%", y1:"+110%" },
    ]
  },
  {
    title: "₿ 크립토·블록체인",
    tag: "비트코인·이더리움·디파이",
    stocks: [
      { tk:"IBIT", nm:"iShares Bitcoin Trust", rs:"BTC $79K 부근 반등·리스크온 재개에 MSTR 5일 +25%·글로벌 크립토 펀드 주간 $1.4B 유입·$80K 재돌파 근접", aum:"58", er:"0.25%", ytd:"+4%", y1:"-12%" },
      { tk:"FBTC", nm:"Fidelity Wise Origin BTC", rs:"비트코인 현물·피델리티·AUM $18B", aum:"18", er:"0.25%", ytd:"+2%", y1:"-14%" },
      { tk:"ETHA", nm:"iShares Ethereum Trust", rs:"이더리움 현물·4/14 +7%", aum:"10", er:"0.25%", ytd:"-12%", y1:"-8%" },
      { tk:"BITO", nm:"ProShares Bitcoin Strategy", rs:"비트코인 선물 최초", aum:"3", er:"0.95%", ytd:"-18%", y1:"-18%" },
      { tk:"BLOK", nm:"Amplify Blockchain", rs:"블록체인 기업 테마", aum:"1.5", er:"0.71%", ytd:"-10%", y1:"-5%" },
      { tk:"BITW", nm:"Bitwise 10 Crypto Index", rs:"시총 상위 10 암호화폐 분산·월별 리밸런싱", aum:"0.68", er:"0.75%", ytd:"-24%", y1:"0%" },
      { tk:"DAPP", nm:"VanEck Digital Transformation", rs:"디지털 자산 생태계 기업 테마·VanEck", aum:"0.10", er:"0.50%", ytd:"-3%", y1:"-10%" },
    ]
  },
  {
    title: "🇺🇸 미국 대형주",
    tag: "S&P500·나스닥·소형주",
    stocks: [
      { tk:"SPY", nm:"SPDR S&P 500", rs:"4/24 S&P 500 7,165.08 +0.80% 기록 신고가·INTC +23.6% 사상 최고·반도체 18일 연속 상승·SLB Q1 매출 비트·4/29 GOOGL 대기", aum:"590", er:"0.09%", ytd:"+3%", y1:"+16%" },
      { tk:"QQQ", nm:"Invesco QQQ Trust", rs:"4/24 Nasdaq 24,836.60 +1.63% 기록 신고가·NVDA 시총 $5T 재탈환·AMD +12% Stifel $320·Alphabet Anthropic $40B 투자 공식화", aum:"400", er:"0.20%", ytd:"+9%", y1:"+24%" },
      { tk:"VOO", nm:"Vanguard S&P 500", rs:"세계 최대 ETF·AUM $827B·최저 보수", aum:"827", er:"0.03%", ytd:"+2%", y1:"+15%" },
      { tk:"VTI", nm:"Vanguard Total Stock", rs:"미국 전체 시장·4월 신고가 랠리", aum:"420", er:"0.03%", ytd:"+2%", y1:"+14%" },
      { tk:"DIA", nm:"SPDR Dow Jones", rs:"다우 30 우량주·다우 부진", aum:"35", er:"0.16%", ytd:"-3%", y1:"+10%" },
      { tk:"RSP", nm:"Invesco S&P 500 Equal Weight", rs:"S&P 500 등가중·빅테크 집중 리스크 분산", aum:"83", er:"0.20%", ytd:"+5%", y1:"+11%" },
      { tk:"IWM", nm:"iShares Russell 2000", rs:"미 소형주 2000종·4/17 신고점 이후 호르무즈 재봉쇄로 변동성 재점화", aum:"73", er:"0.19%", ytd:"+10%", y1:"+45%" },
    ]
  },
  {
    title: "💰 배당·인컴",
    tag: "고배당·커버드콜·배당귀족",
    stocks: [
      { tk:"SCHD", nm:"Schwab US Dividend", rs:"배당 성장 전략·에너지 비중 수혜", aum:"65", er:"0.06%", ytd:"+11%", y1:"+14%" },
      { tk:"VYM", nm:"Vanguard High Dividend", rs:"고배당 대형주·AUM $89B", aum:"89", er:"0.06%", ytd:"+6%", y1:"+12%" },
      { tk:"JEPI", nm:"JPMorgan Equity Premium", rs:"커버드콜·월배당·AUM $44B", aum:"44", er:"0.35%", ytd:"+8%", y1:"+12%" },
      { tk:"JEPQ", nm:"JPMorgan Nasdaq Premium", rs:"나스닥 커버드콜", aum:"20", er:"0.35%", ytd:"+10%", y1:"+15%" },
      { tk:"DVY", nm:"iShares Select Dividend", rs:"배당 선별·유틸 비중", aum:"22", er:"0.38%", ytd:"+5%", y1:"+10%" },
      { tk:"NOBL", nm:"ProShares Dividend Aristocrats", rs:"25년 이상 배당 성장 166종·ProShares", aum:"11.4", er:"0.35%", ytd:"+4%", y1:"+9%" },
      { tk:"DGRO", nm:"iShares Core Dividend Growth", rs:"배당 성장 우량주 저보수 광역·iShares", aum:"39", er:"0.08%", ytd:"+13%", y1:"+27%" },
    ]
  },
  {
    title: "🌏 신흥국·글로벌",
    tag: "이머징·중국·한국·일본",
    stocks: [
      { tk:"VWO", nm:"Vanguard FTSE Emerging", rs:"신흥국 최대 저보수", aum:"116", er:"0.08%", ytd:"+8%", y1:"+15%" },
      { tk:"EEM", nm:"iShares MSCI Emerging", rs:"신흥국 MSCI 기준", aum:"25", er:"0.68%", ytd:"+7%", y1:"+14%" },
      { tk:"EWJ", nm:"iShares MSCI Japan", rs:"일본 MSCI", aum:"15", er:"0.50%", ytd:"+12%", y1:"+20%" },
      { tk:"INDA", nm:"iShares MSCI India", rs:"인도 시장", aum:"12", er:"0.64%", ytd:"+10%", y1:"+18%" },
      { tk:"VEA", nm:"Vanguard FTSE Developed", rs:"선진국(미국 제외)", aum:"130", er:"0.05%", ytd:"+9%", y1:"+16%" },
      { tk:"FXI", nm:"iShares China Large-Cap", rs:"중국 대형주 50종·H주·관세 변동성", aum:"5.8", er:"0.74%", ytd:"-12%", y1:"+15%" },
      { tk:"EWY", nm:"iShares MSCI South Korea", rs:"삼성전자 +3.22% 반등·SK하이닉스 장중 126.7만 사상 최고·KB증권 두산에너빌리티 목표가 14.8만 상향·Part 53 SMR 4/29 시행 기대", aum:"16", er:"0.59%", ytd:"+55%", y1:"+151%" },
    ]
  },
];
