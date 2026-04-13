// Commodity & Macro Atlas - data source
// 원자재·매크로 지표. index.html 자동 렌더링.

const data = [
  {
    title: "🥇 귀금속",
    tag: "안전자산·인플레 헤지",
    stocks: [
      { tk:"GC", nm:"금 (Gold)", rs:"중앙은행 매입·지정학 리스크 헤지", price:"$2,450", ytd:"+15%", y1:"+28%", range:"$1,950–2,500" },
      { tk:"SI", nm:"은 (Silver)", rs:"산업(태양광)+투자 이중 수요", price:"$32", ytd:"+12%", y1:"+22%", range:"$22–34" },
      { tk:"PL", nm:"백금 (Platinum)", rs:"수소연료전지·촉매 수요", price:"$1,050", ytd:"+8%", y1:"+15%", range:"$880–1,100" },
      { tk:"PA", nm:"팔라듐 (Palladium)", rs:"자동차 촉매·EV 전환 역풍", price:"$980", ytd:"-5%", y1:"-12%", range:"$850–1,200" },
    ]
  },
  {
    title: "🛢️ 에너지",
    tag: "원유·천연가스·석탄",
    stocks: [
      { tk:"CL", nm:"원유 WTI", rs:"OPEC+ 감산·미국 셰일 증산", price:"$78", ytd:"+5%", y1:"+10%", range:"$65–85" },
      { tk:"BZ", nm:"브렌트유", rs:"국제 벤치마크·중동 프리미엄", price:"$82", ytd:"+6%", y1:"+12%", range:"$70–90" },
      { tk:"NG", nm:"천연가스", rs:"LNG 수출 확대·DC 전력 수요", price:"$3.20", ytd:"+15%", y1:"+25%", range:"$2.00–4.50" },
      { tk:"MTF", nm:"석탄 (Newcastle)", rs:"아시아 발전 수요·전환기", price:"$130", ytd:"-8%", y1:"-15%", range:"$110–180" },
    ]
  },
  {
    title: "🔩 산업금속",
    tag: "전력망·건설·제조",
    stocks: [
      { tk:"HG", nm:"구리 (Copper)", rs:"AI 데이터센터·전력망 핵심 소재", price:"$4.80/lb", ytd:"+18%", y1:"+30%", range:"$3.50–5.00" },
      { tk:"ALI", nm:"알루미늄", rs:"EV 경량화·포장재", price:"$2,650/t", ytd:"+10%", y1:"+15%", range:"$2,200–2,800" },
      { tk:"NI", nm:"니켈", rs:"배터리·스테인리스", price:"$18,500/t", ytd:"+5%", y1:"+8%", range:"$15,000–22,000" },
      { tk:"TIO", nm:"철광석", rs:"중국 부양책·인프라", price:"$110/t", ytd:"-5%", y1:"-10%", range:"$90–140" },
    ]
  },
  {
    title: "🔋 배터리 소재",
    tag: "리튬·코발트·희토류",
    stocks: [
      { tk:"LITH", nm:"리튬 (탄산)", rs:"2차전지 핵심·EV 수요 반등", price:"$12,000/t", ytd:"+20%", y1:"+35%", range:"$8,000–15,000" },
      { tk:"COBALT", nm:"코발트", rs:"양극재·콩고 공급 리스크", price:"$28,000/t", ytd:"+8%", y1:"+12%", range:"$24,000–35,000" },
      { tk:"GRAPH", nm:"흑연", rs:"음극재·중국 수출 통제", price:"$550/t", ytd:"+5%", y1:"+10%", range:"$450–600" },
      { tk:"REE", nm:"희토류 (NdPr)", rs:"영구자석·EV모터·풍력", price:"$75/kg", ytd:"+12%", y1:"+20%", range:"$55–85" },
    ]
  },
  {
    title: "🌾 농산물",
    tag: "식량·기후·수급",
    stocks: [
      { tk:"ZW", nm:"밀 (Wheat)", rs:"글로벌 식량 안보·기후 변동", price:"$620/bu", ytd:"+8%", y1:"+12%", range:"$500–700" },
      { tk:"ZC", nm:"옥수수 (Corn)", rs:"사료·에탄올·미국 작황", price:"$450/bu", ytd:"+5%", y1:"+8%", range:"$380–520" },
      { tk:"ZS", nm:"대두 (Soybean)", rs:"사료·식용유·남미 수출", price:"$1,050/bu", ytd:"+3%", y1:"+5%", range:"$900–1,150" },
      { tk:"KC", nm:"커피 (Arabica)", rs:"기후변화 공급 차질·가격 급등", price:"$3.50/lb", ytd:"+25%", y1:"+45%", range:"$1.80–4.00" },
    ]
  },
  {
    title: "📊 매크로 지표",
    tag: "금리·달러·변동성",
    stocks: [
      { tk:"FFRATE", nm:"미 기준금리", rs:"2026 인하 사이클 진행 중", price:"4.25%", ytd:"-50bp", y1:"-100bp", range:"3.75–5.25%" },
      { tk:"US10Y", nm:"미 10년물 금리", rs:"장기 금리 벤치마크", price:"4.10%", ytd:"-30bp", y1:"-50bp", range:"3.80–4.80%" },
      { tk:"DXY", nm:"달러 인덱스", rs:"글로벌 달러 강도 지표", price:"102", ytd:"-3%", y1:"-5%", range:"98–108" },
      { tk:"VIX", nm:"VIX 공포지수", rs:"S&P 500 내재변동성", price:"18", ytd:"-5pt", y1:"-8pt", range:"12–35" },
    ]
  },
];
