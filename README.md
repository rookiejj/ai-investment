# 브리핑

미국 주식 + AI 기업 데이터를 탭으로 전환해 볼 수 있는 통합 대시보드.

## 구조

```
ai-investment/
├── index.html              ← 통합 UI
├── CLAUDE.md               ← 유지보수 컨텍스트
├── data/
│   ├── stocks-data.js      ← 미국 주식 (18 카테고리 × 6종목)
│   ├── stocks-update.js    ← 주식 변경 이력
│   ├── ai-data.js          ← AI 기업 (10사 + 제품)
│   └── ai-update.js        ← AI 변경 이력
└── README.md
```

## 사용 방법

- 상단 탭: **미국 주식** / **AI 기업** 전환
- 검색: 티커 · 기업명 · 제품명 · 설명 부분일치
- 필터: 탭별 카테고리(섹터 / 배지) 필터링

## 업데이트 워크플로우

| 바꿀 것 | 수정 파일 |
|---|---|
| 주식 종목·수치 | `data/stocks-data.js` + `data/stocks-update.js` |
| AI 기업·제품 | `data/ai-data.js` + `data/ai-update.js` |
| UI·레이아웃 | `index.html` |

상세 편집 규칙은 `CLAUDE.md` 참조.

## 배포

1. GitHub에 푸시
2. Settings → Pages → Source: `main` 브랜치
3. `https://<사용자명>.github.io/ai-investment/` 접속

## 기술 메모

- 순수 정적 HTML 1개 (빌드 도구·프레임워크 없음)
- `data/*.js`를 `fetch` → `new Function()`으로 격리 실행해 전역 오염 없이 로드
- 초기 로드 시 4파일 `Promise.all` 병렬 요청, 이후 탭 전환은 메모리에서 즉시

## Changelog

- 2026-04-13: 허브 → 통합 레포 전환. 외부 fetch → 로컬 `data/` 폴더 참조. CLAUDE.md 합본.

## 라이선스

개인용.
