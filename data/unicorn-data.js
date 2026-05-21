const data = [
  {
    "tag": "결제·뱅킹·HR·SMB",
    "title": "💳 핀테크",
    "stocks": [
      {
        "nm": "Stripe",
        "rs": "$159B 텐더 +74% YoY 베이스 - Tempo L1 메인넷 가동·Visa·Nubank·Klarna 테스트·결제 인프라 1위·TPV $1.9T·2H 2026 IPO 윈도우 잔존도 IPO 보류 시그널 잔존",
        "ipo": "2H 2026 윈도우",
        "val": "$159B",
        "round": "2/26 텐더오퍼",
        "sector": "결제"
      },
      {
        "nm": "Revolut",
        "rs": "2H 2026 세컨더리 $100B+ 진행 - 향후 IPO 타깃 $150~200B 범위·11월 2025 세컨더리 $75B 대비 2.6배·3/11 영국 PRA 풀 뱅킹 라이센스 후 모기지·소비자 신용 진입·CEO Storonsky 'NASDAQ 美 상장 1순위' 공식 입장",
        "ipo": "2028+ 연기",
        "val": "$75B",
        "round": "세컨더리 2H26 $100B+",
        "sector": "네오뱅크"
      },
      {
        "nm": "Ramp",
        "rs": "법인카드·지출관리·ARR $1B+",
        "ipo": "미정",
        "val": "$32B",
        "round": "Series F ($300M)",
        "sector": "법인 핀테크"
      },
      {
        "nm": "Plaid",
        "rs": "Q2 2026 IPO $6.1B 타깃 - 26년 핀테크 인프라 단독 최대 IPO 카운트다운·4월 텐더 $8B 모멘텀 회복·GS 리드 인수단·오픈뱅킹·연결 인프라 단일 채널 지배력·美·英·EU 동시 트랙",
        "ipo": "2026 Q2",
        "val": "$8B",
        "round": "텐더오퍼 (업라운드)·GS 리드",
        "sector": "핀테크 인프라"
      },
      {
        "nm": "Gusto",
        "rs": "SMB HR·급여 30만 고객·2023 FCF 양전환",
        "ipo": "미정 (IPO 후보)",
        "val": "$10B",
        "round": "Series F ($175M, 2025-10)",
        "sector": "HR·급여 핀테크"
      },
      {
        "nm": "Checkout.com",
        "rs": "피크 $40B→$12B 재평가·2025 흑자 전환·유럽 최대 독립 게이트웨이",
        "ipo": "미정",
        "val": "$12B",
        "round": "세컨더리 (2025-09)",
        "sector": "글로벌 결제"
      },
      {
        "nm": "Mercury",
        "rs": "5/20 Series D $200M $5.2B 클로징 - 14개월 만 +49% 업라운드·a16z·Coatue·Sequoia·CRV·Sapphire·Spark 참여·OCC 조건부 인가 Mercury Bank N.A. 풀 차터 내셔널뱅크 전환 마일스톤·ARR $650M·4년 연속 흑자·누적 펀딩 ~$700M",
        "ipo": "미정",
        "val": "$5.2B",
        "round": "Series D ($200M, 2026-05)·a16z 리드",
        "sector": "SMB 뱅킹·재무관리"
      }
    ]
  },
  {
    "tag": "생산성·AI 개발·협업",
    "title": "🏢 엔터프라이즈 SW",
    "stocks": [
      {
        "nm": "Canva",
        "rs": "ARR $3.3B+·AI 생성 디자인·12월 $134B 업라운드",
        "ipo": "2026 H2 Blackbird 지지",
        "val": "$134B",
        "round": "2025-12 Insight·Fidelity·JPM",
        "sector": "디자인"
      },
      {
        "nm": "Perplexity AI",
        "rs": "AI 검색·Computer 에이전트·ARR $500M +335% YoY",
        "ipo": "2027",
        "val": "$22.6B",
        "round": "Series E-6",
        "sector": "AI 검색"
      },
      {
        "nm": "Notion",
        "rs": "AI 워크스페이스·문서·위키",
        "ipo": "미정",
        "val": "$11B",
        "round": "세컨더리 ($270M)",
        "sector": "생산성"
      },
      {
        "nm": "Discord",
        "rs": "Q1 2026 컴피던셜 S-1 신청·세컨더리 밸류 $15B 책정 - 2025 마지막 펀딩 $15B 베이스 $25B IPO 타깃·MAU 2억+ 단일 동력·Goldman·JPM·Morgan Stanley 주관 라인업·Microsoft 인수 거절 후 단독 상장 트랙",
        "ipo": "2026 H2 목표",
        "val": "$15B",
        "round": "컴피던셜 S-1 (Q1 2026)·GS·JPM·MS",
        "sector": "소셜"
      },
      {
        "nm": "Airtable",
        "rs": "노코드 데이터베이스·자동화",
        "ipo": "미정",
        "val": "$4B",
        "round": "세컨더리 (다운)",
        "sector": "노코드"
      },
      {
        "nm": "Cursor",
        "rs": "SpaceX $60B 옵션·불발 시 $10B 브레이크업·4/24 Business Insider xAI·Mistral 3자 파트너식 협의 보도·Colossus에서 모델 학습 진행 중",
        "ipo": "SpaceX 인수 검토",
        "val": "$60B (SpaceX 옵션)",
        "round": "SpaceX 옵션 계약 (2026-04)",
        "sector": "AI 코딩"
      },
      {
        "nm": "Hugging Face",
        "rs": "Google·NVIDIA·AMD 공동 투자·오픈 AI 모델 허브 표준",
        "ipo": "미정",
        "val": "$4.5B",
        "round": "Series D ($235M, 2023-08)",
        "sector": "오픈소스 AI 허브"
      }
    ]
  },
  {
    "tag": "발사체·자율주행·자율무기·피지컬 AI",
    "title": "🚀 우주·모빌리티·방산",
    "stocks": [
      {
        "nm": "SpaceX",
        "rs": "5/20 S-1 공개 후 로드쇼 6/8 시작으로 슬립·프라이싱 6/11·6/12 Nasdaq 데뷔 목표·티커 SPCX·밸류 $1.75T·조달 $75B 사상 최대 IPO·30% 리테일 ~$22.5B·MS·BofA·Citi·JPM·GS 리드 21개 주관사·Brookfield 5/14 $2B 사전 베팅·S-1 Q1 매출 $4.69B 손실 $4.28B·Starship V3 Flight 12 5/21~22 KST 새벽 발사 윈도우·Pad 2 첫 발사",
        "ipo": "2026.06.11 프라이싱·6/12 Nasdaq 데뷔",
        "val": "$1.75T",
        "round": "5/20 S-1 공개·티커 SPCX·리테일 30%·Brookfield $2B",
        "sector": "우주"
      },
      {
        "nm": "Zipline",
        "rs": "드론 배송·누적 200만 건",
        "ipo": "2027",
        "val": "$7.6B",
        "round": "Series H ($800M)",
        "sector": "드론·물류"
      },
      {
        "nm": "Vast",
        "rs": "민간 우주정거장·NASA 후보·$500M 조달",
        "ipo": "미정",
        "val": "$20B",
        "round": "Series B ($500M, 2026-03)",
        "sector": "우주 인프라"
      },
      {
        "nm": "Relativity Space",
        "rs": "Eric Schmidt CEO·Terran R 2026년 말 첫 발사 목표",
        "ipo": "미정",
        "val": "$4.2B",
        "round": "Angel (Schmidt, 2025-01)",
        "sector": "3D 프린트 로켓"
      },
      {
        "nm": "Waymo",
        "rs": "연 1,500만 트립·11개 도시 확장·자율주행 최대 유니콘",
        "ipo": "미정 (2027 흑자 목표)",
        "val": "$126B",
        "round": "Series D ($16B, 2026-02)",
        "sector": "자율주행 로보택시"
      },
      {
        "nm": "Anduril",
        "rs": "5/13 Series H $5B 조달 확정 $61B 밸류 도달 - 9개월 만 30.5→61B 더블·Thrive Capital·a16z 공동 주도·누적 펀딩 $11.4B·Golden Dome $3.2B + 美 우주군 $1.8B + 美 육군 10년 $20B 한도 계약 누적 수주",
        "ipo": "단기 아님(Luckey)",
        "val": "$61B",
        "round": "Series H $5B (2026-05)",
        "sector": "방산 AI"
      },
      {
        "nm": "Figure AI",
        "rs": "5/13~20 BotQ 시간당 1대 양산 도달·누적 350대 출하·패키지 소팅 50시간 무인 라이브스트림 1차 양보 80%+·Series D $48B 클로징·Amazon 20K + Mercedes 50K 누적 주문 파이프라인 70K+ 유닛 / $14B+ 매출(2029까지)·BMW 공장 90K+ 파트 로딩",
        "ipo": "미정",
        "val": "$48B",
        "round": "Series D 클로징 (2026-04)",
        "sector": "휴머노이드 로봇"
      }
    ]
  },
  {
    "tag": "AI 신약·BCI·디지털 헤심",
    "title": "🧬 바이오·헤심",
    "stocks": [
      {
        "nm": "Insitro",
        "rs": "AI 기반 신약 발굴 플랫폼",
        "ipo": "미정",
        "val": "$2.4B",
        "round": "Series C",
        "sector": "AI 바이오"
      },
      {
        "nm": "Color Health",
        "rs": "유전체·예방의학·AI 진단",
        "ipo": "미정",
        "val": "$4.6B",
        "round": "Series E",
        "sector": "디지털 헤심"
      },
      {
        "nm": "Xaira Therapeutics",
        "rs": "AI 신약 발굴·ARCH·NVIDIA",
        "ipo": "미정",
        "val": "$3.5B",
        "round": "론칭 라운드 ($1.3B)",
        "sector": "AI 바이오"
      },
      {
        "nm": "Neuralink",
        "rs": "12명 이식 완료·양산·Blindsight 시각 복원 착수",
        "ipo": "미정",
        "val": "$9B",
        "round": "Series E ($650M, 2025-06)",
        "sector": "BCI"
      },
      {
        "nm": "Verily",
        "rs": "Alphabet 지분 축소·독립법인 전환·AI 정밀 헤심 플랫폼",
        "ipo": "미정",
        "val": "미공개",
        "round": "Series X ($300M, 2026-03)",
        "sector": "정밀 의료·AI 진단"
      },
      {
        "nm": "Devoted Health",
        "rs": "메디케어 어드밴티지 46.6만 멤버·전년 +121%·29개주·AI 진단",
        "ipo": "미정",
        "val": "$13B",
        "round": "Series F-Prime ($317M, 2026-01)",
        "sector": "메디케어 AI"
      },
      {
        "nm": "Sword Health",
        "rs": "AI 기반 근골격 치료·Hinge 경쟁사·글로벌 확장",
        "ipo": "미정",
        "val": "$3B",
        "round": "Series E ($130M, 2024-06)",
        "sector": "디지털 MSK 치료"
      }
    ]
  },
  {
    "tag": "거래소·인프라·분석·커스터디",
    "title": "₿ 크립토·Web3",
    "stocks": [
      {
        "nm": "Kraken",
        "rs": "크립토 거래소 3위·co-CEO Sethi 공개 확인·Deutsche Börse $200M",
        "ipo": "2026 Q3 목표",
        "val": "$13.3B",
        "round": "IPO 비밀 신청 (4/14)",
        "sector": "크립토 거래소"
      },
      {
        "nm": "Ripple",
        "rs": "4/15 한국 교보생명 토큰화 국채 결제 파트너식·한국 최초 대형 보험사 협업·Citadel 투자",
        "ipo": "IPO 미정 (경영진 부정)",
        "val": "$40B",
        "round": "$500M (Citadel·Fortress)",
        "sector": "블록체인 결제"
      },
      {
        "nm": "ConsenSys",
        "rs": "이더리움 인프라·MetaMask",
        "ipo": "2026 H2",
        "val": "$10B",
        "round": "IPO 협의 (GS·JPM)",
        "sector": "Web3 인프라"
      },
      {
        "nm": "Fireblocks",
        "rs": "디지털자산 커스터디·TRES $130M 인수(1/7)·기관 보안",
        "ipo": "2027",
        "val": "$8B",
        "round": "Series F",
        "sector": "디지털자산"
      },
      {
        "nm": "Chainalysis",
        "rs": "블록체인 분석·컴플라이언스",
        "ipo": "2027",
        "val": "$8.6B",
        "round": "Series G",
        "sector": "블록체인 분석"
      },
      {
        "nm": "Alchemy",
        "rs": "이더리움·솔라나 RPC·4월 Solana $20M 개발자 펀드",
        "ipo": "미정",
        "val": "$10.2B",
        "round": "Series C1 ($200M, 2022-02)",
        "sector": "Web3 인프라"
      },
      {
        "nm": "Anchorage Digital",
        "rs": "미 연방 인가 크립토 은행·$200-400M 추가 조달 협상",
        "ipo": "2027 검토",
        "val": "$4.2B",
        "round": "Tether $100M (2026-02)",
        "sector": "기관 크립토 커스터디"
      }
    ]
  }
];
