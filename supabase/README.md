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
알리고 사전 준비: API Key / User ID / 발신프로필 Senderkey / 등록된 발신번호.

```bash
supabase secrets set \
  ALIGO_API_KEY=xxxxxxxx \
  ALIGO_USER_ID=xxxxxxxx \
  ALIGO_SENDER_KEY=xxxxxxxx \
  ALIGO_SENDER=01012345678
```

선택 secrets:
- `GITHUB_DATA_BASE_URL` (기본값 이 repo의 `main/data`)
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

### 구독자 추가/삭제
```sql
-- 추가
insert into subscribers (phone, name) values ('01012345678', '홍길동');

-- 일시 정지
update subscribers set status = 'paused' where phone = '01012345678';

-- 해지
update subscribers set status = 'cancelled' where phone = '01012345678';
```

### 발송 이력 확인
```sql
select sent_at, status, count(*)
from send_logs
group by 1, 2 order by 1 desc;
```

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
