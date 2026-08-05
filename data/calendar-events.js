// Calendar Events — 캘린더 전용 알려진 이벤트 / 정기 매크로 / 어닝·IPO·컴퍼런스
//
// 데이터 분류:
//   - recurring: 정기 패턴 (매주, 월N번째요일 등) → 렌더 시 다음 발생일 자동 계산
//   - fixed:     구체 날짜 1회성 이벤트 (어닝·IPO·컴퍼런스 등 일정 알려진 것)
//
// 다일 윈도우 이벤트는 시작·종료일을 별도 fixed 항목 두 개로 등록할 것
// (예: 'X 윈도우 시작' + 'X 마감'). 윈도우 안 모든 날짜에 채우는 dateRanges는
// 동일 항목이 연속 반복되어 노이즈가 커지므로 폐기.
//
// 카테고리(cat): earnings·ipo·policy·product·conf·macro·other
// 중요도(impact): 1(low) ~ 3(high)
//
// 자동 갱신 정책: 새 fixed 이벤트는 자동 갱신 에이전트가 update.js와 별개로 추가 가능.
// recurring 패턴은 사람이 직접 변경 (Fed 일정 변경 등). 모든 시각은 KST 기준.

const recurring = [
  // === 미국 매크로 (정기) ===
  { cat:'macro', impact:1, title:'미국 주간 신규 실업수당',
    schedule:{type:'weekly', dow:4} }, // 매주 목요일 (KST 21:30)
  { cat:'macro', impact:3, title:'미국 NFP 비농업 고용 보고서',
    schedule:{type:'monthly_nth_dow', n:1, dow:5} }, // 매월 첫째 금요일
  { cat:'macro', impact:2, title:'미국 ADP 민간 고용',
    schedule:{type:'monthly_nth_dow', n:1, dow:3} }, // 매월 첫째 수요일
  { cat:'macro', impact:1, title:'미국 ISM 제조업 PMI',
    schedule:{type:'monthly_business_day', n:1} }, // 매월 첫 영업일
  { cat:'macro', impact:1, title:'미국 ISM 서비스 PMI',
    schedule:{type:'monthly_business_day', n:3} }, // 매월 셋째 영업일
  { cat:'macro', impact:1, title:'미국 NFIB 소기업 낙관지수',
    schedule:{type:'monthly_nth_dow', n:2, dow:2} }, // 매월 둘째 화요일
  { cat:'macro', impact:2, title:'미국 미시간대 소비자심리·인플레 기대 1차',
    schedule:{type:'monthly_nth_dow', n:2, dow:5} }, // 매월 둘째 금요일 (잠정)
  { cat:'macro', impact:1, title:'미국 필라델피아 연준 제조업지수',
    schedule:{type:'monthly_nth_dow', n:3, dow:4} }, // 매월 셋째 목요일
  { cat:'macro', impact:1, title:'미국 미시간대 소비자심리 확정',
    schedule:{type:'monthly_nth_dow', n:4, dow:5} }, // 매월 넷째 금요일 (확정)
  { cat:'macro', impact:2, title:'미국 컴퍼런스보드 소비자신뢰지수',
    schedule:{type:'monthly_nth_dow', n:4, dow:2} }, // 매월 넷째 화요일경

  // === 한국 매크로 (정기) ===
  { cat:'macro', impact:2, title:'한국 수출입 잠정',
    schedule:{type:'monthly_day', day:1} }, // 매월 1일
  { cat:'macro', impact:1, title:'한국 수출입 확정',
    schedule:{type:'monthly_day', day:15} }, // 매월 15일

  // === 글로벌 정기 ===
  { cat:'macro', impact:1, title:'중국 차이신 PMI',
    schedule:{type:'monthly_day', day:5} }, // 매월 5일경
];

