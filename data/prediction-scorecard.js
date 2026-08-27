// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
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
        "result": null,
        "actual": null
      },
      {
        "label": "CRWD",
        "ticker": "CRWD",
        "market": "US",
        "direction": "down",
        "rationale": "직전 거래일 종가 225.57달러 +19.2% 급등·Q2 실적 서프라이즈·ARR 가이던스 630bp 상향 카타리스트 소화 사이클 축·post-earnings 대형 갭업 후 차익 실현 패턴 트리거·사이버보안 그룹(OKTA +29·PANW +13.3·ZS +10.1) 동반 대형 랠리 후 순환 조정 시나리오·forward P/E 프리미엄 부담이 short-term 카운터 근거",
        "result": null,
        "actual": null
      },
      {
        "label": "SMR",
        "ticker": "SMR",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 9.725달러 +4.9% 강세·AI 데이터센터 전력 수요 카테고리 확산 축·엔비디아 Q2 서프라이즈 후방 원전·SMR 카테고리 편승 트리거·미 국방부 우라늄 농축 계약·X-energy 상용 계약 서사 유지·OKLO +3.8%·LEU +4.6% 카테고리 그룹 랠리 병존이 forward 카테고리 확산 근거",
        "result": null,
        "actual": null
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
  },
  {
    "date": "2026-08-21",
    "made": "2026-08-21 07:26 KST",
    "predictions": [
      {
        "label": "삼양식품",
        "ticker": "003230",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 1,397,000원 +7.1% 급등·K-food 카테고리 라면·불닭 미국·유럽 매출 사상 최대 서사·2Q 영업이익 컨센 상회 여진이 momentum 축·코스피 반등 이틀차 순환매 소비주 확산 카운터",
        "result": "miss",
        "actual": -2.2
      },
      {
        "label": "이수페타시스",
        "ticker": "377300",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 44,950원 +9.0% 급등·HBM 기판 카테고리 확장·SK하이닉스·삼성전자 40조·100조 주주환원 서사 후방 수혜·NVDA Q2 D-5 데이터센터 매출 750억달러+ 컨센 대기가 반도체 후방 lock-in 축",
        "result": "miss",
        "actual": -5.5
      },
      {
        "label": "TSLA",
        "ticker": "TSLA",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 $345.95·Austin Cybercab 로보택시 8월 말 공공 배치 임박·St. Elmo Road 무선충전 허브·80대 설치 계획·Gigafactory Texas 연 12.5만대 생산 능력이 자율주행 상용화 실체화 축·다우 -703pt 급락 후 리스크 리셋 카운터",
        "result": "miss",
        "actual": -1.7
      }
    ]
  },
  {
    "date": "2026-08-20",
    "made": "2026-08-20 07:28 KST",
    "predictions": [
      {
        "label": "한화에어로스페이스",
        "ticker": "012450",
        "market": "KR",
        "direction": "up",
        "rationale": "수요일 종가 1,177,000원 +2.7% 코스피 -5.8% 급락 유일 강세·미 육군 Mobile Tactical Cannon 프로토타입 계약·K9PL 폴란드 2차·유럽·중동 backlog 100조 조합이 방산 로테이션 momentum 축·지정학 리스크 프리미엄 확장 카운터",
        "result": "miss",
        "actual": -0.8
      },
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "수요일 종가 247,500원 -7.8% oversold·오늘 JP모건 아시아 테크 투어 IR 개막·씨티 코리아 인베스터 컨퍼런스·HBM4 램프·엔비디아 승인 스케줄·미 30년물 -9bp 5.196% 반락 완화가 반등 트리거 축·야간선물 -3.7% 여진은 카운터",
        "result": "hit",
        "actual": 9.5
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "수요일 종가 218.14달러 +0.3% 강보합·Q2 FY27 실적 8/26 D-6·컨센 매출 918~950억달러·데이터센터 250억달러+·Blackwell Ultra 램프·재무부 buyback 확대 30년물 반락이 성장주 프리미엄 회복 축·마이클 버리 숏 여진 카운터",
        "result": "miss",
        "actual": -1
      }
    ]
  }
];
