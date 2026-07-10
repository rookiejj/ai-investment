# 브리픽(Briefick) — 유지보수 컨텍스트

미국·한국 주식 + AI 기업 + 유니콘 + 원자재·크립토를 5개 탭으로 보여주는 통합 투자 대시보드. (일본 주식은 UI에서 제외, 데이터 파일만 보존)

- 파일: `index.html`(렌더링 UI) / `data/`(데이터 14개 파일 + version.js) / `README.md`
- 데이터 파일은 로컬 상대경로로 fetch (`./data/*.js`)

## 자동화 정책 (완전 자동화 모드)

로컬 세션·리모트 트리거 동일 원칙. **Claude Opus 4.7** 고정 (`claude-opus-4-7`). Sonnet으로 실행 중이면 즉시 `/model opus`.

- **판단 권한 위임**: 데이터 갱신·종목 교체·카테고리 재편·UI 소폭 수정은 에이전트가 판단. 사용자에게 묻지 않는다. 근거는 `update.js` 이력에 자연어로.
- **자동 커밋·푸시**: 모든 데이터 파일 변경 시 자동. `/update*` 커맨드·사용자 지시 편집·UI 동반 수정 모두 포함.
- **커밋 메시지**:
  - 데이터 자동 갱신: `데이터 자동 갱신 YYYY-MM-DD` (KST)
  - 구조·UI 변경: 간결한 한국어 요약 (예: "일본 탭 제거")
  - 변경 없으면 커밋 없이 "변경 없음" 보고 후 종료

## 프로모 이벤트 운영 (promo_events / promo_redemptions)

결제 시 보너스 일수 추가를 데이터 기반 이벤트로 관리. 코드 수정 없이 SQL 한 줄로 이벤트 켜고/끄기. 자세한 정책은 `supabase/functions/_shared/promo.ts`.

### 핵심 정책
- **같은 이벤트는 번호당 1회** (`unique(event_id, phone)` 강제). 다른 이벤트엔 별개 — 매번 새 redemption 가능.
- **stacking 안 함**: 결제 시 자격 만족하는 이벤트가 여럿이면 `bonus_days` 가장 큰 1개만 적용.
- **자격 조건 3종**: `first_payment` (이전 결제 없음) / `all` (모든 결제자) / `returning` (status≠active 인 재결제).

### 새 이벤트 발행
```sql
insert into public.promo_events (code, name, description, bonus_days, eligible_for, starts_at, ends_at, active)
values (
  'summer-promo-2026q3',         -- 사람 읽는 키, 영원히 unique
  '여름 한정 +5일',                -- UI 노출
  '7/1~8/31 모든 결제 5일 추가',
  5,
  'all',
  '2026-07-01 00:00:00+09'::timestamptz,
  '2026-09-01 00:00:00+09'::timestamptz,  -- ends_at 지나면 자동 비활성
  true
);
```

### 이벤트 강제 종료 (kill switch)
```sql
update public.promo_events set active = false where code = 'summer-promo-2026q3';
```

### 특정 번호에게 이벤트 재허용
```sql
delete from public.promo_redemptions
 where phone = '0101234XXXX' and event_id = (select id from promo_events where code='launch-first-payment-7d-2026q2');
```

### 운영 현황 조회
```sql
-- 현재 활성 이벤트
select id, code, name, bonus_days, eligible_for, starts_at, ends_at
  from public.promo_events
 where active = true
   and starts_at <= now()
   and (ends_at is null or ends_at > now());

-- 이벤트별 사용량
select e.code, e.name, count(r.id) as redemption_count, sum(r.bonus_days_applied) as total_bonus_days
  from public.promo_events e
  left join public.promo_redemptions r on r.event_id = e.id
 group by e.id, e.code, e.name
 order by e.created_at desc;
```

### 데이터 모델 메모
- `subscribers.trial_used_at` 컬럼은 deprecated 상태 — drop 안 함(롤백 안전망). 새 코드는 안 읽고/안 씀.
- 백필: 기존 `trial_used_at` NOT NULL 인 row 는 마이그레이션 시 `launch-first-payment-7d-2026q2` 이벤트의 redemption 으로 1회성 자동 변환.

### 코드 측 포인트
- 보너스 결정·기록은 모두 `_shared/promo.ts` 의 `pickBonusEvent` / `recordRedemption` 만 사용.
- `payment-confirm` 응답: `bonus_days` (적용된 일수), `bonus_event: {code, name}` (적용된 이벤트), 구 호환 `first_payment_bonus_days`.
- `check-subscription` 응답: `eligible_events: [{code, name, bonus_days}]` (보너스 큰 순), 구 호환 `trial_eligible`.
- `index.html` 의 보너스 배너·confirm 박스·성공 메시지는 `eligible_events[0]` 기반 동적 표시 — 이벤트 이름·일수 그대로 노출.

## 🔴 Supabase Edge Functions — verify_jwt 정책 (엄수)

**브라우저에서 호출하는 Edge Function 은 반드시 `verify_jwt = false`.**

브라우저는 `sb_publishable_*` 형식의 publishable key 로 인증. Supabase 게이트웨이는 기본값(`verify_jwt = true`)일 때 이 형식을 "Invalid JWT" (401 UNAUTHORIZED_INVALID_JWT_FORMAT) 로 거부 — 브라우저 호출 전부 실패. 함수 코드가 정상이어도 게이트웨이에서 막혀 응답 자체가 안 옴.

**적용 방식**: `supabase/config.toml` 에 함수별 명시.

```toml
[functions.<함수명>]
verify_jwt = false
```

**현재 verify_jwt=false 함수 (브라우저 호출)**:
- subscribe · check-subscription · payment-confirm
- survey-api · admin-api (내부 HMAC 토큰으로 자체 인증)
- stock-prices · read-tab-data · read-tab-archive

**verify_jwt=true 유지 (cron·서버 전용)**:
- daily-send · expiry-notice · notify-telegram
- write-tab-data · write-tab-update

**🔴 새 함수 추가 시 (엄수)**: 브라우저에서 호출할 거면 `supabase/config.toml` 에 `verify_jwt = false` 항목 추가하고 같은 PR 에 묶기. 안 그러면 다음 `supabase functions deploy` 가 verify_jwt=true (기본값) 로 배포해 즉시 막힘.

**판단법**: `index.html` / `views/*.html` / `daily/*.html` 에서 `fetch(...functions/v1/<함수명>...)` 패턴으로 호출되면 브라우저 호출. 그 외(`scripts/*` 의 server-side, cron, MCP 등)는 service key 사용이라 verify_jwt 무관.

**Why**: 2026-05-20 payment-confirm·check-subscription 이 2주간 401 로 막혀 있었음. publishable key 도입(4/21) 후 verify_jwt 기본값과 충돌해 결제·구독 자격 체크가 silent fail. 클라이언트는 chk.ok=false 만 보고 "신규 구독자"로 처리하는 fallback 분기 타서 사용자에겐 "왜 만료일 무시하고 신규처럼 처리됨?"으로 발현. 게이트웨이 401 은 함수 로그에도 안 잡혀 디버깅 매우 비쌌음. `supabase functions deploy --no-verify-jwt <함수>` 임시 명령으론 한 번 잡히지만 다음 재배포에서 또 풀려서 config.toml 영구 박기로 결정.

