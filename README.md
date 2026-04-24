# 브리픽 (Briefick)

미국·한국 주식 + AI 기업 + 글로벌 ETF + 시장·원자재 + 유니콘을 6개 탭으로 보여주는 통합 투자 대시보드, 그리고 해당 데이터 핵심 요약을 매일 카카오 친구톡으로 발송하는 **유료 구독 서비스**.

- **웹 대시보드**: https://roysbriefing.vercel.app
- **카카오 채널**: https://pf.kakao.com/_lpxkCX
- **친구톡 발송**: 매일 오전 8시 KST
- **운영 대시보드**: `/admin` (비밀번호 보호)

## 구조

```
ai-investment/
├── index.html                    ← 통합 대시보드 UI + 구독 결제 모달
├── admin.html                    ← 운영 대시보드 (통계·발송 이력·수동 발송)
├── terms.html                    ← 이용약관
├── privacy.html                  ← 개인정보처리방침
├── refund.html                   ← 환불정책
├── vercel.json                   ← /admin → /admin.html 리라이트 규칙
├── CLAUDE.md                     ← 데이터 유지보수·자동화 지침
├── assets/
│   ├── briefick_profile_640.jpeg ← 헤더 로고
│   └── roysoft_profile.jpg       ← 푸터 로이소프트 브랜드
├── data/
│   ├── version.js                ← 데이터 버전
│   ├── stocks-{data,update}.js   ← 미국 주식 (18 × 7 = 108)
│   ├── kr-stocks-{data,update}.js← 한국 주식 (18 × 7 = 108)
│   ├── jp-stocks-{data,update}.js← 일본 주식 (UI 제외·보존)
│   ├── ai-{data,update}.js       ← AI 기업 10사
│   ├── etf-{data,update}.js      ← 글로벌 ETF (8 × 7 = 56)
│   ├── commodity-{data,update}.js← 시장·원자재 (6 × 4 = 24)
│   └── unicorn-{data,update}.js  ← 유니콘 (6 × 7 = 42)
├── scripts/
│   ├── generate-message.js       ← 로컬 친구톡 메시지 미리보기
│   ├── send-friendtalk.js        ← 로컬 수동 발송 (디버깅)
│   └── subscribers.example.json
├── supabase/
│   ├── migrations/               ← 스키마 이력 (init / payment / message_type / delivery_state 등)
│   ├── functions/
│   │   ├── subscribe/            ← 웹 구독 요청 업서트
│   │   ├── check-subscription/   ← 결제 전 기존 구독 확인
│   │   ├── payment-confirm/      ← 포트원 결제 검증 + 구독 연장 + 결제완료 알림톡
│   │   ├── daily-send/           ← 매일 친구톡 발송 (cron 트리거)
│   │   ├── solapi-webhook/       ← 솔라피 발송 결과 수신 (실시간 상태 갱신)
│   │   └── admin-api/            ← 운영 대시보드용 (인증·통계·로그·수동발송)
│   ├── schedule.sql              ← pg_cron 등록 SQL (Vault 기반)
│   ├── queries.sql               ← 운영 조회·상태 변경 템플릿
│   └── README.md                 ← Supabase 세팅 가이드
├── docs/
│   ├── kakao-subscription-plan.md        ← 서비스 기획서
│   └── friendtalk-dispatch-runbook.md    ← 발송 파이프라인 E2E 매뉴얼
└── README.md
```

UI 노출 총 348개 항목, 6개 탭 (일본 70항목은 데이터 파일만 보존).

## 기능

### 공개 대시보드
- **6개 탭**: 미국 마켓 · 한국 마켓 · AI 기업 · 글로벌 ETF · 유니콘 · 시장·원자재
- **검색 · 필터 · 스와이프 · 자동 버전 체크 · 연도 동적 라벨 · 탭 상태 유지**
- **업데이트 박스**: 각 탭 최신 3건 요약 (접기/펼치기)
- **탭 정보 아이콘**: 선정 기준을 팝업으로 노출

