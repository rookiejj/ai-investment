// Commodity & Macro Atlas - data source
// 원자재·매크로 지표. index.html 자동 렌더링.

const data = [
  {
    title: "🥇 귀금속",
    tag: "안전자산·인플레 헤지",
    stocks: [
      { tk:"GC", nm:"금 (Gold)", rs:"중앙은행 매입·관세 불확실성 안전자산", price:"$3,220", ytd:"+17%", y1:"+38%", range:"$2,600–3,300" },
      { tk:"SI", nm:"은 (Silver)", rs:"산업(태양광)+투자 이중 수요", price:"$32", ytd:"+12%", y1:"+22%", range:"$22–34" },
      { tk:"PL", nm:"백금 (Platinum)", rs:"수소연료전지·촉매 수요", price:"$990", ytd:"+5%", y1:"+12%", range:"$880–1,050" },
      { tk:"PA", nm:"팔라듐 (Palladium)", rs:"자동차 촉매·EV 전환 역풍", price:"$970", ytd:"-5%", y1:"-12%", range:"$850–1,200" },
    ]
  },
  {
    title: "🛢️ 에너지",
    tag: "원유·천연가스·석탄",
    stocks: [
      { tk:"CL", nm:"원유 WTI", rs:"OPEC+ 증산·관세 수요 파괴", price:"$61", ytd:"-8%", y1:"-15%", range:"$58–78" },
      { tk:"BZ", nm:"브렌트유", rs:"OPEC+ 증산·관세 수요 파괴", price:"$64", ytd:"-7%", y1:"-12%", range:"$60–82" },
      { tk:"NG", nm:"천연가스", rs:"LNG 수출 확대·DC 전력 수요", price:"$3.60", ytd:"+22%", y1:"+30%", range:"$2.00–4.50" },
      { tk:"MTF", nm:"석탄 (Newcastle)", rs:"아시아 발전 수요·전환기", price:"$125", ytd:"-10%", y1:"-18%", range:"$110–180" },
    ]
  },
  {
    title: "🔩 산업금속",
    tag: "전력망·건설·제조",
    stocks: [
      { tk:"HG", nm:"구리 (Copper)", rs:"AI 데이터센터·전력망·관세 프리미엄", price:"$4.75/lb", ytd:"+16%", y1:"+28%", range:"$3.50–5.00" },
      { tk:"ALI", nm:"알루미늄", rs:"EV 경량화·포장재", price:"$2,500/t", ytd:"+5%", y1:"+10%", range:"$2,200–2,700" },
      { tk:"NI", nm:"니켈", rs:"인니 공급과잉·배터리 수요 약세", price:"$15,500/t", ytd:"-8%", y1:"-15%", range:"$14,000–18,000" },
      { tk:"TIO", nm:"철광석", rs:"중국 수요 둔화·관세 불확실성", price:"$100/t", ytd:"-10%", y1:"-15%", range:"$90–130" },
    ]
  },
  {
    title: "🔋 배터리 소재",
    tag: "리튬·코발트·희토류",
    stocks: [
      { tk:"LITH", nm:"리튬 (탄산)", rs:"공급과잉 지속·EV 성장 둔화", price:"$10,000/t", ytd:"+5%", y1:"+10%", range:"$8,000–13,000" },
      { tk:"COBALT", nm:"코발트", rs:"DRC 공급·EV 수요 약세", price:"$25,000/t", ytd:"+2%", y1:"+5%", range:"$22,000–30,000" },
      { tk:"GRAPH", nm:"흑연", rs:"음극재·중국 수출 통제", price:"$540/t", ytd:"+3%", y1:"+8%", range:"$450–600" },
      { tk:"REE", nm:"희토류 (NdPr)", rs:"영구자석·EV모터·풍력", price:"$72/kg", ytd:"+10%", y1:"+18%", range:"$55–85" },
    ]
  },
  {
    title: "🌾 농산물",
    tag: "식량·기후·수급",
    stocks: [
      { tk:"ZW", nm:"밀 (Wheat)", rs:"글로벌 식량 안보·기후 변동", price:"$545/bu", ytd:"+3%", y1:"+6%", range:"$480–620" },
      { tk:"ZC", nm:"옥수수 (Corn)", rs:"사료·에탄올·미국 작황", price:"$450/bu", ytd:"+5%", y1:"+8%", range:"$380–520" },
      { tk:"ZS", nm:"대두 (Soybean)", rs:"사료·식용유·남미 수출", price:"$1,030/bu", ytd:"+2%", y1:"+4%", range:"$900–1,100" },
      { tk:"KC", nm:"커피 (Arabica)", rs:"브라질 가뭄 공급 차질·가격 급등", price:"$4.00/lb", ytd:"+30%", y1:"+50%", range:"$1.80–4.20" },
    ]
  },
  {
    title: "📊 매크로 지표",
    tag: "금리·달러·변동성",
    stocks: [
      { tk:"FFRATE", nm:"미 기준금리", rs:"스태그플레이션 우려로 동결 지속", price:"4.25%", ytd:"0bp", y1:"-75bp", range:"4.25–5.25%" },
      { tk:"US10Y", nm:"미 10년물 금리", rs:"관세發 인플레 우려 금리 상승", price:"4.40%", ytd:"+10bp", y1:"-20bp", range:"3.80–4.80%" },
      { tk:"DXY", nm:"달러 인덱스", rs:"관세 정책 불확실성·탈달러 우려", price:"99.5", ytd:"-6%", y1:"-8%", range:"97–108" },
      { tk:"VIX", nm:"VIX 공포지수", rs:"관세전쟁·지정학 리스크 극심", price:"40", ytd:"+22pt", y1:"+18pt", range:"12–52" },
    ]
  },
];
