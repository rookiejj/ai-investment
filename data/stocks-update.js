const updates = [
  {
    "date": "2026-06-04 19:30 KST",
    "summary": `AVGO AH -14% Q2 매출 $22.2B 컨센 하회 - AI 반도체 +143% 견조에도 가이던스 보수
CRWD AH -10% 4:1 분할 · ARR $5.51B +24% - 빌링스 컨센 하회
AAPL WWDC 6/8 D-4 Siri 2.0 - 모건스탠리 $330 베어/$440 불 케이스
LULU Q1 AMC 매출 $2.40~2.43B - 관세 -120bp·중국 본토 +25~30% 동력
6/5 NFP +10만 컨센 D-1 · 6/16 워시 첫 FOMC dot plot D-12`,
    "changes": [
      {
        "time": "2026-06-04 19:25 KST",
        "type": "실적 발표",
        "detail": "Broadcom(AVGO). 6/3 마감 후 FY26 Q2 발표 - 매출 컨센 하회 + EPS 컨센 상회 + 가이던스 보수 발언이 AH -14% 후퇴 트리거. 핵심 수치 - 매출 $22.2B(+48% YoY) 컨센 $22.7B 약 $530M 하회 + EPS adj. $2.44 컨센 $2.32 상회 + AI 반도체 매출 $10.8B +143% YoY 사상 최대 분기 + AI 반도체 수주 잔고 $30B 돌파 + 반도체 솔루션 $15B +79% YoY. 인프라 소프트웨어 $7.2B +9% YoY 둔화. FY26 AI 반도체 가이던스 $56B(+180%) 재확인·FY27 AI 반도체 $100B+ 전망 베이스 - 하이퍼스케일러 4대 커스텀 ASIC 락인 유지. AH -14% 배경 - 직전 신고가 영역 도달 후 매출 컨센 하회 + AI 매출 가속 둔화 우려 + sector premium 차익실현. forward 반도체 sector P/E 32배·earnings yield 3.1% 10y 4.45% gap 100bp 베이스에서 AVGO 단독 hyperscaler ASIC 매출 step-up + Apple WWDC 6/8 외부 LLM 통합 카운터가 멀티이어 모멘텀. 6/3 Iran 쿠웨이트·바레인 미사일 후속 risk-off + AI 매출 동력 sector premium 동조 변동성 확대.",
        "sector": "반도체"
      },
      {
        "time": "2026-06-04 19:20 KST",
        "type": "실적 발표",
        "detail": "CrowdStrike(CRWD). 6/3 마감 후 FY27 Q1 발표 - 매출·EPS 컨센 상회 + 4:1 주식 분할 발표 + 가이던스 상향, AH -10% 후퇴. 핵심 수치 - 매출 $1.39B(+26% YoY) 컨센 $1.36B 상회 + EPS adj. $1.10 컨센 $1.07 상회 + ARR $5.51B(4/30 기준) +24% YoY + Q1 신규 ARR $255.8M +32% 사상 최대 분기 + GAAP 순이익 $27.8M(EPS $0.11) 흑자 전환 + 운영 현금흐름 $591M·FCF $468M 사상 최대. 주식 분할 - 4:1 비율, 6/25 record date·7/1 마감 후 3주 추가 배정·7/2 split-adjusted 거래 개시. AH -10% 배경 - 빌링스(billings) 컨센 하회 + 직전 한 달간 +60% 누적 상승으로 sector valuation 선반영. forward 사이버보안 sector P/E 18·NTM 매출 멀티플 12배 premium 베이스에서 NRR 120%+ 유지·Charlotte AI agent security 매출 step-up·7/2024 outage churn 정상화 완료가 멀티이어 모멘텀. Palo Alto Networks 6/2 마감 후 FY26 Q3 +18% YoY 매출 베이스 후속 sector tone 동조.",
        "sector": "사이버보안"
      },
      {
        "time": "2026-06-04 19:15 KST",
        "type": "이벤트 예정",
        "detail": "Apple(AAPL). WWDC 2026 6/8 키노트 D-4 카운트다운 - 10AM PT·6/12 종료 5일 일정. Siri 2.0·Apple Intelligence·iOS 27·macOS 27 신규 발표 컨센 + Siri 2.0 백엔드에 커스텀 Google Gemini 모델 통합 보도가 헤드라인 카탈리스트. 셀사이드 타깃 - 모건스탠리 베이스 $330·불 케이스 $440·Wedbush $400 스트리트 톱·Evercore ISI $365 상향(가을 정식 출시 컨센). 11주 연속 상승 2004 이후 최장 스트릭·연간 +50% 매그7 2위(NVDA 다음) 사상 최고 근접. forward P/E 33 sector premium 베이스 + on-device AI 강화 + Siri redesign + 외부 LLM(Gemini·Claude) 통합 + Apple Silicon 차세대 칩 + WWDC25 Apple Intelligence 출시 대비 1년 delayed Siri 약속이 26년 신뢰 회복 변곡점. UBS 카운터 - 키노트 자체로는 단독 카탈리스트 약함 + 가을 정식 출시 확정 후 멀티이어 모멘텀 전망. 매그7 sector rotation·AVGO·CRWD AH 후퇴 동조 변동성 잠재.",
        "sector": "AI 플랫폼"
      },
      {
        "time": "2026-06-04 19:10 KST",
        "type": "실적 예정",
        "detail": "Lululemon(LULU). 6/4 마감 후(AMC) FY26 Q1 발표 - 4:05PM ET 일정. 컨센 - 매출 $2.40~2.43B(+1~3% YoY) + EPS adj. $1.67(-35.8% YoY 감소) + Q1 중국 본토 +25~30% YoY 견인 + 북미 mid-single digits 감소 + 약 6개 신규 매장·6개 최적화 가이던스. FY26 풀이어 가이던스 - 매출 $11.35~11.50B(+2~4%) + 북미 -1~-3% + 중국 본토 +20% + 매출총이익률 -120bp(Q1 -380bp) + 관세 $380M 영향. LULU 주가 YTD -39% 7년 최저 영역·옵션 마켓 10% 이동 컨센 - 베어 케이스 가이던스 추가 하향 + Athleisure 경쟁 가속(Alo Yoga·Vuori) + 관세 베이스가 sector 변곡점. 매크로 컨텍스트 - 6/5 NFP +10만 컨센·실업률 4.3% 동결 + 1분기 비농업 생산성 + Challenger 5월 정리해고 발표가 노동 사이클 시그널 + 6/16~17 케빈 워시 첫 FOMC dot plot D-12 + Polymarket 60% no-cut H1 2026이 forward 소비 sector 카운터. WTI $95+/bbl 3연속 상승 + UAE OPEC 탈퇴(5/1) + 호르무즈 risk premium이 인플레 카운터 잠재.",
        "sector": "소비·리테일"
      }
    ]
  }
];
