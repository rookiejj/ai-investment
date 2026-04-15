// US Stocks Atlas - Update Log
// 종목 교체·수치 갱신 등 데이터 변경 이력.

const updates = [
  {
    date: "2026-04-15 12:40 KST",
    summary: "Oracle·NVIDIA·Lilly·Tesla rs 갱신 — Stargate 확장·Rubin 대형 수주·Foundayo 출시·Q1 인도 하회",
    changes: [
      { type: "종목 정보 갱신", sector: "AI 플랫폼",
        detail: "Oracle(ORCL) rs 갱신. FY26 Q3 실적(2월 말 종료) 기준 RPO $523B → $553B(YoY +325%), OCI 매출 $4.9B(YoY +84%)로 가속. Stargate 프로젝트는 Abilene 1.2GW 가동 중이며 전체 계획 용량 7GW로 확대, 누적 투자 $400B 수준." },
      { type: "종목 정보 갱신", sector: "반도체",
        detail: "NVIDIA(NVDA) rs 갱신. Blackwell Ultra 풀가동·수요 폭증 지속, 4/9 Meta–CoreWeave와 Vera Rubin 기반 클러스터 조기 용량 확보 계약($21B) 확인. Blackwell+Rubin 누적 판매 $1T 전망(~2027)." },
      { type: "종목 정보 갱신", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY) rs 갱신. 경구 GLP-1 Foundayo(orforglipron) 4/1 FDA 승인·4/9 시장 출시(최저가 $149/월, 개인보험/저축카드로 월 $25 수준). Mounjaro 2025 매출 약 $23B, Zepbound와 합산 GLP-1 매출 $36B. 7/1 Medicare Part D GLP-1 커버리지 확대가 추가 촉매." },
      { type: "종목 정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA) rs 갱신. Q1 2026 글로벌 인도 약 336K(컨센서스 370K 하회), 생산-인도 갭 약 50K 발생. CyberCab 신공법 기반 Q4 2026 양산 시작 계획($25K 엔트리, Fremont 인접 신공장), 4/22 어닝콜 예정." },
    ]
  },
  {
    date: "2026-04-15 10:46 KST",
    summary: "JPMorgan Q1 2026 실적 추가 반영(매출 50.5B로 상향, 트레이딩 부문 사상 최고)",
    changes: [
      { type: "종목 정보 갱신", sector: "금융·은행",
        detail: "JPMorgan(JPM) Q1 2026 최종 발표 반영. 순매출 $50.5B(YoY +8%, 컨센 상회), 순익 $16.5B, 트레이딩 부문 매출 $11.6B로 분기 사상 최고(YoY +20%). FICC·주식 모두 컨센 상회. 다만 NII 풀이어 가이던스를 $103B로 소폭 하향 조정해 주가는 시간외 -1%. FY26E 컨센서스 매출 $192B → $193B, 순익 $56B → $58B 추가 상향." },
    ]
  },
  {
    date: "2026-04-14 20:35 KST",
    summary: "Wells Fargo Q1 2026 실적 반영",
    changes: [
      { type: "종목 정보 갱신", sector: "금융·은행",
        detail: "Wells Fargo(WFC) Q1 2026 실적 반영. 순매출 $21.45B(YoY +6%, 컨센 $21.76B 소폭 하회), 조정 EPS $1.60(컨센 $1.58 상회). 순이자수익 $12.1B(+5%), 비이자수익 $9.35B(+8%), 평균 대출 $996B(+10%), 평균 예금 $1.42T(+6%), ROE 12.2%로 전년 11.5%에서 개선. CEO Scharf '투자 결실' 코멘트. FY26E 컨센서스 매출 $87B → $88B, 순익 $21B → $22B 소폭 상향." },
    ]
  },
  {
    date: "2026-04-14 14:25 KST",
    summary: "JPMorgan Q1 2026 실적 반영",
    changes: [
      { type: "종목 정보 갱신", sector: "금융·은행",
        detail: "JPMorgan(JPM) Q1 2026 실적 반영. 순매출 $49.2B(YoY +8%), 순익 $16B, EPS $5.42(컨센서스 $5.15 상회). 투자은행·NII 동반 성장, 주가 사상 최고($248.50, +4.2%). Jamie Dimon 후계자 선정 공식화." },
    ]
  },
  {
    date: "2026-04-14 14:12 KST",
    summary: "Goldman Sachs Q1 2026 실적 반영, FY26E 컨센서스 상향",
    changes: [
      { type: "상향", sector: "금융·은행",
        detail: "Goldman Sachs(GS) Q1 2026 실적 반영. 순매출 $17.23B(YoY +14%, 역대 2위), 순익 $5.63B(YoY +19%), EPS $17.55(컨센서스 $16.47 상회). 주식트레이딩 $5.33B 사상 최고(+27%), IB수수료 $2.84B(+48%), M&A 어드바이저리 글로벌 1위. FY26E 컨센서스 매출 $60B → $63B, 순익 $16B → $18B." },
    ]
  },
  {
    date: "2026-04-13 12:30 KST",
    summary: "카테고리당 6→7종목 확장, 18개 카테고리 신규 종목 편입 (총 126종목)",
    changes: [
      { type: "종목 추가", sector: "AI 플랫폼", detail: "ServiceNow(NOW) 편입. IT워크플로우 자동화·에이전트 AI 플랫폼. FY25 매출 $11B, FY26E $13B." },
      { type: "종목 추가", sector: "반도체", detail: "AMD(AMD) 편입. MI350 GPU·데이터센터·AI PC. FY25 매출 $26B, FY26E $32B." },
      { type: "종목 추가", sector: "데이터센터", detail: "HP Enterprise(HPE) 편입. AI 서버·GreenLake 하이브리드 클라우드. FY25 매출 $33B, FY26E $38B." },
      { type: "종목 추가", sector: "냉각 시스템", detail: "Generac(GNRC) 편입. 발전기·에너지 스토리지·DC 백업 전력." },
      { type: "종목 추가", sector: "물·수자원", detail: "Essential Utilities(WTRG) 편입. 수도·가스 유틸리티." },
      { type: "종목 추가", sector: "전력·그리드", detail: "AMETEK(AME) 편입. 전자계측·전력 장비." },
      { type: "종목 추가", sector: "원자력·SMR", detail: "Talen Energy(TLN) 편입. 원전+가스 발전·데이터센터 PPA." },
      { type: "종목 추가", sector: "바이오·헬스케어", detail: "AbbVie(ABBV) 편입. Skyrizi·Rinvoq 면역·종양. FY25 매출 $56B, FY26E $62B." },
      { type: "종목 추가", sector: "에너지", detail: "EOG Resources(EOG) 편입. 셰일 E&P 고효율." },
      { type: "종목 추가", sector: "친환경·청정기술", detail: "Sunrun(RUN) 편입. 미국 주택용 태양광·ESS 1위." },
      { type: "종목 추가", sector: "자동차·모빌리티", detail: "Ford(F) 편입. F-150·EV 전환·상용차." },
      { type: "종목 추가", sector: "항공우주·방산", detail: "L3Harris(LHX) 편입. 전자전·ISR·위성통신." },
      { type: "종목 추가", sector: "양자·크립토", detail: "Riot Platforms(RIOT) 편입. BTC 채굴·인프라." },
      { type: "종목 추가", sector: "사이버보안", detail: "Okta(OKTA) 편입. ID 보안·제로트러스트." },
      { type: "종목 추가", sector: "핀테크·결제", detail: "Global Payments(GPN) 편입. 가맹점 결제 솔루션." },
      { type: "종목 추가", sector: "금융·은행", detail: "Wells Fargo(WFC) 편입. 미국 3대 소매은행." },
      { type: "종목 추가", sector: "로봇·자동화", detail: "UiPath(PATH) 편입. RPA·AI 자동화 플랫폼." },
      { type: "종목 추가", sector: "소비·리테일", detail: "Starbucks(SBUX) 편입. 글로벌 커피 체인 1위." },
    ]
  },
  {
    date: "2026-04-13 10:05 KST",
    summary: "TSMC Q1 사상 최대 실적 반영",
    changes: [
      { type: "종목 정보 갱신", sector: "반도체",
        detail: "TSMC(TSM) rs 갱신. Q1 2026 매출 $35.6B(NT$1.13T), YoY +35%, 가이던스 상단 적중. 3월 단월 +45.2%로 가장 강한 성장. AI칩 수요가 성장 전량 견인. 4/16 실적 콘퍼런스콜에서 연간 가이던스 상향 기대." },
    ]
  },
  {
    date: "2026-04-13 02:26 KST",
    summary: "종목 정보 갱신 3건 (AMZN·GS·NVO)",
    changes: [
      { type: "종목 정보 갱신", sector: "소비·리테일",
        detail: "Amazon(AMZN) rs 갱신. CEO Jassy 4/9 주주서한 — Trainium 칩 사업 연환산 매출 $20B 돌파, Trainium2 전량 소진·Trainium3도 거의 완판, 서드파티 랙 판매 검토 시사." },
      { type: "종목 정보 갱신", sector: "금융·은행",
        detail: "Goldman Sachs(GS) rs 갱신. Q1 2026 IB 백로그 4년 최고, 어드바이저리+언더라이팅 수수료 $2.42B(+26% YoY) 예상. 4/13 실적 발표 예정." },
      { type: "종목 정보 갱신", sector: "바이오·헬스케어",
        detail: "Novo Nordisk(NVO) rs 갱신. Wegovy 경구제 1월 출시($149/월), 주 5만건 처방. 단 Q4 매출 YoY -7.6%, 9,000명 감원으로 구조조정 병행." },
    ]
  },
  {
    date: "2026-04-13 01:30 KST",
    summary: "PLUG 제외·BE 편입, 종목 정보 갱신 8건",
    changes: [
      { type: "종목 교체", sector: "친환경·청정기술",
        detail: "Plug Power(PLUG) 제외 → Bloom Energy(BE) 편입. DOE $1.66B 대출 관련 증권 사기 집단소송(2026-02 제기), 2023년 SEC 재무보고 위반 과징금 이력. 주가 $1.80 수준, 애널리스트 컨센서스 하향." },
      { type: "종목 정보 갱신", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY) rs 갱신. FDA, 경구 GLP-1 Foundayo(orforglipron) 4/1 승인. 기존 Zepbound 대신 Foundayo 반영." },
      { type: "종목 정보 갱신", sector: "사이버보안",
        detail: "Palo Alto(PANW) CyberArk $25B 인수 완료(2/11) 반영. FY26E 매출 $10.5B → $11B(CyberArk 5개월분 기여)." },
      { type: "종목 정보 갱신", sector: "양자·크립토",
        detail: "MicroStrategy → Strategy Inc 사명 변경 반영. BTC 보유량 76.7만개(4/6 기준)." },
      { type: "상향", sector: "AI 플랫폼",
        detail: "Meta(META) FY26E 매출 $230B → $235B, 순익 $68B → $72B. Q1 2026 가이던스 $53.5~56.5B로 컨센서스 $51.3B 상회." },
      { type: "종목 정보 갱신", sector: "데이터센터",
        detail: "CoreWeave(CRWV) 백로그 $66.8B(전년 대비 300%↑) 반영. FY26 가이던스 $12~13B 유지." },
      { type: "종목 정보 갱신", sector: "자동차·모빌리티",
        detail: "Rivian(RIVN) R2 양산 개시, 4월 직원 인도 시작. FY26 인도 가이던스 62~67K대 재확인." },
      { type: "종목 정보 갱신", sector: "항공우주·방산",
        detail: "Rocket Lab(RKLB) $474M 유상증자 완료(4/8). SDA $1.3B 위성 계약, HASTE $190M 극초음속 시험 수주." },
    ]
  },
  {
    date: "2026-04-12 23:00 KST",
    summary: "FY25 확정 실적 반영 및 FY26E 컨센서스 전면 갱신",
    changes: [
      { type: "종목 교체", sector: "로봇·자동화",
        detail: "Symbotic(SYM) 제외 → Cognex(CGNX) 편입. SEC 내부고발자 방해 조사 진행 중, 중대 취약점 및 부적정 감사의견 확인." },
      { type: "상향", sector: "반도체",
        detail: "Broadcom(AVGO) FY26E 매출 $78B → $88B. AI 반도체 백로그 $73B, AI 매출 YoY 150%+ 성장 전망." },
      { type: "상향", sector: "반도체",
        detail: "Micron(MU) FY26E 매출 $75B → $79B. HBM4 양산 개시, 2026년 HBM 전량 완판 확정." },
      { type: "상향", sector: "반도체",
        detail: "NVIDIA(NVDA) FY27E 매출 $335B → $337B. Blackwell 풀가동, Rubin 로드맵 확인." },
      { type: "상향", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY) FY25 매출 $63.5B → $65B(확정). FY26E $78B → $81B. 경구 GLP-1(Orforglipron) Q2 FDA 승인 기대." },
      { type: "상향", sector: "사이버보안",
        detail: "CrowdStrike(CRWD) FY26 매출 $3.9B → $4.8B(확정). FY27E $5.8B. Falcon 플랫폼 ARR 5년 CAGR 41%." },
      { type: "상향", sector: "데이터센터",
        detail: "Arista(ANET) FY25 매출 $8.5B → $9.0B(확정). AI 클러스터 스위칭 수요 지속, FY26E $11B." },
      { type: "상향", sector: "AI 플랫폼",
        detail: "Salesforce(CRM) FY26 매출 $38B → $42B(확정). Agentforce ARR $800M 돌파. FY27E $46B." },
      { type: "상향", sector: "항공우주·방산",
        detail: "Boeing(BA) FY25 순익 $1.8B → $2.2B(흑자 전환 확정). 2026년 인도 700대 이상 목표." },
      { type: "상향", sector: "항공우주·방산",
        detail: "Rocket Lab(RKLB) FY25 매출 $0.55B → $0.60B(확정). 수주잔고 $1.85B, Neutron 개발 진행 중." },
      { type: "하향", sector: "바이오·헬스케어",
        detail: "Novo Nordisk(NVO) FY26E 매출 $53B → $43B. MFN 가격 협상, 세마글루타이드 독점권 상실(캐나다·브라질·중국), 경쟁 심화로 -5~-13% 역성장 가이던스." },
      { type: "하향", sector: "에너지",
        detail: "Chevron(CVX) FY25 매출 $195B → $189B, 순익 $18B → $12B(확정). 유가 하락·화학 마진 축소. 기록적 생산량(3,723 MBOED)에도 수익성 악화." },
      { type: "하향", sector: "원자력·SMR",
        detail: "Constellation(CEG) FY26E 매출 $35B → $30B. Calpine 통합 후 가이던스가 시장 기대치 하회." },
      { type: "하향", sector: "AI 플랫폼",
        detail: "Oracle(ORCL) FY26E 매출 $72B → $68B. RPO $523B 대비 매출 전환 속도 현실적 조정." },
      { type: "하향", sector: "자동차·모빌리티",
        detail: "Rivian(RIVN) FY25 매출 $5.5B → $4.5B(확정). R2 출시 예정이나 미국 판매 부진(-26%)." },
      { type: "수치 갱신", sector: "냉각 시스템",
        detail: "Vertiv(VRT) FY25 순익 $1.3B → $1.5B(확정). FY26E 순익 $2.3B. 백로그 $15B." },
      { type: "수치 갱신", sector: "전력·그리드",
        detail: "GE Vernova(GEV) FY26E 매출 $44.5B → $45B. 회사 가이던스 $44~$45B 반영." },
    ]
  },
  {
    date: "2026-04-12 15:00 KST",
    summary: "18 카테고리 108 종목 체제 확립, FY25 실적 대규모 반영",
    changes: [
      { type: "수치 갱신", sector: "전체",
        detail: "FY25 실적 확정분 일괄 반영: MSFT·GOOGL·META·AMZN·XOM·TSLA·BA·AVGO·TSM·LLY·JPM·V·MA·WMT·COST." },
      { type: "상향", sector: "반도체",
        detail: "NVIDIA(NVDA) FY27E 컨센서스 상향(매출 $335B / 순익 $190B). Micron(MU) HBM 슈퍼사이클 반영($75B)." },
      { type: "상향", sector: "AI 플랫폼",
        detail: "Palantir(PLTR) 2026 가이던스 $7.2B 반영. 미 상업 매출 YoY 137% 성장." },
      { type: "상향", sector: "원자력·SMR",
        detail: "Constellation(CEG) Calpine $16.4B 인수 완료(1월). 매출·순익 대폭 상향." },
      { type: "상향", sector: "냉각·전력·데이터센터",
        detail: "Vertiv(VRT)·GE Vernova(GEV)·CoreWeave(CRWV) 수치 상향." },
    ]
  },
  {
    date: "2026-03-15",
    summary: "5개 신규 카테고리 추가, 총 18 카테고리 108 종목",
    changes: [
      { type: "카테고리 추가", sector: "신규 5개",
        detail: "사이버보안, 핀테크·결제, 금융·은행, 로봇·자동화, 소비·리테일 카테고리 신설. 30종목 추가." },
    ]
  },
];
