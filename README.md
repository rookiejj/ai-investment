# 브리픽 (Briefick)

미국·한국 주식 + AI 기업 + 유니콘 + 원자재·크립토를 5개 탭으로 보여주는 통합 투자 대시보드, 그리고 해당 데이터 핵심 요약을 매일 카카오 친구톡으로 발송하는 **유료 구독 서비스**. (일본 주식·글로벌 ETF는 UI에서 제외, 데이터 파일만 보존)

- **웹 대시보드**: https://roysbriefing.vercel.app
- **카카오 채널**: https://pf.kakao.com/_lpxkCX
- **친구톡 발송**: 평일(월~금) 오전 8시 KST · 만료 임박 안내 매일 오후 8시 KST
- **운영 대시보드**: `/admin` (비밀번호 보호)
- **수신 문제 안내**: `/help` (`#friend` 채널 친구 추가 / `#ad` 광고 수신 켜기)

## 구조

```
ai-investment/
├── index.html                    ← 통합 대시보드 UI + 구독 결제 모달 (루트)
├── views/
│   ├── admin.html                ← 운영 대시보드 (대시보드·구독자·결제·발송)
│   ├── renew.html                ← 재구독 전용 페이지
│   ├── help.html                 ← 수신 문제 해결 가이드 (마스터-디테일, #friend / #ad)
│   ├── terms.html                ← 이용약관
│   ├── privacy.html              ← 개인정보처리방침
│   └── refund.html               ← 환불정책
├── vercel.json                   ← /admin · /renew · /help · /terms ... → views/ rewrite
├── CLAUDE.md                     ← 데이터 유지보수·자동화 지침
├── assets/
│   ├── briefick_profile_640.jpeg ← 헤더 로고
│   └── roysoft_profile.jpg       ← 푸터 로이소프트 브랜드
├── data/
│   ├── version.js                ← 데이터 버전
│   ├── stocks-{data,update}.js   ← 미국 주식 (18 × 7 = 108)
│   ├── kr-stocks-{data,update}.js← 한국 주식 (18 × 7 = 108)
│   ├── jp-stocks-{data,update}.js← 일본 주식 (UI·자동 갱신 제외, 데이터 보존)
│   ├── ai-{data,update}.js       ← AI 기업 10사
│   ├── etf-{data,update}.js      ← 글로벌 ETF (UI·자동 갱신 제외, 데이터 보존)
│   ├── commodity-{data,update}.js← 원자재·크립토 (6 × 4 = 24)
│   └── unicorn-{data,update}.js  ← 유니콘 (6 × 7 = 42)
├── scripts/
│   ├── generate-message.js       ← 로컬 친구톡 메시지 미리보기
│   ├── send-friendtalk.js        ← 로컬 수동 발송 (디버깅)
│   └── subscribers.example.json
├── supabase/
│   ├── migrations/               ← 스키마 이력 (init / payment / message_type / delivery_state / admin_settings / template_code)
│   ├── functions/
│   │   ├── subscribe/            ← 웹 구독 요청 업서트
│   │   ├── check-subscription/   ← 결제 전 기존 구독 확인
│   │   ├── payment-confirm/      ← 포트원 결제 검증 + 구독 연장 + 결제완료 알림톡(ATA)
│   │   ├── daily-send/           ← 매일 뉴스 친구톡 발송 (평일 cron 트리거)
│   │   ├── expiry-notice/        ← D-1 만료 임박 재구독 안내 친구톡 (매일 20:00 cron)
│   │   ├── solapi-webhook/       ← 솔라피 발송 결과 수신 (실시간 상태 갱신)
│   │   └── admin-api/            ← 운영 대시보드용 (login / change_password / stats / logs / subscribers / payments / expiring_soon / manual_send[알림톡] / daily_send_preview / daily_send_now)
│   ├── schedule.sql              ← 매일 뉴스 cron (평일 08:00 KST)
│   ├── schedule-expiry.sql       ← 만료 임박 cron (매일 20:00 KST)
│   ├── queries.sql               ← 운영 조회·상태 변경 템플릿
│   └── README.md                 ← Supabase 세팅 가이드
├── docs/
│   ├── kakao-subscription-plan.md        ← 서비스 기획서
│   └── friendtalk-dispatch-runbook.md    ← 발송 파이프라인 E2E 매뉴얼
└── README.md
```

