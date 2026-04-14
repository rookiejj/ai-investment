# Top7

미국·한국·일본 주식 + AI 기업 + 글로벌 ETF + 원자재·매크로 + 유니콘을 7개 탭으로 보여주는 통합 투자 대시보드.

## 구조

```
ai-investment/
├── index.html                  ← 통합 UI (7개 탭)
├── CLAUDE.md                   ← 유지보수 컨텍스트·업데이트 지침
├── data/
│   ├── version.js              ← 데이터 버전 (탭 전환 시 자동 체크)
│   ├── stocks-data.js          ← 미국 주식 (18 카테고리 × 7종목 = 126)
│   ├── stocks-update.js        ← 미국 주식 변경 이력
│   ├── kr-stocks-data.js       ← 한국 주식 (18 × 7 = 126)
│   ├── kr-stocks-update.js     ← 한국 주식 변경 이력
│   ├── jp-stocks-data.js       ← 일본 주식 (10 × 7 = 70)
│   ├── jp-stocks-update.js     ← 일본 주식 변경 이력
│   ├── ai-data.js              ← AI 기업 (10사 + 제품)
│   ├── ai-update.js            ← AI 변경 이력
│   ├── etf-data.js             ← 글로벌 ETF (8 × 5 = 40)
│   ├── etf-update.js           ← ETF 변경 이력
│   ├── commodity-data.js       ← 원자재·매크로 (6 × 4 = 24)
│   ├── commodity-update.js     ← 원자재 변경 이력
│   ├── unicorn-data.js         ← 유니콘·프리IPO (6 × 5 = 30)
│   └── unicorn-update.js       ← 유니콘 변경 이력
└── README.md
```

총 481개 항목, 7개 탭.

## 기능

- **7개 탭**: 미국 마켓 · 한국 마켓 · 일본 마켓 · AI 기업 · 글로벌 ETF · 원자재·매크로 · 유니콘
- **검색**: 티커·기업명·제품명·설명 부분일치, X 버튼으로 초기화
- **필터**: 탭별 카테고리(섹터/배지) 토글
- **스와이프**: 모바일 좌우 스와이프로 탭 전환
- **자동 갱신**: 탭 전환·브라우저 복귀 시 `version.js` 체크, 변경되면 전체 데이터 리로드. 초기 로드도 버전 기반 캐시 방지.
- **최종 업데이트 표시**: 헤더에 DATA_VERSION 기반 최종 갱신 시간 표시
- **연도 자동 전환**: 매출/순익 라벨(FY25, FY26E)이 현재 연도 기준으로 동적 생성
- **단위 표시**: 미국($B), 한국(천억), 일본(¥천억) 숫자 옆에 직접 표시
- **탭 상태 유지**: sessionStorage로 마지막 탭·필터 저장, 새로고침 시 깜빡임 없이 복원
- **스케줄 자동 갱신**: 매일 오전 7시(KST) 원격 에이전트가 7개 탭 데이터를 웹검색·갱신·커밋·푸시

## 업데이트 워크플로우

| 바꿀 것 | 수정 파일 |
|---|---|
| 미국 주식 | `stocks-data.js` + `stocks-update.js` |
| 한국 주식 | `kr-stocks-data.js` + `kr-stocks-update.js` |
| 일본 주식 | `jp-stocks-data.js` + `jp-stocks-update.js` |
| AI 기업 | `ai-data.js` + `ai-update.js` |
| 글로벌 ETF | `etf-data.js` + `etf-update.js` |
| 원자재·매크로 | `commodity-data.js` + `commodity-update.js` |
| 유니콘 | `unicorn-data.js` + `unicorn-update.js` |
| UI·레이아웃 | `index.html` |

데이터 수정 후 반드시 `data/version.js`의 타임스탬프를 갱신해야 접속 중인 사용자에게 반영됨.

상세 편집 규칙은 `CLAUDE.md` 참조.

## 기술 메모

- 순수 정적 HTML 1개 (빌드 도구·프레임워크 없음)
- `data/*.js`를 `fetch` → `new Function()`으로 격리 실행해 전역 오염 없이 로드
- 초기 로드: `fetchVersion()` → 버전값을 캐시 방지 파라미터로 14개 파일 `Promise.all` 병렬 요청. 이후 탭 전환은 메모리에서 즉시
- `META_CFG` 객체로 탭별 숫자 패널 라벨·단위를 선언적으로 관리
- Google Analytics (G-MHK455J1GP) 연동

## Changelog

- 2026-04-14: 초기 로드 버전 기반 캐시 방지. 헤더 최종 업데이트 시간 표시. 탭 상태 복원 시 깜빡임 제거. 매일 7시 KST 자동 갱신 스케줄 설정.
- 2026-04-13: 4개 탭 추가(일본·ETF·원자재·유니콘), 총 7탭 481항목. 카테고리당 6→7종목. 단위 직접 표시. 검색 X버튼. 데이터 버전 자동 체크. 연도 동적 생성.
- 2026-04-13: 한국 마켓 탭 추가, 3탭 체제.
- 2026-04-13: 허브 → 통합 레포 전환. 외부 fetch → 로컬 `data/` 폴더 참조. CLAUDE.md 합본.

## 라이선스

개인용.
