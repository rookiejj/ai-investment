const UPDATES = [
  {
    "date": "2026-05-23 19:30 KST",
    "summary": "Anthropic $30B+ 라운드 마감 임박·$900B 밸류로 OpenAI 추월 첫 1위\nxAI Grok 5/22 Vercel·Canva·Gamma·S&P Global 커넥터 - 생산성 허브 전환\nNVIDIA Computex 6/1 젤슨 키노트 - Vera Rubin NVL72·Jetson Thor·Alpamayo AV 사전 어워드\nAnthropic·MS AI 칩 협상 + SpaceX $1.25B/월 GPU 계약 - 컴퓨트 다원화\nApple WWDC26 6/8 키노트 D-16·Siri 챗봇 단독 앱 + Gemini Foundation Models",
    "changes": [
      {
        "time": "2026-05-22 18:00 EDT",
        "type": "펀딩",
        "detail": "Anthropic. $30B+ 펀딩 라운드 5/27 주 마감 임박·$900B 밸류 - OpenAI($500B 수준) 추월 글로벌 AI 스타트업 시총 1위 등극(Bloomberg 5/22). Co-lead - Sequoia·Dragoneer·Altimeter·Greenoaks. Q2 매출 가이던스 $10.9B Q1 $4.8B 대비 +130% QoQ·연간 ARR 런레이트 $14B·$1M+ 연간 계약 고객 500→1,000+ 2-4월 더블·첫 분기 영업 흑자 가시화. 동시에 Microsoft AI 서버 칩 임대 초기 협상 보도(Bloomberg 5/21~22) - 기존 AWS Trainium + Google TPU + SpaceX $1.25B/월 2029.05까지 GPU 컴퓨트 계약(SpaceX IPO 명세) 베이스에서 MS 진입 시 4번째 컴퓨트 백본·종속 위험 분산 의도 명확. 6/15 프로그래매틱 청구 분리 GA 패키지·Claude Code $14B ARR 캐파 압박 동인 잔존.",
        "sector": "Anthropic"
      },
      {
        "time": "2026-05-22 14:00 EDT",
        "type": "제품 출시",
        "detail": "xAI. Grok 3rd-party 커넥터 5/22 추가 발표 - Vercel(사이트 배포)·Canva(디자인)·Gamma(프레젠테이션)·S&P Global(실시간 시장 데이터) 4종(Basenor 5/22). 스탠드얼론 챗봇에서 생산성 허브로 포지셔닝 전환·ChatGPT·Claude·Gemini 카운터 다중 채널 통합 시그널. 5월 누적 라인업 - Grok 4.3(5/4 1M context·네이티브 비디오)·Grok Build 0.1 코딩 에이전트(5/14)·5/22 커넥터·코딩 에이전트 4파전(Anthropic·OpenAI·Mistral·xAI) 가속·OpenAI $122B 펀딩 후속 Codex·Sora·Atlas GA 확장·Anthropic $30B 라운드와 동조한 펀딩 + 제품 경쟁 가속화 잔존.",
        "sector": "xAI"
      },
      {
        "time": "2026-05-23 09:00 KST",
        "type": "제품 출시 예정",
        "detail": "NVIDIA. Computex Taipei 6/1 젤슨 황 키노트 11am Taiwan Time 타이베이 뒮직 센터 확정·GTC Taipei 6/2~4 후속(Computex 2026·NVIDIA 공식 5/22). 키노트 5층 케이크(에너지→앱) 테마·physical AI·AI factories·agentic systems 통합 메시지. 프리쇼 어워드 라인업 공개 - Vera Rubin NVL72(골든 + 지속가능성 더블)·Jetson Thor 엣지 AI(골든)·Alpamayo AV 플랫폼·AI 인프라 차기 세대 단일 분기점 부각. Q1 FY27 매출 $81.6B + Q2 가이던스 $91B + 자사주 $80B 베이스에서 5/22 종가 $219.51 -1.4% 컨센 상회 미반응 채널·Computex 후속 디테일이 forward P/E 22x earnings yield 4.5% 채권 카운터 영역 돌파 분기점.",
        "sector": "NVIDIA"
      },
      {
        "time": "2026-05-23 04:00 KST",
        "type": "제품 출시 예정",
        "detail": "Apple. WWDC26 6/8 10am PT 키노트 D-16 진입·iOS 27 Siri 챗봇 인터페이스 단독 앱 공개 시그널(9to5Mac·MacRumors 5/22). 핵심 동인 - 수백 개의 에이전틱 앱 액션·LLM 기반 월드 지식·멀티 액션 요청·Gemini 기반 Apple Foundation Models가 Photos 편집 도구 구동·카메라 앱 전용 Siri 모드. ChatGPT·Claude·Gemini 카운터 Apple 단독 챗봇 제품 첫 커밋·Google Gemini 파트너십이 검색을 넘어 파운데이션 모델 영역으로 확장 공식화 신호. 동시에 Apple Intelligence 기반 접근성 - VoiceOver·Magnifier·온디바이스 자막 생성 - 6/8 키노트 단일 분기점.",
        "sector": "Apple"
      },
      {
        "time": "2026-05-23 02:30 KST",
        "type": "모델 출시",
        "detail": "Mistral AI. Medium 3.5 퍼블릭 프리뷰 - 128B dense·Vibe(코딩 에이전트 CLI) 디폴트·Le Chat 디폴트(MarkTechPost 5월). API 리퀸스트당 reasoning effort 설정 가능 - 경량 채팅부터 장시간 에이전틱 런까지 동일 모델 운영, SWE-bench Verified 77.6 Claude 4.5 동급 성능. Vibe Remote Agents - 로컬 CLI 세션이 클라우드 샌드박스로 텔레포트·세션 상태 보존·완료 시 GitHub PR 오픈. 코딩 에이전트 시장 진입 - 프론티어 3강(Anthropic·OpenAI·Google) 카운터 유럽 단독 플레이어 가시화, 비EU 클라우드 sovereignty 채널 후방 수요·Anthropic $30B 라운드와 동조한 코딩 에이전트 4파전 경쟁 격화 잔존.",
        "sector": "Mistral AI"
      }
    ]
  }
];
