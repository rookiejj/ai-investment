오늘 날짜 기준으로 글로벌 ETF 탭 최신 정보를 조사하고 `data/etf-data.js`를 갱신해 커밋·푸시까지 완료해. 질문 없이 끝까지 진행 — 모든 판단은 에이전트가 내린다.

**파이프라인**:

1. **조사** — CLAUDE.md의 "글로벌 ETF 업데이트 체크리스트" 준수. 8 카테고리 × 7 ETF (총 56종)의 최신 AUM·YTD·1Y·보수 확인. 상장폐지·합병·신규 상장 등 구조 변화 광역 스캔.

2. **판단** — 현재 `data/etf-data.js`와 비교, 의미 있는 수치 변동(AUM ±15% 이상, 수익률 10%p 이상)·상장폐지·합병은 반영. 카테고리당 정확히 7개 유지.

3. **편집** — `data/etf-data.js` 최소 diff 수정. rs 12단어 이내, 운용사·테마 대표성 강조.

4. **이력** — `data/etf-update.js` 맨 앞에 엔트리 prepend.
   - date: `TZ=Asia/Seoul date +"%Y-%m-%d %H:%M KST"`
   - 사용자향 자연어 문체 (내부 필드명 금지)
   - 동일 날짜 누적 원칙

5. **버전** — `data/version.js`를 `TZ=Asia/Seoul date +"%Y%m%d-%H%M"`로 갱신.

6. **커밋·푸시** — `git add data/etf-data.js data/etf-update.js data/version.js` → `git commit -m "데이터 자동 갱신 YYYY-MM-DD"` → `git push origin main`.

**변경할 항목 없으면**: 커밋하지 말고 "변경 없음"만 보고 종료.

**보고 포맷**: 변경 요약 3~5줄 + 커밋 해시.
