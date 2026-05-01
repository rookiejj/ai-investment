# Friendtalk Dispatch Runbook

브리픽 일일 친구톡 자동 발송 파이프라인의 전체 구조·책임 분배·관찰 포인트를 단일 문서로 정리한 운영 매뉴얼.

**대상 독자**: 본 프로젝트 유지보수·장애 대응 담당자.
**마지막 검증**: 2026-04-21 (KST).

---

## 1. 전체 개요

```
[ GitHub · Private Repo ]            [ Supabase · Postgres ]
 data/*-update.js (6)                 subscribers · send_logs
   ▲                                       ▲       │
   │                                       │       │INSERT
   │ HTTP GET                              │SELECT │
   │ (Contents API)                        │UPDATE │
   │                                       │       ▼
[Claude Opus 4.7]           ┌──>[ Edge Function: daily-send ]──>[ 솔라피 API ]──>[ 카카오 ]──>[ 수신자 카톡 ]
 07·13·19시                 │         (Deno / TS)
 data 갱신·커밋             │
                            │
                   ┌────────┴────────────┐
                   │ Supabase pg_cron    │
                   │ KST 08:00 (매일)    │
                   │ Vault secret + pg_net│
                   └─────────────────────┘
```

트리거부터 수신자 도달까지 약 **2~3초** 소요. 모든 단계가 비동기·자동화됨.

---

## 2. 타임라인 — KST 08:00 기준

| 시각 (KST) | 주체 | 사용 시스템 | 동작 |
|---|---|---|---|
| 전일 07·13·19:00 | Claude Opus 4.7 원격 에이전트 | GitHub (private repo), Git | `data/*-update.js` 6개 파일 갱신·커밋·푸시 |
| 08:00 = UTC 23:00 | Supabase pg_cron | 내부 postgres DB 스케줄러 | `cron.job` 테이블의 `daily-friendtalk-send` 잡 발동 |
| 08:00 직후 | pg_cron (`supabase_admin` role) | `vault.decrypted_secrets` view | `cron_secret` 복호화 조회 |
| 08:00 + ms | pg_cron → `pg_net` | Postgres extension `pg_net` | `net.http_post(url, headers, body)` 호출 (비동기) |
| 08:00 + ~1초 | pg_net 워커 | HTTP | `POST /functions/v1/daily-send` |
| 08:00:01~03 | Edge Function `daily-send` (Deno) | env `CRON_SECRET` | `X-Cron-Secret` 헤더 검증 |
| 08:00:01 | Edge Function | GitHub Contents API + `GITHUB_TOKEN` | `data/*-update.js` 6개 파일 fetch |
| 08:00:01 | Edge Function | 내부 로직 (`buildMessage`) | 탭별 최신 2건 요약 → 친구톡 메시지 조립 |
| 08:00:01 | Edge Function | Supabase JS client + `BRIEFICK_SUPABASE_SECRET_KEY` | 만료 구독자 `expired` 전환 |
| 08:00:01 | Edge Function | 동일 | `subscribers WHERE status='active'` 조회 |
| 08:00:02 | Edge Function | 솔라피 REST API | HMAC-SHA256 인증 → `POST /messages/v4/send-many` |
| 08:00:02 | 솔라피 | 카카오 비즈메시지 (`_lpxkCX` · `KA01PF...`) | 친구톡 발송 |
| 08:00:02~03 | 수신자 | 카카오톡 앱 | 친구톡 도착 |
| 08:00:03 | Edge Function | Supabase DB | `send_logs` INSERT |
| 08:00:03 | pg_net | `net._http_response` 테이블 | HTTP 응답 저장 |

---

## 3. 단계별 상세

### 3.1 콘텐츠 준비 (전일)
- **주체**: Claude Opus 4.7 원격 에이전트 (`/schedule` cron)
- **도구**: Claude API · Bash · Git
- **산출물**: `data/stocks-update.js`, `data/kr-stocks-update.js`, `data/ai-update.js`, `data/unicorn-update.js`, `data/commodity-update.js`의 최신 엔트리 prepend
- **저장 위치**: GitHub `rookiejj/ai-investment` main 브랜치
- **가시성**: Private 리포 (PAT 필수)

### 3.2 스케줄 트리거
- **주체**: Supabase Postgres 내부 `pg_cron` 백그라운드 프로세스
- **테이블**: `cron.job`
- **레코드**: `jobname='daily-friendtalk-send'`, `schedule='0 23 * * *'` (UTC), `active=true`, `username='supabase_admin'`
- **실행 기록**: `cron.job_run_details`

