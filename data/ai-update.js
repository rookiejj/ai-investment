const UPDATES = [
  {
    "date": "2026-06-09 07:30 KST",
    "summary": "Apple WWDC 2026 'Siri AI' 공개 - Gemini 백엔드·7월 베타·9월 iPhone18 정식\nNVIDIA 한국 5개사 메가딜 - SK Vera Rubin·NAVER GW급 AI팩토리\nAnthropic Claude Opus 4.8 출시 - Series H $65B·밸류 $965B·런레이트 $47B\nGoogle Gemini 3.5 Flash·Omni 공개 - Ultra $200 인하·Spark 24/7 에이전트\nxAI Grok V9-Medium 1.5T 6월 중순 - Colossus 2 Grok 5 10T 훈련 중",
    "changes": [
      {
        "time": "2026-06-09 07:30 KST",
        "type": "제품 출시",
        "detail": "Apple. WWDC 2026 'Siri AI' 공식 공개로 2년 지연 따라잡기 - Google Gemini 통합 엔진 채택해 자체 모델 한계 인정, 멀티턴 대화·화면 컨텍스트 인식·창의 브레인스토밍 지원. 7월 퍼블릭 베타·9월 iPhone 18 동반 정식 출시. EU는 DMA 규제로 출시 제외 - Apple 생태계 lock-in vs 규제 비용 트레이드오프 본격화. iOS 27 + iPadOS 27 + macOS 27 + tvOS 27 + watchOS 27 + visionOS 27 동시 베타 시드·Liquid Glass 디자인·macOS Golden Gate 동반. Gemini-on-Apple로 Google search 협상 레버리지 약화 우려 + frontier LLM 'capability monopoly' → 'B2B2C 라이센스 사이클' 전환 분기점·14억 iOS 디바이스 분포 락인이 inference 점유 카테고리 리더쉭 분기점. forward 시그널 - 7월 베타 quality + standalone Siri 앱·multi-step task·personal context 활용 깊이가 분기점.",
        "sector": "Apple"
      },
      {
        "time": "2026-06-09 07:00 KST",
        "type": "인프라",
        "detail": "NVIDIA. Jensen Huang 방한 - 한국 5개사 동시 발표가 황 CEO 아시아 AI 인프라 거점 확장 시그널 확정. SK하이닉스 Vera Rubin·Vera CPU·RTX Spark·Jetson Thor 메모리 다년 공급계약·NAVER와 아시아·중동·유럽 GW급 AI팩토리(2027년 55MW 시작·2028년 200MW 확장)·LG·현대·두산은 로보틱스·자율주행·피지컬 AI 협력. HBM 공급망 lock-in 강화·CAPEX 사이클 한국 인프라 축으로 이동·아시아 매출 비중 30%+ 카테고리 lock-in 직접화. NVDA 6/8 $208.14 +1.04% 6/5 폭락 후 첫 거래일 자율반등 베이스. forward 시그널 - GTC Taipei 후속·8월 Q2 print·6월말 GPT-5.6 vs Mythos vs Gemini 3.5 Pro frontier 사이클이 NVDA AI 워크로드 후방 분기점.",
        "sector": "NVIDIA"
      },
      {
        "time": "2026-06-09 06:30 KST",
        "type": "펀딩",
        "detail": "Anthropic. Series H $65B 포스트머니 $965B로 글로벌 AI 스타트업 최대 밸류 - Altimeter·Dragoneer·Greenoaks·Sequoia 리드, Amazon $5B 포함. 런레이트 매출 $47B 돌파(2월 Series G 대비 가파른 ramp)·Q2 가이던스 $10.9B 직전 분기 두 배·6/1 confidential S-1 IPO 파일링 D+7. Claude Opus 4.8 동시 출시·Mythos 모델 수주 내 예고로 frontier cadence 유지. Monetization unit economics가 OpenAI 추월 시그널·Claude Partner Network 40,000개사 신청·10,000명 컨설턴트 인증으로 엔터프라이즈 분배 채널 가속·ENISA Project Glasswing EU 정부 컴플라이언스 lock-in. 컴퓨트 베이스 - Google·Broadcom 3.5GW TPU 2027 + Amazon 5GW + SpaceX Colossus 락인. forward 시그널 - 10월 IPO 가격·Mythos public release·OpenAI 가을 IPO가 후기 단계 sector premium 분기점.",
        "sector": "Anthropic"
      },
      {
        "time": "2026-06-09 06:00 KST",
        "type": "모델 출시",
        "detail": "Google DeepMind. Gemini 3.5 Flash 디폴트 전환·동급 모델 대비 4배 토큰 속도·Gemini Omni 멀티모달 통합(영상 입력→임의 출력) 공개. Ultra 요금 $250→$200 인하·신설 Developer $100/월 - Anthropic·OpenAI 가격 압박 직접화·sector pricing power 카운터. Gemini Spark 24/7 에이전트·CodeMender 보안 에이전트 추가. Apple Siri AI 백엔드 채택으로 모바일 인프라 다리 확보 + 14억 iOS 디바이스 inference workload 분기점. Pichai 직접 가이던스 Gemini 3.5 Pro 6월 출시 임박 + TPU 8세대 cadence가 NVDA H100/Blackwell 의존 카운터. forward 시그널 - Gemini 3.5 Pro 6월 출시·Apple WWDC 데모 quality·Search Generative Experience 광고 monetization 가시화가 sector 분기점.",
        "sector": "Google DeepMind"
      },
      {
        "time": "2026-06-09 05:30 KST",
        "type": "모델 출시 예정",
        "detail": "xAI. Musk 6/5 Grok 로드맵 공개 - Grok V9-Medium 1.5T 파라미터 훈련 완료(현 v8-small 500B의 3배), 6월 중순 퍼블릭 출시 임박. Grok 4.4·4.5(1T/1.5T) 수주 내·Grok 5는 Colossus 2 슈퍼클러스터에서 10T 변종 훈련 중. 6/4 Grok Voice·Grok Imagine 1.5 Preview 롤아웃·Series E $20B(NVIDIA·Cisco 참여) 자금이 capability scaling cadence를 분기 단위로 가속. Microsoft MAI-Thinking-1 6/2 출시 D+7 - 35B 활성 파라미터·256K 컨텍스트·OpenAI 의존 우회·Azure OpenAI 워크로드 분리 점진 가속. forward 시그널 - Grok V9-Medium 출시 + Microsoft MAI 후속 + GPT-5.6 6/30 + Anthropic Mythos가 6월 frontier 4파전 동시 진행 분기점.",
        "sector": "xAI"
      }
    ]
  }
];
