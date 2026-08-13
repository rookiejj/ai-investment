// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
  {
    "date": "2026-08-14",
    "made": "2026-08-14 07:31 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 종가 268,000원 사상 최고·8월 상순 반도체 수출 99.5억달러 +155% 역대 최대·야간 미증시 S&P 500 7,800 첫 돌파·연준 9월 동결 시나리오 확정이 프리마켓 강세 지속 카운터, 원달러 1,410원대 유지가 외국인 순매수 자기강화 사이클",
        "result": null,
        "actual": null
      },
      {
        "label": "한화오션",
        "ticker": "042660",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 종가 90,700원 +0.7%·미 해군 MRO 2건 3개월 만 작년 초과·VLCC 3척 5,722억원 수주·2026 외국인 최대 순매수 종목 유지가 조선주 순환매 확산 카운터, MASGA·SHIPS Act 지속 서사가 K-조선 상단 축",
        "result": null,
        "actual": null
      },
      {
        "label": "AMAT",
        "ticker": "AMAT",
        "market": "US",
        "direction": "up",
        "rationale": "507.97달러 시간외 -5% 조정 후 되돌림 기대·Q3 매출 91.2억달러 컨센 상회·EPS $3.50 컨센 $3.36 상회·record OP 30.8억달러·2026 반도체 장비 성장 30%+ 상향 가이던스가 재평가 축, HBM·advanced packaging 재확대 사이클과 결합해 후방 매출화 지속",
        "result": null,
        "actual": null
      }
    ]
  },
  {
    "date": "2026-08-14",
    "made": "2026-08-13 19:45 KST",
    "predictions": [
      {
        "label": "SK하이닉스",
        "ticker": "000660",
        "market": "KR",
        "direction": "up",
        "rationale": "1,593,000원 +5.9% 오늘 사상 최고·CoreWeave·Nebius 실적 서프라이즈 후방·HBM4 전환 서사 확산·외국인 2.4조 순매수 폭발이 익일 추가 강세 카운터, 미 CPI 부합·연준 9월 동결 시나리오가 성장주 프리미엄 확장",
        "result": "hit",
        "actual": 5.9
      },
      {
        "label": "이수페타시스",
        "ticker": "007660",
        "market": "KR",
        "direction": "up",
        "rationale": "96,800원 +7.4% 오늘 폭등·AI 기판 쇼티지 재확인·대구 5공장 증설 완료·목표주가 상향이 후속 매수 축, AI 서버 CAPEX 초확대 사이클과 결합해 하이퍼스케일러 후방 수혜 지속",
        "result": "hit",
        "actual": 7.4
      },
      {
        "label": "HUBB",
        "ticker": "HUBB",
        "market": "US",
        "direction": "up",
        "rationale": "$548.18 +6.9% 오늘 급등·Q2 매출 17.1억달러·EPS $5.52 컨센 상회·FY26 가이던스 상향이 전력 인프라 리레이팅 축, AI 데이터센터 CAPEX 초확대 사이클과 결합해 전력 유틸 후방 매출화 지속",
        "result": "miss",
        "actual": -1.1
      }
    ]
  },
  {
    "date": "2026-08-13",
    "made": "2026-08-13 07:15 KST",
    "predictions": [
      {
        "label": "한화에어로스페이스",
        "ticker": "012450",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 종가 1,156,000원 +5.3%·아리온스멧 496억원 8월 양산 계약·비츠로넥스텍 누리호 엔진 535억원 후속 발주가 K-방산 미래전력 카테고리 진입 서사 축, 방산 순환매 재개·NATO 국방예산 확장 사이클이 익일 강세 카운터",
        "result": "hit",
        "actual": 2.5
      },
      {
        "label": "HD현대중공업",
        "ticker": "329180",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 종가 496,000원·상반기 수주 148억달러가 연간 목표 204억달러의 72% 조기 달성·수주잔고 609억달러 견고·원달러 1,415원 10개월 최저가 마진 방어 축, 조선주 상대적 부진 해소 국면이 반등 카드",
        "result": "hit",
        "actual": 0
      },
      {
        "label": "CRWV",
        "ticker": "CRWV",
        "market": "US",
        "direction": "up",
        "rationale": "$103.83 시간외 +14% 급등·Q2 매출 25.75억달러 +112% 컨센 상회·백로그 6주 만에 1,042→1,292억달러로 250억달러 추가 계약 서프라이즈, CPI 부합·연준 동결 시나리오가 성장주 프리미엄 재확산 카운터",
        "result": "miss",
        "actual": -2.9
      }
    ]
  },
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
        "result": "hit",
        "actual": 6.7
      },
      {
        "label": "LG전자",
        "ticker": "066570",
        "market": "KR",
        "direction": "down",
        "rationale": "205,000원 +13.1% 폭등 마감·엔비디아 CDU 인증 확보 리레이팅 후 단기 급등분 소화 국면·이수페타시스·삼성전기 등 어제 급등주 되돌림 패턴이 익일 조정 카운터",
        "result": "miss",
        "actual": 13.1
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "218.06달러 마감·CoreWeave Q2 매출 +112%·백로그 1,040억달러 서프라이즈가 AI 인프라 서사 재확산, 오늘 밤 CPI 컨센 부합 시 성장주 프리미엄 재확장 카운터",
        "result": "hit",
        "actual": -0.2
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
  }
];