UI 노출 5개 탭 (일본 주식 70항목·글로벌 ETF 56항목은 데이터 파일만 보존).

## 기능

### 공개 대시보드
- **5개 탭**: 미국 마켓 · 한국 마켓 · AI 기업 · 유니콘 · 원자재·크립토
- **검색 · 필터 · 스와이프 · 자동 버전 체크 · 연도 동적 라벨 · 탭 상태 유지**
- **업데이트 박스**: 각 탭 최신 3건 요약 (접기/펼치기)
- **탭 정보 아이콘**: 선정 기준을 팝업으로 노출

### 구독 서비스 (유료)
- **구독 모달**: 헤더 "구독하기" → 전화번호 + 광고 수신 동의
- **번호 재확인 단계**: 결제 직전 큰 글씨로 번호 재표시 (오타 방지)
- **연장 확인**: 기존 구독자엔 남은 일수·연장 후 만료일 안내
- **결제**: 포트원 V2 (현재 갤럭시아 테스트 채널 · 월 100원)
- **카카오 채널 친구 추가 필수 안내**: 완료 화면에 강조 배너
- **결제 완료 후 폼 잠금**: 모바일 REDIRECTION 복귀 시 입력값 복원 + 즉시 잠금 (placeholder 노출 방지)

### 메시징 시스템 (4종)