### 구독 서비스 (유료 친구톡)
- **구독 모달**: 헤더 "구독하기" → 전화번호 + 광고 수신 동의
- **번호 재확인 단계**: 결제 직전 큰 글씨로 번호 재표시 (오타 방지)
- **연장 확인**: 기존 구독자엔 남은 일수·연장 후 만료일 안내
- **결제**: 포트원 V2 (현재 갤럭시아 테스트 채널 · 월 100원)
- **결제 완료 알림톡**: 승인 템플릿 `KA01TP2604210407049408V99MiGpf2B`
- **카카오 채널 친구 추가 필수 안내**: 완료 화면에 강조 배너
- **친구톡**: 매일 08:00 KST, 탭별 최신 1건 요약 + "전체 뉴스 보기" 버튼 (네이티브 CTA)

### 운영 대시보드 `/admin`
- 비밀번호 인증 (Edge Function `admin-api`)
- **통계 카드**: 활성 구독자 수 · 7일 발송 성공/실패 · 결제 매출 요약
- **차트**: 최근 14일 일별 발송량 · 상태별 분포
- **발송 이력 테이블**: 필터(날짜·상태·메시지 타입·배송 상태)
- **수동 발송**: 채널 미가입 등 실패 구독자에게 재발송 트리거 (관리자 액션)

### 콘텐츠 자동 갱신
- Claude Opus 4.7 원격 에이전트가 매일 오전·오후 주기로 6개 탭 데이터 갱신·커밋·푸시

## 발송·상태 동기화 파이프라인

```
[매일 08:00 KST] Supabase pg_cron
    ↓ Vault에서 X-Cron-Secret 꺼내 HTTP POST
daily-send Edge Function
    ├ GitHub Contents API로 data/*-update.js fetch
    ├ 만료 구독자 expired 전환
    ├ 활성 구독자 조회 (status='active')
    ├ 솔라피 친구톡 발송 (bms.targeting='I', disableSms=Y, 배치 500)
    └ send_logs 접수 결과 기록 (status=success/fail)

[비동기, 발송 확정 시점]
솔라피 → solapi-webhook Edge Function
    ├ send_logs 레코드 덮어쓰기 (실제 전달 결과: provider_message="4000: 수신 완료" 등)
    └ subscribers.delivery_state 재계산 (ok/not_friend/blocked/paused_ad/unknown)
```

## 업데이트 워크플로우

| 바꿀 것 | 수정 위치 |
|---|---|
| 탭별 데이터 · 이력 | `data/<탭>-{data,update}.js` |
| UI·레이아웃 | `index.html` |
| 법정 문서 | `terms.html` / `privacy.html` / `refund.html` |
| 친구톡 메시지 포맷 | `supabase/functions/daily-send/index.ts` ↔ `scripts/generate-message.js` (동기화) |
| 구독료·상품명 | `index.html` 내 `SUBSCRIPTION_PRICE`·`SUBSCRIPTION_ORDER_NAME` 상수 |
| 발송 스케줄 | `supabase/schedule.sql`의 cron 표현식 (UTC 기준) |
| 알림톡 템플릿 | `supabase/functions/payment-confirm/index.ts`의 `ALIMTALK_TEMPLATE_ID`·변수 매핑 |

데이터 수정 후 `data/version.js`의 타임스탬프 갱신 필수.
상세 편집 규칙 `CLAUDE.md`, 인프라 세팅 `supabase/README.md`, 발송 운영 `docs/friendtalk-dispatch-runbook.md` 참조.

## 기술 스택

| 레이어 | 도구 |
|---|---|
| 웹 프런트 | 정적 HTML 3종(`index` / `admin` / 법정 문서) · Inter / Pretendard |
| 호스팅 | **Vercel** · `vercel.json`으로 `/admin` 리라이트 |
| 백엔드 | **Supabase Pro** (Postgres + Edge Functions + Vault + pg_cron + pg_net) |
| 결제 | **포트원 V2** (galaxia 테스트 채널 · `windowType.mobile: REDIRECTION`) |
| 메시지 | **솔라피(SOLAPI)** — 친구톡·알림톡, HMAC-SHA256 인증 · 발송 결과 webhook |
| 카카오 | 채널 `_lpxkCX` · 발신프로필 `KA01PF...` · 알림톡 템플릿 `KA01TP...` |
| 자동 콘텐츠 갱신 | Claude Opus 4.7 원격 에이전트 |

