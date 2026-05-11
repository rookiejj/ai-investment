# 브리픽 (Briefick)

한국·미국 주식, AI 기업, 유니콘, 원자재·크립토 시장의 오늘 핵심 헤드라인을 한눈에 보여주는 투자 대시보드, 그리고 매일 카카오 친구톡으로 동일 콘텐츠를 발송하는 **유료 구독 서비스**. (일본 주식은 UI에서 제외, 데이터 파일만 보존)

- **웹 대시보드**: https://briefick.com
- **카카오 채널**: https://pf.kakao.com/_lpxkCX
- **친구톡 발송**: 월~토 오전 8시 KST · 만료 임박 안내 매일 오후 8시 KST
- **운영 대시보드**: `/admin` (비밀번호 보호)
- **수신 문제 안내**: `/help` (`#friend` 채널 친구 추가 / `#ad` 광고 수신 켜기)

## 구조

```
ai-investment/
├── index.html                    ← 메인 대시보드 (헤드라인 TL;DR + 이벤트 캘린더 + 돈버는 섹터 + 시장 한눈에(핀맵) + 대안 자산 + 종목 deep-dive 모달 + 구독 결제 모달)
├── views/
│   ├── admin.html                ← 운영 대시보드 (대시보드·구독자·결제·발송·공지)
│   ├── legacy.html               ← 구 메인 (5탭 카드 그리드) 백업 — `/legacy` 라우트
│   ├── renew.html                ← 재구독 전용 페이지
│   ├── help.html                 ← 수신 문제 해결 가이드 (마스터-디테일, #friend / #ad)
│   ├── terms.html                ← 이용약관
│   ├── privacy.html              ← 개인정보처리방침
│   └── refund.html               ← 환불정책
├── vercel.json                   ← /admin · /legacy · /renew · /help · /terms ... → views/ rewrite
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
│   ├── commodity-{data,update}.js← 원자재·크립토 (6 × 4 = 24)
│   ├── unicorn-{data,update}.js  ← 유니콘 (5 × 7 = 35, AI 전업 기업 제외)
│   ├── calendar-events.js        ← 메인 14일 이벤트 캘린더용 (recurring 패턴 + fixed 알려진 일정)
│   └── company-ko.js             ← 영문 회사명·티커 → 한글 매핑 (index.html·daily-send 단일 소스)
├── scripts/
│   ├── generate-message.js       ← 로컬 친구톡 메시지 미리보기
│   ├── send-friendtalk.js        ← 로컬 수동 발송 (디버깅)
│   ├── subscribers.example.json
│   └── instagram/                ← 인스타그램 캐러셀·Reels 자동 게시
│       ├── template.html         ← 1080×1350 슬라이드 HTML 템플릿 (다크 + 사진 BG)
│       ├── render-slides.js      ← Playwright로 5탭 최신 summary → PNG 7장 렌더
│       ├── render-reels.js      ← ffmpeg slideshow + crossfade로 1080×1920 Reels mp4 생성
│       ├── image-source.js       ← Unsplash 키워드 매칭·인물 필터·중복 방지
│       ├── caption.js            ← 캡션·해시태그 (브랜드 태그 보존·30개 한도)
│       ├── publish.js            ← Supabase Storage 업로드 + IG Graph API 게시 (캐러셀·Reels)
│       ├── music/                ← Reels 배경음악 (royalty-free mp3)
│       └── SETUP.md              ← 시크릿·버킷 셋업 가이드
├── .github/workflows/
│   ├── cartoon-generate.yml      ← `data/.cartoon-marker` push 트리거 (자동 갱신 sandbox가 마지막 단계로 마커 push)
│   ├── instagram-post.yml        ← cartoon-generate workflow_run chain (캐러셀 오전 / Reels 오후, 모두 7장 슬라이드 공유)
│   └── archive-rotate.yml        ← main *-update.js push 시 archive 30일 cutoff 갱신 (mentions 깊이 확장)
├── supabase/
│   ├── migrations/               ← 스키마 이력 (init / payment / message_type / delivery_state / admin_settings / template_code)
│   ├── functions/
│   │   ├── subscribe/            ← 웹 구독 요청 업서트
│   │   ├── check-subscription/   ← 결제 전 기존 구독 확인
│   │   ├── payment-confirm/      ← 포트원 결제 검증 + 구독 연장 + 결제완료 알림톡(ATA)
│   │   ├── daily-send/           ← 매일 뉴스 친구톡 발송 (평일 cron 트리거)
│   │   ├── expiry-notice/        ← D-1 만료 임박 재구독 안내 친구톡 (매일 20:00 cron)
│   │   ├── stock-prices/         ← Yahoo Finance 15분 지연 시세 fetch + Storage `prices/latest.json` 갱신 (5분 cron)
│   │   ├── survey-api/           ← 설문 시스템 (공개 응답 + 관리자 CRUD)
│   │   └── admin-api/            ← 운영 대시보드용 (login / change_password / stats / logs / subscribers / payments / expiring_soon / manual_send[알림톡] / daily_send_preview / daily_send_now / notice_send[공지 친구톡])
│   ├── schedule.sql              ← 매일 뉴스 cron (평일 08:00 KST)
│   ├── schedule-expiry.sql       ← 만료 임박 cron (매일 20:00 KST)
│   ├── schedule-prices.sql       ← 시세 갱신 cron (매 5분)
│   ├── queries.sql               ← 운영 조회·상태 변경 템플릿
│   └── README.md                 ← Supabase 세팅 가이드
├── docs/
│   ├── kakao-subscription-plan.md        ← 서비스 기획서
│   └── friendtalk-dispatch-runbook.md    ← 발송 파이프라인 E2E 매뉴얼
└── README.md
```

## 기능

### 메인 대시보드 (루트 `/`)
브리핑은 정보 양보다 **첫 진입 시 핵심 인지**에 초점. 5개 섹션 단방향 스크롤:
1. **헤드라인 TL;DR strip** — "오늘 놓치면 안 되는 것"이라는 promise 아래 5개 시장 각각의 첫 줄(그날 가장 임팩트 큰 사건) 카드 5개. 각 줄은 update.js summary 첫 줄을 그대로 노출. **한국 → 미국 → AI → 원자재·크립토 → 유니콘** 순서(초보 진입 장벽 낮춤). 펼침 토글로 시장별 전체 불릿 노출.
2. **이벤트 캘린더 · 2주** — `data/calendar-events.js`의 recurring 패턴(매크로 정기 일정) + fixed(알려진 어닝·IPO·컨퍼런스)을 14일 윈도우(일~토 정렬)로 표시. 셀 클릭 시 그날 모든 이벤트를 카테고리별로 모달에 노출, 종목 칩 클릭 시 deep-dive 모달로 연결.
3. **섹터 성장 단계** — 18개 섹터 행을 FY26E 매출 성장률(7종목 중앙값) 내림차순 정렬, 단계 라벨(빠른 성장·성장·완만 성장·보합·역성장) + 색상으로 시장 모멘텀 한눈에. 한국·미국 토글(기본 한국). 행 클릭 시 7종목 카드 펼침, 펼친 행이 sticky 헤더 바로 아래로 자동 스크롤. 검색 입력란으로 종목·키워드 필터.
4. **대안 자산** — 메인 한국·미국 주식 외 4 도메인(AI 동향·유니콘·원자재·크립토)의 사건 단위 노출. 도메인별 vertical 패널 4개, 각 패널 헤더에 갱신 시점 + 상대 라벨(`오늘 N건` / `5/03 갱신 · 2일 전`). 각 사건 줄은 섹터 + 헤드라인(detail 첫 문장 안전 추출 — 괄호 깊이·숫자 점·괄호 균형 처리), 클릭 시 inline 펼침으로 detail 풀 텍스트 노출. 좌측 도메인 색상 라인(AI 파랑·유니콘 보라·원자재 주황·크립토 녹색). 2일 이상 갱신 안 된 도메인은 헤더 라벨이 warn 색상.
5. **종목 deep-dive 모달** — 카드 클릭 또는 캘린더 종목 칩에서 진입. 차별화 포인트(rs) + 매출·영업이익 막대그래프(FY25 vs FY26E) + 최근 사건(update.js mentions) + 같은 섹터 peers. 모바일에선 바텀시트로 슬라이드 업, 스와이프-다운/Android 백키/✕로 닫힘.

> 구 메인(5탭 카드 그리드, 검색·필터·스와이프 UI)은 `/legacy`에 백업 — 신 메인의 deep-dive 모달이 같은 종목 데이터를 활용하므로 정보 손실 없음.

### 구독 서비스 (유료)
- **구독 모달**: 헤더 "매일 카톡으로 받기" → 전화번호 + 광고 수신 동의
- **번호 재확인 단계**: 결제 직전 큰 글씨로 번호 재표시 (오타 방지)
- **연장 확인**: 기존 구독자엔 남은 일수·연장 후 만료일 안내
- **결제**: 포트원 V2 (현재 갤럭시아 테스트 채널 · 월 100원)
- **카카오 채널 친구 추가 필수 안내**: 완료 화면에 강조 배너
- **결제 완료 후 폼 잠금**: 모바일 REDIRECTION 복귀 시 입력값 복원 + 즉시 잠금 (placeholder 노출 방지)

### 메시징 시스템 (5종)

