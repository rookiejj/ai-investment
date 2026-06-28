# Briefick Terminal (`/trading`)

미국 주식 투자자를 위한 **한국어 기반 고밀도 금융 터미널**. 미국 주식·ETF·지수·금리·원자재·환율 + 한국 주식을 한 화면에서 보고, 차트·뉴스·포트폴리오·모의거래·AI 분석을 제공한다.

> **독립 페이지**: 이 터미널은 기존 briefick 서비스(`index.html` 등)와 **코드·상태를 전혀 공유하지 않는다**. `/trading` URL과 `trading/` 폴더 안에서만 동작하므로 메인 서비스에 영향이 없다.

---

## 화면 구성 한눈에 (사용 가이드)

> 앱 안에서도 상단바 **`?` 버튼** 또는 명령창에 `help` 입력으로 같은 가이드를 볼 수 있다.

### 상단바
| 요소 | 기능 |
|---|---|
| `CMD ▸` 명령창 | 티커(`NVDA`→차트) · `go portfolio`(탭 이동) · `add TSLA`(관심추가) · `buy NVDA 10`/`sell`(모의주문) · `help` |
| `⚡ AI` | AI 탭으로 이동 |
| `● PAPER 모의` / `● LIVE 실거래` | 거래 모드 배지. 초록=모의(체결 안 됨), 빨강=실거래 |
| 연결상태 · 시계 | 데이터 출처(Supabase/Local) · 뉴욕 시각 |
| `?` / `⚙` | 사용 가이드 / 설정 |

### 8개 탭 (클릭 시 화면 전환)
`시장 · 모니터 · 차트 · 뉴스 · 포트폴리오 · 옵션 · 주문 · AI`

### 박스(패널)
| 제목 | 무엇 |
|---|---|
| 마켓 요약·지수 | 주요 지수·금리·원자재·환율 현재가·등락 |
| 관심종목 | 시세 목록 (클릭=선택, `+` 추가, `✕` 삭제) |
| 종목 상세 | 현재가·전일종가·통화·데이터 상태 |
| 등락 상위 | 관심종목 중 상승/하락 상위 |
| 차트 | 캔들+거래량+이동평균/볼린저/RSI/MACD |
| 뉴스 | 시황 헤드라인 (강세/약세/중립) |
| AI 시장요약 | AI 시장 요약 |
| 포트폴리오·보유 | 수량·평단·현재·평가·손익 (`+`/`✎`/`✕`) |
| 비중·지표 | 섹터·국가·통화 비중·손익·리밸런싱 |
| 옵션 체인 | 옵션 (API 연동 필요) |
| 주문 티켓 | 수량·유형 입력 후 매수/매도 (모의) |
| 포지션·모의 / 체결 내역·모의 | 모의 보유·현금 / 주문 기록 |
| AI 어시스턴트 | AI 채팅 |

### 조작
- 패널 헤더 **드래그** = 위치 이동 · 헤더 `▾` = 접기 · 아래/옆 경계 드래그 = 높이/폭 (PC)
- `+` 추가 · `✎` 수정 · `✕` 삭제
- 레이아웃은 탭별로 자동 저장(localStorage). ⚙ 설정에서 초기화.

---

## 핵심 원칙 — 가짜 데이터 금지

데이터가 없으면 **그럴듯한 가짜 숫자를 만들지 않는다.** 모든 시세·지표에는 상태 배지가 붙는다.

| 배지 | 의미 |
|---|---|
| `실시간` | 실시간 데이터 |
| `지연` | 지연 데이터 (Yahoo 기본 ~15분 지연) |
| `데이터 없음` | 해당 심볼/기간 데이터를 못 구함 — 비워둠 |
| `API 필요` | 별도 API 키/제공자 연동이 필요한 영역 (옵션 체인·미국 원문 뉴스 등) |
| `오류` | 일시적 통신 오류 |

---

## 빠르게 실행 (로컬)

의존성 0 — Node 18+만 있으면 된다.

```bash
# 1) 저장소 루트에서
node trading/server/server.js
# → http://localhost:8080  (정적 + /api/market-data 프록시 → Yahoo, 약 15분 지연)
```

브라우저에서 `http://localhost:8080` 접속. 비로그인 상태로도 지수·관심종목·차트·뉴스가 **실데이터**로 보인다.

### Docker 로 실행

