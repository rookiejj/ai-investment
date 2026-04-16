오늘 날짜 기준으로 시장·원자재 탭 최신 정보를 조사하고 `data/commodity-data.js`를 갱신해 커밋·푸시까지 완료해. 질문 없이 끝까지 진행 — 모든 판단은 에이전트가 내린다.

**파이프라인**:

1. **조사** — CLAUDE.md의 "시장·원자재 업데이트 체크리스트" 준수. 6 카테고리 × 4 항목 (총 24) 최신 시장 지표·선물 가격·매크로 지표 확인. 중앙은행 정책·지정학·공급 충격 광역 스캔.

2. **판단** — 현재 `data/commodity-data.js`와 비교, 의미 있는 가격 변동(원자재 ±5% 이상, 금리·DXY 10bp/1% 이상)은 반영. 카테고리당 정확히 4개 유지 (시장·원자재는 7 확장 안 함). 시장 지표 카테고리가 첫 번째, 원자재가 뒤.

3. **편집** — `data/commodity-data.js` 최소 diff 수정. 가격·YTD·1Y·52주 범위 현행화.

4. **이력** — `data/commodity-update.js` 맨 앞에 엔트리 prepend.
   - date: `TZ=Asia/Seoul date +"%Y-%m-%d %H:%M KST"`
   - 사용자향 자연어 문체 (내부 필드명 금지)
   - 동일 날짜 누적 원칙

5. **버전** — `data/version.js`를 `TZ=Asia/Seoul date +"%Y%m%d-%H%M"`로 갱신.

6. **커밋·푸시** — `git add data/commodity-data.js data/commodity-update.js data/version.js` → `git commit -m "데이터 자동 갱신 YYYY-MM-DD"` → `git push origin main`.

**변경할 항목 없으면**: 커밋하지 말고 "변경 없음"만 보고 종료.

**보고 포맷**: 변경 요약 3~5줄 + 커밋 해시.
