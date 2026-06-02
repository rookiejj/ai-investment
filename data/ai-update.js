const UPDATES = [
  {
    "date": "2026-06-03 07:35 KST",
    "summary": `NVIDIA Vera Rubin 풀양산 - Foxconn·Quanta·Wistron 150개사 + AWS·GCP·Azure·Oracle 1차 배포
황 컴퓨텍스 무대 Marvell '다음 1조달러' 호명 - AI 인터커넥트·800G·custom silicon lock-in
Anthropic 비공개 S-1 SEC 6/1 접수 - 1조달러 IPO 가을 데뷔·ARR $47B 전년 4.7배 가속
Apple WWDC 26 6/8 D-5 - Gemini 1.2T 파라미터 커스텀 Siri 첫 공개·iOS 27 6종 동시
xAI Grok 5 Colossus 2 학습·OpenAI GPT-5.4 1M 토큰·Google Gemini 3.5 Pro 6월 출시 임박`,
    "changes": [
      {
        "time": "2026-06-02 16:00 KST",
        "type": "인프라",
        "detail": "NVIDIA. Computex 2026 6/2~5 개막 + Vera Rubin 풀양산 본격화. 6/1 GTC Taipei 키노트 Vera CPU(88코어 Olympus) + Rubin GPU 양산 명시·TSMC 3nm 공정. 1차 출하 여름 시작·하반기 광역 출시 - AWS·Google Cloud·Microsoft Azure·Oracle 4대 하이퍼스케일러 early deployment 확정. Foxconn·Quanta·Wistron + 약 150개 Taiwan ODM 공급망 NVL72 rack-scale 양산, 랙 조립 시간 2시간→5분으로 30배 단축. ASUS XA VR721-E3 AI POD 100% 액체냉각 1T 파라미터 모델·차세대 AI 팩토리 전용. Computex 출석 경영진 합산 시총 $10T+. forward 6/5 황 한국 4대그룹 회동 + 6/8 WWDC 카운트다운이 frontier AI 인프라 사이클 다층 분기점.",
        "sector": "NVIDIA"
      },
      {
        "time": "2026-06-02 16:30 KST",
        "type": "생태계",
        "detail": "NVIDIA. 6/2 Marvell Technology(MRVL) +30% 폭등 - 황 Computex Taipei 무대 Murphy CEO 동석 'Marvell is the next trillion-dollar company' 직접 호명. AI 인터커넥트·custom silicon·800G 광 네트워킹이 Vera Rubin NVL72 scale-out 핵심 구성. NVIDIA-Marvell 파트너십이 inter-cluster·intra-rack 통신 sector premium 동시 lock-in - Anthropic·OpenAI·Google·Meta CapEx 2026~2028 누적 $1T+ 시나리오에서 Broadcom·Marvell duopoly 인터커넥트 IP 라이센싱 멀티이어 사이클 단독 가시화. 6/2 직전 4월 Q1 매출 $2.4B 컨센 상회·DC 매출 가이던스 가속·황 호명 후 forward FY27E 매출 $12B+ 컨센 상향 카탈리스트 진입.",
        "sector": "NVIDIA"
      },
      {
        "time": "2026-06-02 17:00 KST",
        "type": "전략",
        "detail": "Apple. WWDC 26 6/8(월) 키노트 D-5 카운트다운. 1/12 발표 Google-Apple 다년 라이센스 ~$1B/년 기반 1.2T 파라미터 커스텀 Gemini 모델 통합 Siri 첫 공개 일정 - Apple Private Cloud Compute 서버 자체 호스팅, Google 인프라 미경로 디자인. 신규 Siri 풀챗봇 - 웹 검색·이미지 생성·콘텐츠 요약·코딩 어시·파일 분석·멀티 스텝 명령 + standalone Siri 앱·대화 히스토리·Dynamic Island 제스처 활성화. iOS 27·iPadOS 27·macOS 27·tvOS 27·watchOS 27·visionOS 27 OS 6종 동시·All Systems Glow 티저 6/1 공식. 6/2 정규 -2% $305.59 + 시간외 추가 약세 - Computex 황 키노트 부재(파트너십 비명시) 매도 트리거. Morgan Stanley 목표 $365~385 + upside $440·Apple Intelligence 18개월 지연 만회·on-device + cloud 하이브리드 아키텍처가 forward 디바이스 ASP·구독 단가 변수.",
        "sector": "Apple"
      },
      {
        "time": "2026-06-02 17:30 KST",
        "type": "마일스톤",
        "detail": "Anthropic. SEC 비공개 S-1 6/1 접수 + 후속 IPO 절차 본격화. 5/29 Series H $65B/$965B 클로징 후 12거래일 만에 IPO 데뷔·가을 10월 윈도우 컨센. Q2 매출 $10.9B 가이던스 +100% QoQ·첫 흑자 분기 진입·ARR run rate $47B(전년 $10B 4.7배). Altimeter·Dragoneer·Greenoaks·Sequoia 리드 + Capital Group·Coatue·D1·GIC·Iconiq·XN 코리드, Amazon 5GW·Google 5GW TPU·SpaceX Colossus 인프라 락인. 6/1 CNBC Mythos EU 정식 접근 확대 보도 - Project Glasswing 50개 파트너 한정 → 안전 가드 강화 후 전체 전개. SpaceX 6/12 SPCX $1.75T·OpenAI 가을 IPO 신청 동시 진행 - 미국 3대 1조달러 IPO 라인업 가시화. forward Anthropic·OpenAI·xAI Series H/I 합산 $300B+ AI 자본 회수 사이클 분기점.",
        "sector": "Anthropic"
      },
      {
        "time": "2026-06-02 18:00 KST",
        "type": "모델 출시 예정",
        "detail": "xAI·OpenAI·Google. frontier 모델 cadence 6월 가속 라인업. Google Gemini 3.5 Pro 5/19 I/O 컨퍼런스 '다음 달(6월) 출시' 공식 명시 후 ID·정확 일정 미공개 상태 - Gemini 3.5 Flash 5/19 정식 출시 베이스에서 Pro 6월 중·하순 카운트다운. xAI Grok 5 Colossus 2 학습 진행 - Q2 2026 출시 목표·6/30 이전 출시 확률 Polymarket 12~33% 저조. OpenAI 최근 GPT-5.4 발표 1M 토큰 컨텍스트 윈도우·멀티 스텝 워크플로우 자율 실행 능력·5/7 GPT-5.5-Cyber 한정 사이버 보안 프리뷰 + 5/11 EU 접근 확장 동시 진행. Meta Llama 5 7월 컨퍼런스 출시 예정. 2026 하반기 frontier 모델 cadence 가속이 forward sector premium 다층 후방.",
        "sector": "OpenAI"
      }
    ]
  }
];
