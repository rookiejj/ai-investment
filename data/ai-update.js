/**
 * update.js - AI Players 업데이트 로그
 *
 * 각 기업의 모델·제품·펀딩·인수 등 콘텐츠 변경 사항을
 * 날짜별로 기록한다.
 */
const UPDATES = [
  {
    date: "2026-05-11 19:25 KST",
    summary: `Anthropic Claude 'Dreaming' 리서치 프리뷰 정식 공개 - 에이전트 세션 사이 자동 회상·재정리
법률 AI Harvey 도입 후 태스크 완료율 6배 가속 - 첫 정량 사례 입증
Memory(4/24) + Dreaming(5/6) + 멀티에이전트 오케스트레이션(5/8) - 매니지드 에이전트 장기 학습 완성
xAI 'SpaceXAI' 통합 본격화 - Musk 'xAI는 SpaceXAI AI 부문으로 존속' 공식화`,
    changes: [
      { type: "제품 출시", sector: "Anthropic",
        detail: "Anthropic 'Dreaming' 기능 리서치 프리뷰 공개. 5/6 Code with Claude 컨퍼런스 발표 - Claude 매니지드 에이전트가 세션 사이 비활성 시간에 과거 트랜스크립트(최대 100건)를 자동 리뷰하고 반복 패턴·실수·팀 공통 선호를 추출해 메모리 스토어를 재정리하는 스케줄드 프로세스. 원본 세션 데이터는 건드리지 않고 중복 병합·모순 제거·신규 인사이트만 추출, 매 에이전트가 단독으로는 볼 수 없는 패턴을 표면화. 법률 AI Harvey가 도입 후 태스크 완료율 6배 가속을 정량 보고 - 첫 외부 정량 사례. 4/24 Memory 베타 + 5/8 멀티에이전트 오케스트레이션 라인업과 결합돼 엔터프라이즈 매니지드 에이전트의 장기 학습 레이어 완성. 5/4 Blackstone·Goldman·H&F $1.5B 합작벤처 + 5/5 금융 서비스 에이전트 10종·MS 365 통합 누적 베이스에 직접 시너지 라인.",
        time: "2026-05-11 19:25 KST" },
      { type: "전략", sector: "xAI",
        detail: "xAI 'SpaceXAI' 단일 법인 통합. 5월 초 Musk X 게시물 - xAI는 더 이상 별도 회사로 존재하지 않고 새로 명명된 SpaceXAI의 AI 부문으로 단순 통합. SpaceXAI는 IPO를 연내 추진, 목표 조달 $1.75~2T로 단일 사상 최대 IPO 베팅. xAI 본사이자 라이벌 Anthropic이 5/6 단독 임대한 Colossus 1 컴퓨트(300MW·220K GPU)는 SpaceXAI 자산으로 귀속 - 'xAI 본사 라이벌 임대' 구도가 모회사 차원의 자본 회수 라인으로 해석 가능. Grok 5(6T MoE)·Cursor $60B 인수 옵션·SpaceX Colossus 2(1.5GW)·Grok 4.3 Beta(1T) 라인업이 IPO 직전 정량 입증 채널. 5/14~15 트럼프-시진핑 베이징 정상회담 의제에 AI 모델 가드레일·수출 통제가 사이드 분기점.",
        time: "2026-05-11 19:25 KST" },
    ]
  },
  {
    date: "2026-05-11 07:35 KST",
    summary: `5/14~15 트럼프-시진핑 베이징 정상회담 D-3~4 - 트럼프 이란 응답 거부로 호르무즈 단일 톱 부상
AI 리스크·안전 프레임 후순위 가능성 - 양국 모델 가드레일·수출 통제 양 측 의제 잔존
Anthropic Project Glasswing 美 정부 라인 견지 - 트럼프 행정부 블랙리스트 잔존 baseline
Microsoft·Google·xAI CAISI 정부 모델 검증 동의·OpenAI·Anthropic은 2024년 합의 갱신
5/19 Microsoft Build·5/20 NVDA Q1 FY27·5/21 Google I/O 메가 캘린더 - 모델·인프라 사이클`,
    changes: [
      { type: "거버넌스", sector: "OpenAI",
        detail: "OpenAI·Anthropic·Google DeepMind·Microsoft·xAI 美 정부 모델 사전 검증 합의 - Center for AI Standards and Innovation(CAISI)가 5/5 Microsoft·Google·xAI와 모델 공개 前 정부 평가 합의 체결, OpenAI·Anthropic 2024 기존 합의는 CAISI 지침 반영해 갱신. 5/14~15 트럼프-시진핑 베이징 정상회담 D-3~4 카운트다운 베이스 - 트럼프 5/10 이란 응답 거부로 호르무즈 의제가 단일 톱 부상, AI 리스크·안전 프레임은 후순위 가능성 잔존. 미국 측 의제 - 對中 AI 칩 수출 가이던스 + 모델 가드레일 표준화 + 사이버 자율 공격 위협 평가 라인. 중국 측 의제 - DeepSeek·Qwen·Kimi 등 자국 모델 美 시장 접근 + 반도체 수출 통제 완화 잔존.",
        time: "2026-05-11 07:35 KST" },
      { type: "거버넌스", sector: "Anthropic",
        detail: "Anthropic 정부 라인 양 측 균형 - 5/1 美 국방부 8사 AI 계약(SpaceX·OpenAI·Google·Microsoft·NVIDIA·AWS·Oracle·Reflection)에서 단독 배제 잔존 + 트럼프 행정부 블랙리스트 베이스 그대로. 한편 Project Glasswing 컨소시엄(AWS·Apple·Cisco·CrowdStrike·Google·JPMorgan·Linux Foundation·Microsoft·NVIDIA·Palo Alto Networks)에 Claude Mythos Preview 제한 배포 + $100M 크레딧 제공으로 美 기업·정부 인프라 사이버 방어 라인업은 견고. 5/14~15 베이징 정상회담 결과 後 정부 정책 변동 가능성 - 안전 가드레일 견지가 사용된 협상 카드가 되는지 사이드 변수. 토큰화 IPO 함의 $1.2T·OpenAI 시간외 $852B 첫 추월 + 5월 보드 $50B/$900B 라운드 결정 베이스 잔존.",
        time: "2026-05-11 07:35 KST" },
    ]
  },
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
  }
];
