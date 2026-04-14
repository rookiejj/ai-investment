const META = { year: "2026", month: "4" };
const BL={llm:"LLM",img:"이미지",vid:"비디오",agt:"에이전트",hw:"하드웨어",code:"코딩",sci:"과학AI",ui:"UI 디자인"};
const data=[
{rank:1,name:"OpenAI",url:"https://openai.com",type:"AI 전문 기업",focus:"범용 AGI 개발",products:[
  {name:"GPT-5.4 / GPT-5.4 Pro",url:"https://openai.com/chatgpt/",isNew:false,badges:["llm","agt"],desc:"최전선 플래그십. Standard·Thinking·Pro 3단계. 100만 토큰 컨텍스트, OSWorld-V 75%(인간 72.4% 초과). GDPVal 83% — 경제적 가치를 창출하는 실제 직업 업무에서 인간 전문가 수준 도달. Artificial Analysis Index 공동 1위(57점)."},
  {name:"GPT-5.4 mini / nano",url:"https://openai.com/chatgpt/",isNew:false,badges:["llm"],desc:"Free·Go 사용자 대상 'Thinking' 기능으로 제공. 유료 사용자의 사용량 초과 시 폴백 모델. nano는 초경량 버전. GPT-5.3 Instant Mini도 병행 운영 중."},
  {name:"GPT-5.5 'Spud' (출시 예정)",url:"https://openai.com/news/",isNew:true,badges:["llm"],desc:"사전훈련 완료, Q2 2026 공개 예정. GPT-5.5 또는 GPT-6 브랜딩 검토 중. 컴퓨터 사용·에이전틱 능력 대폭 강화 예상. 독립 Sora 앱 종료로 확보한 컴퓨팅 자원을 Spud에 집중 투입."},
  {name:"Codex (에이전틱 코딩)",url:"https://openai.com/index/introducing-codex/",isNew:false,badges:["code","agt"],desc:"팀 단위 종량제(pay-as-you-go) 과금 도입(4/2). Codex 전용 시트 신설 — 고정 좌석비 없이 사용량 기반 청구. Plus($20): 일상적 코딩, Pro($100): 장시간 고강도 세션, Pro($200): 최대 사용량. 멀티 파일 리팩토링·대형 코드베이스 자율 실행."},
  {name:"ChatGPT 플랫폼",url:"https://chatgpt.com",isNew:false,badges:["agt"],desc:"주간 활성 사용자 9억 명. 연환산 매출 $240억(월 $20억), 기업가치 $8,400억. DOD 분류 네트워크 배포 계약으로 #QuitGPT 운동 250만 서명·삭제 295% 급증, Claude가 앱스토어 1위 탈환. 계약 수정하여 국내 감시·NSA 사용 배제 명시. 4/9 ChatGPT Pro $100/월 출시. 3월 $1,220억 펀딩. IPO 2026년 말 검토 중."},
  {name:"Sora → ChatGPT 통합",url:"https://openai.com/sora/",isNew:false,badges:["vid"],desc:"독립 Sora 앱 2026년 초 종료 — DAU 50만 미만, 분당 $15,000 추산 컴퓨팅 비용 대비 누적 매출 $210만. Disney $10억 파트너십도 해소. 동영상 생성 기능은 ChatGPT 메인 플랫폼으로 통합 이전."},
  {name:"OpenAI 사이버보안 제품",url:"https://openai.com/news/",isNew:true,badges:["agt","code"],desc:"'Trusted Access for Cyber' 파일럿 프로그램. GPT-5.3-Codex 기반, 고급 취약점 탐지·익스플로잇 역량. 소수 파트너에만 제한 배포. Anthropic Mythos와 동일한 보안 우려로 비공개 접근 방식 채택."},
  {name:"Project Stargate",url:"https://openai.com/index/announcing-the-stargate-project/",isNew:false,badges:["hw"],desc:"MS·Oracle·SoftBank와의 $5,000억 AI 인프라 합작. Amazon과 별도 $1,000억 컴퓨팅 협약. NVIDIA Vera Rubin 수백만 개 탑재 목표."}
]},
{rank:2,name:"Anthropic",url:"https://anthropic.com",type:"AI 안전 전문 기업",focus:"안전·신뢰 기반 엔터프라이즈 AI",products:[
  {name:"Claude Mythos Preview + Project Glasswing",url:"https://red.anthropic.com/2026/mythos-preview/",isNew:true,badges:["llm","code","sci"],desc:"4월 7일 공개 — 역대 가장 강력한 모델이나 공개 배포 없음. 17개/18개 벤치마크 1위. CyberGym 취약점 재현 83.1%(Opus 4.6 66.6%). 17년 된 FreeBSD 원격 코드 실행 취약점(CVE-2026-4747) 완전 자율 발견·익스플로잇. 'Opus 위의 새로운 티어(코드명 Capybara)'. Project Glasswing으로 사이버보안 방어 기업 40여 곳 제한 배포, 방어자에게 $1억 크레딧 제공. CrowdStrike·Palo Alto 등 보안주 급락."},
  {name:"Claude Opus 4.6",url:"https://claude.ai",isNew:false,badges:["llm","code"],desc:"현재 공개 플래그십. SWE-Bench Verified 80.8%로 GPT-5.4(77.2%) 상회, 코딩 에이전트 1위. 100만 토큰 컨텍스트(베타). Mythos 등장으로 사실상 '두 번째로 강력한 Anthropic 모델'."},
  {name:"매출·인프라 마일스톤",url:"https://www.anthropic.com/news",isNew:true,badges:["llm","agt"],desc:"4월 연환산 매출 $300억 돌파 — 사상 처음 OpenAI($240억) 추월. 3월 $190억 → 4월 $300억, 2월 대비 2배. $1M+ 연간 지출 엔터프라이즈 고객 1,000+ (2월 500 → 2개월 만에 2배). 매출의 80%가 B2B. 훈련 비용은 OpenAI의 약 1/4. IPO 10월 조기 가능성 거론. 4/7 Google·Broadcom과 3.5GW TPU 컴퓨트 딜 확장 — 수요 폭증 대응."},
  {name:"Coefficient Bio 인수",url:"https://www.anthropic.com/news",isNew:true,badges:["sci","agt"],desc:"4/2 약 $40억 규모 주식 인수 — 라이프사이언스 R&D 파이프라인 진입. 2025년 12월 Bun(JS 런타임, Claude Code 인프라), 2026년 2월 Vercept(컴퓨터 사용 에이전트)에 이은 세 번째 전략 인수. Anthropic의 과학·생명공학 AI 확장 본격화."},
  {name:"Claude Sonnet 4.6",url:"https://claude.ai",isNew:false,badges:["llm","code"],desc:"Claude.ai 기본 무료 모델. API $3/$15(100만 토큰). 엔터프라이즈 코딩 시장 점유율 50% 기여. 4/4 OpenClaw 등 서드파티 에이전틱 하네스로의 구독 사용 제한 — 추론 용량을 고가치 엔터프라이즈 고객에 집중."},
  {name:"Claude Code",url:"https://docs.anthropic.com/en/docs/claude-code/overview",isNew:false,badges:["code","agt"],desc:"개발자 전용 코딩 에이전트. 엔터프라이즈 AI 코딩 시장 50%+ 점유. 멀티 에이전트 병렬 처리. Anthropic 전체 매출의 절반 이상 기여."},
  {name:"MCP (Model Context Protocol)",url:"https://modelcontextprotocol.io",isNew:false,badges:["agt"],desc:"AI 에이전트 간 통신 표준 프로토콜. Linux Foundation 오픈 거버넌스 이관. 3월 누적 설치 9,700만 건 돌파. 4/6 OpenAI·Google과 Frontier Model Forum 통해 대중국 적대적 증류(distillation) 공동 대응 — DeepSeek·Moonshot·MiniMax 등 3개사 2.4만 가짜 계정, 1,600만 건 추출 적발. 업계 최초 위협 인텔리전스 공유."},
  {name:"메모리 기능 + 엔터프라이즈 플러그인",url:"https://claude.ai",isNew:false,badges:["agt"],desc:"3월 전체 사용자 롤아웃. 대화 간 컨텍스트·선호도 기억 유지. 엔터프라이즈 커스터마이저블 플러그인: 기업 소프트웨어 내 태스크 자율 실행."}
]},
{rank:3,name:"Google DeepMind",url:"https://deepmind.google",type:"AI 연구 + 빅테크",focus:"멀티모달·과학 AI 통합",products:[
  {name:"Gemini 3.1 Ultra",url:"https://gemini.google.com",isNew:true,badges:["llm","agt","vid"],desc:"2026년 가장 의미 있는 Gemini 릴리즈. 200만 토큰 컨텍스트(공개 모델 최대), 텍스트·이미지·오디오·비디오 네이티브 동시 추론 — 전사 단계 없이 직접 처리. Advanced 플랜·AI Studio·API에서 순차 롤아웃. Google Search AI Overviews 통합 심화. Gemini 월간 사용자 7.5억 명 돌파."},
  {name:"Gemini 3.1 Pro",url:"https://gemini.google.com",isNew:false,badges:["llm","agt"],desc:"16개 주요 벤치마크 중 13개 1위. ARC-AGI-2 77.1%, GPQA Diamond 94.3%. 100만 토큰 컨텍스트. 추론 기본 내장(Deep Think 상시). 실시간 60fps 비디오 처리. Apple Siri 리뉴얼에 Gemini 모델 공급. Alphabet 연간 매출 $4,000억 돌파."},
  {name:"Gemini 3.1 Flash / Flash-Lite",url:"https://ai.google.dev/gemini-api/docs/models",isNew:false,badges:["llm"],desc:"Flash-Lite: 입력 100만 토큰당 $0.25. Flash: 구글 검색 전 세계 롤아웃 완료. Samsung Galaxy와 협력해 멀티스텝 모바일 AI 에이전트 시연."},
  {name:"Gemma 4 (오픈소스)",url:"https://ai.google.dev/gemma",isNew:true,badges:["llm"],desc:"4월 2일 Apache 2.0 라이선스로 출시. 모바일 ~ 워크스테이션 4가지 사이즈. 네이티브 비전·오디오·140개 이상 언어 지원. Gemini 3.1 Pro 동일 연구 기반. 상업적 제한 없음. Gemma 계열 누계 다운로드 4억 회 돌파. 하드웨어 요건이 낮아 개발자·스타트업 접근성 최고."},
  {name:"Stitch (AI UI 디자인 캔버스)",url:"https://stitch.withgoogle.com",isNew:false,badges:["ui","code","agt"],desc:"3월 19일 대규모 리디자인 공개. 자연어·음성·이미지·코드 → 고품질 UI 자동 생성. AI 네이티브 무한 캔버스 + 디자인 에이전트. Claude Code·Cursor·Gemini CLI와 MCP 서버 연동. Figma 주가 8% 급락. 월 350회 무료."},
  {name:"Veo 3",url:"https://deepmind.google/technologies/veo/",isNew:false,badges:["vid"],desc:"최상위 동영상 생성 모델. 텍스트/이미지→고품질 동영상. 현실적 물리 법칙 시뮬레이션. OpenAI Sora 단독 앱 종료로 사실상 비디오 AI 1위 포지션 강화."},
  {name:"Imagen / Nano Banana 2",url:"https://deepmind.google/technologies/imagen-3/",isNew:false,badges:["img"],desc:"Gemini 3 기반 최상위 이미지 생성·편집. 캐릭터 일관성 유지, 고정밀 편집 특화."},
  {name:"AlphaFold 3 / AlphaEvolve",url:"https://alphafold.ebi.ac.uk",isNew:false,badges:["sci"],desc:"AlphaFold 3: 단백질·DNA·소분자 상호작용 예측. AlphaEvolve: Gemini 기반 알고리즘 발견. NVIDIA와 MuJoCo-Warp 공동 개발: 로보틱스 ML 70배 가속. Intrinsic(산업 로보틱스) DeepMind 편입."},
  {name:"Gemini CLI / Vertex AI",url:"https://cloud.google.com/vertex-ai",isNew:false,badges:["code","agt"],desc:"Gemini CLI: 개발자용 오픈소스 AI 에이전트. Vertex AI: 엔터프라이즈 맞춤 모델 구축. Google Cloud AI 매출 $150억+(2025년)."}
]},
{rank:4,name:"xAI",url:"https://x.ai",type:"AI 전문 기업 (Elon Musk)",focus:"추론 특화 + 피지컬 AI 확장",products:[
  {name:"Grok 4.20 (멀티에이전트 아키텍처)",url:"https://x.ai/grok",isNew:false,badges:["llm","agt"],desc:"2월 출시, 3/3 Beta 2 업데이트로 지시 따르기·환각 감소·LaTeX 강화. 업계 최초 네이티브 멀티에이전트 추론 구조 — 복잡한 쿼리마다 4개 전문 에이전트(Grok·Harper·Benjamin·Lucas)가 병렬 실행, 실시간 토론 후 단일 답변 생성. Alpha Arena 실거래 AI 투자 경쟁에서 유일하게 수익 달성. X 플랫폼 실시간 데이터 접근. API 공개."},
  {name:"Grok 5 (출시 예정)",url:"https://x.ai/grok",isNew:true,badges:["llm"],desc:"Q2 2026 목표. 6조 파라미터 MoE 아키텍처 — 역대 공개 발표 모델 중 최대 규모. Colossus 2 슈퍼클러스터(1.5GW 풀 가동)에서 훈련 중. 스케일 베팅: '가장 큰 모델이 가장 강하다'는 가정 검증 예정."},
  {name:"Grok 4.1 / Grok 4 시리즈",url:"https://x.ai/grok",isNew:false,badges:["llm"],desc:"Grok 4.1: LMArena Text Arena 1위(Elo 1483). ARC-AGI v2 15.9% SOTA, Humanity's Last Exam 25.4%. 'Think'·'Big Brain' 고급 추론 모드."},
  {name:"Grok Imagine (비디오 생성)",url:"https://x.ai",isNew:false,badges:["vid"],desc:"2/2 출시. 15초 720p 영상+동기화 오디오·배경음악·효과음 생성. 4/3 Speed/Quality 듀얼 모드 추가 — Quality 모드는 고해상도 4장, Speed 모드는 초고속 생성. 음성 프롬프트·키즈 세이프 모드 지원. Imagine 2.0(표정·오디오 일관성 대폭 강화) 수주 내 출시 예정. Pro 모드도 4월 중 공개 예고."},
  {name:"xAI-SpaceX 합병 ($1.25T)",url:"https://x.ai",isNew:false,badges:["hw","sci"],desc:"2/2 사상 최대 합병 완료: SpaceX $1T + xAI $250B = $1.25T. 4/10 CFO Armstrong 퇴임, SpaceX Starlink VP Michael Nicholls가 xAI 사장 취임. Grok-Sat 프로토타입 LEO 테스트 확인 — 궤도 AI 처리 비용 지상 대비 40% 절감 가능성. Colossus 2 슈퍼클러스터(1.5GW). SpaceX $1.75T IPO 추진 중."}
]},
{rank:5,name:"Meta AI",url:"https://ai.meta.com",type:"빅테크 (AI 재건 전략)",focus:"슈퍼인텔리전스 연구 + 광고 AI 통합",products:[
  {name:"Muse Spark (Meta Superintelligence Labs)",url:"https://meta.ai",isNew:true,badges:["llm","agt"],desc:"4월 8일 출시. 전직 Scale AI CEO Alexandr Wang 주도, $143억 투자로 재건한 Meta Superintelligence Labs 첫 모델(코드명 Avocado). 오픈소스 Llama 전략에서 전환 — 현재 프로프라이어터리, 향후 오픈소스화 검토. Artificial Analysis Intelligence Index 4위(52점). 10배 적은 컴퓨팅으로 Opus급 성능 주장. 쇼핑 모드·Contemplating 모드(병렬 서브에이전트) 내장. meta.ai 및 Meta AI 앱 제공. Instagram·WhatsApp·Facebook 통합 예정. 사설 API 프리뷰 선별 파트너 제공."},
  {name:"Llama 4 (Scout / Maverick)",url:"https://llama.meta.com",isNew:false,badges:["llm","agt"],desc:"멀티모달 오픈소스. Scout: 경량, Maverick: 400B 파라미터, 1,000만 토큰 컨텍스트 윈도우. Hugging Face 누계 3.5억+ 다운로드. Muse Spark 등장으로 Meta의 오픈소스 플래그십 역할로 재포지셔닝."},
  {name:"Meta AI (소비자 어시스턴트)",url:"https://meta.ai",isNew:false,badges:["agt"],desc:"Instagram·WhatsApp·Facebook·Messenger 통합. 5억 사용자 돌파. 곧 Muse Spark로 엔진 교체 예정. Ray-Ban Meta 스마트 글라스 'Hear Better' AI 기능 탑재."},
  {name:"Manus AI (자율 에이전트)",url:"https://ai.meta.com/blog/",isNew:false,badges:["agt"],desc:"2025년 말 인수. Ads Manager에 네이티브 통합. 시장 조사·보고서 작성·캠페인 분석 등 멀티스텝 태스크 자율 실행."}
]},
{rank:6,name:"Microsoft",url:"https://microsoft.com/en-us/ai",type:"빅테크 (AI 통합 전략)",focus:"생산성 AI 전면 통합",products:[
  {name:"Microsoft Copilot (M365 통합)",url:"https://copilot.microsoft.com",isNew:false,badges:["agt","code"],desc:"Word·Excel·Outlook·Teams·Windows·Azure 전 제품군 AI화. 멀티 에이전트 오케스트레이션. Anthropic에 $50억 투자. Azure AI 성장률 34% YoY. Mustafa Suleyman: 현재 프론티어 모델 자체 개발 역량 부족 인정, 2026년 말까지 컴퓨팅 규모 확보 목표."},
  {name:"Copilot Cowork",url:"https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/30/copilot-cowork-now-available-in-frontier/",isNew:true,badges:["agt"],desc:"3/30 Frontier 프로그램 GA. 단순 프롬프트-응답을 넘어 다단계 장기 실행 태스크를 M365 내에서 자율 수행. Work IQ로 전체 업무 맥락 파악, 진행 중 사용자 개입 가능. Anthropic Claude 협업 개발. M365 보안·거버넌스·감사 경계 내 운영. 기존 Copilot Tasks를 대체하는 실행 레이어."},
  {name:"Azure OpenAI Service",url:"https://azure.microsoft.com/en-us/products/ai-services/openai-service",isNew:false,badges:["llm","agt"],desc:"OpenAI 최신 모델을 기업 환경에서 안전하게 활용하는 완전관리형 플랫폼. 대기업 AI 채택의 핵심 채널. Anthropic 모델도 Azure에서 제공."},
  {name:"MAI-Image-2",url:"https://microsoft.com/en-us/ai",isNew:false,badges:["img"],desc:"Microsoft 슈퍼인텔리전스 팀 개발 자체 텍스트→이미지 모델. 현실감·조명·텍스트 렌더링 대폭 개선. 포스터·인포그래픽 실무 최적화."},
  {name:"Phi-4 / Phi-4 Multimodal / Fara-7B",url:"https://azure.microsoft.com/en-us/products/phi",isNew:false,badges:["llm"],desc:"Phi-4: 3.8B~5.6B 경량 멀티모달. Fara-7B: 브라우저 에이전트·컴퓨터 제어 특화 소형 모델(오픈소스). 엣지·온프레미스 배포 특화."},
  {name:"MAI-DxO (의료 진단 AI)",url:"https://microsoft.com/en-us/research/project/health-futures/",isNew:false,badges:["sci"],desc:"복잡 의료 케이스 정확도 85.5%(경험 많은 의사 20% 대비). Bing·Copilot 하루 5천만 건 건강 Q&A 처리."},
  {name:"GitHub Copilot / Repository Intelligence",url:"https://github.com/features/copilot",isNew:false,badges:["code"],desc:"월간 PR 4,300만 건(+23% YoY), 연간 커밋 10억 건(+25%). Repository Intelligence: 코드 관계·히스토리·전체 맥락 이해. 오류 조기 감지·자동 수정."}
]},
{rank:7,name:"NVIDIA",url:"https://www.nvidia.com/en-us/ai",type:"AI 인프라 기업",focus:"AI 컴퓨팅 + 피지컬 AI 인프라",products:[
  {name:"Blackwell Ultra (B300)",url:"https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/",isNew:false,badges:["hw"],desc:"현 주력 GPU. 전 세대 대비 2.5배 빠르고 25배 에너지 효율. 클라우드 GPU 완판 지속. 시가총액 $5조 돌파."},
  {name:"Vera Rubin (차세대 슈퍼칩)",url:"https://www.nvidia.com/en-us/data-center/vera-rubin/",isNew:false,badges:["hw"],desc:"2026년 하반기 출시 예정. Vera CPU + Rubin GPU 결합. Project Stargate 핵심 하드웨어. Vera Rubin Ultra 2027년 예정."},
  {name:"Isaac GR00T N1.7 / GR00T N2",url:"https://developer.nvidia.com/isaac/gr00t",isNew:false,badges:["agt","sci"],desc:"GTC 2026(3/18) 발표. 세계 최초 오픈 휴머노이드 로봇 파운데이션 모델. N1.7: 상업 라이선스 얼리 액세스. N2(2026년 말 예정): 새로운 태스크 성공률 2배 이상. Agility·Figure·Boston Dynamics·1X 등 채택."},
  {name:"Ising (오픈 양자 AI)",url:"https://www.nvidia.com/en-us/solutions/quantum-computing/ising/",isNew:true,badges:["sci","hw"],desc:"4/14 공개 — 양자 컴퓨팅 보정·오류정정용 세계 최초 오픈 AI 모델 패밀리. Ising Calibration(비전-언어 모델, 캘리브레이션 일 단위→시간 단위 단축)과 Ising Decoding(3D CNN 2종, 양자 오류정정 디코딩 2.5배 빠르고 3배 높은 정확도). Academia Sinica·Fermilab·Harvard·IQM·Infleqtion·LBNL Advanced Quantum Testbed·UK NPL 등 양자 선도 기관이 도입. NVIDIA의 하이브리드 양자-고전 인프라 지배력 본격 확장, 4/14 NVDA +3.78%(10거래일 연속 상승·2년 최장)."},
  {name:"Cosmos 월드 모델 / Isaac Sim 3.0",url:"https://developer.nvidia.com/isaac/sim",isNew:false,badges:["agt","sci"],desc:"Cosmos: 물리 세계 시뮬레이션 AI — 실제 장면 하나에서 수천 개 합성 훈련 데이터 자동 생성. Isaac Sim/Lab 3.0: 디지털 트윈 환경에서 로봇 병렬 학습. ABB·FANUC·KUKA 채택."},
  {name:"DGX Spark (개인용 AI 슈퍼컴퓨터)",url:"https://www.nvidia.com/en-us/products/workstations/dgx-spark/",isNew:false,badges:["hw"],desc:"개발자가 로컬에서 대형 모델을 파인튜닝·배포하는 개인용 AI 슈퍼컴퓨터. 클라우드 비용 없이 온프레미스 AI 개발 가능."},
  {name:"Nemotron 3 Super / NemoClaw / OpenClaw",url:"https://developer.nvidia.com/nemotron",isNew:false,badges:["llm","agt"],desc:"Nemotron 3 Super: 120B 파라미터 MoE(활성 12B), SWE-Bench 60.47%(오픈소스 최고). NemoClaw: 정책 엔진·가드레일·프라이버시 라우팅 통합 에이전트 배포 스택."},
  {name:"BioNeMo / Earth-2 / NVIDIA NIM",url:"https://www.nvidia.com/en-us/ai-data-science/products/nim-microservices/",isNew:false,badges:["sci","agt"],desc:"BioNeMo: 생물학·화학 AI 파운데이션. Earth-2: 날씨·기후 예측 AI. NIM: AI 모델 실서비스 배포 마이크로서비스 플랫폼."}
]},
{rank:8,name:"Amazon AWS",url:"https://aws.amazon.com/ai",type:"빅테크 (클라우드 AI)",focus:"엔터프라이즈 클라우드 AI",products:[
  {name:"Amazon Bedrock",url:"https://aws.amazon.com/bedrock/",isNew:false,badges:["llm","agt"],desc:"Claude·Llama·Nova 등 다수 모델을 단일 API로 제공. Kiro 자율 코딩 에이전트·DevOps Agent·Security Agent 운영. OpenAI와 $1,000억 컴퓨팅 파트너십 체결."},
  {name:"Trainium3 / Trn3 UltraServer",url:"https://aws.amazon.com/machine-learning/trainium/",isNew:false,badges:["hw"],desc:"Trainium3 칩 144개 탑재. Trainium2 대비 성능 4배·에너지 효율 40% 개선. Trainium 사업 연환산 $20B 돌파(Jassy 4/9 서한). Trainium2 전량 소진, Trn3도 거의 완판. 서드파티 랙 직접 판매 검토 — NVIDIA 직접 경쟁 시사."},
  {name:"Amazon Nova 모델 패밀리",url:"https://aws.amazon.com/ai/generative-ai/nova/",isNew:false,badges:["llm","img"],desc:"AWS 자체 파운데이션 모델. Micro~Pro 다단계 라인업. 텍스트·이미지·비디오 멀티모달 지원."},
  {name:"AWS 인프라 투자",url:"https://aws.amazon.com/ai/infrastructure/",isNew:false,badges:["hw"],desc:"2026년 설비투자 $2,000억(대부분 AI). 데이터센터 용량 2배(850MW→1.7GW). 전체 하이퍼스케일러 capex $4,700억 예상."}
]},
{rank:9,name:"Apple",url:"https://apple.com/apple-intelligence",type:"빅테크 (온디바이스 AI)",focus:"하드웨어-소프트웨어 AI 완전 통합",products:[
  {name:"Apple Intelligence",url:"https://apple.com/apple-intelligence",isNew:false,badges:["llm","agt"],desc:"iOS 18·macOS Sequoia 내장 개인화 AI. 글쓰기 도구·Image Playground·Genmoji·알림 우선순위. 온디바이스 처리 중심. AI 경쟁사 앱이 App Store에서 2025년 $9억 수수료 납부, 2026년 $10억+ 예상."},
  {name:"신 Siri + Gemini 연동 (iOS 26)",url:"https://apple.com/siri/",isNew:false,badges:["agt","llm"],desc:"iOS 26.4와 함께 출시 예정. 화면 인식(On-screen Awareness)·크로스앱 통합. Google Gemini(1.2조 파라미터)를 Private Cloud Compute에서 구동. ChatGPT CarPlay 통합도 iOS 26.4와 동시 출시."},
  {name:"Private Cloud Compute (PCC)",url:"https://security.apple.com/documentation/private-cloud-compute/",isNew:false,badges:["agt","hw"],desc:"온디바이스 처리 불가 요청을 Apple 전용 서버로 전송하는 프라이버시 보호 클라우드 AI 인프라. 서버에 사용자 데이터 미저장. 제3자 보안 감사 가능 설계."},
  {name:"M5 칩 / Neural Engine / Baltra",url:"https://apple.com/mac/",isNew:false,badges:["hw"],desc:"M5: 10코어 GPU + Neural Accelerator, M4 대비 AI 성능 4배 이상. Broadcom 공동 개발 AI 서버 칩 'Baltra' 2026년 내부용 출시 예정. A18 Pro 기반 저가 MacBook 출시 검토."}
]},
{rank:10,name:"Mistral AI",url:"https://mistral.ai",type:"유럽 AI 전문 기업",focus:"오픈소스·효율·AI 주권",products:[
  {name:"Mistral Large 2 / Large 3",url:"https://mistral.ai/models/",isNew:false,badges:["llm"],desc:"유럽 최강 클로즈드 모델. 영·불·독·서·이탈 다국어 특화. Tesco 등 대형 기업과 파트너십. EU 데이터 주권 준수로 유럽 규제 시장 강점."},
  {name:"Mistral Small 4 (오픈소스)",url:"https://mistral.ai/models/",isNew:true,badges:["llm"],desc:"2026년 3월 출시. Apache 2.0 라이선스. 경량 고효율 최신작. NVIDIA와 공동 튜닝된 오픈 모델 패밀리로 확장. 자체 GitHub 커뮤니티 fork·PR이 3개월 만에 2배 성장 — 오픈소스 생태계 모멘텀 지속."},
  {name:"Mistral Forge",url:"https://mistral.ai/products/forge",isNew:true,badges:["llm","agt","code"],desc:"GTC 2026(3/17) 공개. 기업이 자사 데이터로 커스텀 파운데이션 모델을 직접 구축·파인튜닝하는 엔터프라이즈 플랫폼. OpenAI·Anthropic의 폐쇄형 모델 대안. 'Build-your-own AI' 포지셔닝 — EU 데이터 주권·규제 준수 환경 강점. NVIDIA 인프라 통합."},
  {name:"파리 데이터센터 + $830M 부채 펀딩",url:"https://mistral.ai",isNew:true,badges:["hw"],desc:"3/30 $8.3억 규모 부채 펀딩으로 파리 인근 Bruyères-le-Châtel 자체 데이터센터 구축. 13,800개 NVIDIA GPU 배치, 초기 용량 44MW, 2026년 하반기 가동. 유럽 AI 주권 인프라의 첫 대규모 실물 구현."},
  {name:"Mixtral 8x22B / Mistral 7B (오픈소스)",url:"https://huggingface.co/mistralai",isNew:false,badges:["llm"],desc:"Mixtral 8x22B: MoE 아키텍처로 대형 모델급 성능 효율적 구현. Mistral 7B: 엣지·온프레미스 표준. 서방 오픈소스 AI의 대표 주자."},
  {name:"Le Chat (AI 어시스턴트)",url:"https://chat.mistral.ai",isNew:false,badges:["agt"],desc:"초당 최대 1,000단어 생성 속도 — 업계 최고 수준. 유럽·기업 사용자 대상 ChatGPT 대안."},
  {name:"Voxtral TTS",url:"https://mistral.ai/news/voxtral-tts",isNew:true,badges:["llm"],desc:"3월 26일 출시. 업계 최초 프론티어급 오픈웨이트 TTS 모델(4B 파라미터). ElevenLabs Flash v2.5 대비 자연스러움 우위, v3과 동등 품질. 9개 언어·제로샷 음성 복제·감정 스티어링·실시간 스트리밍. CC BY-NC 4.0 라이선스. API $0.016/1K 글자. Voxtral 음성 스택 완성."},
  {name:"Codestral",url:"https://mistral.ai/news/codestral/",isNew:false,badges:["code"],desc:"코딩 전용 특화 모델. 80개 이상 프로그래밍 언어 지원. VS Code·JetBrains IDE 플러그인 통합."},
  {name:"Mistral API / La Plateforme",url:"https://console.mistral.ai",isNew:false,badges:["llm","agt"],desc:"개발자·기업용 모델 배포 플랫폼. EU 데이터 주권 준수. 유럽 규제 환경에서 가장 유리한 AI API."}
]}
];