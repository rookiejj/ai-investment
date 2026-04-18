// Global ETF Atlas - Update Log
const updates = [
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
    summary: "카테고리당 ETF 5→7종 확장(Top7 일관성). 16개 신규 편입 + 기존 수치 전반 갱신",
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
    summary: "미국 대형주 ETF YTD 갱신(SPY -4%·QQQ +1%) + IBIT AUM·YTD 소폭 정정",
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
    summary: "AI·반도체 ETF AUM 상향 + QQQ AUM 갱신",
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
