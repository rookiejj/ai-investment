// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
  {
    "date": "2026-08-13",
    "made": "2026-08-12 19:39 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "255,500원 +6.70% 사상 최고 마감·테마섹 K증시 첫 투자 삼전닉스 담기 소식이 트리거·외국인 2.8조 순매수 폭발이 익일 추가 상승 서사 축, 오늘 밤 미 CPI 컨센 부합 시 추가 강세 카운터",
        "result": null,
        "actual": null
      },
      {
        "label": "LG전자",
        "ticker": "066570",
        "market": "KR",
        "direction": "down",
        "rationale": "205,000원 +13.1% 폭등 마감·엔비디아 CDU 인증 확보 리레이팅 후 단기 급등분 소화 국면·이수페타시스·삼성전기 등 어제 급등주 되돌림 패턴이 익일 조정 카운터",
        "result": null,
        "actual": null
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "218.06달러 마감·CoreWeave Q2 매출 +112%·백로그 1,040억달러 서프라이즈가 AI 인프라 서사 재확산, 오늘 밤 CPI 컨센 부합 시 성장주 프리미엄 재확장 카운터",
        "result": null,
        "actual": null
      }
    ]
  },
  {
    "date": "2026-08-12",
    "made": "2026-08-12 07:40 KST",
    "predictions": [
      {
        "label": "SK하이닉스",
        "ticker": "000660",
        "market": "KR",
        "direction": "up",
        "rationale": "1,425,000원 +0.4% 8/11 마감·삼성 +4.13% 랠리 동조·8월 상순 반도체 수출 +155% 서프라이즈 후광, HBM 사이클 확장이 매출 확장 카운터",
        "result": "hit",
        "actual": 5.5
      },
      {
        "label": "셀트리온",
        "ticker": "068270",
        "market": "KR",
        "direction": "up",
        "rationale": "210,500원 +4.7% 8/11 마감·대형 헬스케어 순환 매수 유입·5조 매출 목표·Q1 신규 고마진 +67% 서사, 방산·조선 조정에서 자금 로테이션 지속",
        "result": "miss",
        "actual": -4
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "217.83달러 +0.2% 8/11 마감·CoreWeave Q2 매출 +112% 서프라이즈·백로그 1,040억달러 확장이 AI 인프라 매출 확장 카운터, CPI 컨센 부합 시 성장주 프리미엄 재확장",
        "result": "hit",
        "actual": 0.3
      }
    ]
  },
  {
    "date": "2026-08-12",
    "made": "2026-08-11 19:30 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "239,500원 +4.10% 마감 후 8월 상순 반도체 수출 +155% YoY 서프라이즈·외국인 5,841억 순매수 1위 흐름이 CPI 8/12 발표 앞두고 반등 지속 서사, HBM 사이클 확장이 밸류 방어 축",
        "result": "hit",
        "actual": 4.1
      },
      {
        "label": "AMD",
        "ticker": "AMD",
        "market": "US",
        "direction": "down",
        "rationale": "469.56달러 -2.9% 되돌림 후 AI 서킷 파이낸싱 우려 재점화·SpaceX 스타마인드 프로그램 NVIDIA 독점 지정이 AMD 대비 격차 확산 카운터, CPI 대기 관망이 압력 지속",
        "result": "hit",
        "actual": -0.1
      },
      {
        "label": "LLY",
        "ticker": "LLY",
        "market": "US",
        "direction": "up",
        "rationale": "1,231.94달러 +3.9% 강세 후 GLP-1 파이프라인 확장·CPI 대기 속 실질금리 하락 시나리오가 헬스케어 리레이팅 카운터, 방어주 순환매 흐름이 프리미엄 방어 축",
        "result": "hit",
        "actual": 0
      }
    ]
  },
  {
    "date": "2026-08-11",
    "made": "2026-08-11 07:31 KST",
    "predictions": [
      {
        "label": "LIG넥스원",
        "ticker": "079550",
        "market": "KR",
        "direction": "up",
        "rationale": "823,000원 마감 +11.1% 급등 후 사우디 WDS 2026 오늘 마지막날 대형 계약 서명 대기·SAMI·GAMI 현지 생산 협력·비궁 유도로켓 FCT 통과 3중 카운터가 프리미엄 확장 축",
        "result": "miss",
        "actual": -7.7
      },
      {
        "label": "알테오젠",
        "ticker": "196170",
        "market": "KR",
        "direction": "down",
        "rationale": "348,000원 마감 +14.1% 급등 후 7거래일 연속 상승 피로도 축적·차익실현 압력 대기, 블랙록 매입 서사도 단기 소진 국면",
        "result": "hit",
        "actual": -5.9
      },
      {
        "label": "CRWV",
        "ticker": "CRWV",
        "market": "US",
        "direction": "up",
        "rationale": "오늘 AMC Q2 실적 발표·매출 컨센 26억달러·백로그 994억달러·NVDA 5,000억달러 AI 인프라 파이낸싱 후방 카운터가 서프라이즈 카드",
        "result": "miss",
        "actual": -2.7
      }
    ]
  },
  {
    "date": "2026-08-11",
    "made": "2026-08-10 07:35 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "반도체특별법 8/11 시행 D-1·주주환원 확대 기대·8월 -12% 조정 후 방어 국면에서 정책 카운터가 반등 축",
        "result": "hit",
        "actual": -0.4
      },
      {
        "label": "현대자동차",
        "ticker": "005380",
        "market": "KR",
        "direction": "up",
        "rationale": "7월 미 판매 사상 최대 8.9만대·하이브리드 +52%·8/26 인베스터 데이 대기가 이번 주 회복 카운터 축",
        "result": "hit",
        "actual": 3.2
      },
      {
        "label": "AVGO",
        "ticker": "AVGO",
        "market": "US",
        "direction": "up",
        "rationale": "NVDA 랠리 동조·FY26 AI 매출 56억달러 가이던스 유지·SaaS 리레이팅과 병존 시나리오가 프리미엄 방어 축",
        "result": "hit",
        "actual": -0.2
      }
    ]
  },
  {
    "date": "2026-08-08",
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
  }
];
