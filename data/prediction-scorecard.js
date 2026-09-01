// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
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
  },
  {
    "date": "2026-08-27",
    "made": "2026-08-27 07:40 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 261,500원 +1.8%·8월 이사회 100조원 환원안 임박 시나리오 축·간밤 글로벌 AI 반도체 대장 Q2 매출 962억달러·데이터센터 +117% YoY 서프라이즈 확인이 HBM 대장 리레이팅 최대 카타리스트·SK하이닉스 40조 자사주 소각 후 삼성 후속 환원 기대 병존·외국인 반도체 순매수 지속 근거",
        "result": "hit",
        "actual": 3.4
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 213.05달러 +2.2%·Q2 FY27 매출 962억달러 컨센 924억 상회·EPS 2.22달러 컨센 2.09 상회·데이터센터 890억 +117% YoY 사이클 축·Q3 가이던스 1,080억달러 컨센 42억 상회 조합이 AI CAPEX 재가속 최대 카타리스트·AWS 200만 GPU 조달 계약 병존이 하이퍼스케일러 락인 근거·시간외 랠리 지속 시나리오 트리거",
        "result": "miss",
        "actual": -1.6
      },
      {
        "label": "알테오젠",
        "ticker": "196170",
        "market": "KR",
        "direction": "down",
        "rationale": "직전 거래일 종가 311,500원 +32.6% 급등·30% 무상증자 신주 1,606만주 8/26 추가 상장 첫날 유동성 확대 축·급등 후 차익 실현 사이클 진입 시나리오 최대 트리거·MSD 로열티 여진 소화 국면 카운터·바이오 대형주 카테고리 순환 조정 병존이 forward 단기 조정 근거·8월 누계 +40% 랠리 후 기술적 반락 시그널",
        "result": "miss",
        "actual": 1
      }
    ]
  },
  {
    "date": "2026-08-26",
    "made": "2026-08-26 07:32 KST",
    "predictions": [
      {
        "label": "두산에너빌리티",
        "ticker": "034020",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 80,700원 +10.5% 급등·美 웨스팅하우스 지분 공동 인수 제안 사이클이 원전 대장주 리레이팅 최대 트리거·체코 두코바니·테라파워 SMR 3중 모멘텀 병존·8월 원전·건설 인덱스 +17% 랠리 편승 근거·기관·외국인 동시 매수 여진 지속 축",
        "result": "hit",
        "actual": 6.3
      },
      {
        "label": "AVGO",
        "ticker": "AVGO",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 357.7달러 +0.3% 소폭 반등·오늘 밤 NVDA Q2 실적 D-Day 상회 여부가 AI 반도체 카테고리 편승 최대 카타리스트·데이터센터 매출 컨센 750억달러+ 근거·8월 SOXX +10% 트랙 유지 축·잭슨홀 D-2 앞 리스크 프리셋 완료 국면 지지",
        "result": "miss",
        "actual": -0.6
      },
      {
        "label": "VST",
        "ticker": "VST",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 140.16달러 +0.8% 강세·美 원전 확대 서사·데이터센터 전력 CAPEX 사이클이 IPP 리더 forward 프리미엄 근거·웨스팅하우스 지분 공동 인수 제안이 원전 카테고리 리레이팅 축·10년물 4.658% 하락이 유틸 카테고리 편승 지지",
        "result": "hit",
        "actual": 2.5
      }
    ]
  },
  {
    "date": "2026-08-25",
    "made": "2026-08-25 07:40 KST",
    "predictions": [
      {
        "label": "알테오젠",
        "ticker": "196170",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 320,500원·상반기 매출 1,405억원·영업이익 735억원·순이익 1,013억원 견고·BlackRock 지분 확대·코스닥 +2.2% 반등 로테이션 지속 사이클이 성장주 프리미엄 카운터·삼성 여진 소화 국면 대안 자금 흡수 축",
        "result": "miss",
        "actual": -4.7
      },
      {
        "label": "POSCO홀딩스",
        "ticker": "005490",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 327,500원 +5.6% 강세·중국 조강 CAPEX 확대·철광석 +21% 폭등 후방 서사·이란 제재 확대 후 조선·인프라 카테고리 반사 수혜 사이클이 철강 리더 forward 프리미엄 근거·기관 순매수 재개 축",
        "result": "hit",
        "actual": 1.4
      },
      {
        "label": "PLTR",
        "ticker": "PLTR",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 175.63달러 -0.1% 보합·JPM Palantir '군의 AI 두뇌' 커버리지 확장·이란 제재 강화 방산·AI 인프라 후방 수혜 사이클·잭슨홀 D-3 앞 위험선호 회복 기대가 forward 프리미엄 카운터",
        "result": "miss",
        "actual": -2.3
      }
    ]
  },
  {
    "date": "2026-08-24",
    "made": "2026-08-22 07:21 KST",
    "predictions": [
      {
        "label": "KB금융",
        "ticker": "105560",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 164,300원 +2.7% 상승·밸류업 프로그램 상단 확장·주주환원 확대 서사·외국인 유가증권 2.2조원 순매수 이틀차 여진 조합이 은행 카테고리 리더십 축·forward P/B 0.6배 프리미엄 회복 사이클이 월요일 강세 카운터",
        "result": "hit",
        "actual": 2.7
      },
      {
        "label": "NAVER",
        "ticker": "035420",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 222,000원 +1.1%·플랫폼 카테고리 회복·AI 검색 커머스 로테이션 지속이 forward 매출 근거 축·워시 잭슨홀 D-6 완화 시나리오 대기가 성장주 프리미엄 재확장 카운터",
        "result": "hit",
        "actual": 1.1
      },
      {
        "label": "COIN",
        "ticker": "COIN",
        "market": "US",
        "direction": "up",
        "rationale": "직전 종가 172.35달러 +7.6% 급등·비트코인 77,860달러 주간 +22% 2024년 3월 이후 최대 랠리·트럼프 CLARITY Act 통과 촉구·SEC 프레임워크 규제 정합성 회복 조합이 크립토 관련주 리더십 축·주말 유동성 얇음 리스크 카운터",
        "result": "hit",
        "actual": 8.2
      }
    ]
  }
];
채점 완료: 2026-09-01 기준 변경된 항목 있음
