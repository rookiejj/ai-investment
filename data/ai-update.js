/**
 * update.js — AI Players 업데이트 로그
 *
 * 각 기업의 모델·제품·펀딩·인수 등 콘텐츠 변경 사항을
 * 날짜별로 기록한다.
 */
const UPDATES = [
  {
    date: "2026-04-15 21:38 KST",
    badge: "개별",
    entries: [
      { text: "xAI — Grok 5 Q1 2026 목표 공식 지연 → Q2 2026(5~6월 퍼블릭 베타) 윈도우로 재조정. Colossus 2(1.5GW) 훈련 여전히 진행 중, 6T 파라미터 MoE 아키텍처 유지. Musk 4/14 '내 AGI 달성 확률 추정 10% 수준, 상승 중' 발언. XChat(위챗 경쟁 서비스) 4/17 Grok 엔진 탑재 출시 예정. ai-data.js의 Grok 5 항목에 Q2 2026 윈도우 재확인 반영.", time: "2026-04-15 21:38 KST" },
      { text: "OpenAI — GPT-6 루머 추가 정리: Polymarket 4/30 이전 출시 확률 78% 유지, 5/25까지 윈도우 컨센서스. 3/24 Spud 프리트레이닝 종료 이후 외부 공식 발표 부재. GPT-5.5 vs GPT-6 네이밍 미확정(퍼포먼스 점프 크기에 따라 결정). 출시 임박 스탠스 유지.", time: "2026-04-15 21:38 KST" },
    ]
  },
  {
    date: "2026-04-15 20:14 KST",
    badge: "개별",
    summary: "Anthropic Opus 4.7·AI 디자인 툴 출시 임박 + Mistral 최근성 관리",
    changes: [
      { type: "모델·제품 출시 예정", sector: "Anthropic", detail: "Claude Opus 4.7 및 AI 디자인 툴(웹사이트·프레젠테이션 자동 생성, Figma/Word/PPT 연동) 금주 출시 예정(4/15 Information 특종). Opus 4.7은 Opus 4.6 점진 업그레이드로 멀티스텝 추론·장시간 태스크·에이전트 오케스트레이션에 집중, Opus 4.6과 Mythos(비공개) 사이 포지셔닝. 발표 직후 Adobe·Wix·Figma 주가 -2%+ 반응. ai-data.js의 Opus 4.6 entry를 'Opus 4.6 / Opus 4.7 (금주 출시 임박)'으로 확장.", time: "2026-04-15 20:14 KST" },
      { type: "최근성 관리", sector: "Mistral AI", detail: "Small 4(3월 출시), Forge(3/17) 4주+ 경과로 isNew:false 처리.", time: "2026-04-15 20:14 KST" }
    ]
  },
  {
    date: "2026-04-15 19:18 KST",
    summary: "OpenAI GPT-6 '4/14 글로벌 공개' 루머 공식 부인, 출시 임박 상태로 정정",
    changes: [
      { type: "모델 출시 예정", sector: "OpenAI", detail: "GPT-6 '4/14 글로벌 공개' 루머 공식 부인 확인. OpenAI 블로그·모델카드·API 공지 모두 미발생. Altman은 3/24 프리트레이닝 종료 후 '수 주 내 출시' 언급에 머물러 있음. Polymarket 4/30 내 출시 확률 78%, 시장 컨센서스는 4/21~5/25 윈도우로 압축. ai-data.js의 GPT-6 entry는 '글로벌 출시' → '출시 임박'으로 정정, 런칭 타이밍을 Stargate 1단계 가동과 맞춤.", time: "2026-04-15 19:18 KST" }
    ]
  },
  {
    date: "2026-04-15 12:40 KST",
    summary: "GPT-6 스펙·가격 구체화, Anthropic $800B 밸류·Narasimhan 이사 선임, NVIDIA Ising·Project Glasswing·xAI 재건",
    changes: [
      { type: "모델 출시 예정", sector: "OpenAI", detail: "GPT-6 출시 임박: 4/14 루머는 부인, 'Spud' 프리트레이닝은 3/24 완료. 컨텍스트 200만 토큰(GPT-5.4 대비 2배), HumanEval 95%+, MATH ~85%, 에이전트 태스크 완료율 62%→87%, 환각률 0.1% 미만 주장. ChatGPT·Codex·Atlas 브라우저를 단일 에이전트로 통합. 가격은 input $2.50/M·output $12/M로 GPT-5.4와 동등. ai-data.js 항목은 '출시 임박'으로 표기.", time: "2026-04-15 12:40 KST" },
      { type: "펀딩", sector: "Anthropic", detail: "투자자들이 $800B 밸류에이션 신규 펀딩 오퍼 제시(4/14 Bloomberg). 2월 Series G pre-money $350B의 2배 이상, IPO 10월 $380B 타깃 부각. 매출·인프라·밸류 마일스톤 항목에 통합 반영.", time: "2026-04-15 12:40 KST" },
      { type: "리더십", sector: "Anthropic", detail: "Long-Term Benefit Trust가 Vas Narasimhan(전 Novartis CEO)을 Board of Directors로 지명(4/14). 바이오·거버넌스 전문성 보강. Coefficient Bio 인수 이후 라이프사이언스 진출 연장선.", time: "2026-04-15 12:40 KST" },
      { type: "제품 출시", sector: "Project Glasswing", detail: "약 50개 조직(AWS·Apple·Microsoft·Google·NVIDIA·Cisco·CrowdStrike·JPMorgan·Linux Foundation 등)에 Claude Mythos 방어용 액세스 부여 확정. Mythos는 SWE-bench Verified 93.9%·GPQA Diamond 94.6%·주요 OS·브라우저에서 수천 건의 zero-day 자율 발견.", time: "2026-04-15 12:40 KST" },
      { type: "제품 출시", sector: "NVIDIA", detail: "Ising 공개(4/14): 양자 컴퓨팅 보정·오류정정용 세계 최초 오픈 AI 모델 패밀리. Ising Calibration(VLM, 캘리브레이션 일→시간 단축) + Ising Decoding(3D CNN 2.5배 빠르고 3배 정확). Academia Sinica·Fermilab·Harvard·IQM·Infleqtion·LBNL AQT·UK NPL 채택. 자회사 DELL·HPQ 인수설은 공식 부인. 주가 +3.78%, 10거래일 연속 상승으로 2년 최장.", time: "2026-04-15 12:40 KST" },
      { type: "구조조정", sector: "xAI", detail: "Grok 코딩 에이전트 재건: Claude Code·Codex 대비 성능 열세 지속되자 Grok 트레이너 500명 감원(4/12), 공동창업자 9명째 이탈(잔존 2명). 4/14 Cursor 제품엔지니어링 공동 리더 Andrew Milich·Jason Ginsberg를 xAI/SpaceX에 공동 영입해 코딩 역량을 '0부터' 재구축. ai-data.js에 'Grok 코딩 팀 재건' 신규 항목 추가.", time: "2026-04-15 12:40 KST" },
      { type: "마켓", sector: "일본 반도체 AI", detail: "4/14 Advantest +8.5%, Kioxia +11.9%, SoftBank +12.7%, Disco +6.3%. Advantest FY26 영업익 가이던스 25% 상향(¥374B)이 촉매.", time: "2026-04-15 12:40 KST" }
    ]
  },
  {
    date: "2026-04-13 10:05 KST",
    summary: "OpenAI DOD 논란·#QuitGPT 여파, 대중국 증류 공동 대응, xAI 구조조정, NEW 배지 정리",
    changes: [
      { type: "거버넌스", sector: "OpenAI", detail: "DOD 분류 네트워크 AI 배포 계약으로 #QuitGPT 운동 확산(250만 서명, 앱 삭제 295% 급증). CEO Altman '성급했다' 인정 후 계약 수정(국내 감시·NSA 사용 배제). Claude가 앱스토어 1위 탈환.", time: "2026-04-13 10:05 KST" },
      { type: "전략", sector: "Anthropic·OpenAI·Google", detail: "Frontier Model Forum 통해 대중국 적대적 증류(adversarial distillation) 공동 대응 개시(4/6). DeepSeek·Moonshot·MiniMax 3사 대상 2.4만 가짜 계정·1,600만 건 추출 적발. 업계 최초 위협 인텔리전스 공유 체계.", time: "2026-04-13 10:05 KST" },
      { type: "리더십·구조조정", sector: "xAI", detail: "SpaceX 합병 후 구조조정: CFO Anthony Armstrong 퇴임, SpaceX Starlink VP Michael Nicholls xAI 사장 취임(4/10). Grok-Sat LEO 프로토타입 테스트 완료. SpaceX $1.75T IPO 추진 중.", time: "2026-04-13 10:05 KST" },
      { type: "최근성 관리", sector: "xAI·OpenAI", detail: "xAI-SpaceX 합병 isNew:false 처리(2/2 완료, 10주 경과). OpenAI Sora 통합 isNew:false 처리(2026년 초 종료, 2개월+ 경과).", time: "2026-04-13 10:05 KST" }
    ]
  },
  {
    date: "2026-04-13 02:26 KST",
    summary: "xAI Grok Imagine 비디오 업데이트, Anthropic MCP 확산, Amazon Trainium $20B 사업",
    changes: [
      { type: "제품 출시", sector: "xAI", detail: "Grok Imagine 비디오 업데이트: 15초 영상+동기화 오디오 생성, Speed/Quality 듀얼 모드(4/3), 음성 프롬프트·키즈 세이프 모드 추가. Imagine 2.0 및 Pro 모드 4월 중 출시 예고.", time: "2026-04-13 02:26 KST" },
      { type: "생태계", sector: "Anthropic", detail: "MCP 누적 설치 9,700만 건 돌파(3월 기준), 실험적 표준에서 핵심 AI 에이전트 인프라로 전환 확인.", time: "2026-04-13 02:26 KST" },
      { type: "인프라·전략", sector: "Amazon AWS", detail: "Jassy 4/9 주주서한: Trainium 칩 사업 연환산 $20B, Trn2 전량 소진·Trn3 거의 완판, 서드파티 랙 판매 검토로 NVIDIA 직접 경쟁 시사.", time: "2026-04-13 02:26 KST" }
    ]
  },
  {
    date: "2026-04-13 00:40 KST",
    summary: "Mistral Voxtral TTS 프론티어급 출시, Microsoft Copilot Cowork GA",
    changes: [
      { type: "모델 출시", sector: "Mistral AI", detail: "Voxtral TTS 수록: 업계 최초 프론티어급 오픈웨이트 음성 합성 모델(4B 파라미터), ElevenLabs 대비 자연스러움 우위, 9개 언어·제로샷 음성 복제 지원으로 Voxtral 음성 스택 완성.", time: "2026-04-13 00:40 KST" },
      { type: "제품 출시", sector: "Microsoft", detail: "Copilot Cowork 수록: M365 내 다단계 장기 실행 자율 태스크 실행 레이어, Anthropic Claude 협업 개발, 3/30 Frontier 프로그램 GA.", time: "2026-04-13 00:40 KST" }
    ]
  },
  {
    date: "2026-04-12",
    summary: "Anthropic $30B ARR 첫 OpenAI 추월·Coefficient Bio 인수, Gemini 3.1 Ultra, ChatGPT Pro $100",
    changes: [
      { type: "마일스톤·인수", sector: "Anthropic", detail: "연환산 매출 $300억으로 OpenAI 최초 추월, 바이오 AI 스타트업 Coefficient Bio 인수.", time: "2026-04-12" },
      { type: "인프라·모델 출시", sector: "Google DeepMind", detail: "Broadcom과 3.5GW 규모 컴퓨트 인프라 딜 체결, Gemini 3.1 Ultra 출시(200만 토큰 컨텍스트).", time: "2026-04-12" },
      { type: "가격·인수", sector: "OpenAI", detail: "ChatGPT Pro $100/월 요금제 신설(Plus와 Pro 사이 포지션), 테크 팟캐스트 TBPN 인수.", time: "2026-04-12" },
      { type: "플랫폼·인프라", sector: "Mistral AI", detail: "Mistral Forge 플랫폼 공개, 파리 데이터센터 $830M 투자 발표.", time: "2026-04-12" },
      { type: "최근성 관리", sector: "xAI", detail: "Grok 4.20·Grok Imagine NEW 배지 해제(출시 4주 경과).", time: "2026-04-12" }
    ]
  },
  {
    date: "2026-04-11",
    summary: "Claude Mythos·Project Glasswing 발표, Muse Spark·Gemma 4·Grok 4.20, OpenAI Sora 종료·GPT-5.5, Mistral Small 4",
    changes: [
      { type: "모델·제품 출시", sector: "Anthropic", detail: "Claude Mythos(차세대 추론 모델) 및 Project Glasswing(자율 에이전트 프레임워크) 발표.", time: "2026-04-11" },
      { type: "모델 출시", sector: "Meta AI", detail: "Superintelligence Labs의 Muse Spark 모델 수록.", time: "2026-04-11" },
      { type: "모델 출시", sector: "Google DeepMind", detail: "Gemma 4 오픈소스 공개.", time: "2026-04-11" },
      { type: "모델·제품 출시", sector: "xAI", detail: "Grok 4.20 멀티에이전트 기능, Grok 5 프리뷰, SpaceX 합병안, Grok Imagine 이미지 생성 추가.", time: "2026-04-11" },
      { type: "제품·펀딩", sector: "OpenAI", detail: "독립 Sora 앱 종료(ChatGPT 통합), GPT-5.5 'Spud' 사전훈련 완료, $1,220억 펀딩, 사이버보안 제품 라인 신설.", time: "2026-04-11" },
      { type: "모델 출시", sector: "Mistral AI", detail: "Mistral Small 4 경량 모델 추가.", time: "2026-04-11" }
    ]
  },
  {
    date: "2026-03-23",
    summary: "GTC 2026 발표 제품·Stitch·Desktop 슈퍼앱·Copilot Tasks·Manus AI·Siri+Gemini",
    changes: [
      { type: "제품 출시", sector: "Google DeepMind", detail: "Stitch(이미지 편집 AI) 추가.", time: "2026-03-23" },
      { type: "제품 라인업", sector: "NVIDIA", detail: "GTC 2026 발표 제품 반영: Isaac GR00T·Cosmos·DGX Spark·Nemotron 3 Super.", time: "2026-03-23" },
      { type: "제품·모델 출시", sector: "OpenAI", detail: "Desktop 슈퍼앱·GPT-5.4 mini 추가.", time: "2026-03-23" },
      { type: "제품 출시", sector: "Microsoft", detail: "Copilot Tasks·MAI-Image-2 추가.", time: "2026-03-23" },
      { type: "제품 출시", sector: "Meta AI", detail: "Manus AI(자율 에이전트) 추가.", time: "2026-03-23" },
      { type: "제품 출시", sector: "Apple", detail: "신형 Siri + Gemini 연동 정보 반영.", time: "2026-03-23" }
    ]
  },
  {
    date: "2026-03-21",
    summary: "수록 기업 재평가 — DeepSeek·Alibaba 제외, Apple·Mistral AI 추가",
    changes: [
      { type: "수록 변경", sector: "전체", detail: "수록 기업 교체 — DeepSeek·Alibaba 제거, Apple·Mistral AI로 대체(선정 기준 재평가).", time: "2026-03-21" }
    ]
  },
  {
    date: "2026-03-20",
    summary: "AI Players 탭 최초 작성 — 8개사 수록",
    changes: [
      { type: "수록 변경", sector: "전체", detail: "AI Players 최초 작성 — OpenAI·Anthropic·Google DeepMind·xAI·Meta AI·Microsoft·NVIDIA·Amazon AWS 8개사 수록.", time: "2026-03-20" }
    ]
  }
];
