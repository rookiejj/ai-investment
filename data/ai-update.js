const UPDATES = [
  {
    "date": "2026-05-31 07:50 KST",
    "summary": "Apple WWDC 6/8 D-8 - Gemini 1.2T 커스텀 Siri $1B/yr·iOS 27 Extensions Claude·Gemini 개방·5G 위성 인터넷\nAnthropic Series H $65B/$965B 5/29 클로징·OpenAI $852B 추월·Opus 4.8 출시 41일 최단·코딩 결함 4배 감소\nMusk vs OpenAI 5/18 평결 - 시효 도과 만장일치 기각·올트먼·브록맨 책임 면제·머스크 항소 예고\nCognition Series D $1B/$26B 5/27 - Devin ARR $492M·8개월 2.5배·Devin 자체 코드 89% 작성\nxAI Grok 4 GSA OneGov 18개월 연방 전 기관 접근·DoD $200M·Custom Skills 256K 정식 출시",
    "changes": [
      {
        "time": "2026-05-30 23:00 KST",
        "type": "전략",
        "detail": "Apple. WWDC 2026 6/8 키노트 D-8 카운트다운 - Gemini 1.2T 파라미터 커스텀 모델 기반 Siri 재구축($1B/yr 지불) 확정 보도, iOS 27·iPadOS 27·macOS 27 동시 발표 예정. Siri Extensions 전용 앱으로 텍스트·음성 모드 동시 지원·과거 대화 기록 액세스가 핵심 신기능, ChatGPT 독점 종료 + Claude·Gemini·기타 3rd-party 모델 사용자 선택권 개방이 모델 공급사 다변화 시그널. Apple 자체 Private Cloud Compute에서 추론 처리·genai.apple.com 서브도메인 등록·Apple Intelligence on-device AI 키워드 잔존. iOS 27 5G 위성 인터넷 연결성(iPhone 18 Pro·Ultra 한정) 추가, 메모리 칩 확보(삼성·SK 5/27~28 라운드) + 황 NVIDIA 6/5 한국 방한 분기점이 아시아 AI 인프라 락인 사이클과 정렬돼 동시 진행된다.",
        "sector": "Apple"
      },
      {
        "time": "2026-05-28 23:00 KST",
        "type": "모델 출시",
        "detail": "Anthropic. 5/28 Claude Opus 4.8을 정식 출시했다 - Opus 4.7 출시 41일 만의 최단 사이클로, 가격은 4.7과 동일하면서 코딩 결함이 검출 단계에서 누락되는 비율이 4.7 대비 4배 감소했다. 핵심 신기능은 Dynamic Workflows(research preview) - Claude Code가 수백 개 서브에이전트를 병렬로 코디네이션해 대규모 코드베이스 마이그레이션을 kickoff부터 merge까지 자동 수행, 기존 테스트 슈트를 합격 기준으로 사용한다. 'effort' 컨트롤 패널로 응답 추론 깊이 사용자 조절 + 자체 불확실성 플래깅 강화 + unsupported claim 감소. GitHub Copilot 5/28 GA, Claude API·Bedrock·Vertex AI 동시 전개. Series H $65B/$965B(5/29 클로징, OpenAI $852B 추월)·Amazon 5GW·Google 5GW TPU·SpaceX Colossus 인프라 락인과 정렬된 frontier 모델 사이클 가속 시그널.",
        "sector": "Anthropic"
      },
      {
        "time": "2026-05-18 12:00 KST",
        "type": "거버넌스",
        "detail": "OpenAI. 5/18 캘리포니아 연방법원 9인 자문 배심이 머스크 vs OpenAI 소송에서 만장일치 평결을 내렸다 - 머스크가 2024년 제기한 시점이 시효를 도과했다는 단일 쟁점만으로 모든 청구를 기각, Yvonne Gonzalez Rogers 판사도 동의해 사건 자체를 dismiss했다. 올트먼·브록맨·OpenAI는 비영리 약정 위반·신탁 의무 위반 청구 전체에서 책임을 면제받았다 - 만약 승소했다면 OpenAI·MS가 비영리 재단에 최대 $150B disgorge + 올트먼·브록맨 해임 + 영리법인 해체 시나리오. 머스크는 'merit이 아닌 calendar technicality' X 발언 + 항소 예고. ChatGPT 8억 WAU + ARR $25B+ 2026말 IPO 시나리오 잔존, 거버넌스 디스카운트 해소 시그널.",
        "sector": "OpenAI"
      },
      {
        "time": "2026-05-27 22:00 KST",
        "type": "펀딩",
        "detail": "Cognition. 5/27 Series D $1B/$26B 포스트머니 클로징 - Lux·General Catalyst·8VC 리드, 8개월 전 $10.2B 대비 2.5배 점프했다. Devin ARR $492M, 엔터프라이즈 사용 6개월 연속 50% MoM 가속, Mercedes·NASA·Goldman·Santander 톱티어 고객 락인. Devin이 Cognition 자체 코드 89%를 작성한 점이 autonomous coding의 unit economics 입증 시그널로 작동했다. Anthropic Series H $65B/$965B + Opus 4.8 Dynamic Workflows + SpaceX 6/12 SPCX 데뷔 + OpenAI ARR $25B+ 2026말 IPO 시나리오와 동시 진행돼 후기 단계 AI 자본 회수 사이클의 분기점에 진입했다.",
        "sector": "Cognition"
      },
      {
        "time": "2026-05-29 14:00 KST",
        "type": "제품 출시",
        "detail": "xAI. Grok Build 0.1 enterprise traction이 5/27~29 가속됐다 - 5/14 release의 Custom Skills 정식 출시(256K context 코딩 모델, 입력 $1/M·출력 $2/M)에 이어 Grok Imagine API에 Quality Mode 추가, DoD $200M 계약과 GSA OneGov로 모든 연방기관 18개월 Grok 4 $0.42/agency 접근이 입력됐다. Anthropic 5/29 Series H 클로징 + Opus 4.8 출시·OpenAI Rosalind 정부 wedge와 정렬된 frontier 모델의 연방·엔터프라이즈 동시 진입 사이클로, SpaceX Colossus 1·2 GPU 인프라 lock-in이 forward 가시성을 떠받친다.",
        "sector": "xAI"
      }
    ]
  }
];