### 3.3 Secret 조회 (Vault)
- **주체**: pg_cron SQL의 서브쿼리
- **뷰**: `vault.decrypted_secrets` (암호화된 `vault.secrets`를 복호화해 반환)
- **값**: `cron_secret` (40자 무작위 문자열)
- **권한**: 실행 role이 `vault` schema SELECT 권한 필요

### 3.4 HTTP 호출
- **주체**: Postgres extension `pg_net`
- **함수**: `net.http_post(url, headers, body, timeout_milliseconds)`
- **URL**: `https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/daily-send`
- **헤더**: `Content-Type: application/json`, `X-Cron-Secret: <cron_secret>`
- **본문**: `{}`
- **반환**: request_id (즉시), 실제 응답은 `net._http_response`에 몇 초 뒤 적재

### 3.5 Edge Function 입구 — 인증
- **주체**: Supabase Edge Function runtime (Deno)
- **배포 옵션**: `--no-verify-jwt` (Supabase 게이트웨이 JWT 검증 OFF)
- **자체 검증**: `X-Cron-Secret` 헤더와 env `CRON_SECRET` 비교
- **실패 시**: 401 `{"ok":false,"error":"unauthorized"}`

### 3.6 콘텐츠 Fetch
- **주체**: Edge Function (Deno fetch)
- **API**: GitHub Contents API (`GET /repos/rookiejj/ai-investment/contents/data/<file>?ref=main`)
- **인증**: `Authorization: token <GITHUB_TOKEN>` (Classic PAT, `repo` scope)
- **응답 헤더**: `Accept: application/vnd.github.raw` → 파일 원문 반환
- **파싱**: `new Function(src + 'return updates;')()`
- **취급 데이터**: 각 파일 최신 2개 엔트리 (`date`, `summary`)

### 3.7 메시지 조립
- **주체**: Edge Function 내 `buildMessage()`
- **구성**:
  1. 헤더: `📊 브리픽 · YYYY-MM-DD (요일) KST`
  2. 탭별 블록 6개: 탭 이모지·라벨 + 최신 엔트리 full summary + 직전 엔트리 25자 smartCut
  3. 푸터: 구분선 + "▸ 전체 보기" + `https://roysbriefing.vercel.app`
- **출력**: 단일 문자열 (보통 780~830자, 한도 1000자)

### 3.8 만료 구독자 정리
- **주체**: Edge Function → Supabase JS client
- **인증**: `BRIEFICK_SUPABASE_SECRET_KEY` (대시보드 Edge Function Secrets에 등록한 secret 키, RLS 우회)
- **쿼리**: `UPDATE subscribers SET status='expired' WHERE status='active' AND paid_until IS NOT NULL AND paid_until <= now()`

### 3.9 활성 구독자 조회
- **쿼리**: `SELECT id, phone, name FROM subscribers WHERE status='active'`
- **포함 대상**: 유료 유효기간 남은 구독자 + 무료 등록 구독자(paid_until IS NULL)

### 3.10 솔라피 API 호출
- **주체**: Edge Function `solapiSendFriendtalk()`
- **인증**: HMAC-SHA256
  `Authorization: HMAC-SHA256 apiKey=..., date=..., salt=..., signature=...`
- **엔드포인트**: `POST https://api.solapi.com/messages/v4/send-many`
- **본문**:
  ```json
  {
    "messages": [
      {
        "to": "01012345678",
        "from": "01063963280",
        "text": "<친구톡 본문>",
        "type": "CTA",
        "kakaoOptions": {
          "pfId": "KA01PF260421...",
          "disableSms": true
        }
      }
    ]
  }
  ```
- **배치**: 500명/회
- **응답 핵심 필드**: `groupId`, `groupInfo.count`, `failedMessageList[]`

### 3.11 카카오 친구톡 전달
- **주체**: 솔라피 → 카카오 비즈메시지 API
- **채널**: `브리픽(Briefick)` (`_lpxkCX`) · 발신프로필 `KA01PF260421035843258j1Nf3Ly0q0G`
- **정책 체크**: 카카오 측 야간(KST 21~08) 차단, 친구 비추가자 차단, 광고 수신 미동의자 차단
- **실패 동작**: `DISABLE_SMS_FALLBACK=Y`로 SMS 대체 발송 OFF

