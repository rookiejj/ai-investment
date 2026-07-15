const updates = [
  {
    "date": "2026-07-16 07:20 KST",
    "summary": "S&P 7,572.40 +0.38%·NASDAQ 26,269.23 +0.62%·Dow 52,658.64 +0.29% 3대 지수 신고가 마감\n6월 PPI -0.3% MoM 컨센 하회 - 헤드라인 YoY 5.5%·소프트 인플레이션 Fed 인하 window 재개\nBAC EPS $1.21·MS EPS $3.46·GS Q2 $20.98 일제히 컨센 상회 - MS 자산관리 AUM $10T 돌파\nAAPL $326.19 +3.60% 신고가 - 중국 Apple Intelligence 알리바바 Qwen·바이두 승인\nASML Q2 매출 €9.3B·FY26 가이던스 €43~45B 상향 - EUV 시스템 매출 YoY +45%",
    "changes": [
      {
        "time": "2026-07-15 16:00 ET",
        "type": "지수",
        "sector": "매크로",
        "detail": "3대 지수 동반 신고가 마감. S&P 500 7,572.40 +0.38%·NASDAQ Composite 26,269.23 +0.62%·Dow Jones 52,658.64 +150.37p +0.29% - 소프트 PPI + 은행주 Q2 컨센 상회 + ASML 가이던스 상향 3중 트리거. 10y 국채금리 4.57% -6bp - 4.62% 2개월 고점에서 되돌림·DXY 100.9로 소폭 약세. 섹터 로테이션 - XLF +2.18%·MoM +8%·XLK -2.57% MoM 낙폭 - AI CAPEX proxy 차익실현 이후 자본시장 은행으로 자금 재배치. AAPL·GOOGL·META·AMZN·MSFT 빅5 +2.78~3.60% 광범위 랠리·NVDA $211.66 -0.07% flat 소외. 밸류에이션 - S&P forward P/E 22배·earnings yield 4.5% 10y gap 마이너스 20bp·XLF forward P/E 14배 XLK 대비 discount 유지. 단기 시그널 - 7/16 ASML Q2 공식 발표 (프리마켓 이미 반영)·7/17 넷플릭스·TSMC ADR·7/22~24 GOOGL·MSFT·META·TSLA·7/28~29 FOMC."
      },
      {
        "time": "2026-07-15 08:30 ET",
        "type": "매크로",
        "sector": "매크로",
        "detail": "6월 PPI 컨센 하회 - 인플레이션 냉각 스토리 강화. 헤드라인 PPI MoM -0.3% (컨센 0%)·가솔린 -1.4% 재화 가격이 주도·코어 PPI MoM +0.2% (컨센 +0.4%)·헤드라인 YoY +5.5% (5월 6.5%에서 완만). 코어 less-trade-services YoY +5.1%. 같은 주 CPI 3.5%도 컨센 하회 후 확인 시그널. Fed funds 인하 확률 - 9월 25bp 인하 확률 60% 재상승·11월 추가 인하 확률 30%로 상향. 크로스 애셋 - 10y 4.57% -6bp·2y 4.15%·DXY 100.9 소프트한 인플레이션 지표 흡수·gold $4,076 소폭 상승. 매크로 렌즈 - Fed 인상 압력 완화 vs 워시 청문회 신중 기조로 연말 인하 window는 열림·터미널 금리 4.00% 시장 컨센 유지·상반기 대비 하반기 disinflation 재개."
      },
      {
        "time": "2026-07-15 09:00 ET",
        "type": "실적",
        "sector": "금융·은행",
        "detail": "은행 Q2 일제 컨센 상회 - 자본시장 부활 후방. Bank of America (BAC) EPS $1.21 컨센 $1.13 상회 +7.7%·매출 $31.56B (+15% YoY)·트레이딩·IB 63% YoY 성장 기여·NII $16B 소폭 컨센 하회 $16.2B. Morgan Stanley (MS) EPS $3.46 컨센 $2.94 상회 +17.7%·순익 +58% YoY·매출 $21.35B·주식 트레이딩 사상 최고 $6.3B (+69% 아시아 강세)·자산관리 AUM $10T 최초 돌파 마일스톤·배당 +15%·자사주 $1.5B. Goldman Sachs (GS) 7/14 이미 발표 - 매출 $20.34B·EPS $20.98 vs $10.91 YoY·사상 최고 분기. 밸류에이션 - XLF +2.18% 리딩·BAC forward P/E 13배·JPM 15배·MS 16배 sector premium·capital markets 실적 revision cycle +30%·XLK 대비 value tilt 부각. 매크로 렌즈 - 자산관리 mega trend·MS $10T AUM·GS·JPM peer group compound. 단기 시그널 - 7/17 SCHW·BLK·7/22 CFG·PNC."
      },
      {
        "time": "2026-07-15 04:00 ET",
        "type": "실적",
        "sector": "반도체",
        "detail": "ASML Q2 매출 €9.3B 가이던스 상회. Gross margin 54% 컨센 상회·순익 €2.9B·EPS €7.59·EUV 시스템 매출 €3.8B·non-EUV €2.8B. FY26 가이던스 €43~45B 상향 (기존 €40~42B)·EUV 시스템 매출 YoY +45% 상회·low-NA EUV 65대 shipment 유지. 부킹은 비공개 전환 - 가이던스·shipment로 스토리 이관. 밸류에이션 - ASML forward P/E 32배·EUV monopoly premium·MSCI World 반도체 sector rerating 트리거·earnings yield 3.1% 10y gap 150bp. 매크로 렌즈 - AI CAPEX 사이클 검증 시그널·TSMC Q2 $39.62B +36% YoY와 정렬·hyperscaler $725B CAPEX 후방·H2 slot allocation 논쟁 완화. 시장 영향 - 유럽 프리마켓 EUV supply chain (ASML·ASMI·BESI) 동반 강세·7/16 미국 프리마켓 AMAT·LRCX·KLAC spillover 관건."
      },
      {
        "time": "2026-07-15 15:00 ET",
        "type": "종목",
        "sector": "AI 플랫폼",
        "detail": "AAPL $326.19 +3.60% 사상 최고가 - 중국 Apple Intelligence 승인 관문 통과. 2026년 15번째 장중 신고가·YTD +20%·시총 $5T 근접. 촉매 - 중국 사이버공간관리국(CAC) 알리바바 Qwen 모델 + 바이두 파트너십 활용한 Apple Intelligence 서비스 공식 승인·아이폰 17 시리즈 중국 판매 촉진 후방·중국 매출 15% 재개 시그널. GOOGL +3.16%·META +3.07%·AMZN +3.02%·MSFT +2.78% 빅테크 동반 랠리·NVDA -0.07% flat 상대적 소외. 밸류에이션 - AAPL forward P/E 32배·중국 시장 access 리레이팅 후방·non-CAPEX AI 수익화 스토리 (Apple Intelligence 무료 배포·구독형 미배포)·earnings yield 3.1% 10y gap 마이너스 150bp. 매크로 렌즈 - 광범위 랠리로 breadth 개선·A/D ratio 3:1·rotation을 넘어선 참여 확대 시그널. 단기 시그널 - 7/30 AAPL Q3 D-14·7/22 GOOGL Q2·7/24 META Q2."
      }
    ]
  }
];
