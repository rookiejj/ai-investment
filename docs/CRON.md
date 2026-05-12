# 자동화 트리거 정리

브리픽의 모든 자동 실행 트리거와 각 트리거가 변경하는 파일·외부 효과를 한곳에 정리.

> 마지막 갱신: 2026-05-12 (5/11 archive 인프라 + 마커 트리거 + main 5건 한도 도입 이후 상태)

---

## 시간 기반 트리거 (cron 표현식)

| 시스템 | 이름 | 스케줄 | KST | 호출 | 변경하는 것 |
|--------|------|--------|-----|------|-------------|
| **RemoteTrigger** (claude.ai) | 데이터 자동 갱신 | `0 22,10 * * *` UTC | **07:00·19:00 매일** | Claude sandbox | `data/{stocks,kr-stocks,ai,commodity,unicorn}-{data,update}.js`<br>`data/calendar-events.js`<br>`data/version.js`<br>`data/.cartoon-marker` |
| **pg_cron** (Supabase) | `stock-prices-refresh` | `*/5 * * * *` UTC | **매 5분** | `stock-prices` Edge Function | Supabase Storage `prices/latest.json` (Yahoo 시세) |
| **pg_cron** | `daily-friendtalk-send` | `0 23 * * 0-5` UTC | **월~토 08:00** | `daily-send` Edge Function | 친구톡 발송(외부 알리고 경유) + `send_logs` row insert |
| **pg_cron** | `expiry-notice` | `0 11 * * *` UTC | **매일 20:00** | `expiry-notice` Edge Function | 친구톡 발송 + `send_logs` + `subscribers.delivery_state` 갱신 |

**RemoteTrigger ID**: `trig_016nvC9rVppRnQ9nFZeDjnP8` (RemoteTrigger 툴로 list/get/update/run 가능)

**pg_cron 정의 위치**:
- `supabase/schedule.sql` (daily-friendtalk-send)
- `supabase/schedule-expiry.sql` (expiry-notice)
- `supabase/schedule-prices.sql` (stock-prices-refresh)

---

## 이벤트 기반 트리거 (push·workflow_run chain)

cron은 아니지만 다른 자동 push에 반응해 자동 발화하는 워크플로.

| 워크플로 | 트리거 | 호출 | 변경하는 것 |
|----------|--------|------|-------------|
| **archive-rotate.yml** | push paths `data/*-update.js` | `scripts/rotate-archive.js` | `data/*-update-archive.js` 5탭 (30일 cutoff, dedup, date desc 정렬) |
| **cartoon-generate.yml** | push paths `data/.cartoon-marker` | `scripts/cartoon/generate.js` | Supabase Storage `cartoon/today.png` (Gemini nano-banana-pro 1950s 카툰) |
| **instagram-post.yml** | `workflow_run` on Cartoon Generate success | `scripts/instagram/{render-slides,render-reels,publish}.js` | Supabase Storage `instagram-carousel/posts/YYYY-MM-DD/HHMMSS/*.png`·`reels.mp4` + Meta IG 캐러셀/Reels 게시 |

워크플로 정의: `.github/workflows/`

---

## 정상 흐름도 (07:00·19:00 KST 자동 갱신 사이클)

```
RemoteTrigger 깨어남 (07:00 또는 19:00 KST)
  │
  └─ sandbox 30~55분: 5탭 조사·편집·트리밍·lint
       │
       ├─ STEP 1: 데이터 commit·push
       │   - data/*-data.js (5탭)
       │   - data/*-update.js (5탭, trim-update-logs.js로 5건 한도)
       │   - data/version.js
       │   - data/calendar-events.js (필요 시)
       │     │
       │     └─→ archive-rotate.yml 발화 (paths 매치)
       │           └─ rotate-archive.js: main entries를 archive에 mirror, 30일 cutoff, push
       │
       └─ STEP 2: 마커 commit·push (필수, 절대 생략 금지)
           - data/.cartoon-marker (epoch timestamp 한 줄)
             │
             └─→ cartoon-generate.yml 발화 (paths 매치)
                   └─ Gemini API → 1950s 카툰 1장 → Supabase cartoon/today.png 업로드
                   │
                   └─→ (success) workflow_run chain → instagram-post.yml 발화
                         └─ 시간대 분기:
                             - KST 05~12: 캐러셀 모드 (cartoon + 5탭 불릿 + CTA = 7장 PNG)
                             - KST 13~23: Reels 모드 (같은 7장을 9:16 mp4 슬라이드쇼, ~42초)
                         └─ Meta IG Graph API 게시
```

