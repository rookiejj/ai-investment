오늘 날짜 기준으로 유니콘 탭 최신 정보를 조사하고 `data/unicorn-data.js`를 갱신해 커밋·푸시까지 완료해. 질문 없이 끝까지 진행 — 모든 판단은 에이전트가 내린다.

**파이프라인**:

1. **조사** — CLAUDE.md의 "유니콘 업데이트 체크리스트" 준수. 6 카테고리 × 7 기업 (총 42) 최신 펀딩·밸류·IPO·인수 확인. 새로운 대형 유니콘·펀딩 라운드·IPO 파일링 광역 스캔.

2. **판단** — 상장·인수 완료된 기업은 **즉시 제외**하고 동일 카테고리 비상장 대표 기업으로 교체. 의미 있는 밸류 변동(±30% 이상)·신규 라운드는 반영. 카테고리당 정확히 7개 유지.

3. **편집** — `data/unicorn-data.js` 최소 diff 수정. val은 **확정된 마지막 라운드** 기준(협상 중 수치는 rs 본문에만 맥락으로).
   - **관점**: CLAUDE.md [🆕 기관급 톤 가이드] 적용 — 매크로·밸류에이션·cross-asset·정책 중 사건 본질에 가장 맞는 *하나*의 렌즈를 자연 결합. unicorn은 특히 라운드 normalization·M&A discount·IPO 윈도우 timing·후속 라운드 up/down·DPI(회수 배수) 자주 활용.

4. **이력** — `data/unicorn-update.js` 맨 앞에 엔트리 prepend.
   - date: `TZ=Asia/Seoul date +"%Y-%m-%d %H:%M KST"`
   - 제외·추가 사유는 detail에 자연어로 명시 (예: "제외: Circle(2025-06 NYSE 상장 완료). 추가: Alchemy(Web3 인프라 대표)")
   - 사용자향 자연어 문체
   - 동일 날짜 누적 원칙

5. **버전** — `data/version.js`를 `TZ=Asia/Seoul date +"%Y%m%d-%H%M"`로 갱신.

6. **커밋·푸시** — `git add data/unicorn-data.js data/unicorn-update.js data/version.js` → `git commit -m "데이터 자동 갱신 YYYY-MM-DD"` → `git push origin main`.

**변경할 항목 없으면**: 커밋하지 말고 "변경 없음"만 보고 종료.

**보고 포맷**: 변경 요약 3~5줄 + 커밋 해시.