### 인증 구조
- 브라우저 ↔ 공개 Edge Function: Supabase publishable key (`sb_publishable_...`)
- pg_cron ↔ daily-send: 자체 `X-Cron-Secret` (Vault 저장)
- 솔라피 ↔ solapi-webhook: `?s=<SOLAPI_WEBHOOK_SECRET>` 쿼리 파라미터 인증
- 관리자 ↔ admin-api: 비밀번호 해시 기반 세션 토큰
- 모든 Edge Function은 `--no-verify-jwt`로 배포 (자체 인증 사용)

## 데이터 스키마 요약

```
subscribers
  id uuid, phone (unique), name, kakao_id
  status (active/paused/expired/cancelled)
  delivery_state (ok/not_friend/blocked/paused_ad/unknown)
  paid_until, last_payment_id, payment_provider
  subscribed_at, expires_at, metadata, created_at, updated_at

payments
  payment_id (unique), subscriber_id, provider, amount, currency
  status (paid/failed/refunded), order_name, paid_at, raw_response

send_logs
  id bigserial, subscriber_id, phone, message, char_count
  status (success/fail/skipped), message_type (friendtalk/alimtalk/sms)
  provider, provider_code (groupId), provider_message, provider_msg_id
  batch_id, sent_at
```

## 운영 메모

- **솔라피 잔액**: 친구톡 약 15원/건, 알림톡 약 8원/건. 잔액 고갈 시 `send_logs.status=fail` + `provider_message="NotEnoughBalance"`.
- **포트원 라이브 전환**: 테스트 채널 키 → 라이브 키로 교체. `ITEM_CODE` 등 bypass 필드는 PG별로 재검토.
- **카카오 채널 미가입자**: 솔라피가 `bms.targeting:"I"`로 필터링하며, webhook이 결과를 `delivery_state='not_friend'`로 자동 반영.
- **관리자 비밀번호 로테이션**: Supabase secret `ADMIN_PASSWORD` 재설정 + 재배포 없이 즉시 적용.
- **스케줄 변경**: `cron.schedule` 표현식은 UTC 기준 (KST = UTC+9).

## Changelog

- **2026-04-24**: 솔라피 발송 결과 webhook 도입 (`solapi-webhook`) — 실제 전달 성공·실패가 실시간 `send_logs`·`subscribers.delivery_state`에 반영. 친구톡 `bms.targeting="I"` 명시로 채널 미가입자 사전 필터링. 탭 선정 기준 팝업. 법정 문서 3종(이용약관·개인정보처리방침·환불정책) 신설. 푸터 2단 레이아웃·사업자 정보. 구독 완료 전용 화면·카카오 채널 추가 강조 배너. 갤럭시아 테스트 PG 전환 (bypass ITEM_CODE + customerId).
- **2026-04-23**: `subscribers.delivery_state` 컬럼 도입 — 발송 후 구독자별 상태 스냅샷 자동 갱신. 푸터 사업자 정보·반응형 배치.
- **2026-04-22**: 친구톡 메시지 포맷 단순화(탭당 1건, 구분선 제거, 네이티브 CTA 버튼). 모바일 결제창 REDIRECTION + 복귀 처리. DB 타임존 KST 전환.
- **2026-04-21**: 친구톡 구독 서비스 · 포트원 결제 · Supabase 백엔드 도입. 매일 08:00 KST 자동 발송. 구독 모달·결제 완료 알림톡. Supabase 신형 API 키(`sb_*`) 대응 — Edge Function `--no-verify-jwt` + 자체 webhook secret. 결제 완료 시 솔라피 알림톡 템플릿 발송.
- **2026-04-20**: Supabase 프로젝트 연동 · 스키마 3종 · Edge Function 4종 배포. 포트원 V2 결제창 + 검증.
- **2026-04-19**: 솔라피 플랫폼 도입. HMAC 인증. 메시지 포맷 정비.
- **2026-04-17**: 자동화 모델 Opus 4.7 고정. 업데이트 박스 토글 버그 수정. 조사 윈도우 1~2일 + 진행 이벤트로 한정.
- **2026-04-16**: 일본 주식 탭 UI 제거. 시장·원자재 탭 명칭·순서 조정.
- **2026-04-14**: 초기 로드 버전 캐시 방지. 헤더 갱신 시간. 매일 7시 KST 자동 콘텐츠 갱신.
- **2026-04-13**: 4개 탭 추가(일본·ETF·원자재·유니콘), 7탭 481항목. 카테고리당 7종목. 단위 표시. 한국 마켓 추가. 허브 → 통합 레포.

## 라이선스

개인용.
