#!/bin/bash
# 트레이더 은어·편집자 메타 표현 잔재 lint
# 사용: ./scripts/lint-jargon.sh
# 0건이면 통과, 1건 이상이면 라인을 출력하고 exit 1.
#
# 데이터 갱신 커밋 직전에 반드시 실행. CI/Husky 훅에 걸어도 OK.

cd "$(dirname "$0")/.."

PATTERNS='비트|미스|인라인|rs 갱신|rs 및|rs 맥락|실적 반영|수치 반영|갱신 반영|데이터 반영|rs 반영|도브 톤|매파 톤|약세 톤|회복 톤|디에스컬레이션 톤|거부 톤'
EXCLUDE='비트코인|비트맥스|비트파|온프레미스|프리미스|미스트랄|메가트론|선반영|priced in'

HITS=$(grep -nE "$PATTERNS" data/*.js 2>/dev/null | grep -vE "$EXCLUDE")

if [ -z "$HITS" ]; then
  echo "✓ jargon lint: 0건"
  exit 0
fi

echo "✗ jargon lint: 다음 표현을 자연어로 바꾸세요"
echo ""
echo "$HITS"
echo ""
echo "치환 가이드: 비트→컨센 상회, 미스→컨센 하회, 인라인→컨센 부합,"
echo "  도브 톤→완화 기조, 약세 톤→약세 흐름, em-dash —→hyphen -"
exit 1
