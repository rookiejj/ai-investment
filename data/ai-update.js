/**
 * update.js — AI Players 업데이트 로그
 *
 * 각 기업의 모델·제품·펀딩·인수 등 콘텐츠 변경 사항을
 * 날짜별로 기록한다.
 */
const UPDATES = [
  {
    date: "2026-04-15 19:18 KST",
    entries: [
      "OpenAI — GPT-6 '4/14 글로벌 공개' 루머 공식 부인 확인. OpenAI 블로그·모델카드·API 공지 모두 미발생. Altman은 3/24 프리트레이닝 종료 후 '수 주 내 출시' 언급에 머물러 있음. Polymarket 4/30 내 출시 확률 78%, 시장 컨센서스는 4/21~5/25 윈도우로 압축. ai-data.js의 GPT-6 entry는 '글로벌 출시' → '출시 임박'으로 정정, 런칭 타이밍을 Stargate 1단계 가동과 맞춤."
    ]
  },
  {
    date: "2026-04-15 12:40 KST",
    entries: [
      "OpenAI — GPT-6 출시 임박: 4/14 루머는 부인, 'Spud' 프리트레이닝은 3/24 완료. 컨텍스트 200만 토큰(GPT-5.4 대비 2배), HumanEval 95%+, MATH ~85%, 에이전트 태스크 완료율 62%→87%, 환각률 0.1% 미만 주장. ChatGPT·Codex·Atlas 브라우저를 단일 에이전트로 통합. 가격은 input $2.50/M·output $12/M로 GPT-5.4와 동등. ai-data.js 항목은 '출시 임박'으로 표기.",
      "Anthropic — 투자자들이 $800B 밸류에이션 신규 펀딩 오퍼 제시(4/14 Bloomberg). 2월 Series G 당시 pre-money $350B의 2배 이상, IPO 10월 $380B 타깃 부각. 매출·인프라·밸류 마일스톤 항목에 통합 반영.",
      "Anthropic — Long-Term Benefit Trust가 Vas Narasimhan(전 Novartis CEO)을 Board of Directors로 지명(4/14). 바이오·거버넌스 전문성 보강. Coefficient Bio 인수 이후 라이프사이언스 진출 연장선.",
      "Project Glasswing — 약 50개 조직(AWS·Apple·Microsoft·Google·NVIDIA·Cisco·CrowdStrike·JPMorgan·Linux Foundation 등)에 Claude Mythos 방어용 액세스 부여 확정. Mythos는 SWE-bench Verified 93.9%·GPQA Diamond 94.6%·주요 OS·브라우저에서 수천 건의 zero-day 자율 발견.",
      "NVIDIA — Ising 공개(4/14): 양자 컴퓨팅 보정·오류정정용 세계 최초 오픈 AI 모델 패밀리. Ising Calibration(VLM, 캘리브레이션 일→시간 단축) + Ising Decoding(3D CNN 2.5배 빠르고 3배 정확). Academia Sinica·Fermilab·Harvard·IQM·Infleqtion·LBNL AQT·UK NPL 채택. 동일 자회사 DELL·HPQ 인수설은 공식 부인. 주가 +3.78%, 10거래일 연속 상승으로 2년 최장.",
      "xAI — Grok 코딩 에이전트 재건: Claude Code·Codex 대비 성능 열세 지속되자 Grok 트레이너 500명 감원(4/12), 공동창업자 9명째 이탈(잔존 2명). 4/14 Cursor 제품엔지니어링 공동 리더 Andrew Milich·Jason Ginsberg를 xAI/SpaceX에 공동 영입해 코딩 역량을 '0부터' 재구축. ai-data.js에 'Grok 코딩 팀 재건' 신규 항목 추가.",
      "일본 반도체 AI 랠리 — 4/14 Advantest +8.5%, Kioxia +11.9%, SoftBank +12.7%, Disco +6.3%. Advantest FY26 영업익 가이던스 25% 상향(¥374B)이 촉매."
    ]
  },
  {
    date: "2026-04-13 10:05 KST",
    entries: [
      "OpenAI — DOD 분류 네트워크 AI 배포 계약으로 #QuitGPT 운동 확산(250만 서명, 앱 삭제 295% 급증). CEO Altman '성급했다' 인정 후 계약 수정(국내 감시·NSA 사용 배제). Claude가 앱스토어 1위 탈환",
      "Anthropic·OpenAI·Google — Frontier Model Forum 통해 대중국 적대적 증류(adversarial distillation) 공동 대응 개시(4/6). DeepSeek·Moonshot·MiniMax 3사 대상 2.4만 가짜 계정·1,600만 건 추출 적발. 업계 최초 위협 인텔리전스 공유 체계",
      "xAI — SpaceX 합병 후 구조조정: CFO Anthony Armstrong 퇴임, SpaceX Starlink VP Michael Nicholls xAI 사장 취임(4/10). Grok-Sat LEO 프로토타입 테스트 완료. SpaceX $1.75T IPO 추진 중",
      "xAI-SpaceX 합병 — isNew:false 처리(2/2 완료, 10주 경과). OpenAI Sora 통합 — isNew:false 처리(2026년 초 종료, 2개월+ 경과)"
    ]
  },
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
