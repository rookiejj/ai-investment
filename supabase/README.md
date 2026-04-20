# Supabase 세팅 — 브리픽 친구톡 발송

매일 오전 8시(KST) `daily-send` Edge Function이 호출되어
GitHub raw에서 데이터를 읽고 메시지를 조립, 구독자에게 알리고 친구톡 API로 발송합니다.

## 디렉토리

```
supabase/
├── migrations/
│   └── 20260420120000_init.sql     # subscribers / send_logs 스키마
├── functions/
│   └── daily-send/
│       ├── index.ts                # Edge Function 본체
│       └── deno.json
└── schedule.sql                    # pg_cron 등록 템플릿
```

## 초기 세팅 순서

### 1. Supabase 프로젝트 준비
- [supabase.com](https://supabase.com) 에서 프로젝트 생성
- Settings > API 에서 아래 값 메모:
  - `Project URL`  (`https://xxx.supabase.co`)
  - `anon key` (클라이언트 공개용)
  - `service_role key` (서버·Edge Function 전용 · **외부 노출 금지**)

### 2. CLI 설치 & 연결
```bash
brew install supabase/tap/supabase
supabase login
cd /Users/roy/Desktop/work/ai-investment
supabase init            # config.toml 생성 (최초 1회)
supabase link --project-ref <PROJECT-REF>
```

### 3. 스키마 배포
```bash
supabase db push
# 또는 대시보드 SQL Editor에 supabase/migrations/20260420120000_init.sql 내용 붙여넣기
```

### 4. Edge Function Secrets 등록

**GitHub PAT (private repo 시 필수)**

Edge Function이 `data/*-update.js`를 읽으려면 GitHub 인증이 필요합니다.
1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token
2. Repository access: `rookiejj/ai-investment` 하나만 선택
3. Repository permissions → **Contents: Read-only**
4. 토큰 생성 후 한 번만 노출되므로 복사 보관

**알리고 (승인 후 등록)**
- API Key / User ID / 발신프로필 Senderkey / 등록된 발신번호

```bash
supabase secrets set \
  GITHUB_TOKEN=github_pat_xxxxxxxx \
  ALIGO_API_KEY=xxxxxxxx \
  ALIGO_USER_ID=xxxxxxxx \
  ALIGO_SENDER_KEY=xxxxxxxx \
  ALIGO_SENDER=01012345678
```

선택 secrets:
- `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` (다른 repo로 바꿀 때)
- `SITE_URL` (기본값 GitHub Pages URL)
- `FAILOVER=Y` 지정 시 친구톡 실패분 SMS 대체 발송

### 5. Edge Function 배포
```bash
supabase functions deploy daily-send
```

배포 후 함수 URL 확인:
`https://<PROJECT-REF>.supabase.co/functions/v1/daily-send`

### 6. cron 등록
대시보드 SQL Editor에서 `supabase/schedule.sql` 내용을 복사,
`<EDGE_FUNCTION_URL>` 과 `<SERVICE_ROLE_KEY>` 자리를 채워 실행.

## 운영

### 구독자 등록 플로우

MVP 단계는 **수동 등록**으로 운영합니다. 정식 자동화 전까지는 아래 단계로 진행:

1. 사용자가 카카오톡 채널(`브리픽`) **친구 추가**
2. 채널 채팅으로 전화번호 + 광고 수신 동의 의사 받기
3. `supabase/queries.sql`의 **구독자 등록** 섹션 실행 (SQL Editor)
4. 다음 날 08:00 KST부터 자동 발송 시작

> 향후 확장: 웹 랜딩 페이지에서 SMS 본인인증 → `/functions/subscribe` Edge Function이 `subscribers` insert. 결제는 카카오페이 정기결제 빌링키 발급 플로우로 분리. 설계는 `docs/kakao-subscription-plan.md` 참고.

### 광고 수신 동의 관리

친구톡은 **광고성 메시지**이므로 정보통신망법상 수신자의 사전 동의가 필수입니다.

- 등록 시점의 동의를 `subscribers.metadata.ad_consent_at` 타임스탬프로 기록
- **2년마다 재동의** 권장 (법정 주기). 만료 임박 구독자 조회는 `queries.sql` 참고.
- 해지 요청은 즉시 반영 (`status = 'cancelled'`). 24시간 이내 처리 의무.

### 자주 쓰는 쿼리

전체 템플릿은 `supabase/queries.sql` — Dashboard SQL Editor에 필요한 섹션만 복사해 쓰세요.

### 수동 테스트 발송
```bash
curl -X POST https://<PROJECT-REF>.supabase.co/functions/v1/daily-send \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json"
```

### 로컬 드라이런 (발송 없이 메시지만 확인)
```bash
node scripts/generate-message.js
```

## 주의사항

- **pg_cron 타임존은 UTC**. `0 23 * * *`이 KST 08:00입니다.
- Edge Function 실행 제한: 150초. 구독자 수만 명 규모에서도 여유.
- 친구톡은 광고 수신 동의·채널 친구 상태 필수. 심야 발송(21~08) 금지 — 현재 08:00 발송이라 안전.
- **service_role key는 절대 클라이언트(웹/앱)에서 사용하지 마세요.** Edge Function·대시보드에서만.
- 기존 `scripts/send-friendtalk.js`는 로컬 수동 발송용으로 남겨둡니다. 프로덕션은 Edge Function이 단일 경로.
