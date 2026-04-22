/**
 * update.js — AI Players 업데이트 로그
 *
 * 각 기업의 모델·제품·펀딩·인수 등 콘텐츠 변경 사항을
 * 날짜별로 기록한다.
 */
const UPDATES = [
  {
    date: "2026-04-22 19:12 KST",
    summary: "Google Cloud Next 2026 개막(4/22~24) — Thomas Kurian '에이전틱 클라우드' 키노트·OpenAI GPT-6 Polymarket 확률 72%로 하향",
    changes: [
      { type: "생태계", sector: "Google DeepMind", detail: "Google DeepMind. 4/22~24 Las Vegas Michelob ULTRA Arena에서 Google Cloud Next 2026 개막, Thomas Kurian CEO가 오프닝 키노트 'The Agentic Cloud' 진행(9:00 AM PT = 4/23 01:00 KST). 올해 핵심 메시지는 'AI 에이전트는 더 이상 실험이 아니라 엔터프라이즈 전반에서 프로덕션 중' — 리테일·금융·헬스케어·공공 리더 200+ 세션에서 Gemini 기반 에이전트 확장 사례 공개 예정. Gemini 월 사용자 7.5억, 2025 Q4 클라우드 매출 $17.7B +48%, 백로그 $240B 지원. Gemini 3.1 Flash TTS·Imagen·Veo 3 라인업과 Vertex AI Agent Builder를 핵심 축으로 OpenAI Stargate·Anthropic AWS 동맹과 삼파전 재격돌.", time: "2026-04-22 19:12 KST" },
      { type: "모델 출시 예정", sector: "OpenAI", detail: "OpenAI. 4/14 루머 출시일 무산 후 GPT-6 Polymarket 확률이 4/30 내 78% → 약 72%로 하향, 가장 방어 가능한 윈도우는 4/21~5월 말로 재설정됐다. 'Spud' 프리트레이닝은 3/24 완료, Altman은 'a few weeks' 코멘트를 유지했지만 블로그·모델카드·API 공지는 여전히 공백. 200만 토큰·ChatGPT·Codex·Atlas 단일 에이전트 통합 스펙은 유지, Stargate Abilene 10만+ H100 훈련 인프라와 Cerebras $20B 장기 공급 계약이 출시 대기 체제를 뒷받침.", time: "2026-04-22 19:12 KST" },
    ]
  },
  {
    date: "2026-04-22 13:14 KST",
    summary: "Google Gemini 3.1 Flash TTS 퍼블릭 프리뷰·TTS 리더보드 2위·Grok Speech·ElevenLabs 3파전 본격화",
    changes: [
      { type: "제품 출시", sector: "Google DeepMind", detail: "Google DeepMind. 4/15 Gemini 3.1 Flash TTS 퍼블릭 프리뷰 출시 — 70+ 언어·30개 음성·네이티브 멀티스피커 다이얼로그 지원, 200+ 오디오 태그로 감정(laugh·sigh)·페이싱·억양·포맷 템플릿을 자연어 프롬프트로 네이티브 제어. 가격은 $0.50/1M 글자, AI Studio 무료 프로토타이핑·Gemini API·Vertex AI로 제공. Artificial Analysis TTS 리더보드 Elo 1,211로 ElevenLabs 뒤 종합 2위, OpenAI·Amazon Polly 상회. 4/17 xAI Grok Speech API 출시와 맞물려 보이스 AI 3파전 본격화, Google Cloud Next 4/22~24 키노트에서 엔터프라이즈 통합 시나리오 발표 임박.", time: "2026-04-22 13:14 KST" },
    ]
  },
  {
    date: "2026-04-22 07:05 KST",
    summary: "Apple 15년 만의 CEO 교체 — Tim Cook 9/1 물러나고 하드웨어 SVP John Ternus 취임, AI 전략 재정비가 최우선 과제",
    changes: [
      { type: "리더십", sector: "Apple", detail: "Apple. 4/20 이사회 만장일치로 CEO 승계 발표 — Tim Cook은 9/1부로 Executive Chairman 전환, 후임은 하드웨어 엔지니어링 SVP John Ternus(51). 2011년 잡스 타계 이후 15년 만의 교체이며 수개월간의 계승 플랜 결론. Ternus는 2001년 입사해 iPad·MacBook·iPhone·Apple Silicon 제품 엔지니어링을 총괄했고 공동 출원 특허 3,500건+. 최대 난제는 AI — MS·Google·Amazon·Meta 합산 연 CapEx 수천억 달러 전쟁에서 Apple은 자체 프론티어 LLM 없이 Private Cloud Compute·파트너십 기조를 유지했음. 연 $10억 Gemini 파트너십 기반 신 Siri(iOS 26.5 5월 목표)·WKA 검색·AI 웨어러블 3종(스마트글래스·펜던트·카메라 AirPods) 출시 속도 가속이 취임 전후 시험대. Trump·Altman·Buffett 즉각 반응하며 실리콘밸리 세대교체 상징.", time: "2026-04-22 07:05 KST" },
      { type: "거버넌스", sector: "Anthropic", detail: "Anthropic. 4/21 공시 기준 2026년 Q1 연방 로비 지출 $1.6M으로 분기 기준 사상 최대 — 전년 동기 $360K 대비 4.4배 급증, OpenAI의 $1M(+78.6% YoY) 상회. 주제는 AI 조달·국방부 조달·공급망 리스크·acceptable use policy로 Pentagon과의 분류 설정 사용 제한 공방이 배경. Claude Mythos 사이버보안 역량 공개 이후 국방·인텔리전스 기관 배포 경계를 두고 정치적 갈등 심화, IPO $60B+ 조달 협상 국면에서 규제 리스크 선제 관리.", time: "2026-04-22 07:05 KST" },
    ]
  },
  {
    date: "2026-04-21 19:21 KST",
    summary: "Amazon-Anthropic 추가 $25B 투자 확정·Cerebras IPO S-1 제출 $35B 밸류·AWS $100B+ 약정으로 AI 인프라 자금 지형 재편",
    changes: [
      { type: "펀딩", sector: "Anthropic", detail: "Anthropic. 4/20 Amazon이 추가 최대 $25B 투자를 확정 — 즉시 $5B 집행 + 커머셜 마일스톤 달성 시 추가 $20B 구조. Anthropic은 향후 10년간 AWS 클라우드 서비스에 $100B+ 지출을 약정, Amazon의 기존 Anthropic 투자와 합쳐 AI 칩·인프라 동맹을 전면 강화. 연환산 매출 $300억·$1M+ 엔터프라이즈 1,000+·Google·Broadcom 3.5GW TPU 확장 딜과 병행하며 IPO $60B+ 조달 협상 유지.", time: "2026-04-21 19:21 KST" },
      { type: "인프라", sector: "OpenAI", detail: "OpenAI. 4/17 Cerebras가 Nasdaq IPO S-1 제출(티커 CBRS) — 목표 밸류 $35B+·조달액 $3B+, 2월 시리즈H $23B 대비 +60% 프리미엄. OpenAI의 3년 $20B+ 서버 용량 계약이 핵심 앵커, 총 지출 $30B 도달 시 최대 10% 지분 워런트 행사 가능·$1B 데이터센터 건설 자금 추가 약정. 2025년 매출 $510M·순익 $87.9M·RPO $24.6B로 공시, AWS가 3/13 Bedrock에 Cerebras CS-3 배치 결정과 함께 탄력 공급 기반 구축.", time: "2026-04-21 19:21 KST" },
    ]
  },
  {
    date: "2026-04-21 13:10 KST",
    summary: "프론티어 모델 경쟁 — Claude Opus 4.7 엔터프라이즈 코딩 지배력·OpenAI Codex 컴퓨터 제어·Grok 4.3 SpaceXAI 모델 팩토리 대결 구도",
    changes: [
      { type: "경쟁 지형", sector: "Anthropic", detail: "Anthropic. 4월 연환산 매출 $300억(OpenAI $250억 최초 추월)·$1M+ 엔터프라이즈 고객 1,000+ 유지. Claude Opus 4.7 SWE-bench Pro 64.3%·Claude Code 데스크탑 + Routines + AI 디자인 도구 3종 동시 공개로 엔터프라이즈 코딩 50%+ 점유 유지. 투자자들이 $800B 밸류에이션 신규 오퍼, Google·Broadcom 3.5GW TPU 확장 딜과 IPO $60B+ 조달 협상 병행.", time: "2026-04-21 13:10 KST" },
      { type: "경쟁 지형", sector: "OpenAI", detail: "OpenAI. 4/16 'Codex for (almost) everything' 대규모 업데이트로 데스크톱 컴퓨터 제어·다수 에이전트 병렬·90+ 플러그인 탑재, Claude Code 정면 도전. 4/17 Cerebras와 3년 $20B+ 서버 용량 다년 계약 체결(지분 워런트 포함)로 Stargate($400B)·Amazon($100B) 외 세 번째 공급선 확보, NVIDIA 의존도 축소 본격화. GPT-6 출시 윈도우는 5월이 최고 확률(Polymarket 4/30 이내 78%).", time: "2026-04-21 13:10 KST" },
      { type: "경쟁 지형", sector: "xAI", detail: "xAI. 4/17 Grok 4.3 Beta(SuperGrok Heavy $300/월 한정)·Grok Speech STT/TTS API·XChat 슈퍼앱을 3일간 연속 공개하며 'SpaceXAI 모델 팩토리' 일 단위 배포 체제 가동. Grok 5(6T MoE, Q2 2026 목표)는 Colossus 2 슈퍼클러스터 1.5GW 풀 가동 훈련 중. 4/14 Cursor 제품엔지니어링 리더 Andrew Milich·Jason Ginsberg 영입해 Grok 코딩 에이전트 '0에서 재구축' 착수 — Claude Code·Codex 열세 인정.", time: "2026-04-21 13:10 KST" },
    ]
  },
  {
    date: "2026-04-20 19:19 KST",
    summary: "xAI Grok Speech STT·TTS API 엔터프라이즈 공개 — ElevenLabs·Deepgram 정면 경쟁, Tesla·Starlink 구동 스택의 API화",
    changes: [
      { type: "제품 출시", sector: "xAI", detail: "xAI Grok Speech API. 4/17 공식 공개 — Grok Voice·Tesla 차량·Starlink 고객지원을 실서비스로 구동하는 내부 음성 스택을 엔터프라이즈 개발자용 독립 STT·TTS API 두 개로 분리 출시. STT는 25+ 언어·단어별 타임스탬프·스피커 다이어라이제이션·멀티채널 지원, 배치 $0.10/시간·스트리밍 $0.20/시간. TTS는 5개 음성·20+ 언어, [laugh]·[sigh]·[whisper] 등 감정 태그 인라인 제어, $4.20/1M 글자. 전화 통화 엔티티 인식 오류율 5.0%(ElevenLabs 12%·Deepgram 13.5%·AssemblyAI 21.3% 대비)를 직접 제시하며 보이스 AI 1위 ElevenLabs의 가격대까지 공격. Grok 4.3 Beta·XChat 슈퍼앱과 묶이며 'SpaceXAI 모델 팩토리' 일 단위 배포 체제의 첫 음성 독립 제품.", time: "2026-04-20 19:19 KST" },
    ]
  },
  {
    date: "2026-04-20 07:16 KST",
    summary: "xAI Grok 4.3 Beta SuperGrok Heavy 전용 출시, Anthropic Claude Code 데스크탑 리디자인+Routines 공개, GPT-6 출시 윈도우 재정비",
    changes: [
      { type: "모델 출시", sector: "xAI", detail: "xAI Grok 4.3 Beta. 4/17 iOS·Android·웹에 얼리 액세스로 공개, 접근 권한은 SuperGrok Heavy($300/월) 구독자 한정. 라이브 체크포인트는 0.5T 파라미터이고 1T 풀 버전은 초기 훈련 최종 약 5일 앞이라고 Musk가 4/18 명시. 네이티브 PDF·PPT·스프레드시트 생성과 비디오 인풋 추가로 오피스 문서 생산성·멀티모달 비디오 이해에 초점, 롱컨텍스트 처리 대폭 강화. 공식 블로그·모델카드·서드파티 벤치 없이 소프트 런치 — 'SpaceXAI 모델 팩토리'가 매일 개선 배포·2주마다 베이스 모델 갱신 체제로 전환.", time: "2026-04-20 07:16 KST" },
      { type: "제품 출시", sector: "Anthropic", detail: "Anthropic Claude Code. 4/14 데스크탑 앱(Mac·Windows) 전면 리디자인과 함께 'Routines' 리서치 프리뷰 동시 공개. 앱은 Mission Control 멀티 세션 사이드바·드래그앤드롭 패널 레이아웃·통합 터미널·인앱 파일 에디터·HTML/PDF 프리뷰·고속 diff 뷰어로 재구성. Routines는 Claude Code 웹 인프라에서 실행되는 반복 자동화로 스케줄·API(HTTP POST·베어러 토큰)·GitHub 이벤트(pull_request·push·issues·releases·check_runs) 세 가지 트리거 지원 — Mac이 오프라인이어도 동작. Pro 5건/일·Max 15건·Team/Enterprise 25건 쿼터. 크론 자동화·엔터프라이즈 워크플로우 영역으로 Claude Code 영토 확장.", time: "2026-04-20 07:16 KST" },
      { type: "모델 출시 예정", sector: "OpenAI", detail: "OpenAI GPT-6. 4/14 글로벌 출시설 공식 부인 이후 블로그·모델카드·API 공지 부재 상태 지속. 'Spud' 프리트레이닝 3/24 완료 이후 OpenAI 전형 3~6주 런치 사이클을 가정하면 4월 말~6월 초, 5월이 최고 확률 윈도우로 재정리. Polymarket은 4/30 내 출시 확률 78%·6/30 내 95%로 유지. Stargate Abilene 데이터센터 10만+ H100 GPU에서 훈련 확인, SWE-bench Pro 고70%대 도달 여부에 따라 GPT-6 vs GPT-5.5 최종 명명 결정 — 200만 토큰 컨텍스트·ChatGPT·Codex·Atlas 단일 에이전트 통합 스펙은 유지.", time: "2026-04-20 07:16 KST" },
      { type: "생태계", sector: "Google DeepMind", detail: "Google. 4/22~24 라스베이거스 Google Cloud Next 2026 개막 대기 — Vertex AI·Gemini·에이전틱 코딩·Next at Night(Allegiant Stadium) 구성. 엔터프라이즈가 실제로 운영하는 에이전틱 시스템의 거버넌스·비용·파이프라인 통합이 메인 테마로 재편. 4/15 공개된 Gemini 3.1 Flash TTS(자연어로 속도·톤·강조 제어)는 ElevenLabs 정면 도전 포지션. 4/29 Q1 어닝 프리뷰: Search +16.5%·Cloud +57.5% YoY 기대.", time: "2026-04-20 07:16 KST" },
    ]
  },
  {
    date: "2026-04-19 19:08 KST",
    summary: "OpenAI GPT-Rosalind 라이프사이언스 모델 공개, Mistral AI가 삼성 화성캠퍼스 방문해 HBM 공급 협의",
    changes: [
      { type: "모델 출시", sector: "OpenAI", detail: "OpenAI GPT-Rosalind. 4/16 공개된 로잘린드 프랭클린 이름의 첫 라이프사이언스 전용 프론티어 추론 모델. 유전체·단백질 엔지니어링·화학 파인튜닝으로 증거 합성·가설 생성·실험 설계 자동화. BixBench 공개 SOTA, LABBench2 11개 과제 중 6개에서 GPT-5.4 상회(CloningQA 격차 최대). Trusted Access 리서치 프리뷰로 미국 엔터프라이즈 한정, Amgen·Moderna·Allen Institute·Thermo Fisher가 초기 파트너. 일반 공개·오픈소스 없이 안전 심사 통과 연구 조직에만 배포해 이중 용도 위험 통제. Anthropic Coefficient Bio 인수에 이어 양대 프론티어의 바이오 AI 전선 격화.", time: "2026-04-19 19:08 KST" },
      { type: "인프라", sector: "Mistral AI", detail: "Mistral AI. 4/19 국내 보도 — Arthur Mensch CEO와 경영진이 4/16 삼성전자 화성 캠퍼스를 방문, 반도체 부문 전영현 부회장과 AI 메모리 협력을 논의한 사실이 확인됨. HBM4·차세대 메모리 공급선 확보가 주제였으며 공식 계약은 미체결. 파리 Bruyères 자체 데이터센터(13,800 NVIDIA GPU·44MW) 하반기 가동과 맞물려 SK하이닉스 독점 구도에 의존하지 않는 유럽 AI 주권 인프라 전략을 가속. 삼성 입장에서는 엔비디아·하이퍼스케일러 외 프론티어 고객 확장의 신호.", time: "2026-04-19 19:08 KST" },
    ]
  },
  {
    date: "2026-04-19 13:12 KST",
    summary: "OpenAI $20B Cerebras 다년 컴퓨트 계약 — Stargate·Amazon에 이은 NVIDIA 외 공급선 다변화 본격화",
    changes: [
      { type: "인프라", sector: "OpenAI", detail: "OpenAI. 4/17 Cerebras와 향후 3년 $20B 이상 서버 용량 확보 다년 계약 체결 보도. 계약에는 Cerebras 지분 소수를 취득할 수 있는 워런트 옵션 포함. Stargate($400B)·Amazon($100B) 인프라 트랙과 별개, NVIDIA 의존도를 낮추기 위한 인프라 공급선 다변화로 해석. Cerebras는 IPO를 앞둔 시점에서 재무 가시성 대폭 확대, WSE-4 웨이퍼 스케일 추론 아키텍처의 대규모 상업 검증 신호.", time: "2026-04-19 13:12 KST" },
    ]
  },
  {
    date: "2026-04-18 13:17 KST",
    summary: "Meta MTIA 300~500 커스텀 AI 칩 4세대 로드맵 공개 — Broadcom 1GW+ 파트너십 확장으로 NVIDIA 의존도 축소",
    changes: [
      { type: "인프라", sector: "Meta AI", detail: "Meta MTIA 300/400/450/500 4세대 커스텀 AI 칩 로드맵 4/17 공식화. 2027년 말까지 자체 데이터센터에 단계 배포, Broadcom 공동설계로 학습·추론 분리 가속기 포함. Broadcom과 2029년까지 1GW+ 컴퓨트 다년 파트너십 확장 발표. 연 $1,200억 AI CapEx 방어와 NVIDIA 의존도 축소 동시 추진 — Llama·Muse Spark 차세대 훈련 투입 예정. 공개와 동시에 Broadcom 주가 호재로 반응.", time: "2026-04-18 13:17 KST" },
      { type: "펀딩", sector: "Anthropic", detail: "Anthropic이 $8,000억 밸류 신규 펀딩 오퍼를 투자자들로부터 수령 — 2월 $3,500억 프리머니에서 두 달 만에 2배 이상. 연환산 매출이 3월 $190억에서 4월 $300억으로 급등하며 OpenAI($250억)를 사상 처음 추월한 직후 제시된 오퍼다. Opus 4.7 GA·Mythos Preview 공개·Project Glasswing(Apple·Google·Microsoft 등 40여 곳 제한 배포) 연속 이벤트가 밸류 재평가를 주도. Goldman·JPM·MS 주관 IPO는 10월 $60B+ 조달 협상 중.", time: "2026-04-18 13:17 KST" },
    ]
  },
  {
    date: "2026-04-18 07:19 KST",
    summary: "OpenAI Codex 대규모 업데이트 — 데스크톱 컴퓨터 제어·메모리·90+ 플러그인·멀티에이전트 워크플로우로 Claude Code 정면 도전",
    changes: [
      { type: "제품 출시", sector: "OpenAI", detail: "OpenAI Codex. 4/16 'Codex for (almost) everything' 대규모 업데이트 공개. 핵심 추가 기능 세 가지 — (1) Computer Use: macOS에서 Codex가 자체 커서로 모든 앱을 보고·클릭·입력하며, 다수 에이전트를 사용자 작업과 간섭 없이 병렬 실행. (2) 메모리(preview): 선호·수정·맥락을 누적해 후속 작업 품질과 속도 향상, 아침마다 '어제 작업 이어가기' 제안. (3) 90+ 플러그인·앱내 브라우저·이미지 생성 내장으로 멀티 에이전트 워크플로우 완성. ChatGPT 로그인 데스크톱 사용자부터 순차 롤아웃, EU·UK·엔터프라이즈·에듀는 곧 추가. 주간 개발자 300만 명 규모로 Anthropic Claude Code의 코딩 패권에 정면 도전.", time: "2026-04-18 07:19 KST" },
    ]
  },
  {
    date: "2026-04-17 19:11 KST",
    summary: "xAI XChat iOS 정식 출시 — Grok 엔진 탑재 암호화 메신저로 WeChat·WhatsApp 대항 슈퍼앱 전환 본격화",
    changes: [
      { type: "제품 출시", sector: "xAI", detail: "xAI XChat. 4/17 iOS App Store 정식 출시. 전화번호 없이 X 계정으로 로그인 가능한 엔드투엔드 암호화 메신저 — 음성·영상통화·대형 그룹·사라지는 메시지·파일 공유 지원, 46개 언어. Grok 엔진이 채팅 레이어에 네이티브 통합돼 문서 요약·질문 응답·일정 계획을 실시간 실행. X Money·Grok Computer와 결합해 Musk의 'Everything App' 로드맵 첫 실체화 단계. Android는 이후 출시. WeChat 모델을 겨냥한 슈퍼앱 시동으로 WhatsApp·Telegram·Signal과 직접 경쟁.", time: "2026-04-17 19:11 KST" },
    ]
  },
  {
    date: "2026-04-17 07:04 KST",
    summary: "Anthropic Claude Opus 4.7 정식 출시, AI 디자인 도구 동시 공개 — SWE-bench Pro 64.3%로 공개 모델 1위 탈환",
    changes: [
      { type: "모델 출시", sector: "Anthropic", detail: "Claude Opus 4.7 4/16 정식 출시. SWE-bench Pro 64.3%(GPT-5.4 57.7% 상회)·코딩 벤치마크 +13%·에이전틱 추론 +14%·툴 에러 1/3 감소. 3.75MP 고해상도 비전(기존 1.15MP 대비 3배), 새 xhigh effort 레벨 추가, 장시간 에이전트 메모리 대폭 개선. 사이버보안 자동 차단 최초 탑재. API·claude.ai·Bedrock·Vertex·Foundry 동시 출시, Opus 4.6과 동일 가격.", time: "2026-04-17 07:04 KST" },
      { type: "제품 출시", sector: "Anthropic", detail: "Anthropic AI 디자인 도구 4/16 공개. 자연어 프롬프트로 웹사이트·랜딩 페이지·프레젠테이션 자동 생성. Figma 연동(AI 생성 코드→편집 가능 디자인 변환)·Word·PPT 통합. 비개발자도 사용 가능한 프로덕트로 Adobe·Wix·Figma 주가 -2%+ 하락. 순수 모델 회사에서 디자인 프로덕트 회사로의 확장 신호.", time: "2026-04-17 07:04 KST" },
    ]
  },
  {
    date: "2026-04-16 17:30 KST",
    summary: "Google Gemini Robotics-ER 1.6 공개·Mistral Codestral 2 Apache 2.0 출시·Apple Siri·Vera Rubin 풀프로덕션 등 최근성 정리",
    changes: [
      { type: "제품 출시", sector: "Google DeepMind", detail: "Gemini Robotics-ER 1.6 4/14 공개. 공간 추론·다뷰 성공 감지·에이전틱 비전으로 고정밀 산업 태스크에 특화. Boston Dynamics와 공동 개발해 Atlas·Spot이 아날로그 게이지·온도계·디지털 판독값을 시설 점검 중 해석. Gemini API·AI Studio에 배포, Orbit AIVI 시스템에 통합.", time: "2026-04-16 17:30 KST" },
      { type: "모델 출시", sector: "Mistral AI", detail: "Codestral 2 4/8 출시. 22B 밀집 모델·Apache 2.0 라이선스로 상업 제한 해제. HumanEval·MBPP에서 GPT-4o 상회, Fill-in-the-Middle 네이티브 학습. 출시 1주일 만에 다운로드 38만+ — 유럽 오픈 코딩 모델 새 기준.", time: "2026-04-16 17:30 KST" },
      { type: "전략", sector: "Apple", detail: "신 Siri + Gemini 연동 일정 재조정: iOS 26.4 → iOS 26.5(5월) 엔지니어링 이슈로 연기, 완전 대화 경험은 iOS 27(9월) 예정. Gemini 1.2조 파라미터 커스텀 모델을 Private Cloud Compute에서 구동. WKA(World Knowledge Answers) AI 검색 엔진 탑재로 Perplexity·ChatGPT와 직접 경쟁, 연 $10억 파트너십.", time: "2026-04-16 17:30 KST" },
      { type: "인프라", sector: "NVIDIA", detail: "Vera Rubin 4월 풀 프로덕션 진입. GTC 2026에서 6개 신규 칩과 Rubin CPX 'massive-context inference' GPU 추가 공개. Meta·CoreWeave 대형 딜 확정, Blackwell 대비 추론 토큰 비용 10배 절감·MoE 훈련 GPU 수 4배 절감. 하반기 AWS·GCP·Azure·OCI·CoreWeave에서 Rubin 인스턴스 첫 배포.", time: "2026-04-16 17:30 KST" },
      { type: "최근성 관리", sector: "Anthropic·Google DeepMind·Microsoft·Mistral AI", detail: "4월 초~중순 출시 항목 NEW 배지 해제: Anthropic Coefficient Bio 인수, Google Gemini 3.1 Ultra·Gemma 4, Microsoft Copilot Cowork, Mistral 파리 데이터센터·Voxtral TTS.", time: "2026-04-16 17:30 KST" },
    ]
  },
  {
    date: "2026-04-15 21:38 KST",
    summary: "xAI Grok 5 출시 Q2 2026으로 재조정·XChat 예정, OpenAI GPT-6 루머 정리",
    changes: [
      { type: "모델 출시 예정", sector: "xAI", detail: "Grok 5 Q1 2026 목표 공식 지연 → Q2 2026(5~6월 퍼블릭 베타) 윈도우로 재조정. Colossus 2(1.5GW) 훈련 여전히 진행 중, 6T 파라미터 MoE 아키텍처 유지. Musk 4/14 '내 AGI 달성 확률 추정 10% 수준, 상승 중' 발언. XChat(위챗 경쟁 서비스) 4/17 Grok 엔진 탑재 출시 예정. ai-data.js의 Grok 5 항목에 Q2 2026 윈도우 재확인.", time: "2026-04-15 21:38 KST" },
      { type: "모델 출시 예정", sector: "OpenAI", detail: "GPT-6 루머 추가 정리: Polymarket 4/30 이전 출시 확률 78% 유지, 5/25까지 윈도우 컨센서스. 3/24 Spud 프리트레이닝 종료 이후 외부 공식 발표 부재. GPT-5.5 vs GPT-6 네이밍 미확정(퍼포먼스 점프 크기에 따라 결정). 출시 임박 스탠스 유지.", time: "2026-04-15 21:38 KST" }
    ]
  },
  {
    date: "2026-04-15 20:14 KST",
    summary: "Anthropic Opus 4.7·AI 디자인 툴 출시 임박, Mistral 최근성 관리",
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
      { type: "펀딩", sector: "Anthropic", detail: "투자자들이 $800B 밸류에이션 신규 펀딩 오퍼 제시(4/14 Bloomberg). 2월 Series G pre-money $350B의 2배 이상, IPO 10월 $380B 타깃 부각. 매출·인프라·밸류 마일스톤 항목에 통합.", time: "2026-04-15 12:40 KST" },
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
      { type: "제품 라인업", sector: "NVIDIA", detail: "GTC 2026 발표 제품: Isaac GR00T·Cosmos·DGX Spark·Nemotron 3 Super.", time: "2026-03-23" },
      { type: "제품·모델 출시", sector: "OpenAI", detail: "Desktop 슈퍼앱·GPT-5.4 mini 추가.", time: "2026-03-23" },
      { type: "제품 출시", sector: "Microsoft", detail: "Copilot Tasks·MAI-Image-2 추가.", time: "2026-03-23" },
      { type: "제품 출시", sector: "Meta AI", detail: "Manus AI(자율 에이전트) 추가.", time: "2026-03-23" },
      { type: "제품 출시", sector: "Apple", detail: "신형 Siri + Gemini 연동 정보 추가.", time: "2026-03-23" }
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
