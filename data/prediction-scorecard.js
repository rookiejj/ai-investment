// 예측 스코어카드 — 하루 3종목 방향 예측 + 당일 prices-snapshot 자동 채점
// 최신순, 최대 7건. 에이전트가 매일 prepend + 채점 + 트리밍.
//
// direction: "up" | "down"
// result:    null(채점 전) | "hit" | "miss"
//   hit  — 예측 방향 일치 (|actual| ≥ 0.5%) OR 소폭 움직임 (|actual| < 0.5%)
//   miss — 예측 방향 반대 (|actual| ≥ 0.5%)
const PREDICTION_SCORECARD = [
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
        "result": null,
        "actual": null
      },
      {
        "label": "POSCO홀딩스",
        "ticker": "005490",
        "market": "KR",
        "direction": "up",
        "rationale": "직전 거래일 종가 327,500원 +5.6% 강세·중국 조강 CAPEX 확대·철광석 +21% 폭등 후방 서사·이란 제재 확대 후 조선·인프라 카테고리 반사 수혜 사이클이 철강 리더 forward 프리미엄 근거·기관 순매수 재개 축",
        "result": null,
        "actual": null
      },
      {
        "label": "PLTR",
        "ticker": "PLTR",
        "market": "US",
        "direction": "up",
        "rationale": "직전 거래일 종가 175.63달러 -0.1% 보합·JPM Palantir '군의 AI 두뇌' 커버리지 확장·이란 제재 강화 방산·AI 인프라 후방 수혜 사이클·잭슨홀 D-3 앞 위험선호 회복 기대가 forward 프리미엄 카운터",
        "result": null,
        "actual": null
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
  },
  {
    "date": "2026-08-19",
    "made": "2026-08-19 07:25 KST",
    "predictions": [
      {
        "label": "삼성전자",
        "ticker": "005930",
        "market": "KR",
        "direction": "up",
        "rationale": "화요일 268,500원 -2.2% 갭업 후 차익실현 반락 마감·외국인 1,767억원 순매수 지지·HBM3E 12H 양산 램프·마이크론 +4.1% D램 슈퍼사이클 후행 랠리 조합이 반등 축·필라델피아 반도체지수 강세 후행이 대장주 회복 카운터",
        "result": "miss",
        "actual": -7.8
      },
      {
        "label": "삼성SDI",
        "ticker": "006400",
        "market": "KR",
        "direction": "up",
        "rationale": "화요일 488,000원 -5.4% 급락 여진 오버솔드·리튬 카보네이트 21달러대 안정·IRA 8월 말 종료 앞두고 밀어내기 수요 재개 관측·2차전지 대장주 낙폭 확대 이후 기술적 반등 국면 카운터",
        "result": "hit",
        "actual": -0.2
      },
      {
        "label": "MU",
        "ticker": "MU",
        "market": "US",
        "direction": "up",
        "rationale": "월요일 1,011.75달러 +4.1% 강세 마감·HBM 후행 랠리·D램 슈퍼사이클 확장 사이클·9/22 Q4 실적 D-33 대기·엔비디아 8/26 실적 D-7 카탈리스트 조합이 forward 매수세 지속 근거",
        "result": "miss",
        "actual": -7
      }
    ]
  },
  {
    "date": "2026-08-18",
    "made": "2026-08-18 07:30 KST",
    "predictions": [
      {
        "label": "SK하이닉스",
        "ticker": "000660",
        "market": "KR",
        "direction": "up",
        "rationale": "1,645,000원 +3.3% 월요일 마감·8월 상순 반도체 수출 100억달러 +155% 잠정치 HBM 슈퍼사이클 확정 축·외국인 5거래일 연속 순매수·HBM4 램프·데이터센터 CAPEX 730억달러+ 커밋이 지속 강세 카운터",
        "result": "hit",
        "actual": 1
      },
      {
        "label": "LG이노텍",
        "ticker": "011070",
        "market": "KR",
        "direction": "up",
        "rationale": "654,000원 +6.3% 월요일 마감·MSCI 한국지수 8/26 8월 리밸런싱 신규 편입 후보 진입·애플 폴더블 아이폰 카메라 모듈 락인·기판 가격 인상 서사가 forward 매출 재확장 카운터",
        "result": "miss",
        "actual": -3.2
      },
      {
        "label": "NVDA",
        "ticker": "NVDA",
        "market": "US",
        "direction": "up",
        "rationale": "225.04달러 프리마켓 226달러 안정·8/26 Q2 실적 D-8 컨센 매출 918억달러·EPS 2.06달러·Blackwell Ultra 램프·Rubin 로드맵·하이퍼스케일러 CAPEX 730억달러+ 커밋이 프리미엄 방어 축",
        "result": "hit",
        "actual": -0.1
      }
    ]
  },
  {
    "date": "2026-08-17",
    "made": "2026-08-14 19:40 KST",
    "predictions": [
      {
        "label": "현대차",
        "ticker": "005380",
        "market": "KR",
        "direction": "up",
        "rationale": "453,000원 +8.2% 8/14 마감·자동차 관세 15% 인하로 4조원 이상 비용 절감 기대·8/26 인베스터 데이 대기가 모멘텀 카운터, HMGMA 미국 가동 확대·현지 생산 상향 서사가 마진 회복 축",
        "result": "hit",
        "actual": 8.2
      },
      {
        "label": "LG에너지솔루션",
        "ticker": "373220",
        "market": "KR",
        "direction": "up",
        "rationale": "369,500원 +1.1% 8/14 마감·반도체 편중 완화로 배터리 순환매 확산 국면·북미 ESS 수주 흑자 전환 궤도 지속이 리레이팅 축, 미 IRA 유지 시나리오와 실질금리 하락이 배터리 프리미엄 방어 근거",
        "result": "hit",
        "actual": 1.1
      },
      {
        "label": "마이크론",
        "ticker": "MU",
        "market": "US",
        "direction": "up",
        "rationale": "961.21달러 +1.2% 강세·AMAT record 매출과 8월 상순 반도체 수출 155% 급증이 HBM·DRAM 판가 인상 사이클 검증 축, 엔비디아 8/26 실적 D-12 카운트다운이 반도체 프리미엄 방어 카운터",
        "result": "hit",
        "actual": 2.3
      }
    ]
  }
];
