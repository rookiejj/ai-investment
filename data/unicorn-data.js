const data = [
  {
    "tag": "결제·뱅킹·HR·SMB",
    "title": "💳 핀테크",
    "stocks": [
      {
        "rs": "PayPal $53B 인수 제안(Advent 공동)·주당 $60.50 프리미엄 28%·자체 tender $159B·2025 결제 $1.9T +34%·Tempo L1 2026 롤아웃",
        "nm": "Stripe",
        "ipo": "2026 말~2027 후보",
        "val": "$159B",
        "round": "텐더오퍼 (2026-06)",
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
        "rs": "$44B 확정·ARR $1.5B·CEO Glyman '연말 IPO-ready' 재확인·cash flow positive·Brex → Capital One 인수 완료 후 독립 legal fintech 대표주",
        "ipo": "2026 말 IPO-ready",
        "val": "$44B",
        "round": "Series F+ $750M (2026-06)·ICONIQ·GIC·OTPP",
        "sector": "법인 핀테크"
      },
      {
        "nm": "Plaid",
        "rs": "US IPO 검토 7/1 Bloomberg 보도·예비 은행 접촉 단계·$8B tender 회복 (2021 $13.4B peak 대비 -40%)·크램다운 회복 시그널",
        "ipo": "2026 Q3~ 검토",
        "val": "$8B",
        "round": "텐더오퍼 (2026-04)·GS 리드",
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
        "rs": "5/20 Series D $200M $5.2B 클로징 - 14개월 +49% 업라운드·TCV 리드 a16z·Coatue·Sequoia·CRV·Sapphire·Spark 참여·OCC 풀 차터 내셔널뱅크 전환 진행·ARR $650M·4년 연속 흑자·누적 펀딩 ~$700M",
        "ipo": "미정",
        "val": "$5.2B",
        "round": "Series D ($200M, 2026-05)·TCV 리드",
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
        "rs": "$42B 직원 세컨더리($1,646/주)·ARR $3.3~4B +35% YoY·미국 redomicile 완료·Steckelberg(전 Zoom IPO) CFO·Blackbird 'H2 2026 ready'",
        "ipo": "2026 H2 후보 (S-1 미공개)",
        "val": "$42B",
        "round": "직원 세컨더리 (2025-08)",
        "sector": "디자인"
      },
      {
        "nm": "Perplexity AI",
        "rs": "AI 검색·Comet 브라우저·엔터프라이즈 tier Stripe·Databricks·Fortune 100 확산·ARR 4.5~5억달러·NVDA·Bezos·SoftBank 투자자",
        "ipo": "2028",
        "val": "$24.8B",
        "round": "Series E-7",
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
        "rs": "6월 IPO 윈도우 close-out·Polymarket 1.7%·2027 mid 80% 베팅 - 1/6 confidential S-1·5월 정식 S-1 등록·Goldman·JPM 인수단·FOMC 매파 충격 IPO appetite 카운터",
        "ipo": "2027 mid 후순위 (80%)",
        "val": "$25B (MS 거부)",
        "round": "S-1 등록 (5월)·GS·JPM",
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
        "rs": "SpaceX·xAI 통합 상장 첫 주 $2T 돌파로 $60B 옵션 가치 재확장·인도 Emergent $1.5B 카운터·코딩 카테고리 3파전 (Anthropic·xAI·Google)",
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
        "nm": "Saronic Technologies",
        "rs": "3/31 Series D $1.75B Kleiner Perkins 리드 - $4B→$9.25B 더블 업라운드·Andreessen Horowitz·Advent·Bessemer 참여·美 해군 $392M 누계·자율 함정 Spyglass·Corsair·Marauder 6종·2027 연 20+척 양산 가이던스·중국 해군 카운터 핵심",
        "ipo": "미정",
        "val": "$9.25B",
        "round": "Series D ($1.75B, 2026-03)·Kleiner Perkins",
        "sector": "자율 해군 방산"
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
        "rs": "$16B 메가 라운드·연 1,500만 트립·런던·도쿄 20+ 신도시 확장·자율주행 최대 유니콘",
        "ipo": "미정 (2027 흑자 목표)",
        "val": "$126B",
        "round": "Series D ($16B, 2026-02)",
        "sector": "자율주행 로보택시"
      },
      {
        "nm": "Anduril",
        "rs": "1,000억달러 라운드 협상 확인·Augment 추정 마켓캡 883억달러 - 5월 610억달러 시리즈 H 대비 스텝업, FY25 매출 22억달러 2배·美 육군 200억달러 카운터드론·NATO 재무장 사이클 카운터",
        "ipo": "단기 아닐(Luckey)",
        "val": "$88.3B",
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
    "tag": "AI 신약·BCI·디지털 헬스",
    "title": "🧬 바이오·헬스",
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
        "sector": "디지털 헬스"
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
        "rs": "Alphabet 지분 축소·독립법인 전환·AI 정밀 헬스 플랫폼",
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
        "rs": "AI 기반 근골격 치료·Hinge Health 5/22 IPO 데뷔 후 비상장 단독 MSK 채널·글로벌 확장",
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
        "rs": "밸류 $13.3B 하향 조정 (기존 $20B)·JPM·GS 주관·xStocks 통해 SpaceX IPO Access 지원 개시·CLARITY Act 8/7 데드라인 후 로드쇼 재타깃",
        "ipo": "2026 재개 검토 (밸류 하향)",
        "val": "$13.3B",
        "round": "confidential S-1 유지",
        "sector": "크립토 거래소"
      },
      {
        "nm": "Ripple",
        "rs": "7/6 룩셈부르크 CSSF 전면 MiCA CASP 승인 - EEA 30개국 크립토·스테이블코인 자유 이동·RLUSD 유럽 진출·Open USD 컨소시엄 앵커",
        "ipo": "IPO 미정 (경영진 부정)",
        "val": "$40B",
        "round": "$500M (Citadel·Fortress)",
        "sector": "블록체인 결제"
      },
      {
        "nm": "ConsenSys",
        "rs": "H2 2026 IPO 협의 확정 - JPM·GS 주관·MetaMask·Infura 이더리움 인프라·CLARITY Act 상원 통과 후 로드쇼 개막",
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
