/**
 * update.js — AI Players 업데이트 로그
 *
 * 각 기업의 모델·제품·펀딩·인수 등 콘텐츠 변경 사항을
 * 날짜별로 기록한다.
 */
const UPDATES = [
  {
    date: "2026-04-13 02:26 KST",
    entries: [
      "xAI — Grok Imagine 비디오 업데이트: 15초 영상+동기화 오디오 생성, Speed/Quality 듀얼 모드(4/3), 음성 프롬프트·키즈 세이프 모드 추가. Imagine 2.0 및 Pro 모드 4월 중 출시 예고",
      "Anthropic — MCP 누적 설치 9,700만 건 돌파(3월 기준), 실험적 표준에서 핵심 AI 에이전트 인프라로 전환 확인",
      "Amazon AWS — Jassy 4/9 주주서한: Trainium 칩 사업 연환산 $20B, Trn2 전량 소진·Trn3 거의 완판, 서드파티 랙 판매 검토로 NVIDIA 직접 경쟁 시사"
    ]
  },
  {
    date: "2026-04-13 00:40 KST",
    entries: [
      "Mistral AI — Voxtral TTS 수록: 업계 최초 프론티어급 오픈웨이트 음성 합성 모델(4B 파라미터), ElevenLabs 대비 자연스러움 우위, 9개 언어·제로샷 음성 복제 지원으로 Voxtral 음성 스택 완성",
      "Microsoft — Copilot Cowork 수록: M365 내 다단계 장기 실행 자율 태스크 실행 레이어, Anthropic Claude 협업 개발, 3/30 Frontier 프로그램 GA"
    ]
  },
  {
    date: "2026-04-12",
    entries: [
      "Anthropic — 연환산 매출 $300억으로 OpenAI 최초 추월, 바이오 AI 스타트업 Coefficient Bio 인수",
      "Google DeepMind — Broadcom과 3.5GW 규모 컴퓨트 인프라 딜 체결, Gemini 3.1 Ultra 출시(200만 토큰 컨텍스트)",
      "OpenAI — ChatGPT Pro $100/월 요금제 신설(Plus와 Pro 사이 포지션), 테크 팟캐스트 TBPN 인수",
      "Mistral AI — Mistral Forge 플랫폼 공개, 파리 데이터센터 $830M 투자 발표",
      "xAI — Grok 4.20·Grok Imagine NEW 배지 해제(출시 4주 경과)"
    ]
  },
  {
    date: "2026-04-11",
    entries: [
      "Anthropic — Claude Mythos(차세대 추론 모델) 및 Project Glasswing(자율 에이전트 프레임워크) 발표",
      "Meta AI — Superintelligence Labs의 Muse Spark 모델 수록",
      "Google DeepMind — Gemma 4 오픈소스 공개",
      "xAI — Grok 4.20 멀티에이전트 기능, Grok 5 프리뷰, SpaceX 합병안, Grok Imagine 이미지 생성 추가",
      "OpenAI — 독립 Sora 앱 종료(ChatGPT 통합), GPT-5.5 'Spud' 사전훈련 완료, $1,220억 펀딩, 사이버보안 제품 라인 신설",
      "Mistral AI — Mistral Small 4 경량 모델 추가"
    ]
  },
  {
    date: "2026-03-23",
    entries: [
      "Google DeepMind — Stitch(이미지 편집 AI) 추가",
      "NVIDIA — GTC 2026 발표 제품 반영: Isaac GR00T·Cosmos·DGX Spark·Nemotron 3 Super",
      "OpenAI — Desktop 슈퍼앱·GPT-5.4 mini 추가",
      "Microsoft — Copilot Tasks·MAI-Image-2 추가",
      "Meta AI — Manus AI(자율 에이전트) 추가",
      "Apple — 신형 Siri + Gemini 연동 정보 반영"
    ]
  },
  {
    date: "2026-03-21",
    entries: [
      "수록 기업 교체 — DeepSeek·Alibaba 제거, Apple·Mistral AI로 대체(선정 기준 재평가)"
    ]
  },
  {
    date: "2026-03-20",
    entries: [
      "AI Players 최초 작성 — OpenAI·Anthropic·Google DeepMind·xAI·Meta AI·Microsoft·NVIDIA·Amazon AWS 8개사 수록"
    ]
  }
];