| 종류 | 트리거 | 함수 | 카카오 타입 | 템플릿 / 본문 | 버튼 |
|---|---|---|---|---|---|
| **결제 완료 알림톡** (자동) | 결제 검증 직후 | `payment-confirm` | ATA | `KA01TP260424050234328BFWH2f2vfrN` (#{상점명}/#{상품명}/#{만료일}) | AC "채널 추가" |
| **매일 뉴스 친구톡** (자동·수동) | 평일 KST 08:00 (cron) · 운영 대시보드 즉시 발송 | `daily-send` | CTA | 5개 탭 최신 1건씩 summary, 1000자 한도 초과 시 fitToLimit으로 모든 탭 균등 줄 단위 cut | WL "전체 뉴스 보기" → `/` |
| **재구독 안내 친구톡** (자동) | 매일 KST 20:00 (cron, D-1) | `expiry-notice` | CTA | 자유 텍스트 + 만료일 자동 삽입 | WL "재구독 신청하기" → `/renew` |
| **미수신자 안내 알림톡** (수동) | 운영 대시보드 발송 | `admin-api` `manual_send` | ATA | `KA01TP260424060446377powJn1n8RGU` (#{상점명}) | WL "문제 해결하기" → `/help` |

> **알림톡 vs 친구톡 선택 기준**: 정보성 거래 알림(결제 완료·미수신 안내)은 **알림톡** — 채널 친구 여부·광고 수신 거부와 무관하게 도달. 광고성 콘텐츠(뉴스·재구독 권유)는 **친구톡** — 채널 친구만 도달, 야간(21~08) 발송 금지.

### 운영 대시보드 `/admin`
- 비밀번호 인증 (Edge Function `admin-api` · DB 해시 저장 · 최소 4자)
- **사이드바 3-도메인 구조** + 상단 오버뷰 (해시 라우팅 · 모바일 드로어 · 헤더 새로고침 버튼)
  - **📊 대시보드**: 3개 도메인 통합 카드(활성·7일 매출·14일 성공률·만료 임박·채널 미가입·결제 실패) + 14일 발송 차트 + 구독 상태 도넛 + 최근 결제 5건 + 만료 임박 5건
  - **👤 구독자**: 상태별 카운트 카드 + 구독 상태 분포 도넛 + 전체 목록(상태·구독 상태 필터)
  - **💳 결제**: 7일/30일 매출 카드 + 만료 임박(D-7) 리스트 + 결제 이력(상태·기간 필터 + 페이지네이션)
  - **📬 발송**: 14일 성공률 카드 + 일별 발송량 차트 + **매일 뉴스 즉시 발송**(미리보기→대상 선택→발송, 2x2 그리드 UI) + 미수신자 안내 알림톡 수동 발송 + 발송 이력(상태·타입·**용도**·번호·기간 필터)
- **발송 이력 용도 분류** — `template_code` 컬럼 기반 색상 뱃지: 매일 뉴스 / 수동 발송 / 결제 완료 / 재구독 안내 / (만료 안내 예약)
- **수동 발송**: 친구톡 미도달 구독자(채널 미친구·광고 차단 등)에게 알림톡으로 안내 — 검수 승인 본문 고정, 미리보기 표시
- **시각 표기**: 모두 브라우저 시스템 시간 기준
- **비밀번호 변경** 모달 (헤더) — 현재 비번 확인 후 DB 해시 즉시 갱신

### 재구독 페이지 `/renew`
- 독립 URL · 페이지 로드 즉시 구독 폼 노출
- 동작은 헤더 "구독하기" 모달과 완전 동일 (전화번호 확인 → 연장 확인 → 결제 → 알림톡)
- D-1 만료 임박 친구톡의 "재구독 신청하기" 버튼 도착지

### 수신 문제 안내 페이지 `/help`
- **마스터-디테일 구조**: 진입 시 두 가지 원인 카드 → 클릭하면 상세 가이드로 전환 (해시 라우팅, 페이지 리로드 없음)
  - `#friend` — 카카오톡 채널 친구 추가 가이드 (3단계 + 카카오 노란 CTA)
  - `#ad` — 광고/마케팅 메시지 수신 켜기 (채널별 권장 / 카카오톡 전역)
- 미수신자 안내 알림톡 버튼 도착지

### 콘텐츠 자동 갱신
- Claude Opus 4.7 원격 에이전트가 매일 오전·오후 주기로 5개 탭 데이터 갱신·커밋·푸시

## 발송·상태 동기화 파이프라인

### pg_cron 등록된 작업 (UTC 기준)

| jobname | schedule | KST 변환 | 호출 함수 |
|---|---|---|---|
| `daily-friendtalk-send` | `0 23 * * 0-4` | 평일 08:00 | `daily-send` |
| `daily-expiry-notice` | `0 11 * * *` | 매일 20:00 | `expiry-notice` |

> KST 08:00 = UTC 23:00(전날). UTC 기준 dow 0~4가 한국 평일에 해당.

### 매일 뉴스 친구톡 (08:00 KST 평일 · 또는 관리자 수동 트리거)
```
pg_cron(또는 admin-api 프록시) → Vault X-Cron-Secret → daily-send
    ├ GitHub Contents API로 data/*-update.js fetch
    ├ 한 탭 summary = 한 글머리표 줄(자유 문체 그대로)
    ├ 1000자 한도 초과 시 fitToLimit (모든 탭 보존하며 균등 줄 단위 cut)
    ├ 만료 구독자 expired 전환 (paid_until 과거)
    ├ 활성 구독자 조회 (body.subscriberIds 있으면 그 ID만)
    ├ 솔라피 친구톡 발송 (bms.targeting='I', disableSms=Y, 배치 500)
    └ send_logs INSERT (template_code='daily_news')
```

운영 대시보드 발송 뷰의 **매일 뉴스 즉시 발송**은 admin-api `daily_send_preview` / `daily_send_now`가 동일 함수를 X-Cron-Secret으로 프록시 호출. 발송 누락·재발송 등 예외 상황 대응용.

### 재구독 안내 친구톡 (20:00 KST D-1)
```
pg_cron → Vault X-Cron-Secret → expiry-notice
    ├ 내일(KST) 안에 만료 예정 active 구독자 조회
    ├ 본문에 만료일 자동 삽입 + WL '재구독 신청하기' 버튼 → /renew
    ├ 솔라피 친구톡 발송 (bms.targeting='I', disableSms=true)
    └ send_logs INSERT (template_code='expiry_notice')
```

### 솔라피 webhook (비동기, 발송 확정)
```
솔라피 → solapi-webhook
    ├ send_logs 덮어쓰기 (provider_message='4000: 수신 완료' 등)
    └ subscribers.delivery_state 재계산
```

**SOLAPI 결과 코드 매핑** (solapi-webhook · daily-send 공용)
- `3050` → `not_friend` (채널 친구 아님)
- `3120` → `paused_ad` (광고 수신 거부)
- `3130 / 3140 / 3160` → `blocked` (차단)
- 그 외 → 텍스트 키워드 폴백 (friend/차단/광고 등)

> **`unknown` 분류 처리**: 시간대 제약(`3108`)·메시지 길이 초과(`MessagesNotFound`) 같은 시스템·운영 이슈로 실패하면 unknown으로 분류되는데, 이 경우엔 `subscribers.delivery_state`를 영속 갱신하지 **않음** (수신자 본인 책임이 아니므로 기존 상태 유지). `send_logs`엔 fail로 그대로 기록.

## 업데이트 워크플로우

| 바꿀 것 | 수정 위치 |
|---|---|
| 탭별 데이터 · 이력 | `data/<탭>-{data,update}.js` |
| UI·레이아웃 | `index.html` |
| 법정 문서 | `terms.html` / `privacy.html` / `refund.html` |
| 매일 뉴스 친구톡 본문 | `supabase/functions/daily-send/index.ts` ↔ `scripts/generate-message.js` (동기화) |
| 재구독 안내 친구톡 본문 | `supabase/functions/expiry-notice/index.ts`의 `buildExpiryMessage` |
| 구독료·상품명 | `index.html` 내 `SUBSCRIPTION_PRICE`·`SUBSCRIPTION_ORDER_NAME` 상수 |
| 발송 스케줄 | `supabase/schedule.sql` (뉴스) · `schedule-expiry.sql` (만료 임박) — cron 표현식은 UTC |
| 결제 완료 알림톡 템플릿 | `supabase/functions/payment-confirm/index.ts`의 `ALIMTALK_TEMPLATE_ID` |
| 미수신자 안내 알림톡 템플릿 | `supabase/functions/admin-api/index.ts`의 `MANUAL_TEMPLATE_ID` (env `ALIMTALK_MANUAL_TEMPLATE_ID`로 오버라이드) |

데이터 수정 후 `data/version.js`의 타임스탬프 갱신 필수.
상세 편집 규칙 `CLAUDE.md`, 인프라 세팅 `supabase/README.md`, 발송 운영 `docs/friendtalk-dispatch-runbook.md` 참조.

## 기술 스택

| 레이어 | 도구 |
|---|---|
| 웹 프런트 | 정적 HTML 3종(`index` / `admin` / 법정 문서) · Inter / Pretendard |
| 호스팅 | **Vercel** · `vercel.json` rewrites로 `/admin`·`/renew`·`/terms`·`/privacy`·`/refund` → `views/` 매핑 |
| 백엔드 | **Supabase Pro** (Postgres + Edge Functions + Vault + pg_cron + pg_net) |
| 결제 | **포트원 V2** (galaxia 테스트 채널 · `windowType.mobile: REDIRECTION`) |
| 메시지 | **솔라피(SOLAPI)** — 친구톡·알림톡, HMAC-SHA256 인증 · 발송 결과 webhook |
| 카카오 | 채널 `_lpxkCX` · 발신프로필 `KA01PF...` · 알림톡 템플릿 `KA01TP...` |
| 자동 콘텐츠 갱신 | Claude Opus 4.7 원격 에이전트 |

### 인증 구조
- 브라우저 ↔ 공개 Edge Function: Supabase publishable key (`sb_publishable_...`)
- pg_cron ↔ daily-send / expiry-notice: 자체 `X-Cron-Secret` (Vault 저장 · 함수 env와 동기화 필수)
- 솔라피 ↔ solapi-webhook: `?s=<SOLAPI_WEBHOOK_SECRET>` 쿼리 파라미터 인증
- 관리자 ↔ admin-api: 비밀번호 해시 기반 세션 토큰
- 모든 Edge Function은 `--no-verify-jwt`로 배포 (자체 인증 사용)

> Vault `cron_secret`을 갱신할 때는 `supabase secrets set CRON_SECRET=...`으로 함수 env도 동시에 갱신해야 401이 발생하지 않음.

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
  template_code (daily_news/manual/payment_complete/renew_reminder/expiry_notice/null)
  provider, provider_code (groupId), provider_message, provider_msg_id
  batch_id, sent_at

admin_settings (단일 행, id=1)
  password_hash (SHA-256(password:session_secret))
  updated_at
```

## 운영 메모

- **솔라피 잔액**: 친구톡 약 15원/건, 알림톡 약 8원/건. 잔액 고갈 시 `send_logs.status=fail` + `provider_message="NotEnoughBalance"`.
- **포트원 라이브 전환**: 테스트 채널 키 → 라이브 키로 교체. `ITEM_CODE` 등 bypass 필드는 PG별로 재검토.
- **카카오 채널 미가입자**: 솔라피가 `bms.targeting:"I"`로 필터링하며, webhook이 결과를 `delivery_state='not_friend'`로 자동 반영. 이들에겐 친구톡 도달 불가 → 운영자가 `manual_send`(알림톡)로 `/help` 안내 발송.
- **광고 수신 거부자(`paused_ad`)**: 친구톡 도달 불가, 알림톡(payment-confirm/manual_send)은 정상 도달.
- **카카오 알림톡에 승인된 버튼 노출**: SOLAPI는 템플릿에 승인된 버튼이어도 `kakaoOptions.buttons`에 명시해야 렌더링됨 (AC/WL 모두 동일).
- **AC '채널 추가' 버튼 표시 조건**: 이미 채널 친구인 수신자에게는 자동 숨김 (추가할 대상이 없으므로). 새 가입자에게만 노출.
- **관리자 비밀번호 로테이션**: 대시보드 헤더 "비밀번호 변경"으로 바로 변경(최소 4자). env `ADMIN_PASSWORD`는 최초 초기화용이며, 이후 실 비교는 `admin_settings.password_hash` 기준.
- **스케줄 변경**: `cron.schedule` 표현식은 UTC 기준 (KST = UTC+9). 평일 한정은 UTC dow `0-4` 사용 (KST 월~금 = UTC 일~목).

## Changelog

- **2026-04-29**: 탭 재편 — '시장·원자재' → '원자재·크립토'로 변경 (📊 시장 지표 카테고리 제거 후 🪙 크립토 신설: BTC·ETH·SOL·XRP). 글로벌 ETF 탭은 일본 마켓처럼 UI·자동 갱신 제외(데이터 파일 보존). 친구톡 메시지 가독성 개선 — summary를 multi-line(줄바꿈으로 뉴스 구분) 형식으로 작성하도록 CLAUDE.md 가이드 변경, daily-send이 줄바꿈 split 후 글머리표 출력. 안전망 교체 — 기존 `truncateForLimit`(마지막 탭 통째 제거)에서 `fitToLimit`(모든 탭 보존+균등 줄 단위 cut + 사용 안 한 budget 재분배)으로 변경. 사이트 업데이트 박스 단순화(최신 1건만 표시·시간 버블 제거·펼쳐보기는 변경 항목용으로 유지). `scripts/generate-message.js` 동일 규칙 동기화. 푸터 사업자 정보 정정(주소 '3-1' 추가, 통신판매 신고번호 라인 제거). 카드사 심사용 PPTX 자동 생성 스크립트 + 산출물 추가.
- **2026-04-27**: 메시징 시스템 4종 정비 완료. 매일 뉴스 친구톡 발송을 평일(월~금) 한정 (`'0 23 * * 0-4'` UTC). 만료 임박 재구독 안내를 알림톡(검수 거절) → 친구톡(CTA) 자유 텍스트로 전환, 본문에 만료일 자동 삽입, "재구독 신청하기" WL 버튼으로 `/renew` 연결. 수동 발송을 친구톡 → 알림톡(ATA)으로 전환 — 검수 승인 템플릿 `KA01TP260424060446377powJn1n8RGU` (#{상점명}) + WL "문제 해결하기" → `/help`. 광고 수신 거부 대상에게도 도달 가능. SOLAPI 결과 코드 매핑 강화 — 3050→not_friend, **3120→paused_ad**, 3130/3140/3160→blocked. `unknown` 분류 시 `subscribers.delivery_state` 영속 갱신 skip — 시간대 제약·길이 초과 등 시스템 이슈로 정상 수신자가 잘못 분류되는 문제 차단. 기존 `unknown` 잘못 분류된 구독자 일괄 보정. **매일 뉴스 친구톡 가독성 개선** — summary를 `·` 기준 split해 항목별 글머리표 줄바꿈, 1000자 한도 초과 시 `truncateForLimit`으로 마지막 탭 블록부터 자동 제거. CLAUDE.md에 summary 작성 규칙 신설(`·`은 항목 구분자로만, 비교/병렬은 `,`/`vs`, 항목 자립성). **운영 대시보드 매일 뉴스 즉시 발송 추가** — 발송 뷰 2x2 그리드(좌:툴바·구독자 리스트 / 우:경고·미리보기), 미리보기는 선택 무관 동작, 발송은 미리보기 로드+1명 이상 선택 조건. admin-api `daily_send_preview` / `daily_send_now` 액션, daily-send에 `body.subscriberIds` 필터 수용. `/help` 페이지 신설 후 마스터-디테일 구조 (`#friend` / `#ad`). 결제 복귀 시 입력값 복원 + 즉시 잠금. 관리자 시각 표기를 브라우저 시스템 시간 기준으로. 만료 임박 D-N 계산을 KST 캘린더 일수 차이로 (시각 ms ceil 오프바이원 수정). pg_cron `daily-expiry-notice` 추가 (UTC 11:00 = KST 20:00). 오늘 아침 발송 누락 사고 — Vault `cron_secret` 갱신 후 함수 env `CRON_SECRET` 미동기화로 401 발생, 양쪽 동기화 + README 인증 섹션에 주의 메모 추가.
- **2026-04-24**: 정적 HTML 5개를 `views/`로 이관, `vercel.json` rewrite로 URL 유지(`/admin` 등). 재구독 전용 페이지 `/renew` 신설. 운영 대시보드 `/admin` 2차 개편 — 사이드바를 **3개 도메인(구독자·결제·발송) + 상단 오버뷰 대시보드**로 재편(총 4개 뷰). 대시보드 뷰에 3도메인 통합 카드·차트·최근 결제 5건·만료 임박 5건. 결제 뷰 신설 — 7일/30일 매출, D-7 만료 임박 리스트, 결제 이력 페이지네이션. 발송 뷰 — 수동 발송을 이력 위로 이동(액션은 리스트 위가 관행). `send_logs.template_code` 컬럼 추가 → 발송 이력에 용도 뱃지·필터(매일 뉴스/수동 발송/결제 완료/재구독 안내/만료 안내). `admin-api`에 `payments`·`expiring_soon` 액션 추가, `stats` 확장(상태별 구독·30일 결제·만료 임박). UI 용어 정리 — "배송" → "구독"으로 치환(delivery_state 라벨). 비밀번호 변경 모달(`admin_settings` 해시 저장, 최소 4자). 솔라피 발송 결과 webhook 도입 (`solapi-webhook`) — 실제 전달 성공·실패가 실시간 `send_logs`·`subscribers.delivery_state`에 반영. 친구톡 `bms.targeting="I"` 명시로 채널 미가입자 사전 필터링. 탭 선정 기준 팝업. 법정 문서 3종(이용약관·개인정보처리방침·환불정책) 신설. 푸터 2단 레이아웃·사업자 정보. 구독 완료 전용 화면·카카오 채널 추가 강조 배너. 갤럭시아 테스트 PG 전환 (bypass ITEM_CODE + customerId). 친구톡 메시지 각 탭 1건으로 축소, 타이틀·푸터 구분선 제거, 탭 제목 아래 빈 줄 추가.
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