**검증법**: 새 함수 배포 직후 (특히 새 PR 머지 후) 다음 한 줄로 401 안 나오는지 확인.

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  "https://<project-ref>.supabase.co/functions/v1/<함수명>" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $PUBLISHABLE_KEY" \
  -H "apikey: $PUBLISHABLE_KEY" -d '{}'
```

200/400/405 면 OK (게이트웨이 통과 후 함수 응답). 401 with `code:"UNAUTHORIZED_INVALID_JWT_FORMAT"` 면 verify_jwt 설정 누락.

## 파일 구조

```
ai-investment/
├── index.html                  ← 통합 UI (5개 탭, jp 제외)
├── CLAUDE.md                   ← 이 파일
├── data/
│   ├── version.js              ← 데이터 버전 (탭 전환 시 자동 체크)
│   ├── stocks-data.js          / stocks-update.js
│   ├── kr-stocks-data.js       / kr-stocks-update.js
│   ├── jp-stocks-data.js       / jp-stocks-update.js   (UI·자동 갱신 제외)
│   ├── ai-data.js              / ai-update.js
│   ├── commodity-data.js       / commodity-update.js
│   ├── unicorn-data.js         / unicorn-update.js
│   ├── calendar-events.js      ← 이벤트 캘린더 데이터 (recurring 패턴 + fixed 단발)
│   ├── macro-data.js           ← FRED 매크로 지표 (scripts/fetch-macro.js 자동 생성, UI·DB sync 미와이어 — Phase 2 예정)
│   └── company-ko.js           ← 영문 회사명·티커 → 한글 매핑 (index.html·daily-send 공용)
└── README.md
```

---

## 공통 규칙 (모든 탭 적용)

### 업데이트 체크리스트 (매 요청 시 이 순서)

1. **시간 확인**: `TZ=Asia/Seoul date '+%Y-%m-%d %H:%M KST'` → NOW, `TZ=Asia/Seoul date '+%Y%m%d-%H%M'` → VERSION.
2. **조사**: 아래 [변경 감지 방법론] 대로 1~2일 윈도우 내에서 조사 (진행 중 이벤트는 예외).
3. **데이터 수정**: `data/<탭>-data.js`를 최소 diff로 Edit. 회계·거버넌스 이슈 기업은 즉시 제외하고 동일 섹터 대체주로 교체.
4. **이력 prepend**: `data/<탭>-update.js` 맨 앞에 새 엔트리 추가 (아래 [update.js 누적 원칙] 참조).
5. **캘린더 이벤트 점검**: 조사 중 발견한 향후 60일 안 알려진 일정(어닝·매크로·IPO·컨퍼런스)을 `data/calendar-events.js`의 `fixed` 배열에 append. 자세한 정책은 [캘린더 이벤트 운영] 참조.
6. **버전 갱신**: `data/version.js`의 `DATA_VERSION`을 VERSION 값으로 갱신.
7. **커밋·푸시**: `데이터 자동 갱신 YYYY-MM-DD` 메시지로 `git add data/` + commit + `git push origin main`.

### 편집 규칙

- **한 줄 이유(rs)**: 12단어 이내. 기술 스펙 + 시장 맥락 함께. 단순 나열 금지.
- **재무 수치**: 컨센서스 기반 추정치. 상대적 규모감이 목적 — 소수점 둘째 자리 다투지 않음.
- **수치 표기**: 대형주는 정수 반올림, 소형주는 소수점. 적자는 NM/NA 금지, 음수 문자열 (예: `"-0.15"`).
- **부분 업데이트**: 사용자가 특정 섹터/종목만 지정하면 나머지는 건드리지 않는다.

### 탭 콘텐츠 독립성 원칙 (cross-tab 인용 금지)

각 탭은 **자기 시장·도메인의 뉴스만** 다룬다. 외부 이벤트가 핵심 동인이더라도 자기 시장 주체로 환원해 서술하고, 다른 탭의 기업·자산 이름을 직접 끌어오지 않는다.

- **한국 주식**: 미국 매크로·환율·외국인 수급 영향은 한국 종목/지수 관점으로. `"AAPL Q2 → 한국 IT 부품 후방"` 처럼 미국 기업명을 직접 거론하는 cross-tab 인용 금지. `"글로벌 프리미엄 스마트폰 공급망 후방 수요"` 같은 일반화 표현으로 우회.
- **미국 주식**: 한국·일본·중국 종목 직접 인용 금지. 같은 섹터·테마는 미국 종목 위주.
- **AI 기업**: 모델·인프라·생태계 사건만. 일반 빅테크 IR(분기 실적·배당·자사주)은 미국 주식 탭 영역.
- **유니콘·프리IPO**: 비상장 펀딩·라운드·거버넌스만. 상장 종목 동향은 다루지 않음.
- **원자재·크립토**: 자산 자체 가격·수급·정책 사건만. 관련 주식 종목명 직접 인용 금지.

**예외 (직접 비즈니스 연결만 허용)**: 종목 `rs` 필드의 사업 본질 묘사는 cross-reference 가능. 예: LG디스플레이 `"OLED·IT패널·애플 공급"` — 실제 공급 관계 표현이므로 OK. 단, `update.js`의 사건/뉴스 서술(summary·detail·text)에는 적용 안 함.

**Why:** 탭을 분리한 의의는 시장별 고유 관점 제공. 외부 사건을 같은 톤으로 여러 탭에 중복 기재하면 분리 의미가 없고, 사용자에게도 "왜 한국 탭에 미국 회사 얘기?" 혼란을 준다.

**How to apply:** `update.js` 작성 시. 외부 영향 서술이 필요하면 자기 시장 주체로 환원하거나, 환율·매크로·일반화 표현으로 우회. 자동 갱신 에이전트도 동일 원칙 적용.

**🔴 summary 5줄에 대한 엄수 룰 (자주 사고 나는 부분)**: summary는 인스타·신문 hero·친구톡에 그대로 노출돼 사용자가 가장 먼저 보는 면이다. **summary 어느 줄에도 다른 탭 시장의 종목·지수·기업명 직접 인용 절대 금지**. 자주 일어나는 위반 패턴:

- ❌ kr summary에 `美 3대 지수 동반 신고가 - S&P 7,501·나스닥 26,635·다우 5만`
- ❌ kr summary에 `AMAT Q2 매출 $7.91B·EPS $3.51 컨센 상회`
- ❌ kr summary에 `美中 1조$ 합의 - 보잉 737맥스 500대·콩·소고기 매입`
- ✅ kr summary에 `KOSPI 8,000 카운트다운 + 시진핑 방한 2일차 對中 반도체 라이센스 분기점`
- ✅ kr summary에 `삼성전자 296,000원 +4.23% 사상 최고가`
- ✅ kr summary에 `美中 합의 후방 수혜 - 반도체·기계 외국인 매수 확대` (외부 사건을 한국 시장 주체로 환원)

stocks·ai·commodity·unicorn 동일 원칙. summary 5줄 작성 시 각 줄이 **자기 탭 도메인의 종목·지수만** 등장하는지 한 번 자기 검증.

### 탭 간 사건 중복 방지 원칙 (선점 우선)

같은 사건이 여러 탭의 도메인에 걸칠 때, **처리 순서상 앞 탭이 선점**하고 뒤 탭은 그 사건을 **기록하지 않는다**. 중복으로 슬롯 낭비하지 말고 뒤 탭은 자기 도메인 고유 사건으로 채운다.

**처리 순서 (선점 우선순위)**

1. **한국 주식 (kr)**
2. **미국 주식 (stocks)**
3. **AI 기업 (ai)**
4. **유니콘·프리IPO (unicorn)**
5. **원자재·크립토 (commodity)**

⚠️ **선점 순서 ≠ 표시 순서** — 위는 자동 갱신 시 dedup 우선권을 정하는 처리 순서. 사용자에게 노출되는 면(헤드라인·인스타 포스팅·대안 자산·친구톡 등)은 아래 [표시 순서] 따름.

**표시 순서 (모든 사용자 노출 면)**

`kr → stocks → ai → commodity → unicorn`

선점 순서와 unicorn↔commodity 위치가 뒤바뀐다. 사용자에겐 자산성 친숙도(원자재가 비상장 유니콘보다 일상적)가 우선이라 commodity가 먼저 나오고 unicorn이 마지막. 대안 자산 섹션처럼 commodity가 원자재·크립토로 분리된 면에서는 `ai → commodity → crypto → unicorn` (commodity·crypto 인접 — 동일 데이터 출처).

**선점 판정 — 사건의 1차 도메인이 우선**

겹치더라도 뒤 탭의 도메인이 사건의 1차 본질이면 그 탭이 가져간다. 단, 1차 도메인 판정이 모호하면 처리 순서상 앞 탭이 가져간다.

- **AAPL Q2 실적**: 미국 주식 탭 (분기 IR은 stocks 도메인). AI 탭은 모델·인프라 사건이 아니므로 기록 안 함.
- **Anthropic 펀딩 라운드**: AI 탭 (생태계·인프라 마일스톤). 유니콘 탭은 비상장 펀딩이라도 AI 전업이면 [유니콘 명세상 제외] 원칙대로 기록 안 함.
- **OPEC+ 감산 발표**: 원자재 탭 (자산 정책 사건). 미국 주식 탭은 XOM/CVX 개별 호재가 따로 있을 때만 기록.
- **NVDA 신모델 출시**: AI 탭 (모델·인프라 본질). 미국 주식 탭은 동일 사건 기록 안 함 — NVDA는 다른 사건(가이던스·실적 등)으로 채움.
- **삼성전자 HBM 양산 가이던스**: 한국 주식 탭 (한국 종목 IR). AI 탭은 동일 사건 기록 안 함.

**Why:** 동일 사건을 2~3개 탭에 동일 톤으로 반복 기재하면 사용자가 매일 받는 친구톡에서 같은 헤드라인이 여러 번 노출 — 정보 밀도 손실이고 분리의 의미가 없다. 슬롯이 한정된 만큼(탭당 summary 3~5줄) 중복 한 줄은 다른 고유 사건 한 줄을 못 싣는다는 비용이다.

**How to apply:** 자동 갱신 에이전트는 위 처리 순서대로 탭별 summary·changes를 작성한다. 뒤 탭을 작성할 때 앞 탭에 이미 들어간 사건은 **건너뛴다**. 건너뛴 자리는 자기 탭 도메인 고유 사건(섹터 내 다른 종목·다른 주제)으로 채운다. cross-tab 인용 금지 원칙([탭 콘텐츠 독립성])과 결합돼, 뒤 탭이 "앞 탭 사건의 영향" 식 우회 서술도 하지 않는다.

**🔴 첫 줄 충돌 금지 — 1면 헤드라인 직결 (엄수)**: 인스타 캐러셀·릴스 표지(신문 1면)는 **각 탭 summary의 "첫 줄"을 한 줄씩 끌어와 5줄로 쌓는다**. 따라서 **서로 다른 탭의 첫 줄이 같은 사건이면 1면에 동일 헤드라인이 2~3중복으로 노출된다**. G7 정상회의·FOMC·지정학 합의처럼 매크로 하나가 전 시장을 덮는 날 특히 사고 빈발. 작성 규칙:

- **모든 탭의 summary 첫 줄은 서로 다른 사건이어야 한다.** 큰 매크로 사건은 선점 우선순위상 가장 앞 탭(kr이 1차 도메인 아니면 해당 사건의 1차 도메인 탭)이 첫 줄로 가져가고, **나머지 탭은 그 사건을 첫 줄에 올리지 않는다** — 자기 도메인 고유 사건을 첫 줄로.
- 같은 사건의 *각도만 바꾼* 첫 줄(예: kr "G7 - 이재명 출국" / stocks "G7 - AI 3강 참석" / ai "G7 - AI 3강 정렬")도 충돌로 본다. 1면에서 "G7" 세 줄이 쌓이는 게 핵심 문제.
- 안전망: `scripts/cartoon/headline-dedup.js`가 렌더 단계에서 **도메인 소유권 기반 dedup**을 한다. 각 줄을 키워드로 소유 도메인을 판정하고(FOMC→stocks·WTI/제네바→commodity·Altman/Claude→ai 등), 같은 사건이 여러 탭에 있으면 **소유 탭이 가져가고 빌려온 탭에선 표지·슬라이드 모두 제거**한다(처리 순서 아닌 도메인이 우선). 같은 사건이라도 프레이밍 도메인이 다르면 다른 줄로 봐 유지(예: "G7-이재명 출국"=kr / "G7-AI 3강"=ai 둘 다 남음). **단 이건 폴백이지 면죄부가 아니다** — 빌려온 줄이 많은 탭은 슬라이드 불릿이 줄어든다. 애초에 각 탭이 자기 도메인 사건으로 summary를 채워야 슬라이드가 균형 잡힌다. 특히 매크로 사건(FOMC·지정학)을 kr summary에 과다 적재하지 말 것 — 어차피 소유 도메인 탭으로 넘어가 kr 슬라이드만 비어 보인다.

**사고 이력**: 2026-06-15 kr·stocks·ai 세 탭이 전부 "G7 에비앙 개막"을 첫 줄로 올려 인스타 1면·릴스 표지 상단 3줄이 동일 사건으로 도배됨. 렌더 dedup 도입으로 구조 차단했으나 에이전트의 첫 줄 분산이 1차 방어선.

### 제외 규칙 (해당 시 즉시 교체)

- 회계·거버넌스 이슈 (예: SMCI)
- 상용화 지연·실질 매출 없는 기업 (예: NuScale SMR)
- 재무 악화 (지속 적자 심화·자본잠식 등, 예: POWL)
- ETF·펀드·레버리지·인버스 일체
- 한국 주식 한정: 비상장·해외 상장 기업 (예: 쿠팡 CPNG)
- 유니콘 한정: 상장 완료·피인수 기업 (즉시 대체 기업 편입)

### 새 종목 추가 체크리스트 (3개 이상 Yes여야 추가)

1. 이 기업을 빼고 해당 섹터를 설명할 수 있는가? (No 여야 함)
2. FY26E 컨센서스가 존재하는가?
3. 12단어 이내로 차별화 포인트를 쓸 수 있는가?
4. 기존 항목 중 하나보다 대표성이 높은가?

### 카테고리 변경 원칙

- 새 카테고리 추가 시 **기존 카테고리 하나를 먼저 통폐합**해 자리를 만든다.
- 추가보다 교체가 원칙. 카테고리 수는 각 탭 명세 기준 유지.

### 의식적으로 하지 않는 것

- 목표가 / 매수매도 의견 표시
- 시가총액·PER 등 밸류에이션 지표
- 차트·주가 히스토리
- ETF 추천 (ETF 탭 제외) / 미국·한국 외 개별주 확장

### 변경 감지 방법론

**⏱ 시간 윈도우: 최근 1~2일 + 진행 중 이벤트 예외 (매일 갱신 전제)**

매일 갱신되는 프로젝트이므로 조사 범위를 **"오늘 기준 최근 1~2일 뉴스"**로 좁힌다. 그보다 과거 이벤트는 이전 실행에서 반영됐다고 간주하고 재스캔하지 않는다.

- **이유**: 매 실행 전 기간 재스캔하면 이미 반영된 사건을 다시 만지거나 옛 검색 결과가 뒤섞여 노이즈가 커진다.
- **검색어**: `TICKER news 2026-04-15`, `기업명 어제 뉴스`, `Q1 earnings this week` — "지난 달"·"YTD" 같은 광범위 쿼리 금지.

**예외 (윈도우를 넘어 계속 추적)**: 상태 전환성 이벤트 — 진행 중 M&A 클로징, 분기 실적 시즌(컨센서스→확정→가이던스), 예정된 신제품·모델 출시, IPO 로드쇼·펀딩 협상, rs에 이미 "예정"으로 기재된 이벤트 (예: "4/22 실적발표").

**판단 기준**: rs에 진행형 이벤트가 기재됐거나 1~2일 내 새 뉴스가 있을 때만 조사 대상. 둘 다 아니면 건드리지 않는다.

**아래 4단계를 1~2일 윈도우 안에서 함께 돌려라** (한 쿼리에만 의존하면 개별 종목 변화 놓침):

1. **rs 필드 유효성 검증**: 각 종목 `rs`가 특정 사건을 명시하면 그 사건이 최신인지 확인. 새 사건 있거나 진행 상태 완료됐으면 교체.
2. **개별 티커 타겟 검색**: 광역 검색만으로는 부족. 대표 상위 3~5개 티커를 개별 검색 (`TICKER news YYYY-MM-DD` 형식).
3. **진행 중 이벤트 추적**: rs에 기재된 진행 중 사건은 윈도우 밖이어도 상태 전환 여부 확인.
4. **외부 서프라이즈 스캔 (폐쇄 루프 방지)**: 섹터·테마 단위 광역 뉴스 1~2회. 대형 IPO·섹터 재편 M&A·파괴적 신제품·신규 대형 펀딩·카테고리 리더십 변화 중 **오늘·어제 발생한 것**만. 교체는 위 [새 종목 추가 체크리스트] 엄격 적용.

**원칙**: 조사는 광범위, 편집은 보수적. "애매하면 건드리지 않는다"는 **편집** 판단 원칙이지 조사 범위를 좁히는 구실이 아니다.

### 데이터 버전 갱신

- 데이터 파일 수정 시마다 `data/version.js`의 `DATA_VERSION` 갱신. 형식: `"YYYYMMDD-HHmm"` (KST).
- 사용자가 접속 중이면 탭 전환 시 version.js를 체크해 버전 다르면 자동 재로드.

### 업데이트 시간 표기

- date 필드는 **한국 시간(GMT+9)** 날짜+시간: `"2026-04-13 01:30 KST"`
- 시간은 반드시 `TZ=Asia/Seoul date`로 확인 — 추측 금지.
- 과거 기록 중 시간 없는 항목은 그대로 (소급 수정 안 함).

### 변경 로그 이원화 원칙

- **update.js 파일들** — 일반 사용자 대상. 어떤 기업/종목의 무엇이 왜 변경됐는지를 전문적 톤으로 기록. 기술적 세부사항 제외.
- **README.md** — 개발자 대상. 소스코드 구조·파일 추가/삭제·UI 로직 수정 등 기술적 변경만.

### 한글 매핑 단일 소스 (data/company-ko.js)

영문 회사명·티커 → 한글 표기 매핑은 **`data/company-ko.js` 한 곳에만 둔다.**

**왜 단일 소스인가**: 같은 데이터가 두 채널로 흐름.
- **렌더 경로**: `index.html`이 부팅 시 fetch → `_setCompanyKo()` → `localizeText()`로 헤드라인·캘린더·종목 텍스트 한글화
- **발송 경로**: `supabase/functions/daily-send`가 GitHub raw로 fetch → 같은 `localizeText()`로 친구톡 본문 한글화

매핑이 두 곳에 흩어지면 한쪽만 갱신돼 표류 발생 — 실제로 분리 전엔 헤드라인은 한글화 잘 되는데 친구톡만 영문 그대로 나가는 사고가 있었다.

**🔴 매핑 추가·수정 시 이것만 따른다 (엄수)**:
- 회사명·티커·일반어를 추가하거나 표기를 바꿀 때 **`data/company-ko.js` 한 파일만** 수정.
- `index.html`이나 `supabase/functions/daily-send/index.ts`에 매핑 리터럴을 다시 인라인하지 말 것 — 분리 의미가 사라진다.
- 새 항목 추가 시 단어 경계 룰 고려: 단일 글자·짧은 약어 티커(F·V·C·S·MS·MA·BE 등)는 일반 단어와 충돌하므로 풀네임만 매핑하고 ticker는 빼기. 새 충돌 후보 발견 시 같은 패턴 따르기.
- `NAME_KO`(index.html 인라인, 종목 카드 라벨용)는 별개 — 본문 치환이 아니라 카드 nm 표시용이라 `displayName()`이 직접 룩업. `COMPANY_KO`와 역할 다르니 통합하지 말 것.

**검증 방법**: 매핑 추가 후 로컬에서 `node` 한 줄로 단위 검증 가능.
```bash
node -e "const fs=require('fs');const src=fs.readFileSync('data/company-ko.js','utf8');const m=new Function(src+';return COMPANY_KO;')();console.log('총',Object.keys(m).length,'개')"
```

### update.js 사용자향 문체 규칙 (절대 지킬 것)

`summary`·`detail`·`text`에 내부 구현 용어 금지. 사용자는 데이터 필드명·편집 작업 단위를 몰라도 된다.

**금지 표현**
- `rs 갱신`, `rs 및 수치 갱신`, `rs 맥락`, `rs에 XXX` — `rs`는 내부 필드명, 사용자 관점에선 존재하지 않는 개념.
- `~을 반영`, `XXX 반영`, `~ 반영해` — 편집자 관점 표현. 금융 관용어 `선반영`/`priced in`은 예외.
- `r1`·`p1`·`r2`·`p2`·`ipo`·`round` 등 내부 키를 detail 본문에 노출하지 말고 "가이던스"·"매출"·"밸류에이션" 같은 자연어로.
- **트레이더 은어 `비트(beat)`·`미스(miss)`·`인라인(in-line)`** — 한국 증권가에서 통용되지만 일반 구독자에겐 외래어로 어색. **`컨센 상회`·`컨센 하회`·`컨센 부합`**으로 풀어쓰기.
- **시장 상태를 가리키는 `톤(tone)`** — `도브 톤`, `매파 톤`, `약세 톤`, `회복 톤`, `디에스컬레이션 톤`, `거부 톤` 등 모두 트레이더 은어. **자연어로 풀어쓴다**: `도브 톤` → `비둘기파 시그널`/`완화 기조`, `약세 톤` → `약세 기조`/`약세 흐름`, `회복 톤` → `회복 흐름`, `디에스컬레이션 톤` → `긴장 완화 기조`/`긴장 완화 흐름`, `거부 톤` → `거부 입장`/`거부 기조`. 단위로서의 `톤(metric ton)`은 예외(예: "구리 50만 톤 수요").

**대시 사용 규칙 (요약·본문 공통)**

긴 em-dash(`—`) 대신 짧은 hyphen(`-`)을 쓴다. 친구톡·인스타 캡션에서 긴 대시는 시각적으로 무겁고 거슬린다.

- 사건 사이 구분 시: `이벤트A — 이벤트B` → `이벤트A - 이벤트B` 또는 `이벤트A, 이벤트B` / `이벤트A · 이벤트B`
- 보충 설명 시: `... — 핵심 시그널` → `... - 핵심 시그널` 또는 줄바꿈으로 분리
- 맥락 연결 시: `A — B로 결합` → `A로 B 결합` 같은 자연어 재구성 권장
- 인접 공백은 한 칸 유지: `A - B` (양옆 공백 1칸씩)

**`+` 기호 사용 규칙**

`+`는 **등락률 부호(`+4.23%`, `+0.7%`)나 수학 연산자(`A+B=C`)에만 쓴다**. 두 사건을 연결하는 자연어 자리에 `+` 쓰면 어색:

- ❌ `KOSPI 8,000 카운트다운 + 시진핑 방한 2일차 對中 반도체 라이센스 분기점`
- ❌ `한화에어로 KAI 지분 5.09% 매수 + 연내 추가 5,000억원 가이던스`
- ✅ `KOSPI 8,000 카운트다운 · 시진핑 방한 2일차 對中 반도체 라이센스 분기점`
- ✅ `한화에어로 KAI 지분 5.09% 매수 · 연내 추가 5,000억원 가이던스`
- ✅ `삼성전자 296,000원 +4.23% 사상 최고가` (등락률 부호는 OK)

병렬 연결은 `·`(또는 `,`·hyphen). `+` 연결 표기는 검토 후 모두 자연 기호로 교체.

**권장 문체**
- detail 시작부: `"기업명(티커). 본문..."` 또는 `"기업명(티커) - 본문..."`. 메타 문구 없이 바로 사건·수치·맥락·전망으로 들어간다.
- `"Q1 실적 반영"` → `"Q1 실적 발표"` / `"Q1 실적 확정"` / `"Q1 실적"` 중 맥락 맞게.
- summary 끝의 `"...반영"` → 제거하거나 `"...업데이트"` / `"...확정"` / `"...기준"` / `"...추가"`로.
- `"일제 비트"` → `"동시 컨센 상회"` / `"일제히 컨센 상회"`. `"EPS $3.31 비트"` → `"EPS $3.31로 컨센 $3.16 상회"`.
- 뉴스 기사 톤: 사건·수치·맥락·전망. 편집 메타 문구 없이 팩트만.

**Why:** `rs`·`반영` 등은 편집자 관점 용어. 사용자는 "오늘 이 기업에 뭐가 있었나"만 알고 싶어 한다.

**🔴 커밋 전 lint 체크리스트 (엄수)**

데이터 파일 수정 후, 커밋 전에 다음 두 lint를 모두 실행. 0건 통과해야 커밋.

```bash
./scripts/lint-jargon.sh           # 트레이더 은어·편집자 메타 표현 잔재
node scripts/lint-finmap-pool.js   # 핀맵 풀 종목 형식·한글명 lookup 검증
```

핀맵 풀 lint가 잡는 것:
- 한국 ticker 형식 (6자리 숫자)
- 한국 ticker 한글명 lookup 가능 여부 (kr-stocks-data.js 큐레이션 OR sector-pool.js의 KR_NAME_OVERRIDE 매핑 필요)
- 미국 ticker 형식 (대문자)
- KR_NAME_OVERRIDE에 있지만 풀에 없는 dead 매핑 (정리 권장)

위반 시 ticker 자체가 잘못됐을 수 있으니 풀에서 제거하거나, 정확한 한글명을 KR_NAME_OVERRIDE에 추가.

이 lint는 자동 갱신 에이전트가 작성하는 모든 update.js·data.js 텍스트에 적용. 사후에 사용자가 발견해 지적하는 비용이 누적되면 신뢰도 직격이라 발견 즉시 룰 강화한 이력(2026-05-06)이 있다.

**왜 lint 한 번 더 돌리나** — 모델이 긴 detail 본문 작성 중 무의식적으로 한국 증권가 통용 표현을 흘려넣음. CLAUDE.md를 읽고 인지하더라도 본문 작성 시점엔 잊을 수 있어, 기계적 검증 한 단계가 가장 확실하다. lint가 false positive를 잡으면 (예: "변동성을 반영해" 같은 시장 인과 자연어) 사람이 판단해 패스, 패턴 자체가 너무 광범위하면 `scripts/lint-jargon.sh`의 PATTERNS·EXCLUDE 좁히기.

### update.js 트리밍 — 커밋 직전 entries 1건 한도 강제 (자동 갱신 필수 단계)

자동 갱신 트리거 sandbox는 직접 `git push`가 아웃바운드 프록시에서 403으로 차단되고, 우회 경로인 MCP `push_files` API는 JSON body 사이즈 한계(~50KB 부근)가 있어 큰 *-update.js를 GitHub로 못 되돌린다. 5/9 오전·오후 두 번 *-data.js만 푸시되고 *-update.js는 못 푸시되며 헤드라인이 5/8 그대로 머무는 사고 발생.

5/14 DB 전환 완료(Supabase `tab_updates` source_hash dedup)로 git의 *-update.js는 sandbox 작업 컨텍스트 외 역할이 없어졌다. **history·dedup은 DB가 100% 담당, git은 가장 최근 1건만 — entries 1건 한도**로 단순화.

**룰**: update.js 이력 prepend 후 커밋 직전에 다음 명령 실행:

```bash
node scripts/trim-update-logs.js   # 모든 *-update.js를 최근 1건으로 자동 트리밍
```

- 1건은 **상한**(최대). 더 줄일 수 없으니 정확히 1건 유지
- 결과 항상 멱등 — 이미 1건 이하면 skip

**왜 1건인가**: 친구톡(`PER_TAB=1`)·인스타 캐러셀·TL;DR·hero·daily-send 모두 DB의 `tab_updates`를 읽는다. git의 *-update.js는 sandbox가 직전 1건을 참조해 같은 사건 재기록 방지하는 용도뿐 — 더 깊은 dedup은 DB source_hash가 자동 처리. 1건 = 약 3~5KB로 kr/stocks data.js와 묶어도 50KB push 한계 안에서 마진 10KB+ 확보.

**왜 매번 자동으로 돌리나**: 매일 갱신마다 prepend되니 entries 누적. 사람이 매번 의식적으로 잘라내는 룰은 거의 지켜지지 않으므로 기계적 트리밍이 가장 확실하다. trim-update-logs.js는 syntax 보존하면서 entries 개수만 안전하게 깎는다.

### update.js 동일 날짜 이력 누적 원칙

**공통 스키마** (AI 탭은 sector=기업명, 다른 탭은 sector=데이터 카테고리)
```js
{
  date: "YYYY-MM-DD HH:MM KST",
  summary: "요약 한 줄",
  changes: [{ type, sector, detail, time: "YYYY-MM-DD HH:MM KST" }]
}
```
AI 탭은 `entries: [{ text, time }]` 형식도 호환. 레거시 string 엔트리 호환.

**summary 작성 규칙 (친구톡 가독성 ⚠ 매일 발송에 직접 사용)**

`summary`는 **줄바꿈으로 뉴스를 구분하는 다중 줄 문자열**로 작성한다. daily-send은 줄별로 글머리표(`•`)를 붙여 친구톡에 박는다.

- **줄바꿈(`\n`) = 뉴스 간 구분자**. 한 줄 = 하나의 사건/주제.
- **🔴 첫 줄 = 그날의 대표 헤드라인 (엄수)**. 친구톡·인스타·헤드라인 hero 등 여러 노출 면이 첫 줄을 그대로 끌어 쓰므로, 시장 지수 같은 일상 라인이 아니라 임팩트 가장 큰 단일 사건을 첫 줄에 둔다 (예: 메가캡 신고가·메이저 펀딩·정책 결정·신제품 출시). 지수 동향은 두 번째 이후 줄로.
- **한 사건 내부의 병렬 나열은 `,` 또는 `·`**. (예: "NVDA, MU, AMD 일제 강세" / "QCOM·OpenAI·MediaTek 협력")
- **줄 수**: 탭당 3~5줄 권장.
- **한 줄 길이**: ~30~40자 권장.
- **🔴 탭당 합산 ≤ 150자 (엄수)**. 6탭 × 150자 + 헤더/구분자 ≈ 960자로 친구톡 1000자 한도 마진 확보. 초과 시 알리고가 발송 거부할 수 있다.
- **사용자향 자연어**: 위 [update.js 사용자향 문체 규칙] 그대로 적용. 내부 필드명·메타 표현 금지.

**작성 예시** (JS template literal 또는 `\n` 이스케이프 둘 다 가능)
```js
summary: `NVDA $216.57 +4.0% 시총 $5.3T 사상 최고
S&P 7,173 +0.12%·나스닥 24,887 +0.20% 동반 신고가
QCOM, OpenAI, MediaTek 2028 AI 스마트폰 칩 협력
이란 호르무즈 제안 미국 전달 — 핵협상 후순위 분리`,
```
↓ daily-send 출력 결과
```
🇺🇸 미국 마켓