| 종류 | 트리거 | 함수 | 카카오 타입 | 템플릿 / 본문 | 버튼 |
|---|---|---|---|---|---|
| **결제 완료 알림톡** (자동) | 결제 검증 직후 | `payment-confirm` | ATA | `KA01TP260424050234328BFWH2f2vfrN` (#{상점명}/#{상품명}/#{만료일}) | AC "채널 추가" |
| **매일 뉴스 친구톡** (자동·수동) | 평일 KST 08:00 (cron) · 운영 대시보드 즉시 발송 | `daily-send` | CTA | 5개 탭 최신 1건씩 summary, 1000자 한도 초과 시 fitToLimit으로 모든 탭 균등 줄 단위 cut | WL "오늘의 브리핑 보러가기" → `/` |
| **재구독 안내 친구톡** (자동) | 매일 KST 20:00 (cron, D-1) | `expiry-notice` | CTA | 자유 텍스트 + 만료일 자동 삽입 | WL "재구독 신청하기" → `/renew` |
| **미수신자 안내 알림톡** (수동) | 운영 대시보드 발송 | `admin-api` `manual_send` | ATA | `KA01TP260424060446377powJn1n8RGU` (#{상점명}) | WL "문제 해결하기" → `/help` |
| **공지 친구톡** (수동·자유 본문) | 운영 대시보드 `📢 공지` 발송 | `admin-api` `notice_send` → `daily-send` (`customMessage`) | CTA | 임의 본문(1000자 한도) — 점검·이벤트·긴급 안내용 | (없음 — `daily-send` 발신프로필 기본 버튼) |

> **알림톡 vs 친구톡 선택 기준**: 정보성 거래 알림(결제 완료·미수신 안내)은 **알림톡** — 채널 친구 여부·광고 수신 거부와 무관하게 도달. 광고성 콘텐츠(뉴스·재구독 권유)는 **친구톡** — 채널 친구만 도달, 야간(21~08) 발송 금지.

### 운영 대시보드 `/admin`
- 비밀번호 인증 (Edge Function `admin-api` · DB 해시 저장 · 최소 4자)
- **사이드바 3-도메인 구조** + 상단 오버뷰 + 공지 (해시 라우팅 · 모바일 드로어 · 헤더 새로고침 버튼)
  - **📊 대시보드**: 3개 도메인 통합 카드(활성·7일 매출·14일 성공률·만료 임박·채널 미가입·결제 실패) + 14일 발송 차트 + 구독 상태 도넛 + 최근 결제 5건 + 만료 임박 5건
  - **👤 구독자**: 상태별 카운트 카드 + 구독 상태 분포 도넛 + 전체 목록(상태·구독 상태 필터)
  - **💳 결제**: 7일/30일 매출 카드 + 만료 임박(D-7) 리스트 + 결제 이력(상태·기간 필터 + 페이지네이션)
  - **📬 발송**: 14일 성공률 카드 + 일별 발송량 차트 + **매일 뉴스 즉시 발송**(미리보기→대상 선택→발송, 2x2 그리드 UI) + 미수신자 안내 알림톡 수동 발송 + 발송 이력(상태·타입·**용도**·번호·기간 필터)
  - **📢 공지**: 자유 본문 친구톡 발송 — 활성 구독자 선택 + textarea 입력(1000자 카운터) + 야간(KST 21~08) 발송 경고 + 발송 이력은 `template_code='notice'`로 분리 기록
- **발송 이력 용도 분류** — `template_code` 컬럼 기반 색상 뱃지: 매일 뉴스 / 수동 발송 / 결제 완료 / 재구독 안내 / 공지
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
- Claude Opus 4.7 원격 에이전트(`trig_016nvC9rVppRnQ9nFZeDjnP8`)가 매일 2회(KST 07:00 / 19:00)로 5개 탭 데이터 갱신·커밋·푸시 — 13시 슬롯은 2026-05-02부터 비활성화

### 실시간 시세 (15분 지연)
- **`stock-prices` Edge Function** — Yahoo Finance v8 chart endpoint(`includePrePost=true`)로 미국·한국·원자재·크립토 시세 fetch. 한국은 `.KS`/`.KQ` 둘 다 시도 매칭, 원자재·크립토는 `COMMODITY_YH` 매핑 테이블(`BTC→BTC-USD`·`GC→GC=F` 등). 결과를 Supabase Storage `prices/latest.json`에 저장.
- **5분 갱신** — pg_cron `stock-prices-refresh`가 매 5분 함수 호출. 사용자 접속 무관 항상 최신 유지. 단 Yahoo Finance 자체가 15분 지연 + 장 시작 직후 ~25분은 거래 안정화로 어제 종가 노출(시스템 정상).
- **클라이언트 5분 폴링** — `index.html`이 Storage public URL을 직접 fetch, 5분마다 자동 재로드(`document.hidden`이면 skip). STATE.prices 갱신 시 섹터 단계·deep-dive 모달 시세 라벨 즉시 재렌더.
- **표시** — 종목 카드 우측에 `$216.57 +4.0%`(미국) / `₩78,500 +1.2%`(한국) 형식, 등락 색상(상승 녹·하락 적). 모달 헤더에도 동일 노출. 프리/애프터마켓 시간대엔 baseline을 `regularMarketPrice`로 보정해 Yahoo 표시값과 일치 (정규세션은 `previousClose` 기준).
- **표기 안내** — 섹터 단계·핀맵 섹션 헤더에 "Yahoo Finance 15분 지연 · 장 시작 후 ~25분간 어제 종가 표시" 명시. 등락폭은 장 마감·과거 종가 케이스에도 항상 노출(마지막 거래일 vs 전일 종가 변동률로 정보 가치 있음).

### 인스타그램 자동 게시 (`@briefick`)
- **시간대별 포맷 분기** (KST 기준, instagram-post.yml의 모드 결정 step):
  - **05~12시** → 캐러셀(정적 게시물 7장)
  - **13~23시** → Reels(영상 7장 슬라이드쇼)
  - **00~04시** → all (운영자 수동 push 예외)
  - 자동 갱신 슬롯이 07:00·19:00 KST라 일상에선 캐러셀·Reels 1회씩 = 2개/일
- **트리거**: 자동 갱신 sandbox(`trig_016nvC9rVppRnQ9nFZeDjnP8`)가 데이터 push 완료 후 별도 commit으로 `data/.cartoon-marker` 갱신·push → cartoon-generate가 paths 매치로 발화 → success 시 workflow_run chain으로 instagram-post 발화. 마커 push 누락 시 발행 0건이라 RemoteTrigger prompt에 "🔴 절대 생략 금지"로 명시.
- **수동 발행**: `/publish [mode] [dry]` 슬래시 명령 또는 Actions UI → Run workflow.
  - mode: `all`(default) / `carousel` / `reels`
  - 예: `/publish reels`, `/publish carousel dry`, `/publish dry`
- **공통 슬라이드 (7장)** — 캐러셀·Reels 같은 소스 공유:
  1. 5탭 최신 `summary` 줄 단위 파싱 → 첫 불릿 키워드로 Unsplash 검색
  2. 인물 사진 필터(태그에 person/face/man 등) + 중복 방지(같은 게시물 내 photo.id 공유)
  3. Playwright로 1080×1350 PNG 7장 렌더 (`01.png` 텍스트 표지 + `02~06.png` 5탭 + `07.png` CTA, 다크 + 사진 BG)
  4. cartoon-generate가 만든 `today.png`(1950s 화풍)를 1번 슬라이드로 사용
- **캐러셀 흐름** (~3~5분):
  1. 위 공통 7장 렌더 후 `IG_SLIDES: cartoon.png,02~06.png,07.png` 7장 선택(텍스트 표지 `01.png`는 카툰으로 대체)
  2. Supabase Storage(`instagram-carousel/posts/YYYY-MM-DD/HHMMSS/`)에 업로드 — CDN 캐시 회피용 시각 경로
  3. Instagram Graph API 3-step (children 컨테이너 → CAROUSEL parent → media_publish), transient 에러 시 자동 재시도
- **Reels 흐름** (~5~8분):
  1. 공통 7장 렌더 후 `cp cartoon.png 01.png`로 텍스트 표지 자리에 카툰 박음
  2. ffmpeg `xfade` 필터로 슬라이드당 6초 + 0.5초 crossfade로 1080×1920 mp4 생성. 9:16 캔버스의 위·아래 빈 공간은 같은 이미지를 블러 처리한 BG로 채워 letterbox 회피. 총 길이 ~42초.
  3. `scripts/instagram/music/` 하위 mp3 풀에서 **랜덤 픽**, 페이드인/아웃 합성 (없으면 무음 트랙 부착)
  4. Supabase Storage 업로드 (`Content-Type: video/mp4`)
  5. Graph API REELS 컨테이너 생성(`media_type=REELS`, `share_to_feed=true`) → FINISHED 대기(최대 5분) → publish
- **카툰 (`cartoon-generate.yml`)**: 자동 갱신 sandbox의 마커 push 시 발화. `--style 1950s` 한 화풍, Gemini nano-banana-pro-preview로 1080×1350 4:5 1장 생성 → Supabase `cartoon/today.png` 업로드. 홈피·캐러셀·Reels 모두 같은 `today.png` 소스 공유. 비용 ~$0.13/장 × 2회/일.
- **캡션**: 캐러셀·Reels 동일. 헤더(날짜·브랜드) + 프로필 링크 유도 CTA + 가변 해시태그(티커·키워드 자동 추출, `#브리픽 #briefick` 항상 보존, 30개 한도)
- **수동 점검**: `/publish dry` 또는 Actions UI에서 `dry_run=true`로 아티팩트(PNG·mp4·캡션)만 검수, 게시는 X
- **버킷 분리**: `cartoon` 버킷은 cartoon-generate가 쓰는 마스터 저장소(`today.png` 1장), `instagram-carousel` 버킷은 publish.js가 게시 시 image_url로 Meta API에 전달할 영구 아카이브(`posts/YYYY-MM-DD/HHMMSS/`)

## 발송·상태 동기화 파이프라인

### pg_cron 등록된 작업 (UTC 기준)

| jobname | schedule | KST 변환 | 호출 함수 |
|---|---|---|---|
| `daily-friendtalk-send` | `0 23 * * 0-5` | 월~토 08:00 | `daily-send` |
| `daily-expiry-notice` | `0 11 * * *` | 매일 20:00 | `expiry-notice` |
| `stock-prices-refresh` | `*/5 * * * *` | 매 5분 | `stock-prices` |

> KST 08:00 = UTC 23:00(전날). UTC 기준 dow 0~4가 한국 평일에 해당.

### 매일 뉴스 친구톡 (08:00 KST 평일 · 또는 관리자 수동 트리거 · 또는 공지 자유 본문)
```
pg_cron(또는 admin-api 프록시) → Vault X-Cron-Secret → daily-send
    ├ body.customMessage 있으면 자동 조립 건너뛰고 본문 그대로 사용 (공지)
    │  없으면 GitHub Contents API로 data/*-update.js fetch
    ├ 한 탭 summary = 한 글머리표 줄(자유 문체 그대로) — 한국 → 미국 → AI → 원자재 → 유니콘 (표시 순서 통일)
    ├ 1000자 한도 초과 시 fitToLimit (모든 탭 보존하며 균등 줄 단위 cut)
    ├ 만료 구독자 expired 전환 (paid_until 과거)
    ├ 활성 구독자 조회 (body.subscriberIds 있으면 그 ID만)
    ├ 알리고 친구톡 발송 (VPS 프록시 경유, 배치 500)
    └ send_logs INSERT (template_code='daily_news' · 공지면 'notice')
```

운영 대시보드의 매일 뉴스 즉시 발송은 admin-api `daily_send_preview` / `daily_send_now`가 동일 함수를 X-Cron-Secret으로 프록시 호출. 공지 발송은 `notice_send`가 `customMessage` 필드로 동일 함수를 프록시 호출 (1000자 검증 + 빈 본문 거부). 두 경로 모두 발송 누락·재발송·자유 본문 즉시 발송 등 예외 상황 대응용.

### 재구독 안내 친구톡 (20:00 KST D-1)
```
pg_cron → Vault X-Cron-Secret → expiry-notice
    ├ 내일(KST) 안에 만료 예정 active 구독자 조회
    ├ 본문에 만료일 자동 삽입 + WL '재구독 신청하기' 버튼 → /renew
    ├ 알리고 친구톡 발송 (VPS 프록시 경유) — 본문에 만료일·재구독 URL 인라인
    └ send_logs INSERT (template_code='expiry_notice')
```

### 발송 결과 추적 (알리고 환경 한계)

알리고는 SOLAPI와 달리 **표준화된 실패 사유 코드를 제공하지 않음** (rslt_message 자연어만). per-recipient webhook push도 미지원, polling만 가능 (`/akv10/history/detail/`).

현재 구현은 polling 미적용 — daily-send·expiry-notice가 알리고 응답의 `code`/`fcnt`만 보고 분류:
- 그룹 전체 실패: `delivery_state='fail'` · `status='fail'`
- 부분 실패(`fcnt > 0`): `status='success'`(그룹 전송은 성공) + `delivery_state='unknown'`(폰별 식별 불가)
- 전체 성공: `delivery_state='ok'`

알리고 어드민 콘솔에 더 상세한 발송 결과가 노출되니 운영상 필요하면 그쪽 참조. 자동 polling이 필요해지면 VPS 프록시에 `/friend/history/detail` 추가하고 admin-api에 `refresh_send_results` 액션 신설하는 구조로 확장 가능.

## 업데이트 워크플로우

| 바꿀 것 | 수정 위치 |
|---|---|
| 탭별 데이터 · 이력 | `data/<탭>-{data,update}.js` |
| UI·레이아웃 | `index.html` |
| 법정 문서 | `terms.html` / `privacy.html` / `refund.html` |
| 매일 뉴스 친구톡 본문 | `supabase/functions/daily-send/index.ts` ↔ `scripts/generate-message.js` (동기화) |
| 재구독 안내 친구톡 본문 | `supabase/functions/expiry-notice/index.ts`의 `buildExpiryMessage` |
| 구독료·상품명 (3단 가격 플랜) | `index.html`·`views/renew.html`의 `PRICE_PLANS` + `supabase/functions/payment-confirm/index.ts`의 `PRICE_PLANS` (단일 소스 — 동기화 필수). plan 키: `1m`·`6m`·`12m`. `TEST_MODE` 토글로 testAmount(₩100) ↔ amount(정가) 전환 |
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
| 메시지 | **알리고(Aligo)** — 카카오 친구톡·알림톡 · IP 화이트리스트 회피 위해 iwinv VPS(`proxy.briefick.com`, `115.68.224.225`)에 Node 프록시 + Caddy HTTPS · `X-Proxy-Secret` 헤더 인증 |
| 카카오 | 채널 `_lpxkCX` · 발신프로필 `KA01PF...` · 알림톡 템플릿 `KA01TP...` |
| 자동 콘텐츠 갱신 | Claude Opus 4.7 원격 에이전트 |

### 인증 구조
- 브라우저 ↔ 공개 Edge Function: Supabase publishable key (`sb_publishable_...`, JS 변수명 `BRIEFICK_SUPABASE_PUBLISHABLE_KEY`)
- Edge Function ↔ DB / GitHub Actions ↔ Supabase Storage: secret key (`sb_secret_...`)
  - **변수명 `BRIEFICK_SUPABASE_SECRET_KEY`** — Supabase 예약 namespace(`SUPABASE_*`) 충돌 회피용 프로젝트 prefix
  - Supabase Edge Function Secrets와 GitHub Secrets 양쪽에 동일 이름·값 등록
- pg_cron ↔ daily-send / expiry-notice: 자체 `X-Cron-Secret` (Vault 저장 · 함수 env와 동기화 필수)
- Edge Function ↔ VPS 알리고 프록시: `X-Proxy-Secret` 헤더 (양쪽 env에 동일 값)
- 관리자 ↔ admin-api: 비밀번호 해시 기반 세션 토큰
- 모든 Edge Function은 `--no-verify-jwt`로 배포 (자체 인증 사용)

> Vault `cron_secret`을 갱신할 때는 `supabase secrets set CRON_SECRET=...`으로 함수 env도 동시에 갱신해야 401이 발생하지 않음.

> `BRIEFICK_SUPABASE_SECRET_KEY` 갱신 시: ① Supabase 대시보드 Edge Function Secrets 갱신 + ② GitHub Secrets 동기화 + ③ Edge Function 7개 재배포 (`supabase functions deploy <name> --no-verify-jwt`)

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
  template_code (daily_news/manual/payment_complete/renew_reminder/expiry_notice/notice/null)
  provider, provider_code (groupId), provider_message, provider_msg_id
  batch_id, sent_at

admin_settings (단일 행, id=1)
  password_hash (SHA-256(password:session_secret))
  updated_at
```

## 운영 메모

- **알리고 잔액**: 친구톡 ₩19.9/건, 알림톡 ₩8/건. 잔액 부족 시 `send_logs.status=fail` + `provider_message`에 알리고 자연어 사유. 알리고 어드민 콘솔에서 직접 충전.
- **알리고 IP 화이트리스트**: 알리고 API는 발신 IP 등록 필수 — Edge Function 동적 IP 호출 불가. 우회용 VPS 프록시(`proxy.briefick.com` = `115.68.224.225`)에 알리고 API 키·sender key 보관. VPS IP(`115.68.224.225`) 1개만 알리고 어드민에 등록. (이전 `briefick.duckdns.org`는 무료 dynamic DNS 안정성 이슈로 5/9 Cloudflare 서브도메인으로 이전, IP는 변경 없음.)
- **포트원 라이브 전환**: 테스트 채널 키 → 라이브 키로 교체. `ITEM_CODE` 등 bypass 필드는 PG별로 재검토.
- **친구톡 도달 불가 케이스**: 채널 미가입·광고 수신 거부·차단 등은 알리고 응답에선 분류 안 됨(자연어 사유만). 운영자가 `manual_send`(알림톡)로 `/help` 안내 발송 — 알림톡은 광고성 거부와 무관하게 정상 도달.
- **카카오 알림톡에 승인된 버튼 노출**: 알리고는 템플릿 등록 시 정의한 버튼을 자동 렌더 — 발송 호출엔 별도 명시 불필요. AC `채널추가` 버튼은 이미 채널 친구인 수신자에겐 자동 숨김(추가 대상 없으므로) — 본인 폰 테스트로는 영원히 검증 불가.
- **AC '채널 추가' 버튼 표시 조건**: 이미 채널 친구인 수신자에게는 자동 숨김 (추가할 대상이 없으므로). 새 가입자에게만 노출.
- **관리자 비밀번호 로테이션**: 대시보드 헤더 "비밀번호 변경"으로 바로 변경(최소 4자). env `ADMIN_PASSWORD`는 최초 초기화용이며, 이후 실 비교는 `admin_settings.password_hash` 기준.
- **스케줄 변경**: `cron.schedule` 표현식은 UTC 기준 (KST = UTC+9). 월~토 한정은 UTC dow `0-5` 사용 (KST 월~토 = UTC 일~금). 평일만이면 `0-4`(KST 월~금).

## Changelog

- **2026-05-11 (8)**: **main update.js 트리밍 기준 변경 — byte 40KB → entries 5건 한도**. 5/11 (7)에서 archive 인프라가 30일 mentions 깊이를 담당하니, main은 화면 노출(`entries[0]`) + archive 사고 시 폴백만 담당하면 충분. byte 한도 → 명시적 entries 5건 한도로 단순화. 짧은 탭(kr·commodity 4건)은 상한 미만이라 그대로 유지(강제 5건 채우기 X). `scripts/trim-update-logs.js`·CLAUDE.md 룰·RemoteTrigger prompt 동시 갱신. 첫 실행 결과 5탭 합 150KB → 76KB(절반), sandbox push 한계(~50KB) 여유 대폭 증가. archive에 잘려나간 entries 49건 흡수 완료 — mentions 깊이 영향 0.
- **2026-05-11 (7)**: **mentions 깊이 확장 — archive 인프라 도입(30일 보존)**. 사용자 보고: 종목 모달의 "최근 사건" mentions가 update.js 40KB 트리밍으로 짧으면 4일치(kr·commodity)만 보임. 옵션 A(git archive.js, sandbox push 한계 회피)로 main↔archive 분리.
  - **`scripts/rotate-archive.js` 신설** — main update.js 5탭 entries를 archive에 mirror, 30일 cutoff 적용, dedup(date + changes[0].time + detail 첫 40자) 후 date desc 정렬해 archive 파일 재작성. 멱등.
  - **`.github/workflows/archive-rotate.yml` 신설** — main 5개 파일 paths 매치 시 발화(archive 파일 자체 변경엔 안 발화로 무한 루프 차단). Node 22로 스크립트 실행 → syntax 검증(`new Function(src)`) → git pull --rebase + 3회 재시도 push.
  - **5탭 archive 파일 초기 생성** — `data/*-update-archive.js` (변수명 `updatesArchive`). 첫 로컬 실행 결과: stocks 7건·kr 4건·ai 13건·unicorn 16건·commodity 4건 = 총 44 entries 보존 (모두 30일 내).
  - **index.html mentions 확장** — `ARCHIVE_URLS` 매핑 + `loadArchives()` 비차단 호출 (boot에서 await 안 함 — 도착 전엔 main만으로 자연 폴백). `findMentions`에 dedup 키 추가, main 먼저 순회 후 archive 순회로 시간 순서 유지. 결과 mentions 깊이 4~14일 → ~30일 확장.
  - **sandbox push 한계 회피**: sandbox는 main만 만지고(~40KB), archive는 GH Actions가 별개 push(~90KB×5탭, git push 자유). paths 분리로 cartoon-generate·archive-rotate 워크플로 병렬 실행 가능.
  - **클라 트래픽**: archive 5개 ~120KB gzip 추가, 모달 첫 열기 시 lazy fetch ~50~150ms. 첫 페이지 로딩 영향 0.
- **2026-05-11 (6)**: **PL 티커 충돌 해소(백금 → XPT) + 등락폭 hideChange 정책 폐기**. 사용자 보고: 장 마감 시 미국 종목 등락폭이 안 보이는데 Planet Labs(PL)만 보임. 원인: `supabase/functions/stock-prices/index.ts`의 COMMODITY_YH 매핑 `"PL": "PL=F"`가 stocks-data.js의 Planet Labs(NYSE: PL)와 같은 키 충돌 — Edge Function이 commodity 처리 단계에서 미국 PL 데이터를 백금 선물($2,042/oz, 24/7 거래)로 덮어씀. commodity-data.js 백금 `tk:"PL"` → `"XPT"`(ISO platinum currency code), Edge Function 매핑도 동시 갱신. 추가: `pxStatus` 함수의 `hideChange:true` 케이스 2종(시세 시각이 오늘 아님·KR 정규장 외) 모두 `false`로 변경 — 사용자 의도는 "장 마감이든 언제든 등락폭은 항상 표시" (마지막 거래일 vs 전일 종가 변동률은 정보 가치 있음).
- **2026-05-11 (5)**: **시세 안내 강화 + 로드쇼 hallucination 일괄 정정 + README cron 주기 stale 정정**. 사용자 보고: 한국 장 9시 시작인데 9:30 가까이 돼서야 시세 보임. 원인 분석 — Yahoo Finance 공식 15분 지연 + 장 시작 직후 거래 안정화 5~10분 누적이라 ~25분 갭은 정상(pg_cron은 5분 주기로 이미 최선). 두 곳의 sec-desc 안내에 "장 시작 후 ~25분간 어제 종가 표시" 명시. README의 "매 15분" 표기 3곳 정정 (실제는 5/8경 5분 강화됐는데 문서 따라가지 않음). 자동 갱신 에이전트가 만든 "로드솼"(로드쇼 hallucination) `data/calendar-events.js` 2건·`data/unicorn-update.js` 25건 일괄 치환. lint-jargon.sh PATTERNS에 `솼` 단독 글자 추가로 재발 차단(한국어 표준 음절 아니라 false positive 0).
- **2026-05-11 (4)**: **인스타 Reels도 7장 슬라이드쇼로 복원 — 캐러셀과 동일 구성**. 단일 카툰 30초 Ken Burns 영상 → 7장(카툰 + 5탭 + CTA) 슬라이드쇼 9:16 mp4. render-reels.js의 디폴트 흐름(01.png~07.png를 ffmpeg xfade로 합치는, 슬라이드당 6초·crossfade 0.5초·BGM 합성)이 그대로 살아있어 `--mode=single` 제거 + `cp cartoon.png → 01.png` 한 줄로 즉시 복원. 결과 ~42초 영상. 캐러셀·Reels 모두 같은 7장 슬라이드를 공유하는 단순 구조.
- **2026-05-11 (3)**: **인스타 캐러셀 7장 복원 — 카툰(표지) + 5탭 불릿 + CTA**. 5/8에 `IG_SLIDES: cartoon-X.png,07.png`로 잘라내며 카툰+CTA 2장만 게시했으나 정보 밀도가 너무 빈약. render-slides.js의 7장 생성 로직과 template.html 5탭 슬라이드는 그대로 살아있어 `IG_SLIDES` 한 줄만 교체로 즉시 복원. 카툰을 표지 대체로 사용해 01.png(텍스트 표지) 자리에 카툰을 박는 형태 → 시각적 hook은 카툰, 정보는 5탭 불릿이 담당. Reels 모드는 그대로 today.png 30초 영상.
- **2026-05-11 (2)**: **카툰 화풍·파일 단일화 — 1950s + today.png 한 장으로 통일**. 이전: 시간대 분기로 오전 1950s(`today-news.png`)·오후 mad-mag(`today-magazine.png`) 2 화풍 + 홈피용 단일 소스(`today-latest.png`)로 파일 3개 운영. 발행 폴백이 Supabase 동기화 안 해 홈피·인스타 어긋남 사고(5/11 아침 매뉴얼 발행 시 홈피=5/10 저녁 mad-mag, 인스타=5/11 즉석 1950s) 발생.
  - **scripts/cartoon/generate.js** — `STYLE_STORAGE = { '1950s': 'today.png' }` 단일 매핑, `today-latest.png` 동시 업로드 코드 제거.
  - **cartoon-generate.yml** — KST 시간대 화풍 분기 step 제거, 항상 `--style 1950s` 호출. workflow_dispatch의 `style` input 제거.
  - **instagram-post.yml** — 캐러셀(1950s)·Reels(mad-mag) 2 다운로드 step → 단일 step "오늘의 카툰 다운로드"로 통합, 모드 분기는 발행 형식만 유지. 즉석 폴백에 `--upload` 추가 + `--no-latest` 제거 — 폴백 결과가 Supabase `today.png`도 동시 갱신해 홈피·인스타 어긋남 차단. `IG_SLIDES: cartoon.png,07.png`, Reels input `cartoon.png`로 통일.
  - **index.html** — 카툰 src `today-latest.png` → `today.png`, onerror 폴백 체인(`today-magazine` → `today-news`) 제거(단일 파일이라 무의미, 누락 시 .empty 클래스만).
  - **Supabase Storage 사후 정리**: `cartoon` 버킷에서 `today-news.png`·`today-magazine.png`·`today-latest.png` 삭제, `today.png` 신규 업로드(다음 cartoon-generate 발화로 자동). 사용자가 Supabase Studio에서 직접 정리.
  - **인스타 카툰 호스팅 위치 명시**: `cartoon` 버킷은 cartoon-generate의 마스터 저장소, `instagram-carousel` 버킷의 `posts/YYYY-MM-DD/cartoon.png`는 publish.js가 게시 시 image_url로 전달할 영구 아카이브. 두 버킷 분리는 의도된 설계.
- **2026-05-11**: **카툰 트리거 schedule cron → 마커 commit push로 회귀**. 5/10 schedule cron 단일화의 첫 슬롯(5/11 08:00 KST)이 발화 안 됨 — GitHub Actions 측 새 cron 등록 지연으로 추정(첫 슬롯 미발화는 알려진 동작). schedule은 데이터 갱신과 비동기라 사고 발생 시 폴백이 없는 구조적 문제도 동반. **사용자 제안으로 "마커 commit" 트리거로 전환**: 자동 갱신 sandbox가 데이터 push 끝낸 후 별도 commit으로 `data/.cartoon-marker` 갱신·push, 그 push가 카툰·인스타 발화 시그널.
  - **cartoon-generate.yml 트리거 변경** — `on: schedule '0 23,11 * * *'` → `on: push (paths: data/.cartoon-marker)`. Freshness guard·Skip if stale step 제거 (마커 push 자체가 fresh 시그널). workflow_dispatch는 유지.
  - **RemoteTrigger prompt 갱신** — 5탭 완료 후 단계 5에 "마커 commit·push (필수)" 추가. 커밋·푸시 블록 마지막에 `echo > data/.cartoon-marker → commit → push` 한 사이클 추가. 데이터 변경 없음 케이스에선 마커도 push 안 함.
  - **사라진 위험**: schedule 첫 슬롯 미발화, schedule 등록 지연, schedule cron과 데이터 갱신 시간 sync 불일치. 시간 buffer 추정 모두 폐기.
  - **남은 위험**: sandbox가 데이터 push만 하고 마커 push를 빠뜨리면 발행 0건 → prompt에 "🔴 절대 생략 금지"로 명시. 매뉴얼 데이터 갱신 시 카툰 원할 시 GitHub Actions UI workflow_dispatch 또는 `data/.cartoon-marker` 수동 push.
  - **부수 사고 정리**: 5/10 19:15·19:10 자동 갱신에서 stocks·commodity 헤드라인이 호르무즈·CPI 사건을 동일 톤으로 중복 기재 (선점 우선 원칙 위반). update.js 정리로 호르무즈는 commodity·CPI는 stocks로 분리. 사용자 지적 후 5/11 자동 갱신에서도 같은 패턴 재발 — RemoteTrigger prompt에 선점 원칙은 이미 명시(CLAUDE.md 참조)되나 본문 작성 시점 실수 잔존.
- **2026-05-10**: **카툰·인스타 트리거 시간 분리 — chain 종속성 폐기 + Rube Goldberg 단순화**. 5/10 새벽 자동 갱신이 분할 commit push로 IG 3번 발행한 사고 + 저녁 마커 commit이 JP 필터 false positive로 IG 미발행한 사고가 같은 날 두 차례 발생. 근본 원인: cartoon→IG chain이 push 이벤트와 commit 구조에 의존하는 다층 게이트(메시지 매칭·JP 필터·60분 쿨다운·idle wait·Stage 1/2 마커) 누적, 모델 자율(트리거 세션의 push_files batch 결정)에 의존도 큼. 사용자 제안으로 **시간 트리거 단일화**.
  - **cartoon-generate.yml 트리거 변경** — `on: push (paths: data/version.js)` → `on: schedule '0 23,11 * * *'` (KST 08:00·20:00). 데이터 갱신(07:00·19:00 KST) 후 1시간 buffer로 모든 push 도착 보장. **Freshness guard** 추가: 마지막 commit이 12시간 이상 오래되면 트리거 push 실패로 보고 skip + warning. 이전 marker commit·idle wait·메시지 게이트·timeout-minutes 12 → 5 모두 정리.
  - **instagram-post.yml 게이트 단순화** — workflow_run conclusion=success만 통과, `event=='push'` 제한 해제(schedule도 통과). 메시지 게이트·JP 필터·60분 쿨다운 모두 삭제. cartoon-generate가 schedule 단일 트리거로 1번만 도니 chain abuse 방지 장치 불필요. 기존 게이트 step 자체 제거 후 mode 결정 step만 남김.
  - **RemoteTrigger prompt 단순화** — Stage 1/2 분리 룰("version.js를 마지막 별개 commit으로") 삭제, 단일 `git add -A && git commit && git push` 흐름으로 회귀. trim·lint·version.js bump는 유지. push 구조 자유 — push만 정상 완료하면 됨, cartoon·인스타는 별개 cron이 깨움.
  - **JP 필터 사고 별도 수정** — marker(version.js) 트리거 도입 직후 5/10 19:38 cartoon-generate가 정상 success였지만 instagram-post가 git diff에서 *-update.js 변경 0건(version.js만)을 보고 "JP만 변경"으로 잘못 판정해 IG 발행 skip. RemoteTrigger가 5탭(일본 제외)만 건드리는 룰이라 JP-only commit 자체가 매뉴얼 외엔 발생 불가 → 필터 자체 제거.
  - **사라진 위험**: Stage 1/2 룰 위반 mixed-date 카툰, marker commit 누락, 분할 push 다중 IG, JP 필터 false positive, idle wait heuristic, 60분 쿨다운. 이전 layered 방어 6종 → 1종(freshness guard)으로 압축.
  - **남은 위험**: 트리거 07:00 push 자체 실패(freshness guard로 차단). 매뉴얼 데이터 갱신 즉시 카툰 원할 시 GitHub Actions UI workflow_dispatch.
- **2026-05-09**: **자동 갱신 push 한계 영구 해결 + VPS 프록시 도메인 이전 + 친구톡 토요일 추가 + 홈피 카툰 단일 소스화**. 하루에 인프라·데이터 흐름 5건 동시 정리.
  - **자동 갱신 push 사고 + update.js 트리밍 시스템 도입** — 5/9 오전·오후 두 차례 자동 갱신 트리거 세션이 *-data.js만 푸시되고 *-update.js가 누락돼 홈피 헤드라인이 5/8 그대로 머무는 사고. 원인: 트리거 sandbox는 직접 `git push`가 아웃바운드 프록시 403으로 차단되고 우회 경로인 MCP `push_files` API는 JSON body 사이즈 한계(~50KB)가 있는데 *-update.js는 매일 entry prepend로 누적돼 80~210KB까지 비대화. 해결: **`scripts/trim-update-logs.js` 신설** — byte 기준 멱등 트리밍, brace-depth 추적으로 syntax 안전 보존, `Buffer.byteLength`로 UTF-8 한글(char 1=byte 3) 정확히 측정. 처음 50KB 한도로 적용했으나 세션이 새 entry(~2-3KB) prepend 후 다시 한도 초과해 push 실패 → **40KB로 강화**(prepend 후 ~42KB로 한도 안 머묾). 최종 결과: 654KB → 199KB (10~16개 entry/탭, ~1.5~2주치). 화면 노출(TL;DR=entry[0], 모달 mentions=12건)은 모두 커버, 잘려나간 옛 entry는 git history 보존. 사고 정리: 9개 partial 5/9 커밋 revert + force push로 깨끗한 베이스라인 복구 후 재발사 → *-update.js 5개 모두 `9/9` 배치로 통과 → cartoon → instagram 도미노 자동 동작.
  - **RemoteTrigger prompt 개선** — 자동 갱신 트리거의 prompt에 (1) 5탭 완료 후 첫 단계로 `node scripts/trim-update-logs.js` 명시 (2) lint 2종 통과 검증 (3) version.js 갱신 (4) 커밋·푸시 순서 엄수. 부수 정리: stale 표현 "07:00/13:00/19:00 KST 3회"→"07:00·19:00 KST 2회" (실제 cron `0 22,10`과 일치), "대상 탭 6개 — 일본 임시 제외"→"5개 — 일본·ETF 제외" + ETF 항목 삭제 (4/29 제거됨), "원자재·매크로"→"원자재·크립토".
  - **VPS 프록시 도메인 DuckDNS → Cloudflare 서브도메인 이전** — `briefick.duckdns.org` → **`proxy.briefick.com`** (Cloudflare DNS A 레코드 DNS-only). 이전 사유: 5/9 오전 친구톡 발송 시 Supabase Edge Function의 Deno Deploy DNS resolver가 duckdns.org 풀이 실패(`No address associated with hostname`) — DuckDNS 무료 dynamic DNS 글로벌 propagation 가끔 흔들리는 알려진 이슈. Cloudflare DNS는 anycast·SLA 100% 가까이 유지하는 인프라라 동급 사고는 자릿수 단위로 드묾. **VPS IP 변경 없음** — Aligo IP 화이트리스트 그대로 유효 (outgoing은 항상 VPS IP `115.68.224.225`). DNS only(회색 구름) 강제 — orange 켜면 Cloudflare가 중계하면서 cert 검증·SNI 흐름 복잡해져 굳이 안 함. 작업 단계: (1) Cloudflare DNS A 레코드 추가 (2) VPS Caddyfile `proxy.briefick.com` 블록 추가, 기존 duckdns 블록은 페이드아웃 안전망으로 유지 (3) Supabase secrets `ALIGO_PROXY_URL`·`ALIGO_PROXY_ALIMTALK_URL` 호스트 교체 (4) Edge Functions 3개(daily-send·expiry-notice·payment-confirm) 주석·문서 갱신.
  - **친구톡 정기 발송에 토요일 추가** — pg_cron `0 23 * * 0-4` UTC → **`0 23 * * 0-5`** UTC (KST 평일 → KST 월~토). 일요일은 휴식 1일 유지. 발송 대상은 5/9(토)부터 적용. CLAUDE.md·README·`/help`·`/admin`·`/terms` 등 사용자향 라벨 5곳 갱신 ("평일 오전 8시" → "월~토 오전 8시" / "다음 발송(월~토 오전 8시)").
  - **홈피 카툰 today-latest.png 단일 소스화** — 기존 KST 시각 <12면 `today-news.png`, ≥12면 `today-magazine.png` 분기 폐기. 자정에 칼같이 뉴스로 바뀌어 "저녁인데 뉴스" 사고가 자정~아침 사이 발생. cartoon-generate가 화풍 파일에 더해 **`today-latest.png`에도 동시 업로드** — 매 실행마다 가장 최근 카툰으로 덮어씀. 홈피는 `today-latest.png`만 읽고 시각 계산 제거. 생성 시각이 곧 화풍이라 자연스럽게 그 시간대 톤 노출 (오전 트리거=뉴스 / 저녁 트리거=매거진). 인스타 워크플로(캐러셀=today-news, Reels=today-magazine)는 그대로. 부트스트랩 안전망: onerror 폴백 체인 (today-latest → today-magazine → today-news → 숨김).
- **2026-05-08 (4)**: **카툰 생성 비율·모델 안정화 + 한글 매핑 누락분 보강**.
  - **카툰 4:5 비율 강제** — `scripts/cartoon/generate.js`의 Gemini API 호출 body에 `generationConfig.imageConfig.aspectRatio: '4:5'` 추가. 프롬프트의 "1080×1350" 문구만으로는 모델이 가끔 1:1 정사각을 뱉어 화풍별 출력 비율이 어긋남(today-news 928×1152, today-magazine 1024×1024). 홈페이지 카툰 슬롯이 KST 시간대(오전=뉴스 / 오후=매거진)로 분기되는데 비율 다르면 시각 일관성 깨짐.
  - **카툰 모델 nano-banana-pro-preview로 복귀** — 5/7에 비용 절감 위해 `gemini-2.5-flash-image`($0.04/장)로 다운그레이드 시도했으나 한국어 자모 hallucination 심각("오늘"→"오들", "시장"→"시작"). 워터마크·말풍선 글자가 깨져 사용자 신뢰도 직격이라 품질 우선 복귀. 비용 3배($0.13/장)지만 KST 시간대 분기로 매 실행 1장만 생성하므로 일일 ~$0.26 수준. `scripts/cartoon/generate.js` 기본값 + `cartoon-generate.yml` env + `instagram-post.yml` env(캐러셀·Reels 폴백 2곳) 4곳 동기화.
  - **한글 매핑 누락분 보강** — `data/company-ko.js`에 4건 추가/정정. **Claude Code → 클로드 코드** + **Claude → 클로드**(헤드라인·대안자산 본문에서 영문 그대로 노출되던 케이스, 길이 우선 적용으로 Claude Code가 Claude 단독보다 먼저 매칭). **Musk → 머스크**. **Citigroup '씨티' → '씨티그룹'**(정확한 회사명). `data/sector-pool.js` US_NAME_OVERRIDE에 **`"C": "씨티그룹"`** 추가 — 단일글자 티커는 COMPANY_KO 단어경계 룰로 보호 안 돼서 본문 치환 대상이 아니고, 히트맵은 별도로 ticker→한글 매핑(US_NAME_OVERRIDE)을 쓰는 구조라 양쪽에 따로 박아야 함(역할 다름, 통합 불가).
- **2026-05-08 (3)**: **호스팅 Vercel → Cloudflare Pages 이전 + 도메인 briefick.com 등록**.
  - **Cloudflare Pages 배포** — `briefick.pages.dev`로 GitHub repo 자동 배포 연결. 빌드 명령 없음(정적), 출력 디렉토리 `/`. Vercel Hobby 무료 플랜이 비상업적 용도 한정이라 결제 도입 시점에 Pro($20/월) 강제 — Cloudflare Pages는 무료 플랜에 상업 사용 명시적 허용 + 무제한 대역폭 + DDoS 보호 보너스.
  - **`_redirects` 파일 추가** — vercel.json rewrites와 동일한 매핑(`/admin`·`/renew`·`/help`·`/terms`·`/privacy`·`/refund`·`/legacy`·`/survey/:id`)을 Cloudflare 형식으로 변환. 두 파일 공존(Vercel은 `_redirects` 무시, CF는 vercel.json 무시) → 양쪽 동시 배포.
  - **도메인 briefick.com** — Cloudflare Registrar에서 직접 구매(레지스트라 마진 0). DNS 레코드 자동 생성(apex CNAME briefick.com → briefick.pages.dev + www CNAME), 양쪽 모두 프록시 + SSL 자동 발급. 기존 `roysbriefing.vercel.app`는 백업으로 유지(자동 배포 계속 받음).
  - **코드 URL 일괄 변경** — `https://roysbriefing.vercel.app` → `https://briefick.com` (8군데): Edge Functions(`stock-prices`·`admin-api`·`expiry-notice`) fallback default + scripts(`generate-message`·`instagram/caption`·`instagram/render-slides`·`instagram/template.html`·`test-aligo-friendtalk`) 하드코딩값. supabase secrets엔 `SITE_URL` 미설정이라 fallback default가 권위 — 환경변수 손 안 대고 코드만 수정. Edge Functions 3개 재배포 완료.
  - **PortOne 결제 도메인** — V2 storeId/channelKey 방식 + 갈락시아 테스트 채널은 도메인 화이트리스트 없음. briefick.com·vercel.app 양쪽에서 결제 시뮬 가능. 라이브 PG 채널 발급 시점에 PG사(갈락시아) 콘솔에서 도메인 등록 필요.
  - **유지**: `vercel.json`(백업 배포 계속 동작용), `docs/friendtalk-dispatch-runbook.md`(SOLAPI 시대 historical 문서로 보존).
- **2026-05-08 (2)**: **결제 모달 디자인 개편 — 3단 가격 플랜 + 바텀시트 슬라이드업 + plan-aware 결제 검증**.
  - **가격 플랜 3종 도입** — 30일 ₩2,900 / 6개월 ₩13,800(월 ₩2,300, 21% 할인) / 12개월 ₩22,800(월 ₩1,900, 34% 할인 · 12,000원 절약). `index.html`·`views/renew.html`·`payment-confirm` Edge Function에 `PRICE_PLANS` 단일 매핑 — `{days, amount, testAmount, label, orderName}` 구조로 클라·서버 동기화. `payment-confirm`은 클라가 보낸 `plan` 키를 권위 매핑으로 검증 후 `extendMs = plan.days * 1d`로 정확히 연장(이전 `MONTH_DAYS=30` 고정 제거). 6개월 가격은 초기 `34% 할인 = 11,400` 으로 잡았다가 운영 결정으로 `월 2,300원 = 13,800` 으로 변경.
  - **모달 UI 개편** — 종목 deep-dive 모달과 동일하게 화면 하단에서 슬라이드업(`translateY(40px)→0`), 모바일은 풀-너비 + 둥근 상단 모서리, 데스크톱은 가운데 정렬 + 440px max-width. 헤더(h2 + ✕)는 `.sub-modal-header` div로 묶어 `position:sticky;top:0` + 모달 컨테이너 풀-블리드 좌우(`margin:0 -24px`) — 세로 스크롤 시 헤더 고정. 드래그 핸들(36×4px) `::before` 모바일에서만 노출. 헤더 컴팩트(h2 20px·padding 14px 24px)로 위 빈 공간 제거.
  - **plan 카드 디자인** — 라디오 인풋 hidden + label 클릭 시 `.selected` 테두리·그림자. 카드별: 기간 라벨(좌) + 정가(strike) + 할인가(굵게) + 월 단가 + 할인 뱃지. 6개월 노란 뱃지 `21% 할인`, 12개월 검정 뱃지 `최대 할인 · 12,000원 절약`.
  - **3단계 UX 흐름** — (1) plan 선택 + 전화번호 입력 → "X원 결제하기" (2) 1단계 제출 → "기존 구독 확인 중…" → 자동으로 모달 끝까지 스크롤(`requestAnimationFrame` + `scrollTo`) + plan/전화번호/동의 모두 disabled(폰 회색 처리) + confirm 박스: 신규는 "이 번호로 매일 오전 8시 발송"·연장은 정렬된 두 줄 표("현재 만료 → 결제 시 만료") + 버튼 "X개월 X원 연장 결제하기" (3) PortOne 결제창 → 복귀 시 `.processing` 클래스 — plan/폰/동의 박스 모두 hide, 큰 status 박스 하나만 표시("결제 처리 중…"). 결제 검증 성공 시 `.completed` 클래스로 전환, plan 카드도 hide.
  - **모달 스크롤 차단 강화** — `body.style.overflow=hidden` + `documentElement.style.overflow=hidden` 양쪽 잠금(html이 메인 스크롤러인 데스크톱·일부 모바일 케이스 대응). `body.sub-modal-open{overflow:hidden}` 클래스만으론 부족했음. legacy.html `fsOpen/Close`·`openModal/Close`도 동일 패턴.
  - **/renew 페이지 동일 형식 포팅** — 만료 임박 친구톡의 "재구독 하러가기" 버튼이 연결되는 페이지. 모달 아니라 단일 카드 페이지지만 plan 카드·extend 표 디자인·processing/completed 상태·plan 비활성화·페이지 끝 자동 스크롤 모두 동일.
  - **expiry-notice 친구톡에 WL 버튼** — 본문에서 `▶ 재구독: <URL>` 텍스트 인라인 제거하고 `재구독 하러가기` WL 버튼으로 분리. `aligoSendFriendtalk`에 `buttonName`·`buttonUrl` 옵션 받아 알리고 `/akv10/friend/send/` `button_1` JSON 형식으로 forward(VPS 프록시가 button 필드 통과). cron 매뉴얼 트리거 검증 통과(`mid=1337573614`).
  - **TEST_MODE off** — 클라(`index.html`·`views/renew.html`) + 서버(`payment-confirm`) 모두 `TEST_MODE=false`로 전환. 갤럭시아 테스트 채널은 어차피 실청구 안 됨 — 정가로 결제 흐름 검증, 라이브 채널 전환 시에도 그대로 정가 적용.
- **2026-05-08**: **한글 매핑 단일 소스화 + expiry-notice 알리고 마이그 + SOLAPI 잔재 정리 + 발송 상태 분류 단순화**.
  - **한글 매핑 단일 소스화** — `data/company-ko.js`로 분리, 친구톡 본문에도 적용. 헤드라인은 한글화 잘 되는데 친구톡은 영문 그대로 나가던 사고 해결. 매핑 인라인이 `index.html`에만 있어 `daily-send` Edge Function 경로엔 미적용이었음. `data/company-ko.js` 신설(403개 매핑 — AI·유니콘·빅테크·반도체·바이오 등 섹터별 그룹 + 티커 형태 + 일반어 `Cloud`/`cloud`), 양쪽이 같은 파일을 fetch. `index.html`은 부팅 시 `_setCompanyKo()`로 로드, `daily-send`는 GitHub raw로 fetch 후 `localizeText()`를 `fetchTabEntries`에서 미리 적용(이후 `fitToLimit` 길이 계산이 한글 변환 후 텍스트 기준으로 정확). `Sunrun` 표기 교정(`선런` → `썬런`). 단일 글자·짧은 약어 티커(F·V·C·S·MS·MA·BE)는 일반 단어와 충돌해 풀네임만 매핑. CLAUDE.md에 단일 소스 룰 명문화.
  - **expiry-notice 알리고 마이그** — 5/7 마이그 시 누락된 마지막 함수. SOLAPI HMAC 호출 → VPS 프록시 경유 알리고 친구톡으로 교체. 알리고 친구톡 API의 버튼(WL) 파라미터는 VPS 프록시가 아직 미지원이라 본문에 `▶ 재구독: <URL>` 텍스트 인라인(친구톡은 URL 자동 클릭 가능 링크로 파싱). cron `daily-expiry-notice`(20:00 KST) 그대로 동작.
  - **SOLAPI 환경 정리** — supabase secrets에서 `SOLAPI_API_KEY`·`SOLAPI_API_SECRET`·`SOLAPI_PFID`·`SOLAPI_SENDER`·`SOLAPI_WEBHOOK_SECRET` unset, `solapi-webhook` Edge Function 삭제, 로컬 디렉토리 제거. README·CLAUDE.md·admin.html 경고 문구의 SOLAPI 잔재 일괄 sweep(알리고로 갱신). docs/friendtalk-dispatch-runbook.md는 SOLAPI 기준 historical 문서로 유지(별도 갱신 없이 기록용).
  - **발송 상태 분류 단순화** — 알리고는 SOLAPI와 달리 표준화된 실패 사유 코드(3050·3120·3130 등)를 제공하지 않아 not_friend/paused_ad/blocked 분류 의미 없음. 구독자 조회·수동 발송 필터를 5단계 → 3단계(`ok`/`fail`/`unknown`)로 단순화. `daily-send`의 `deriveDeliveryState` 키워드 매칭 제거, 그룹 전체 실패 = `fail`, 부분 실패 = `unknown`(폰별 식별 불가), 성공 = `ok`. 자연어 사유는 `send_logs.provider_message`에 그대로 보관 — 발송 이력 사유 컬럼에 노출. 통계 카드 `채널 미가입` → `발송 실패` 라벨 변경, 배지 CSS·colorMap 잔재 제거. 향후 알리고 polling(`/akv10/history/detail/`) 도입하면 per-recipient 결과 추적 가능, 현재는 미적용.
- **2026-05-07**: **SOLAPI → 알리고 마이그레이션 + VPS 프록시 + 카툰·시세·설문 다축 개편**. 발송 단가 절감(친구톡 ₩110 → ₩19.9, ~82%) 위해 친구톡·알림톡 양쪽을 알리고로 전환. 알리고는 IP 화이트리스트가 강제라 동적 IP인 Edge Function에서 직접 호출 불가 → iwinv VPS(`115.68.224.225`, `briefick.duckdns.org`)에 Node 프록시 띄우고 Caddy + Let's Encrypt로 HTTPS 종단, `X-Proxy-Secret` 헤더 인증으로 `daily-send`·`expiry-notice`·`payment-confirm`·`admin-api` 모두 프록시 경유. 알리고 친구톡 API(`/akv10/friend/send`)·알림톡 API(`/akv10/alimtalk/send`) 호출, 키·sender key는 VPS `.env`에 보관. **알림톡 템플릿 재승인** — 결제완료 `UH_6779`(채널추가 WL 버튼), 수동 문제해결 `UH_7008`(이전 `UH_6780`에서 줄바꿈 변경 위해 재검수, 버튼명 `문제해결 도움받기`로 등록 템플릿과 일치). 카카오 채널추가 띠는 알리고 자동 노출 + 이미 채널 친구인 수신자에겐 숨김(본인 폰 테스트로 영원히 검증 불가). **카툰 생성 통일** — 1950s 화풍(뉴스 캐러셀용)·mad-mag 화풍(Reels용) 두 스타일을 자동 갱신마다 동시 생성, `today-news.png`·`today-magazine.png` 두 파일로 Storage 저장. `cartoon-generate.yml` 워크플로에 두 step(1950s strict + mad-mag continue-on-error). **인스타 신선도 체크** — `instagram-post.yml`이 두 파일 download 시 Last-Modified 1시간 freshness 검증, stale 파일이면 fallback 재생성. 캐러셀(1950s)도 Reels와 대칭으로 동일 게이팅. **시세 상태 배지 대칭** — KR `장 마감`·`동시호가` stale 처리(`pxIsKrAfterHours` 정규장 외 시간대 `changePct` 숨기고 종가 표시 폴백)에 이어 US도 동일 패턴(`프리마켓`/`애프터`/`장 마감`/`M/D 종가` 4단 배지). 정규장 직후 yahooChartOne의 직전 거래일 종가 잡힘 버그 수정(`regularMarketTime` 우선). **시세 cron 5분 통일** — 기존 시간대별 다른 주기를 단일 `*/5 * * * *`로. **영문 회사명 한글 자동 치환** — index.html에 `COMPANY_KO`(처음 인라인) + `localizeText()` 도입, 렌더 시점에만 적용해 데이터 파일·update.js는 원본 보존. 헤드라인 TL;DR·캘린더 이벤트 타이틀·종목 deep-dive·대안 자산 모두 적용. 5/7 하루 동안 매핑 ~30 → ~200+로 확장(엔트로픽·알파벳·코어위브·안두릴·미스트랄·딥마인드·OpenAI 등 자주 등장하는 회사명·티커). **설문 시스템 신설** — `surveys`·`survey_responses` 테이블 + `survey-api` Edge Function(get/submit 공개 + list/create/update/delete/results 관리자), `/survey/{id}` 공개 응답 페이지(IP 해시 dedup), 관리자 대시보드 `📋 설문` 메뉴(목록·생성·편집·결과 차트). title=question 단순화(질문 본문 입력 제거), 브리픽 브랜드·푸터 생략(채팅 썸네일 타이틀 `설문조사`). RLS 활성화(no policies → default deny, service_role bypass). **`sector-pool.js` 분류 정정** — 한화에어로 우주 제외(매출 압도적으로 방산), 키움증권 통신·인터넷 → 금융, 한국전력 금융 → 전력·에너지, 카카오뱅크/카카오페이 통신 → 금융, 현대차 엔터·콘텐츠 → 자동차, NHN 게임 → IT·전자, 한전KPS 통신 → 전력·에너지 등 15+ 건 일괄 정정. dual-list 처리(한화시스템·한국항공우주 방산·우주 / 켄코아에어로스페이스 우주·항공). **`KR_NAME_OVERRIDE` 한글명 lookup 강화** — `scripts/lint-finmap-pool.js`로 풀 ticker 형식·한글명 매핑·dead override 검증, CLAUDE.md 커밋 전 lint 체크리스트에 추가. **관리자 발송 버튼 스타일 통일** — 친구톡 즉시 발송·공지 발송 모두 `btn ghost`(처음 친구톡을 primary로 맞췄다가 반대 방향 통일로 재교정). **관리자 발송 이력 날짜 필터 KST 경계 수정** — `fFrom` ISO 변환에 `T00:00:00+09:00` 명시, 서버 UTC 변환에서 한국 자정 경계 어긋나던 문제 해소. 자동 갱신 재실행 버튼 안내 URL overflow `word-break:break-all`. **구독 모달 스크롤 전파 차단** — `.sub-modal-bg`·`.sub-modal`에 `overscroll-behavior:contain` 추가, 만료 임박 모달에서 스크롤 시 뒤편 메인이 따라 움직이던 문제 해소. **결제 알림톡 채널추가 버튼명 정정** — `채널 추가` → `채널추가`(공백 없이) 등록 템플릿과 일치. **터미널 사용자 노트** — VPS 셋업 중 long line wrap·smart quotes 문제로 nano 편집기 사용·파일 기반 curl payload·heredoc 회피 패턴 학습.
- **2026-05-06**: **시장 한눈에 — 시총 기반 섹터 핀맵 추가**. 메인 페이지 5번째 섹션으로 신설(`섹터 성장 단계` 다음, `대안 자산` 직전). 18 섹터 그리드(데스크톱 3열 / 1024px↓ 2열 / 640px↓ 1열), 섹터 표시 순서는 `돈버는 섹터` 섹션과 동일(FY26E 매출 성장률 중앙값 내림차순). 종목 선별·셀 크기는 시총 기준 — 섹터별 풀(`data/sector-pool.js`)에서 시총 상위 7 동적 선별, 셀 크기 sqrt(시총) 비례, 색상 등락률 5단계(±0.5/1.5/3/5%). 셀 클릭 → deep-dive 모달, 풀-only 종목은 합성 stock 객체로 모달 띄움. 모서리 직각·검정 0.5px 반투명 테두리·시장 마감 시 회색 대신 직전 등락 색 유지. **시총 fetch** — `stock-prices` Edge Function이 Yahoo crumb 인증으로 `v7/finance/quote` 엔드포인트 호출(50개 배치, 401 시 crumb 자동 재발급). 한국 종목은 KS·KQ 둘 다 시도, 더 큰 시총 쪽 사용(거래소 자동 결정). **풀 데이터 구조** — `data/sector-pool.js`에 SECTOR_POOL(섹터→ticker)·KR_NAME_OVERRIDE(풀-only 한국 한글명)·US_NAME_OVERRIDE(풀-only 미국 한글명) 노출, Edge Function·프론트 공통 사용. 큐레이션 7종목 + 후보 5~10개씩 풀 ~13~17/섹터. 종목명 lookup 체인: 큐레이션 nm → cross-sector 큐레이션 → KR/US_OVERRIDE → Yahoo longName → ticker. **lint 자동화** — `scripts/lint-finmap-pool.js`로 ticker 형식·한글명 매핑·dead override 검증, CLAUDE.md 커밋 전 체크리스트에 추가. **표시 라벨 변경** — `섹터 성장 단계` → `돈버는 섹터` (UI 친숙성). **모바일 UX 개선** — (a) `todayKST()` 타임존 오프셋 중복 적용 잠복 버그 수정(매일 자정~09시 캘린더 dow 어제로 표시) (b) 섹터 펼침 시 자동 스크롤 제거, 위 섹터 닫힘 시 시선 보정 scrollBy로 펼친 행 viewport 위치 고정 (c) 캘린더 → 일자별 모달 → 종목 모달 백키 한 단계씩 복원 모달 스택 도입 (peer 클릭은 stack top 교체로 무한 chain 방지) (d) 한국 종목 정규장 직후 직전 거래일 종가 잡히던 yahooChartOne 버그 수정(regularMarketTime 우선) + KS·KQ ghost data 회피(time 비교) (e) 시세 시각 오늘 KST 아닌 경우 chgPct 숨기고 stale 배지 ("M/D 종가"). **친구톡 버튼명** — "오늘의 브리핑" → "오늘의 브리핑 보러가기". **데이터 정정** — 삼성엔지니어링 → 삼성E&A 표기, 트레이더 은어 비트·미스·ATH·우호 톤 일괄 sweep(컨센 상회/하회/사상 최고/우호 흐름).
- **2026-05-05 (2)**: **실시간 시세 표시 (Yahoo Finance 15분 지연)**. `supabase/functions/stock-prices/` 신설 — v8 chart endpoint(`includePrePost=true`)로 미국·한국(.KS/.KQ 자동 매칭)·원자재·크립토 시세 fetch, Supabase Storage `prices/latest.json`에 저장. pg_cron `stock-prices-refresh`(매 15분)이 사용자 접속 무관 항상 최신화. `index.html`이 Storage public URL을 직접 fetch + 5분 폴링(`document.hidden` 시 skip). 종목 카드·deep-dive 모달에 `$가격 +N%` / `₩가격 +N%` 형식 노출, 등락 색상 적용. 프리/애프터마켓 시간대 baseline `previousClose` 대신 `regularMarketPrice` 사용해 Yahoo 표시값 일치. 섹터 단계 헤더 안내 문구 "수치·종목 구성 매일 2회 갱신" → "시세는 15분 지연 (Yahoo Finance)"로 교체. **표시 순서 룰 정립** — 선점 순서(자동 갱신 dedup, `kr→stocks→ai→unicorn→commodity`)와 표시 순서(사용자 노출, `kr→stocks→ai→commodity→unicorn`)를 별도 룰로 분리, CLAUDE.md 명문화. 헤드라인 TL;DR / 친구톡 발송(`daily-send`) / 인스타 슬라이드(`render-slides`) / 메시지 생성(`generate-message`) / 대안 자산(`DOMAINS`) 모두 표시 순서로 통일. 대안 자산은 commodity가 원자재·크립토로 분리되므로 `ai→commodity→crypto→unicorn`(공통 데이터 출처 인접). **인스타 릴스 BGM 랜덤 픽** — 첫 트랙 고정 → `Math.random()` 풀 픽으로 변경, 트랙 추가 시 자동 확장. **미국마켓 헤드라인 첫 줄 룰 위반 정정** — 5/5 19:15 엔트리가 시장 지수 일상 라인을 첫 줄에 둬 임팩트 큰 단일 사건(AMD·MSTR Q1 D-Day) 우선 룰 위반, 라인 재정렬·유가는 미국 정유 마진 관점으로 강등(commodity 탭과 슬롯 중복 회피).
- **2026-05-05**: **메인 페이지 전면 개편 — 5탭 카드 그리드 → 헤드라인 TL;DR + 14일 이벤트 캘린더 + 섹터 성장 단계 단일 흐름**. 신 메인 구성: (a) "오늘 놓치면 안 되는 것" hero + 시장별 첫 줄 카드 5개(TL;DR, 펼침 토글로 전체 불릿) (b) `data/calendar-events.js` 기반 2주 이벤트 캘린더(셀 클릭 → 카테고리별 day modal, 종목 칩 → deep-dive 모달) (c) 18 섹터 성장 단계 정렬 리스트(한국·미국 토글, 행 클릭 → 7종목 카드 + 자동 스크롤) (d) 종목 deep-dive 모달(차별화 포인트 + 매출·영업이익 막대그래프 + mentions + peers, 모바일 바텀시트 + 스와이프-다운/Android 백키/✕). **구 메인 백업** — `views/legacy.html`로 보존, `/legacy` 라우트 신설 (vercel rewrite). **구독 모달 풀 포팅** — sub- 프리픽스로 deep-dive 모달과 격리, PortOne v2 + check-subscription/payment-confirm Edge Function 호출 신 메인에서 동작. **헤더 카피 변경** — "구독하기" → "매일 카톡으로 받기" (정기성 + 채널 명시 + 동작 직관성). **한국·미국 순서 전면 swap** — TL;DR 카드 / 친구톡 메시지 / 운영 대시보드 매일 뉴스 / 인스타그램 캐러셀 / 섹터 단계 토글 기본값 모두 한국 우선(초보 진입 장벽 완화). **모바일 캘린더 가독성** — 셀 높이 160px 통일, 칩 폰트 9px(≤768) / 8.5px(≤480) + 1줄 nowrap + ellipsis 없음(clip), today 좌측 라인·배경 tint 제거(셀 폭 동일감). high-impact 칩의 폰트 굵기·흰 배경 모바일 한정 제거. 섹터 카테고리명 한 줄 유지(자동차·모빌리티 등 줄바꿈 방지). **공지 친구톡 발송 기능 신설** — 운영 대시보드 좌측 메뉴 `📢 공지`. 활성 구독자 선택 + textarea 자유 본문(1000자 카운터) + 야간 발송 경고 confirm. 백엔드: admin-api `notice_send` 액션이 `daily-send`에 `customMessage` 필드로 프록시, daily-send은 customMessage 있으면 update.js 조립 건너뛰고 본문 그대로 발송, send_logs.template_code='notice'로 분리 기록. **CLAUDE.md 정책 보강** — (a) summary 첫 줄 = 그날의 대표 헤드라인 엄수(TL;DR strip이 그대로 노출하므로 메가캡 신고가·메이저 펀딩 같은 임팩트 큰 사건을 첫 줄에, 시장 지수 동향은 둘째 줄 이후) (b) 캘린더 빈 날짜 의식적 점검 — 자동 갱신마다 향후 14일 윈도우 내 빈 평일을 식별하고 중국 매크로(CPI·PPI 9~10일·무역수지)·미국 주중 정기(도매재고·재정수지·NFIB·JOLTS)·일본·어닝 잔여 종목 후보를 한 번 더 확인. 5/11 빈 날에 "중국 4월 CPI·PPI" 추가(주말 시프트). **수치 표시 정리** — 모달 매출/영업이익 헤더 "(Revenue)/(Operating Profit)" 영문 부연 제거, "최근 사건 (최대 12건)" → "최근 사건", 섹터 단계 설명에 "수치·종목 구성 모두 매일 오전·오후 2회 갱신" 부연. hero 메타 pill에 수집 시간 HH:MM 부착(latest update.js entry 기반). **대안 자산 섹션 신설** — 메인 4번째 섹션으로 추가, AI 동향·유니콘·원자재·크립토 4 도메인을 vertical 패널 4개로 동등 비중 노출(메인 한국·미국 주식 외 자산 가치 강조). 각 패널: 헤더(갱신 시점 + 상대 라벨 `오늘 N건` / `5/03 갱신 · 2일 전`, 2일 이상 stale 시 warn 색) + 사건 단위 리스트(섹터 + 헤드라인, 클릭 시 inline 펼침으로 detail 풀 텍스트). commodity-update의 sector 기준 commodity vs crypto 자동 분기. 헤드라인 추출은 괄호 깊이·숫자 점·괄호 균형 처리하는 `extractHeadline` 헬퍼 사용. 좌측 도메인 색상 라인(AI 파랑·유니콘 보라·원자재 주황·크립토 녹색). hero TL;DR이 5 도메인 한 줄씩이라면 이 섹션은 4 도메인의 사건 단위 깊이 — 보완 관계. **친구톡 WL 버튼명 변경** — `daily-send` 친구톡 발송 버튼 "전체 뉴스 보기" → "오늘의 브리핑" (메인이 뉴스 단일 축에서 하이라이트·캘린더·섹터 단계·대안 자산 다축으로 확장됨에 따라 셋을 포괄하는 표현으로 교체).
- **2026-05-03**: **인스타그램 Reels 자동 게시 추가**. `scripts/instagram/render-reels.js` — 기존 1080×1350 PNG를 ffmpeg `xfade` 필터로 1080×1920 9:16 mp4로 변환(슬라이드당 6초 + 0.5초 crossfade, 위·아래 같은 이미지의 블러 BG로 letterbox 회피, 총 ~39초). `scripts/instagram/music/` 디렉토리에 royalty-free mp3 드롭하면 자동 페이드인/아웃 합성. `publish.js`에 `publishReels()` 추가 (REELS media_type · `share_to_feed=true` · 비디오 처리 대기 5분). `IG_MODE` 환경변수(all/carousel/reels)로 발행 분기. **시간대별 포맷 분기** — push 트리거의 자동 갱신 커밋에 KST 시간대 기반 mode 결정 step 추가: 05~12시→carousel, 13~23시→reels, 그 외→all. 결과 하루 4개 → **하루 2개 포스트(오전 캐러셀 + 오후 Reels)**로 알고리즘 sweet spot 정렬. **`/publish` 슬래시 명령** 신설 — `mode`·`dry` 인자 자유 순서 파싱(`/publish reels`, `/publish carousel dry` 등). **발행 트리거 게이팅** — push로 발행하려면 커밋 메시지가 `데이터 자동 갱신` 또는 `데이터 정합성 강제 갱신`으로 시작해야 함, 사람이 수동 편집한 커밋이 의도하지 않은 시간대 발행으로 이어지지 않게 차단. workflow_dispatch는 게이팅 미적용. workflow에 `ffmpeg` apt 설치 step 추가. **자동 갱신 13시 슬롯 비활성화** — RemoteTrigger cron `0 22,4,10` UTC → `0 22,10` UTC, 매일 07/19시 KST 2회로 축소. **CLAUDE.md 정책 보강** — (a) 탭 콘텐츠 독립성 원칙(cross-tab 인용 금지), (b) 탭 간 사건 중복 방지(stocks→kr→ai→unicorn→commodity 선점 우선), (c) summary·detail 문체 — em-dash(`—`) → hyphen(`-`)·"톤(tone)" 트레이더 은어 → 자연어 기조/흐름·"비트/미스" → 컨센 상회/하회. 5개 update.js 일괄 sweep으로 기존 데이터 정정.
- **2026-05-01**: Supabase 키 namespace 통일 — `SUPABASE_SECRET_KEY` → **`BRIEFICK_SUPABASE_SECRET_KEY`**, `SUPABASE_PUBLISHABLE_KEY` → **`BRIEFICK_SUPABASE_PUBLISHABLE_KEY`**. 원인: Supabase가 사용자 정의 secret 이름의 `SUPABASE_` 접두사를 거부(`Name must not start with the SUPABASE_ prefix`)하며 `SUPABASE_SECRET_KEYS`(복수 JSON) 등 자동 주입 변수와 namespace 충돌. 프로젝트 prefix `BRIEFICK_` 부여로 일괄 정리. Edge Function 7개·`publish.js`·workflow yml·프론트 JS 변수명·문서 동기화. `.claude/settings.local.json`을 git 추적 해제(머신별 권한 설정).
- **2026-04-30**: **인스타그램 캐러셀 자동 게시** 추가 (`@briefick`). `data/*-update.js` 푸시 시 GitHub Actions가 발동 → Playwright로 1080×1350 PNG 7장 렌더 → Supabase Storage 업로드 → Graph API 캐러셀 게시. 다크 테마 + Unsplash 콘텐츠 매칭 사진 BG(인물 필터·게시물 내 중복 방지·CDN 캐시 회피용 시각 경로). 캡션은 마켓 정보 없이 프로필 링크 유도 CTA + 가변 해시태그(`#브리픽 #briefick` 보존·30개 한도). transient Graph API 에러 자동 재시도(9007/2207027/code:1·subcode:99 등). Supabase 키 신포맷(`sb_secret_...`/`sb_publishable_...`) 1차 정리 + 변수 네이밍 일관 정리(이후 `BRIEFICK_` 접두사로 5/1 추가 정리).
- **2026-04-29 (2)**: 글로벌 ETF 흔적 완전 제거. `data/etf-data.js`·`data/etf-update.js`·`.claude/commands/update-etf.md` 파일 삭제. `index.html`의 `STATE.etf`·`ETF_URL`·`norm(kind==='etf')`·`TAB_DESC.etf`·`TAB_SRC.etf`·`TAB_FILTERS.etf`·`META_CFG.etf`·`_updateExpand.etf` 모두 정리. `update.md` 대상 탭 표기·"ETF/레버리지" 표현·`docs/friendtalk-dispatch-runbook.md`·`docs/kakao-subscription-plan.md` 모두 정합 정리.
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