// 향후 60일 알려진 1회성 이벤트들 (KST 날짜)
// 주의: 자동 갱신 에이전트가 새 정보 발견 시 여기에 추가 가능. 지난 이벤트는 정리 안 해도 무방
//       (렌더 시 오늘 이후만 자동 표시).
const fixed = [
  // === 5월 매크로 ===
  { cat:'policy', impact:3, title:'美·이란 14개항 양해각서 응답 마감', date:'2026-05-08', desc:'5/6 백악관 보도 48시간 윈도우·호르무즈 통항 정상화 단일 분기점' },
  { cat:'macro', impact:3, title:'미국 4월 NFP 비농업 고용', date:'2026-05-08', desc:'4월 고용 시그널·5/14 CPI 직전 매크로' },
  { cat:'macro', impact:2, title:'중국 4월 CPI·PPI', date:'2026-05-11', desc:'주말 시프트로 월요일 발표' },
  { cat:'macro', impact:3, title:'미국 4월 CPI', date:'2026-05-12', desc:'BLS 8:30 ET·근원 CPI MoM 컨센 +0.3%·헤드라인 YoY +3.7% 추정' },
  { cat:'macro', impact:2, title:'미국 4월 PPI', date:'2026-05-13', desc:'근원 PPI 동반 발표' },
  { cat:'macro', impact:2, title:'유로존 1Q GDP 1차', date:'2026-05-14' },
  { cat:'policy', impact:3, title:'트럼프-시진핑 베이징 정상회담 (1일차)', date:'2026-05-14', desc:'이란·호르무즈 단일 의제·관세·희토류 후순위·Musk/Cook/Fink/Huang CEO 동행' },
  { cat:'policy', impact:3, title:'트럼프-시진핑 베이징 정상회담 (2일차)', date:'2026-05-15', desc:'AI 리스크·안전 프레임 첫 등장 가능성·SpaceX/Apple/BlackRock/NVIDIA CEO 동행' },
  { cat:'policy', impact:2, title:'트럼프 베이징 출국 + 메가캡 CEO 동행', date:'2026-05-13', desc:'Musk·Tim Cook·Larry Fink·Jensen Huang 동행 발표' },
  { cat:'earnings', impact:2, title:'BABA Q4 FY26 실적', date:'2026-05-13', desc:'장전 발표·알리바바 클라우드 AI 모멘텀', tickers:['BABA'] },
  { cat:'policy', impact:2, title:'트럼프 이란 평화 응답 거부', date:'2026-05-10', desc:'5/7 14개항 안 응답에 \'TOTALLY UNACCEPTABLE\' - 호르무즈 의제 정상회담 톱 부상' },
  { cat:'macro', impact:2, title:'아람코 Q1 실적·CEO 공급 차질 경고', date:'2026-05-10', desc:'나세르 \'수 주 이상 차질 시 2027년까지 정상화 불가\' 단일 경고' },
  { cat:'earnings', impact:2, title:'AMAT Q2 FY26 실적', date:'2026-05-14', desc:'장후 발표·반도체 장비 사이클·HBM 수요', tickers:['AMAT'] },
  { cat:'macro', impact:2, title:'미국 4월 소매판매', date:'2026-05-15', desc:'소비 모멘텀 핵심 지표' },
  { cat:'macro', impact:1, title:'미국 4월 산업생산', date:'2026-05-15' },
  { cat:'macro', impact:1, title:'미국 5월 미시간대 소비자심리 1차', date:'2026-05-16' },
  { cat:'macro', impact:2, title:'미국 4월 주택착공·건축허가', date:'2026-05-19' },
  { cat:'macro', impact:2, title:'일본 1Q GDP 1차 추정', date:'2026-05-18', desc:'BOJ 6월 회의 가이드 후방 지표' },
  { cat:'macro', impact:3, title:'4/29-30 FOMC 의사록 공개', date:'2026-05-21', desc:'5월 회의 톤·6월 회의 가이드' },
  { cat:'macro', impact:2, title:'미국 4월 신규주택판매', date:'2026-05-26' },
  { cat:'macro', impact:1, title:'미국 5월 컴퍼런스 보드 소비자신뢰지수', date:'2026-05-27' },
  { cat:'macro', impact:2, title:'한국 BOK 5월 금융통화위원회', date:'2026-05-28', desc:'기준금리 결정' },
  { cat:'macro', impact:3, title:'미국 1Q GDP 2차 추정', date:'2026-05-29' },
  { cat:'macro', impact:3, title:'미국 4월 PCE 물가', date:'2026-05-30', desc:'Fed 선호 인플레 지표' },

  // === 6월 매크로 ===
  { cat:'macro', impact:3, title:'미국 5월 NFP 비농업 고용', date:'2026-06-05', desc:'5월 첫 금요일' },
  { cat:'macro', impact:3, title:'미국 5월 CPI', date:'2026-06-11' },
  { cat:'macro', impact:2, title:'미국 5월 PPI', date:'2026-06-12', desc:'근원 PPI 동반 발표' },
  { cat:'macro', impact:2, title:'미국 5월 소매판매', date:'2026-06-17', desc:'전월·전년·근원 동시 발표·소비 모멘텀 핵심 지표' },
  { cat:'macro', impact:3, title:'6월 FOMC 결과·점도표·SEP', date:'2026-06-18', desc:'KST 오전 3시·기준금리 결정 + 분기 경제전망' },
  { cat:'policy', impact:1, title:'미국 노예해방일 준틴스 (휴장)', date:'2026-06-19', desc:'NYSE·Nasdaq 휴장' },
  { cat:'macro', impact:2, title:'미국 5월 기존주택판매', date:'2026-06-22' },
  { cat:'macro', impact:3, title:'MSCI 6월 분기 리뷰·한국 비중', date:'2026-06-23', desc:'한국 패시브 유입·외국인 플로 단일 분기점' },
  { cat:'macro', impact:2, title:'미국 5월 신규주택판매', date:'2026-06-24' },
  { cat:'macro', impact:3, title:'미국 1Q GDP 확정치', date:'2026-06-25', desc:'3차 추정' },
  { cat:'earnings', impact:2, title:'마이크론 FQ3 실적', date:'2026-06-25', desc:'장후 발표·HBM·DDR5 수요 점검대', tickers:['MU'] },
  { cat:'macro', impact:3, title:'미국 5월 PCE 물가', date:'2026-06-26', desc:'Fed 선호 인플레 지표' },
  { cat:'other', impact:3, title:'캐나다 CPSP 잠수함 60조 우협 발표 윈도우', date:'2026-06-30', desc:'한화오션·HD현대중공업 vs 獨 TKMS 양자 결전' },

  // === 5월 어닝 ===
  { cat:'earnings', impact:3, title:'AMD Q1 2026 실적', date:'2026-05-05', desc:'장후 발표·MI450 캐파·OpenAI 6GW + Meta 6GW 주문', tickers:['AMD'] },
  { cat:'earnings', impact:2, title:'PLTR Q1 2026 실적', date:'2026-05-04', desc:'매출 +85%·미 상업 +133%·FY26 +71% 가이던스', tickers:['PLTR'] },
  { cat:'earnings', impact:2, title:'MSTR Q1 2026 실적', date:'2026-05-05', desc:'장후 발표·세일러 BTC 주간 매수 일시 중단 후 결과', tickers:['MSTR'] },
  { cat:'earnings', impact:2, title:'DIS Q2 FY26 실적', date:'2026-05-06', desc:'장전 발표·신임 D\'Amaro 첫 콜·매출 $24.8B·EPS $1.49 컨센', tickers:['DIS'] },
  { cat:'earnings', impact:2, title:'UBER Q1 2026 실적', date:'2026-05-06', desc:'장전 발표·매출 $13.27B·EPS $0.71·총예약 $52~53.5B 컨센', tickers:['UBER'] },
  { cat:'earnings', impact:2, title:'CRWV Q1 2026 실적', date:'2026-05-07', desc:'장후 발표·컨센 매출 $1.97B +100%·EPS -$0.89·옥션 ±17% 변동성', tickers:['CRWV'] },
  { cat:'earnings', impact:2, title:'TTD Q1 2026 실적', date:'2026-05-07', desc:'장후 5pm ET·매출 $678M·EBITDA $195M 가이던스·Publicis 후폭풍 점검', tickers:['TTD'] },
  { cat:'earnings', impact:1, title:'MCHP Q1 FY26 실적', date:'2026-05-07', desc:'장후 발표·EPS $0.50·매출 $1.26B 컨센', tickers:['MCHP'] },
  { cat:'earnings', impact:2, title:'WMT Q1 FY27 실적', date:'2026-05-15', desc:'관세 영향·소비 건전성 점검대', tickers:['WMT'] },
  { cat:'earnings', impact:2, title:'HD Q1 2026 실적', date:'2026-05-19', tickers:['HD'] },
  { cat:'earnings', impact:1, title:'TGT Q1 2026 실적', date:'2026-05-21', tickers:['TGT'] },
  { cat:'earnings', impact:3, title:'NVDA Q1 FY27 실적', date:'2026-05-20', desc:'장후 D-Day·컨센 매출 $78.5B +78% YoY·Rubin 풀프로덕션', tickers:['NVDA'] },
  { cat:'earnings', impact:1, title:'CRM Q1 FY27 실적', date:'2026-05-28', tickers:['CRM'] },
  { cat:'earnings', impact:1, title:'COST Q3 FY26 실적', date:'2026-05-29', tickers:['COST'] },
  { cat:'earnings', impact:2, title:'Cisco Q3 FY26 실적', date:'2026-05-13', desc:'장후 발표·AI 네트워킹 모멘텀', tickers:['CSCO'] },
  { cat:'earnings', impact:1, title:'Palo Alto Q3 FY26 실적', date:'2026-05-26', desc:'CyberArk 통합 효과·5/19에서 연기', tickers:['PANW'] },
  { cat:'earnings', impact:1, title:'Snowflake Q1 FY27 실적', date:'2026-05-22', tickers:['SNOW'] },
  { cat:'earnings', impact:2, title:'LOW Q1 2026 실적', date:'2026-05-21', desc:'TGT와 동일일', tickers:['LOW'] },
  { cat:'earnings', impact:1, title:'TJX Q1 2026 실적', date:'2026-05-22', tickers:['TJX'] },
  { cat:'earnings', impact:2, title:'한화에어로스페이스 Q1 콜', date:'2026-05-06', desc:'Q1 5.75조·OP 6,389억 +21% 베이스', tickers:['012450'] },

  // === 한국 어닝·이벤트 ===
  { cat:'earnings', impact:2, title:'카카오 Q1 실적', date:'2026-05-08', tickers:['035720'] },
  { cat:'earnings', impact:2, title:'NAVER Q1 실적', date:'2026-05-08', tickers:['035420'] },
  { cat:'earnings', impact:1, title:'삼성SDI Q1 실적', date:'2026-05-12', tickers:['006400'] },

  // === IPO·펀딩 ===
  { cat:'ipo', impact:3, title:'SpaceX S-1 정식 제출 윈도우 시작', date:'2026-05-15', desc:'5/15~5/22, 6/8 로드쇼' },
  { cat:'ipo', impact:3, title:'SpaceX S-1 제출 마감', date:'2026-05-22' },
  { cat:'ipo', impact:3, title:'SpaceX 로드쇼 시작', date:'2026-06-08', desc:'6/11 리테일 투어, 6/18~30 프라이싱' },
  { cat:'ipo', impact:3, title:'Anthropic $40~50B 라운드 마감 추정', date:'2026-05-14', desc:'$850~900B 밸류, 5월 보드 미팅' },
  { cat:'ipo', impact:2, title:'Cerebras IPO 프라이싱 추정', date:'2026-05-22', desc:'CBRS, $35B+ 밸류, $3B+ 조달', tickers:['CBRS'] },

  // === 컴퍼런스·신제품 ===
  { cat:'conf', impact:3, title:'OpenAI Dev Day 2026 (예상)', date:'2026-05-15', desc:'GPT-5.5 라인업·Codex 확장' },
  { cat:'conf', impact:3, title:'Microsoft Build 2026', date:'2026-05-19', desc:'Azure AI·Copilot·Foundry' },
  { cat:'conf', impact:3, title:'Google I/O 2026', date:'2026-05-20', desc:'Gemini·Android·TPU 8세대' },
  { cat:'conf', impact:2, title:'NVIDIA Computex 키노트', date:'2026-05-19', desc:'대만 컴퓨텍스 본 행사' },
  { cat:'conf', impact:3, title:'Apple WWDC 2026', date:'2026-06-08', desc:'iOS 27·macOS·Gemini-Siri 차세대 (~6/12)' },
  { cat:'product', impact:3, title:'SpaceX Starship V3 첫 비행', date:'2026-05-19', desc:'18:30 ET Starbase Pad 2·Flight 12·Raptor 3' },
  { cat:'ipo', impact:3, title:'SpaceX S-1 공개 가시화', date:'2026-05-20', desc:'Fortune 5/15 \"as soon as Wednesday May 20\"' },
  { cat:'macro', impact:2, title:'中 4월 산업생산·소매판매·고정자산투자', date:'2026-05-19', desc:'NBS 발표·관세 영향 단일 점검' },

  // === 신제품 출시 ===
  { cat:'product', impact:2, title:'NVIDIA Blackwell Ultra 출하 본격화', date:'2026-05-26', desc:'B300 양산 램프' },
  { cat:'product', impact:2, title:'Apple iPhone 17 Air 단종 결정 발표 추정', date:'2026-05-08', desc:'판매 부진 보도', tickers:['AAPL'] },

  // === 기타 정책·매크로 이벤트 ===
  { cat:'policy', impact:3, title:'OPEC+ 5월 정례 회의', date:'2026-05-05', desc:'UAE 탈퇴 발효 후 첫 회의' },
  { cat:'policy', impact:1, title:'한국 어린이날 (휴장)', date:'2026-05-05', desc:'KOSPI 휴장' },
  { cat:'policy', impact:1, title:'미국 메모리얼 데이 (휴장)', date:'2026-05-26', desc:'NYSE·Nasdaq 휴장' },
  { cat:'policy', impact:2, title:'EU 디지털시장법(DMA) 추가 라운드 결정', date:'2026-05-22' },

  // === 7월 매크로 ===
  { cat:'macro', impact:3, title:'미국 6월 NFP 비농업 고용', date:'2026-07-02', desc:'독립기념일 관측 휴장 전 목요일로 앞당겨 발표' },
  { cat:'policy', impact:1, title:'미국 독립기념일 관측 (휴장)', date:'2026-07-03', desc:'NYSE·Nasdaq 휴장 (7/4 토요일)·채권시장 7/2 조기 마감' },
  { cat:'macro', impact:3, title:'6월 FOMC 의사록 공개', date:'2026-07-08', desc:'6/16-17 회의 톤·향후 금리 인하 경로 가이드' },
  { cat:'macro', impact:2, title:'중국 6월 CPI·PPI', date:'2026-07-09', desc:'NBS 발표·내수 물가·디플레 우려 점검' },
  { cat:'macro', impact:3, title:'미국 6월 CPI', date:'2026-07-14', desc:'BLS 8:30 ET·6월 FOMC 후 첫 인플레 확인대' },
  { cat:'macro', impact:2, title:'중국 6월 무역수지', date:'2026-07-14', desc:'수출입·관세 영향 단일 점검' },
  { cat:'macro', impact:2, title:'미국 6월 PPI', date:'2026-07-15', desc:'근원 PPI 동반 발표' },
  { cat:'macro', impact:3, title:'중국 Q2 GDP·6월 산업생산·소매판매', date:'2026-07-15', desc:'NBS 분기 성장률 + 월간 활동지표 동시 발표' },
  { cat:'macro', impact:2, title:'미국 6월 소매판매', date:'2026-07-16', desc:'소비 모멘텀 핵심 지표' },
  { cat:'macro', impact:3, title:'한국 BOK 7월 금융통화위원회', date:'2026-07-16', desc:'기준금리 결정·물가 3%대 부담 속 분기점' },
  { cat:'macro', impact:2, title:'한국 Q2 GDP 속보치', date:'2026-07-23', desc:'한국은행 잠정 성장률' },
  { cat:'macro', impact:3, title:'7월 FOMC 결과', date:'2026-07-30', desc:'KST 오전 3시·기준금리 결정 (7월은 점도표·SEP 없음)' },
  { cat:'macro', impact:3, title:'미국 6월 PCE 물가', date:'2026-07-31', desc:'Fed 선호 인플레 지표' },

  // === Q2 어닝 시즌 ===
  { cat:'earnings', impact:2, title:'Delta 항공 Q2 실적 (어닝 시즌 킥오프)', date:'2026-07-10', desc:'항공 여객 수요 벨웨더·실적 시즌 비공식 개막', tickers:['DAL'] },
  { cat:'earnings', impact:2, title:'JPMorgan Q2 실적 (어닝 시즌 개막)', date:'2026-07-14', desc:'장전 발표·대형 은행 일제 시작', tickers:['JPM'] },
  { cat:'earnings', impact:2, title:'TSMC Q2 실적', date:'2026-07-16', desc:'AI 반도체 수요·HBM·파운드리 가이던스', tickers:['TSM'] },
  { cat:'earnings', impact:2, title:'Netflix Q2 실적', date:'2026-07-16', desc:'장후 발표·구독·광고 성장 점검', tickers:['NFLX'] },
  { cat:'earnings', impact:2, title:'Tesla Q2 실적', date:'2026-07-22', desc:'장후 발표·인도량·마진·로보택시 진척', tickers:['TSLA'] },
  { cat:'earnings', impact:3, title:'빅테크 Q2 어닝 주간 (MSFT·GOOGL·META·AMZN·AAPL)', date:'2026-07-29', desc:'7월 마지막 주 메가캡 집중 발표·AI CAPEX 점검대' },
];