**병렬 실행**: archive-rotate와 cartoon-generate는 서로 다른 paths 매치(`*-update.js` vs `.cartoon-marker`)라 같은 sandbox 사이클에서 병렬 발화. 충돌 없음 (archive는 archive 파일만, cartoon은 Supabase Storage만 만짐).

**마커 push 누락 시**: 데이터만 갱신되고 카툰·인스타 발행 0건. RemoteTrigger prompt에 "🔴 절대 생략 금지"로 명시.

---

## 데이터 변경 5분 빈도 (5분 cron)

```
pg_cron stock-prices-refresh (매 5분)
  └─ stock-prices Edge Function 호출
       └─ Yahoo Finance v8/chart API fetch (US 대문자 + KR .KS/.KQ + commodity COMMODITY_YH 매핑)
       └─ Supabase Storage prices/latest.json 덮어쓰기
       └─ 클라이언트(index.html)가 5분 polling으로 STATE.prices 갱신
```

Yahoo Finance 자체가 15분 지연 + 한국 장 시작 후 ~25분 거래 안정화. pg_cron이 매 5분 돌아도 사용자 노출엔 ~20~25분 갭 존재(시스템 정상).

---

## 매일 자동 발송 (월~토 08:00·매일 20:00)

```
pg_cron daily-friendtalk-send (월~토 08:00 KST)
  └─ daily-send Edge Function
       └─ data/*-update.js 5탭의 entries[0] summary 줄별 파싱
       └─ 활성 구독자 query → 알리고 VPS 프록시(proxy.briefick.com) → 친구톡 발송
       └─ send_logs row insert (template_code='daily')

pg_cron expiry-notice (매일 20:00 KST)
  └─ expiry-notice Edge Function
       └─ D-1 만료 임박 구독자 query
       └─ 알리고 VPS 프록시 → 친구톡 발송
       └─ send_logs row insert (template_code='expiry')
```

발송 단가: 친구톡 ₩19.9 (알리고 경유, SOLAPI ₩110의 ~18%).

---

## 매일 자동 변경되는 자원 한눈에

**Git repo (자동 commit)**:
- `data/*-data.js` 5개 (자동 갱신 sandbox)
- `data/*-update.js` 5개 (자동 갱신 sandbox, 매번 trim 후 최대 5건)
- `data/*-update-archive.js` 5개 (archive-rotate.yml, 30일 cutoff)
- `data/calendar-events.js` (자동 갱신 sandbox, 필요 시)
- `data/version.js` (자동 갱신 sandbox, 매번 갱신)
- `data/.cartoon-marker` (자동 갱신 sandbox, 매번 갱신)

**Supabase Storage**:
- `cartoon/today.png` (cartoon-generate, 매일 2회)
- `instagram-carousel/posts/YYYY-MM-DD/HHMMSS/*` (instagram-post, 매일 2회)
- `prices/latest.json` (stock-prices, 매 5분)

**Supabase DB rows**:
- `send_logs` (daily-send + expiry-notice 매일 N건)
- `subscribers.delivery_state` (expiry-notice가 만료 처리 시)

**외부 효과**:
- 인스타그램 `@briefick` 캐러셀(오전) + Reels(오후) 매일 2개 발행
- 친구톡 (알리고 VPS 프록시 경유) 월~토 08:00 매일 뉴스 + 매일 20:00 D-1 만료 임박 발송

---

## 수동 트리거 (자동 외 경로)

