// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
  {
    "date": "2026-08-07",
    "made": "2026-08-07 07:35 KST",
    "predictions": [
      {
        "label": "SK하이닉스",
        "ticker": "000660",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 -10.4% 급락 오버솔드·사상 최대 매출 실증·기술적 반등 여지, KOSPI 6,300선 회복 시험 국면",
        "result": null,
        "actual": null
      },
      {
        "label": "한화에어로스페이스",
        "ticker": "012450",
        "market": "KR",
        "direction": "up",
        "rationale": "KAI 지분 11.21% 확보로 방산 통합 밑그림·직전 +4.7% 상대 방어·방산 매도 속 지분 확보 카드",
        "result": null,
        "actual": null
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "WDC·SNDK·AMD 매도 확산 속 홀로 -0.2% 상대 방어·Vera Rubin 8월 램프·8/27 Q2 실적 D-20",
        "result": null,
        "actual": null
      }
    ]
  },
  {
    "date": "2026-08-06",
    "made": "2026-08-06 09:58 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "240,000원 지지 확인 + 외국인 순매수 전환 기대 · HBM4 양산 서사 재점화",
        "result": "miss",
        "actual": -6.3
      },
      {
        "label": "한국항공우주",
        "ticker": "047810",
        "market": "KR",
        "direction": "up",
        "rationale": "K-방산 수출 모멘텀 지속 · 글로벌 재무장 사이클 가속, 전일 +11.2% 상승세 연속",
        "result": "hit",
        "actual": 2.5
      },
      {
        "label": "AMD",
        "ticker": "AMD",
        "market": "US",
        "direction": "up",
        "rationale": "전일 -8.6% Q2 어닝 쇼크 낙폭과대 · 기술적 반등 구간, MI350X 데이터센터 수요 서사는 중장기 유효",
        "result": "miss",
        "actual": -1.1
      }
    ]
  },
  {
    "date": "2026-08-04",
    "made": "2026-08-04 07:15 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "어제 -8.8% 급락 과매도 구간 · 낙폭과대 기술적 반등 + HBM4 서사 유효",
        "result": "hit",
        "actual": 0.2
      },
      {
        "label": "LG화학",
        "ticker": "051910",
        "market": "KR",
        "direction": "down",
        "rationale": "WTI -6% 크래시 여진 · 납사 원가 헤지 효과 상쇄, 리튬 약세 배터리 소재 마진 압박",
        "result": "miss",
        "actual": 3.8
      },
      {
        "label": "AMD",
        "ticker": "AMD",
        "market": "US",
        "direction": "up",
        "rationale": "내일(8/5) 실적 D-1 기대감 · MI350X 데이터센터 GPU 가이던스 상향 선반영",
        "result": "miss",
        "actual": -8.6
      }
    ]
  },
  {
    "date": "2026-08-03",
    "made": "2026-08-03 07:15 KST",
    "predictions": [
      {
        "label": "SK하이닉스",
        "ticker": "000660",
        "market": "KR",
        "direction": "up",
        "rationale": "HBM3E 가격 20% 인상 계약 마무리 · HBM4 양산 확인 + 오너 매수 서포트",
        "result": "miss",
        "actual": -8.8
      },
      {
        "label": "기아",
        "ticker": "000270",
        "market": "KR",
        "direction": "up",
        "rationale": "8/4 미국 자동차 관세 25%→15% 발효 D-1 수혜 선반영 · 하이브리드 판매 모멘텀",
        "result": "miss",
        "actual": -1.7
      },
      {
        "label": "PLTR",
        "ticker": "PLTR",
        "market": "US",
        "direction": "up",
        "rationale": "오늘 마감 후 Q2 실적 D-day · 커머셜 AI ARR 40%+ 서사 컨센 선반영 기대",
        "result": "hit",
        "actual": 2.1
      }
    ]
  },
  {
    "date": "2026-08-01",
    "made": "2026-08-01 07:15 KST",
    "predictions": [
      {
        "label": "현대차",
        "ticker": "005380",
        "market": "KR",
        "direction": "up",
        "rationale": "7월 미국 하이브리드 판매 호조 + 환율 안정으로 수출 마진 회복 기대",
        "result": "hit",
        "actual": 2.3
      },
      {
        "label": "AMZN",
        "ticker": "AMZN",
        "market": "US",
        "direction": "up",
        "rationale": "AWS Q2 성장률 회복 + 광고·프라임 구독 복합 수익 구조 견조",
        "result": "hit",
        "actual": 3.1
      },
      {
        "label": "TSLA",
        "ticker": "TSLA",
        "market": "US",
        "direction": "down",
        "rationale": "7월 글로벌 인도량 컨센 하회 우려 + 가격 인하 마진 압박 지속",
        "result": "miss",
        "actual": 1.8
      }
    ]
  },
  {
    "date": "2026-07-31",
    "made": "2026-07-31 07:15 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "블랙먼데이 과매도 구간 + 외국인 순매수 전환 기대",
        "result": "hit",
        "actual": 26.8
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "Blackwell 출하 가속 + AI 인프라 CAPEX 사이클 유지",
        "result": "hit",
        "actual": 1.6
      },
      {
        "label": "MSFT",
        "ticker": "MSFT",
        "market": "US",
        "direction": "down",
        "rationale": "달러 강세 환율 헤드윈드 + 클라우드 성장 컨센 하향 조정",
        "result": "hit",
        "actual": -0.6
      }
    ]
  },
  {
    "date": "2026-07-30",
    "made": "2026-07-30 07:15 KST",
    "predictions": [
      {
        "label": "LG에너지솔루션",
        "ticker": "373220",
        "market": "KR",
        "direction": "up",
        "rationale": "GM 북미 전기차 생산 재가동 + IRA 보조금 유지 확인으로 수주 잔고 회복",
        "result": "hit",
        "actual": 0.4
      },
      {
        "label": "AMD",
        "ticker": "AMD",
        "market": "US",
        "direction": "up",
        "rationale": "MI300X 데이터센터 채택 확대 + NVDA 공급 부족 반사 수혜",
        "result": "hit",
        "actual": 3.7
      },
      {
        "label": "PANW",
        "ticker": "PANW",
        "market": "US",
        "direction": "down",
        "rationale": "사이버보안 예산 긴축 우려 + 플랫폼화 전략 전환기 마진 압박",
        "result": "miss",
        "actual": 1.1
      }
    ]
  },
];