```bash
cd trading
docker compose up -d        # → http://localhost:8080
# 중지: docker compose down
```

---

## 왜 프록시가 필요한가 (데이터 경로)

브라우저는 Yahoo Finance 를 **CORS** 때문에 직접 못 부른다. 그래서 서버가 대신 받아 CORS 헤더를 붙여 돌려준다. 두 가지 배포 형태를 지원한다.

```
[브라우저]  ──>  /api/market-data        (로컬/Docker: trading/server/server.js)
            ──>  Supabase Edge Function  (정적 호스팅: supabase/functions/market-data)
                       └──>  Yahoo Finance v8 chart (무키, ~15분 지연)
```

`config.js` 의 DataService 가 우선순위로 자동 선택한다:

1. 같은 오리진에 `/api/market-data` 가 있으면 그것 사용 (로컬 Node / Docker)
2. 없으면 `SUPABASE_MARKET_URL` (Cloudflare Pages 정적 배포 → Supabase Edge Function)
3. 둘 다 없으면 시세를 `API 필요` 로 표시 (가짜 숫자 금지)

> ⚠ Yahoo 는 흔한 풀 Chrome User-Agent 를 429 로 차단한다. 프록시는 짧은 `Mozilla/5.0` UA + 호스트 로테이션(query1/query2) + 재시도 + 20초 캐시 + 동시성 3 제한으로 안정화했다(2026-06 실측).

---

## 실서버 배포

### A. 우리 스택 (Cloudflare Pages + Supabase) — 실제 운영 방식

1. **정적 페이지**: `trading/` 가 그대로 Cloudflare Pages 에 배포된다. `/trading` 라우트는 `_redirects` 에 등록돼 있다.
2. **시세 프록시(Edge Function)**: `supabase/functions/market-data` 를 배포한다.
   ```bash
   supabase functions deploy market-data
   ```
   `supabase/config.toml` 에 `[functions.market-data] verify_jwt = false` 가 박혀 있어, 브라우저 publishable key 호출이 게이트웨이에서 막히지 않는다(이 프로젝트 공통 규칙).
3. 배포 후 검증:
   ```bash
   curl -s "https://<project-ref>.supabase.co/functions/v1/market-data?type=quote&symbols=AAPL" | head -c 200
   ```

### B. 일반 단독 배포 (어디서나)

`docker compose up -d` 한 컨테이너로 정적+프록시가 함께 뜬다. 앞단에 리버스 프록시(Caddy/Nginx)를 두고 HTTPS·도메인을 종단한다.

```
사용자 ──HTTPS──> Caddy/Nginx ──> briefick-terminal:8080
```

Caddy 예시(자동 HTTPS):
```
terminal.example.com {
    reverse_proxy localhost:8080
}
```

