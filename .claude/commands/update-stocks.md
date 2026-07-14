오늘 날짜 기준으로 미국 주식 탭 최신 정보를 조사하고 `data/stocks-data.js`를 갱신해 커밋·푸시까지 완료해. 질문 없이 끝까지 진행 — 모든 판단은 에이전트가 내린다.

**파이프라인**:

1. **조사** — CLAUDE.md의 "미국 주식 업데이트 체크리스트"와 "변경 감지 방법론" 준수. 18개 카테고리 대표 상위 티커 개별 검색 + Q1/Q2 어닝·대형 M&A·회계이슈 섹터 광역 스캔.

2. **판단** — 현재 `data/stocks-data.js`와 비교, 편집 기준 부합 항목만 보수적 선정. 회계·거버넌스 이슈 기업은 즉시 제외·대체. 카테고리당 정확히 7개 유지.

3. **편집** — `data/stocks-data.js` 최소 diff 수정. rs 12단어 이내, 대형주는 정수·소형주는 소수점, 적자는 음수 표기.
   - **관점**: CLAUDE.md [🆕 기관급 톤 가이드] 적용 — 매크로·밸류에이션·cross-asset·정책 중 사건 본질에 가장 맞는 *하나*의 렌즈를 자연 결합. stocks는 특히 sector rotation·earnings revision·rates 민감도·forward P/E 자주 활용.

4. **이력** — `data/stocks-update.js` 맨 앞에 엔트리 prepend.
   - date: `TZ=Asia/Seoul date +"%Y-%m-%d %H:%M KST"`
   - 사용자향 자연어 문체 (내부 필드명·"rs 갱신"·"~반영" 금지)
   - 동일 날짜 누적 원칙 (덮어쓰기 금지)
   - 🔴 **현재가·등락률은 라이브 피드 대조 필수**: summary 첫 줄 대표 종목의 가격·등락률·방향(±)을 `prices/latest.json`과 대조(티커로 lookup)해 일치시킨다. 피드와 ±3% 이상 벌어지거나 부호가 반대면 피드 우선. 자세한 이유·명령은 CLAUDE.md [현재가·등락률은 라이브 피드와 대조] 참조.

5. **버전** — `data/version.js`를 `TZ=Asia/Seoul date +"%Y%m%d-%H%M"`로 갱신.

6. **커밋·푸시** — `git add data/stocks-data.js data/stocks-update.js data/version.js` → `git commit -m "데이터 자동 갱신 YYYY-MM-DD"` → `git push origin main`.

**변경할 항목 없으면**: 커밋하지 말고 "변경 없음"만 보고 종료.

**보고 포맷**: 변경 요약 3~5줄 + 커밋 해시.