// 외부에서 접근할 변수명 (다른 update.js와 일관성)





// === AUTO-EARNINGS (scripts/fetch-earnings-calendar.js 자동 생성 — 손대지 말 것) ===
const autoEarnings = [
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Albemarle 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "ALB"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Block 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "XYZ"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Centrus 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "LEU"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Cognex 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "CGNX"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Eli Lilly 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "LLY"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Global Payments 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "GPN"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "IonQ 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "IONQ"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Joby Aviation 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "JOBY"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Novo Nordisk 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "NVO"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Riot Platforms 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "RIOT"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "SK바이오팜 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "326030"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "SK텔레콤 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "017670"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Sunrun 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "RUN"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Talen Energy 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "TLN"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Uber 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "UBER"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Watts Water 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "WTS"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "넷마블 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "251270"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "에스엠 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "041510"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "카카오게임즈 실적",
    "date": "2026-08-05",
    "desc": "실적 발표 예정",
    "tickers": [
      "293490"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "BlackSky 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "BKSY"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Cheniere 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "LNG"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "CJ ENM 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "035760"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Cloudflare 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "NET"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "ConocoPhillips 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "COP"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Constellation 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "CEG"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "D-Wave 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "QBTS"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Howmet Aerospace 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "HWM"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "KT&G 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "033780"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "LG유플러스 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "032640"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Marathon Digital 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "MARA"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Parker Hannifin 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "PH"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Rigetti 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "RGTI"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "셀트리온 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "068270"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "카카오 실적",
    "date": "2026-08-06",
    "desc": "실적 발표 예정",
    "tickers": [
      "035720"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "GS리테일 실적",
    "date": "2026-08-07",
    "desc": "실적 발표 예정",
    "tickers": [
      "007070"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "NAVER 실적",
    "date": "2026-08-07",
    "desc": "실적 발표 예정",
    "tickers": [
      "035420"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Oklo 실적",
    "date": "2026-08-07",
    "desc": "실적 발표 예정",
    "tickers": [
      "OKLO"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Vistra 실적",
    "date": "2026-08-07",
    "desc": "실적 발표 예정",
    "tickers": [
      "VST"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "롯데쇼핑 실적",
    "date": "2026-08-07",
    "desc": "실적 발표 예정",
    "tickers": [
      "023530"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "한국가스공사 실적",
    "date": "2026-08-07",
    "desc": "실적 발표 예정",
    "tickers": [
      "036460"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Archer Aviation 실적",
    "date": "2026-08-10",
    "desc": "실적 발표 예정",
    "tickers": [
      "ACHR"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "AST SpaceMobile 실적",
    "date": "2026-08-10",
    "desc": "실적 발표 예정",
    "tickers": [
      "ASTS"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "KT 실적",
    "date": "2026-08-10",
    "desc": "실적 발표 예정",
    "tickers": [
      "030200"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Rocket Lab 실적",
    "date": "2026-08-10",
    "desc": "실적 발표 예정",
    "tickers": [
      "RKLB"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "CJ제일제당 실적",
    "date": "2026-08-11",
    "desc": "실적 발표 예정",
    "tickers": [
      "097950"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "CoreWeave 실적",
    "date": "2026-08-11",
    "desc": "실적 발표 예정",
    "tickers": [
      "CRWV"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "엔씨소프트 실적",
    "date": "2026-08-11",
    "desc": "실적 발표 예정",
    "tickers": [
      "036570"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "펄어비스 실적",
    "date": "2026-08-11",
    "desc": "실적 발표 예정",
    "tickers": [
      "263750"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Cisco 실적",
    "date": "2026-08-12",
    "desc": "실적 발표 예정",
    "tickers": [
      "CSCO"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "한국전력 실적",
    "date": "2026-08-12",
    "desc": "실적 발표 예정",
    "tickers": [
      "015760"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Intuitive Machines 실적",
    "date": "2026-08-13",
    "desc": "실적 발표 예정",
    "tickers": [
      "LUNR"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "SK스퀘어 실적",
    "date": "2026-08-13",
    "desc": "실적 발표 예정",
    "tickers": [
      "034730"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "농심 실적",
    "date": "2026-08-13",
    "desc": "실적 발표 예정",
    "tickers": [
      "004370"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "삼성화재 실적",
    "date": "2026-08-13",
    "desc": "실적 발표 예정",
    "tickers": [
      "000810"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "위메이드 실적",
    "date": "2026-08-14",
    "desc": "실적 발표 예정",
    "tickers": [
      "112040"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Home Depot 실적",
    "date": "2026-08-18",
    "desc": "실적 발표 예정",
    "tickers": [
      "HD"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Walmart 실적",
    "date": "2026-08-20",
    "desc": "실적 발표 예정",
    "tickers": [
      "WMT"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "한국타이어 실적",
    "date": "2026-08-20",
    "desc": "실적 발표 예정",
    "tickers": [
      "161390"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "한진칼 실적",
    "date": "2026-08-20",
    "desc": "실적 발표 예정",
    "tickers": [
      "180640"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Heico 실적",
    "date": "2026-08-25",
    "desc": "실적 발표 예정",
    "tickers": [
      "HEI"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "CrowdStrike 실적",
    "date": "2026-08-26",
    "desc": "실적 발표 예정",
    "tickers": [
      "CRWD"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "NVIDIA 실적",
    "date": "2026-08-26",
    "desc": "실적 발표 예정",
    "tickers": [
      "NVDA"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Okta 실적",
    "date": "2026-08-26",
    "desc": "실적 발표 예정",
    "tickers": [
      "OKTA"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "SentinelOne 실적",
    "date": "2026-08-27",
    "desc": "실적 발표 예정",
    "tickers": [
      "S"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Palo Alto 실적",
    "date": "2026-09-01",
    "desc": "실적 발표 예정",
    "tickers": [
      "PANW"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Broadcom 실적",
    "date": "2026-09-02",
    "desc": "실적 발표 예정",
    "tickers": [
      "AVGO"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Salesforce 실적",
    "date": "2026-09-02",
    "desc": "실적 발표 예정",
    "tickers": [
      "CRM"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Zscaler 실적",
    "date": "2026-09-02",
    "desc": "실적 발표 예정",
    "tickers": [
      "ZS"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Dell Tech 실적",
    "date": "2026-09-03",
    "desc": "실적 발표 예정",
    "tickers": [
      "DELL"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "HP Enterprise 실적",
    "date": "2026-09-03",
    "desc": "실적 발표 예정",
    "tickers": [
      "HPE"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Lululemon 실적",
    "date": "2026-09-03",
    "desc": "실적 발표 예정",
    "tickers": [
      "LULU"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "UiPath 실적",
    "date": "2026-09-03",
    "desc": "실적 발표 예정",
    "tickers": [
      "PATH"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Oracle 실적",
    "date": "2026-09-09",
    "desc": "실적 발표 예정",
    "tickers": [
      "ORCL"
    ],
    "src": "auto-earnings"
  },
  {
    "cat": "earnings",
    "impact": 2,
    "title": "Planet Labs 실적",
    "date": "2026-09-09",
    "desc": "실적 발표 예정",
    "tickers": [
      "PL"
    ],
    "src": "auto-earnings"
  }
];
const calendarEvents = { recurring, fixed: fixed.concat(typeof autoEarnings !== "undefined" ? autoEarnings : []) };