운영 체크리스트:
- **HTTPS 강제** (Let's Encrypt 등). 평문 HTTP 금지.
- 리버스 프록시에서 **응답 캐시**(지수/시세 GET)로 Yahoo 부하·지연 완화.
- 필요 시 프록시 앞단에 **인증/Rate limit**.

---

## 필요한 API 키 목록

| 기능 | 제공자(예) | 키 | 현재 상태 |
|---|---|---|---|
| 시세(주식·ETF·지수·금리·원자재·환율·한국주식) | **Yahoo Finance** | 불필요 | ✅ 기본 동작 (지연 ~15분) |
| AI 어시스턴트/요약/번역 | **Google Gemini** | 필요(선택) | ✅ 키 입력 시 / 없으면 규칙기반 폴백 |
| 미국 원문 뉴스 + 감성/티커 | Finnhub, Marketaux | 필요 | 🔌 인터페이스 + 정직한 상태 (스캐폴드) |
| 옵션 체인 | Polygon.io, Tradier, CBOE | 필요 | 🔌 인터페이스 (스캐폴드) |
| SEC 공시 | SEC EDGAR (UA 필요) | UA | 🔌 문서화 (스캐폴드) |
| DART 공시 | OpenDART | 필요 | 🔌 문서화 (스캐폴드) |
| 실시간(무지연) 시세 | Polygon/IEX/Databento | 필요 | 🔌 제공자 교체 지점 문서화 |
| 브로커 포트폴리오/주문 | Alpaca / IBKR / 한국투자 Open API | 필요 | 🔌 인터페이스 + Paper 기본 |

- ✅ = 지금 동작 · 🔌 = 연결 지점/인터페이스는 있으나 키·구현 필요(가짜로 안 채움)
- 서버측 키는 `trading/.env`(`.env.example` 복사)에, **클라이언트측 키(Gemini·브로커)는 브라우저 [설정]→localStorage** 에 저장.

---

## 데이터 제공자별 설명

- **Yahoo Finance v8 chart** (`query1/query2.finance.yahoo.com`): 무키. 미국·한국(`.KS`/`.KQ`)·지수(`^GSPC` 등)·금리(`^TNX`)·원자재 선물(`CL=F`,`GC=F`)·환율(`KRW=X`,`DX-Y.NYB`)·크립토(`BTC-USD`) 모두 같은 엔드포인트. 약 15분 지연. 분봉/일봉/주봉/월봉(`1d`/`1wk`/`1mo`), 기간 `1mo`~`10y`.
- **Gemini** (`generativelanguage.googleapis.com`): 브라우저에서 직접 호출(API 키). 시장 요약·종목 분석·뉴스 번역에 사용. 키 없으면 로컬 규칙기반 요약으로 폴백.
- **뉴스(현재)**: 브리픽 자체 시황 스냅샷(`tabs/latest.json`)을 실데이터로 표시(한국어). **미국 원문 뉴스·번역**은 Finnhub/Marketaux + Gemini 연동이 필요한 영역으로 `API 필요` 표시.
- **옵션/SEC/DART/무지연 시세**: 제공자 키 연동 지점만 마련(스캐폴드). 연결 전에는 가짜 데이터 대신 명확한 상태 표시.

---

## Gemini(또는 다른 AI) 설정 방법

1. Google AI Studio 에서 Gemini API 키 발급.
2. 터미널 우상단 **⚙ 설정** → `Gemini API Key` 에 입력 → 저장.
3. 키는 **이 브라우저 localStorage 에만** 저장된다(서버/깃 전송 없음).
4. 키가 있으면 AI 어시스턴트·시장 요약이 Gemini 로, 없으면 **로컬 규칙기반 요약**으로 동작한다.

다른 AI 로 바꾸려면 `app.js` 의 `AI.gemini()` 를 해당 제공자 호출로 교체하면 된다(같은 `{ok,text}` 반환 규약).

---

## 브로커 API 연동 방법 (포트폴리오·실주문)

기본은 **Paper Trading(모의)** 이고, 실주문은 명시적으로 켜야만 가능하다(아래 "주문/거래 안전" 참조).

연동 지점:
- **포트폴리오 가져오기**: `Portfolio` 모듈에 브로커 보유내역을 채우는 어댑터를 추가. 현재는 **수동 입력**과 로컬 저장이 기본.
- **주문 실행**: `app.js` 의 주문 처리에서 `settings.broker` 가 설정되고 `liveEnabled=true` 일 때만 실제 브로커 어댑터를 호출하도록 분기. 어댑터 인터페이스(권장):
  ```
  broker.getPositions() -> [{symbol, qty, avgCost, currency}]
  broker.placeOrder({symbol, side, qty, type, limitPrice}) -> {orderId, status}
  ```
- 제공자별 메모:
  - **Alpaca**: REST(`/v2/positions`, `/v2/orders`), API Key/Secret. paper/live 엔드포인트 분리.
  - **Interactive Brokers (IBKR)**: Client Portal Gateway 또는 TWS API. 로컬 게이트웨이 경유 권장.
  - **한국투자증권 Open API (KIS)**: OAuth 토큰 발급 후 REST. 모의/실전 도메인 분리.
- ⚠ 브로커 키는 **서버측 .env** 또는 사용자 브라우저에 저장하되, 실주문 경로는 반드시 서버를 거치도록 설계(브라우저에 시크릿 노출 최소화). 자세한 보안은 아래.

---

## 로그인 / 보안 설계

현재 v1 의 개인화(관심종목·포트폴리오·모의계좌·레이아웃·설정)는 **브라우저 localStorage** 에 사용자별로 저장된다(로그인 없이 그 기기에서 유지).

서버 기반 로그인으로 확장할 때(권장 경로):
- **인증**: Supabase Auth(이메일/OAuth) 또는 자체 세션. 비로그인은 일반 시장 데이터·뉴스만, 로그인 시 포트폴리오·설정 동기화.
- **사용자별 저장**: `user_settings`, `watchlists`, `portfolios` 테이블 + RLS(본인 행만 접근). localStorage 값을 그대로 마이그레이션 가능.
- **민감 키 보관 주의**:
  - Gemini·브로커 키를 평문으로 DB에 넣지 말 것. 서버 환경변수(.env) 또는 KMS/Secrets Manager 사용.
  - 브라우저 저장 키는 **그 기기에만** 남는다 — 공용 PC 입력 금지(설정 화면에 경고 표시됨).
  - 실주문용 브로커 시크릿은 **서버측에서만** 보관하고, 브라우저는 세션 토큰만 사용.
  - HTTPS 필수, 세션 쿠키는 `Secure; HttpOnly; SameSite`.
- **데이터 삭제**: 설정 → "내 데이터 삭제" 로 localStorage 전체 초기화 제공.

---

## 레이아웃 커스터마이징 방법

- 패널 헤더를 **드래그**해 같은/다른 컬럼으로 이동(위치 변경).
- 패널 하단 경계를 **드래그**해 높이 조절. 헤더의 `▾` 로 접기/펼치기.
- 컬럼 사이 **세로 스플리터**를 드래그해 좌/중/우 폭 조절.
- 변경은 **탭별로 localStorage 에 자동 저장**된다(`bft.layout.<탭>`).
- 초기화: ⚙ 설정 → "레이아웃 초기화".

탭(시장/모니터/차트/뉴스/포트폴리오/옵션/주문/AI)은 클릭 시 실제로 화면이 전환되며 각자 패널 구성을 가진다. 상단 **명령창**에서 `go portfolio`, `NVDA`(차트), `add TSLA`, `buy NVDA 10`, `help` 등을 입력할 수 있다.

---

## 주문 / 거래 안전

- **기본 모드: PAPER(모의)**. 모든 주문은 로컬 모의 계좌(기본 현금 $100,000)에서 체결되며 실제 자금이 움직이지 않는다.
- 상단·티켓에 **PAPER 모의 / LIVE 실거래** 배지가 항상 표시된다(LIVE 는 붉은 점멸).
- **실거래**는 ⚙ 설정에서 모드를 LIVE 로 바꾸고 브로커를 연동해야만 가능하다. v1 에서는 브로커 어댑터 연결 전까지 실주문을 코드 레벨에서 차단한다(실수 방지).
- 모의/실거래가 **절대 혼동되지 않도록** UI 배지·경고 문구로 분리.

---

## 가짜 데이터 vs 실제 데이터 정책 (요약)

- 표시되는 모든 숫자는 실제 제공자에서 온 값이다. 못 구하면 **비워두고** 상태 배지로 이유를 밝힌다(`지연`/`데이터 없음`/`API 필요`/`오류`).
- 지연 데이터는 `지연` + 마지막 갱신 시각으로 표시.
- 데모용 임의값·랜덤 시세를 만들지 않는다.

---

## 파일 구조

```
trading/
├── index.html         ← 터미널 셸 (상단바·지수 스트립·탭·워크스페이스)
├── config.js          ← 데이터 경로·지수·기본 관심종목 (비밀 없음)
├── styles.css         ← 다크 고밀도 터미널 스타일
├── app.js             ← DataService·차트엔진·패널/드래그/리사이즈·포트폴리오·Paper·AI·뉴스·커맨드
├── README.md          ← (이 문서)
├── .env.example       ← 환경변수 예시
├── Dockerfile         ← 단독 컨테이너 (정적+프록시)
├── docker-compose.yml
└── server/
    ├── server.js      ← Node 내장 모듈만으로 정적 서빙 + Yahoo 프록시 (의존성 0)
    └── package.json

supabase/functions/market-data/   ← 프로덕션(Cloudflare+Supabase) 시세 프록시 Edge Function
```

## 알려진 한계 (v1)

- 시세는 Yahoo 기준 ~15분 지연. 무지연은 유료 제공자 연동 필요.
- 옵션 체인·미국 원문 뉴스/번역·SEC/DART 는 키 연동 전까지 `API 필요` 상태(가짜로 안 채움).
- 실브로커 주문은 어댑터 구현 후 활성화(기본 Paper).
- 개인화는 기본 localStorage(기기 한정). 서버 동기화는 위 "로그인/보안 설계" 경로로 확장.
