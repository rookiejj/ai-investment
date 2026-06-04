const UPDATES = [
  {
    "date": "2026-06-04 19:45 KST",
    "summary": `Anthropic Claude Partner Network 6/3 출범 - Services Track + Partner Hub 동시 공개
Google Gemini 3.5 Pro 6월 출시 임박 - Pichai "내달까지" 무대 공약
Apple-Google $1B/년 커스텀 Gemini 1.2T - WWDC 6/8 Siri 2.0 베이스
OpenAI GPT-5.6 6월 윈도우 - Polymarket 80~89% Codex 백엔드 노출
Mistral Vibe 5/28 리브랜드 - Le Chat → 자율 워크·코드 에이전트 전환`,
    "changes": [
      {
        "time": "2026-06-04 19:40 KST",
        "type": "생태계",
        "detail": "Anthropic. Claude Partner Network 6/3 Services Track + Partner Hub 동시 출범 - 엔터프라이즈 컨설팅·SI·매니지드 서비스 파트너 인증 체계 정식화·Project Glasswing 6/2 확장과 동조. Claude Opus 4.8 기본 컨텍스트 1M 토큰으로 확장 - 코드베이스 스케일 마이그레이션 본격 지원·dynamic workflows로 수십만 라인 리팩토링 자동화 베이스. Opus 4.8 5/28 출시 후 41일 cadence(4.7 → 4.8)·코딩 신뢰성 4배 개선·동일 가격 유지 sector pricing power 카운터. forward 매크로 - 6/1 SEC 비공개 S-1 접수·Series H $65B/$965B 클로징 후 12거래일 IPO 데뷔 가시권·런레이트 ARR $47B(전년 4.7배)·Q2 매출 가이던스 $10.9B 직전 분기 두 배·첫 흑자 분기 컨센. 컴퓨트 베이스 - Google·Broadcom 3.5GW TPU 2027 + Amazon 5GW + SpaceX Colossus 인프라 락인 누적. Mythos 프리뷰 6월 일정 일관·NASDAQ 10월 상장 윈도우 + 1조달러 첫 진입 시나리오 - frontier AI 카테고리 리더십 분기점.",
        "sector": "Anthropic"
      },
      {
        "time": "2026-06-04 19:35 KST",
        "type": "모델 출시 예정",
        "detail": "Google DeepMind. Gemini 3.5 Pro 6월 출시 임박 - 5/19 I/O 2026 키노트에서 Pichai 'give us until next month to get it to you' 공약 후속·API ID·모델 카드 아직 미공개. Gemini 3.5 Flash GA 5/19 - Gemini 앱·AI Mode in Search 기본 모델 + API $1.50/$9.00 per M tokens 베이스. 핵심 카운터 - Apple-Google 1/12 멀티이어 AI 파트너십 $1B/년·1.2T 파라미터 커스텀 Gemini 모델 + Apple Private Cloud Compute 하드웨어 격리 enclaves 데이터 미공유 + iOS 27 출시 시 약 14억 iPhone 대상 Siri 2.0 백엔드 + WWDC 6/8 D-4 공식 발표 컨센. Google DeepMind sector premium 베이스 - GPT-5.6 vs Opus 4.8 vs Gemini 3.5 Pro 6월 동시 프론티어 사이클 + Apple 14억 디바이스 분포 락인 + 코딩·웹서치·이미지 생성 멀티 모달 카테고리 리더십 동조 매크로. forward 매크로 - Anthropic·OpenAI IPO 윈도우 + Mythos·Grok 5 6월 동시 출시 가속 시나리오가 frontier AI 광역 카테고리 변곡점.",
        "sector": "Google DeepMind"
      },
      {
        "time": "2026-06-04 19:30 KST",
        "type": "모델 출시 예정",
        "detail": "OpenAI. GPT-5.6·GPT-5.6 Pro 6월 출시 임박 - Polymarket 80~89% 6/30 확률·Codex 내부 트레이스 노출·체크포인트 테스트 누적·내부 코드네임 iris-alpha·ember-alpha·beacon-alpha 보고. ChatGPT Pro 사용자 컨텍스트 윈도우 약 1.5M 토큰(GPT-5.5 대비 +43%) 베이스. 핵심 개선 - reasoning·agentic workflow·고급 프론트엔드 생성·tool use cost efficiency·SWE-bench 80%+ 컨센. Anthropic Opus 4.8 5/28 출시 + Mistral Vibe 5/28 출범 + Gemini 3.5 Pro 6월 카운터로 코딩 sector 4중 경쟁 가속. 황 NVIDIA GTC Taipei $30B 투자 'probably the last before IPO' 발언 베이스 - OpenAI 후속 비공개 S-1 SEC 제출 가능성 가시화·가을 IPO 윈도우·Anthropic $965B 대비 시장 점유율 첫 추월 사이클 분기점. forward 5,000억 ARR 멀티 가속 - 모델 성능 베이스 + 매출 가속 + IPO 동시 진행이 가을 광역 사이클. Vera CPU 1차 고객 명시·SpaceX Colossus 컴퓨트 락인이 인프라 멀티이어 베이스.",
        "sector": "OpenAI"
      },
      {
        "time": "2026-06-04 19:25 KST",
        "type": "제품 출시",
        "detail": "Mistral AI. Vibe 5/28 출범 - Le Chat 어시스턴트 리브랜드 + 자율 워크 에이전트 + 코드 에이전트 통합 플랫폼 전환. Work Mode - 웹·모바일 장기 작업 에이전트, 도구 선택·진행 스트리밍·복합 작업 완료까지·Code Mode - 전용 웹 surface 원격 코딩 에이전트. 핵심 - 세션 병렬 실행·머신 오프 상태 지속·Slack 등 외부 트리거(6월)·Mistral Medium 3.5 베이스(SWE-Bench Verified 77.6% 검증). 가격 - Free·Pro $14.99/월·Team $24.99/사용자·Enterprise 별도. Mistral 동시 발표 산업 AI + 데이터센터 확장 - 풀스택 전략 전환으로 OpenAI·Anthropic·Google DeepMind 카운터. EU 정식 sovereign AI sector 단독 베이스 - Le Chat → Vibe 리브랜드가 컨슈머·엔터프라이즈 통합 변곡점. forward - GPT-5.6·Opus 4.8·Gemini 3.5 Pro·Vibe 4중 프론티어 사이클 6월 동시 진행이 코딩 에이전트 sector 광역 카테고리 베이스.",
        "sector": "Mistral AI"
      }
    ]
  }
];
