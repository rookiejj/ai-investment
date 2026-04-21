# 브리픽 (Briefick)

미국·한국 주식 + AI 기업 + 글로벌 ETF + 시장·원자재 + 유니콘을 6개 탭으로 보여주는 통합 투자 대시보드, 그리고 해당 데이터 핵심 요약을 매일 카카오 친구톡으로 발송하는 **유료 구독 서비스**.

- **웹 대시보드**: https://roysbriefing.vercel.app
- **카카오 채널**: https://pf.kakao.com/_lpxkCX
- **친구톡 발송**: 매일 오전 8시 KST

## 구조

```
ai-investment/
├── index.html                    ← 통합 대시보드 UI + 구독 결제 모달
├── CLAUDE.md                     ← 데이터 유지보수·자동화 지침
├── assets/
│   ├── briefick_profile_640.jpeg ← 헤더 로고
│   └── roysoft_profile.jpg       ← 푸터 로이소프트 브랜드
├── data/
│   ├── version.js                ← 데이터 버전 (탭 전환 시 자동 체크)
│   ├── stocks-data.js            ← 미국 주식 (18 × 7 = 108)
│   ├── stocks-update.js
│   ├── kr-stocks-data.js         ← 한국 주식 (18 × 7 = 108)
│   ├── kr-stocks-update.js
│   ├── jp-stocks-data.js         ← 일본 주식 (10 × 7 = 70, UI 제외)
│   ├── jp-stocks-update.js
│   ├── ai-data.js                ← AI 기업 (10사 + 제품)
│   ├── ai-update.js
│   ├── etf-data.js               ← 글로벌 ETF (8 × 7 = 56)
│   ├── etf-update.js
│   ├── commodity-data.js         ← 시장·원자재 (6 × 4 = 24)
│   ├── commodity-update.js
│   ├── unicorn-data.js           ← 유니콘 (6 × 7 = 42)
│   └── unicorn-update.js
├── scripts/
│   ├── generate-message.js       ← 로컬에서 친구톡 메시지 조립·미리보기
│   ├── send-friendtalk.js        ← 로컬 수동 발송 스크립트 (디버깅용)
│   └── subscribers.example.json  ← 로컬 테스트 구독자 샘플
├── supabase/
│   ├── migrations/
│   │   ├── 20260420120000_init.sql     ← subscribers / send_logs 테이블
│   │   └── 20260420130000_payment.sql  ← paid_until · payments 테이블
│   ├── functions/
│   │   ├── subscribe/          ← 웹 구독 요청 수신·업서트
│   │   ├── check-subscription/ ← 결제 전 기존 구독 여부 조회
│   │   ├── payment-confirm/    ← 포트원 결제 검증 + 구독 연장
│   │   └── daily-send/         ← 매일 친구톡 발송 (cron 트리거)
│   ├── schedule.sql            ← pg_cron 등록 SQL (Vault 기반)
│   ├── queries.sql             ← 운영 조회/상태변경 쿼리 모음
│   └── README.md               ← Supabase 세팅 가이드
├── docs/
│   └── kakao-subscription-plan.md  ← 서비스 기획서
└── README.md
```

UI 노출 총 348개 항목, 6개 탭 (일본 70항목은 데이터 파일만 보존).

## 기능

### 대시보드
- **6개 탭**: 미국 마켓 · 한국 마켓 · AI 기업 · 글로벌 ETF · 유니콘 · 시장·원자재
- **검색**: 티커·기업명·제품명·설명 부분일치, X 버튼 초기화
- **필터**: 탭별 카테고리(섹터/배지) 토글
- **스와이프**: 모바일 좌우 스와이프로 탭 전환
- **자동 갱신**: 탭 전환·복귀 시 `version.js` 체크 → 변경되면 데이터 리로드
- **최종 업데이트 표시**: 헤더에 DATA_VERSION 기반 갱신 시간
- **연도 자동 전환**: FY25·FY26E 라벨이 현재 연도 기준 동적 생성
- **단위 직접 표시**: 미국($B), 한국(천억), 일본(¥천억)
- **탭 상태 유지**: sessionStorage로 마지막 탭·필터 저장
- **업데이트 박스**: 각 탭 최신 3건 요약 노출, 접기/펼치기 쉐브론

### 구독 서비스 (유료 친구톡)
- **구독 모달**: 헤더 "구독하기" 버튼 → 전화번호·광고 수신 동의
- **번호 재확인 단계**: 결제 직전 큰 글씨로 번호 재표시, 오타 방지
- **연장 확인**: 이미 구독 중인 번호면 "만료일까지 N일 남음 · 지금 결제 시 YYYY-MM-DD까지 연장" 안내 후 재확인
- **결제**: 포트원(V2) → 월 구독 단건 결제 (현재 테스트가 100원)
- **카카오 채널 친구 추가**: 모달 내 상시 노출 링크
- **친구톡 발송**: 매일 오전 8시 KST, 탭별 최신 2건 요약 + "전체 보기" 링크

### 콘텐츠 자동 갱신
- **원격 에이전트 스케줄**: Claude Opus 4.7이 매일 오전·오후 정기 주기로 6개 탭 데이터를 웹검색·갱신·커밋·푸시

## 구독·발송 파이프라인

```
  [웹] 구독하기 클릭
    ↓
  전화번호 + 수신 동의 입력
    ↓
  check-subscription (중복·연장 여부 조회)
    ↓
  포트원 결제창 (테스트 100원)
    ↓
  payment-confirm (결제 검증 → subscribers upsert, paid_until 설정)

  [매일 08:00 KST] Supabase pg_cron
    ↓
  Vault에서 X-Cron-Secret 꺼내 HTTP POST
    ↓
  daily-send Edge Function
    ├ GitHub Contents API로 data/*-update.js fetch
    ├ 만료된 구독자 expired 전환
    ├ 활성 구독자 조회
    ├ 솔라피 친구톡 발송 (배치 500명)
    └ send_logs 기록
```