### 3.12 발송 로그 기록
- **주체**: Edge Function → Supabase DB
- **테이블**: `public.send_logs`
- **컬럼**:
  - `subscriber_id`, `phone`, `message`, `char_count`
  - `status` (success/fail)
  - `provider='solapi'`, `provider_code=groupId`, `provider_message`, `provider_msg_id=groupId`
  - `batch_id` (이번 cron 실행 식별 UUID)
  - `sent_at` (기본 `now()`)

### 3.13 응답 반환 · pg_net 적재
- **주체**: Edge Function → pg_net 워커
- **반환 JSON**: `{ ok, sent, failed, charCount, batchId, elapsedMs }`
- **저장**: `net._http_response` 테이블에 status_code, content 전문

---

## 4. 주체·시스템 매트릭스

| 주체 | 책임 | 핵심 도구 | 실패 시 영향 |
|---|---|---|---|
| Claude Opus 4.7 | 매일 콘텐츠 갱신 | `/schedule` + Bash + Git | 본문이 어제 데이터로 묶임 |
| GitHub | 콘텐츠 원본 저장소 | Contents API | Edge Function fetch 실패 → 전체 중단 |
| Supabase pg_cron | 시간 트리거 | `cron.schedule`, `pg_net` | 자동 발송 불가 (수동만 가능) |
| Supabase Vault | secret 저장 | `vault.decrypted_secrets` | cron이 401로 실패 |
| Edge Function `daily-send` | 파이프라인 실행 | Deno, Supabase JS, fetch | 발송 불가 |
| Supabase Postgres | DB | `subscribers`, `send_logs`, `payments` | 구독자 목록·로그 상실 |
| 솔라피 | 친구톡 게이트웨이 | REST API + HMAC | 카카오 도달 불가 |
| 카카오 비즈메시지 | 실제 전달 | `_lpxkCX` 채널 | 수신자 도달 0 |

---

## 5. 인증·Secret 지도

| Secret | 저장 위치 | 사용처 |
|---|---|---|
| `GITHUB_TOKEN` (Classic PAT) | Supabase Edge Function env | daily-send → GitHub Contents API |
| `CRON_SECRET` | Supabase Edge Function env | daily-send 자체 X-Cron-Secret 검증 |
| `cron_secret` | Supabase Vault (`vault.secrets`) | pg_cron이 Authorization 헤더 구성 |
| `SOLAPI_API_KEY` · `SOLAPI_API_SECRET` · `SOLAPI_PFID` · `SOLAPI_SENDER` | Supabase Edge Function env | daily-send → 솔라피 API HMAC |
| `PORTONE_API_SECRET` | Supabase Edge Function env | payment-confirm → 포트원 결제 검증 |
| `BRIEFICK_SUPABASE_SECRET_KEY` (`sb_secret_...`) | Supabase Edge Function Secrets + GitHub Secrets | DB 쿼리 (RLS 우회). Storage 업로드(인스타 자동화) 공용 |
| `BRIEFICK_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_...`) | `index.html`·`views/renew.html` 평문 | 브라우저 → subscribe / check-subscription. JS 변수명일 뿐 (별도 등록 X) |

---

## 6. 관찰·디버깅 경로

| 확인 대상 | 쿼리 / 경로 |
|---|---|
| cron 등록 상태 | `select jobname, schedule, active from cron.job` |
| cron 실제 실행 이력 | `select * from cron.job_run_details order by start_time desc` |
| pg_net HTTP 응답 | `select * from net._http_response order by created desc` |
| 활성 구독자 | `select * from subscribers where status='active'` |
| 발송 결과 | `select * from send_logs order by sent_at desc` |
| 결제 이력 | `select * from payments order by created_at desc` |
| Edge Function 코드 | Supabase Dashboard → Edge Functions → daily-send → Code |
| Edge Function 로그 | Supabase Dashboard → Edge Functions → daily-send → Logs |
| 솔라피 발송 상세 | console.solapi.com → 발송 내역 (groupId 검색) |
| 카카오 채널 활동 | center-pf.kakao.com → 브리픽 → 알림 |
| GitHub PAT 사용 이력 | github.com/settings/tokens |

---

## 7. 실패 시나리오 대응

