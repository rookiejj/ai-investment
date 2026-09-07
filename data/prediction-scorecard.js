// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
  {
    "date": "2026-09-08",
    "made": "2026-09-08 07:40 KST",
    "predictions": [
      {
        "label": "SK하이닉스",
        "ticker": "000660",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 1,783,000원 +8.3% 급등·카운터포인트 HBM4 SK 50% 점유·엔비디아 물량 70% 확보 서사 유지·삼성·SK D램 재고 10일 하방으로 공급 병목 상단 축·외국인 1조3,714억원 순매수 화요일 매수 지속 기대·미 증시 리오픈 반도체 카테고리 상단 연동 시나리오",
        "result": null,
        "actual": null
      },
      {
        "label": "MU",
        "ticker": "MU",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 1,016.59달러 +6.1% 강세·HBM4 세대 전환 카테고리 리레이팅 축·엔비디아 Vera Rubin 1분기 상용 진입 서사 유지·SK하이닉스 178만원 +8.3% 폭등 후방 사이클 확인·미 증시 화요일 리오픈 나스닥 선물 +0.9% 회복 편승·오라클 9/10 Q1 실적 대기 카타리스트",
        "result": null,
        "actual": null
      },
      {
        "label": "LG에너지솔루션",
        "ticker": "373220",
        "market": "KR",
        "direction": "down",
        "rationale": "직전 거래일 종가 362,500원 +1.1% 소폭 상승 국면·유가 93달러 급등·지정학 프리미엄 확대가 이차전지 카테고리 카운터 축·미 매파 재부각 확률 50/50·달러 강세 재부각 시나리오·8월 CPI 상방 리스크 대기·이차전지 이익실현 재부각 시나리오",
        "result": null,
        "actual": null
      }
    ]
  },
  {
    "date": "2026-09-07",
    "made": "2026-09-04 07:40 KST",
    "predictions": [
      {
        "label": "한화오션",
        "ticker": "042660",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 86,500원 +5.5% 급등·대만 양밍해운 LNG 이중연료 컨선 6척 1.55조원 수주 소식이 조선 3사 동반 강세 카타리스트·삼성중공업 +8.6%·HD한국조선해양 +4.4% 후방 사이클 확인이 카테고리 리레이팅 축·미 함정 MRO 사이클·트럼프 알래스카 LNG 프로젝트 서사 유지가 forward 상단 근거·다음 거래일 순환매 연속성 기대",
        "result": "hit",
        "actual": 0.6
      },
      {
        "label": "삼성화재",
        "ticker": "000810",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 702,000원 +6.8% 급등·자사주 소각·배당 확대·주주환원 강화 기대 카타리스트·KB금융 +5.2% 등 금융지주 카테고리 순환매 후방 검증·밸류업 프로그램 후속 재점화 축·손보 1위·자산운용 실적 재평가 서사 유지가 forward 상단 근거·다음 거래일 강세 연속 시나리오",
        "result": "miss",
        "actual": -1.1
      },
      {
        "label": "MSFT",
        "ticker": "MSFT",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 500.10달러 +0.7% 반등·프로미넌트 셀사이드 브로커리지 목표가 상향·AI 인프라 CAPEX 실행 리스크 감소 서사 확산이 카타리스트·Azure·Copilot 사이클로 회계연도 기록 마감·S&P·나스닥 3대 지수 랠리 편승·국채금리 진정에 위험선호 회복 국면 지속 근거가 forward 방향 지지",
        "result": "miss",
        "actual": -2
      }
    ]
  },
  {
    "date": "2026-09-03",
    "made": "2026-09-03 07:20 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 250,500원 -4% 급락 뒤 오버셀 반등 시나리오·브로드컴 Q3 AI 반도체 매출 167억달러 +221% 확인이 HBM 후방 리레이팅 트리거·미 3대 지수 반등 마감 편승 재료·8월 반도체 수출 사상 최고·자사주 매입 카드 지지가 forward 카테고리 근거",
        "result": "miss",
        "actual": -4
      },
      {
        "label": "LG에너지솔루션",
        "ticker": "373220",
        "market": "KR",
        "direction": "down",
        "rationale": "직전 거래일 종가 347,500원 -5.3% 조정·2차전지 카테고리 이익실현 이틀째 지속·매파 확률 66% 재점화 국면·강달러·유가 상승 매크로 파도 카운터·9월 4일 미 고용지표 대기 위험선호 축소 시나리오·순환 조정 여진 지속 근거",
        "result": "hit",
        "actual": -5.3
      },
      {
        "label": "AVGO",
        "ticker": "AVGO",
        "market": "US",
        "direction": "down",
        "rationale": "직전 거래일 종가 369.5달러 보합·Q3 매출 296억달러·EPS 3.32달러 컨센 상회에도 Q4 가이던스 348억달러 컨센 350억달러 소폭 하회로 시간외 -3.49%(354.43달러) 되돌림·커스텀 실리콘 카테고리 밸류 재조정 사이클 진입·순환 이익실현 시나리오",
        "result": "hit",
        "actual": -1.8
      }
    ]
  },
  {
    "date": "2026-09-02",
    "made": "2026-09-02 07:20 KST",
    "predictions": [
      {
        "label": "HD현대중공업",
        "ticker": "329180",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 453,000원 +0.8% 강보합·수주잔고 609억달러·MASGA 정책 후방·미 해군 MRO 추가 사이클이 조선 카테고리 지지 근거·필리조선소 State of Maine 명명식 후속 서사가 카테고리 리레이팅 축·인프라 순환매 재개 관측",
        "result": "hit",
        "actual": 0.8
      },
      {
        "label": "한화에어로스페이스",
        "ticker": "012450",
        "market": "KR",
        "direction": "down",
        "rationale": "직전 거래일 종가 1,058,000원 -4% 급락 이후 방산 카테고리 차익매물 확산 지속 관측·8월 랠리 후 첫 큰 조정 국면 진입·9월 4일 미 8월 고용지표 대기 매크로 카운터·유럽 방산 예산 확대 서사에도 단기 이익 실현 우세",
        "result": "hit",
        "actual": -4
      },
      {
        "label": "TSLA",
        "ticker": "TSLA",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 362.59달러 -1.5% 조정 이후 반등 시도·Model 3 가격 인하 카드·Robotaxi 확장 로드맵·Q3 배송 사이클 개시 근거·노동절 후 첫 세션 위험 선호 재조정·Optimus 상용화 로드맵이 중기 상단 축",
        "result": "hit",
        "actual": -0.2
      }
    ]
  },
  {
    "date": "2026-09-01",
    "made": "2026-09-01 07:25 KST",
    "predictions": [
      {
        "label": "엘앤에프",
        "ticker": "066970",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 146,700원 +8.8% 급등·2차전지 순환매 3거래일 확산 사이클 축·테슬라 공급망 재점화 시나리오 강화·포스코퓨처엠 +7.6%·삼성SDI +1.1% 그룹 랠리 편승 근거·NCMA 양극재 카테고리 리레이팅 트리거·미 ESS 수주 확대 관측이 forward 카테고리 지지 축·외국인 순매수 확대 근거",
        "result": "miss",
        "actual": -6.2
      },
      {
        "label": "GOOGL",
        "ticker": "GOOGL",
        "market": "US",
        "direction": "down",
        "rationale": "직전 거래일 종가 337.17달러 -2.7% 조정·반독점 리스크 재부각 사이클 축·검색 카테고리 재평가 국면 지속 근거·AMZN -2.5%·MSFT -0.9% 메가캡 그로스 로테이션 소화 트리거·9월 FOMC 3주 카운트다운 국면·9월 4일 미 고용지표 대기 카운터·매파 여진 후 프리미엄 재조정 여지가 forward 카테고리 카운터 근거",
        "result": "hit",
        "actual": 0.1
      },
      {
        "label": "XOM",
        "ticker": "XOM",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 160.74달러 +2.6% 강세·유가 회복 편승 사이클 축·OPEC+ 9월 회의 감산 결정 관측이 forward 카타리스트·CVX +2.5%·SLB +3.6% 에너지 카테고리 순환매 재개 근거·WTI 82.82달러 상단 지지 유지 트리거·매파 여진 후 실물 자산 로테이션 축·Q2 순이익 145억달러 전년 2배 서사 유지가 forward 상단 근거",
        "result": "hit",
        "actual": 0.2
      }
    ]
  },
  {
    "date": "2026-08-31",
    "made": "2026-08-29 07:45 KST",
    "predictions": [
      {
        "label": "SK하이닉스",
        "ticker": "000660",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 1,653,000원 -4.4% 급락·전날 6,912 사상 최고 랠리 소화 국면 확인·NVDA Q2 서프라이즈 후 익일 대반전 카운터 소화 국면·40조 자사주 소각 사이클·HBM3E 12H 신제품 카탈리스트 사이클 지지·오버셀 반등 시나리오가 forward 카테고리 지지 축·외국인 대규모 매도 소화 후 월요일 반등 근거",
        "result": "hit",
        "actual": 1.3
      },
      {
        "label": "MRVL",
        "ticker": "MRVL",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 215.88달러 -10.6% 급락·Q2 매출 27.4억달러·조정 EPS 0.94달러 컨센 상회에도 실적 후 대형 갭다운 오버셀 사이클 축·Q3 가이던스 31.5억달러 상향 카타리스트 유지·AI 커스텀 실리콘 부킹 사이클 근거·post-earnings 과매도 반등 패턴 트리거·AVGO 9/4 실적 대기 사이클 지지가 forward 카테고리 근거",
        "result": "miss",
        "actual": -2.6
      },
      {
        "label": "MSTR",
        "ticker": "MSTR",
        "market": "US",
        "direction": "down",
        "rationale": "직전 거래일 종가 127.09달러 -7.5% 급락·비트코인 79,560달러 하회·전일 81,200달러 강세에서 대반전 국면 확인·Warsh 잭슨홀 매파 발언 후 크립토 위험 선호 재조정 사이클 축·9월 인상 확률 57.5% 급등 카운터·달러 강세·실질금리 압력이 forward 크립토 카테고리 카운터 근거·MSTR 프록시 하락 사이클 지속 시나리오",
        "result": "hit",
        "actual": -1.1
      }
    ]
  },
  {
    "date": "2026-08-28",
    "made": "2026-08-28 07:25 KST",
    "predictions": [
      {
        "label": "포스코퓨처엠",
        "ticker": "003670",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 184,000원 +9.1% 급등·미 전력망 확충 ESS 수요 확대 관측·2차전지 양극재 수직계열화 카테고리 리레이팅 사이클 축·삼성SDI +10.3%·LG엔솔 +5.6% 그룹 랠리 편승·외국인 순매수 확대 근거·중국 전력망 축출 반사이익 서사 유지가 forward 카테고리 확산 카타리스트",
        "result": "hit",
        "actual": 2.3
      },
      {
        "label": "CRWD",
        "ticker": "CRWD",
        "market": "US",
        "direction": "down",
        "rationale": "직전 거래일 종가 225.57달러 +19.2% 급등·Q2 실적 서프라이즈·ARR 가이던스 630bp 상향 카타리스트 소화 사이클 축·post-earnings 대형 갭업 후 차익 실현 패턴 트리거·사이버보안 그룹(OKTA +29·PANW +13.3·ZS +10.1) 동반 대형 랠리 후 순환 조정 시나리오·forward P/E 프리미엄 부담이 short-term 카운터 근거",
        "result": "miss",
        "actual": 20.5
      },
      {
        "label": "SMR",
        "ticker": "SMR",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 9.725달러 +4.9% 강세·AI 데이터센터 전력 수요 카테고리 확산 축·엔비디아 Q2 서프라이즈 후방 원전·SMR 카테고리 편승 트리거·미 국방부 우라늄 농축 계약·X-energy 상용 계약 서사 유지·OKLO +3.8%·LEU +4.6% 카테고리 그룹 랠리 병존이 forward 카테고리 확산 근거",
        "result": "hit",
        "actual": 5.1
      }
    ]
  }
];