## 업데이트 워크플로우

| 바꿀 것 | 수정 파일 |
|---|---|
| 미국 주식 | `data/stocks-{data,update}.js` |
| 한국 주식 | `data/kr-stocks-{data,update}.js` |
| 일본 주식 (UI 제외·수동만) | `data/jp-stocks-{data,update}.js` |
| AI 기업 | `data/ai-{data,update}.js` |
| 글로벌 ETF | `data/etf-{data,update}.js` |
| 시장·원자재 | `data/commodity-{data,update}.js` |
| 유니콘 | `data/unicorn-{data,update}.js` |
| UI·레이아웃 | `index.html` |
| 친구톡 메시지 포맷 | `supabase/functions/daily-send/index.ts` + `scripts/generate-message.js` 동기화 |
| 구독료·상품명 | `index.html` 안의 `SUBSCRIPTION_PRICE` · `SUBSCRIPTION_ORDER_NAME` 상수 |
| 발송 스케줄 | `supabase/schedule.sql`의 cron 표현식 (`0 23 * * *` = KST 08:00) |

데이터 수정 후 반드시 `data/version.js`의 타임스탬프를 갱신해야 접속 중인 사용자에게 반영됨.

상세 편집 규칙은 `CLAUDE.md`, 인프라 세팅은 `supabase/README.md` 참조.

## 기술 스택

| 레이어 | 도구 |
|---|---|
| 웹 프런트 | 순수 정적 HTML 1개 (빌드 없음) · Inter / Pretendard · Google Analytics `G-MHK455J1GP` |
| 호스팅 | **Vercel** (roysbriefing.vercel.app) |
| 백엔드 | **Supabase Pro** (Postgres + Edge Functions + Vault + pg_cron) |
| 결제 | **포트원 V2** (테스트 채널) |
| 친구톡 발송 | **솔라피(SOLAPI)** — HMAC-SHA256 인증 |
| 카카오 채널 | `_lpxkCX` / 발신프로필 `KA01PF...` |
| 자동 콘텐츠 갱신 | Claude Opus 4.7 원격 에이전트 (CronCreate) |

### 인증 구조
- 웹 클라이언트 ↔ Edge Function: Supabase 신형 **publishable key** (`sb_publishable_...`)
- pg_cron ↔ daily-send: **자체 Webhook Secret** (Vault 저장, `X-Cron-Secret` 헤더)
- Edge Function 모두 `--no-verify-jwt`로 배포 (Supabase 게이트웨이 JWT 검증 끔)

### 데이터 로딩
- `data/*.js`를 `fetch` → `new Function()`으로 격리 실행해 전역 오염 없이 로드
- 초기 로드 `Promise.all` 병렬 12개 파일
- 탭 전환 이후는 메모리 캐시

## 운영 메모

- **솔라피 잔액**: 친구톡 건당 약 15원. 발송 실패 시 `send_logs.status=fail`로 기록.
- **포트원 실결제 전환**: Store ID를 테스트 → 라이브 채널로 교체 필요. `API Secret`도 라이브용으로 secret 재등록.
- **SERVICE_ROLE KEY / publishable KEY 로테이션**: Supabase Dashboard → Project Settings → API에서 회전. Vault의 `cron_secret`은 webhook 용도라 별개.
- **스케줄 변경**: `cron.schedule` 표현식만 수정. pg_cron은 UTC 기준, KST = UTC + 9.
- **구독자 수동 관리**: `supabase/queries.sql`의 템플릿 활용.

## Changelog

- **2026-04-21**: 친구톡 구독 서비스 · 포트원 결제 · Supabase 백엔드 도입. 매일 08:00 KST 자동 발송. 웹 구독 모달 / 전화번호 재확인 단계 / 연장 결제 확인 / 카카오 채널 친구 추가 유도. Supabase 신형 API 키(`sb_*`) 체계 대응 — Edge Function `--no-verify-jwt` + 자체 webhook secret 검증.
- **2026-04-20**: Supabase 프로젝트 연동 · `subscribers` / `send_logs` / `payments` 스키마. Edge Function 4종 배포 (`subscribe`, `check-subscription`, `payment-confirm`, `daily-send`). 포트원 V2 결제창 + 검증 파이프라인.
- **2026-04-19**: 솔라피 SMS·알림톡·친구톡 플랫폼 도입. HMAC 인증 Edge Function. 메시지 포맷 정비(탭별 최신 2건, 단어 경계 smartCut).
- **2026-04-17**: 자동화 실행 모델을 Claude Opus 4.7로 고정. 업데이트 박스 토글 SVG 버그 수정. 조사 윈도우를 최근 1~2일 + 진행 중 이벤트로 한정.
- **2026-04-16**: 일본 주식 탭 UI 제거(데이터 파일 보존). 시장·원자재 탭 명칭·순서 조정. 업데이트 박스 헤더 접기/펼치기 쉐브론.
- **2026-04-14**: 초기 로드 버전 기반 캐시 방지. 헤더 최종 업데이트 시간 표시. 탭 상태 복원 깜빡임 제거. 매일 7시 KST 자동 콘텐츠 갱신 스케줄 설정.
- **2026-04-13**: 4개 탭 추가(일본·ETF·원자재·유니콘), 7탭 481항목. 카테고리당 6→7종목. 단위 직접 표시. 검색 X버튼. 데이터 버전 자동 체크. 한국 마켓 추가. 허브 → 통합 레포 전환. CLAUDE.md 합본.

## 라이선스

개인용.