| 증상 | 원인 후보 | 진단 경로 |
|---|---|---|
| cron이 정시에 안 돎 | schedule 미등록·inactive·pg_cron 장애 | `cron.job` / `cron.job_run_details` |
| 401 Unauthorized | `cron_secret` 불일치, Vault 조회 실패 | `net._http_response` content |
| GitHub fetch 404 | PAT 만료·권한 상실, 파일명 오타 | Edge Function logs |
| 500 Internal | 솔라피 응답 에러, DB 쿼리 실패 | Edge Function logs + `send_logs.provider_message` |
| sent > 0인데 카톡 미도달 | 야간(21~08) 차단, 친구 비추가, 광고 미동의 | solapi 콘솔 발송 내역 |
| solapi 402 `NotEnoughBalance` | 잔액 고갈 | solapi 콘솔 → 충전 |

---

## 8. 운영 체크리스트 (최소 주기)

| 주기 | 작업 |
|---|---|
| 월 1회 | 솔라피 잔액 충전 잔량 확인 |
| 월 1회 | GitHub Classic PAT 만료 전 갱신 |
| 분기 1회 | `payments` 매출 집계, `subscribers.paid_until` 분포 점검 |
| 반기 1회 | Supabase secret rotation (API_KEY·SECRET) |
| 변경 후 매번 | `daily-send` 배포 직후 수동 dry-run 호출로 정상 확인 |

---

## 9. 특이 사항 — 시행착오 기록

본 파이프라인 구축 과정에서 발생·해결된 주요 이슈. 재현 시 빠른 참고용.

- **Supabase API 키 체계 전환 (2025 말)**: 구 `eyJ...` JWT(anon·service_role) → 신 `sb_publishable_...` / `sb_secret_...`. Edge Function 게이트웨이가 JWT만 검증하는 기본 동작과 충돌.
  - **해결**: Edge Function 전부 `--no-verify-jwt`로 재배포, `daily-send`는 자체 `X-Cron-Secret` 검증.
- **변수 네이밍 통일 (2026-04)**: Edge Function·프론트·자동화 전 코드베이스를 신네이밍에 맞춰 정리 — `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_SECRET_KEY`, `SUPABASE_ANON_KEY` → `SUPABASE_PUBLISHABLE_KEY`. Edge Function은 자동 주입에 의존하지 않고 `supabase secrets set SUPABASE_SECRET_KEY=...` 로 수동 등록한다.
- **`SUPABASE_` 접두사 예약어 충돌 (2026-05)**: `SUPABASE_SECRET_KEY`로 등록 시도 시 Supabase가 "Name must not start with the SUPABASE_ prefix" 에러로 거부. Supabase 자동 주입 변수가 `SUPABASE_SECRET_KEYS`(복수 JSON), `SUPABASE_PUBLISHABLE_KEYS` 같은 형태로 이미 점유하므로 사용자 정의 secret은 다른 namespace 필수. 프로젝트 prefix 부여 — `BRIEFICK_SUPABASE_SECRET_KEY` / `BRIEFICK_SUPABASE_PUBLISHABLE_KEY`로 일괄 통일.
- **pg_cron과 DB timezone**: `alter database set timezone='Asia/Seoul'` 후 pg_cron schedule도 KST 기준으로 해석됨. UTC 기준 표현식 사용 필수.
  - 테스트 모드: `'0 23,0-11 * * *'` (UTC) = KST 08~20시 매시
  - 운영 모드: `'0 23 * * *'` (UTC) = KST 08:00
- **야간 광고 금지**: 솔라피는 21~08시 친구톡 요청도 200 반환하지만 카카오가 차단. 테스트 cron은 주간으로 한정.
- **SMS fallback**: 솔라피는 친구톡 실패 시 기본 SMS 대체. `DISABLE_SMS_FALLBACK=Y`로 차단.
- **PAT 종류**: 초기 Fine-grained PAT 권한 설정 누락으로 404. Classic PAT (`repo` scope)로 교체 후 정상.

---

## 10. 주요 파일 레퍼런스

| 기능 | 파일 |
|---|---|
| Edge Function 본체 | `supabase/functions/daily-send/index.ts` |
| 웹 구독 Edge Function | `supabase/functions/subscribe/index.ts` |
| 결제 확인 Edge Function | `supabase/functions/payment-confirm/index.ts` |
| 구독 상태 조회 Edge Function | `supabase/functions/check-subscription/index.ts` |
| 스키마 마이그레이션 | `supabase/migrations/*.sql` |
| pg_cron 등록 SQL | `supabase/schedule.sql` |
| 운영 쿼리 템플릿 | `supabase/queries.sql` |
| 로컬 메시지 생성기 | `scripts/generate-message.js` |
| 웹 구독 UI · 결제 모달 | `index.html` |
