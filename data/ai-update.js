/**
 * update.js - AI Players 업데이트 로그
 *
 * 각 기업의 모델·제품·펀딩·인수 등 콘텐츠 변경 사항을
 * 날짜별로 기록한다.
 */
const UPDATES = [
  {
    date: "2026-05-10 19:25 KST",
    summary: `Anthropic 온체인 IPO 함의가 $1.2T 도달 - OpenAI 시간외 시세 첫 추월·1주일 +20%
Jupiter Prestocks·Ventuals 토큰화 SPV 거래량 급증 - 7개월 누적 +900%
보드 미팅 5월 결정·$50B $900B 라운드와 별개 신호 - 시장 가격 발견 채널 다층화
5/14~15 트럼프-시진핑 정상회담 - AI 리스크·안전 양국 협력 프레임 첫 의제 가능성`,
    changes: [
      { type: "마일스톤", sector: "Anthropic",
        detail: "Anthropic 토큰화 IPO 함의 밸류 $1.2T 도달. Kobeissi Letter 등 5/9 자료 - Jupiter Prestocks·Ventuals 등 토큰화 SPV(보유 주식 1:1 백킹) 거래에서 함의 IPO 밸류가 $1.2T 도달, 1주일 +20%·7개월 누적 +900% 가속. OpenAI 시간외 함의 시세를 사상 처음 추월 - 5/8 Code with Claude 컨퍼런스 'Q1 매출·사용량 80배 가속' 정량 + 5/8 Akamai $1.8B 7년 인퍼런스 클라우드 + 5/6 SpaceX Colossus 1 단독 임대 + Google $200B 5년 약정 라인업이 시장의 가격 발견 채널을 24시간 베이스로 끌어올린 결과. 일부 후속 자료는 함의 밸류 $1.6T 영역까지 추가 확장 시그널. 5월 보드 미팅 $50B 라운드 $900B 1차 시장 결정과 별개 - 토큰화·1차 시장·언론 평가 3중 채널이 정량 입증을 동시 가속. 10월 IPO $400~500B 카운트다운 베이스에 단일 톱 시그널.",
        time: "2026-05-10 19:25 KST" },
      { type: "전략", sector: "OpenAI",
        detail: "OpenAI ARR $25B 도달. 5/9 외신 종합 - OpenAI 연환산 매출이 $25B 라인 도달, $14B 손실 베이스 잔존. 시간외 함의 밸류 $852B에서 Anthropic 온체인 $1.2T에 처음 추월된 단일 분기 사례 - $39B Anthropic ARR 대비 매출 갭 +50% 잔존하지만 컴퓨트·인프라 비용 비대칭이 밸류 격차의 단일 변수. 5/4 PwC 글로벌 재무 운영 파트너십·5/5 인도 동시 진출·5/4 The Deployment Company $10B JV 채널 가속이 후방. 5/14~15 트럼프-시진핑 베이징 정상회담 의제에 'AI 리스크·안전' 프레임 첫 등장 가능성 - GPT-5.5 對中 가이던스 사이드 분기점.",
        time: "2026-05-10 19:25 KST" },
    ]
  },
  {
    date: "2026-05-09 19:10 KST",
    summary: `Anthropic·Akamai $1.8B 7년 인퍼런스 클라우드 - Akamai 사상 최대 단일 계약
AKAM 5/8 정규장 +27% $149.05 - 22년 만의 최대 단일일 강세, 풀 램프 시 단일 고객 매출 6%
Anthropic 컴퓨트 공급사 7곳 분산 - SpaceX·Google·AWS·CoreWeave·NVIDIA·Broadcom·Akamai
인퍼런스 엣지 레이턴시 본업 정렬 - 중앙화 학습 캐파에 글로벌 분산 추론 레이어 신규 추가`,
    changes: [
      { type: "인프라", sector: "Anthropic",
        detail: "Anthropic·Akamai $1.8B 7년 클라우드 약정. 5/8 Akamai 1분기 결산 8-K에서 '미국 프론티어 모델 회사'와 7년 $1.8B 계약을 공시 - Bloomberg가 고객을 Anthropic으로 특정. 연 평균 약 $257M·Akamai 사상 최대 단일 계약·연 매출 가이던스 $4.5B 중간값 대비 풀 램프 시 단일 고객 6% 비중. AKAM 5/8 정규장 +27% $149.05 마감으로 22년 만의 최대 단일일 강세. 거래 본업은 인퍼런스 측 - Akamai의 글로벌 분산 엣지 푸트프린트가 Claude 사용자 다지역 저레이턴시 인퍼런스 처리에 정렬. 컴퓨트 누적 라인업 - SpaceX Colossus 1(300MW·NVIDIA 220K GPU) 단독 임대 + Google TPU $200B 5년 + AWS Trainium 2 약 1GW + CoreWeave 다년 + NVIDIA·Broadcom 커스텀 실리콘 공급 + Akamai 인퍼런스 엣지 7년으로 최소 7개 공급사 분산. 5/8 Code with Claude Q1 매출·사용량 80배 가속 정량 베이스에 인프라 다층화가 후방 시그널 - $50B $900B 5월 보드 결정 + 10월 IPO $400~500B 카운트다운 라인업 강화.",
        time: "2026-05-09 19:10 KST" },
    ]
  },
  {
    date: "2026-05-09 11:30 KST",
    summary: `Anthropic 5/8 Code with Claude 컨퍼런스(SF) - Dario 'Q1 80배 매출·사용량 가속' 정량 공개
Memory 정식·멀티에이전트 오케스트레이션 신규 - 엔터프라이즈 에이전트 운영 미싱 피스 충족
NVIDIA·IREN 다년 5GW DSX 인프라 - $3.4B 매니지드 GPU 클라우드 + $2.1B 워런트 투자 권리
IREN 5/8 종가 $61.20 +7.65% - Bitcoin 마이닝에서 AI 클라우드 캐파 채널 전환 정량 입증`,
    changes: [
      { type: "마일스톤", sector: "Anthropic",
        detail: "Anthropic. 5/8 샌프란시스코 Code with Claude 개발자 컨퍼런스 - Dario Amodei 키노트에서 'Q1 매출·사용량이 연환산 기준 80배 가속(전망 10배 대비 8배 초과)' 정량 공개. SpaceX Colossus 1 단독 임대(300MW+·NVIDIA 220K+ GPU)가 단일 캐파 라인업, 5/4 Blackstone·Goldman·H&F $1.5B 합작벤처 + 5/5 금융 서비스 에이전트 10종 + Microsoft 365 네이티브 통합이 최근 2주 누적 채널. 신규 발표 - ①Memory 기능 정식(세션 간 장기 컨텍스트·선호 파일시스템 영구 저장·감사 로그) ②멀티에이전트 오케스트레이션(복수 매니지드 에이전트가 단일 작업 분담·중간 결과 공유) ③Claude Opus 4.7의 금융 본업 특화 성능 강조. $900B 라운드 5월 보드 결정 + 10월 IPO $400~500B 카운트다운 베이스에 매출 가속 단일 정량 입증.",
        time: "2026-05-09 11:30 KST" },
      { type: "인프라", sector: "NVIDIA",
        detail: "NVIDIA·IREN 다년 5GW DSX AI 인프라 파트너십. 5/7 공식 발표 - IREN의 글로벌 데이터센터 파이프라인에 NVIDIA DSX 정렬 인프라 최대 5GW 배치 가속. ①IREN이 NVIDIA에 30M주 보통주 5년 매수권($70 행사가, 최대 $2.1B 투자 권리, 규제 승인 조건) 부여 ②NVIDIA가 IREN으로부터 매니지드 GPU 클라우드 5년 $3.4B 약정 - 내부 AI·연구 워크로드용. 플래그십 배치는 텍사스 Sweetwater 캠퍼스(2GW)로 DSX 아키텍처 첫 대형 레퍼런스. IREN 5/8 종가 $61.20 +7.65% - Bitcoin 마이닝에서 AI 클라우드로 전환한 캐파 채널이 NVDA의 워런트 + 캡티브 클라우드 라인업으로 정량 입증. 5/6 Corning $500M·5/8 IREN $5.5B 라인을 결합해 NVDA 5/20 1분기 FY27 컨센 $78.8B 발표 직전 인프라 채널 다변화 시그널 누적.",
        time: "2026-05-09 11:30 KST" },
    ]
  },
  {
    date: "2026-05-08 07:20 KST",
    summary: `Anthropic·SpaceX Colossus 1 전체 컴퓨트 단독 임대 - 300MW·NVIDIA GPU 220,000개·H100/H200/GB200
Claude Code 한도 전 유료 티어 2배 확대·Pro/Max 피크 시간대 한도 폐지·Opus API 한도 상향
xAI 본사격 슈퍼클러스터를 라이벌이 임차 - Musk 'No one set off my evil detector' 코멘트
다중 기가와트 궤도 AI 컴퓨트 공동 개발 의향 공식 명시 - 우주 데이터센터 진입
SpaceX IPO 직전 AI 인프라 스토리라인 정량 입증·Anthropic IPO $900B 베이스에 추가 동력`,
    changes: [
      { type: "인프라", sector: "Anthropic",
        detail: "Anthropic·SpaceX Colossus 1 컴퓨트 단독 임대 + Claude 사용량 한도 2배. 5/6 공식 발표 - SpaceX의 테네시 Colossus 1 데이터센터 전체 컴퓨트 캐파(300MW+·NVIDIA H100/H200/GB200 220,000+ GPU)를 단독 임대. 한 달 안에 즉시 가동 가능한 추가 캐파로 IPO $900B 밸류 베이스를 기술적으로 정량화. 즉시 사용량 한도 변화 - ①Claude Code 5시간 한도 Pro·Max·Team·Enterprise 전 유료 티어 2배 확대 ②Pro·Max 피크 시간대 한도 축소 폐지 ③Claude Opus 모델 API 한도 '상당폭' 상향. 4/23 Axios가 보도한 컴퓨트 한도 타이트닝·주기적 아웃티지 성장통의 단기 해소 라인. 추가로 Anthropic이 SpaceX와 '다중 기가와트 궤도 AI 컴퓨트' 공동 개발 의향을 공식 명시 - SpaceX의 발사 케이던스·재사용 2단 베이스로 우주 데이터센터 '언제'의 영역으로 진입. 컴퓨트 누적 라인 - Google TPU 5GW($200B 5년 약정) + AWS 1GW + CoreWeave 다년 + SpaceX Colossus 1 단독. CRWV가 동일 5/7 장후 Q1에서 NVDA 분기 중 $2B 추가 지분 매입 + 백로그 $99.4B를 정량 입증한 흐름과 결합돼 Anthropic 컴퓨트 채널 다변화 가속.",
        time: "2026-05-08 07:20 KST" },
      { type: "전략", sector: "xAI",
        detail: "xAI Colossus 1 컴퓨트를 Anthropic에 임대. 5/6 합의 - SpaceX/xAI가 보유한 Colossus 1(테네시 200K+ NVIDIA GPU 슈퍼클러스터)을 라이벌 Anthropic에 단독 임차하는 비통상 구도 형성. xAI는 Memphis Colossus 2(1.5GW·100만 H100 등가)를 가동 중이며 Grok 5(6조 파라미터 MoE) 학습에 자체 캐파를 집중 배분, Colossus 1은 부분 활용 중인 가용 캐파를 임대 형태로 매출화. SpaceX는 $1.75T IPO 직전 AI 인프라 매출 라인을 정량 입증해 ARK·언더라이터 자료에 추가 동력. Musk는 'No one set off my evil detector' 코멘트로 거래의 정합성을 직접 시그널 - Anthropic·xAI 양사가 공식 라이벌 관계임에도 컴퓨트 자본 효율 우선 베이스. 동시에 SpaceX·Anthropic 다중 기가와트 궤도 AI 컴퓨트 공동 개발 의향 명시는 xAI의 우주 인프라 라인업과 직접 결합 가능성.",
        time: "2026-05-08 07:20 KST" },
    ]
  },
  {
    date: "2026-05-07 19:30 KST",
    summary: `Anthropic·Google $200B 5년 클라우드·칩 약정 - The Information 보도, Alphabet 백로그 40%+ 단독 차지
4월 Google Broadcom 다중 기가와트 TPU 합의 후속 - 2027년 본격 가동 예정
Anthropic은 동시에 CoreWeave 다년 계약 + AWS 약 1GW 칩 연말 확보 - 인프라 분산 가속
Alphabet 주가 동조 강세·Anthropic IPO $900B 밸류 검토 베이스에 추가 정량 입증`,
    changes: [
      { type: "인프라", sector: "Anthropic",
        detail: "Anthropic·Google 클라우드·칩 $200B 5년 약정. 5/5 The Information 단독 보도 - Anthropic이 Google Cloud에 향후 5년간 $200B를 지출하는 다년 합의. 4월에 발표한 Google·Broadcom 다중 기가와트 TPU 합의의 구체적 규모가 처음 정량화된 것으로, Alphabet이 투자자에게 공개한 매출 백로그 중 40%+ 비중을 Anthropic이 단독으로 차지하는 구조. 동시에 Anthropic은 CoreWeave 다년 인프라 계약 + AWS의 약 1GW 자체 칩 용량을 연말까지 확보 - 단일 공급망 리스크를 분산하면서 컴퓨트 약속을 누적. Alphabet 주가는 보도 후 동조 강세·Anthropic IPO $900B 밸류 검토 베이스에 매출 가속의 정량적 시그널 추가. TPU 캐파는 2027년부터 본격 가동 예정 - 앞서 4/23 Axios가 보도한 '컴퓨트 한도 타이트닝·주기적 아웃티지' 성장통이 그 시점까지 잔존하는 구도.",
        time: "2026-05-07 19:30 KST" },
      { type: "인프라", sector: "Google DeepMind",
        detail: "Google Cloud·TPU 인프라. 5/5 The Information 보도로 Anthropic의 5년 $200B 약정이 정량화 - Alphabet 매출 백로그 $460B 중 40%+ 비중이 단일 고객(Anthropic)에서 발생함이 처음 공개. 4월 Cloud Next에서 발표한 Gemini 3.2와 별개로 외부 프론티어 모델 회사 향 TPU 공급이 Google Cloud의 단독 성장 동력으로 자리 - Q1 Google Cloud +63% 매출 가속의 후방 동력이 한 번 더 증명됐다. Pichai가 Q1 컨콜에서 '단기 컴퓨트 제약'을 명시한 만큼 TPU·Broadcom 캐파 빌드아웃 속도가 단일 분기점.",
        time: "2026-05-07 19:30 KST" },
    ]
  },
  {
    date: "2026-05-07 07:40 KST",
    summary: `NVIDIA·Corning 다년 광 인프라 파트너십 - $500M 워런트 + 최대 $3.2B 투자 권리
Corning 美 광 연결 캐파 10배·광섬유 50%+ 확장 - NC·텍사스 공장 3곳, 3,000명 신규 고용
NVDA 5/6 정규장 +5% $206.46 - GLW +14~20% 동반 급등
GPU·HBM·전력 이어 광 연결까지 NVIDIA 수직 통합 다음 레이어`,
    changes: [
      { type: "인프라", sector: "NVIDIA",
        detail: "NVIDIA·Corning 다년 광 인프라 파트너십. 5/6 공식 발표 - NVIDIA가 Corning 주식 워런트 $500M 선매입 + 최대 $3.2B 추가 투자 권리 확보. 워런트 구조는 약 300만 주를 $0.0001/주에 즉시 배정 + 최대 1,500만 주를 $180/주 행사가로 추가 확보 가능. Corning은 美 광 연결 제조 캐파 10배·광섬유 생산 캐파 50%+ 확장에 합의, 노스캐롤라이나·텍사스에 신규 첨단 제조 공장 3곳 신설 + 3,000명 신규 고용 동반. 'AI 팩토리' 빌드아웃 가속을 위해 광섬유·광 트랜시버 병목을 단일 파트너로 락업하는 구조 - GPU·HBM·전력에 이어 광 연결까지 NVIDIA 수직 통합의 다음 레이어. GLW 주가 5/6 정규장 +14~20% 급등, NVDA는 +5% 종가 $206.46 도달. 5/20 1분기 FY27 컨센 매출 $78B·Rubin 풀프로덕션 카운트다운 베이스에 추가 후방 시그널, 연 $700B AI CapEx 가속이 광섬유·DC 인프라 카테고리 전반으로 확산되는 분기점.",
        time: "2026-05-07 07:40 KST" },
    ]
  },
  {
    date: "2026-05-06 07:15 KST",
    summary: `OpenAI·Anthropic 5/5 인도 동시 진출 - 14억 인구 시장 양사 동시 선점
Anthropic 금융 서비스 AI 에이전트 10종 + Claude의 마이크로소프트 엑셀·파워포인트 통합
OpenAI x PwC 글로벌 재무 운영 파트너십 - 142개국 채널 가동
Anthropic $50B 라운드 $900B 밸류 - 5월 보드 미팅 결정 임박, 한 기관 $5B 단일 수표`,
    changes: [
      { type: "전략", sector: "Anthropic",
        detail: "Anthropic(금융 서비스 에이전트 10종 + 마이크로소프트 365 통합). 5/5 공식 출시 - 금융 서비스 전용 AI 에이전트 10종을 동시 데뷔. 피치북 자동 생성·고객 신원 확인(KYC) 검증·신용 분석·M&A 듀딜리전스·재무제표 분석·리스크 모델링·포트폴리오 모니터링·규제 준수 점검 등 시간이 오래 걸리던 금융 본업 전반을 커버. 동시에 Claude가 마이크로소프트 엑셀·파워포인트 등 365 비즈니스 제품에 네이티브 통합 - 사이드 패널에서 직접 호출, 마이크로소프트 코파일럿과 동일 면에서 실질 경쟁 진입. Dun & Bradstreet·Verisk·Moody's 등 금융 데이터 플랫폼 추가 파트너십 동시 발표. 5/4 블랙스톤·골드만삭스·H&F $1.5B 합작벤처에 이어 빅4·금융 데이터 양 채널 선점 - OpenAI가 동일 5/5 PwC와 글로벌 재무 운영 파트너십을 발표한 것에 대한 직접 대응. 24시간 내 양사 채널 동시 확장 - 'AI 모델 회사' → '풀스택 엔터프라이즈 배치 엔진' 포지셔닝 전환 본격화.",
        time: "2026-05-06 07:15 KST" },
      { type: "전략", sector: "OpenAI",
        detail: "OpenAI x PwC 글로벌 재무 운영 파트너십. 5/5 공식 발표 - PwC와 전략 파트너십 체결, '재무 운영의 핵심 리듬'에 특화한 AI 에이전트 공동 개발. 예측·계획·보고·조달·결제·재무 관리 등 기업 재무 본업 전반에 GPT-5.5·Codex·Privacy Filter 라인업을 임베드, PwC의 142개국·370,000명 컨설턴트 채널이 직접 배치 채널로 가동. 5/4 The Deployment Company($10B 사모 합작벤처) 발표에 이어 24시간 내 '사모 → 전문서비스 → 재무특화' 채널 추가 선점 - Anthropic이 동일 5/5 금융 서비스 전용 에이전트 10종을 출시한 것과 동일한 시점에 대응. PwC는 빅4 중 OpenAI 채널 단독 선점, 딜로이트·EY·KPMG는 Anthropic·구글·마이크로소프트 채널로 분산되는 구도. 양사가 IPO 직전 '고마진 엔터프라이즈 트랙션' 정량 입증을 위해 24시간 내 동시 발표 양상.",
        time: "2026-05-06 07:15 KST" },
      { type: "생태계", sector: "OpenAI",
        detail: "OpenAI·Anthropic 5/5 인도 동시 진출. OpenAI는 ChatGPT Enterprise·API·Codex·Privacy Filter 라인업을 인도 데이터센터 호스팅으로 가동, 인도 정부·교육기관·타타·릴라이언스·인포시스 직접 채널 가동. Anthropic도 동일 5/5 인도 시장 동시 진출 - Claude API·Claude Code·금융 서비스 에이전트 라인업을 인도 시장에 직접 공급. 양사가 14억 인구 시장을 동시 선점하는 구도 - 인도는 글로벌 IT 서비스 본업·140만 개발자·연 300억 코드 커밋 규모로 코딩 모델·엔터프라이즈 자동화 양 영역 직접 수요. 미국·EU·일본·한국에 이은 4번째 글로벌 거점 시장 확정 - 양사 모두 IPO 직전 매출 가속 트리거 추가 확보.",
        time: "2026-05-06 07:15 KST" },
      { type: "펀딩", sector: "Anthropic",
        detail: "Anthropic($50B 펀딩 라운드 $900B 밸류 - 5월 보드 미팅 결정 임박). 5/5 후속 보도 - 신규 $50B 펀딩 라운드를 $900B 밸류로 검토 중, 5월 보드 미팅에서 진행 여부와 조건 결정 임박. 한 기관이 $5B 단일 수표를 제안했으나 CFO 크리슈나 라오 미팅조차 못 잡을 정도의 수요 압축 - 투자자 수요가 라운드 사이즈를 추가 확장시킬 가능성. 매출 런레이트 3월 기준 $39B 연환산, OpenAI $24~25B 컨센 $14B 손실 베이스 대비 마진 우위가 밸류 정당화 핵심. 성사 시 OpenAI($852B) 추월·사상 가장 비싼 AI 스타트업 - 'AI 섹터 사상 단일 최대 펀딩 이벤트' 라인업. 10월 IPO $400~500B 타겟에 직결되는 자본 라인.",
        time: "2026-05-06 07:15 KST" },
    ]
  },
  {
    date: "2026-05-05 07:35 KST",
    summary: `OpenAI 'Deployment Company' $10B PE 합작벤처 5/4 마감
TPG·Brookfield·Bain·SoftBank 19개사, OpenAI 과반 지배
Anthropic $1.5B Blackstone 합작과 동일 날 발표 - PE 채널 양강`,
    changes: [
      { type: "전략", sector: "OpenAI",
        detail: "OpenAI(The Deployment Company $10B PE 합작벤처). 5/4 Bloomberg·TechCrunch·Axios 동시 보도 - OpenAI가 사모펀드 컨소시엄과 함께 'The Deployment Company' 합작벤처를 $10B 밸류로 공식 마감. 출자 구조는 외부 투자자가 $4B+, OpenAI가 약 $1.5B 출자해 과반 지배 유지. 컨소시엄은 TPG·Brookfield Asset Management·Bain Capital·Advent International·Dragoneer·SoftBank 등 19개 사모펀드 - 보유 포트폴리오 기업 수만 개에 GPT-5.5·Codex·Privacy Filter·GPT-Rosalind 라인업을 임베드하는 풀스택 배치 채널. 사업 모델은 OpenAI 엔지니어 팀을 클라이언트 조직 운영 레이어에 직접 배치하는 forward-deployed engineer 패턴 - Palantir가 미국 정부·상업 시장에서 검증한 모델을 PE 포트폴리오 기업으로 그대로 이식. 우선 섹터는 헬스케어·물류·제조·금융 4개. 동일 5/4 Anthropic·Blackstone·Goldman·H&F $1.5B 합작벤처와 같은 날 발표돼 빅2 라보가 PE 채널을 동시 선점하는 구도 - IPO 직전 매출 가속과 high-margin 엔터프라이즈 트랙션 두 트리거 동시 가속. 챗봇·API 회사에서 풀스택 배치 엔진으로 포지셔닝 전환 본격화.",
        time: "2026-05-05 07:35 KST" },
      { type: "전략", sector: "Anthropic",
        detail: "Anthropic($1.5B PE 합작벤처 5/4 공식 마감 + OpenAI 동조 발표). 5/4 Anthropic·Blackstone·Hellman&Friedman·Goldman Sachs $1.5B 합작벤처가 공식 발표로 확정 - 출자 구조는 Anthropic·Blackstone·H&F가 각 $300M, Goldman Sachs가 창립 투자자로 $150M 참여, General Atlantic 등 합류로 합산 $1.5B. 같은 날 OpenAI도 사모펀드 19개사와 'The Deployment Company' $10B 합작벤처를 발표하며 빅2 라보가 PE 채널을 동시 선점 - $850~900B Anthropic 펀딩 라운드 마감 임박 + Counterpoint Q1 LLM 매출 점유 31.4% 1위 + IPO 직전 매출·정부·자본 트리플 회복 모멘텀과 함께 5월 첫 주 메가 시그널 4중 정렬. 특히 OpenAI가 동일 발표 시점을 맞춘 것은 PE 채널을 단독 선점하지 못하게 한 시그널이지만, 양사 모두 챗봇·API 회사 정체성을 풀스택 배치 엔진으로 전환하는 동일 노선 확정 - 엔터프라이즈 AI 시장 구조 단일 분기점.",
        time: "2026-05-05 07:35 KST" },
    ]
  },
  {
    date: "2026-05-04 19:20 KST",
    summary: `Anthropic·Blackstone·Goldman·H&F·General Atlantic $1.5B 합작벤처 마무리 단계
사모펀드 보유 기업에 Claude·Mythos 도입하는 컨설팅 합작사 - 엔터프라이즈 AI 채널 본격 확장
$900B 펀딩 라운드 + LLM 매출 1위 + Wall Street 대형 합작이 5월 트리플 전선 동시 가속
5/4 美 정규장 재개 - PLTR Q1 시간외 + AMD 5/5 + AI 거버넌스 입법 검토 동시 진행`,
    changes: [
      { type: "펀딩", sector: "Anthropic",
        detail: "Anthropic·Blackstone·Goldman Sachs·Hellman&Friedman·General Atlantic 합산 약 $1.5B 합작벤처(JV) 마무리 단계 - 5/4 WSJ·Reuters 첫 보도. 출자 구조는 Anthropic·Blackstone·H&F가 각 약 $300M, Goldman Sachs가 창립 투자자로 약 $150M 참여, 잔여분에 General Atlantic 포함 타 기관이 합류. 사업 모델은 사모펀드(PE) 보유 포트폴리오 기업에 Anthropic의 Claude·Mythos·Sonnet 라인을 도입하는 전용 컨설팅 합작사 - 금융·운영·고객서비스·분석·엔터프라이즈 SW 5개 영역에서 PE 자본의 가치창출 사이클에 직접 통합. Counterpoint 5/1 LLM 매출 점유 31.4% 1위 + $850~900B 펀딩 라운드 임박 + 5/1 펜타곤 단독 배제 후 백악관 우회 가이던스 작성 + 5/2 의회 합동 브리핑 무대 정렬에 이어 Wall Street 대형 합작까지 5월 트리플 전선 동시 가속 - IPO 직전 매출·정부·자본 양면 회복 시그널. Blackstone $1T+ AUM·Goldman·H&F·General Atlantic 보유 포트폴리오 기업 누적 수만 개로 'B2B 신규 채널 단일 최대'로 부상.",
        time: "2026-05-04 19:20 KST" },
    ]
  },
  {
    date: "2026-05-03 07:30 KST",
    summary: `OpenAI·Anthropic 5/2 美 의회 사이버 AI 합동 브리핑 - 상하원·백악관 동시 청취
백악관 Anthropic '공급망 위험' 지정 우회 가이던스 작성 중 - 펜타곤 배제 후 5일 만 복원 시도
GLM-4.7 Zhipu AI 출시 - 환각률 1.2%·Huawei Ascend 전량 학습·입력 $0.11/M 토큰
Anthropic $900B 라운드 보드 미팅 임박 + 의회·백악관 양면 복원 시그널 동시 가속
5/4 美 시장 재개 - PLTR 5/4·AMD 5/5 실적 위크 + AI 거버넌스 재편 동시 진행`,
    changes: [
      { type: "거버넌스", sector: "OpenAI",
        detail: "OpenAI·Anthropic(美 의회 사이버 AI 합동 브리핑). 5/2 OpenAI·Anthropic이 상원·하원 위원회와 백악관에 사이버 역량 보유 AI 모델 공동 브리핑 실시. House Homeland Security 위원장 Andrew Garbarino는 '의회가 올바른 질문을 던지도록 보장하는 것이 목적'이라고 명시. 4/30 OpenAI GPT-5.5 Cyber 'critical defenders' 한정 단계 배포·4/7 Anthropic Project Glasswing 비공개 라인이 입법부 차원의 사전 검토 단계로 격상되는 흐름 - 5/1 펜타곤 7사 계약 + Anthropic 단독 배제 직후 양사가 동일 무대에서 정부 신뢰 구축으로 동조 전환. AI 보안 거버넌스가 행정부 단독에서 입법부·행정부 양면 통제로 확장되는 분기점, OpenAI·Anthropic 모두 IPO 직전 의회·정부 책임성 시그널 적극 발신.",
        time: "2026-05-03 07:30 KST" },
      { type: "거버넌스", sector: "Anthropic",
        detail: "Anthropic(백악관 공급망 우회 가이던스 작성). 5/2 The Cyber Wire 보도 - 백악관이 정부 기관들이 Anthropic의 '공급망 위험' 지정을 우회해 Mythos 포함 고급 AI 모델을 사용할 수 있도록 별도 가이던스를 작성 중. 5/1 펜타곤 7사 계약에서 단독 배제된 지 5일 만에 트럼프 행정부가 사실상 복원 절차에 착수하며 '체면 유지하면서 다시 들이는' 우회 경로를 모색하는 흐름. 동시에 5/2 의회 합동 브리핑에 OpenAI와 동일 무대에 등장하며 입법부 차원에서도 정부 신뢰 회복 단계로 정렬. 4/30 TechCrunch '$900B 라운드 2주 내 마감 가능' 보도 + 5월 보드 미팅 임박과 결합돼 펀딩·정부 영역 양면에서 상승 신호가 동시 가속 - LLM 매출 점유율 31.4% 1위 + 의회·백악관 복원 + IPO 직전 펀딩 마무리의 트리플 트리거 정렬 가능성.",
        time: "2026-05-03 07:30 KST" },
      { type: "모델 출시", sector: "Mistral AI",
        detail: "Zhipu AI GLM-4.7(중국 발 프론티어 효율 베팅, 본 수록 라인 외 외부 동향). 5월 초 Zhipu AI가 GLM-4.7을 공개 - Huawei Ascend 실리콘 전량 학습 + 환각률 1.2%로 프론티어 라보 중 최저 보고치, 입력 토큰 $0.11/M으로 Claude Opus 4.7($15) 대비 약 1/130 수준의 가격 우위. 미국 칩 의존도 0% + 환각 정량화 우위가 결합돼 EU·아시아·신흥국 데이터 주권 시장에서 Mistral·Anthropic·OpenAI에 가격·국적 양면 압박. 본 수록 10사에 미포함이지만 Mistral의 EU 주권 + 효율 라인업과 직접 경쟁 구도, 'NVIDIA 의존 없는 프론티어 모델' 가능성을 외부 정량으로 처음 검증한 시그널. NVIDIA·Anthropic·OpenAI의 수직 통합 라인 vs Huawei·Zhipu 라인의 본격 분기점.",
        time: "2026-05-03 07:30 KST" },
    ]
  },
  {
    date: "2026-05-02 07:40 KST",
    summary: `Pentagon 7개 빅테크와 기밀 네트워크 AI 도입 - SpaceX·OpenAI·Google·MSFT·NVIDIA·AWS·Reflection
Anthropic 펜타곤 딜에서 제외 - 안전 가드레일 요구로 트럼프 행정부와 갈등 재부각
Anthropic Q1 글로벌 LLM 매출 점유율 31.4% - OpenAI 29% 추월 첫 기록
Alphabet Q1 GAAP 순익 $62.6B 중 약 $28.7B가 Anthropic 등 사적 지분 평가익 - '실제 사업 외'
Anthropic $900B 라운드 2주 내 마감 가능 - TechCrunch·Bloomberg·CNBC 동시 보도 확정`,
    changes: [
      { type: "거버넌스", sector: "Anthropic",
        detail: "Anthropic(펜타곤 딜 배제 + LLM 매출 1위). 5/1 美 국방부가 SpaceX·OpenAI·Google·Microsoft·NVIDIA·AWS·Reflection 7사와 기밀 네트워크 AI 도입 계약을 동시 발표했으나 Anthropic은 공식 명단에서 제외. Anthropic이 트럼프 행정부에 '국방·전쟁 영역 활용 시 안전 가드레일 적용' 조건을 견지한 결과로 블랙리스트 상태가 잔존, 백악관이 최근 주요 기술 마일스톤 이후 재논의를 시작했으나 최종 합류는 미확정. 동시에 The Register·복수 매체가 Counterpoint Research 인용으로 Anthropic Q1 글로벌 LLM 매출 점유율 31.4%로 OpenAI 29%를 추월했음을 공식 정량화 - IPO 직전 매출 시장 1위 시그널과 정부 영역 배제 시그널이 동시에 가중되는 비대칭 구도. 4/30 TechCrunch는 '$900B 밸류 라운드가 최대 2주 내 마감 가능'을 추가 보도해 5월 보드 미팅 결정 일정과 정렬.",
        time: "2026-05-02 07:40 KST" },
      { type: "마일스톤", sector: "Google DeepMind",
        detail: "Alphabet(Anthropic 지분 평가익 정량화). 5/1 Fortune·복수 매체가 Alphabet Q1 GAAP 순이익 $62.6B 중 약 $28.7B가 사적 지분 평가익(주로 Anthropic 지분)에서 발생했음을 외부 정량화. 회사는 Q1 콜에서 '사적 투자 자산 시가평가 변경'을 언급했으나 회계 항목별 노출은 외부 분석으로 처음 정량화 - 검색·Cloud·YouTube의 운영이익에 못지않은 비중을 Anthropic 지분 가치 상승이 차지하는 구조. Amazon도 동일한 회계 효과로 분기 GAAP 순익이 부풀려진 정황. AI 슈퍼사이클이 지분 평가 채널을 통해 빅테크 GAAP 실적에 직접 전이되는 구조가 외부에 처음 명확화 - Anthropic이 OpenAI를 LLM 매출 점유율에서 추월(31.4% vs 29%)한 5/1 데이터까지 결합되며 Alphabet·Amazon의 Anthropic 베팅이 펀더멘털 채널과 회계 채널 양쪽에서 동시 검증.",
        time: "2026-05-02 07:40 KST" },
      { type: "전략", sector: "Microsoft",
        detail: "Microsoft·OpenAI·Google·NVIDIA·AWS·xAI(SpaceX)(펜타곤 7사 동시 합류). 5/1 美 국방부가 7개 기술 기업과 기밀 네트워크 AI 도입 계약을 발표 - SpaceX·OpenAI·Google·Microsoft·NVIDIA·AWS·Reflection이 모두 포함. SpaceX는 xAI 모델·Colossus 인프라를 통합 자산으로 펜타곤 진입, OpenAI는 5/14 'Trusted Access for Cyber' 프레임워크와 GPT-5.5 Cyber 단계 배포가 정부 영역 게이트웨이로 작동, Microsoft·AWS·Google은 각자 클라우드 + 자체·파트너 모델로 다중 입찰 구도. 동시에 Anthropic은 안전 가드레일 견지로 단독 배제 - 빅테크 AI 5사가 정부·방산 영역에서는 단일 라인업으로 정렬, 안전 거버넌스 노선이 시장 분기점 역할로 굳어지는 흐름. NVIDIA는 H100·B200·Vera Rubin 직접 공급 + Reflection 신규 등장으로 정부 인프라 칩 베이스 확장.",
        time: "2026-05-02 07:40 KST" },
    ]
  },
  {
    date: "2026-05-01 19:45 KST",
    summary: `Apple Cook→Ternus 9/1 승계 마지막 분기 콜에서 Ternus 소개·AI 로드맵 시험대 명확화
Anthropic $40~50B 라운드 48시간 내 allocation 제출 요청·2주 내 마감 가능 - $850~900B 밸류
xAI·SpaceX 이해관계 결합 2026 초 효과적 합병 - SpaceX IPO가 xAI 모델 공개 노출 주요 통로
OpenAI GPT-5.5 Cyber 'critical defenders' 한정 단계 배포 - Anthropic 모델 모방 선회
QCOM 12월 데이터센터 추론 칩 첫 출하 가이던스 공식 - 멀티 ASIC 경쟁 본격화`,
    changes: [
      { type: "리더십", sector: "Apple",
        detail: "Apple(Ternus 승계 직전 AI 로드맵 가시화). 4/30 Q2 FY26 콜에서 Tim Cook이 9/1 후임 SVP Hardware Engineering John Ternus를 직접 소개 - Cook 시대 마무리·Ternus 시대 카운트다운 본격화. 콜에서 Apple Foundation Models 차세대가 Google Gemini 기반으로 트레이닝되고 있음이 재확인되며, 신 Siri의 iOS 26.5→27 일정 연기 후 Gemini 기반 재설계 진척, WKA AI 검색 확장, AI 웨어러블 3종(스마트홈 디바이스·visionOS hub·AI 안경) 일정이 취임 전후 최대 시험대로 명확화. 4/24 Anthropic Alphabet $40B 투자 + 5GW TPU 약정 라인과 동일 스택을 Apple도 공유하는 구도가 굳어지며, 자체 LLM 자립이 아닌 'Gemini·Anthropic 인프라 활용 + Foundation Models 오케스트레이션' 노선이 차기 Ternus 체제의 핵심 축으로 정렬. 별도로 Cook이 콜에서 '메모리 비용 큰 폭 상승'을 6월 분기 GM 압박 변수로 명시 - DRAM·NAND 단가 인상이 디바이스용 LLM 추론·온디바이스 AI 칩 BOM에도 직접 부담으로 전이되는 구조.",
        time: "2026-05-01 07:30 KST" },
      { type: "펀딩", sector: "Anthropic",
        detail: "Anthropic($40~50B / $900B 검토·48h allocation deadline). 4/29~30 Bloomberg·CNBC·TechCrunch가 동시 보도 - Anthropic이 신규 $40~50B 펀딩 라운드를 $850~900B 밸류 사전 제안 형태로 검토 중, **48시간 안에 투자자 측 allocation 제출 요청**·**최대 2주 내 라운드 마감 가능 페이스**(TechCrunch 4/30). 성사 시 OpenAI($852B, 3월 $1,220억 라운드 기준)를 가치 기준 추월하며 사상 가장 비싼 AI 스타트업으로 등극. 2월 시리즈G $380B → 두 달 만에 약 2.4배 상향 트랙. 펀더멘털 근거는 연환산 매출(ARR)이 3월 $30B 돌파 후 현재 $40B에 근접(2025년 말 $9B 대비 4개월 만에 3~4배), Sacra YoY +1,400%로 OpenAI($25B)를 단독 추월. 누적 자금·고객 베이스 - 4/24 Alphabet 최대 $40B 투자 + 4/20 Amazon $25B + AWS 10년 $100B+ 약정 + 4/24 일본 NEC 30,000명 전사 배포 - 가 두텁다. 10월 IPO $400~500B 타겟에서 사실상 마지막 사적 펀딩 라운드 가능성. Goldman·JPM 주관 그대로.",
        time: "2026-05-01 07:30 KST" },
      { type: "전략", sector: "xAI",
        detail: "xAI·SpaceX 이해관계 결합. 2026 초 xAI가 SpaceX와 사실상 합병 구조로 진입한 것이 5/1 시점 다수 매체 정리에서 재확인 - 별도 IPO 트랙을 포기하고 SpaceX IPO(5/15~5/22 S-1 제출·6/8 로드쇼·6/18~6/30 프라이싱)가 xAI 모델·인프라 노출의 주요 공개 시장 통로로 굳어짐. xAI 단독 펀딩에서 Anthropic·OpenAI와 동일 트랙으로 경쟁하기보다 SpaceX 인프라(Colossus 클러스터·전력·위성) + xAI 모델(Grok·Colossus 코드)을 단일 공개 자산으로 묶는 구조. SpaceX $1.75~2.0T 밸류·$75B 조달 타겟에서 xAI 부분 가치는 분리 공시되지 않으나, 4/15 Cursor의 SpaceX $60B 인수 옵션 + xAI·Mistral 3자 파트너십 협의가 같은 라인 정렬. 빅3 AI 라인업(OpenAI·Anthropic·xAI)에서 xAI는 단독 IPO 트리거 대신 SpaceX IPO 흡수의 변수로 재정의.",
        time: "2026-05-01 19:45 KST" },
      { type: "거버넌스", sector: "OpenAI",
        detail: "OpenAI(GPT-5.5 Cyber 단계 배포). 4/30 OpenAI는 GPT-5.5 Cyber를 'critical cyber defenders' 한정으로만 배포한다고 공식 발표. Altman이 4/7 Anthropic Project Glasswing의 Mythos 비공개 정책을 '공포 기반 마케팅(fear-based marketing)'으로 비판한 지 약 3주 만에 동일한 차단형 접근법으로 선회 - TechCrunch는 'After dissing Anthropic for limiting Mythos, OpenAI restricts access to Cyber, too'로 정리. 같은 날 OpenAI는 'Our commitment to community safety' 별도 성명을 추가 게시하며 Cyber·Bio·Chemical·Persuasion 카테고리 전반에 사전 통제 프레임워크 적용 의사 시사. AI 보안 거버넌스 산업 표준이 '오픈 → 사전 통제'로 수렴하는 구조 변화로 정리되며 OpenAI·Anthropic 양사 모두 IPO 직전 책임성 시그널을 적극 발신하는 흐름.",
        time: "2026-05-01 07:30 KST" },
      { type: "인프라", sector: "NVIDIA",
        detail: "NVIDIA(QCOM 데이터센터 진입 시그널). 4/29 장후 Qualcomm Q2 2026 컨콜에서 Cristiano Amon CEO가 '12월 대형 하이퍼스케일러向 데이터센터 칩 첫 출하' 가이던스를 공식화. AI200(2026)·AI250(2027) 추론 가속기 라인업이 Broadcom MTIA·Google TPU 8t/8i와 결합돼 NVIDIA 데이터센터 단일 공급 구조에서 멀티 ASIC 경쟁 구도로 본격 분기. 4/29 Alphabet Cloud +63% 백로그 $460B + 4/29 Meta CapEx $125~145B 상향과 같은 라인에서 GPU·TPU·MTIA·QCOM AI200까지 다중 칩 동시 가속 - NVIDIA의 절대 점유율은 한동안 유지되나 추론 영역에서 비중 침식 압력은 분기 단위로 가시화. 자동차 매출 연 $5B 첫 돌파도 동반.",
        time: "2026-05-01 07:30 KST" },
      { type: "마일스톤", sector: "OpenAI",
        detail: "OpenAI(매출 부진 보도 후폭풍·Friar IPO 연기 주장). 4/28 WSJ가 OpenAI Q1 매출이 컨센을 하회했고 CFO Friar가 IPO 일정을 2026년 너머로 연기해야 한다고 이사회에 주장한 정황을 보도. 동일 보도에서 Altman은 $600B 컴퓨트 약속을 그대로 가져가는 그림을 고수하면서 두 주장 사이 간극이 IPO 펀더멘털 신뢰 변수의 핵심 변수로 부상. 1월 내부 목표였던 ChatGPT 주간 활성 10억 명은 2월 9억 명에서 멈춘 상태로 다시 확인. SoftBank ADR -10%·CoreWeave -6%·Oracle -4%·NVDA -2.9%로 AI 인프라 매도가 누적된 흐름이 4/29 시간외에서 일부 회복되며 메가캡 슈퍼위크 실적 흐름이 다음 분기점.",
        time: "2026-05-01 19:45 KST" },
    ]
  },
  {
    date: "2026-04-30 07:20 KST",
    summary: `Microsoft Q1 FY26 매출 $77.7B +18%·Azure $21.5B +38%·OpenAI 지분손실 -$0.41 EPS 정량화
Alphabet Q1 매출 $109.9B +22%·Cloud $20.03B +63%·백로그 $460B QoQ 두 배·CapEx $180~190B
Meta Q1 매출 $56.31B +33%·CapEx $125~145B 상향·DAP 컨센 하회로 AH -6%
Amazon Q1 매출 $181.5B +17%·AWS $37.59B +28% 3년 만 최고 성장률·CapEx $200B 유지
4사 일제 컨센 상회로 AI 인프라 수요·CapEx 가속 재확인 - OpenAI 매출 부진發 의구심 부분 상쇄`,
    changes: [
      { type: "마일스톤", sector: "Microsoft",
        detail: "Microsoft(Q1 FY26 결과). 4/29 장후 매출 $77.7B +18%·EPS $4.13 컨센 상회, Azure $21.5B +38% CC. Hood CFO가 컨콜에서 '용량 한계로 +40%까지 잠재'라고 명시하며 OpenAI 매출 부진 우려를 자체 펀더멘털로 정면 반박. 다만 OpenAI 지분손실이 EPS -$0.41로 처음 정량화 반영돼 GAAP $3.72(+13%)로 둔화 - Microsoft 자체는 견조하나 OpenAI 손실 확대 트렌드가 공식 자료로 노출. FY26 CapEx 증가율 FY25 초과 가이던스로 '가속 수요'를 명시. 4/27 OpenAI 파트너십 전면 개편 후 Anthropic·자체 모델 자립 동시 추구 노선 유지.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "Google DeepMind",
        detail: "Alphabet(Q1 결과·Cloud 폭증). 4/29 장후 매출 $109.9B +22% 컨센 $107.1B 상회, EPS $5.11이 컨센 $2.62를 압도. Google Cloud $20.03B +63% 컨센 $18.4B 상회, 백로그 $460B QoQ 두 배 폭증. Pichai 컨콜 첫 마디로 '단기 컴퓨트 제약'을 직접 시인 - 수요가 공급을 초과해 Cloud 매출이 더 클 수 있었음을 명시. CapEx $180~190B로 상향($175~185B에서). Gemini Enterprise 유료 MAU QoQ +40%, 자사 모델 분당 160억 토큰 처리 +60% QoQ. Apple Foundation Models 차세대 Gemini 기반 + Anthropic 최대 $40B 투자·5GW TPU 전담 공급의 이중 베팅이 실적으로 외부 검증.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "Meta AI",
        detail: "Meta(Q1 결과·CapEx 상향). 4/29 장후 매출 $56.31B +33% 컨센 $55.45B 상회, EPS $10.44(세제혜택 $8B 포함, 조정 $7.31), 영업이익률 41% 유지. CapEx 가이던스 $125~145B로 상향($115~135B에서) → 시간외 -6%. Susan Li CFO '슈퍼인텔리전스 베팅·자체 칩·NVIDIA GPU 동시 가속' 명시, 4/23 8,000명 감원과 결합된 'payroll → AI capex' 구조 전환 본격화. DAP 3.56B 컨센 3.62B 하회, Q2 가이던스 $58~61B. AI 광고 추천엔진은 +33% 광고 성장으로 가속 입증, Muse Spark 엔진 교체 + MTIA 자체 칩 4세대 로드맵 가시화 흐름과 직결.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "Amazon AWS",
        detail: "Amazon(Q1 결과·AWS 가속). 4/29 장후 매출 $181.5B +17%, AWS $37.59B +28%로 3년 만 최고 성장률, 컨센 +26% 상회. AWS 영업익 $14.2B 사상 최대. EPS $2.78. Q2 가이던스 매출 $194~199B(+16~19%)·영업익 $20~24B. 연간 CapEx $200B 가이던스 유지하며 회수율 우려를 Q1 실적으로 일축. 4/27 Microsoft 독점 종료로 OpenAI 모델 Bedrock 직접 호스팅이 가능해진 상황과 결합돼 Bedrock의 멀티 모델 허브 입지가 추가 강화. Trainium3 / Trn3 UltraServer 거의 완판 + 서드파티 랙 직접 판매 검토 흐름이 NVIDIA 직접 경쟁 시그널.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "OpenAI",
        detail: "OpenAI(Microsoft 자료로 손실 노출). Microsoft Q1 FY26에서 OpenAI 지분 손실이 EPS -$0.41로 처음 정량화 반영돼 GAAP $3.72(+13%)로 둔화. Microsoft 자체 펀더멘털은 견조하나 OpenAI 손실 확대 트렌드가 공식 회계 자료로 노출되며 4/28 WSJ 매출 부진·CFO Friar 우려와 결합돼 IPO 일정·매출 가속 압박이 외부적으로 가중. Altman·Friar는 'totally aligned'를 재확인하나 컴퓨트 자금조달 능력 의구심은 5월 5.5 추가 배포·OpenAI Trusted Access for Cyber 파일럿 진척 등 후속 수익화 트리거가 구체화되기 전까지 잔존.",
        time: "2026-04-30 07:20 KST" },
      { type: "제품 출시", sector: "Apple",
        detail: "Apple(Q2 FY26 발표 임박). 4/30 장후 Q2 결과 발표 - 컨센 매출 $109.7B(+15%)·EPS $1.95(+18%), iPhone 컨센 $56.5B·서비스 컨센 $30B(GM 70%+). Cook의 마지막 분기 발표·9/1 Ternus 승계 직전 가이던스 기조이 시장 반응 핵심. iPhone 17 슈퍼사이클 + 신 Siri Gemini 기반 일정(iOS 26.5→27 연기) + WKA AI 검색 확장이 차기 분기 점검대.",
        time: "2026-04-30 07:20 KST" },
    ]
  }
];