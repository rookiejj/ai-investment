// Global ETF Atlas - Update Log
const updates = [
  {
    date: "2026-04-15 07:20 KST",
    summary: "SMH AUM 실측치 반영 정정·rs 구체화",
    changes: [
      { type: "수치 정정", sector: "AI·반도체",
        detail: "SMH(VanEck Semiconductor) AUM $71B→$42B으로 정정. VanEck 공식·ETF Database 4월 중순 수치 기준 실제 AUM $42B+로 확인(전일 반영치 과대). 여전히 섹터 최대 ETF 지위 유지, 4/14 기준 SOXX($22B) 대비 약 2배. 25종·MVIS US Listed Semiconductor 지수 추종 특성을 rs에 명시." }
    ]
  },
  {
    date: "2026-04-14 20:35 KST",
    summary: "AI·반도체 ETF AUM 상향 + QQQ AUM 갱신",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH(VanEck Semiconductor) AUM $28B→$71B(+154%). AI 인프라 투자 붐·반도체 슈퍼사이클로 2026년 초 이후 자금 대거 유입. 4월 한 달 약 +20% 랠리. SOXX(iShares Semiconductor) AUM $16B→$22B(+37.5%). Morningstar Bronze 유지. 두 ETF 모두 1위 자리 경쟁 심화. 이번 갱신은 AUM만 반영, YTD·1Y 수익률은 기존 유지." },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "QQQ(Invesco QQQ Trust) AUM $320B→$400B. 나스닥 100 빅테크 랠리 지속, AI·반도체 비중 확대와 GPT-5.4·Gemini 3.1 출시로 투자자 관심 유입. SPY·VOO와 함께 3대 최대 ETF 자리 공고히." }
    ]
  },
  {
    date: "2026-04-13 12:30 KST",
    summary: "글로벌 ETF 8개 카테고리 40종목 초기 구성",
    changes: [
      { type: "신규 구성", sector: "전체",
        detail: "8개 카테고리 × 5종목 = 40 ETF 체제 확립. AI·반도체, 방산·보안, 에너지·원자력, 클린에너지, 크립토·블록체인, 미국 대형주, 배당·인컴, 신흥국·글로벌." },
    ]
  },
];
