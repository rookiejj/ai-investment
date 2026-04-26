// Global ETF Atlas - Update Log
const updates = [
  {
    date: "2026-04-26 13:20 KST",
    summary: "트럼프 4/25 美 협상단 파키스탄行 막판 취소·美·이란 직접 회담 무산·이란 봉쇄 해제 선결조건 거부·전화 협상 전환·XLE 월요일 4/27 갭업 압력·IBIT 주말 $77.5K 박스 유지",
    changes: [
      { type: "정보 갱신", sector: "에너지·원자력",
        detail: "XLE·VDE·XOP. 4/25 트럼프가 Witkoff·Kushner의 파키스탄 출장을 막판 취소해 美·이란 직접 회담이 시작 전에 무산. 이란 외무장관이 이슬라마바드를 떠난 약 1시간 뒤 백악관 결정, 트럼프는 '이란이 많이 양보했지만 충분치 않다·앞으로는 전화로 협상'이라고 밝혔다. 결렬의 핵심은 이란이 '美 해상 봉쇄 해제'를 선결조건으로 요구한 반면 트럼프가 그대로 거부한 것. 4/24 Brent $105.33·WTI $94.40 주간 +17%·+14%에서 멈춘 것은 회담 재개 기대가 일부 선반영됐던 결과였던 만큼 월요일 4/27 시장 개장 시 XLE·VDE·XOP 갭업 압력 우세. 호르무즈 13Mbpd 디스럽션이 한 달 더 연장될 개연성 높아져 에너지 ETF 모멘텀 연장 시나리오.", time: "2026-04-26 13:20 KST" },
      { type: "정보 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC 주말 $77,508 부근 횡보로 $77~78K 좁은 박스 유지. 미·이란 회담 무산이라는 명백한 리스크오프 트리거에도 IBIT·FBTC 등 현물 BTC ETF로의 자금 유입(주간 $1.4B)이 안정판 역할, BTC와 달러 인덱스의 30일 상관계수가 -0.91로 4년 만의 최강 음의 상관 기록 — 시장이 점점 BTC를 'USD 인플레 헤지' 자산으로 매기는 신호. 다음 주 메가캡 실적 슈퍼위크와 결합해 $80K 재돌파 시도 결판날 전망.", time: "2026-04-26 13:20 KST" },
    ]
  },
  {
    date: "2026-04-25 07:10 KST",
    summary: "SPY 7,165.08 +0.80%·QQQ Nasdaq 24,836.60 +1.63% 기록 신고가 마감·반도체 18일 연속 상승·INTC +23.6%·Alphabet Anthropic $40B·Brent $106 주간 +18%·BTC $79K 반등",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. 4/24 S&P 500 7,165.08 +0.80%·Nasdaq 24,836.60 +1.63%·다우 49,493.19 +0.37% 전 지수 기록 신고가 마감. Intel +23.6% $82.55 사상 최고와 반도체 18일 연속 상승(2000년 이후 최장)이 지수 주도, NVDA 시총 $5T 재탈환·AMD +12%(Stifel $320)·Alphabet $40B Anthropic 투자 공식화가 메가캡·AI 플랫폼 재평가 촉매. 4월 소비자심리 사상 최저·중동發 유가 쇼크 속에서도 실적·가이던스 상향이 상단 재확인. 4/29 GOOGL, 5월 초 AAPL·META·AMZN Big4 실적 대기.", time: "2026-04-25 07:10 KST" },
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH·SOXX·AIQ. 4/24 Intel Q1 AI 수혜 비트(DC +22%·EPS $0.29)가 정규장 +23.6%로 확정되며 반도체 섹터 18일 연속 상승. NVIDIA $5T·AMD +12% 동반 랠리에 Micron·ASML·Lam Research까지 대형주 전방위 강세, AIQ·BOTZ는 Alphabet $40B Anthropic 투자·TPU 5GW 전담 공급 공식화로 AI 인프라 수요 확실성 재확인. INTC는 본 데이터셋에 미포함이나 섹터 모멘텀 신호로 활용.", time: "2026-04-25 07:10 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·VDE·XOP. Brent $106 돌파·WTI $97 돌파로 주간 +18% 급등, 트럼프가 Jones Act 90일 연장(8월 중순까지)에도 호르무즈 봉쇄는 해소되지 않아 글로벌 원유·제품 13Mbpd 디스럽션 구간 유지. 미 해군 기뢰선 사살 명령 등 지정학 긴장 재점화로 XOM·CVX·COP 마진 확대 분기 연장, LNG는 아시아 재라우팅 수혜 확대. SLB는 Q1 매출 $8.72B로 컨센 소폭 비트 — 다만 중동 디스럽션 영향 -346bp EBITDA 마진 축소 확인.", time: "2026-04-25 07:10 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC 4/24 장중 $79K 부근까지 반등, 주간 기준 Strategy(MSTR) +25%대 상승으로 대형 디지털자산주 랠리 주도. 리스크온 재개(반도체 18일 랠리·Alphabet $40B·INTC 최고가)와 추가 매수 기대가 동시 작동, Fear&Greed 지수는 중립(46)→탐욕(54) 구간 진입해 $80K 재돌파 근접. Strategy 815,061 BTC 보유는 BlackRock IBIT 802,823 BTC 추월 지위 유지.", time: "2026-04-25 07:10 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. 4/24 코스피는 보합(6,475.63)이지만 삼성전자 +3.22%·SK하이닉스 장중 126.7만원 사상 최고가 기록 후 +0.16% 마감으로 반도체 2강 반등. KB증권은 두산에너빌리티 목표가 13.5만→14.8만원으로 상향하며 SMR 모멘텀 점화, 미 차세대 원전 인·허가 Part 53이 4/29 시행 예정. 외국인은 코스피 1.95조원 순매도하며 선별적 태도를 유지했으나 개인·기관이 2조원대 순매수로 방어. EWY ETF 관점에서 AI 메모리+SMR+조선 3대 K-테마가 동시 재점화 구간.", time: "2026-04-25 07:10 KST" },
    ]
  },
  {
    date: "2026-04-24 19:35 KST",
    summary: "Brent $105.73·WTI $96.17 4/24 추가 상승으로 호르무즈 봉쇄 가격 반영·물리 현물 $150 수렴·EWY 코스닥 1,203.84 +2.51% 25년 8개월만 1200선 돌파·BTC $77.7K 횡보·SLB 7:00 ET Q1 실적 발표 임박",
    changes: [
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·VDE·XOP. 4/24 Brent $105.73 +0.63%·WTI $96.17 +0.32% 추가 상승으로 호르무즈 봉쇄 장기화가 가격 곡선에 본격 반영. 트럼프 휴전 연장에도 통항이 일평균 3척 수준에서 정체, 4/22 이란 상선 2척 나포 이후 미·이란 협상 진전 부재. IEA April 2026 보고서는 물리 현물(physical)이 $150/bbl로 수렴 중이라 명시 — 선물·현물 괴리 확대로 트레이딩 마진 우호. 4/25 OPEC+ 화상회의 가이던스 톤이 주말 섹터 방향 결정.", time: "2026-04-24 19:35 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. 코스피는 6,475.63 -0.18p로 보합 마감했으나 코스닥이 +29.53p(+2.51%) 폭등한 1,203.84로 닷컴버블 정점이던 2000년 8월 이후 25년 8개월만 종가 기준 1200선 회복. 외국인 7,322억·기관 1,875억 동반 순매수로 지수 견인, 알테오젠·삼천당제약·펩트론 등 시총 상위 바이오와 이차전지·로봇 성장주 일제 강세. 기아 Q1 영업이익 2.21조 -26.7%·관세 7,500억 직격에도 연간 가이던스 10.2조 유지가 자동차 섹터 방어, AI 메모리 2강이 차익실현 사이 코스닥 주도주 교체 흐름.", time: "2026-04-24 19:35 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. 4/24 BTC $77,736 부근 횡보, 24시간 거래대금 $16.9B로 전일 대비 안정. 트럼프-이란 협상 정체와 미 증시 4/23 조정으로 $80K 재돌파 단기 정체 구간이지만 글로벌 크립토 펀드 주간 유입 $1.4B로 기관 자금은 둔화 없음. Strategy 815,061 BTC 평단 $74,395 약 27억 달러 평가익, BlackRock IBIT 802,823 BTC 추월 세계 최대 기관 보유 지위 유지.", time: "2026-04-24 19:35 KST" },
    ]
  },
  {
    date: "2026-04-24 13:35 KST",
    summary: "GEV Q1 매출·가이던스 상향 프리장 +8%로 PAVE·XLE 간접 상승 촉매·EWY는 현대차 OP -30.8%·삼성전자 -1.56%로 모멘텀 숨고르기·OPEC+ 4/25 화상회의 임박·PG·SLB 장전 실적",
    changes: [
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·VDE. GE Vernova Q1 데이터센터 주문 $2.4B로 2025 연간 합계 초과·2026 가이던스 상향이 AI 전력 수요의 실체화를 다시 확증하면서 가스·LNG 광역 수요 전망 상향. Brent $101대 4일 연속 강세·호르무즈 봉쇄 2/28 이후 사실상 단절·생산 중단 3월 7.5mb/d→4월 9.1mb/d 피크로 확대 구간. 4/25 OPEC+ 화상회의에서 증산 여부·감산 연장 판단이 주말 에너지 섹터 방향 결정, 4/24 장전 SLB Q1 컨센 EPS $0.52·매출 $8.65B(-29.2% YoY) 톤이 서비스 섹터 리레이팅 트리거.", time: "2026-04-24 13:35 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. KOSPI 6,477.71 3일 연속 신고가 이후 숨고르기, 현대차 Q1 영업이익 2.5147조 -30.8% 컨센 1,800억 미스와 삼성전자 -1.56% 차익실현이 단기 모멘텀을 둔화. 다만 SK하이닉스 Q1 영업이익률 72% 3년 만의 TSMC 초과·한화에어로 Northrop AReS MOA 등 구조적 모멘텀은 유효. 외국인 3,003억원 순매도 속 개인·기관 4,200억 순매수로 지수 방어, 4/24 오후 기아 Q1 공시가 추가 방향성 결정.", time: "2026-04-24 13:35 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. GE Vernova가 Q1 AI 전력 수요 실체화로 프리마켓 +8% 점프해 섹터 리스크 온 회복 신호, Tesla는 정규장 -3.59%·YTD -17%로 매도 지속. Boeing이 카타르 $200B 역대 최대 수주+Q1 비트로 +5.5% 상승하며 방산·항공 버팀목 역할. 4/24 장전 PG·SLB·CMCSA·NSC 실적과 University of Michigan 소비자심리지수 확정치가 금요 마지노선, 다음 주 GOOGL·AAPL·META·AMZN Big4 실적 본격 진입.", time: "2026-04-24 13:35 KST" },
    ]
  },
  {
    date: "2026-04-24 07:20 KST",
    summary: "SPY 7,108.40 -0.41%·QQQ -0.89% 기록고 조정·LMT -6.3%·NOW -18%·IBM -8%·INTC AH +19%·OpenAI GPT-5.5 출시·한화 방산 미 파트너십·BTC $77.5K 되돌림",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. 4/23 S&P 500 7,108.40 -0.41%·Nasdaq 24,438.50 -0.89%·다우 49,310.32 -0.36%로 직전일 기록 신고가에서 되돌림. 소프트웨어 섹터 폭락이 주 원인 — IBM -8%·NOW -18% 급락이 Nasdaq 낙폭 상당 기여, LMT도 Q1 EPS·매출 미스에 -6.3%. 반면 장후 INTC +19%(DC+AI 매출 +22%·Q1 EPS $0.29), TXN +16%(데이터센터 매출 YoY +90%·BofA 등급 Buy 상향)가 반도체 랠리 복원. S&P 500 중 87개 보고 기준 EPS 비트율 81%·매출 비트율 76%로 실적 펀더 양호, 4/29 GOOGL 컨센 EPS $2.68·매출 $106.88B 대기.", time: "2026-04-24 07:20 KST" },
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH·SOXX·AIQ. OpenAI가 4/23 GPT-5.5('Spud') 공식 출시하며 Terminal-Bench 2.0 82.7%로 Opus 4.7(69.4%)·Gemini 3.1 Pro(68.5%) 추월 SOTA 달성, 에이전틱 코딩 리더십 탈환으로 AI 플랫폼 투자 모멘텀 재확산. INTC Q1 서프라이즈와 TXN 데이터센터 +90% 모멘텀이 반도체 광역 수혜, 4/30 삼성전자·NVDA Q1 가이던스 주목.", time: "2026-04-24 07:20 KST" },
      { type: "수치 갱신", sector: "방산·보안",
        detail: "ITA·PPA·XAR·SHLD. 한화에어로스페이스가 Sea-Air-Space 2026에서 Northrop Grumman과 AReS 장거리미사일용 1단 고체 부스터 MOA 체결, 한화오션·한화시스템은 Leidos·Gibbs&Cox와 미 해군 함정 설계 협력 체결. LMT Q1 미스 -6.3%에도 K방산의 미 방산 생태계 직접 편입 모멘텀으로 글로벌 방산 ETF는 상대 강세 흐름 유지, SHLD YTD +19% 레벨에서 상단 시험.", time: "2026-04-24 07:20 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC는 4/23 $77.8K → 4/24 $77.5K로 -$385 소폭 되돌림, Fear&Greed 46 중립화. Strategy 815,061 BTC 기준 약 28억 달러 평가익 유지하며 IBIT 802,823 BTC 대비 세계 최대 기관 보유자 지위 고수. 주간 +4%대 유지 구간이지만 미 증시 조정·트럼프-이란 긴장이 $80K 재돌파의 단기 저항.", time: "2026-04-24 07:20 KST" },
    ]
  },
  {
    date: "2026-04-23 19:15 KST",
    summary: "KOSPI 종가 6,475.81 +0.9% 3일 연속 신고점·장중 6,557.76으로 첫 6,500 돌파·현대차 Q1 영업익 -30.8% 컨센 미스·TSLA 컨콜 CAPEX 가이던스 $20B→$25B 상향·Brent $101.55 재상승",
    changes: [
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. KOSPI가 4/23 종가 6,475.81 +0.9%로 3거래일 연속 사상 신고점, 장중 6,557.76을 기록하며 6,500선을 처음 돌파. SK하이닉스 Q1 영업이익 37.61조·영업이익률 72% 사상 최대가 동북아 리스크온을 견인했지만, 시장 일부 기대치였던 '40조 클럽' 미달에 장 초반 +3.6% → -0.9% 반락. 현대차 Q1 영업익 -30.8% YoY로 컨센 미스가 자동차 섹터 매수세 약화. 일본 닛케이 동반 신고가로 EWY·EWJ 동반 강세, EWY는 YTD +55% 부근 유지.", time: "2026-04-23 19:15 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. 4/22 TSLA Q1 컨콜에서 2026 풀해 CAPEX 가이던스를 $20B → $25B로 $5B 상향하고 Musk가 현 FSD 하드웨어의 완전 무인 운영 능력 부족을 인정, 장 직후 +4% 반등이 -0.3%까지 되돌려졌다. 4/23 22:30 KST 장전 LMT Q1(컨센 EPS $6.73·매출 $18.24B)과 장후 Intel Q1(컨센 EPS $0.02·매출 $12.42B·옵션 ±10%) 대기. SpaceX-Cursor $60B 옵션 딜이 AI 코딩·소프트웨어 재평가 재료로 QQQ에 잠재 변수.", time: "2026-04-23 19:15 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. Brent $101.55 근방 유지·WTI $92 선 방어, 이란 호르무즈 상선 2척 나포 사태 이후 재상승 구간에서 횡보. 4/25 OPEC+ 화상회의에서 증산 가속 여부가 다음 변수, 감산 유지 시 $105 재터치 가능. 반대로 이란 '통일 제안' 제출 시 지정학 프리미엄 일부 해소 시나리오. XLE는 월간 +9% YTD 리더 자리 유지.", time: "2026-04-23 19:15 KST" },
    ]
  },
  {
    date: "2026-04-23 13:11 KST",
    summary: "이란 호르무즈 선박 2척 나포·Brent $101.91 +3%·WTI $92.96 +3%·BTC $79K 돌파·SK하이닉스 Q1 OP 37.61조 사상 최대·KOSPI 신고점",
    changes: [
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. 4/22 이란이 호르무즈 해협에서 상선 2척을 나포하며 트럼프의 휴전 조건부 연장을 무력화, Brent 장중 $101.91 +3%·WTI $92.96 +3% 재급등. 해협 통항량은 극심한 저점 지속, 걸프 원유 수출 붕괴 구간 연장. XLE·XOP·VDE 에너지 ETF 재평가, LNG는 유럽 프리미엄·아시아 재라우팅 수혜 재점화.", time: "2026-04-23 13:11 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT. BTC가 4/22 $79,000 상회로 2월 이후 최고가, 24시간 +4.5%·주간 +5.7% 재가속. MSTR 4/22 +10% 추가 급등, 5거래일 누적 +25%. Strategy 총 815,061 BTC·평단 $74,395로 평가익 약 40억 달러 구간, BlackRock IBIT 802,823 BTC 상회 세계 최대 기관 보유 지위 공고화.", time: "2026-04-23 13:11 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. SK하이닉스 4/23 Q1 매출 52.58조·영업이익 37.61조 +405.5% YoY 사상 최대 서프라이즈, 영업이익률 72% 한국 대기업 역사상 최고. HBM3E·HBM4 AI 메모리 독점 공급이 견인, SK스퀘어 NAV 재평가 수혜. KOSPI 6,417.93 사상 최고 구간에서 AI 메모리 체인 주도주 교체 관전, EWY YTD +54%·1Y +150% 유지.", time: "2026-04-23 13:11 KST" },
    ]
  },
  {
    date: "2026-04-23 07:05 KST",
    summary: "S&P 500·Nasdaq 동반 기록 신고가·TSLA·BA 실적 비트·Google Cloud Next Gemini Enterprise·TPU 8세대·BTC $78.5K·KOSPI 6,417.93 사상 최고",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. S&P 500 7,137.90 +1.05%·Nasdaq 24,657.57 +1.64% 4/22 종가로 동반 기록 신고가, 휴전 연장 안도와 빅테크 실적 호조가 랠리 재점화. 장후 TSLA는 EPS $0.41 비트에 +3%, BA는 Q1 매출·EPS 대폭 비트·상업기 143대로 에어버스 역전. 반면 NOW는 중동 전쟁 온프레미스 딜 지연 헤드윈드로 -14% 급락, IBM도 가이던스 보수적 해석으로 -6.46% 혼조. 4/23 LMT Q1(컨센 EPS $6.73·매출 $18.24B)·장후 Intel Q1(컨센 EPS $0.02·매출 $12.42B) 대기.", time: "2026-04-23 07:05 KST" },
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH·AIQ·QQQ. Google Cloud Next 4/22 키노트에서 Vertex AI를 Gemini Enterprise Agent Platform으로 통합, Workspace Studio·Agent Designer·Memory Bank 공개로 엔터프라이즈 에이전트 성숙도 한 단계 상향. TPU 8세대를 트레이닝 8t·인퍼런스 8i로 분리 출시, NVIDIA와는 네트워킹 공동 엔지니어링 병행해 경쟁과 협력 이원화. Nvidia가 투자한 Vast Data는 $1B 조달·밸류 $30B로 3배 급등, AI 스토리지 수혜 체인 확인. NVDA는 $200~201 박스권 조정.", time: "2026-04-23 07:05 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC가 4/22 오전 $78,500 돌파, 2월 초 이후 최고 구간·월간 +11.1%. Strategy는 총 815,061 BTC로 BlackRock IBIT 802,823 BTC를 넘어선 세계 최대 기관 BTC 보유자 지위 유지, MSTR은 4/22 +11.6%·5거래일 누적 +25%로 급등. BTC ETF 전반 순유입 재가속, 기관 자금 복귀 구간 진입. ETH는 박스권 지속.", time: "2026-04-23 07:05 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. 코스피가 4/22 +29.46p(+0.46%) 오른 6,417.93으로 사상 첫 6,400선 안착·역사적 신고점 경신, 장중 6,423.29 터치. 4/23 장전 SK하이닉스 Q1(컨센 매출 50.1조·영업이익 34.9조·40조 서프라이즈 기대)과 현대차 Q1(컨센 매출 46.17조 역대 최대·영업이익 2.94조 -19% YoY 관세 부담)이 동시 공개되는 대형 이벤트 당일, 삼성SDI 벤츠 10조 수주가 지지. EWY는 YTD +54%·1Y +150%로 글로벌 ETF 중 최상위 수익률.", time: "2026-04-23 07:05 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. 4/22 Brent $97.91(-0.59%)·WTI $88.82(-0.95%) 마감, 트럼프 '이란 지도부 제안 시까지' 조건부 휴전 연장 발표 영향. 이란은 미 해군 차단 지속 시 호르무즈 재개 불가 입장 고수, Vance 부통령 이슬라마바드 회담 취소. 아시아 중심으로 수요 파괴 4~5mb/d(글로벌 공급의 5%) 추정 지속, 에너지 ETF 마진 확대 구간은 유지되나 지정학 프리미엄 일부 희석.", time: "2026-04-23 07:05 KST" },
    ]
  },
  {
    date: "2026-04-22 19:12 KST",
    summary: "Strategy 34,164 BTC 매수로 IBIT 추월·BlackRock 넘어 세계 최대 BTC 보유자·JPM S&P 타겟 7,600 상향·유가 되돌림",
    changes: [
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. 4/20 Strategy가 34,164 BTC를 $2.54B(평단 $74,395)에 매수, 2024년 이후 최대·역사상 세 번째 큰 단일 매수로 총 보유 815,061 BTC. 이번 매수로 BlackRock iShares Bitcoin Trust(IBIT)를 제치고 세계 최대 기관 BTC 보유자로 복귀(2024년 2Q 이후 첫). IBIT는 여전히 AUM $58B·기관 유입 $1.29B로 여전히 최대 ETF 창구지만 보유량 순위 역전은 크립토 ETF 내러티브의 구조적 변화. BTC $77,541 4/22 오전 +2.2% 24h·주간 +4.3%.", time: "2026-04-22 19:12 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. 4/22 Brent $97.91(-0.59%)·WTI $88.82(-0.95%), 트럼프 이란 휴전 '통일 제안 전까지' 연장 발표 후 되돌림. 장중 Brent는 JD 밴스 부통령 이슬라마바드 평화회담 취소 보도에 $101.15까지 브리프 돌파 후 후퇴. 호르무즈 해협은 24시간 통항 단 3척 기능적 봉쇄 지속, 에너지 ETF 마진 확대 구간 유지되나 지정학 프리미엄은 일부 희석.", time: "2026-04-22 19:12 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. JPMorgan이 4/21 S&P 500 연말 타겟을 7,200 → 7,600 상향, 2026 EPS를 $315 → $330(YoY +22%)으로 올렸다. Anthropic Claude Mythos를 AI 랠리 재점화 촉매로 지목하며 Bullish AI trade 재활성화 논거 제시. 4/22 장전 BA Q1 상업기 143대 인도로 Airbus 114대 제쳐 2018년 이후 첫 분기 배송 역전, 장후 TSLA·NOW 실적·4/23 01:00 KST Google Cloud Next '에이전틱 클라우드' 키노트까지 이벤트 집중.", time: "2026-04-22 19:12 KST" },
    ]
  },
  {
    date: "2026-04-22 13:16 KST",
    summary: "트럼프 이란 휴전 조건부 연장으로 유가 안정·BTC $77.6K 재가속·EWY 벤츠 K-배터리 대형 수주로 2차전지 랠리",
    changes: [
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. 4/21 저녁 트럼프가 美-이란 2주 휴전을 조건부 연장, '테헤란 지도부가 통일된 제안을 내놓을 때까지' 유효로 만료 우려 일부 해소. 호르무즈 해협은 여전히 기능적 폐쇄 상태이고 걸프 4월 생산은 14.3mb/d로 3월 대비 -3mb/d 감산 지속. Brent $95·WTI $90 안착으로 에너지 ETF 마진 구간 연장, 지정학 프리미엄은 약화됐으나 공급 제약은 유지.", time: "2026-04-22 13:16 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. 4/22 오전 BTC $77,593 재가속(24시간 +3%). Capital Group American Funds Fundamental Investors가 MSTR 432만주·$747M 추가 매수해 총 1,033만주·$1.78B 확보, 최대 기관주주 진입. Strategy 4월 BTC gain $1.3B·YTD yield 9.5% 복귀로 기관 매수 재점화 시그널, 크립토 ETF 순유입 재개 조짐.", time: "2026-04-22 13:16 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. 4/21 KOSPI 사상 최고 6,376 유지, 삼성SDI +19.89%·LGES +11.42%·포스코퓨처엠 +8.46%·엘앤에프 +6.91% 2차전지 일제 급등. 트리거는 삼성SDI와 Mercedes-Benz 첫 배터리 공급 계약(업계 추정 10조원)과 LGES Mercedes LFP 2.06조원 7년 계약. 삼성SDI는 BMW·VW·벤츠 독일 Big 3 완성차 고객 완성, 한국 배터리 산업의 유럽 프리미엄 OEM 수주 모멘텀 재확인. 4/23 SK하이닉스 Q1 영업익 40조 컨센 서프라이즈 대기.", time: "2026-04-22 13:16 KST" },
    ]
  },
  {
    date: "2026-04-22 07:05 KST",
    summary: "S&P -0.63%·Nasdaq -0.59% 4/21 동반 하락·RTX Q1 비트·BTC $76K 회복·4/22 美-이란 휴전 만료 초긴장",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. 4/21 S&P 500 7,064.01(-0.63%)·Nasdaq 24,259.96(-0.59%)·Dow 49,149.38(-293p) 일제히 하락, 미-이란 평화협상 불확실성과 Apple Tim Cook 경영승계 서프라이즈가 동시 소화됐다. 장전 RTX Q1 EPS $1.78 비트(+17%)·매출 $22.1B·가이던스 $6.70~6.90 상향으로 방산주 강세, 장후 TSLA Q1(컨센 매출 $22.71B·EPS $0.37) 실적 대기. 4/22 장전 BA(-$0.69·$21.97B 예상), 4/23 GOOGL·INTC·LMT 순으로 어닝 집중도 최고조.", time: "2026-04-22 07:05 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. 4/21 Brent $95대·WTI $89~90선 방어, 美-이란 2주 휴전 만료(4/22) 직전 트럼프가 '협상 타결 없으면 연장 없다'고 시그널링하며 호르무즈 통항 급감 국면 지속. 단기 유가 변동성은 확대되지만 XLE 고배당·VDE 광역 에너지 ETF는 Brent $90+ 방어 구간에서 마진 확대 구도 유지.", time: "2026-04-22 07:05 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. 4/21 BTC $76,490까지 +2.7% 반등해 $76K 돌파, Monday 지정학 급락분 전량 회복. 트리거는 美-이란 휴전 협상 진전 기대와 Warsh 연준이사 인사청문회 직전 기대감. 크립토 ETF 순유입 재개 조짐으로 Strategy 78만 9천 BTC 평균단가 $75,577 위 방어.", time: "2026-04-22 07:05 KST" },
    ]
  },
  {
    date: "2026-04-21 19:21 KST",
    summary: "EWY KOSPI 6,376 사상 최고 돌파·외인 1조원+ 순매수·5/22 단일종목 2배 레버리지 ETF·SPY Q1 어닝 주간 본격화",
    changes: [
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. 4/21 KOSPI 장중 +2.5% 급등해 사상 최고 6,376.28 기록, 종전 2/26 종가 6,307.27·장중 6,347.41을 모두 경신. 외국인이 4/7~21 기간 순매수 5.79조원, 4/21 하루만 1조원+ 집중 매수 — 삼성전자 1.09조원·SK하이닉스 2.41조원. 4/21 국무회의에서 단일종목 2배 레버리지 ETF 허용 시행령 개정안 통과, 4/28 공포 후 5/22 삼성·SK하이닉스 대상 상장 예정. 4/1~20 반도체 수출 +183% YoY 급증이 수급 펀더멘털.", time: "2026-04-21 19:21 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. S&P 500 4/20 -0.24% 7,109.14 마감, Nasdaq -0.26% 24,404.39. 이번 주 RTX 4/21 장전·Tesla·Boeing 4/22·Alphabet·Intel·LMT 4/23 실적으로 빅테크 어닝 본격화. 현대차(4/23)·기아(4/24) 실적도 한국 시장 연결 변수, Q1 블렌디드 EPS 컨센 +12.5% 유지 여부가 초점.", time: "2026-04-21 19:21 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. 4/20 WTI $89.61(+6.8%)·Brent $95.48(+5.6%) 종가, 호르무즈 일 통항 16척으로 정상치 대비 급감. 미 해군 Touska 나포·이란 해협 재봉쇄 번복 구도에서 4/21 화요일 2주 휴전 만료가 경로 결정. 이집트·파키스탄 중재 복귀 시도 속 XLE·VDE 마진 재확대, XOP·IEO 탐사·생산주 프리미엄 재평가 지속.", time: "2026-04-21 19:21 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC 4/20 13:32 ET 기준 $75,657(+2.4% 24시간), 장중 $74K 하방 테스트 후 $76K 재돌파. KelpDAO 해킹 사건으로 DeFi TVL에서 약 $14B 이탈, 기관 BTC ETF 매수세가 하방 방어. 호르무즈 휴전 4/21 만료 대기 구간에 인플레 헤지·지정학 헤지 수요 교차 검증.", time: "2026-04-21 19:21 KST" },
    ]
  },
  {
    date: "2026-04-21 13:10 KST",
    summary: "Brent $96 재돌파·IBIT BTC $73.8K 저점 후 회복·EWY KOSPI 7거래일 연속 상승·어닝 집중 주간 SPY·QQQ 집중 관전",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ·VOO. 이번 주는 집중 어닝 주간 — 4/21 RTX·4/22 Tesla·Boeing·ServiceNow·IBM·4/23 Alphabet·Intel·LMT·4/24 American Airlines. Q1 블렌디드 EPS 컨센 +12.5% 기준선 유지, Dow 49,447·Nasdaq 24,468·S&P 7,126으로 지난 주 사상 최고 경신 마감. 기술주 중심 어닝 흐름이 AI CapEx 가시성을 재확인할지, 아니면 실망 가이던스로 이익 모멘텀이 꺾일지 결정되는 구간.", time: "2026-04-21 13:10 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. Brent가 월요(4/20) +5~6% 반등해 $95~96/배럴 재돌파, WTI $90선. 이란이 미국 해상봉쇄 해제 거부에 맞서 호르무즈 재봉쇄 유지·미 해군의 이란 국적 Touska 나포로 긴장 격화. 4/21 화요일 미-이란 2주 휴전 만료가 에너지 ETF 단기 경로의 결정 변수, 4/25 OPEC+ 화상 회의 대기.", time: "2026-04-21 13:10 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC 주말 -2.5% 하락해 월요 오픈 $73,820, 오전 9시 ET에 $75,324 회복. 미 스폿 BTC ETF 기관 매수세가 하방 방어, 호르무즈 재봉쇄·이란 선박 나포 지정학 헤드라인이 단기 압력. Kelp 해킹 $296M 손실(Lazarus 연관 의심)·RaveDAO 조작 의혹이 크립토 센티먼트 추가 악화 요인.", time: "2026-04-21 13:10 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. KOSPI 4/20 +0.44% 상승해 6,219.09로 7거래일 연속 상승, 코스닥도 +0.41% 1,174.85. 반도체 쌍끌이가 지수 상승의 핵심 — SK하이닉스 +3.0%·삼성전자 +0.2%·LG엔솔 +2.8%·SK스퀘어 +4.4%·두산에너빌리티 +4.6%. 4/23 SK하이닉스 Q1(OP 컨센 34.9조, 키움·유안타·미래에셋 40조대 상향)과 LG엔솔 Q1 어닝쇼크(영업손실 2,078억)가 엇갈림.", time: "2026-04-21 13:10 KST" },
    ]
  },
  {
    date: "2026-04-20 19:19 KST",
    summary: "월요 Brent $95 급등 +5~7%·S&P 선물 -0.8%·KOSPI 6,260선 돌파로 EWY·XLE 재평가, IBIT $74~76K 박스권",
    changes: [
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE·IEO. Brent가 월요 아시아~유럽 장에서 +5~7% 점프해 $95/배럴 돌파, WTI도 $90선 회복하며 금요 -10% 급락분을 48시간 만에 완전 반납. 호르무즈 재봉쇄와 이란-미 해군 직접 충돌이 지정학 프리미엄을 재소환, 금요 저점 대비 에너지 ETF 구간 전반 +3~5% 반등 가시. 4/22 이스라엘-레바논 휴전 만료·4/25 OPEC+ 회의 순차 이벤트가 이번 주 에너지 지표 경로 결정.", time: "2026-04-20 19:19 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ·DIA. 월요 미 주가지수 선물 S&P -0.8%·Nasdaq -0.6%·Dow -1%로 하락 출발 — 지난 주 S&P +4.54%·Nasdaq +6.84% 사상 최고 랠리 후 첫 숨고르기. 4/20 장 마감 후 Intel·Steel Dynamics Q1 시작, 4/22 Tesla·Boeing, 4/24 Alphabet·American Airlines, 4/25 OPEC+ 이벤트 대기. Q1 블렌디드 EPS 컨센 +12.5% 유지.", time: "2026-04-20 19:19 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY. KOSPI가 월요 개장 6,213.92(+0.36%)·장중 6,267.45(+1.22%)로 6,260선 돌파해 EWY 리프라이싱 강력. SK하이닉스 +3.10% 110만원 돌파·두산에너빌리티 +4.98%·LG에너지솔루션 +4.01%·SK스퀘어 +4.25%가 지수 견인, 기관 2,982억 순매수·외국인 KOSPI200 선물 2,038억 순매수. 4/23 SK하이닉스(OP 컨센 38.5조)·4/24 LGES 실적과 원/달러 1,475원 환율이 변수.", time: "2026-04-20 19:19 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC가 $74~76K 구간으로 소폭 하방 조정, $75K 저항이 단기 천장으로 굳어짐. 호르무즈 충격으로 위험자산 일시 이탈이 주말 내내 미 스폿 BTC ETF 유출입 소강과 맞물림. IBIT AUM $58B 유지, 박스권 연장 시 Strategy(MSTR) 같은 레버리지 포지션의 변동성이 먼저 확대되는 구조.", time: "2026-04-20 19:19 KST" },
    ]
  },
  {
    date: "2026-04-20 13:08 KST",
    summary: "호르무즈 재봉쇄·美 Touska 나포로 에너지 ETF 재평가 구간 — XLE·XOP·VDE 월요 갭업 가시, ITA·SHLD 방산 재평가 동반",
    changes: [
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP·VDE. 이란이 4/18 호르무즈 해협을 재봉쇄하고 4/19 미 해군 이지스 USS Spruance가 이란 국적 선박 Touska를 나포하며 중동 리스크 프리미엄 복귀. 금요 WTI $83 마감에서 월요 아시아 장 +5~8% 갭업 가시, XLE·XOP·VDE 일제히 리프라이싱 구간 진입. 4/22 이스라엘-레바논 휴전 만료 여부와 4/25 OPEC+ 화상회의가 단기 경로 결정. URA·NLR은 지정학 충격과 별개로 Oracle·Meta PPA 서사 차별화 유지.", time: "2026-04-20 13:08 KST" },
      { type: "수치 갱신", sector: "방산·보안",
        detail: "ITA·PPA·XAR·SHLD. 美 해군의 Touska 직접 나포·사격 사건과 함께 중동 긴장 재점화. Lockheed·RTX·Northrop·General Dynamics·L3Harris 추가 패트리엇·SM-6·해상방공 수요 재평가. SHLD는 2026년 대표 테마 ETF 포지션 유지, AI·사이버·첨단 방산 축이 두 번째 상승 모멘텀. CIBR·HACK도 국가단위 사이버 긴장 반영 구간.", time: "2026-04-20 13:08 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC가 주말 $75~78K 박스권에서 지지력 테스트, 미 스폿 BTC ETF 주말 유출입 소강. 호르무즈 재봉쇄·미국-이란 직접 충돌은 단기 위험자산 이탈 압력이지만 인플레 헤지 수요는 중기 지지. IBIT AUM $58B 유지, 월요 프리마켓에서 $75K 지지 여부가 단기 방향.", time: "2026-04-20 13:08 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ·IWM. 4/17 7,041 S&P 500 신고점에서 주말 지정학 재점화로 월요 개장 갭다운 가시, 다만 Q1 블렌디드 EPS +12.5% 컨센 유지. 이번 주 4/22 Tesla·Boeing·4/24 Alphabet·Intel 어닝 줄줄이 대기, 4/25 OPEC+·5/1 FOMC로 이어지는 매크로 연쇄 이벤트가 5월 방향성 결정.", time: "2026-04-20 13:08 KST" },
    ]
  },
  {
    date: "2026-04-20 07:16 KST",
    summary: "어닝 위크 프리뷰 — 4/22 Tesla·Boeing·Google Cloud Next, 4/23 SK하이닉스, 4/24 Alphabet·Intel, BTC $75.5~76K 저항 박스권",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. S&P 500 Q1 블렌디드 EPS 컨센서스 +12.5% 설정, 4/22 Tesla(컨센 EPS $0.37·매출 $22.71B)·Boeing(EPS -$0.39~-$0.63·매출 $22.1B)·Verizon·AT&T, 4/23 IBM·ServiceNow, 4/24 Alphabet·Intel·T-Mobile로 이어지는 120개사 Q1 어닝 집중 주간. 이번 주 S&P 500 7,041·Nasdaq 24,102 신고점 방어 여부는 빅테크 가이던스에 달렸고, 4/25 OPEC+ 회의·5/1 FOMC가 매크로 뒷배경.", time: "2026-04-20 07:16 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC. BTC가 주말 $75,996에서 안착, $75~76K 저항대가 단기 천장·$70.5K 지지 구간. $76K 상방 돌파 시 숏 스퀴즈로 $80~84K 복귀 가능성. 미 스폿 비트코인 ETF 복합체는 주말 유출입 소강, IBIT AUM $58B 유지. 박스권 장기화 시 파생 포지션 청산 리스크 누적.", time: "2026-04-20 07:16 KST" },
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH·SOXX·AIQ. NVIDIA Ising 오픈소스 양자 AI 모델 공개·AMD 12일 연속 랠리·TSMC Q1 실적 비트에 따라 AI 반도체 지수 프리미엄 유지. SK하이닉스 4/23 Q1 확정(OP 38.5~40조 컨센)·Intel 4/24 어닝이 반도체 섹터 상방·하방 변수. IGV는 Oracle +27% 주간 랠리 소화 구간.", time: "2026-04-20 07:16 KST" },
    ]
  },
  {
    date: "2026-04-19 13:12 KST",
    summary: "주말 — BTC 스폿 ETF 금요 단독 +$664M 수개월 최대·WTI $83대 회복·다음 주 Tesla·Alphabet 어닝 시즌 개시",
    changes: [
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT. 미 스폿 비트코인 ETF 복합체 금요 단독 순유입 $663.9M, 4/14 $471M·4/16 $186M을 압도하는 수개월 최대. BTC가 $77~78K까지 반등하며 IBIT AUM $58B 안정, 주말 장외 거래도 $76K대 지지. FBTC·BITW 동반 반등, Strategy(MSTR) 78만 9천 BTC 평균단가 $75,577 손실 구간 빠르게 축소.", time: "2026-04-19 13:12 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "XLE·XOP. WTI가 주말 $83.85 근처에서 안정, Hormuz 재개방 직후 $80.30 저점 대비 반등. 4/25 OPEC+ 화상 회의에서 5월 증산 속도 재조정 여부가 단기 최대 이벤트. URA·NLR 등 원자력 ETF는 Oracle·Meta·CoreWeave의 대형 원전 PPA 확장 서사로 차별화 유지.", time: "2026-04-19 13:12 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ. 다음 주 S&P 500 120개사 Q1 어닝 집중 — 4/22 Tesla·Boeing·AT&T, 4/23 IBM·ServiceNow, 4/24 Alphabet·Intel·T-Mobile. Tesla 컨센 매출 $21.4B·조정 EPS $0.33, Alphabet은 Gemini·Cloud·광고 가속 확인 구간. 이후 4/25 OPEC+·5/1 FOMC로 이어지는 매크로 3연속 이벤트가 5월 방향성을 결정.", time: "2026-04-19 13:12 KST" },
    ]
  },
  {
    date: "2026-04-19 07:18 KST",
    summary: "주간 결산 — IGV 2001년 10월 이후 최고 주간 +14%·IBIT 주간 순유입 $871M·SPY +4.5%로 2025년 5월 이후 최고 주간",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "IGV. iShares Expanded Tech-Software ETF가 주간 +14%로 2001년 10월 이후 최고 주간 상승. Oracle·Microsoft·AMD 동반 랠리가 엔터프라이즈 SW·인프라 전반으로 확산. SMH·SOXX도 AMD +13% 주간·TSMC Q1 +58% 실적에 강세 지속, AIQ·QTUM도 기록 경신.", time: "2026-04-19 07:18 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT. Bitcoin이 $75K 돌파 후 $78K까지 재차 상승하며 미 스폿 BTC ETF 주간 순유입 $921M(1월 이후 최대). IBIT 단독 유입 $871M·AUM $58B 회복. MicroStrategy $1B 추가 매입으로 BTC 78.9만 개 보유. ETHA도 주간 반등, BITW 등 멀티자산 크립토 ETF 회복 구간.", time: "2026-04-19 07:18 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY. 주간 +4.5%로 2025년 5월 이후 최고. 종가 7,126(+1.2% 금요)로 세 차례 신고점, Dow 49,447·Nasdaq 24,468. QQQ 13일 연속 상승은 1992년 이래 최장 기록 갱신. 4/22 Tesla·Boeing, 4/24 Alphabet·Intel 어닝 대기 — 가이던스 차별화가 다음 주 모멘텀 결정.", time: "2026-04-19 07:18 KST" },
    ]
  },
  {
    date: "2026-04-18 13:17 KST",
    summary: "나스닥 13일 연속 상승·1992년 이래 최장 랠리·BTC $75K 돌파로 크립토 ETF 유입 재개",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "QQQ. 나스닥 Composite이 4/17까지 13거래일 연속 상승, 1992년 이래 최장 기록. S&P 500 세 번째 연속 신고점, Dow 누계 +2,400포인트 이주 랠리. 트럼프-이란 2주 휴전 연장 협상 기대가 모멘텀을 추가 자극. QQQ YTD 8→9%·1년 23→24% 상향.", time: "2026-04-18 13:17 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT. 비트코인이 $75,400 돌파하며 4월 반등 지속 — 중동 휴전·위험자산 선호 회복으로 현물 ETF 순유입 반전. IBIT YTD +2→+4%·1년 -15→-12% 개선. ETHA 등 이더 현물도 소폭 반등.", time: "2026-04-18 13:17 KST" },
    ]
  },
  {
    date: "2026-04-18 07:19 KST",
    summary: "4/17 호르무즈 재개방 — 에너지 ETF 일제 하락·S&P 500 7100 첫 돌파·Dow +1,005포인트",
    changes: [
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "이란이 4/17 호르무즈 해협 전면 재개방 선언하면서 WTI -10.8% $81.28·Brent -10.3% $89.13로 급락. XLE YTD 상승분 일부 반납(+38→+28%), XOP +43→+30%, VDE +30→+22% 등 전통 에너지 ETF 동반 조정. 이번 주 휴전 합의 이후 중동 리스크 프리미엄 축소 구간 진입.", time: "2026-04-18 07:19 KST" },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY·QQQ·IWM 일제히 신고점. S&P 500 +1.3%로 7,100 최초 돌파, Dow +2.1% $1,005 포인트 급등, 나스닥 +1.5%, Russell 2000도 신고점. 10년물 국채수익률 4.24%(-8bp)로 유가 하락이 인플레 경로 완화. VIX 3월 고점 대비 -41% 진정, 3주 연속 주간 상승.", time: "2026-04-18 07:19 KST" },
    ]
  },
  {
    date: "2026-04-17 07:04 KST",
    summary: "S&P 500·나스닥 4/16 연속 사상 최고가 — 나스닥 12일 연속 상승(2009년 이후 최장)",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "4/16 S&P 500 7,041.28·나스닥 24,102.70으로 전일에 이어 연속 사상 최고가 경신. 나스닥은 12일 연속 상승으로 2009년 7월 이후 최장 랠리. 이스라엘-레바논 10일 휴전 합의·주간 실업수당 청구 207K(전주 -11K 감소)가 추가 촉매. SPY·QQQ 현행화.", time: "2026-04-17 07:04 KST" },
    ]
  },
  {
    date: "2026-04-16 17:30 KST",
    summary: "ETF 운용규모·YTD 수익률 전면 현행화 — 반도체·방산·에너지 강세, 클린에너지·크립토 약세 재확인",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH 운용규모 $42B→$52B·1년 수익률 +45%→+120% 대폭 상향(AI 슈퍼사이클 가속). SOXX 운용규모 $22B→$20.6B·보수 0.35%→0.34%. BOTZ $3.5B→$3.56B, AIQ $2.8B→$7.86B(AUM 3배), QTUM $1.2B→$3.7B·1년 수익률 +70% 갱신.", time: "2026-04-16 17:30 KST" },
      { type: "수치 갱신", sector: "방산·보안",
        detail: "ITA YTD 수익률 +15%→+5% 조정·1년 수익률 +28%→+45%. XAR 운용규모 $1.9B→$5.7B로 3배 확대. SHLD YTD +80%→+19%로 정상화하되 1년 +58%→+75% 여전히 방산 ETF 상위권 유지.", time: "2026-04-16 17:30 KST" },
      { type: "수치 갱신", sector: "에너지·원자력",
        detail: "URA YTD +25%→+6%·1년 +40%→+30%로 원전 섹터 연초 조정 반영. 중동 유가 급등으로 XLE·XOP·VDE 중심 전통 에너지 ETF 상대적 강세 유지.", time: "2026-04-16 17:30 KST" },
      { type: "수치 갱신", sector: "클린에너지",
        detail: "ICLN YTD +50%→+6%·1년 +35%→+10%, TAN YTD +46%→-1% — 정책 모멘텀 약화·보조금 축소·관세 부담으로 태양광·클린에너지 랠리 크게 후퇴.", time: "2026-04-16 17:30 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT·FBTC YTD -16%→+2%로 스팟 비트코인 ETF 반등 국면 확인. 4월 유입 반전 흐름 지속.", time: "2026-04-16 17:30 KST" },
      { type: "수치 갱신", sector: "신흥국·글로벌",
        detail: "EWY YTD +49%→+54%·1년 +173%→+150% — 코스피 급등세 감안 현행화, 반도체·방산 주도 랠리 지속.", time: "2026-04-16 17:30 KST" },
    ]
  },
  {
    date: "2026-04-16 15:40 KST",
    summary: "카테고리당 ETF 5→7종 확장(Top7 일관성). 16개 신규 편입, 기존 수치 전반 갱신",
    changes: [
      { type: "구성 변경", sector: "AI·반도체",
        detail: "추가: IGV(iShares Tech-Software, AUM $10.7B·YTD -26%·AI 대체 우려로 SaaS 전반 급락)·WCLD(WisdomTree Cloud, AUM $0.38B·YTD -19%). 반도체 중심 5종에 소프트웨어·클라우드 커버리지 보강.", time: "2026-04-16 15:40 KST" },
      { type: "구성 변경", sector: "방산·보안",
        detail: "추가: SHLD(Global X Defense Tech, AUM $8.7B·YTD +80%·2026년 ETF 전체 최상위권 수익)·PAVE(Global X Infrastructure, AUM $12.4B·YTD +4%·미 인프라 재건 수혜). ITA AUM $8B→$17B, PPA $5B→$6.5B, XAR $3B→$1.9B, HACK YTD +16%→0% 등 수치 현행화.", time: "2026-04-16 15:40 KST" },
      { type: "구성 변경", sector: "에너지·원자력",
        detail: "추가: VDE(Vanguard Energy, AUM $13.2B·YTD +30%·저보수 0.09%)·IEO(iShares US Oil & Gas E&P, AUM $0.60B). 중동 유가 급등 반영해 XLE YTD +8%→+38%, XOP +6%→+43% 대폭 상향.", time: "2026-04-16 15:40 KST" },
      { type: "구성 변경", sector: "클린에너지",
        detail: "추가: FAN(First Trust Wind, AUM $0.26B·1Y +78%)·HYDR(Global X Hydrogen, AUM $0.063B·YTD +57%·1Y +110%). ICLN YTD +5%→+50%, TAN +8%→+46% 카운터랠리 반영.", time: "2026-04-16 15:40 KST" },
      { type: "구성 변경", sector: "크립토·블록체인",
        detail: "추가: BITW(Bitwise 10 Crypto Index, 시총 상위 10 분산)·DAPP(VanEck Digital Transformation, Web3 기업 테마). IBIT AUM $54B→$58B, YTD -22%→-16% 현행화(IBIT+FBTC+ETHA 등 스폿 ETF 합산 AUM $96.5B 돌파).", time: "2026-04-16 15:40 KST" },
      { type: "구성 변경", sector: "미국 대형주",
        detail: "추가: RSP(Invesco S&P 500 등가중, AUM $83B·빅테크 집중 리스크 분산)·IWM(iShares Russell 2000, AUM $73B·1Y +43%·소형주 반등). DIA YTD 0%→-3%(다우 부진).", time: "2026-04-16 15:40 KST" },
      { type: "구성 변경", sector: "배당·인컴",
        detail: "추가: NOBL(ProShares Dividend Aristocrats, 25년+ 배당성장 166종)·DGRO(iShares Core Dividend Growth, AUM $39B·1Y +27%). VYM AUM $60B→$89B, SCHD YTD +7%→+11%(에너지 비중 수혜), JEPI $38B→$44B 갱신.", time: "2026-04-16 15:40 KST" },
      { type: "구성 변경", sector: "신흥국·글로벌",
        detail: "추가: FXI(iShares China Large-Cap, 중국 H주·관세 변동성)·EWY(iShares MSCI South Korea, AUM $16B·YTD +49%·1Y +173%·반도체 HBM+방산 수출 주도 급등). VWO AUM $80B→$116B.", time: "2026-04-16 15:40 KST" },
    ]
  },
  {
    date: "2026-04-16 11:49 KST",
    summary: "S&P 500 7,023·나스닥 24,016 사상 최고가 경신 — 미국 대형주 ETF YTD 전면 상향",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "4/15 S&P 500 7,022.95(+0.80%)·나스닥 24,016.02(+1.59%) 사상 최고가 동시 경신. 美-이란 평화 협상 진전 기대 + Q1 어닝 시즌 호조(보고 기업 77% EPS 비트)가 위험자산 선호 촉발. SPY YTD -4%→+3%, QQQ +1%→+7%, VOO -4%→+3%, VTI -4%→+2%, DIA -3%→0%로 갱신. 다우(48,464)만 소폭 하락(-0.15%)하며 대형 기술주 주도 장세 확인.", time: "2026-04-16 11:49 KST" },
    ]
  },
  {
    date: "2026-04-16 08:45 KST",
    summary: "VOO AUM $827B 갱신 — SPY 추월해 세계 최대 ETF 등극",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "Vanguard S&P 500 ETF(VOO) AUM $500B → $827B로 갱신(4/6 공식 기준). 자금 유입 지속으로 SPY를 제치고 세계 최대 ETF 등극(VOO $827B > IVV ~$750B > SPY ~$590B 순). 수수료 0.03%의 압도적 저비용 구조가 장기 연금·IRA 자금 흡인. SPY rs를 '최대 ETF' → '대형주 ETF'로 수정, VOO rs에 '최대 ETF' 추가.", time: "2026-04-16 08:45 KST" },
    ]
  },
  {
    date: "2026-04-15 21:38 KST",
    summary: "미국 대형주 ETF YTD 갱신(SPY -4%·QQQ +1%), IBIT AUM·YTD 소폭 정정",
    changes: [
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "SPY YTD +12→-4%·QQQ +15→+1%·VOO +12→-4%·VTI +11→-4%·DIA +8→-3%로 재조정. 2026 초반 S&P500 -6.7%(4/3)까지 밀렸다가 중순 반등 국면. QQQ는 AI 리더십으로 상대 강세 유지(YTD +0.6%). 1Y 수익률도 최근 조정분을 감안해 하향. 현재 S&P 500 6,950·나스닥 23,500 수준.", time: "2026-04-15 21:38 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT AUM $57B → $54B로 재조정(Q1 2026 종료 시점 $54B·시장점유 49% 공식). YTD -24% → -22%(최근 BTC 소폭 반등). 커스터디 BTC 78.2만개, 일평균 거래대금 $3.2B 추가.", time: "2026-04-15 21:38 KST" },
    ]
  },
  {
    date: "2026-04-15 20:14 KST",
    summary: "SMH AUM 재조정·IBIT YTD 추가 하향 — BTC $70,800 권역 하락폭 갱신",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH(VanEck Semiconductor) AUM 공식 $42B로 재정립(전 $49B는 일시 피크치). VanEck 4/10 팩트시트 기준. YTD +22%·1Y +45%로 미세 조정. 규모 1위 지위 유지.", time: "2026-04-15 20:14 KST" },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT — BTC가 4/15 시점 ~$70,777(연초 $93k 대비 -24%, 1Y -20%)로 추가 하락. YTD -16%→-24%, 1Y -15%→-20% 정정. 4/10 IBIT AUM $56.80B, 동일자 +$269.3M 순유입. 최신 AUM 수치 $56.8B 명시.", time: "2026-04-15 20:14 KST" },
    ]
  },
  {
    date: "2026-04-15 19:20 KST",
    summary: "IBIT AUM 갱신 ($54B → $57B) 및 Q1 순유입 $8.4B 확인",
    changes: [
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "IBIT(iShares Bitcoin Trust) AUM $54B → $57B로 갱신(4/10 $56.8B 기준). Q1 2026 순유입 $8.4B 공식 확인 — BTC 25% 드로다운에도 기관 장기 배분 수요 유지. 시장 점유율 49%, 일평균 거래대금 $3.2B, 커스터디 BTC 약 78.2만개. BlackRock Q1 실적에서 디지털 자산 AUM $60.7B로 공시, 4/14 IBIT +$269M 순유입으로 5일 연속 유출 종료. Q1 순유입 지표 추가." }
    ]
  },
  {
    date: "2026-04-15 12:40 KST",
    summary: "반도체 ETF YTD 재집계·크립토 ETF YTD 음전환",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH(VanEck Semiconductor) AUM $42B→$49B로 갱신(VanEck 공식 4/10 기준), YTD 수익률도 Yahoo 기준 +21%→+25.5%(4/14), 1Y +48%로 재집계. SOXX(iShares Semiconductor)는 YTD +20%→+28.5%(4/10 기준), 1Y +46%로 상향. AI 인프라 투자 붐·Blackwell Ultra 공급 지속 + TSMC Q1 $35.7B 사상 최대 실적이 촉매." },
      { type: "수치 갱신", sector: "크립토·블록체인",
        detail: "비트코인 4/14 종가 ~$74,500(연초 $88,722 대비 -16%, 1Y 약 -15%). IBIT YTD +30%/1Y +65% → -16%/-15%로 정정. FBTC AUM $18B→$17B, 동일 패턴 음전환. ETHA(이더리움)도 4/14 일중 +7% 반등에도 YTD -12%. BITO·BLOK 동반 음전환. 다만 4/14 IBIT는 5주 최대인 +$269.3M 순유입으로 5일 연속 유출 흐름 종료. BlackRock Q1 어닝에서 IBIT AUM $54B·점유 49% 공식 확인, Q1 순유입 $8.4B·보유 BTC 약 78.2만개." }
    ]
  },
  {
    date: "2026-04-14 20:35 KST",
    summary: "AI·반도체 ETF AUM 상향, QQQ AUM 갱신",
    changes: [
      { type: "수치 갱신", sector: "AI·반도체",
        detail: "SMH(VanEck Semiconductor) AUM $28B→$71B(+154%). AI 인프라 투자 붐·반도체 슈퍼사이클로 2026년 초 이후 자금 대거 유입. 4월 한 달 약 +20% 랠리. SOXX(iShares Semiconductor) AUM $16B→$22B(+37.5%). Morningstar Bronze 유지. 두 ETF 모두 1위 자리 경쟁 심화. 이번 갱신은 AUM만 조정, YTD·1Y 수익률은 기존 유지." },
      { type: "수치 갱신", sector: "미국 대형주",
        detail: "QQQ(Invesco QQQ Trust) AUM $320B→$400B. 나스닥 100 빅테크 랠리 지속, AI·반도체 비중 확대와 GPT-5.4·Gemini 3.1 출시로 투자자 관심 유입. SPY·VOO와 함께 3대 최대 ETF 자리 공고히." }
    ]
  },
  {
    date: "2026-04-13 12:30 KST",
    summary: "글로벌 ETF 8개 카테고리 40종목 초기 구성",
    changes: [
      { type: "신규 구성", sector: "전체",
        detail: "8개 카테고리 × 5종목 = 40 ETF 체제 확립. AI·반도체, 방산·보안, 에너지·원자력, 클린에너지, 크립토·블록체인, 미국 대형주, 배당·인컴, 신흥국·글로벌." },
    ]
  },
];
