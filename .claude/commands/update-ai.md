오늘 날짜 기준으로 AI 기업 탭 최신 정보를 조사하고 `data/ai-data.js`를 갱신해 커밋·푸시까지 완료해. 질문 없이 끝까지 진행 — 모든 판단은 에이전트가 내린다.

**파이프라인**:

1. **조사** — CLAUDE.md의 "AI 업데이트 체크리스트" 준수. 수록 10개 기업 개별 검색으로 최신 모델·제품·펀딩·인수·리더십 확인. 대형 오픈소스 릴리스·프런티어 모델 출시·생태계 변화 광역 스캔.

2. **판단** — 현재 `data/ai-data.js`와 비교, 새 모델·제품·주요 뉴스만 추가. 기존 NEW 배지들은 isNew:false로 내림(출시 4~6주 경과 기준). 새 항목은 isNew:true.

3. **편집** — `data/ai-data.js` 최소 diff 수정. desc는 기술 스펙 + 시장 맥락. 단순 스펙 나열 금지.
   - **관점**: CLAUDE.md [🆕 기관급 톤 가이드] 적용 — 매크로·밸류에이션·cross-asset·정책 중 사건 본질에 가장 맞는 *하나*의 렌즈를 자연 결합. ai는 특히 capability benchmark·CAPEX 트렌드·인프라 lock-in·monetization unit economics·모델 출시 cadence 자주 활용.

4. **이력** — `data/ai-update.js` 맨 앞에 엔트리 prepend (AI 탭 공통 스키마, changes[].time 포함).
   - date: `TZ=Asia/Seoul date +"%Y-%m-%d %H:%M KST"`
   - sector는 기업명(OpenAI·Anthropic·xAI 등)
   - type: 모델 출시·제품 출시·펀딩·인수·리더십·거버넌스·최근성 관리 등
   - 사용자향 자연어 문체
   - 동일 날짜 누적 원칙

5. **버전** — `data/version.js`를 `TZ=Asia/Seoul date +"%Y%m%d-%H%M"`로 갱신.

6. **커밋·푸시** — `git add data/ai-data.js data/ai-update.js data/version.js` → `git commit -m "데이터 자동 갱신 YYYY-MM-DD"` → `git push origin main`.

**변경할 항목 없으면**: 커밋하지 말고 "변경 없음"만 보고 종료.

**보고 포맷**: 변경 요약 3~5줄 + 커밋 해시.
