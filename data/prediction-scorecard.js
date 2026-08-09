// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
  {
    "date": "2026-08-10",
    "made": "2026-08-10 07:35 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "반도체특별법 8/11 시행 D-1·주주환원 확대 기대·8월 -12% 조정 후 방어 국면에서 정책 카운터가 반등 축",
        "result": null,
        "actual": null
      },
      {
        "label": "현대자동차",
        "ticker": "005380",
        "market": "KR",
        "direction": "up",
        "rationale": "7월 미 판매 사상 최대 8.9만대·하이브리드 +52%·8/26 인베스터 데이 대기가 이번 주 회복 카운터 축",
        "result": null,
        "actual": null
      },
      {
        "label": "AVGO",
        "ticker": "AVGO",
        "market": "US",
        "direction": "up",
        "rationale": "NVDA 랠리 동조·FY26 AI 매출 56억달러 가이던스 유지·SaaS 리레이팅과 병존 시나리오가 프리미엄 방어 축",
        "result": null,
        "actual": null
      }
    ]
  },
  {
    "date": "2026-08-10",
    "made": "2026-08-09 07:30 KST",
    "predictions": [
      {
        "label": "LG에너지솔루션",
        "ticker": "373220",
        "market": "KR",
        "direction": "up",
        "rationale": "Q2 매출 7.56조·영업익 1,133억 흑자 전환·K-배터리 3사 동반 흑자 확인·북미 ESS 수주 확대가 리레이팅 축 지속",
        "result": "hit",
        "actual": 4.3
      },
      {
        "label": "LIG넥스원",
        "ticker": "079550",
        "market": "KR",
        "direction": "up",
        "rationale": "사우디 WDS 2026 8/8~12 개막·미 해군 비궁 유도로켓 FCT 통과 서사·상반기 방산 빅4 이익 +13.3% 흐름이 강세 카운터",
        "result": "hit",
        "actual": 5.6
      },
      {
        "label": "CRWD",
        "ticker": "CRWD",
        "market": "US",
        "direction": "up",
        "rationale": "TEAM·NET·TWLO SaaS 랠리 광범위 확산·사이버보안 리레이팅 재점화·8/12 CPI 발표 대기 국면이 소프트웨어 프리미엄 카운터",
        "result": "hit",
        "actual": 3.4
      }
    ]
  },
  {
    "date": "2026-08-10",
    "made": "2026-08-08 07:15 KST",
    "predictions": [
      {
        "label": "삼성SDI",
        "ticker": "006400",
        "market": "KR",
        "direction": "up",
        "rationale": "8/7 +7.5% 배터리 랠리 주도·북미 ESS 수주 확대·LG에너지솔루션 실적 발표 대기가 배터리 리레이팅 축 확장",
        "result": "hit",
        "actual": 7.5
      },
      {
        "label": "BGF리테일",
        "ticker": "282330",
        "market": "KR",
        "direction": "up",
        "rationale": "Q2 영업이익 849억 컨센 740억 상회·이달 +25.5% 아웃퍼폼·DB증권 목표가 상향이 편의점 리레이팅 모멘텀 지속 축",
        "result": "hit",
        "actual": 14.7
      },
      {
        "label": "Cloudflare",
        "ticker": "NET",
        "market": "US",
        "direction": "up",
        "rationale": "Q2 매출·EPS 컨센 상회 후 +16.8% 급등·연간 EPS 가이던스 상향이 AI 워크로드 매출 재가속 실증, SaaS 리레이팅 흐름 지속",
        "result": "hit",
        "actual": 5.6
      }
    ]
  },
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
        "result": "miss",
        "actual": -4.9
      },
      {
        "label": "한화에어로스페이스",
        "ticker": "012450",
        "market": "KR",
        "direction": "up",
        "rationale": "KAI 지분 11.21% 확보로 방산 통합 밑그림·직전 +4.7% 상대 방어·방산 매도 속 지분 확보 카드",
        "result": "hit",
        "actual": 4.1
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "WDC·SNDK·AMD 매도 확산 속 홀로 -0.2% 상대 방어·Vera Rubin 8월 램프·8/27 Q2 실적 D-20",
        "result": "hit",
        "actual": 0.4
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
  }
];
