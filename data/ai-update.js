/**
 * update.js — AI Players 업데이트 로그
 *
 * 각 기업의 모델·제품·펀딩·인수 등 콘텐츠 변경 사항을
 * 날짜별로 기록한다.
 */
const UPDATES = [
  {
    date: "2026-04-30 07:20 KST",
    summary: `Microsoft Q1 FY26 매출 $77.7B +18%·Azure $21.5B +38%·OpenAI 지분손실 -$0.41 EPS 정량화
Alphabet Q1 매출 $109.9B +22%·Cloud $20.03B +63%·백로그 $460B QoQ 두 배·CapEx $180~190B
Meta Q1 매출 $56.31B +33%·CapEx $125~145B 상향·DAP 미스로 AH -6%
Amazon Q1 매출 $181.5B +17%·AWS $37.59B +28% 3년 만 최고 성장률·CapEx $200B 유지
4사 일제 비트로 AI 인프라 수요·CapEx 가속 재확인 — OpenAI 매출 미스發 의구심 부분 상쇄`,
    changes: [
      { type: "마일스톤", sector: "Microsoft",
        detail: "Microsoft(Q1 FY26 결과). 4/29 장후 매출 $77.7B +18%·EPS $4.13 비트, Azure $21.5B +38% CC. Hood CFO가 컨콜에서 '용량 한계로 +40%까지 잠재'라고 명시하며 OpenAI 매출 미스 우려를 자체 펀더멘털로 정면 반박. 다만 OpenAI 지분손실이 EPS -$0.41로 처음 정량화 반영돼 GAAP $3.72(+13%)로 둔화 — Microsoft 자체는 견조하나 OpenAI 손실 확대 트렌드가 공식 자료로 노출. FY26 CapEx 증가율 FY25 초과 가이던스로 '가속 수요'를 명시. 4/27 OpenAI 파트너십 전면 개편 후 Anthropic·자체 모델 자립 동시 추구 노선 유지.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "Google DeepMind",
        detail: "Alphabet(Q1 결과·Cloud 폭증). 4/29 장후 매출 $109.9B +22% 컨센 $107.1B 비트, EPS $5.11이 컨센 $2.62를 압도. Google Cloud $20.03B +63% 컨센 $18.4B 비트, 백로그 $460B QoQ 두 배 폭증. Pichai 컨콜 첫 마디로 '단기 컴퓨트 제약'을 직접 시인 — 수요가 공급을 초과해 Cloud 매출이 더 클 수 있었음을 명시. CapEx $180~190B로 상향($175~185B에서). Gemini Enterprise 유료 MAU QoQ +40%, 자사 모델 분당 160억 토큰 처리 +60% QoQ. Apple Foundation Models 차세대 Gemini 기반 + Anthropic 최대 $40B 투자·5GW TPU 전담 공급의 이중 베팅이 실적으로 외부 검증.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "Meta AI",
        detail: "Meta(Q1 결과·CapEx 상향). 4/29 장후 매출 $56.31B +33% 컨센 $55.45B 비트, EPS $10.44(세제혜택 $8B 포함, 조정 $7.31), 영업이익률 41% 유지. CapEx 가이던스 $125~145B로 상향($115~135B에서) → 시간외 -6%. Susan Li CFO '슈퍼인텔리전스 베팅·자체 칩·NVIDIA GPU 동시 가속' 명시, 4/23 8,000명 감원과 결합된 'payroll → AI capex' 구조 전환 본격화. DAP 3.56B 컨센 3.62B 미스, Q2 가이던스 $58~61B. AI 광고 추천엔진은 +33% 광고 성장으로 가속 입증, Muse Spark 엔진 교체 + MTIA 자체 칩 4세대 로드맵 가시화 흐름과 직결.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "Amazon AWS",
        detail: "Amazon(Q1 결과·AWS 가속). 4/29 장후 매출 $181.5B +17%, AWS $37.59B +28%로 3년 만 최고 성장률, 컨센 +26%를 비트. AWS 영업익 $14.2B 사상 최대. EPS $2.78. Q2 가이던스 매출 $194~199B(+16~19%)·영업익 $20~24B. 연간 CapEx $200B 가이던스 유지하며 회수율 우려를 Q1 실적으로 일축. 4/27 Microsoft 독점 종료로 OpenAI 모델 Bedrock 직접 호스팅이 가능해진 상황과 결합돼 Bedrock의 멀티 모델 허브 입지가 추가 강화. Trainium3 / Trn3 UltraServer 거의 완판 + 서드파티 랙 직접 판매 검토 흐름이 NVIDIA 직접 경쟁 시그널.",
        time: "2026-04-30 07:20 KST" },
      { type: "마일스톤", sector: "OpenAI",
        detail: "OpenAI(Microsoft 자료로 손실 노출). Microsoft Q1 FY26에서 OpenAI 지분 손실이 EPS -$0.41로 처음 정량화 반영돼 GAAP $3.72(+13%)로 둔화. Microsoft 자체 펀더멘털은 견조하나 OpenAI 손실 확대 트렌드가 공식 회계 자료로 노출되며 4/28 WSJ 매출 미스·CFO Friar 우려와 결합돼 IPO 일정·매출 가속 압박이 외부적으로 가중. Altman·Friar는 'totally aligned'를 재확인하나 컴퓨트 자금조달 능력 의구심은 5월 5.5 추가 배포·OpenAI Trusted Access for Cyber 파일럿 진척 등 후속 수익화 트리거가 구체화되기 전까지 잔존.",
        time: "2026-04-30 07:20 KST" },
      { type: "제품 출시", sector: "Apple",
        detail: "Apple(Q2 FY26 발표 임박). 4/30 장후 Q2 결과 발표 — 컨센 매출 $109.7B(+15%)·EPS $1.95(+18%), iPhone 컨센 $56.5B·서비스 컨센 $30B(GM 70%+). Cook의 마지막 분기 발표·9/1 Ternus 승계 직전 가이던스 톤이 시장 반응 핵심. iPhone 17 슈퍼사이클 + 신 Siri Gemini 기반 일정(iOS 26.5→27 연기) + WKA AI 검색 확장이 차기 분기 점검대.",
        time: "2026-04-30 07:20 KST" },
    ]
  },
  {
    date: "2026-04-29 13:05 KST",
    summary: `OpenAI 'firing on all cylinders' 공식 반박·Altman·Friar 공동 성명 'totally aligned'
WSJ 후속 보도: Friar IPO 2026년 연기 주장, Altman $600B 약속 강행 의견 충돌 부각
Anthropic 4/28 Jupiter 프리IPO 플랫폼서 밸류 $1T 도달·Forge·Hiive와 정렬
GPT-5.5 + 엔터·바이오 라인업 vs OpenAI CFO 컴퓨트 자금조달 우려 충돌 구도 본격화`,
    changes: [
      { type: "마일스톤", sector: "OpenAI",
        detail: "OpenAI(공식 반박·내부 균열 노출). 4/28 후속 보도에서 OpenAI는 'prime clickbait'·'firing on all cylinders'로 WSJ 보도를 강하게 부인했고 Altman·Friar는 공동 성명으로 'totally aligned'를 강조. 그러나 Fortune·Humai 후속 추적에 따르면 Friar CFO는 이사회에 'OpenAI가 수천억 달러 데이터센터·컴퓨트 계약을 매출 가속 없이는 이행하기 어렵다'는 우려를 직접 제기했고 IPO를 2026년 너머로 연기해야 한다는 입장을 내비쳤다. Altman은 $600B 컴퓨트 약속을 그대로 가져가는 그림을 고수, 두 주장 사이의 간극이 IPO 펀더멘털 신뢰 변수의 핵심 변수로 부상. 1월 내부 목표였던 ChatGPT 주간 활성 10억 명은 2월 9억 명에서 멈춘 상태로 다시 확인. 4/28 SoftBank ADR -10%·CoreWeave -6%·Oracle -4%·NVDA -2.9%로 AI 인프라 매도가 누적된 흐름이 4/29 시간외에서 일부 회복되며 메가캡 슈퍼위크 실적 톤이 다음 분기점.",
        time: "2026-04-29 13:05 KST" },
      { type: "마일스톤", sector: "Anthropic",
        detail: "Anthropic($1T 마일스톤 공식 확인). 4/28 The Currency·NAI500이 Jupiter 프리IPO 플랫폼에서 Anthropic이 시초 $1T 밸류에 도달했다고 동시 보도 — Forge에서도 비슷한 가격·Hiive는 약 $851B로 매겨져 지표 간 일관성 확보. 2월 시리즈G $380B → 4/24 Alphabet $40B 합의 $380B 시점에서 두 달 만에 약 2.6배 추가 상향. 동일자 Sacra 추산 연환산 매출 3월 기준 $300억(YoY +1,400%)이 OpenAI($250억)를 추월한 가운데, OpenAI WSJ 매출 미스 보도가 'Anthropic이 코딩·엔터프라이즈에서 점유율을 빼앗아갔다'는 명시적 진술과 결합되며 IPO 10월 $400~500B 타겟의 외부 검증 시그널을 한 단계 더 강화. 4/24 Alphabet $40B + AWS $25B + 5GW TPU·$100B 컴퓨트 약정의 24시간 누적 $65B+ 유입과 같은 라인에 정렬.",
        time: "2026-04-29 13:05 KST" },
    ]
  },
  {
    date: "2026-04-29 07:30 KST",
    summary: `OpenAI WSJ 매출 미스 보도 — 월별 목표 연속 미달·주간활성 10억 미달·Anthropic에 코딩 영역 점유 양도
CFO Sarah Friar 사내 우려 — 매출 가속 없으면 향후 컴퓨트 계약 자금조달 어려워질 수 있음
Oracle -4%·AVGO -4%·AMD -3%·SoftBank ADR -10%·NVDA -2.9% AI 인프라 매도 동조
OpenAI: '말도 안 됨·총력 컴퓨트 매입' 반박·Oracle '신규 5.5 모델 모멘텀' 적극 방어
Anthropic — IPO 직전 OpenAI 약점 노출이 코딩 우위 내러티브에 반사 이익`,
    changes: [
      { type: "마일스톤", sector: "OpenAI",
        detail: "OpenAI(IPO 직전 매출 미스 노출). 4/28 Wall Street Journal이 OpenAI가 자체 월별 매출 목표를 연초부터 연속 미달했고 ChatGPT 주간 활성 10억 도달 목표도 미달, 코딩·엔터프라이즈 영역에서 Anthropic에 시장을 내준 정황을 보도. CFO Sarah Friar가 사내 회의에서 '매출 가속이 없으면 향후 컴퓨트 계약 자금조달이 어려워질 수 있다'는 우려를 직원들에게 전달한 사실까지 함께 공개. Altman·Friar는 Reuters 성명에서 'This is ridiculous·총력으로 컴퓨트 매입 작업을 함께 하고 있다'고 반박. AI 인프라 펀딩 신뢰가 흔들리며 4/28 Oracle -4%(5년 $300B 컴퓨트 공급계약 직격), Broadcom -4%(자체 ASIC 협력 의구심), AMD -3%, SoftBank ADR -10% 동시 약세. NVDA도 사상 최고 후 첫 조정 -2.9%. Oracle은 'OpenAI 신규 5.5 모델 모멘텀과 채택 가속을 직접 목격 중'이라며 적극 방어 성명을 발표. IPO 2026년 말 검토를 앞둔 시점에 컴퓨트 자금조달 능력을 둘러싼 펀더멘털 의구심이 가장 큰 리스크 요인으로 부상.",
        time: "2026-04-29 07:30 KST" },
      { type: "마일스톤", sector: "Anthropic",
        detail: "Anthropic(반사이익). 4/28 WSJ이 OpenAI가 코딩·엔터프라이즈 시장에서 Anthropic에 점유율을 내주고 있다고 명시 보도. Claude Code의 엔터프라이즈 AI 코딩 50%+ 점유, 4/16 Opus 4.7 SWE-bench Pro 64.3%(GPT-5.4 57.7% 상회) 우위, 4/24 NEC 30,000명 전사 배포·Alphabet 최대 $40B 추가 투자·5GW TPU 5년 전담 공급, 4/20 Amazon $25B 추가 + AWS 10년 $100B+ 약정, 세컨더리 밸류 $1T·연환산 매출 $300억(OpenAI 추월) 마일스톤이 외부 일관성 확보. 4/27 'Claude 광고 영구 배제' 공식화로 신뢰·프라이버시 차별화까지 명문화돼 OpenAI 매출 미스 보도가 코딩 우위 내러티브의 외부 검증으로 작동, IPO 10월 $400~500B 타겟의 펀더멘털 강화 시그널.",
        time: "2026-04-29 07:30 KST" },
    ]
  },
  {
    date: "2026-04-28 13:00 KST",
    summary: `Anthropic 4/27 'Claude 광고 영구 배제' 공식화 — 엔터프라이즈 신뢰 우위 차별화
NVIDIA 시총 $5.3T 사상 최고 — QCOM·OpenAI·MediaTek 2028 AI 폰 칩 협력
4/29 GOOGL·MSFT·META·AMZN 동시 실적 슈퍼위크 본격
Apple·Google Foundation Models 트레이닝 수요 8세대 TPU 8t/8i 가동`,
    changes: [
      { type: "전략", sector: "Anthropic",
        detail: "Anthropic. 4/27 자사 블로그에 'Claude는 광고 없이 운영된다'는 입장을 공식화. 광고 인센티브 구조가 '진정으로 도움이 되는 AI 어시스턴트'와 양립할 수 없다는 논리 — 광고주 클릭률·체류시간을 극대화하기 위한 다크 패턴이 사용자에게 진짜 좋은 답변을 흐릴 가능성을 차단. 구독·B2B API·엔터프라이즈 시트만으로 매출을 확장하는 모델을 IPO를 앞두고 명문화한 의미 — 4/24 NEC 30,000명 전사 배포·4/20 Amazon $25B 추가 투자·세컨더리 밸류 $1T·연환산 매출 $300억 돌파와 결합되며 '광고 없이도 OpenAI를 추월한 첫 프론티어 랩'으로 차별화 포지션 굳히기. ChatGPT의 광고 도입 가능성 보도가 반복되는 상황에서 신뢰성·프라이버시를 IPO 내러티브의 핵심 자산으로 명문화하는 분기점.", time: "2026-04-28 13:00 KST" },
      { type: "마일스톤", sector: "NVIDIA",
        detail: "NVIDIA. 4/27 종가 $216.57 +4.0% 사상 최고 갱신, 시총 $5.3T로 글로벌 1위 격차를 다시 벌렸다. 트리거는 Ming-Chi Kuo가 X에 게시한 OpenAI·Qualcomm·MediaTek·Luxshare 4사 2028 AI 스마트폰 칩 공동개발 보도 — QCOM이 SoC 코디자인, MediaTek가 모뎀·BB, Luxshare가 EMS 전담하는 구조가 노출되며 AI 컴퓨트가 데이터센터 단일 서사에서 모바일 엣지 + 데이터센터 듀얼 서사로 확장. NVIDIA는 Cosmos·NIM·온디바이스 라이센싱 + Blackwell Ultra·Vera Rubin 풀프로덕션·Rubin CPX massive-context inference로 양 서사 모두를 동시에 점유. QCOM 주가 +11~12% 동반 점프해 4월 두 번째 두 자릿수 랠리. 5/20 Q1 FY27 컨센 매출 $78B(+57% YoY)가 차기 모멘텀의 분기점.", time: "2026-04-28 13:00 KST" },
    ]
  },
  {
    date: "2026-04-28 07:24 KST",
    summary: "OpenAI·Microsoft 파트너십 7년만에 전면 개편·MS 독점 라이선스 종료·AGI 판정 조항 폐기·OpenAI는 AWS·GCP·Oracle 직접 진입 가능·QCOM·OpenAI·MediaTek 2028 AI 스마트폰 칩 협력 보도·NVDA $5.3T·Musk vs OpenAI 비영리 환원 소송 오클랜드 개시",
    changes: [
      { type: "전략", sector: "OpenAI", detail: "OpenAI·Microsoft. 4/27 양사가 7년 파트너십을 전면 재구성한 'Next Phase' 합의를 동시 발표. ①Microsoft의 OpenAI 기술 독점 라이선스가 종료되고 비독점 형태로 2032년까지 연장 — OpenAI가 모든 제품을 클라우드 무관하게 모든 고객에게 직접 제공할 수 있게 됨. ②원계약의 가장 이례적이던 'AGI 도달 여부를 MS가 판정' 조항이 완전 삭제, 그동안 IPO·재구조화의 최대 법적 걸림돌이 해소. ③매출 셰어 구조도 변경 — OpenAI가 MS에 지급하는 셰어는 총 한도(cap) 도입 후 2030년까지 단계 종료, MS가 OpenAI에 지급하던 셰어는 즉시 중단. Azure는 'primary cloud partner' 지위와 우선구매권을 유지하지만 AWS·GCP·Oracle도 OpenAI 모델을 직접 호스팅 가능 — Andy Jassy는 같은 날 '곧 Bedrock 도입'을 명시. OpenAI 입장에서 컴퓨트 다변화·B2B 확장·Anthropic 추격 가속, MS 입장에서 인프라 매출 한도 해제·자체 모델·MAI 라인업 자립 압박 동시 가중. IPO 2026년 말 검토 중인 OpenAI에는 가장 큰 구조적 장애물 제거.", time: "2026-04-28 07:24 KST" },
      { type: "거버넌스", sector: "OpenAI", detail: "OpenAI(Musk 소송). 4/27 캘리포니아 오클랜드 연방법원에서 Musk vs OpenAI 본안 소송이 시작. Musk는 자신이 비영리에 기부한다는 가정 하에 자금을 조달했다며 비영리 환원·금전 배상을 요구. OpenAI는 2017년 Musk가 보낸 'AGI를 만들면 SpaceX·Tesla 산하로 이전한다'는 합의서 초안을 증거로 제출, '비영리 환원이 아닌 본인 통제 욕망이었다'는 반박 라인을 공식화. 같은 날 발표된 MS 파트너십 개편으로 비영리 → for-profit 재구조화 압박이 외부에서 한 차례 약화된 시점과 맞물려 재판 자체가 IPO 절차에 직접 영향을 줄 가능성 부각.", time: "2026-04-28 07:24 KST" },
      { type: "전략", sector: "Microsoft", detail: "Microsoft. 4/27 OpenAI 독점 종료 합의로 매출 셰어 한도·AGI 판정 조항 폐기 등 양보를 수용한 대신, 2032년까지 OpenAI IP 라이선스를 비독점으로 보장받고 우선구매권·primary cloud partner 지위를 유지. Azure 입장에서는 단기적으론 매출 셰어 컷오프와 OpenAI의 멀티클라우드 진출이 부담이지만, 자체 MAI 라인·Mustafa Suleyman의 자립 컴퓨트 목표(2026 말)가 가속될 명분을 확보. Bing·Xbox·Devices 부서까지 사상 첫 자발적 바이아웃 8,750명을 진행 중인 'payroll → AI capex' 흐름과 결합되면 마진 방어 + 자립 모델 + 생산성 자동화 3중 베팅 구도로 재편되는 분기점.", time: "2026-04-28 07:24 KST" },
      { type: "생태계", sector: "OpenAI", detail: "OpenAI·Qualcomm·MediaTek. 4/27 Ming-Chi Kuo가 X에 게시한 노트로 4사(OpenAI·QCOM·MediaTek·Luxshare) AI 스마트폰 칩 공동개발 사실이 공개. QCOM이 SoC 코디자인, MediaTek가 모뎀·BB, Luxshare가 시스템 코디자인·EMS 전담, 2028 mass-market AI-native 디바이스 양산 목표. OpenAI Jony Ive 디자인 디바이스 팀 전략의 가장 구체적인 칩셋 라인업. QCOM 주가 +11~12% 동반 점프해 4월 두 번째 두 자릿수 랠리. NVIDIA는 동시에 Cosmos·NIM·온디바이스 라이센싱과 결합되며 시총 $5.3T 사상 최고 갱신. AI 컴퓨트 무대가 데이터센터 단일 서사에서 모바일 엣지 + 데이터센터 듀얼 서사로 확장되는 첫 메인스트림 시그널.", time: "2026-04-28 07:24 KST" },
    ]
  },
  {
    date: "2026-04-27 13:30 KST",
    summary: "Anthropic Claude Mythos Preview 무단 접근 사건 공식 조사 — 외부 그룹이 명명 규칙 추론으로 API URL 맞춰 출시 당일부터 상시 접속·Anthropic 4/24 NEC와 글로벌 파트너십 체결로 30,000명 Claude 전사 배포·일본 첫 글로벌 파트너 지정 NEC 주가 +5.2%",
    changes: [
      { type: "거버넌스", sector: "Anthropic", detail: "Anthropic(Claude Mythos Preview). 4/21~23 Bloomberg·TechCrunch·Fortune·Tom's Hardware 동시 보도 — 너무 위험해 공개 배포를 보류한 사이버보안 프론티어 모델 Mythos Preview에 외부 그룹이 무단 접근 중인 사실이 드러났다. 침해 그룹은 데이터 라벨링 스타트업 Mercor 유출 사건에서 입수한 Anthropic 명명 규칙 정보를 기반으로 Mythos의 API 엔드포인트 URL을 추론·맞췄고, 모델 출시 당일부터 상시 접근을 유지해 왔다. 그룹 멤버 중 한 명은 Anthropic의 제3자 컨트랙터로 확인. Anthropic 측은 'Mythos Preview에 대한 무단 접근 보고를 조사 중'이라고 공식 인정, 사용 패턴은 실제 공격이 아닌 탐색 수준이라고 발표. Mythos는 Apple·AWS·Cisco·JPMorgan·NSA 등 52개 검증 조직에만 제한 배포되며 Project Glasswing으로 방어자에게 $1억 크레딧을 제공해 왔던 모델 — '비공개'를 전제로 설계된 프론티어 모델의 첫 외부 노출 사례로 AI 거버넌스·서드파티 벤더 보안·시크릿 라우팅 표준 전반에 시정 압박.", time: "2026-04-27 13:30 KST" },
      { type: "생태계", sector: "Anthropic", detail: "Anthropic·NEC. 4/24 Anthropic이 일본 NEC Corporation과 글로벌 전략 파트너십을 체결, NEC가 Anthropic의 일본 첫 글로벌 파트너로 지정. 약 30,000명 NEC 그룹 직원이 Claude·Claude Code·Claude Cowork를 전사 배포 받으며 NEC는 자체 'AI-Native Engineering Center of Excellence'를 신설해 Anthropic으로부터 직접 기술 지원·교육을 받는다. 양사는 금융·제조·지방정부를 시작으로 일본 시장 산업별 보안 AI 제품을 공동 개발, NEC의 'Client Zero' 전략(자사를 첫 고객으로 배포 후 외부 고객 제공) 위에 Cowork를 사내 운영 자동화에 확대. 발표 직후 NEC 주가 +5.2% 점프, 일본 빅테크 AI 자체 개발 노선에서 Claude 라이선스+생태계 파트너 모델로 전환되는 구조적 변곡점.", time: "2026-04-27 13:30 KST" },
    ]
  },
  {
    date: "2026-04-27 07:40 KST",
    summary: "Microsoft 4/23 사상 첫 자발적 바이아웃 약 8,750명·美 인력 7%·연령+근속 70 자격·Meta 4/23 8,000명 10% 정리 5/20 시행·6,000개 공석 폐쇄·CapEx $110~135B AI 인프라 집중 'payroll → AI capex' 전환",
    changes: [
      { type: "구조조정", sector: "Microsoft", detail: "Microsoft. 4/23 51년 사상 처음 자발적 바이아웃 프로그램 도입을 CNBC가 단독 보도하고 사내 메모로 확정 — 美 인력 약 7%(약 8,750명) 대상으로 연령과 근속 연수의 합이 70 이상인 시니어디렉터 이하 직원에게 5월 신청 옵션 제공. 영업 인센티브 플랜 제외. 작년부터 다회 정리해고에 이은 추가 조치로 Bing·Xbox·Azure·Devices 등 전사 부서가 대상이며 베네핏으로 위장한 인력 축소라는 평가. 배경은 FY26 CapEx $110~120B(연환산 $150B 페이스)을 AI 인프라에 집중 투입하는 동안 마진 방어가 절실해진 것 — M365 Copilot 유료 시트가 1월 1,500만(YoY +160%)에 도달했으나 美 시장 점유율은 18.8%(7월)→11.5%(1월)로 후퇴해 인당 매출 압박 가중. Meta 8,000명 정리와 같은 날 발표돼 빅테크 'payroll → AI capex' 전환의 분기점으로 평가.", time: "2026-04-27 07:40 KST" },
      { type: "구조조정", sector: "Meta AI", detail: "Meta AI. 4/23 인사책임자 Janelle Gale의 전사 메모로 약 8,000명(전체 인력 10%) 정리 통보·5월 20일 시행 발표, 별도로 6,000개 공석을 영구 폐쇄. Gale은 '환영받지 못할 소식이지만 이것이 최선의 길'이라고 메모에 적시. CapEx 가이던스 $115~135B(2025년 $72B의 약 2배)를 데이터센터·NVIDIA GPU·커스텀 실리콘·Llama 생태계·Meta Superintelligence Labs에 거의 전액 투입하는 전략과 직결. Alexandr Wang 주도 MSL과 Muse Spark 출시 모멘텀을 컴퓨트·연구 인력에 집중하기 위한 재배치 성격으로, 안정 운영 부서가 가장 큰 영향. 4/29 장후 Q1 컨센 EPS $6.65·매출 $55.5B 발표가 즉각적 가이던스 검증대.", time: "2026-04-27 07:40 KST" },
    ]
  },
  {
    date: "2026-04-25 13:24 KST",
    summary: "Anthropic Memory for Claude Managed Agents 4/24 퍼블릭 베타 — 매니지드 에이전트 세션 간 학습 영구화 + Netflix·Rakuten 등 조기 도입",
    changes: [
      { type: "제품 출시", sector: "Anthropic", detail: "Anthropic(Memory for Claude Managed Agents). 4/24 퍼블릭 베타. 매니지드 에이전트가 세션 간 학습 내용을 파일시스템에 영구 저장하고 다른 에이전트와 공유. Bash·코드 실행 권한 활용해 장기 작업을 누적, 모든 메모리 변경은 감사 로그로 추적·롤백·삭제 가능. Netflix·Rakuten·Wisedocs·Ando 등이 워크플로우 자동화에 조기 도입. Alphabet $40B 투자·세컨더리 $1T 밸류와 결합되며 엔터프라이즈 에이전트 운영의 핵심 미싱 피스가 채워졌다는 평가.", time: "2026-04-25 13:24 KST" },
    ]
  },
  {
    date: "2026-04-25 07:10 KST",
    summary: "Alphabet Anthropic 최대 $40B 투자 공식화·$10B 현금+$30B 마일스톤·5년 5GW TPU 전담 공급·DeepSeek V4 Flash·Pro 프리뷰 공개 1M 토큰 하이브리드 어텐션·Tencent Hy3 공개 295B MoE·Xiaomi MiMo-V2.5 퍼블릭 테스팅",
    changes: [
      { type: "펀딩", sector: "Anthropic", detail: "Anthropic. 4/24 Bloomberg·CNBC·TechCrunch 등이 Alphabet의 최대 $40B 추가 투자를 동시 보도하며 블로그 공지로 공식화. $10B는 밸류 $350B 기준 현금·컴퓨트로 선집행되고, 나머지 $30B는 성과 타겟 달성 시 순차 집행되는 구조. Google Cloud가 향후 5년간 5GW TPU 컴퓨트를 전담 공급하기로 약속해 4/7 Broadcom 3.5GW 딜 위에 용량을 축적, Anthropic은 TPU·Trainium·GPU 3대 인프라 축을 모두 확보한 첫 프론티어 랩이 됐다. 4/20 Amazon의 최대 $25B(즉시 $5B·마일스톤 $20B) 투자, AWS 10년 $100B+ 지출 약정과 합산하면 24시간 누적 $65B+ 유입 구간. Anthropic은 연환산 매출 $300억을 4월 공식 돌파해 OpenAI($250억) 추월, 밸류는 세컨더리에서 이미 $1T — 10월 IPO $400~500B 타겟을 펀더로 뒷받침. OpenAI-Microsoft·Google-Anthropic 두 진영 구도가 확정되는 전환점.", time: "2026-04-25 07:10 KST" },
      { type: "전략", sector: "Google DeepMind", detail: "Google DeepMind. 4/24 Alphabet의 $40B Anthropic 추가 투자 공식화로 'Gemini와 Claude를 동시 지원하는 이중 엔진' 포지션이 확정. Google Cloud는 5GW TPU를 5년간 Anthropic에 전담 공급하기로 약속했고, 추가 GW 옵션도 보유 — 이는 Cloud Next 2026에서 공개한 8세대 TPU(8t/8i)의 수요 기반을 조기에 잠근 의미. 비평가들은 '자사 Gemini와 정면 경쟁하는 Anthropic에 사상 최대 투자를 집행한다'는 구조에 의문 제기하지만, GCP 측은 TPU·인프라 매출·AI 플랫폼 점유 확대 3대 이익을 논리로 제시. GCP AI 매출은 이미 분기 $2B+ 구간.", time: "2026-04-25 07:10 KST" },
      { type: "모델 출시", sector: "OpenAI", detail: "OpenAI. 4/24 DeepSeek이 V4 Flash·V4 Pro 프리뷰 공개, Tencent가 Hy3 Preview(295B MoE/21B 활성·256K 컨텍스트) 공개, Xiaomi가 MiMo-V2.5 시리즈(V2.5/Pro/TTS/ASR) 퍼블릭 테스팅 시작하며 중국 오픈 AI 진영이 하루 만에 3대 발표. DeepSeek는 'Hybrid Attention Architecture'로 1M 토큰 컨텍스트·롱컨텍스트 리콜을 오픈소스 최고 수준으로 끌어올렸다 주장. GPT-5.5(Spud) Terminal-Bench 2.0 82.7% SOTA를 4/23 출시한 OpenAI 입장에서는 중국발 오픈 가격 파괴 재점화 리스크, 반면 엔터프라이즈 규제·Trusted Access 라인업(GPT-Rosalind·Clinicians·Privacy Filter)로 차별화 가속.", time: "2026-04-25 07:10 KST" },
    ]
  },
  {
    date: "2026-04-24 19:30 KST",
    summary: "OpenAI ChatGPT for Clinicians 무료 출시·임상 안전성 99.6% 검증·Business Insider xAI·Mistral·Cursor 3자 파트너십 협의 보도·Google Cloud Next 폐막일 Virgo Network·Agentic Defense 공개",
    changes: [
      { type: "제품 출시", sector: "OpenAI", detail: "OpenAI. 4/23 ChatGPT for Clinicians 출시 — 미 면허 의사·NP·PA·약사·심리학자 대상 무료, NPI 검증 기반 임상 전용 워크스페이스. GPT-5.4 기반이지만 본 워크스페이스의 응답이 베이스 GPT-5.4·타사 모델·인간 의사를 임상 태스크에서 일제 상회, 약 7,000건 응답 중 99.6%가 'safe & accurate' 판정. 동료심사 실시간 인용 클리니컬 서치, CME 자동 추적, 사전승인·차트 워크플로우 스킬 커스터마이즈 지원. Better Evidence Network 협력으로 미국 외 확대 예정. GPT-5.5 본체 출시·PII Privacy Filter 오픈웨이트 배포에 이은 Trusted Access 라인업 의료 트랙 확대.", time: "2026-04-24 19:30 KST" },
      { type: "전략", sector: "xAI", detail: "xAI. 4/24 Business Insider — xAI가 최근 수주간 Mistral·Cursor와 3자 파트너십을 논의했다는 보도. Mistral의 프론티어 모델 역량과 Cursor의 코딩 IDE를 xAI/SpaceX 인프라(Colossus 2)에 통합해 OpenAI·Anthropic을 정면 견제하는 구조. SpaceX의 4/22 Cursor $60B 인수 옵션 계약 직후 부상한 시나리오로, Mistral 공동창업자 Devendra Chaplot은 이미 xAI에 합류해 프리트레이닝을 이끌고 있고 Cursor도 Colossus에서 모델을 학습 중. 3사 모두 공식 확인 거부.", time: "2026-04-24 19:30 KST" },
      { type: "인프라", sector: "Google DeepMind", detail: "Google DeepMind. 4/24 Cloud Next 2026 폐막일 추가 발표 — Virgo Network(AI Hypercomputer 백본 스케일아웃 데이터센터 패브릭) 공식 공개로 8세대 TPU 8t/8i 클러스터를 단일 광 인터커넥트 구조로 확장. 'Agentic Defense' 트랙은 Google Threat Intelligence·Security Operations와 Wiz의 클라우드·AI 시큐리티 플랫폼을 결합해 에이전트 자체가 위협 감지·대응·자동 패치까지 실행하는 통합 보안 스택을 제시. Workspace 측면에서 'Take Notes For Me' 누적 사용자 1.1억(YoY +8.5x)·자동 회의 요약·액션 아이템 캡처 확장이 함께 발표돼 엔터프라이즈 채택 모멘텀 재확인.", time: "2026-04-24 19:30 KST" },
    ]
  },
  {
    date: "2026-04-24 13:30 KST",
    summary: "Anthropic ARR $300억 OpenAI($250억) 공식 추월·연초 $90억 대비 4개월 만 3.3배·Claude Code Pro 제외 실험은 2% A/B테스트로 종료·OpenAI PII Privacy Filter 오픈웨이트 배포 확인",
    changes: [
      { type: "밸류에이션", sector: "Anthropic", detail: "Anthropic. 연환산 매출(ARR)이 4월 기준 $300억을 돌파해 OpenAI($250억)를 사상 처음 공식 추월한 것으로 복수 집계 매체가 4/23 확정 보도. 2025년 말 $90억 수준에서 4개월 만에 3.3배 가속이라는 초유의 성장 궤적으로, 엔터프라이즈 코딩 50%+ 점유·$1M+ 대형 고객 1,000+·Claude Code Routines의 API 종량제 매출이 동시 작동한 결과. $1조 세컨더리 밸류·10월 IPO $400~500B 타겟·Amazon $25B 확정과 결합되며 밸류 기반을 펀더로 뒷받침.", time: "2026-04-24 13:30 KST" },
      { type: "구조조정", sector: "Anthropic", detail: "Anthropic. 4/23 PCWorld가 '$20 Pro 플랜에서 Claude Code 제외 검토' 보도로 대규모 사용자 반발 촉발, 이후 Head of Growth Amol Avasare가 공개 해명 — '신규 프로슈머 가입자 중 약 2%에 한정된 소규모 A/B 테스트였고 기존 Pro·Max 사용자 혜택은 그대로 유지된다'며 Claude Code가 다시 Pro 가입 페이지에 복원됐음을 확인. GitHub가 같은 날 Copilot 정액제 신규 가입 중단·Claude Opus 접근을 제거한 조치와 맞물려 '엔터프라이즈 티어로의 컴퓨트 쏠림' 흐름이 선명해진 구간.", time: "2026-04-24 13:30 KST" },
      { type: "제품 출시", sector: "OpenAI", detail: "OpenAI. 4/23 공개한 Privacy Filter가 오픈웨이트 PII(개인식별정보) 탐지·리댁션 전용 소형 모델로 확인됨. Anthropic·Google이 오픈소스 트랙을 사실상 포기한 가운데 '안전을 인프라로 제공한다'는 접근으로 EU AI Act·HIPAA 컴플라이언스 현장 채택을 겨냥, GPT-5.5 본체 출시에 이어 Trusted Access 제품군(사이버·바이오·PII)을 주간 단위로 공개하는 속도전.", time: "2026-04-24 13:30 KST" },
    ]
  },
  {
    date: "2026-04-24 07:15 KST",
    summary: "OpenAI GPT-5.5 'Spud' 정식 출시·Terminal-Bench 2.0 82.7% SOTA로 Opus 4.7 반격·Anthropic 세컨더리 마켓 $1조 돌파해 OpenAI 추월",
    changes: [
      { type: "모델 출시", sector: "OpenAI", detail: "OpenAI. 4/23 GPT-5.5 공식 출시 — 내부 코드명 'Spud', 3/24 프리트레이닝 완료 이후 약 4주 만의 배포로 그간 GPT-6 출시설을 덮고 '5.5' 명명 택했다. 소비자 3계층(GPT-5.5·GPT-5.5 Thinking·GPT-5.5 Pro)이 ChatGPT·Codex에 동시 활성, API는 '수일 내' 공개. 핵심 벤치마크는 Terminal-Bench 2.0 82.7%로 Claude Opus 4.7의 69.4%·Gemini 3.1 Pro 68.5%를 크게 앞서는 SOTA, SWE-Bench Pro 58.6%로 싱글패스 GitHub 이슈 해결 신고점, FrontierMath Tier1-3 51.7%(Opus 4.7 43.8%), GDPval 44개 직업 지식노동 84.9%. 4/16 Anthropic Opus 4.7·Claude 디자인 도구 공개 이후 떨어졌던 모멘텀을 에이전틱 코딩 영역에서 되찾는 구간, ChatGPT Plus/Pro/Business/Enterprise 즉시 롤아웃.", time: "2026-04-24 07:15 KST" },
      { type: "밸류에이션", sector: "Anthropic", detail: "Anthropic. 4/23 세컨더리 마켓 거래가 기준 $1조(1 trillion) 밸류 돌파, 사상 처음 OpenAI를 공식 추월하며 AI 분야 단독 1위 기업가치로 등극. 3월 $190B→4월 초 $800B→4/23 $1T로 6주 만에 +25% 급등, 10월 프라이머리 IPO 타겟은 $400~500B 구간이나 세컨더리 시장은 이미 훨씬 상회 평가. 배경에는 ①4월 연환산 매출 $300억 돌파로 OpenAI($250억) 추월 ②$1M+ 엔터 고객 1,000+ 돌파 ③Amazon $25B 추가 투자 확정 ④$1조 TPU 3.5GW·AWS $100B 10년 컴퓨트 파이프라인이 결합. Goldman·JPM·Morgan Stanley 공동 주관 IPO 경쟁 심화.", time: "2026-04-24 07:15 KST" },
      { type: "제품 출시", sector: "OpenAI", detail: "OpenAI. 4/23 동시에 로컬 실행형 오픈웨이트 PII 탐지·리댁션 모델을 공개 배포 — 사용자 기기 내에서 개인정보 식별정보를 마스킹 후 외부 전송하는 구조로, 엔터프라이즈·거번먼트 사용자의 데이터 주권 우려를 차단. GPT-5.5 본체 출시와 함께 '사이버 보안·PII·바이오'로 확장한 Trusted Access 제품군 라인업을 주간 단위로 연속 공개 중.", time: "2026-04-24 07:15 KST" },
    ]
  },
  {
    date: "2026-04-23 19:15 KST",
    summary: "SpaceX, Cursor 모회사 Anysphere 하반기 $60B 인수 옵션 체결·불발 시 $10B 브레이크업·Anthropic IPO 앞두고 컴퓨트·브랜드 성장통 부각",
    changes: [
      { type: "인수", sector: "xAI", detail: "xAI/SpaceX. 4/21~22 SpaceX가 Cursor 모회사 Anysphere에 하반기 내 $60B에 전량 인수할 수 있는 옵션 권리 확보, 불발 시 양사 공동 작업 대가로 $10B를 지급하는 브레이크업 구조. SpaceX는 $1.75T 밸류·$75B 조달 IPO를 앞두고 클로징을 지연해 증권공시 리스크를 회피, 동시에 경쟁사의 역딜을 봉쇄했다. Microsoft도 사전에 Anysphere 인수를 타진했으나 SpaceX가 선점. 4/14 영입된 Milich·Ginsberg에 이어 옵션 행사 시 Anysphere 엔지니어·ARR·분포 채널을 xAI/SpaceX로 흡수, Colossus 2의 100만 H100 등가 슈퍼클러스터와 결합한 코딩 최강 모델 구축을 목표로 한다.", time: "2026-04-23 19:15 KST" },
      { type: "거버넌스", sector: "Anthropic", detail: "Anthropic. 4/23 Axios가 $800B 밸류 IPO 준비 중인 Anthropic의 성장통을 상세 보도. Opus 4.6 성능 저하 루머가 커지자 회사는 의도적 다운그레이드 없음을 재확인, 수요 폭증으로 유저 한도·주기적 아웃티지 발생 구간. Claude Code의 $20/월 Pro 플랜 배제를 일부 사용자가 발견·대규모 반발한 뒤 '소수 A/B 테스트'라고 해명. 동시에 OpenAI CRO Denise Dresser 내부 메모가 Anthropic을 '엘리트주의'로 공격하고 매출 런레이트 $10억 과대 계상 의혹을 제기, Altman은 팟캐스트에서 '공포 기반 마케팅'이라 비판하며 공방 고조. Google·Broadcom 3.5GW TPU와 AWS $100B 약정이 본격 가동되는 2027년 전까지 공급·브랜드 3중 압박 구간.", time: "2026-04-23 19:15 KST" },
      { type: "인프라", sector: "Microsoft", detail: "Microsoft. CNBC 4/22 보도에 따르면 Microsoft도 SpaceX에 앞서 Cursor(Anysphere) 인수를 진지하게 검토했으나 결국 SpaceX에 선점당한 것으로 확인. GitHub Copilot 생태계와 Cursor의 IDE 유저 베이스 결합을 노렸으나, SpaceX의 $60B 옵션 구조·$10B 브레이크업 규모에 가격을 맞추지 못한 것으로 보인다. Mustafa Suleyman이 이미 '현 프론티어 모델 자체 개발 역량 부족'을 공개 인정한 상태에서 차세대 개발자 툴 경쟁에서 xAI/SpaceX에 밀리는 신호로 해석된다.", time: "2026-04-23 19:15 KST" },
    ]
  },
  {
    date: "2026-04-23 07:05 KST",
    summary: "Google Cloud Next 4/22 키노트 — Gemini Enterprise 통합·Workspace Studio·TPU 8t/8i·Apple 파운데이션 모델 파트너십 공식화·Nvidia Vast Data $30B 3배 밸류",
    changes: [
      { type: "제품 출시", sector: "Google DeepMind", detail: "Google DeepMind. 4/22 Cloud Next 키노트 Sundar Pichai·Thomas Kurian 공동 발표. Vertex AI를 'Gemini Enterprise Agent Platform'으로 리브랜딩, Agentspace를 흡수해 단일 Gemini Enterprise 제품으로 통합. Gemini 3.2 공식 발표 임박으로 100만 토큰 이상 컨텍스트 확장·인퍼런스 지연 감소 예고. Workspace Studio는 Gmail·Docs·Sheets·Drive·Meet·Chat 전반을 노코드 자연어 프롬프트로 에이전트화. Agent Designer 프리뷰, Agent Engine Sessions·Memory Bank GA로 지속 컨텍스트 운영. GE Appliances·Deutsche Bank 등 2,000곳 엔터프라이즈 도입 사례 공개.", time: "2026-04-23 07:05 KST" },
      { type: "인프라", sector: "Google DeepMind", detail: "Google DeepMind. 4/22 8세대 TPU 발표 — 트레이닝 전용 TPU 8t와 인퍼런스 전용 TPU 8i로 목적별 분리. 동시에 NVIDIA 기반 시스템이 Google Cloud에서 더 효율적으로 작동하도록 네트워킹 공동 엔지니어링 협업 병행해 '경쟁과 협력' 기조. Anthropic 3.5GW TPU 딜·Apple Foundation Models 트레이닝 수요가 뒷받침, 자사 칩만으로 하이퍼스케일 AI 수요를 감당하지 못하는 현실 반영.", time: "2026-04-23 07:05 KST" },
      { type: "전략", sector: "Apple", detail: "Apple. 4/22 Google Cloud Next 현장에서 Apple·Google 파트너십 격상 공식 확인 — Apple이 Google을 선호 클라우드 파트너로 선정, 차세대 Apple Foundation Models를 Gemini 기술 기반으로 공동 개발하기로 합의. 해당 모델이 2026 하반기 퍼스널라이즈드 Siri를 구동. 9/1 John Ternus CEO 취임 일정과 맞물려 AI 전략 재편 현실화, 자체 프론티어 LLM 부재 리스크를 Gemini 기반 공동 개발로 메우는 구조.", time: "2026-04-23 07:05 KST" },
      { type: "펀딩", sector: "NVIDIA", detail: "NVIDIA. 4/22 Nvidia가 투자한 Vast Data가 신규 라운드 $1B 조달, 밸류 $30B로 3배 상향. Drive Capital·Access Industries 주도, 기존 Nvidia·Fidelity·NEA 참여. Vast Data는 AI 트레이닝·추론 워크로드용 고성능 스토리지 소프트웨어 공급사로 Stargate·Anthropic·Meta MSL 등 하이퍼스케일 AI 프로젝트의 데이터 레이크 핵심 계약을 다수 보유. NVDA는 같은 날 주가 $200~201대 박스권, 4/14 Ising 공개·10거래일 연속 상승 이후 조정.", time: "2026-04-23 07:05 KST" },
    ]
  },
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
