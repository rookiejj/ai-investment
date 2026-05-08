// 영문 회사명·티커 → 한글 표기 매핑.
// 본문(summary·detail·calendar·친구톡) 안의 영문을 한글로 치환할 때 사용.
// 데이터 파일·update.js는 원본 그대로, 렌더·발송 시점에만 적용.
//
// 단일 소스 — index.html(렌더)과 daily-send Edge Function(친구톡 발송) 양쪽이 참조.
// 길이 내림차순으로 적용해 'Goldman Sachs' → 'Goldman' 부분 매칭 사고 방지.
//
// 단어 경계 룰: 영문 알파벳·숫자 인접 시 매칭 안 함 — 'Cloud'가 'Cloudflare'를 깨지 않음.
// 단일 글자·짧은 약어 티커(F·V·C·S·MA·MS·BE 등) 제외 — 일반 단어와 충돌 위험.

const COMPANY_KO = {
  // ─── AI·유니콘 ───
  'Anthropic':'엔트로픽','Alphabet':'알파벳','CoreWeave':'코어위브','Anduril':'안두릴',
  'Mistral':'미스트랄','DeepMind':'딥마인드','OpenAI':'오픈ai',
  'Reflection':'리플렉션','SpaceX':'스페이스X','Palantir':'팔란티어','Reddit':'레딧',
  'Stripe':'스트라이프','Databricks':'데이터브릭스','xAI':'xAI','Cohere':'코히어',
  'Mercor':'머커','Cursor':'커서','Vercel':'버셀','Figma':'피그마','Notion':'노션',
  'Snowflake':'스노우플레이크','Datadog':'데이터독','MongoDB':'몽고DB','Atlassian':'아틀라시안',
  // ─── 빅테크·소프트웨어 ───
  'Microsoft':'마이크로소프트','Amazon':'아마존','Meta':'메타','Apple':'애플','Tesla':'테슬라',
  'Google':'구글','Broadcom':'브로드컴','Nvidia':'엔비디아','NVIDIA':'엔비디아','Oracle':'오라클',
  'Salesforce':'세일즈포스','Adobe':'어도비','Intuit':'인튜이트','ServiceNow':'서비스나우',
  'Workday':'워크데이','Zscaler':'지스케일러','GitHub':'깃허브','Shopify':'쇼피파이',
  // ─── 반도체 ───
  'TSMC':'TSMC','ASML':'ASML','Lam Research':'램리서치','Micron':'마이크론',
  'Applied Materials':'어플라이드 머티리얼즈','Texas Instruments':'텍사스 인스트루먼트',
  'Marvell':'마벨','Analog Devices':'아날로그 디바이스','NXP':'NXP','Onsemi':'온세미',
  // ─── 데이터센터·하드웨어 ───
  'Digital Realty':'디지털 리얼티','Equinix':'에퀴닉스','Arista':'아리스타',
  'Cisco':'시스코','Juniper':'주니퍼','NetApp':'넷앱','Pure Storage':'퓨어 스토리지',
  'Vertiv':'버티브','Generac':'제네락',
  // ─── 전력·원자력 ───
  'GE Vernova':'GE 버노바','Eaton':'이튼','Quanta':'콴타','NextEra':'넥스트에라',
  'Constellation':'컨스텔레이션','Vistra':'비스트라','Cameco':'카메코','Oklo':'오클로',
  'Talen Energy':'탤런 에너지','Centrus':'센트러스','Duke Energy':'듀크 에너지',
  // ─── 바이오·헬스 ───
  'Eli Lilly':'일라이 릴리','Novo Nordisk':'노보 노디스크','Pfizer':'화이자','Merck':'머크',
  'AbbVie':'애브비','Johnson & Johnson':'존슨앤존슨','Moderna':'모더나','Amgen':'암젠',
  'Gilead':'길리어드','Regeneron':'리제네론','Vertex Pharma':'버텍스 파마',
  'Intuitive Surgical':'인튜이티브 서지컬','UnitedHealth':'유나이티드헬스',
  // ─── 에너지·원자재 ───
  'ExxonMobil':'엑손모빌','Chevron':'셰브런','ConocoPhillips':'코노코필립스',
  'Schlumberger':'슐럼버거','Halliburton':'핼리버튼','Cheniere':'셰니어',
  'Kinder Morgan':'킨더 모건','Enbridge':'엔브리지','Linde':'린데','Air Products':'에어 프로덕츠',
  'First Solar':'퍼스트 솔라','Enphase':'엔페이즈','Sunrun':'썬런','Bloom Energy':'블룸 에너지',
  // ─── 자동차·모빌리티 ───
  'Toyota':'토요타','Ford':'포드','General Motors':'GM','Stellantis':'스텔란티스',
  'Honda':'혼다','Rivian':'리비안','Lucid':'루시드','NIO':'니오','XPeng':'샤오펑',
  'Li Auto':'리오토','Mobileye':'모빌아이','Uber':'우버','Lyft':'리프트',
  // ─── 우주·항공·방산 ───
  'Boeing':'보잉','Airbus':'에어버스','Lockheed Martin':'록히드 마틴',
  'Northrop Grumman':'노스럽 그러먼','Northrop':'노스럽','General Dynamics':'제너럴 다이내믹스',
  'L3Harris':'L3해리스','Huntington Ingalls':'헌팅턴 잉걸스','Kratos':'크라토스',
  'Rocket Lab':'로켓 랩','AST SpaceMobile':'AST 스페이스모바일',
  'Intuitive Machines':'인튜이티브 머신스','Iridium':'이리듐',
  'Planet Labs':'플래닛 랩스','BlackSky':'블랙스카이','Spire Global':'스파이어 글로벌',
  'TransDigm':'트랜스다임','Heico':'헤이코','Howmet':'하월멧','Textron':'텍스트론',
  'Joby Aviation':'조비 에비에이션','Archer Aviation':'아처 에비에이션',
  'Delta Air Lines':'델타 항공','United Airlines':'유나이티드 항공','American Airlines':'아메리칸 항공',
  // ─── 양자·크립토 ───
  'IonQ':'아이온큐','Rigetti':'리게티','D-Wave':'D-웨이브','Coinbase':'코인베이스',
  'Strategy':'스트래티지','Marathon Digital':'마라톤 디지털','Riot Platforms':'라이엇 플랫폼스',
  'CleanSpark':'클린스파크','Bitfarms':'비트팜',
  // ─── 사이버보안 ───
  'CrowdStrike':'크라우드스트라이크','Palo Alto':'팔로알토','Fortinet':'포티넷',
  'Cloudflare':'클라우드플레어','SentinelOne':'센티널원','Okta':'옥타','Rubrik':'루브릭',
  // ─── 핀테크·결제 ───
  'Visa':'비자','Mastercard':'마스터카드','American Express':'아메리칸 익스프레스',
  'PayPal':'페이팔','Block':'블록','Fiserv':'파이서브','Global Payments':'글로벌 페이먼츠',
  'Toast':'토스트','SoFi':'소파이','Affirm':'어펌','Robinhood':'로빈후드',
  // ─── 금융·은행 ───
  'JPMorgan':'JP모건','Goldman Sachs':'골드만삭스','Morgan Stanley':'모건스탠리',
  'Bank of America':'뱅크오브아메리카','Charles Schwab':'찰스 슈왑','BlackRock':'블랙록',
  'Wells Fargo':'웰스파고','Citi':'씨티','Citigroup':'씨티','Bain':'베인',
  'Brookfield':'브룩필드','Blackstone':'블랙스톤','KKR':'KKR',
  'General Atlantic':'제너럴 애틀랜틱','Hellman&Friedman':'헬만&프리드먼',
  'Dragoneer':'드래고니어','SoftBank':'소프트뱅크','TPG':'TPG','Advent':'어드벤트',
  // ─── 로봇·자동화 ───
  'Rockwell':'록웰','Emerson':'에머슨','Cognex':'코그넥스','Teradyne':'테라다인',
  'Zebra Tech':'지브라 테크','UiPath':'유아이패스','Symbotic':'심보틱','iRobot':'아이로봇',
  // ─── 소비·리테일 ───
  'Walmart':'월마트','Costco':'코스트코','Home Depot':'홈디포','Target':'타겟',
  'Lowe\'s':'로위스','Chipotle':'치폴레','Lululemon':'룰루레몬','Starbucks':'스타벅스',
  'McDonald\'s':'맥도날드','Nike':'나이키','Coca-Cola':'코카콜라','PepsiCo':'펩시',
  'Procter & Gamble':'P&G','Dollar General':'달러 제너럴','Dollar Tree':'달러 트리',
  // ─── 매체·기관 ───
  'Counterpoint':'카운터포인트','Reuters':'로이터','Bloomberg':'블룸버그','Axios':'액시오스',
  'TechCrunch':'테크크런치','WSJ':'WSJ','New York Times':'뉴욕타임스','NYT':'NYT',
  'Stargate':'스타게이트','PwC':'PwC','Deloitte':'딜로이트','KPMG':'KPMG','EY':'EY',
  'Tata':'타타','Reliance':'릴라이언스','Infosys':'인포시스',
  'Pentagon':'펜타곤','Federal Reserve':'연준','Treasury':'재무부','Powell':'파월',
  'Yellen':'옐런','Bessent':'베센트',
  // ─── 중국 ───
  'Tencent':'텐센트','Alibaba':'알리바바','Baidu':'바이두','ByteDance':'바이트댄스',
  'JD.com':'JD','Pinduoduo':'핀둬둬','BYD':'BYD','Xiaomi':'샤오미',
  // ─── 일반어 (단어 경계 매칭이라 'Cloudflare'·'iCloud'엔 안 닿음) ───
  'Cloud':'클라우드','cloud':'클라우드',
  // ─── 티커 → 한글 (본문·캘린더 텍스트의 ticker 형태) ───
  // 빅테크
  'NVDA':'엔비디아','GOOGL':'구글','GOOG':'구글','AAPL':'애플','MSFT':'마이크로소프트',
  'META':'메타','AMZN':'아마존','TSLA':'테슬라','AVGO':'브로드컴','ORCL':'오라클',
  'CRM':'세일즈포스','ADBE':'어도비','INTU':'인튜이트','NOW':'서비스나우',
  // 반도체
  'AMD':'AMD','ASML':'ASML','TSM':'TSMC','QCOM':'퀄컴','MU':'마이크론',
  'INTC':'인텔','AMAT':'어플라이드 머티리얼즈','LRCX':'램리서치','KLAC':'KLA',
  'TXN':'텍사스 인스트루먼트','MRVL':'마벨','MCHP':'마이크로칩','ADI':'아날로그 디바이스',
  // AI·소프트웨어·인프라
  'PLTR':'팔란티어','SNOW':'스노우플레이크','DDOG':'데이터독','MDB':'몽고DB',
  'TEAM':'아틀라시안','WDAY':'워크데이','ZS':'지스케일러','CRWV':'코어위브','NET':'클라우드플레어',
  // 자동차·모빌리티 — 단일 글자 티커(F, V, C, S 등)는 false positive 위험으로 제외, 풀네임만 매핑
  'UBER':'우버','RIVN':'리비안','LCID':'루시드','NIO':'니오','XPEV':'샤오펑','LI':'리오토',
  'TM':'토요타','HMC':'혼다',
  // 태양광·청정에너지 — BE(Bloom Energy)는 'be' 영어동사와 충돌해 풀네임만 매핑
  'RUN':'썬런','FSLR':'퍼스트 솔라','ENPH':'엔페이즈',
  // 미디어·소비
  'NFLX':'넷플릭스','DIS':'디즈니','SBUX':'스타벅스','MCD':'맥도날드','NKE':'나이키',
  'WMT':'월마트','COST':'코스트코','HD':'홈디포','LOW':'로위스','TGT':'타겟',
  'KO':'코카콜라','PEP':'펩시','PG':'P&G','LULU':'룰루레몬','CMG':'치폴레','TTD':'더트레이드데스크',
  // 바이오·헬스
  'LLY':'일라이 릴리','NVO':'노보 노디스크','PFE':'화이자','MRK':'머크','ABBV':'애브비',
  'JNJ':'존슨앤존슨','MRNA':'모더나','AMGN':'암젠','GILD':'길리어드','REGN':'리제네론',
  'VRTX':'버텍스 파마','ISRG':'인튜이티브 서지컬','UNH':'유나이티드헬스','BMY':'BMS','BIIB':'바이오젠',
  // 에너지
  'XOM':'엑손모빌','CVX':'셰브런','COP':'코노코필립스','SLB':'슐럼버거','HAL':'핼리버튼',
  'LNG':'셰니어','KMI':'킨더 모건','ENB':'엔브리지','EOG':'EOG',
  'OXY':'옥시덴탈','MPC':'마라톤 페트롤리엄','VLO':'발레로',
  // 우주·항공·방산
  'BA':'보잉','LMT':'록히드 마틴','RTX':'RTX','NOC':'노스럽 그러먼','GD':'제너럴 다이내믹스',
  'LHX':'L3해리스','HII':'헌팅턴 잉걸스','KTOS':'크라토스','RKLB':'로켓 랩','ASTS':'AST 스페이스모바일',
  'LUNR':'인튜이티브 머신스','IRDM':'이리듐','PL':'플래닛 랩스','BKSY':'블랙스카이','SPIR':'스파이어',
  'TDG':'트랜스다임','HEI':'헤이코','HWM':'하월멧','TXT':'텍스트론',
  'DAL':'델타 항공','UAL':'유나이티드 항공','AAL':'아메리칸 항공','LUV':'사우스웨스트',
  'JOBY':'조비 에비에이션','ACHR':'아처 에비에이션',
  // 양자·크립토
  'IBM':'IBM','COIN':'코인베이스','MSTR':'스트래티지','MARA':'마라톤 디지털','RIOT':'라이엇 플랫폼스',
  'IONQ':'아이온큐','RGTI':'리게티','HOOD':'로빈후드',
  // 사이버보안 — S(SentinelOne)는 'S&P' 등과 충돌해 제외, 풀네임 'SentinelOne'은 NAME_KO에 있음
  'CRWD':'크라우드스트라이크','PANW':'팔로알토','FTNT':'포티넷','OKTA':'옥타','RBRK':'루브릭',
  // 핀테크·결제 — V(Visa)·MA(Mastercard)는 단일~2글자라 false positive 위험으로 제외, 풀네임은 위에 매핑됨
  'AXP':'아메리칸 익스프레스','PYPL':'페이팔','SQ':'블록',
  'FI':'파이서브','GPN':'글로벌 페이먼츠','TOST':'토스트','SOFI':'소파이','AFRM':'어펌',
  // 금융·은행 — C(Citi)·MS(Morgan Stanley)는 일반 약어와 충돌해 제외, 풀네임만 매핑
  'JPM':'JP모건','GS':'골드만삭스','BAC':'뱅크오브아메리카','WFC':'웰스파고',
  'SCHW':'찰스 슈왑','BLK':'블랙록','BX':'블랙스톤',
  // 데이터센터·하드웨어
  'DLR':'디지털 리얼티','EQIX':'에퀴닉스','ANET':'아리스타','CSCO':'시스코','VRT':'버티브',
  // 전력·원자력
  'GEV':'GE 버노바','ETN':'이튼','PWR':'콴타','NEE':'넥스트에라','CEG':'컨스텔레이션',
  'VST':'비스트라','CCJ':'카메코','OKLO':'오클로','TLN':'탤런 에너지','LEU':'센트러스','BWXT':'BWX 테크',
  // 로봇·자동화
  'ABB':'ABB','ROK':'록웰','EMR':'에머슨','CGNX':'코그넥스','TER':'테라다인','ZBRA':'지브라 테크','PATH':'유아이패스','SYM':'심보틱',
};