• NVDA $216.57 +4.0% 시총 $5.3T 사상 최고
• S&P 7,173 +0.12%·나스닥 24,887 +0.20% 동반 신고가
• QCOM, OpenAI, MediaTek 2028 AI 스마트폰 칩 협력
• 이란 호르무즈 제안 미국 전달 — 핵협상 후순위 분리
```

**누적 흐름**
1. 새 변경 시 **맨 앞에 prepend**. date=NOW, 각 `changes[].time`=해당 이벤트 시각.
2. 같은 날 기존 엔트리가 있어도 덮지 말고 별도로 유지.
3. 같은 날 + 동일 종목·섹터로 자연스럽게 묶이면 기존 엔트리 흡수해 단일 엔트리로 재작성 가능 (summary·date는 최신, changes 합치고 중복 제거).
4. **다른 날짜 엔트리는 절대 소급 수정 금지.**

**제외·추가 사유 기록**: 종목 교체 시 detail에 사유를 자연어로 명시.
- 예: `"제외: SMCI(회계이슈·SEC 조사 지속) → 추가: NVDA(동일 섹터 대표성 우위, FY26E 컨센서스 충실)"`
- 단순 수치 갱신은 사유 생략 가능.

### UI·디자인 수정 규칙

- HTML/CSS 수정 시 반드시 `.claude/DESIGN.md`를 먼저 읽고 디자인 시스템(색상·타이포·간격·컴포넌트) 준수.
- 대규모 디자인 변경·새 컴포넌트 추가 시 `/designer` 커맨드 활용.

### 캘린더 이벤트 운영 (data/calendar-events.js)

이벤트 캘린더 데이터 파일. update.js와 별개로 운영하되, 자동 갱신 흐름에 함께 포함된다.

**구조**:
- `recurring`: 반복 패턴 (매주 목 실업수당, 매월 첫 금 NFP 등). 자동 갱신 시 **수정 금지** — 패턴 변경은 사람이 직접.
- `fixed`: 구체 날짜 1회성 이벤트 (어닝·IPO·매크로 발표·컨퍼런스). 자동 갱신 시 추가 가능.
- `dateRanges`: 시작·끝 윈도우 이벤트 (S-1 제출 윈도우·다일 컨퍼런스 등).

**카테고리(cat)**: `earnings`(실적) · `ipo`(상장·펀딩) · `macro`(지표) · `policy`(정책·휴장) · `conf`(컨퍼런스) · `product`(신제품) · `other`.

**중요도(impact)**: `1`(low, 일상 지표) · `2`(medium, 주요 지표·실적) · `3`(high, FOMC·NFP·CPI·PCE·메가캡 어닝·IPO 분기점). 캘린더에서 high만 강조 처리.

**자동 갱신 시 추가 정책** — 매 실행마다 다음 세 가지를 자연스럽게 함께 점검:

1. **새 fixed 이벤트 발견 시 추가**: 조사 단계에서 향후 60일 안에 발생할 알려진 일정(예: "5/14 NVDA Q1 발표", "6/9 WWDC")을 발견하면 `fixed` 배열 끝에 prepend가 아닌 **append**로 추가. 같은 `date+title` 키 중복 시 덮어쓰지 말고 무시.
2. **🔴 빈 날짜 의식적 점검 (엄수)**: 향후 14일 윈도우(메인 페이지 캘린더 표시 범위)에서 fixed 이벤트 0건인 평일을 식별. 어닝 시즌(분기 종료 후 4~6주) 또는 매크로 발표 주간에는 빈 평일이 거의 없어야 자연스러움. 정말 비어있다면 그대로 두되, 다음 후보들을 한 번 확인:
   - **중국 매크로**: 4월 CPI·PPI 매월 9~10일경 (주말 시프트로 11일 가능), 4월 무역수지 매월 7~10일경, 4월 산업생산·소매판매·고정자산투자 매월 15~17일경
   - **미국 주중 정기**: 도매재고(매월 9~10영업일), 재정수지(Treasury Statement, 매월 12일경), NFIB 소기업 낙관(둘째 화요일), JOLTS 구인(매월 첫 영업일 + 30일)
   - **일본**: Q1 GDP 1차 추정(5월 중순), BOJ 금정위(2개월 주기)
   - **어닝 잔여 종목**: 메가캡 외 시총 $50B+ S&P 500 구성 종목의 분기 발표일 (Cisco·Palo Alto·Snowflake·Zoom 등 5월 중순 발표 패턴)
3. **지난 이벤트 정리는 선택**: 메인 캘린더가 자동으로 오늘 이후만 표시하므로 굳이 삭제 안 해도 무방. 다만 60일 이상 지난 이벤트가 누적돼 파일이 커지면 자유롭게 정리.

**무엇이 fixed에 들어가야 하나** (좋은 후보):
- 알려진 어닝 발표일 (메가캡·주요 종목)
- 발표 일정 확정된 매크로 지표 (CPI·PPI·PCE·GDP·NFP·실업수당·소매판매·산업생산·소비자심리·FOMC)
- IPO·로드쇼·프라이싱 윈도우
- 메이저 컨퍼런스 (WWDC·Google I/O·Microsoft Build·NVIDIA GTC·OpenAI Dev Day·Computex)
- 알려진 신제품 출시일·모델 릴리스
- 휴장일·정책 결정일 (메모리얼 데이·OPEC+ 회의 등)

**무엇이 들어가면 안 되나**:
- 추측·소문 (재무 가이던스에 명시되지 않은 일정은 제외)
- update.js 자동 추출로 잡히는 짧은 사건 (메인 캘린더가 update.js에서 이미 추출하므로 중복)
- 같은 사건의 변형(예: "NVDA Q1 발표"와 "NVDA Q1 컨센 매출 $78B"는 같은 사건, 하나만 등록)

**커밋 정책**: `data/calendar-events.js` 변경은 다른 데이터 갱신과 같은 커밋에 포함 — 별도 커밋 만들지 말 것. 커밋 메시지는 그대로 `데이터 자동 갱신 YYYY-MM-DD` 사용.

**Why:** 메인 캘린더가 update.js 자동 추출만으로는 빈 날이 많아 가치가 약함. recurring 패턴으로 매크로 정기 일정을 자동 채우고, fixed로 알려진 핵심 이벤트를 박아두면 14일 윈도우가 거의 매일 채워진다. 빈 평일을 의식적으로 점검하지 않으면 어닝 시즌 한가운데에도 캘린더가 듬성듬성 비어 보임.

**How to apply:** 자동 갱신 에이전트가 조사 단계에서 향후 일정을 다룰 때, 종목 카드 `rs`에만 적지 말고 `data/calendar-events.js`의 `fixed` 배열에도 한 줄 추가. 한 사건이 여러 곳에 노출돼야 사용자가 만나는 채널(친구톡·캐러셀·캘린더) 모두에 일관되게 보인다. 특히 14일 윈도우 안 빈 평일이 보이면 그 날짜에 알려진 일정 후보(위 [빈 날짜 의식적 점검] 리스트)를 자동으로 한 번 더 확인.

### 🆕 기관급 톤 가이드 (institutional lens)

retail news 단순 나열에 머무르지 말고 institutional research(FRED·Yardeni·셀사이드 보고서)의 결을 한 줄씩 녹인다. 사건만 나열하면 yahoo, 사건에 *맥락*까지 엮으면 Bloomberg.

**공통 4가지 렌즈 (모든 탭 적용)**

1. **매크로 컨텍스트** — 10y 국채금리·DXY·CPI·연준 정책을 사건 배경으로 인용
   - ❌ "AAPL Q2 매출 $90B 컨센 상회"
   - ✅ "AAPL Q2 매출 $90B 컨센 상회 - 달러 119 강세 환율 헤드윈드 30bp 흡수"

2. **밸류에이션 컨텍스트** — forward P/E·earnings yield·sector relative·peer multiple
   - ❌ "NVDA $216 +4% 신고가"
   - ✅ "NVDA $216 +4% forward P/E 32 sector premium 유지·earnings yield 3.1% 10y gap 150bp"

3. **cross-asset 시그널** — 채권 spread·FX 모멘텀·원자재 ratio·VIX
   - ❌ "한국 10년물 4.2% 부담"
   - ✅ "한국 10년물 4.2%·美 10y gap 40bp 외국인 채권 비중 카운터"

4. **정책 환경** — Fed funds path·중앙은행 변곡·재정 정책
   - ❌ "FOMC 매파"
   - ✅ "Fed funds 3.6% 동결·dot plot 25bp 인하 1회로 후퇴·BOJ YCC 정상화 6월 분기점"

**탭별 자주 쓰는 렌즈**

| 탭 | 즐겨 쓰는 관점 |
|---|---|
| **stocks** | sector rotation · earnings revision · 매크로 민감도(rates·USD) · institutional flow · forward P/E |
| **kr** | 외국인 순매수·매도 · 환율 민감도 · MSCI/FTSE 펀드플로 · 코스피200 비중 · 한미 금리차 |
| **ai** | capability benchmark · CAPEX 트렌드 · 인프라 lock-in · monetization unit economics · 모델 출시 cadence |
| **commodity** | 실질금리(10y - CPI) · 중앙은행 매수·매도 · 재고 사이클 · 달러 강도 카운터 · 지정학 |
| **unicorn** | 라운드 normalization · DPI · M&A discount · IPO 윈도우 timing · 후속 라운드 down/up |

**🔴 적용 룰 (엄수)**

- **rs 12단어 한도 유지** — 한 줄에 *하나의 렌즈*만 끼워넣기. 모든 줄에 매크로 박는 거 아님
- 사건의 핵심에 가장 적합한 *하나*의 렌즈 선택. 무리하게 끼워 맞추지 말 것
- 일반 사용자가 못 읽는 슬랭은 풀어서 또는 생략:
  - **MOVE index** → "채권 변동성"
  - **skew** → "옵션 비대칭"
  - **GEX** → "감마 노출"
  - **basis trade** → "선현물 차익"
  - **convexity** → "볼록성"
  - **carry** → "캐리"·"이자 수익"
  - **DPI/TVPI** → "회수 배수"·"누적 배수"
  - 단, **forward P/E·earnings yield·spread·CAPEX·MSCI·NFP** 등은 일반 독자도 충분히 노출된 표현 → 그대로 사용
- 매크로 수치는 *오늘 조사 시점* 값 사용 — 옛 값(예: "10y 4.2%") 박힌 채로 두지 말 것

**🔴 summary 5줄 적용 (엄수)**

친구톡·인스타에 그대로 노출되는 면. **첫 줄에 institutional 렌즈 박지 말 것** — 첫 줄은 그날의 대표 헤드라인(임팩트 최대 단일 사건). 2~5줄에 자연스럽게 매크로·밸류·cross-asset 끼워넣기.

- ❌ 첫 줄: "10y 4.6%·DXY 119 강세 동조·sector rotation 방어주로"
- ✅ 첫 줄: "삼성전자 296,000원 +4.23% 사상 최고가"
- ✅ 둘째 줄: "한국 10년물 4.2%·美 10y gap 40bp 외국인 채권플로 카운터"

탭 간 cross-tab 인용 금지 원칙(위 [탭 콘텐츠 독립성 원칙]) 계속 유효 — 매크로 렌즈도 자기 탭 시장 주체로 환원해 서술.

**Why**: 사용자가 매일 받는 친구톡·인스타 본문이 institutional brief의 결을 가지면 "여기 다른 곳들이랑 다르네"가 자연 발생. retail news 사이트는 사실 나열에 그치고 institutional brief는 항상 맥락을 동반 — 이 결의 차이가 신뢰감 형성.

**How to apply**: 자동 갱신 에이전트가 `rs`·`summary`·`detail`·AI `desc` 작성 시 위 4가지 렌즈 중 하나를 선택해 자연어로 결합. 모든 줄·모든 항목에 강제 적용 아님 — 사건 본질에 가장 잘 맞는 곳에만 끼워넣기. 첫 시도가 어색하면 빼는 쪽이 안전.

---

## 탭별 명세

각 탭은 공통 규칙을 모두 따르며, 아래는 탭별 고유 사항만 정리.

### 미국 주식 (stocks)

- 파일: `data/stocks-data.js`, `data/stocks-update.js`
- **문서 성격**: AI 슈퍼사이클 문서가 아니다. 섹터가 먼저, 테마는 나중. 20개 카테고리가 동등한 비중.
- 구성: **20 카테고리 × 정확히 7종목 = 140종목**
- 단위: $B, FY25 추정 / FY26E 컨센서스
- 수치 표기: 대형주 정수 (`"270"`), 소형주 소수점 (`"2.6"`)
- 카테고리 (20): AI 플랫폼 · 반도체 · 데이터센터 · 냉각 시스템 · 물·수자원 · 전력·그리드 · 원자력·SMR · 바이오·헬스케어 · 에너지 · 친환경·청정기술 · 자동차·모빌리티 · 우주 · 항공 · 방산 · 양자·크립토 · 사이버보안 · 핀테크·결제 · 금융·은행 · 로봇·자동화 · 소비·리테일
- 스키마: `{ tk, nm, rs, r1, p1, r2, p2 }`

### 한국 주식 (kr)

- 파일: `data/kr-stocks-data.js`, `data/kr-stocks-update.js`
- **문서 성격**: 섹터가 먼저, 테마는 나중. 18개 카테고리 동등 비중.
- 구성: **20 카테고리 × 정확히 7종목 = 140종목**
- 단위: 천억원, FY25 추정 / FY26E 컨센서스
- 수치 표기: 대형주 정수 (`"1680"`), 소형주 소수점 (`"4.5"`)
- `tk`는 6자리 종목코드 (예: `"005930"`)
- 카테고리 (20): AI·소프트웨어 · 반도체 · 2차전지 · 바이오·제약 · 자동차·부품 · 방산 · 우주 · 항공 · 조선·해양 · 금융 · 전력·에너지 · 화학·소재 · 게임 · 엔터·콘텐츠 · 화장품·뷰티 · 유통·소비 · 식품·음료 · IT·전자 · 통신·인터넷 · 건설·플랜트
- 한화시스템(272210)·한국항공우주(047810)는 방산·우주 dual-list, 켄코아에어로스페이스(274090)는 우주·항공 dual-list. 한화에어로(012450)는 방산 only — 우주·항공 사업부는 있으나 실질 매출 기여가 방산 압도적이라 우주·항공 슬롯 점유는 의미 약함.
- 스키마: `{ tk, nm, rs, r1, p1, r2, p2 }`

### AI 기업 (ai)

- 파일: `data/ai-data.js`, `data/ai-update.js`
- **선정 원칙**: "빅테크"가 아닌 AI 생태계 실질 플레이어. 프론티어 모델 / 생태계 영향력 / 인프라 지배력 / 오픈소스 영향 / 시장 규모. IBM·Oracle보다 Anthropic·xAI·Mistral 우선.
- 현재 수록 기업 (10): OpenAI · Anthropic · Google DeepMind · xAI · Meta AI · Microsoft · NVIDIA · Amazon AWS · Apple · Mistral AI
- 배지 체계: `llm` / `img` / `vid` / `agt` / `code` / `ui` / `hw` / `sci`
- 스키마:
  ```js
  const META = { year, month };
  const BL = { llm, img, vid, agt, hw, code, sci, ui };
  const data = [{ rank, name, url, type, focus,
    products: [{ name, url, isNew, badges:[], desc }] }]
  ```
- **AI 고유 규칙**:
  - `isNew`: 이번 업데이트 신규 항목만 true. 출시 4~6주 경과 시 false로 내림.
  - `desc`: 기술 스펙 + 시장 맥락 함께. 단순 나열 금지.
  - update.js의 `sector` = **기업명** (다른 탭의 섹터 대신). type 범주:
    - `모델 출시` / `모델 출시 예정` · `제품 출시` · `펀딩` / `인수` / `마일스톤` / `가격` · `리더십` / `거버넌스` / `구조조정` / `전략` · `인프라` / `생태계` / `플랫폼` · `최근성 관리` (isNew:false 처리) · `수록 변경` (수록 기업 교체)

### 원자재·크립토 (commodity)

- 파일: `data/commodity-data.js`, `data/commodity-update.js`
- 구성: **6 카테고리 × 4 항목 = 24 항목**
- 필드: 현재가, YTD 변동, 1Y 변동, 52주 범위
- 카테고리 순서 (6, 렌더링 순서 고정): 크립토 · 귀금속 · 에너지 · 산업금속 · 배터리 소재 · 농산물
- 크립토 카테고리(BTC·ETH·SOL·XRP)는 미국·한국 마켓 탭과 정보 중복을 피하면서 디지털 자산 단독 관점 제공
- 스키마: `{ tk, nm, rs, price, ytd, y1, range }`

**🔴 update.js `changes[].sector` = 데이터 카테고리 (엄수 — 크립토 패널 분리에 직결)**

`index.html` 대안 자산 페이지는 commodity의 `changes`를 **`sector` 필드로 판정해 "원자재" 패널과 "크립토" 패널로 나눠 렌더**한다 (`CRYPTO_SECTOR_RE` = 크립토·crypto·비트·이더·솔라나·리플). 따라서:

- `changes[].sector`는 반드시 **데이터 카테고리**(`크립토`·`귀금속`·`에너지`·`산업금속`·`배터리소재`·`농산물`) 중 하나. `type` 값인 **`"가격"`을 sector에 넣지 말 것** — 크립토 콘텐츠가 sector="가격"으로 뭉뚱그려지면 크립토 판정에 걸리지 않아 전부 원자재 패널로 가고 **크립토 패널이 "갱신 내역 없음"으로 빈다**.
- **매 갱신마다 크립토 콘텐츠는 `sector:"크립토"` 인 별도 change 로 분리**한다. 귀금속·에너지·산업금속 등 나머지는 자기 카테고리 sector 로. 즉 한 change 에 metals+crypto 를 섞지 말고 **최소 2개 change**(크립토 1 + 비크립토 1)로 쪼갠다.
- 참조 정답 형식: 2026-07-02 commodity-update.js — `sector:"크립토"`(BTC·ETH·SOL·XRP) + `sector:"에너지"`(WTI·구리·리튬 등) 로 분리됨. 이 형태를 표준으로.

**사고 이력**: 2026-07-05~08 commodity 자동 갱신이 sector 에 `type` 값 `"가격"` 을 넣어 metals+crypto 를 단일 change 로 뭉뚱그림 → 대안 자산 크립토 패널이 나흘간 "오늘 0건". 렌더는 정상, 생성 측 회귀였음.

### 유니콘·프리IPO (unicorn)

- 파일: `data/unicorn-data.js`, `data/unicorn-update.js`
- 구성: **5 카테고리 × 정확히 7 기업 = 35 기업**
- 필드: 밸류에이션, 최근 라운드, 섹터, IPO 전망
- 카테고리 (5): 핀테크 · 엔터프라이즈 SW · 우주·모빌리티·방산 · 바이오·헬스 · 크립토·Web3
- 스키마: `{ nm, rs, val, round, sector, ipo }`
- 비상장 전용 — 상장·피인수 시 즉시 대체 기업 편입.
- **AI 전업 기업은 제외** — AI 기업 탭과 정보 중복 방지. 엔터프라이즈 SW·바이오·헬스 등 다른 카테고리 본질에 부합하면서 AI를 부분 활용하는 회사는 가능.

### 일본 주식 (jp) — ⚠️ UI·자동 갱신 제외

> `index.html` 탭에서 제거. 자동 갱신 대상 아님. 데이터 파일은 보존, 수동 요청(`/update-jp`) 시에만 갱신.

- 파일: `data/jp-stocks-data.js`, `data/jp-stocks-update.js`
- 구성: **10 카테고리 × 정확히 7종목 = 70종목**
- 단위: 천억엔, FY25 실적(3월 결산) / FY26E 컨센서스
- 도쿄증권거래소 프라임 상장 종목만
- 카테고리 (10): 반도체 장비 · 자동차 · 전자·IT · 금융 · 로봇·자동화 · 방산·중공업 · 소비·리테일 · 게임·엔터 · 제약·헬스케어 · 소재·화학
- 스키마: `{ tk(4자리), nm, rs, r1, p1, r2, p2 }`

