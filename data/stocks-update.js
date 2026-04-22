// US Stocks Atlas - Update Log
// 종목 교체·수치 갱신 등 데이터 변경 이력.

const updates = [
  {
    date: "2026-04-23 07:05 KST",
    summary: "TSLA·BA·NOW·IBM·T Q1 실적 일제 공개·S&P 500·Nasdaq 동반 기록 신고가 +1.05%·+1.64%·Google Cloud Next에서 Gemini Enterprise 통합과 Apple 파운데이션 파트너십·BTC $78.5K 돌파",
    changes: [
      { type: "실적 확정", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/22 장후 Q1 2026 실적 공개, 매출 $22.39B(컨센 $22.64B)로 톱라인은 미스했으나 조정 EPS $0.41(컨센 $0.37) 11% 비트. 오토 매출 $16.2B +16% YoY, 오토 마진(크레딧 제외) 19.2%로 작년 전 분기 대비 개선. 총 매출총이익률 21.1% — 전년 16.3% 대비 +478bp, Q4 2025 20.1% 상회. 인도 358,023대 +6% YoY, 에너지 스토리지 매출 $2.41B로 전년 $2.73B 대비 -12% 감소. 애프터마켓 +3% 반등. 평균 판매가 상승·재료비 하락이 마진 개선 주도.", time: "2026-04-23 07:05 KST" },
      { type: "실적 확정", sector: "항공우주·방산",
        detail: "Boeing(BA). 4/22 장전 Q1 2026 실적, 매출 $22.22B(+14% YoY, 컨센 $21.78B 비트)·조정 손실 -$0.20(컨센 -$0.83 대폭 비트). 상업기 인도 143대로 에어버스 114대 제쳐 2018년 이후 첫 분기 역전, 매출 $9.2B +13%. 방산 섹그먼트 매출 $7.6B +21%, 서비스 $5.37B +6%. Ortberg CEO는 737 MAX 양산 레이트를 여름에 월 42대 → 47대로 상향 예고. 순손실 -$7M(주당 -$0.11)로 전년 -$31M 대비 축소, 턴어라운드 궤도 재확인.", time: "2026-04-23 07:05 KST" },
      { type: "실적 확정", sector: "AI 플랫폼",
        detail: "ServiceNow(NOW). 4/22 장후 Q1 실적, 매출 $3.77B +22% YoY·구독 $3.67B +22%·EPS $0.97(컨센 $0.80) 21% 비트. 신규 ACV $5M 초과 딜 16건으로 전년 대비 80% 증가, Now Assist $1M+ 고객 +130% YoY. 그러나 중동 전쟁으로 온프레미스 대형 딜 클로징 지연, 구독 매출 성장에 약 75bp 헤드윈드. 애프터마켓 주가 -14% 급락, YTD -30%로 2026년 가장 부진한 소프트웨어 대형주 중 하나.", time: "2026-04-23 07:05 KST" },
      { type: "실적 확정", sector: "AI 플랫폼",
        detail: "IBM. 4/22 장후 Q1 매출 $15.9B +9% YoY, 소프트웨어 +11%·인프라스트럭처 +15% 견조. 조정 EPS $1.91(컨센 $1.81) 5.5% 비트, GAAP 총마진 56.2%·조정 EBITDA 마진 25.0%·FCF $2.2B. 2026 풀해 상수환율 기준 +5%·FCF +$1B 가이던스 재확인, 분기 배당 $1.69로 상향. 그러나 애프터마켓 -6.46% $235.60까지 하락, 시장은 컨센 대비 가이던스 톤을 보수적으로 해석.", time: "2026-04-23 07:05 KST" },
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "Alphabet(GOOGL). 4/22 Google Cloud Next 2026 키노트, Sundar Pichai·Thomas Kurian가 발표. Vertex AI를 Gemini Enterprise Agent Platform으로 리브랜딩, Agentspace 흡수해 단일 Gemini Enterprise 제품으로 통합. Gemini 3.1 Pro 프리뷰, Gemini 3.2는 행사 중 공식 발표 예정(100만 토큰 컨텍스트 확장). Workspace Studio(노코드 에이전트 빌더), Agent Designer 프리뷰, Agent Engine Sessions·Memory Bank GA. Apple은 자사 파운데이션 모델을 Gemini 기반으로 공동 개발, 차세대 Siri 파워링. 신규 TPU 8세대 8t(트레이닝)/8i(인퍼런스) 공개.", time: "2026-04-23 07:05 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). BTC가 4/22 오전 $78,500 돌파하며 2월 초 이후 최고 구간, 전월 대비 +11.1%. MSTR 주가 4/22 +11.6% 급등, 5거래일 누적 +25%로 4/20 공시한 34,164 BTC·$2.54B 매수와 BTC 재가속이 동시 견인. 총 815,061 BTC 평단 $74,395로 흑자 구간 고착, BlackRock iShares IBIT 802,823 BTC 제친 세계 최대 기관 BTC 보유자 지위 유지.", time: "2026-04-23 07:05 KST" },
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 4/22 Brent $97.91(-0.59%)·WTI $88.82(-0.95%) 마감, 트럼프의 '이란 지도부 제안 시까지' 조건부 휴전 연장 발표가 오전 내림세 주도. 반면 이란은 미 해군 차단 지속 시 호르무즈 해협 재개 불가 입장 고수, JD Vance 부통령은 이슬라마바드 평화회담 취소. 아시아 중심으로 수요 파괴 4~5mb/d(글로벌 공급의 5%) 추정 지속, XOM·CVX 마진 확대 구간 여전하나 브리프 $100 터치 후 되돌림. LNG는 유럽 프리미엄 장기화 전제 유지.", time: "2026-04-23 07:05 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "미 증시 요약. S&P 500 7,137.90 +1.05%·Nasdaq 24,657.57 +1.64% 4/22 종가로 동반 기록 신고가, 휴전 연장과 빅테크 실적 호조가 랠리 재점화. 장후 TSLA EPS 비트·BA Q1 대폭 비트·IBM 서프라이즈 반면 NOW는 -14% 급락 혼조. 4/23 장전 LMT(컨센 EPS $6.73·매출 $18.24B) 실적 대기, 장후 Intel Q1(컨센 EPS $0.02·매출 $12.42B)과 YTD +78% 랠리 검증. 4/25 OPEC+ 화상회의까지 이벤트 밀집.", time: "2026-04-23 07:05 KST" },
    ]
  },
  {
    date: "2026-04-22 19:12 KST",
    summary: "Strategy 34,164 BTC·$2.54B 매수로 BlackRock 추월 세계 최대 BTC 보유자·BA Q1 상업기 143대 인도 에어버스 역전·오일 휴전 연장 안도에 소폭 조정",
    changes: [
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 4/20 34,164 BTC를 $2.54B(평단 $74,395)에 매수, 2024년 이후 최대·단일 매수 역사상 세 번째 규모. 총 보유 815,061 BTC로 BlackRock iShares IBIT를 제치고 세계 최대 기관 BTC 보유자로 복귀(2024년 2Q 이후 첫). STRC 영구우선주 ATM $2.176B·Class A 보통주 $366M 조달로 자금 마련, 올해 들어 4개월간 약 8만 BTC 누적 매수. BTC는 4/22 오전 $77,541 부근 24h +2.2%·주간 +4.3%로 반등 구간.", time: "2026-04-22 19:12 KST" },
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 4/22 Brent $97.91(-0.59%)·WTI $88.82(-0.95%) 마감, 트럼프 이란 휴전 '통일 제안 전까지' 연장 발표 후 소폭 조정. 장중 Brent는 JD 밴스 부통령 이슬라마바드 평화회담 취소 보도에 $101.15까지 브리프 돌파 후 되돌림. 호르무즈 해협은 24시간 통항 단 3척으로 기능적 봉쇄 지속, 글로벌 원유·LNG 물동량의 20% 해당 구간 여전히 마비. XOM·CVX·COP 마진 확대 구간 연장, LNG 유럽 프리미엄 장기화.", time: "2026-04-22 19:12 KST" },
      { type: "실적 확정", sector: "항공우주·방산",
        detail: "Boeing(BA). 4/22 장전 Q1 2026 실적 발표, 10:30 ET 컨콜 진행. 컨센 매출 $21.97B·손실 -$0.69 기준. Q1 상업기 143대 인도로 에어버스 114대를 제치고 분기 배송량 역전, 약 2018년 1Q 이후 첫 사례. 737 MAX 양산 레이트 회복·787 수요·Spirit AeroSystems 통합 진척이 핵심 확인 사항, 부채 $54.1B 대응 계획과 현금흐름 흑자 전환 타임라인 관전.", time: "2026-04-22 19:12 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "미 증시 이벤트. S&P 500 선물 +0.5%·Nasdaq 100 선물 +0.7%로 4/22 전약후강 시작, 휴전 연장 안도와 유가 되돌림이 주도. 4/22 장전 BA·장후 TSLA·NOW Q1 실적, 4/23 장전 LMT(컨센 EPS $6.73)·장후 INTC(컨센 매출 $12.42B·EPS $0.02) 대기. JPMorgan은 4/21 S&P 500 연말 타겟을 7,200 → 7,600 상향, 2026 EPS를 $315 → $330(YoY +22%)로 올렸고 Anthropic Mythos를 AI 랠리 재점화 촉매로 지목.", time: "2026-04-22 19:12 KST" },
    ]
  },
  {
    date: "2026-04-22 13:10 KST",
    summary: "트럼프 이란 휴전 조건부 연장·WTI $90 유지·BTC $77.6K 24h +3%·Apple 승계 서프라이즈·TSLA 실적 당일 컨센 $22.27B 재확인",
    changes: [
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 4/21 저녁 트럼프가 미-이란 2주 휴전을 조건부 연장, '테헤란 지도부가 통일된 제안을 내놓을 때까지' 유효하다고 발표. 호르무즈 해협은 기능적 폐쇄 지속, 걸프 지역 4월 생산은 14.3mb/d로 3월 대비 -3mb/d·전쟁 이전 대비 -13mb/d 감산. WTI $90·Brent $95선 유지로 XOM·CVX·COP 마진 확대 구간 연장, LNG는 유럽 프리미엄 장기화 전제.", time: "2026-04-22 13:10 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 4/22 오전 BTC $77,593 부근, 24시간 +3% 재가속. Capital Group American Funds Fundamental Investors 펀드가 MSTR 432만주·$747M 추가 매수해 총 1,033만주·$1.78B 보유로 대형 기관주주 진입. Strategy 4월 BTC gain $1.3B·YTD yield 9.5%·25년 풀해 yield 22.8% 누적, 78만 9천 BTC 평단 $75,577 안정적 상회.", time: "2026-04-22 13:10 KST" },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/22 한국시간 기준 장후 Q1 실적·컨센 매출 $22.27B(공식 제공은 $22.71B)·조정 EPS $0.25~0.37 범위. Q1 인도 358,023대(컨센 372,160대 미스), Wall Street는 YoY 매출 +13%·EPS +33% 성장 전망이나 직전 분기 대비 부진. 에너지 스토리지 반토막 우려와 약 5만대 재고 오버행이 단기 이익 압박 요인. 핵심 관전은 Terafab 1TW CapEx 가이던스·Robotaxi 확장 일정·FSD 무감독 승인 주 확대.", time: "2026-04-22 13:10 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "미 증시 주간 이벤트. 4/22 장전 Boeing(BA) Q1 결과·10:30 ET 컨콜, 장후 Tesla·ServiceNow Q1. 4/23 장전 Lockheed Martin(컨센 EPS $6.73)·American Airlines(중동 유가 +50% 여파로 Q1 부진 예상)·Intel(컨센 매출 $12.3~12.4B·EPS $0.05), 4/25 OPEC+ 화상 회의. Google Cloud Next 4/22~24 The Agentic Cloud 키노트, Thomas Kurian·Gemini 중심 에이전틱 발표 대기.", time: "2026-04-22 13:10 KST" },
    ]
  },
  {
    date: "2026-04-22 07:05 KST",
    summary: "RTX Q1 비트·가이던스 상향·S&P 4/21 -0.63% 휴전 불확실성·Brent $95대·BTC $76K 회복·TSLA·BA 실적 당일 대기",
    changes: [
      { type: "실적 확정", sector: "항공우주·방산",
        detail: "RTX(RTX). 4/21 장전 Q1 2026 실적 공개, 조정 EPS $1.78(컨센 $1.52 17% 비트)·매출 $22.1B(+9% YoY·+10% 유기적)·FCF $1.9B. Raytheon 섹그먼트 매출 $6.95B +10%·영업이익 $845M +25%, Pratt & Whitney 영업이익 $711M +21%, Collins Aerospace $7.6B +5%. 2026 풀해 조정 EPS 가이던스 $6.60~6.80 → $6.70~6.90으로 상향, 방산 수요 강세 반영. 중동 긴장 재점화 구간에서 패트리엇·SM-6 수주 모멘텀 지속.", time: "2026-04-22 07:05 KST" },
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 4/21 장중 Brent $95~96·WTI $89~90선 방어, S&P 500은 -0.63%(7,064.01) 마감하며 미-이란 평화협상 불확실성 재부각. 4/22 2주 휴전 만료 직전 트럼프가 '협상 타결 없으면 연장 없다' 시그널, 호르무즈 통항 급감 지속. XOM·CVX·COP 마진 확대 구간 유지, LNG는 유럽 LNG 프리미엄 재확대.", time: "2026-04-22 07:05 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 4/21 BTC $76,490까지 +2.7% 반등해 $76K 라인 회복, 미-이란 휴전 협상 진전 기대 + Warsh 연준이사 인사청문회 대기가 상승 트리거. Strategy 78만 9천 BTC 평균단가 $75,577 위 복귀로 평가손 구간 종료, 기관 BTC ETF 유입 재개 조짐.", time: "2026-04-22 07:05 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "미 증시 요약. S&P 500 7,064.01(-0.63%)·Nasdaq 24,259.96(-0.59%)·Dow 49,149.38(-293p) 4/21 일제히 하락, 4/22 휴전 만료 우려와 Apple 경영승계 서프라이즈 동시 소화. 장후엔 TSLA Q1 실적(컨센 매출 $22.71B·EPS $0.37) 대기, 4/22 장전엔 BA(컨센 EPS -$0.69·매출 $21.97B) 임박. 4/23 LMT·INTC, 4/25 OPEC+ 화상회의까지 이벤트 밀집.", time: "2026-04-22 07:05 KST" },
    ]
  },
  {
    date: "2026-04-21 19:21 KST",
    summary: "RTX 장전 Q1 실적 임박·TSLA·BA 4/22 실적·BTC $75.6K 회복·PLTR 카프 선언으로 논란·호르무즈 휴전 4/21 만료",
    changes: [
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "RTX(RTX). 4/21 장 시작 전 Q1 2026 실적 발표, 한국시간 4/21 21:30. 컨센서스 EPS $1.51(YoY +2.7%)·매출 $21.46B 기준선. 2025년 수주잔고 $268B(상업 $161B + 방산 $107B)로 사상 최대, 지난 네 분기 모두 EPS 비트. 4/21 호르무즈 긴장 재점화·이란-미 해군 직접 교전 국면에서 패트리엇·SM-6·AMRAAM 수요 재평가 기대, 2026 풀해 가이던스 EPS $6.60~6.80 상향 여부가 초점.", time: "2026-04-21 19:21 KST" },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/22 장 마감 후 Q1 2026 실적·한국시간 4/23 오전 6:30 컨콜. 컨센서스는 매출 $22.71B·조정 EPS $0.33~0.37 범위. Robotaxi 서비스가 Austin 무감독 운영($4.20 정액, 31대 Model Y)에서 Dallas·Houston으로 지오펜스 확장 마무리, Q1 인도 358,023대는 이미 반영. AI·에너지 매출 비중·Terafab 1TW 컴퓨트 CapEx 가이던스 상향 여부, 그리고 이제 Model Y L 양산·Cybercab 타임라인 업데이트가 핵심 변수.", time: "2026-04-21 19:21 KST" },
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "Boeing(BA). 4/22 오전 Q1 2026 실적·10:30 ET 컨콜. 컨센 매출 $22.15B·EPS -$0.39~-$0.69 범위, Zacks는 -$0.54 제시. 2025년 상업기 인도 600대로 2018년 이후 최대, Q4 FCF 흑자 $375M. 관전 포인트는 737 MAX 양산 레이트 회복·787 수요·Spirit AeroSystems 통합 진척·신형 기체 FAA 인증 타임라인, 부채 $54.1B 대응 계획.", time: "2026-04-21 19:21 KST" },
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "Palantir(PLTR). 4/20 알렉스 카프 CEO의 공저 『The Technological Republic』 22개조 요약 공개, 핵심은 '원자력 시대 종료·AI 억지력 시대 시작'이라는 선언. 벨링캣·유럽 기술철학자들이 '테크노파시즘' 비판 제기하며 국방·인텔 의존 사업모델과 결합된 이념으로 해석. 주가 $146 근처·YTD -12% 조정 구간에서 정치 논란 재가열, 정부 계약 모멘텀과 상충 여부가 단기 변수.", time: "2026-04-21 19:21 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 4/20 장중 BTC가 $74,000 하방 테스트 후 $76K 회복, 현 $75,657(4/20 13:32 ET) 부근. 트리거는 KelpDAO DeFi 해킹 사건으로 DeFi TVL에서 약 $14B 이탈·호르무즈 휴전 4/21 만료 앞둔 지정학 프리미엄. Strategy 78만 9천 BTC 평균단가 $75,577 근방 공방 지속, 기관 BTC ETF 유입 소강 구간에서 하방 방어선 유지가 과제.", time: "2026-04-21 19:21 KST" },
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 4/20 WTI $89.61(+6.8%)·Brent $95.48(+5.6%) 종가, 호르무즈 통항 16척으로 정상치에서 급감. 미 해군 USS Spruance의 이란 Touska 나포·이란의 해협 재봉쇄 번복 여파가 이틀째 지속, 4/21 2주 휴전 만료 예정에 이집트·파키스탄 중재 복귀 시도. XOM·CVX·COP 마진 재확대 구간, LNG는 유럽 가스 리밸런싱 수혜.", time: "2026-04-21 19:21 KST" },
    ]
  },
  {
    date: "2026-04-21 13:10 KST",
    summary: "어닝 주간 개막·RTX·NOW 실적 임박·Oracle-AWS 멀티클라우드 협력으로 주간 +30%·TSLA 4/22 Q1 실적 최종 점검",
    changes: [
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "Oracle(ORCL). 4/16 Amazon과 OCI-AWS 인터커넥트 멀티클라우드 네트워킹 협력 발표 — OCI↔AWS 간 고성능 프라이빗 관리 회선 제공, us-east-1에서 연내 개시 예정. 발표 후 주간 약 30% 급등하며 20년 만의 최대 주간 상승폭. 엔터프라이즈 데이터와 AI 워크로드를 Oracle·AWS 양쪽에서 운영하는 대형 고객 락인 강화, Azure·Google Cloud 대비 멀티클라우드 포지션 선점.", time: "2026-04-21 13:10 KST" },
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "ServiceNow(NOW). 4/22 장 마감 후 Q1 2026 실적·컨콜 예정. IT 워크플로우에서 에이전틱 AI 플랫폼으로 확장 내러티브 지속, 대형 엔터프라이즈 Pro Plus·Now Assist 전환 속도와 구독 ARR 성장률이 핵심 지표.", time: "2026-04-21 13:10 KST" },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/22 장 마감 후 Q1 실적·컨콜 한국시간 4/23 오전 6:30. 컨센서스 매출 $22.71B·조정 EPS $0.37 기준선, 분석가들은 EPS를 $0.33까지 낮춰잡기도. Q1 인도 358,023대(컨센 368,903 미스)는 선반영, 핵심 변수는 Terafab 1TW AI 컴퓨트 CapEx 가이던스 상향 여부·Robotaxi 타임라인 신뢰도·AI5 칩 양산 진척·2026 풀해 인도 가이던스.", time: "2026-04-21 13:10 KST" },
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "RTX Corp(RTX). 4/21 장 시작 전 Q1 실적 발표, 컨센 EPS $1.52·매출 YoY +6% 근접. 2026 풀해 조정 매출 $92~93B 유기적 +5~6%·조정 EPS $6.60~6.80·FCF $8.25~8.75B 가이던스가 기준선. 관전 포인트는 Raytheon 섹그먼트 book-to-bill 1.3x 초과 유지 여부 — 중동 긴장 재점화로 패트리엇·SM-6 수요가 수주잔고 $75B 위로 확대되는지 점검.", time: "2026-04-21 13:10 KST" },
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "Lockheed Martin(LMT). 4/23 장 시작 전 Q1 실적·컨콜 오전 8:30 ET. 컨센 EPS $6.73(YoY -7.6%), 수주잔고 $194B 기반 2026 풀해 매출 +5%·영업섹그먼트 이익 +25% 가이던스가 전제. F-35·미사일·THAAD 수주 흐름과 2027 EPS $32.27 궤도 재확인 여부가 핵심.", time: "2026-04-21 13:10 KST" },
      { type: "정보 갱신", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY). Foundayo(오르포글리프론) 출시 2주차 주간 처방 1,390건(4/10 마감 주)로 완만한 램프업 — 반면 Novo Nordisk의 경구 Wegovy는 1/5 출시 후 첫 4일간 3,071건으로 초기 반응이 더 강했음. LLY는 Zepbound 효능 우위(72주 -20.2% vs Wegovy -13.7%) 기반으로 경구 GLP-1 시장 선도 유지하나 초기 처방 전환은 예상보다 느린 속도.", time: "2026-04-21 13:10 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 주말 BTC -2.5% 하락해 월요(4/20) 오픈 $73,820, 이후 오전 9시 ET에 $75,324로 반등. 호르무즈 재봉쇄·미 해군 이란 선박 나포 지정학 헤드라인이 단기 압력, 기관용 BTC ETF 매수세가 하방 방어. Strategy 78만 9천 BTC 평균단가 $75,577 근처에서 단가 공방 지속.", time: "2026-04-21 13:10 KST" },
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 월요(4/20) Brent +5~6% 반등해 $95~96/배럴 재돌파, WTI $90선. 트리거는 트럼프의 이란 국적 컨테이너선 Touska 나포 발표와 이란의 호르무즈 재봉쇄 번복. 2주 휴전 합의가 4/21 화요일 만료 예정이라 지정학 불확실성 피크 구간, XOM·CVX·COP 마진 재확대 랠리 지속.", time: "2026-04-21 13:10 KST" },
    ]
  },
  {
    date: "2026-04-20 19:19 KST",
    summary: "월요 프리마켓 — Brent $95 급등·S&P 선물 -0.8%·NVIDIA-Marvell NVLink Fusion 파트너십·Tesla $400 유지",
    changes: [
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. Brent가 월요 아시아~유럽 장에서 +5~7% 점프해 $95/배럴 돌파, WTI는 $90선 회복. 금요 이란 외무장관의 호르무즈 완전 재개 선언에 -10% 급락했던 직전 흐름이 48시간 만에 완전 리바운드. 트리거는 트럼프의 이란 국적선 Touska 억류·미 해군 USS Spruance 사격 발표, 이란의 호르무즈 재봉쇄 번복. ExxonMobil(XOM)·Chevron(CVX)·ConocoPhillips(COP) 일제히 마진 재확대 구간 복귀, LNG·SLB 동반 재평가. 4/22 이스라엘-레바논 휴전 만료와 4/25 OPEC+ 회의가 연달아 대기.", time: "2026-04-20 19:19 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "NVIDIA(NVDA). 5/20 Q1 FY27 실적 컨센 매출 $78B(±2%) 약 1개월 앞 — Blackwell Ultra·Rubin 풀 프로덕션 전환 구간의 첫 분기 숫자가 공개된다. NAB Show 2026(라스베이거스, 4/18~22)에서 영상 편집 AI 가속 업데이트 병행 전개, Ising 오픈소스 양자 AI 패밀리 채택 기관 확산(Fermilab·Harvard·IQM·NPL 등)도 장기 내러티브로 유지. 5월 FOMC·Q1 어닝 마무리 구간과 맞물려 AI 반도체 사이클의 후기 체크포인트.", time: "2026-04-20 19:19 KST" },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/17 종가 $400.62로 지난 주 +3% 마감, Q1 실적 직전 주 고점 재도전 구간 진입. 4/22 장 마감 후 Q1 실적·컨콜 한국시간 4/23 오전 6:30. 컨센서스 매출은 데이터 소스별로 $22.26~22.71B·조정 EPS $0.37로 수렴. Q1 인도 358k(컨센 366k 미스)는 이미 반영됐고, 시장은 Model Y L 출시·Cybercab 양산 일정·FSD 무감독 승인 주(州) 확대·Terafab CapEx 가이드 상향 여부에 집중.", time: "2026-04-20 19:19 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 주말~월요 BTC $74~76K 박스권, $75K가 단기 저항. 미 스폿 BTC ETF 유출입 소강 국면에서 호르무즈 재폐쇄·미 해군 직접 교전이라는 지정학 변수 복귀로 단기 변동성 확대 예상. 역사적 패턴에선 지정학 충격 시 BTC 단기 하방 후 인플레 헤지 수요 반등. Strategy 78만 9천 BTC 평균단가 $75,577 부근 방어선 재공방 구간.", time: "2026-04-20 19:19 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "월요 프리마켓. S&P 500 선물 -0.8%, Nasdaq100 선물 -0.6%, Dow 선물 -1% — 호르무즈 재봉쇄와 이란 선박 나포로 위험자산 일시 후퇴. 지난 주 S&P +4.54%·Nasdaq +6.84% 후 첫 조정 시도. 이번 주 핵심 이벤트: 4/20 장 마감 후 Steel Dynamics(STLD) Q1 가이던스 EPS $2.73~2.77·Intel(INTC), 4/22 Tesla·Boeing 실적과 Google Cloud Next 개막, 4/24 Intel·American Airlines, 4/25 OPEC+ 화상 회의. 4/22 현 이스라엘-레바논 휴전 만료로 지정학·실적·매크로 삼중 이벤트 주간.", time: "2026-04-20 19:19 KST" },
    ]
  },
  {
    date: "2026-04-20 13:08 KST",
    summary: "호르무즈 해협 재폐쇄·美 Touska 억류 에스컬레이션 — 이스라엘-레바논 휴전 4/22 만료 임박, 원유·방산 리프라이싱 임박",
    changes: [
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 이란이 4/18 미국의 해상봉쇄 해제 거부에 맞서 호르무즈 해협을 재봉쇄. 금요일 재개방 선언이 48시간 만에 번복되며 배송 재중단. 4/19 트럼프는 이란 국적 컨테이너선 Touska를 오만만에서 미 해군 이지스 구축함 USS Spruance가 나포했다고 발표, 선박 엔진룸에 사격 후 접수. 이란군은 '공격자 미국의 해상 강도 행위'라며 보복 경고. 현 휴전 합의는 4/22 수요일 만료 예정이고 파키스탄 2차 회담이 월요일 진행. WTI는 금요 $83선에서 종가 마감했지만 월요 아시아 개장 +5~8% 갭업 가시, ExxonMobil·Chevron·ConocoPhillips 마진 재확대 랠리 구간 복귀 가능.", time: "2026-04-20 13:08 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 4/19~20 주말 BTC는 $75~78K 박스권 지속, 미 스폿 BTC ETF 유출입 소강. 호르무즈 재폐쇄·이지스 구축함 직접 충돌 사건으로 지정학 리스크 프리미엄 복귀 가능성 열림 — 역사적 패턴에선 지정학 충격 시 BTC 단기 하방, 이후 인플레 헤지 수요로 반등. Strategy 78만 9천 BTC 평균단가 $75,577 부근 보유라 단가 공방 구간 재진입.", time: "2026-04-20 13:08 KST" },
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "방산 섹터. 호르무즈 재봉쇄·미 해군 직접 교전(Touska 억류, USS Spruance 사격)으로 중동 긴장 재점화. Lockheed(LMT)·RTX·Northrop(NOC)·L3Harris(LHX) 일제히 추가 패트리엇·SM-6·해상방공·ISR 수요 재평가 구간. Boeing(BA)은 4/22 Q1 실적과 중동 전개 이중 변수 동시 소화.", time: "2026-04-20 13:08 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "주간 프리뷰 재수정. 당초 4/20~24 주간의 최대 이벤트는 Tesla·Boeing·Google Cloud Next였으나, 호르무즈 재폐쇄·美 이란선박 나포로 지정학 축이 전면 복귀. 4/22 현 휴전 만료·4/21 파키스탄 2차 회담이 원유·국채·달러 축 결정. S&P 500 7,041 첫 주 종가의 완만 랠리는 유가 리프라이싱에 검증받을 구간.", time: "2026-04-20 13:08 KST" },
    ]
  },
  {
    date: "2026-04-20 07:16 KST",
    summary: "이번 주 빅테크 어닝 러시 개시 — 4/22 Tesla·Boeing·Google Cloud Next, BTC $75.5~76K 저항 박스권, NVIDIA Ising 오픈소스 양자 AI 모델 공개",
    changes: [
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/22 장 마감 후 Q1 실적 발표 임박, 컨퍼런스콜 한국시간 4/23 오전 6:30. 스트리트 컨센서스 매출 $22.71B·조정 EPS $0.37(Refinitiv Smart Estimate는 $21.52B·$0.30으로 보수적, 서프라이즈 확률 -20.6%). 이미 공개된 Q1 인도 35만 8천대(컨센 36만 9천대 하회)와 생산 40만 8천대가 숫자의 바닥. Barclays Dan Levy는 CapEx 가이던스 상향 여부를 핵심 변수로 지목 — 기존 2026 가이던스 $20B+는 Terafab·Solar fab 미포함, 상향 시 장기 지배력 내러티브 강화. Robotaxi·Cybercab 양산·FSD 무감독 승인 주(州) 범위도 주시.", time: "2026-04-20 07:16 KST" },
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "Boeing(BA). 4/22 장전 Q1 실적·10:30 ET 컨콜. 컨센 매출 $22.1B(+12% YoY)·EPS -$0.39~-$0.63 수준. CFO Jay Malave가 사전 예고한 737 라인 품질 결함(약 25대 영향)에 따른 인도 차질 소화 구간, 반대급부로 상업기 인도 +10% YoY·방산 출하 +15% 회복 모멘텀. 공급망 관세·수출통제 압박은 진행형.", time: "2026-04-20 07:16 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 4/19 주말 BTC가 $75,996에서 안착, $75,000~76,000 저항대가 단기 천장으로 형성. $76K 상방 돌파 시 숏 스퀴즈로 $80,000~84,000 구간 복귀 가시, 하단 지지선은 $70,500. 보유 78만 9천 BTC 평균단가 $75,577 기준 손실폭이 크게 축소됐으나 아직 박스권. 주말 동안 미 스폿 ETF 유출입은 소강.", time: "2026-04-20 07:16 KST" },
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "Alphabet(GOOGL). 4/22~24 라스베이거스 Google Cloud Next 개막, Vertex AI·Gemini·에이전틱 워크플로우 확산이 주제. 컨퍼런스 직후 4/29 Q1 어닝 — 애널리스트는 검색 +16.5%·클라우드 +57.5% YoY를 예상, 에이전틱 코딩·Vertex AI 가격 체계 업데이트가 장기 가이던스의 핵심. 지난 Q4 매출 $113.8B 기록 후 첫 분기.", time: "2026-04-20 07:16 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "NVIDIA(NVDA). Ising 오픈소스 양자 AI 모델 패밀리 공개 — 연구·엔터프라이즈 고객이 유용한 애플리케이션 실행 가능한 양자 프로세서를 구축하도록 지원. 주가 $201선에서 52주 고점 $212 재시도 구간, NAB Show 2026(라스베이거스, 4/18~22)에서 영상 편집 AI 가속 업데이트 동시 전개.", time: "2026-04-20 07:16 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "주간 프리뷰. S&P 500이 7,041로 첫 7,000대 종가 기록 후 첫 주 — 4/20 Steel Dynamics로 어닝 시즌 가볍게 재개, 4/22 Tesla·Boeing·Verizon·AT&T, 4/24 Alphabet·Intel·T-Mobile·American Airlines가 핵심. 블렌디드 S&P 500 Q1 EPS 성장 컨센은 +12.5%. 4/25 OPEC+ 화상 회의에서 5월 증산 속도 재조정이 원자재 축 변수.", time: "2026-04-20 07:16 KST" },
    ]
  },
  {
    date: "2026-04-19 13:12 KST",
    summary: "주말 — BTC $77~78K 반등·미 스폿 BTC ETF 금요 +$664M 수개월 최대·Strategy 보유 단가 회복 구간 진입·WTI $83대 안정",
    changes: [
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 주말 BTC가 $77~78K대에서 반등, 한때 $78,300 터치 후 $76~77K에서 지지. 미 스폿 비트코인 ETF 복합체는 4/17 금요 하루 +$663.9M 순유입(4월 초 이후 최대), IBIT 단독 +$500M대 비중. Strategy 78만 9천 BTC 평균단가 $75,577 손실 구간 빠르게 축소, Coinbase·MARA·RIOT 동반 재평가. 주 초 발표 BTC 보유 확대 가이던스 유지.", time: "2026-04-19 13:12 KST" },
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. WTI가 주말 $83.85 근처에서 안정, 지난 금요 Hormuz 재개방 선언 이후 단기 낙폭 소화 구간. Brent는 $88대에서 거래. 이스라엘-레바논 10일 휴전·이란 2주 휴전 연장 협의는 주말 관측 구도 유지. 다음 주 4/25 OPEC+ 화상 회의에서 5월 증산 속도 재조정 여부가 단기 최대 이벤트.", time: "2026-04-19 13:12 KST" },
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "OpenAI. 4/17 Cerebras와 향후 3년 $20B 이상의 서버 용량 확보 계약 체결 보도, OpenAI가 Cerebras 지분 소수를 취득할 수 있는 워런트 옵션 포함. Stargate 7GW·$400B 인프라와 별개 트랙, Nvidia 의존도를 낮추려는 인프라 다변화 시도로 해석. Cerebras는 IPO를 앞둔 상태에서 재무 가시성 대폭 확대.", time: "2026-04-19 13:12 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "다음 주 관전 포인트. 4/22 Tesla·Boeing·AT&T, 4/23 IBM·ServiceNow, 4/24 Alphabet·Intel·T-Mobile로 이어지는 S&P 500 120개사 Q1 어닝 러시. Tesla 컨센서스 매출 $21.4B·조정 EPS $0.33, Alphabet은 Gemini·TPU·Cloud 가속 확인 구간. 4/25 OPEC+ 회의·4/24 일본 BOJ 회의·ISM 제조업 발표가 매크로 축.", time: "2026-04-19 13:12 KST" },
    ]
  },
  {
    date: "2026-04-19 07:18 KST",
    summary: "주간 결산 — Oracle 1999년 이후 최대 주간 상승 +27%·AMD 13일 연속·IGV 2001년 10월 이후 최고 주간·BTC 스폿 ETF 주간 순유입 $921M",
    changes: [
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "Oracle(ORCL). 지난 한 주 +27%로 1999년 닷컴 고점 이후 최고 주간 성과. AWS 협력 확장·Bloom Energy 2.8GW 연료전지 다년 계약·Stargate 7GW·$400B AI 인프라 투자 기대가 동시 작용. 시가총액 $1T 재진입 시점의 AI 매출 전환 내러티브가 iShares Expanded Tech-Software(IGV) 주간 +14%(2001년 10월 이후 최고)까지 견인.", time: "2026-04-19 07:18 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "AMD(AMD). 4/17까지 13거래일 연속 상승·누적 +41%로 2005년 이래 최장 랠리 유지. 프랑스 Alice Recoque 엑사스케일 슈퍼컴 파트너십·Meta $60B·OpenAI 계약·MI450 2H 런치 모멘텀 중첩. 주간 기준 +13%로 전주 대비 상승폭 확대, 사상 최고가 갱신. Bernstein·Erste 목표가 상향 $289 유지.", time: "2026-04-19 07:18 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). 4/17 주간 약 +15% 마감. Bitcoin이 $78K대까지 반등하며 보유 78만 9천 BTC 평균단가 $75,577 기준 손실 구간을 빠르게 축소, TD Cowen 목표가 $385로 상향. 미 스폿 비트코인 ETF 주간 순유입 $921M(1월 이후 최대)·IBIT 단독 $871M 유입·AUM $58B. COIN·MARA·RIOT 동반 재평가.", time: "2026-04-19 07:18 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "미 증시 주간 결산 — S&P 500 7,126(+4.5%)·Nasdaq 24,468·Dow 49,447(+1,005p 금요 단일 세션). 2025년 5월 이후 최고 주간 성과. VIX 15.5로 3월 고점 대비 -41%. 금요 종가에 Netflix Q2 가이던스 쇼크가 시간외 -9%로 출현했으나 장중 지수는 3대 지수 모두 기록 경신. 다음 주 4/22 Tesla·Boeing·AT&T, 4/24 Intel·Alphabet 어닝 대기.", time: "2026-04-19 07:18 KST" },
    ]
  },
  {
    date: "2026-04-18 13:17 KST",
    summary: "Trump-이란 2주 휴전 연장 협상·Nasdaq 13일 연속 상승 1992년 이래 최장·Netflix Q2 가이던스 쇼크",
    changes: [
      { type: "정보 갱신", sector: "시장",
        detail: "Nasdaq Composite이 4/17까지 13거래일 연속 상승, 1992년 이래 최장 기록. S&P 500은 세 차례 연속 신고점. 트럼프는 Bloomberg 인터뷰에서 이란과 2주 휴전 연장·주말 파키스탄 2차 회담을 예고하며 '이란이 핵 프로그램 무기한 중단에 합의했다'고 발언, 다만 이란 당국자는 우라늄 해외 반출·농축 중단을 부인해 외교 변수는 잔존. 미 해군 봉쇄는 '거래 100% 완료' 시까지 유지.", time: "2026-04-18 13:17 KST" },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/17 Bloomberg 단독 — 3열 6인승 롱휠베이스 Model Y L 내주 출시 임박, 패밀리카 세그먼트 Honda Pilot·Toyota Highlander 정면 경쟁. 스프링 2026 OTA 업데이트 배포 개시(FSD v14 유럽·자체 셀프드라이빙 앱·Grok 웨이크 워드). Musk는 2026년 말까지 미국 25~50% 주(州)에서 무감독 FSD 승인 목표 재확인, 4/22 Q1 어닝콜에서 Cybercab 양산·Robotaxi 확장 로드맵 주목.", time: "2026-04-18 13:17 KST" },
      { type: "정보 갱신", sector: "소비·리테일",
        detail: "Netflix(NFLX). Q1 매출 $12.25B(+16% YoY)·EPS $1.23(컨센 $0.76 대비 62% 상회)로 외형 비트했으나, Q2 EPS 가이던스 $0.78로 컨센 $0.84 하회·매출 가이던스 +13%가 보수적이라는 평가로 시간외 -9%. 2026 광고 매출 $3B 목표(전년比 2배)·연간 $50.7~51.7B 가이던스 유지. 광고주 4,000+·YoY +70%.", time: "2026-04-18 13:17 KST" },
      { type: "정보 갱신", sector: "에너지",
        detail: "WTI 추가 낙폭 확대 — 호르무즈 재개방 이틀차 $81.50대에서 장중 $80.30까지 3/10 이후 최저. Brent도 $89대로 후퇴. 원유 급락은 인플레 압력 완화 요인이나 ExxonMobil·Chevron·ConocoPhillips 마진 재평가는 진행형. 가스 파이프라인·LNG는 단기 약세 지속.", time: "2026-04-18 13:17 KST" },
    ]
  },
  {
    date: "2026-04-18 07:19 KST",
    summary: "이란 호르무즈 재개방 선언 — WTI -10.8% $81.28·Brent -10.3% $89.13·S&P 500 7100 첫 돌파, Dow +1005p(+2.1%) 3주 연속 주간 상승",
    changes: [
      { type: "정보 갱신", sector: "에너지",
        detail: "에너지 섹터. 이란 외무장관 Araqchi가 4/17 호르무즈 해협을 상업선박 전면 재개방한다고 발표(6주 봉쇄 해제, 이스라엘-레바논 10일 휴전 조건). WTI -10.8% $81.28·Brent -10.3% $89.13로 급락, 10년물 국채수익률 4.24%(전일 4.32%)로 하락. ExxonMobil·Chevron·ConocoPhillips 등 정유·E&P 전 구간 마진 재평가 진입, LNG·가스 인프라는 중동 리스크 해소로 단기 약세.", time: "2026-04-18 07:19 KST" },
      { type: "정보 갱신", sector: "시장",
        detail: "미 증시 기록 행진. 호르무즈 재개방 선언으로 Dow +1,005p(+2.1%)·S&P 500 +1.3%로 7,100 최초 돌파·Nasdaq +1.5%, Russell 2000 신고점. VIX는 3월 고점 대비 -41%로 진정, 3주 연속 주간 상승. 7,000 시대 진입 첫 주 +4.5%는 2025년 5월 이후 최고 주간 성과.", time: "2026-04-18 07:19 KST" },
      { type: "정보 갱신", sector: "소비·리테일",
        detail: "Netflix Q1 매출 $12.25B·EPS $1.23으로 컨센($12.18B) 비트, 광고주 4,000개+70% YoY·2026 광고 매출 $3B 목표 유지. 그러나 Q2 EPS 가이던스 $0.78로 컨센($0.84) 하회해 시간외 -9~-10%. 공동창업자 Reed Hastings 이사회에서 6월 임기 만료와 함께 하차 발표.", time: "2026-04-18 07:19 KST" },
    ]
  },
  {
    date: "2026-04-17 19:11 KST",
    summary: "AMD 프랑스 엑사스케일 파트너십, TSMC 호실적으로 +7.8%·12일 연속 +41% 랠리",
    changes: [
      { type: "정보 갱신", sector: "반도체",
        detail: "AMD(AMD). 4/16 +7.80% $278.26로 12일 연속 상승, 누적 +41%로 2005년 이래 최장 랠리. 프랑스 정부와 AI 전략 파트너십 체결 — 프랑스 최초 엑사스케일 슈퍼컴 Alice Recoque에 AMD 기술 공급, 파리 재정부에서 LOI 서명. GENCI·Jules Verne·CEA와 AI Center of Excellence 설립. Bernstein·Erste 목표가 상향(컨센 $289), TSMC Q1 호실적과 Meta $60B·OpenAI 계약이 겹쳐 MI450 하반기 런치 기대감 확대.", time: "2026-04-17 19:11 KST" },
    ]
  },
  {
    date: "2026-04-17 13:04 KST",
    summary: "IonQ DARPA HARQ 수주·광자 얽힘 상용 최초 실증으로 +20%, Novo Nordisk OpenAI 전사 AI 파트너십 체결",
    changes: [
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "IonQ(IONQ). 4/16 주가 +20.16% $35.76로 마감. 두 개의 독립된 트랩된 이온 양자 시스템 간 광자 얽힘을 상용 환경에서 세계 최초 실증, 동시에 DARPA의 고속 양자 인터커넥트 개발 프로그램(HARQ) 계약을 확보. 주간 누적 +50% 급등하며 NVIDIA 오픈소스 AI 모델 발표에 따른 양자 섹터 반등 주도. Q4 2025 매출 $61.89M로 컨센 $40.26M 크게 상회, 연간 GAAP $100M 돌파한 첫 상장 양자 기업. 2026 가이던스 $225~245M. SkyWater $1.8B 인수는 Q2~Q3 클로징 예정.", time: "2026-04-17 13:04 KST" },
      { type: "정보 갱신", sector: "바이오·헬스케어",
        detail: "Novo Nordisk(NVO). 4/14 OpenAI와 전사적 AI 파트너십 체결 — 신약 발굴·제조·공급망·상용 전 영역에 AI 배치. 다만 2026 매출 가이던스를 -5~-13%(환율 중립)로 제시하며 GLP-1 가격 압박 경고, 9천명 감원 진행. Eli Lilly Foundayo 경구제 진입·Wegovy 경구제 주간 5만 처방 수준. 52주 저점 근처에서 AI 변신 승부수.", time: "2026-04-17 13:04 KST" },
    ]
  },
  {
    date: "2026-04-17 07:04 KST",
    summary: "Tesla AI5 칩 테이프아웃 +8%·UBS Hold 상향·FSD 네덜란드 승인, Schwab Q1 기록 실적, ASML Q1 비트, 나스닥 12일 연속 상승",
    changes: [
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). 4/15 AI5 칩 테이프아웃 완료 — Musk가 X에 칩 이미지 공개하며 +8% 급등. AI5는 AI4 대비 10배 성능·9배 메모리, 삼성 텍사스+TSMC 애리조나 팹에서 2H 2026 양산 목표. 초기 탑재 대상은 Optimus 로봇·슈퍼컴퓨터(차량용 FSD는 AI4로 충분). UBS가 Sell→Hold 상향($360 TP). 네덜란드 RDW가 4/10 FSD Supervised 유럽 최초 공도 승인(Level 2), 독일·프랑스·이탈리아 4~8주 내 후속 승인 예상.", time: "2026-04-17 07:04 KST" },
      { type: "정보 갱신", sector: "금융·은행",
        detail: "Charles Schwab(SCHW). Q1 EPS $1.43(컨센 $1.42 소폭 비트)·매출 $6.5B +16%·모든 주요 항목 두 자릿수 성장. 고객자산 $11.8T 사상 최대, 신규 계좌 130만(+10%), 일평균 트레이드 990만 건 기록. 다만 매출이 컨센 $6.6B를 소폭 하회하며 주가 -10% 하락.", time: "2026-04-17 07:04 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "ASML. Q1 매출 €8.77B·EPS €7.15 컨센서스 상회. CEO Fouquet '수요가 공급을 초과하는 상태가 당분간 지속' 발언, AI·스마트폰·PC 전 부문 공급 제약 확인. 연초 대비 +36% 상승.", time: "2026-04-17 07:04 KST" },
    ]
  },
  {
    date: "2026-04-16 19:08 KST",
    summary: "TSMC Q1 2026 어닝콜 완료 — Q2 가이던스 $39~40.2B 상향·GM 상단 66%·26년 USD 매출 +30%·CapEx 상단",
    changes: [
      { type: "정보 갱신", sector: "반도체",
        detail: "TSMC(TSM). 한국시간 4/16 오후 어닝콜에서 Q1 매출 $35.7B(+35% YoY)·GM 66.2%·OM 58.1% 확정. Q2 가이던스 $39.0~40.2B(컨센 $38.1B 상회)·GM 65.5~67.5% 제시, 2026 연간 USD 매출 +30% 근접·$52~56B CapEx는 상단으로 유도. AI 가속기 매출은 2029년까지 mid-to-high 50% CAGR 지속 전망. 장기 GM 목표도 56%+로 상향.", time: "2026-04-16 19:08 KST" },
    ]
  },
  {
    date: "2026-04-16 17:30 KST",
    summary: "Q1 실적 시즌 본격화 — NVIDIA FY26 $216B 확정·Micron HBM4 램프·Goldman·Morgan·BAC 대형은행 일제히 사상 최고",
    changes: [
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "Oracle(ORCL). OCI 성장률 +44% YoY로 앞선 +84% 대비 정상화, RPO $553B·Stargate 7GW 계약·AI 인프라 투자 $400B 규모 공식화. 클라우드 수익성보다 하이퍼스케일 자본집약 경쟁에 방점.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "NVIDIA(NVDA). FY26 매출 $216B 확정, Rubin 풀프로덕션 진입·Blackwell+Rubin 합산 파이프라인 $1T 규모 거론. GTC 2026에서 6개 신규 칩과 Rubin CPX 공개. Micron(MU). Q1 FY26 매출 $13.6B 사상 최대, HBM4 2분기 본격 램프 시작하며 2026년 물량 전량 완판 확인.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "데이터센터",
        detail: "Arista(ANET). 2026 매출 성장 가이던스 25%로 상향 — AI 클러스터 스위칭 수요가 기존 추정치를 계속 상회. CoreWeave(CRWV). NVIDIA 2대주주 지분 참여·Dell과 전략 파트너십 확장으로 GPU 클라우드 자본조달과 공급망 모두 강화.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "원자력·SMR",
        detail: "Vistra(VST). Meta와 2.6GW PPA 체결, Comanche Peak 원전 1.2GW 확장 계획 — 원전+가스 믹스 전력회사 중 AI 데이터센터 수주 선두 굳힘.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY). 경구 GLP-1 Foundayo $149 판매 개시로 Novo Nordisk Wegovy 경구제와 가격 동일 라인업 형성, retatrutide Phase 3 체중감량 데이터 하반기 공개 예정. 경구 GLP-1 파이프라인 1위 포지션 공고화.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). Q1 2026 인도 358K 부진 확정·생산-인도 격차로 재고 16.4만대 누적·Model S/X 단종. 4/22 실적 발표 앞두고 하이브리드(HEV) 성장세에 판매 추월 우려 부각.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "Boeing(BA). Q1 인도 143대(737 114대 포함)로 Airbus 추월, 4/22 실적 발표 예정. Rocket Lab(RKLB). Neutron 첫 비행 4Q26로 재지연됐으나 $816M SDA 수주·국방 프라임으로 전환 가속.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "Strategy(MSTR). BTC 보유량 78만 개 돌파, $1B 추가 매입 공시로 80만 개 임박 — BTC 트레저리 모델 확장 지속.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "사이버보안",
        detail: "Palo Alto(PANW). CyberArk $25B 인수 2/11 완료, ID 시큐리티와 통합 보안 플랫폼 결합 본격화.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "금융·은행",
        detail: "Goldman Sachs(GS). Q1 EPS $17.55·주식트레이딩 매출 $5.33B 사상 최고·IB수수료 +48%. Morgan Stanley(MS). Q1 고객자산 $9T 돌파, $10T 목표로 WM 순유입 강세. Bank of America(BAC). Q1 매출 30.3B +7%·EPS $1.11 +25%·NII $15.7B +9% 전 부문 성장.", time: "2026-04-16 17:30 KST" },
      { type: "정보 갱신", sector: "소비·리테일",
        detail: "Lululemon(LULU). 2026 가이던스 하향·Texas 주 회계 관련 조사 보도 — 프리미엄 애슬레저 성장 둔화와 규제 리스크 동시 부각.", time: "2026-04-16 17:30 KST" },
    ]
  },
  {
    date: "2026-04-16 11:49 KST",
    summary: "Tesla Q1 2026 인도 358K 확정, Model S/X 단종, 4/22 실적발표 앞둔 시장 우려",
    changes: [
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). Q1 2026 인도 358,023대 확정(전년 동기 336,681대 +6.3%, 월스트리트 컨센 369K 하회). 생산 408K vs 인도 358K로 재고 5만대 누적, JPMorgan 164K 미판매 재고 경고. 4/1 Model S·Model X 단종(로봇·CyberCab 집중). 4/22 Q1 실적발표 예정, TD Cowen 가이던스 하향 리스크 낮다 평가하나 현금소진 $7B·TeraFab 투자 부담 부각.", time: "2026-04-16 11:49 KST" },
    ]
  },
  {
    date: "2026-04-16 10:30 KST",
    summary: "NVIDIA H20 관련 $5.5B Q1 차지 SEC 공시 확정, TSMC 오늘 15시(KST) Q1 어닝콜",
    changes: [
      { type: "정보 갱신", sector: "반도체",
        detail: "NVIDIA(NVDA). 4/15 장마감 후 SEC 8-K 공시로 H20 관련 $5.5B Q1 차지(회계연도 FY26 Q1, 4/27 종료 분기) 확정 — 재고·구매약정·관련 충당금이 구성. 美 상무부 4/9 통지·4/14 '무기한 유지' 재통보로 라이선스 요건이 사실상 금수로 작용. 시간외 -6% 반응, 정규장 전 반등 시도. Blackwell Ultra 풀가동·Rubin 샘플 출하 펀더멘털은 유지, 다만 2026 상반기 중국향 매출 공백은 구조화.", time: "2026-04-16 10:30 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "TSMC(TSM). 한국시간 오늘 15:00(타이베이 14:00)에 Q1 2026 공식 어닝콜. Q1 매출 $35.71B(자체 가이던스 상단) 이미 공시됐고, 시장은 Q2 가이던스 $37~38B·2026 연간 매출 'USD 기준 +30% 근접' 재확인·기존 $52~56B 캐펙스 가이던스 유지 여부에 주목. N2 HVM 연말 가동·A16(GAA+BSPDN) 2H26 양산 준비, Rubin 샘플 출하 개시가 추가 촉매.", time: "2026-04-16 10:30 KST" },
    ]
  },
  {
    date: "2026-04-16 01:15 KST",
    summary: "IonQ SkyWater $1.8B 인수, Eli Lilly retatrutide Phase 3 데이터",
    changes: [
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "IonQ(IONQ). 1월 26일 SkyWater Technology를 약 $1.8B(현금+주식)에 인수 발표 — 세계 최초 풀스택 수직통합 양자 플랫폼 탄생. 미네소타·플로리다·텍사스 3개 지역 Quantum Production Hub로 전환, Q2~Q3 클로징 예정. SkyWater는 중립 파운드리 지위를 유지하며 IonQ 제품을 외부 고객에도 공급, 미국산 양자 공급망 자립 구조 구축.", time: "2026-04-16 01:15 KST" },
      { type: "정보 갱신", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY). 경구 GLP-1 Foundayo(orforglipron) 4월 6일 FDA 승인·출시 완료, Wegovy 경구제 대비 식이 제한 없는 복용 편의성으로 시장 차별화. 삼중 작용제 retatrutide Phase 3 최고용량 체중감량 28.7%(71.2 lbs) 달성 발표 — 동급 최강 감량 효과 확인. Novo Nordisk(NVO) 연초 대비 -25% 하락하며 경구 GLP-1 시장 리더십 LLY로 이동.", time: "2026-04-16 01:15 KST" },
    ]
  },
  {
    date: "2026-04-15 21:38 KST",
    summary: "Morgan Stanley·BAC Q1 2026 실적, ASML Q1·가이던스 상향",
    changes: [
      { type: "정보 갱신", sector: "금융·은행",
        detail: "Morgan Stanley(MS) Q1 2026 실적 발표. 순매출 $20.6B 사상 최고(컨센 $19.23B 상회), 순익 $5.57B(+29% YoY), EPS $3.43(컨센 $2.95 큰 폭 상회). Institutional Securities IB수수료 +36%, M&A 어드바이저리 +74%. Wealth Management 순유입 $118B 기록적·ROTCE 27.1%. 자사주 매입 $1.75B·배당 $1.00. FY26E 컨센서스 매출 $66B → $70B, 순익 $14.5B → $16B 상향.", time: "2026-04-15 21:38 KST" },
      { type: "정보 갱신", sector: "금융·은행",
        detail: "Bank of America(BAC) Q1 2026 실적 발표. 순매출 $30.3B(YoY +7%, 컨센 $29.93B 상회), 순익 $8.6B, EPS $1.11(컨센 $1.00 비트)로 20년 내 분기 최고치. NII $15.9B(+9%), 에쿼티 트레이딩 +30%, GWIM 매출 $6.7B(+12%)·고객자산 $4.6T(+10%). 충당금 $1.3B로 개선. CEO Moynihan '소비 건전' 코멘트. FY26E 컨센서스 매출 $110B → $113B, 순익 $31B → $33B 상향.", time: "2026-04-15 21:38 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "ASML. Q1 2026 순매출 €8.8B(가이던스 내), 순익 €2.8B, GM 53.0%(가이던스 상단). EUV 16대 포함 79대 출하. 2026 연간 가이던스 €34~39B → €36~40B로 상향, GM 51~53%. Q2 가이던스 €8.4~9.0B. AI 수요로 로직·메모리 고객 CapEx 가속, 수주 강세 지속. FY26E 컨센서스 매출 €40B → €42B, 순익 €11B → €12B 상향.", time: "2026-04-15 21:38 KST" },
    ]
  },
  {
    date: "2026-04-15 20:14 KST",
    summary: "AMD·NVDA·TSMC 주요 반도체주 — Meta $60B 딜·H20 라이선스·TSMC N2 램프",
    changes: [
      { type: "정보 갱신", sector: "반도체",
        detail: "AMD — Meta와 6GW 규모·약 $60B 장기 공급 계약 체결(MI450 Instinct GPU + 6세대 EPYC 'Venice' 2nm CPU 조합, Helios 랙 아키텍처). 2H26 첫 1GW 출하 개시, Meta에 최대 10% 지분 워런트 구조 포함. FY26E 컨센서스 매출 $32B → $34B, 순익 $5.0B → $5.5B 상향.", time: "2026-04-15 20:14 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "NVIDIA(NVDA) — 美 상무부 4/15 발효 H20 중국 수출 라이선스 의무화로 단기 중국 매출 약 $5.5B 노출. 시간외 -6% 반응. 다만 Blackwell Ultra 풀가동·Rubin 백로그 유지, 4/14까지 10거래일 연속 상승($188 근방).", time: "2026-04-15 20:14 KST" },
      { type: "정보 갱신", sector: "반도체",
        detail: "TSMC(TSM). 4/10 Q1 매출 $35.71B(YoY +35%, 자체 가이던스 $34.6~35.8B 상단) 사상 최대. 3월 단월 +45.2% YoY로 AI·N2 램프 가속. N2 HVM 2025 Q4 가동 후 스마트폰·HPC 수요 강세, A16(GAA+백사이드전력) 2H26 양산 준비. 4/16 어닝콜 예정.", time: "2026-04-15 20:14 KST" },
    ]
  },
  {
    date: "2026-04-15 19:10 KST",
    summary: "BlackRock Q1 2026 실적 발표 (AUM $13.9T 사상 최고·iShares 순유입 $132B 기록)",
    changes: [
      { type: "정보 갱신", sector: "금융·은행",
        detail: "BlackRock(BLK). Q1 2026 매출 $6.70B(컨센 $6.46B 상회, YoY +27%), 조정 EPS $12.53(컨센 $11.48 비트), AUM $13.9T 사상 최고, 분기 순유입 $130B·iShares ETF 순유입 $132B 분기 기록. 장기 유기적 자산 성장률 13% LTM(전년 3%에서 가속). CEO Fink '가장 강력한 시작 중 하나' 코멘트·미국 주식 bullish 스탠스로 전환." },
    ]
  },
  {
    date: "2026-04-15 12:40 KST",
    summary: "Oracle·NVIDIA·Lilly·Tesla — Stargate 확장·Rubin 대형 수주·Foundayo 출시·Q1 인도 하회",
    changes: [
      { type: "정보 갱신", sector: "AI 플랫폼",
        detail: "Oracle(ORCL). FY26 Q3 실적(2월 말 종료) 기준 RPO $523B → $553B(YoY +325%), OCI 매출 $4.9B(YoY +84%)로 가속. Stargate 프로젝트는 Abilene 1.2GW 가동 중이며 전체 계획 용량 7GW로 확대, 누적 투자 $400B 수준." },
      { type: "정보 갱신", sector: "반도체",
        detail: "NVIDIA(NVDA). Blackwell Ultra 풀가동·수요 폭증 지속, 4/9 Meta–CoreWeave와 Vera Rubin 기반 클러스터 조기 용량 확보 계약($21B) 확인. Blackwell+Rubin 누적 판매 $1T 전망(~2027)." },
      { type: "정보 갱신", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY). 경구 GLP-1 Foundayo(orforglipron) 4/1 FDA 승인·4/9 시장 출시(최저가 $149/월, 개인보험/저축카드로 월 $25 수준). Mounjaro 2025 매출 약 $23B, Zepbound와 합산 GLP-1 매출 $36B. 7/1 Medicare Part D GLP-1 커버리지 확대가 추가 촉매." },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Tesla(TSLA). Q1 2026 글로벌 인도 약 336K(컨센서스 370K 하회), 생산-인도 갭 약 50K 발생. CyberCab 신공법 기반 Q4 2026 양산 시작 계획($25K 엔트리, Fremont 인접 신공장), 4/22 어닝콜 예정." },
    ]
  },
  {
    date: "2026-04-15 10:46 KST",
    summary: "JPMorgan Q1 2026 최종 실적 추가(매출 50.5B로 상향, 트레이딩 부문 사상 최고)",
    changes: [
      { type: "정보 갱신", sector: "금융·은행",
        detail: "JPMorgan(JPM) Q1 2026 최종 발표. 순매출 $50.5B(YoY +8%, 컨센 상회), 순익 $16.5B, 트레이딩 부문 매출 $11.6B로 분기 사상 최고(YoY +20%). FICC·주식 모두 컨센 상회. 다만 NII 풀이어 가이던스를 $103B로 소폭 하향 조정해 주가는 시간외 -1%. FY26E 컨센서스 매출 $192B → $193B, 순익 $56B → $58B 추가 상향." },
    ]
  },
  {
    date: "2026-04-14 20:35 KST",
    summary: "Wells Fargo Q1 2026 실적 발표",
    changes: [
      { type: "정보 갱신", sector: "금융·은행",
        detail: "Wells Fargo(WFC) Q1 2026 실적 발표. 순매출 $21.45B(YoY +6%, 컨센 $21.76B 소폭 하회), 조정 EPS $1.60(컨센 $1.58 상회). 순이자수익 $12.1B(+5%), 비이자수익 $9.35B(+8%), 평균 대출 $996B(+10%), 평균 예금 $1.42T(+6%), ROE 12.2%로 전년 11.5%에서 개선. CEO Scharf '투자 결실' 코멘트. FY26E 컨센서스 매출 $87B → $88B, 순익 $21B → $22B 소폭 상향." },
    ]
  },
  {
    date: "2026-04-14 14:25 KST",
    summary: "JPMorgan Q1 2026 실적 발표",
    changes: [
      { type: "정보 갱신", sector: "금융·은행",
        detail: "JPMorgan(JPM) Q1 2026 실적 발표. 순매출 $49.2B(YoY +8%), 순익 $16B, EPS $5.42(컨센서스 $5.15 상회). 투자은행·NII 동반 성장, 주가 사상 최고($248.50, +4.2%). Jamie Dimon 후계자 선정 공식화." },
    ]
  },
  {
    date: "2026-04-14 14:12 KST",
    summary: "Goldman Sachs Q1 2026 실적 발표, FY26E 컨센서스 상향",
    changes: [
      { type: "상향", sector: "금융·은행",
        detail: "Goldman Sachs(GS) Q1 2026 실적 발표. 순매출 $17.23B(YoY +14%, 역대 2위), 순익 $5.63B(YoY +19%), EPS $17.55(컨센서스 $16.47 상회). 주식트레이딩 $5.33B 사상 최고(+27%), IB수수료 $2.84B(+48%), M&A 어드바이저리 글로벌 1위. FY26E 컨센서스 매출 $60B → $63B, 순익 $16B → $18B." },
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
    summary: "TSMC Q1 사상 최대 실적 발표",
    changes: [
      { type: "정보 갱신", sector: "반도체",
        detail: "TSMC(TSM). Q1 2026 매출 $35.6B(NT$1.13T), YoY +35%, 가이던스 상단 적중. 3월 단월 +45.2%로 가장 강한 성장. AI칩 수요가 성장 전량 견인. 4/16 실적 콘퍼런스콜에서 연간 가이던스 상향 기대." },
    ]
  },
  {
    date: "2026-04-13 02:26 KST",
    summary: "종목 정보 갱신 3건 (AMZN·GS·NVO)",
    changes: [
      { type: "정보 갱신", sector: "소비·리테일",
        detail: "Amazon(AMZN). CEO Jassy 4/9 주주서한 — Trainium 칩 사업 연환산 매출 $20B 돌파, Trainium2 전량 소진·Trainium3도 거의 완판, 서드파티 랙 판매 검토 시사." },
      { type: "정보 갱신", sector: "금융·은행",
        detail: "Goldman Sachs(GS). Q1 2026 IB 백로그 4년 최고, 어드바이저리+언더라이팅 수수료 $2.42B(+26% YoY) 예상. 4/13 실적 발표 예정." },
      { type: "정보 갱신", sector: "바이오·헬스케어",
        detail: "Novo Nordisk(NVO). Wegovy 경구제 1월 출시($149/월), 주 5만건 처방. 단 Q4 매출 YoY -7.6%, 9,000명 감원으로 구조조정 병행." },
    ]
  },
  {
    date: "2026-04-13 01:30 KST",
    summary: "PLUG 제외·BE 편입, 종목 정보 갱신 8건",
    changes: [
      { type: "종목 교체", sector: "친환경·청정기술",
        detail: "Plug Power(PLUG) 제외 → Bloom Energy(BE) 편입. DOE $1.66B 대출 관련 증권 사기 집단소송(2026-02 제기), 2023년 SEC 재무보고 위반 과징금 이력. 주가 $1.80 수준, 애널리스트 컨센서스 하향." },
      { type: "정보 갱신", sector: "바이오·헬스케어",
        detail: "Eli Lilly(LLY). FDA, 경구 GLP-1 Foundayo(orforglipron) 4/1 승인. 기존 Zepbound 대신 Foundayo로 교체." },
      { type: "정보 갱신", sector: "사이버보안",
        detail: "Palo Alto(PANW) CyberArk $25B 인수 완료(2/11). FY26E 매출 $10.5B → $11B(CyberArk 5개월분 기여)." },
      { type: "정보 갱신", sector: "양자·크립토",
        detail: "MicroStrategy → Strategy Inc 사명 변경. BTC 보유량 76.7만개(4/6 기준)." },
      { type: "상향", sector: "AI 플랫폼",
        detail: "Meta(META) FY26E 매출 $230B → $235B, 순익 $68B → $72B. Q1 2026 가이던스 $53.5~56.5B로 컨센서스 $51.3B 상회." },
      { type: "정보 갱신", sector: "데이터센터",
        detail: "CoreWeave(CRWV) 백로그 $66.8B(전년 대비 300%↑). FY26 가이던스 $12~13B 유지." },
      { type: "정보 갱신", sector: "자동차·모빌리티",
        detail: "Rivian(RIVN) R2 양산 개시, 4월 직원 인도 시작. FY26 인도 가이던스 62~67K대 재확인." },
      { type: "정보 갱신", sector: "항공우주·방산",
        detail: "Rocket Lab(RKLB) $474M 유상증자 완료(4/8). SDA $1.3B 위성 계약, HASTE $190M 극초음속 시험 수주." },
    ]
  },
  {
    date: "2026-04-12 23:00 KST",
    summary: "FY25 확정 실적 및 FY26E 컨센서스 전면 갱신",
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
        detail: "GE Vernova(GEV) FY26E 매출 $44.5B → $45B. 회사 가이던스 $44~$45B 기준." },
    ]
  },
  {
    date: "2026-04-12 15:00 KST",
    summary: "18 카테고리 108 종목 체제 확립, FY25 실적 대규모 갱신",
    changes: [
      { type: "수치 갱신", sector: "전체",
        detail: "FY25 실적 확정분 일괄 갱신: MSFT·GOOGL·META·AMZN·XOM·TSLA·BA·AVGO·TSM·LLY·JPM·V·MA·WMT·COST." },
      { type: "상향", sector: "반도체",
        detail: "NVIDIA(NVDA) FY27E 컨센서스 상향(매출 $335B / 순익 $190B). Micron(MU) HBM 슈퍼사이클 상향($75B)." },
      { type: "상향", sector: "AI 플랫폼",
        detail: "Palantir(PLTR) 2026 가이던스 $7.2B 상향. 미 상업 매출 YoY 137% 성장." },
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
