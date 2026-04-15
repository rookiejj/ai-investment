// Global ETF Atlas - Update Log
const updates = [
  {
    date: "2026-04-15 21:38 KST",
    badge: "개별",
    summary: "미국 대형주 ETF YTD 갱신(SPY -4%·QQQ +1%) + IBIT AUM·YTD 소폭 정정",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY YTD +12→-4%·QQQ +15→+1%·VOO +12→-4%·VTI +11→-4%·DIA +8→-3%로 재조정. 2026 초반 S&P500 -6.7%(4/3)까지 밀렸다가 중순 반등 국면. QQQ는 AI 리더십으로 상대 강세 유지(YTD +0.6%). 1Y 수익률도 최근 조정 반영해 하향. 현재 S&P 500 6,950·나스닥 23,500 수준.", time: "2026-04-15 21:38 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT AUM $57B → $54B로 재조정(Q1 2026 종료 시점 $54B·시장점유 49% 공식). YTD -24% → -22%(최근 BTC 소폭 반등). rs에 커스터디 BTC 78.2만개, 일평균 거래대금 $3.2B 부가.", time: "2026-04-15 21:38 KST" },
    ]
  },
  {
    date: "2026-04-15 20:14 KST",
    badge: "개별",
    summary: "SMH AUM 재조정·IBIT YTD 추가 하향 — BTC $70,800 권역 하락폭 반영",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH(VanEck Semiconductor) AUM 공식 $42B로 재정립(전 $49B는 일시 피크치). VanEck 4/10 팩트시트 기준. YTD +22%·1Y +45%로 미세 조정. 규모 1위 지위 유지.", time: "2026-04-15 20:14 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT — BTC가 4/15 시점 ~$70,777(연초 $93k 대비 -24%, 1Y -20%)로 추가 하락. YTD -16%→-24%, 1Y -15%→-20% 정정. 4/10 IBIT AUM $56.80B, 동일자 +$269.3M 순유입. rs에 최신 AUM 수치 $56.8B 명시.", time: "2026-04-15 20:14 KST" },
    ]
  },
  {
    date: "2026-04-15 19:20 KST",
    summary: "IBIT AUM 갱신 ($54B → $57B) 및 Q1 순유입 $8.4B 반영",
    changes: [
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT(iShares Bitcoin Trust) AUM $54B → $57B로 갱신(4/10 $56.8B 기준). Q1 2026 순유입 $8.4B 공식 확인 — BTC 25% 드로다운에도 기관 장기 배분 수요 유지. 시장 점유율 49%, 일평균 거래대금 $3.2B, 커스터디 BTC 약 78.2만개. BlackRock Q1 실적에서 디지털 자산 AUM $60.7B로 공시, 4/14 IBIT +$269M 순유입으로 5일 연속 유출 종료. rs에 Q1 순유입 지표 추가." }
    ]
  },
  {
    date: "2026-04-15 12:40 KST",
    summary: "반도체 ETF YTD 재집계·크립토 ETF YTD 음전환 반영",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH(VanEck Semiconductor) AUM $42B→$49B로 갱신(VanEck 공식 4/10 기준), YTD 수익률도 Yahoo 기준 +21%→+25.5%(4/14), 1Y +48%로 재집계. SOXX(iShares Semiconductor)는 YTD +20%→+28.5%(4/10 기준), 1Y +46%로 상향. AI 인프라 투자 붐·Blackwell Ultra 공급 지속 + TSMC Q1 $35.7B 사상 최대 실적이 촉매." },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "비트코인 4/14 종가 ~$74,500(연초 $88,722 대비 -16%, 1Y 약 -15%). IBIT YTD +30%/1Y +65% → -16%/-15%로 정정. FBTC AUM $18B→$17B, 동일 패턴 음전환. ETHA(이더리움)도 4/14 일중 +7% 반등에도 YTD -12%. BITO·BLOK 동반 음전환. 다만 4/14 IBIT는 5주 최대인 +$269.3M 순유입으로 5일 연속 유출 흐름 종료. BlackRock Q1 어닝에서 IBIT AUM $54B·점유 49% 공식 확인, Q1 순유입 $8.4B·보유 BTC 약 78.2만개." }
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
