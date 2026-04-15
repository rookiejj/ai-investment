// Global ETF Atlas - data source
// 글로벌 테마별 대표 ETF. index.html 자동 렌더링.

const data = [
  {
    title: "🤖 AI·반도체",
    tag: "인공지능·칩·데이터센터",
    stocks: [
      { tk:"SMH", nm:"VanEck Semiconductor", rs:"반도체 25종·MVIS·AUM $42B·AI 최대 수혜", aum:"42", er:"0.35%", ytd:"+22%", y1:"+45%" },
      { tk:"SOXX", nm:"iShares Semiconductor", rs:"반도체 30종·ICE 지수", aum:"22", er:"0.35%", ytd:"+28.5%", y1:"+46%" },
      { tk:"BOTZ", nm:"Global X Robotics & AI", rs:"로봇·AI 자동화", aum:"3.5", er:"0.68%", ytd:"+18%", y1:"+35%" },
      { tk:"AIQ", nm:"Global X AI & Tech", rs:"AI·빅데이터·클라우드", aum:"2.8", er:"0.68%", ytd:"+15%", y1:"+30%" },
      { tk:"QTUM", nm:"Defiance Quantum", rs:"양자컴퓨팅·머신러닝", aum:"1.2", er:"0.40%", ytd:"+12%", y1:"+25%" },
    ]
  },
  {
    title: "🛡️ 방산·보안",
    tag: "방위산업·사이버보안",
    stocks: [
      { tk:"ITA", nm:"iShares US Aerospace", rs:"미국 방산·항공우주", aum:"8", er:"0.40%", ytd:"+15%", y1:"+28%" },
      { tk:"PPA", nm:"Invesco Aerospace", rs:"방산·항공우주 확장", aum:"5", er:"0.58%", ytd:"+14%", y1:"+26%" },
      { tk:"XAR", nm:"SPDR S&P Aerospace", rs:"S&P 방산·항공", aum:"3", er:"0.35%", ytd:"+13%", y1:"+24%" },
      { tk:"CIBR", nm:"First Trust Cybersecurity", rs:"사이버보안 순수 테마", aum:"7", er:"0.60%", ytd:"+18%", y1:"+32%" },
      { tk:"HACK", nm:"ETFMG Prime Cyber", rs:"사이버보안·정보보호", aum:"2.5", er:"0.60%", ytd:"+16%", y1:"+28%" },
    ]
  },
  {
    title: "⚡ 에너지·원자력",
    tag: "석유·가스·우라늄",
    stocks: [
      { tk:"XLE", nm:"Energy Select SPDR", rs:"S&P 에너지 섹터", aum:"38", er:"0.09%", ytd:"+8%", y1:"+15%" },
      { tk:"URA", nm:"Global X Uranium", rs:"우라늄·원전 생태계", aum:"4", er:"0.69%", ytd:"+25%", y1:"+40%" },
      { tk:"NLR", nm:"VanEck Uranium+Nuclear", rs:"원자력 밸류체인", aum:"1.5", er:"0.60%", ytd:"+22%", y1:"+35%" },
      { tk:"AMLP", nm:"Alerian MLP", rs:"MLP 파이프라인·배당", aum:"10", er:"0.85%", ytd:"+10%", y1:"+20%" },
      { tk:"XOP", nm:"SPDR Oil & Gas E&P", rs:"석유·가스 탐사·생산", aum:"5", er:"0.35%", ytd:"+6%", y1:"+12%" },
    ]
  },
  {
    title: "🌱 클린에너지",
    tag: "태양광·리튬·수소",
    stocks: [
      { tk:"ICLN", nm:"iShares Global Clean", rs:"글로벌 클린에너지", aum:"3", er:"0.40%", ytd:"+5%", y1:"+10%" },
      { tk:"TAN", nm:"Invesco Solar", rs:"태양광 순수 테마", aum:"2", er:"0.67%", ytd:"+8%", y1:"+12%" },
      { tk:"QCLN", nm:"First Trust Nasdaq Clean", rs:"나스닥 클린에너지", aum:"1.5", er:"0.58%", ytd:"+7%", y1:"+14%" },
      { tk:"LIT", nm:"Global X Lithium & Battery", rs:"리튬·배터리 밸류체인", aum:"4", er:"0.75%", ytd:"+10%", y1:"+18%" },
      { tk:"PBW", nm:"Invesco WilderHill Clean", rs:"와일더힐 청정에너지", aum:"0.8", er:"0.62%", ytd:"+4%", y1:"+8%" },
    ]
  },
  {
    title: "₿ 크립토·블록체인",
    tag: "비트코인·이더리움·디파이",
    stocks: [
      { tk:"IBIT", nm:"iShares Bitcoin Trust", rs:"비트코인 현물 최대·Q1 AUM $54B·순유입 $8.4B·BTC 78.2만개 보유", aum:"54", er:"0.25%", ytd:"-22%", y1:"-18%" },
      { tk:"FBTC", nm:"Fidelity Wise Origin BTC", rs:"비트코인 현물·피델리티", aum:"17", er:"0.25%", ytd:"-16%", y1:"-15%" },
      { tk:"ETHA", nm:"iShares Ethereum Trust", rs:"이더리움 현물·4/14 +7%", aum:"10", er:"0.25%", ytd:"-12%", y1:"-8%" },
      { tk:"BITO", nm:"ProShares Bitcoin Strategy", rs:"비트코인 선물 최초", aum:"3", er:"0.95%", ytd:"-18%", y1:"-18%" },
      { tk:"BLOK", nm:"Amplify Blockchain", rs:"블록체인 기업 테마", aum:"1.5", er:"0.71%", ytd:"-10%", y1:"-5%" },
    ]
  },
  {
    title: "🇺🇸 미국 대형주",
    tag: "S&P500·나스닥·다우",
    stocks: [
      { tk:"SPY", nm:"SPDR S&P 500", rs:"S&P 500 대형주 ETF·4월 변동장 반등 국면", aum:"590", er:"0.09%", ytd:"-4%", y1:"+10%" },
      { tk:"QQQ", nm:"Invesco QQQ Trust", rs:"나스닥 100 빅테크·AI 리더십 유지", aum:"400", er:"0.20%", ytd:"+1%", y1:"+15%" },
      { tk:"VOO", nm:"Vanguard S&P 500", rs:"S&P 500 최대 ETF·최저 보수", aum:"827", er:"0.03%", ytd:"-4%", y1:"+10%" },
      { tk:"VTI", nm:"Vanguard Total Stock", rs:"미국 전체 시장", aum:"420", er:"0.03%", ytd:"-4%", y1:"+9%" },
      { tk:"DIA", nm:"SPDR Dow Jones", rs:"다우 30 우량주", aum:"35", er:"0.16%", ytd:"-3%", y1:"+7%" },
    ]
  },
  {
    title: "💰 배당·인컴",
    tag: "고배당·커버드콜",
    stocks: [
      { tk:"SCHD", nm:"Schwab US Dividend", rs:"배당 성장 전략", aum:"65", er:"0.06%", ytd:"+7%", y1:"+14%" },
      { tk:"VYM", nm:"Vanguard High Dividend", rs:"고배당 대형주", aum:"60", er:"0.06%", ytd:"+6%", y1:"+12%" },
      { tk:"JEPI", nm:"JPMorgan Equity Premium", rs:"커버드콜·월배당", aum:"38", er:"0.35%", ytd:"+8%", y1:"+12%" },
      { tk:"JEPQ", nm:"JPMorgan Nasdaq Premium", rs:"나스닥 커버드콜", aum:"20", er:"0.35%", ytd:"+10%", y1:"+15%" },
      { tk:"DVY", nm:"iShares Select Dividend", rs:"배당 선별·유틸 비중", aum:"22", er:"0.38%", ytd:"+5%", y1:"+10%" },
    ]
  },
  {
    title: "🌏 신흥국·글로벌",
    tag: "이머징·일본·인도",
    stocks: [
      { tk:"VWO", nm:"Vanguard FTSE Emerging", rs:"신흥국 최대 저보수", aum:"80", er:"0.08%", ytd:"+8%", y1:"+15%" },
      { tk:"EEM", nm:"iShares MSCI Emerging", rs:"신흥국 MSCI 기준", aum:"25", er:"0.68%", ytd:"+7%", y1:"+14%" },
      { tk:"EWJ", nm:"iShares MSCI Japan", rs:"일본 MSCI", aum:"15", er:"0.50%", ytd:"+12%", y1:"+20%" },
      { tk:"INDA", nm:"iShares MSCI India", rs:"인도 시장", aum:"12", er:"0.64%", ytd:"+10%", y1:"+18%" },
      { tk:"VEA", nm:"Vanguard FTSE Developed", rs:"선진국(미국 제외)", aum:"130", er:"0.05%", ytd:"+9%", y1:"+16%" },
    ]
  },
];