| 경로 | 용도 | 호출 방법 |
|------|------|-----------|
| RemoteTrigger `run` | 자동 갱신 즉시 강제 실행 | claude.ai web UI 또는 RemoteTrigger 툴 `run` action |
| Cartoon Generate `workflow_dispatch` | 카툰 즉시 재생성 | GitHub Actions UI → Run workflow |
| Instagram Post `workflow_dispatch` | 인스타 즉시 재발행 (mode/dry_run 선택) | GitHub Actions UI → Run workflow |
| Archive Rotate `workflow_dispatch` | archive 즉시 재정렬 | GitHub Actions UI → Run workflow |
| 로컬 마커 push | sandbox 외부에서 카툰·인스타 발화 | `echo $(date) > data/.cartoon-marker && git commit && git push` |
| 슬래시 커맨드 `/update*` | 사용자 컴퓨터에서 데이터 갱신 | Claude Code 세션에서 `/update` 입력 (마커 push는 미포함 — 별도 수동) |
| 슬래시 커맨드 `/publish` | 인스타 수동 발행 (mode/dry 인자) | Claude Code 세션 또는 Actions UI |

**주의**: `/update` 류 슬래시 커맨드는 데이터 commit·push까지만 하고 마커 push는 안 함. 자동 발행 원하면 별도로 마커 push 필요.

---

## 트러블슈팅 첫 의심점

| 증상 | 첫 의심점 |
|------|-----------|
| 인스타 발행 0건 | sandbox가 마커 push 누락 (git log에서 `마커 YYYY-MM-DD HH:MM` commit 확인) |
| 홈피 카툰 옛날 것 | cartoon-generate 실패 또는 마커 push 누락 |
| 인스타·홈피 카툰 다름 | `instagram-post.yml`의 즉석 폴백이 Supabase 동기화 안 한 케이스 (5/11 수정 완료, 폴백 시 `--upload` 동작) |
| 종목 모달 mentions 4건뿐 | archive-rotate 실패 또는 archive fetch 실패 (`STATE.updArchive[tab]` 빈 배열) |
| 시세 종가만 보임 | (1) 미국 종목이면 시장 휴장 정상 / (2) 한국 종목이면 장 시작 후 ~25분 안인지 확인 |
| 친구톡 발송 안 됨 | VPS 프록시(proxy.briefick.com) 상태 확인 + 알리고 API 키 만료 |

---

## 텔레그램 알림 (실시간 운영 모니터링)

모든 cron·워크플로의 시작/종료를 텔레그램으로 보고. 단일 진입점 `notify-telegram` Edge Function — token은 한 곳(Supabase secret)에만.

**알림 대상**:
- GitHub Actions: Archive Rotate · Cartoon Generate · Instagram Post (시작·종료)
- Edge Function: Daily Send · Expiry Notice (cron 호출만, 매뉴얼 발송 skip)
- RemoteTrigger sandbox: 시작 알림 추가 여부는 운영자 결정 (prompt에 NOTIFY_SECRET 평문 박는 보안 trade-off)

**알림 형식**:
```
🟡 [Cartoon Generate] 시작 (5/12 19:47 KST)
✅ [Cartoon Generate] 성공 (5/12 19:48 KST)
❌ [Instagram Post] 실패 (5/12 07:33 KST) — mode=carousel
❓ [Daily Send] 모름 (timeout 또는 hang)
```

**시작은 있는데 끝이 없음** = 무한 루프·timeout·hang. 운영자가 즉시 인지.

**필요 Secrets**:
| 위치 | Secret | 값 |
|------|--------|-----|
| Supabase | `TELEGRAM_BOT_TOKEN` | BotFather 토큰 |
| Supabase | `TELEGRAM_CHAT_ID` | 수신자 chat_id |
| Supabase | `NOTIFY_SECRET` | 호출 인증용 랜덤 문자열 |
| GitHub Actions | `NOTIFY_SECRET` | 위와 동일 값 |

**배포**: `supabase functions deploy notify-telegram --no-verify-jwt`

---

## 참고 문서

- `CLAUDE.md` — 데이터 유지보수 룰·트리밍 정책·문체 규칙
- `README.md` — 전체 프로젝트 구조·Changelog
- `docs/friendtalk-dispatch-runbook.md` — 친구톡 발송 파이프라인 E2E 매뉴얼
- `supabase/README.md` — Supabase 세팅 가이드
