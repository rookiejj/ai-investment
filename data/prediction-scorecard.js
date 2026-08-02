// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down" | "neutral"
// market:    "KR" | "US"
// made:      "YYYY-MM-DD HH:MM KST"  (07:xx KST — 한국 장 전 2시간, US 장 전 15시간)
// date:      made 당일(KST) = KR 09:00 / US 22:30 세션 채점 기준일
// result:    null(채점 전) | "hit" | "miss" | "push"
//   hit  — 예측 방향과 실제 방향 일치 (|actual| ≥ 0.5%)
//   miss — 예측 방향과 실제 방향 반대 (|actual| ≥ 0.5%)
//   push — 실제 등락률이 ±0.5% 미만 (보합 = 승부 없음)
const PREDICTION_SCORECARD = [
  {
    date: "2026-07-31",
    made: "2026-07-31 07:15 KST",
    predictions: [
      {
        label: "삼성전자",
        ticker: "005930",
        market: "KR",
        direction: "up",
        rationale: "블랙먼데이 과매도 구간 + 외국인 순매수 전환 기대",
        result: "hit",
        actual: 26.8,
      },
      {
        label: "NVDA",
        ticker: "NVDA",
        market: "US",
        direction: "up",
        rationale: "Blackwell 출하 가속 + AI 인프라 CAPEX 사이클 유지",
        result: "hit",
        actual: 1.6,
      },
      {
        label: "MSFT",
        ticker: "MSFT",
        market: "US",
        direction: "down",
        rationale: "달러 강세 환율 헤드윈드 + 클라우드 성장 컨센 하향 조정",
        result: "hit",
        actual: -0.6,
      },
    ],
  },
];
