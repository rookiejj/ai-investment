// US Stocks Atlas - Update Log
// 종목 교체·수치 갱신 등 데이터 변경 이력.

const updates = [
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
