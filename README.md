# 📊 Investment Hub

`us-stocks-atlas`와 `ai-players` 두 프로젝트를 하나의 페이지에서 탭으로 전환해 볼 수 있는 허브입니다.

## 구조

```
hub/                    ← 이 레포 (index.html 하나만 있음)
   └── index.html

us-stocks-atlas/        ← 독립 레포 (기존 그대로)
   └── data.js

ai-players/             ← 독립 레포 (기존 그대로)
   └── data.js
```

허브는 접속할 때마다 두 레포의 `data.js`를 **직접 fetch**해서 최신 데이터를 보여줍니다. 데이터 복사 동기화 필요 없음.

## 사용 방법

배포된 페이지 열기:

```
https://<사용자명>.github.io/hub/
```

- 상단 탭으로 **US Stocks** / **AI Players** 전환
- 검색창: 티커 · 기업명 · 제품명 · 설명 전체 부분일치
- 필터칩: 탭별 카테고리(섹터 / 배지)로 필터링

## 업데이트 워크플로우

| 바꿀 것 | 어느 레포 수정? |
|---|---|
| 주식 종목·숫자 | `us-stocks-atlas/data.js` |
| AI 기업·제품 | `ai-players/data.js` |
| 탭/검색/레이아웃 | `hub/index.html` |

각 데이터 레포는 기존 방식대로 독립적으로 업데이트하면 되고, 허브는 저장 후 새로고침만 하면 최신 상태가 반영됩니다.

## 설치 (새 환경에서 다시 세팅할 때)

1. `index.html` 맨 위 두 줄의 URL을 본인 GitHub Pages 주소로 수정
   ```js
   const STOCKS_URL = 'https://<사용자명>.github.io/us-stocks-atlas/data.js';
   const AI_URL     = 'https://<사용자명>.github.io/ai-players/data.js';
   ```
2. 이 레포를 GitHub에 푸시
3. Settings → Pages → Source를 `main` 브랜치로 설정
4. 1~2분 후 `https://<사용자명>.github.io/hub/` 접속

## 데이터 스키마

### `us-stocks-atlas/data.js`
```js
const data = [
  {
    title: "🤖 AI 플랫폼",
    tag: "모델·엔터프라이즈 SW",
    stocks: [
      { tk, nm, rs, r25, p25, r26, p26 },
      ...
    ]
  },
  ...
];
```

### `ai-players/data.js`
```js
const META = { year, month, date, badge };
const BL   = { llm, img, vid, agt, hw, code, sci, ui };  // 배지 라벨
const data = [
  {
    rank, name, url, type, focus,
    products: [
      { name, url, isNew, badges: [...], desc },
      ...
    ]
  },
  ...
];
```

허브는 두 구조를 내부적으로 공통 포맷으로 정규화한 뒤 같은 렌더러로 표시합니다.

## 기술 메모

- 순수 정적 HTML 파일 1개 (빌드 도구·프레임워크 없음)
- 두 `data.js`를 `fetch` → `new Function()`으로 격리 실행해 전역 오염 없이 로드
- 초기 로드 시 두 파일 `Promise.all` 병렬 요청, 이후 탭 전환은 메모리에서 즉시
- GitHub Pages의 CORS가 기본 허용이라 크로스 레포 fetch가 그대로 동작

## 라이선스

개인용.