# 인스타그램 캐러셀 자동 게시 — 셋업 가이드

## 개요

- **트리거**: `main` 브랜치에 `data/*-update.js` 푸시 → 자동 실행 (단, `jp-stocks-update.js`만 변경 시 스킵)
- **흐름**: 5개 탭 최신 summary 파싱 → 1080×1350 PNG 7장(표지·5탭·CTA) → Supabase Storage 업로드 → Instagram Graph API 캐러셀 게시
- **수동 실행**: GitHub Actions의 `Instagram Carousel Post` 워크플로 → "Run workflow" 버튼. `dry_run=true`로 캡션·이미지만 점검 가능 (게시 X)
- **로컬 점검**:
  ```
  npm install
  npx playwright install chromium
  npm run ig:render        # 슬라이드 7장 → scripts/instagram/out/
  IG_DRY_RUN=1 npm run ig:publish   # 캡션 미리보기만
  ```

## 1. Supabase Storage 버킷 생성

대시보드(또는 SQL)에서 공개 버킷을 만든다.

**대시보드**: Storage → Create bucket → 이름 `instagram-carousel` → Public **체크** → Create.

**또는 SQL** (Supabase SQL Editor에서):
```sql
insert into storage.buckets (id, name, public)
values ('instagram-carousel', 'instagram-carousel', true)
on conflict (id) do update set public = true;
```

> 인스타 Graph API는 외부에서 접근 가능한 **공개 URL**을 요구한다. 비공개 버킷에 업로드하면 Graph API가 이미지를 가져오지 못해 실패한다.

## 2. GitHub Secrets 등록

리포 → Settings → Secrets and variables → Actions → New repository secret.

| 이름 | 값 | 비고 |
|---|---|---|
| `META_ACCESS_TOKEN` | Meta 앱 장기 액세스 토큰(60일) | 만료 전 갱신 필수 (아래 4번) |
| `IG_BUSINESS_USER_ID` | 인스타 비즈니스 계정 ID(숫자) | Graph API에서 페이지 → IG 계정 ID 조회로 확보 |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 프로젝트 URL |
| `BRIEFICK_SUPABASE_SECRET_KEY` | Supabase secret 키 (`sb_secret_...`) | Storage 업로드용. publishable 키 아님. `SUPABASE_` 접두사는 예약어라 사용 불가, 프로젝트 namespace 부여 |
| `UNSPLASH_ACCESS_KEY` | Unsplash API 액세스 키 | 슬라이드 BG 사진 검색·다운로드용. 미설정 시 다크 단색으로 폴백 |
| `IG_CAROUSEL_BUCKET` | `instagram-carousel` | (선택) 버킷 이름 다르면 등록 |

### Unsplash 키 발급 (5분)

1. https://unsplash.com/developers → **Register as a developer** (계정 가입)
2. **New Application** → 이용약관 동의 → 앱 정보 입력 (이름·설명만)
3. 생성된 앱 페이지 → **Access Key** 복사 → GitHub Secret `UNSPLASH_ACCESS_KEY`에 등록
4. **Demo 모드**: 50 req/hr, 5,000 req/month — 일 1회 발송엔 충분 (포스트당 12 호출 사용)
5. 트래픽 늘면 [Production approval](https://unsplash.com/documentation#production) 신청 → 5,000 req/hr로 상향

### 사진 매칭 동작

1. 각 탭의 첫 불릿에서 키워드 추출 (영문 티커·고유명사·한글 토큰)
2. 내장 키워드 매핑(`scripts/instagram/image-source.js`의 `KEYWORD_TO_QUERY`)으로 **사물·장소 쿼리**로 변환
3. Unsplash 검색 → `tags`에 person/people/face 등 들어간 결과 제거
4. 첫 통과 사진 다운로드 → 1080×1350 cover 크롭 → 슬라이드 BG로 인젝션
5. 매칭 실패 시 카테고리 디폴트(예: stocks → "wall street new york night")로 재시도
6. 모두 실패 시 다크 단색 폴백

## 3. Meta 앱 권한 체크리스트

장기 토큰을 발급받기 전에 앱에 다음 권한이 부여돼 있어야 한다:

- `instagram_basic`
- `instagram_content_publish`
- `pages_read_engagement`
- `pages_show_list`

연동 구조: **Facebook 페이지 ↔ Instagram 비즈니스/크리에이터 계정** 연결 + 그 페이지를 Meta 앱이 관리.

## 4. 토큰 만료 관리 (60일)

장기 토큰은 60일 만료. 만료 전 다음 명령으로 갱신 (앱 시크릿 필요):

```bash
curl -s "https://graph.facebook.com/v21.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=APP_ID" \
  -d "client_secret=APP_SECRET" \
  -d "fb_exchange_token=CURRENT_LONG_LIVED_TOKEN"
```

응답의 새 `access_token`을 GitHub Secrets `META_ACCESS_TOKEN`에 갱신.

> **권장 운영**: 캘린더에 50일 주기 알림 + 상기 명령을 주석 달아 보관. v2에서 자동 갱신 워크플로 추가 가능.

## 5. 렌더링 결과 디버깅

워크플로 실행 후 `instagram-slides` 아티팩트(7일 보관)에서 PNG 7장 + `meta.json`(캡션 빌더 입력) 다운로드 가능.

## 6. 슬라이드 구성

| # | 종류 | 내용 |
|---|---|---|
| 01 | 표지 | 날짜 · 헤드라인 "오늘의 시장 요약" · 5탭 핀들 |
| 02 | 미국 | 🇺🇸 stocks-update.js 최신 summary 줄 단위 |
| 03 | 한국 | 🇰🇷 kr-stocks-update.js |
| 04 | AI | 🤖 ai-update.js |
| 05 | 원자재 | 🛢️ commodity-update.js |
| 06 | 유니콘 | 🦄 unicorn-update.js |
| 07 | CTA | 도메인(briefick.com) · @briefick |

## 7. 캡션 구조

```
2026-04-30 (수) 브리픽 데일리
5개 시장 · 핵심 변화 23건

🇺🇸 미국 마켓 — <탭 1번 불릿>
🇰🇷 한국 마켓 — <탭 1번 불릿>
🤖 AI 기업 — <탭 1번 불릿>
🛢️ 원자재·크립토 — <탭 1번 불릿>
🦄 유니콘 — <탭 1번 불릿>

매일 아침 https://briefick.com
인스타 @briefick

#브리픽 #briefick ... (고정 + 가변 티커·키워드)
```

가변 해시태그: 5탭 summary 통합에서 영문 티커(예: NVDA, AAPL) + 한글 키워드(섹터·테마) 빈도 상위 추출.
