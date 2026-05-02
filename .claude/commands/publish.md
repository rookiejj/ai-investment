⚠️ **수동 인스타그램 발행 명령 — 의도된 즉시 발행만 사용**

GitHub Actions의 `Instagram Carousel Post` 워크플로우를 `workflow_dispatch`로 즉시 트리거한다. 데이터는 **현재 main 브랜치 최신 상태** 그대로 발행된다 (별도 갱신·커밋 없음).

## 인자

`$ARGUMENTS`에서 두 종류의 인자를 자유 순서로 받는다 — 둘 다 생략 가능.

**모드 인자** (어떤 미디어를 발행할지):
- 생략 또는 `all` → 캐러셀 + Reels 둘 다 발행
- `carousel` → 캐러셀만
- `reels` → Reels만

**dry-run 인자**:
- 생략 → 실제 발행 (`dry_run=false`)
- `dry` → 연습 모드 (`dry_run=true`) — 슬라이드·mp4 아티팩트만 만들고 IG 게시 안 함

**사용 예시**:
- `/publish` — 캐러셀+Reels 둘 다 실제 발행
- `/publish reels` — Reels만 실제 발행
- `/publish carousel` — 캐러셀만 실제 발행
- `/publish dry` — 둘 다 dry-run
- `/publish reels dry` — Reels만 dry-run
- `/publish all dry` — 둘 다 dry-run (`all`은 default라 명시 안 해도 같음)

## 동작

1. 현재 디렉토리가 git 저장소인지 확인.
2. `$ARGUMENTS`를 파싱해서 mode·dry_run 인자 추출:
   - 토큰 중 `dry`가 있으면 `dry_run=true`, 없으면 `dry_run=false`
   - 토큰 중 `carousel`/`reels`/`all` 있으면 그 mode, 없으면 `mode=all`
3. `gh workflow run instagram-post.yml -f mode=<m> -f dry_run=<d>` 호출.
4. 트리거 직후 `gh run list --workflow=instagram-post.yml --limit=1`로 실행 중인 run 확인 → run URL을 사용자에게 알려준다.
5. 사용자가 진행 상황을 보고 싶을 때 별도 명령(`gh run watch <id>` 또는 Actions UI 링크)을 안내.

## 보고 포맷

3~4줄 요약:
- 발행 모드(all/carousel/reels) + dry-run 여부
- 트리거된 run URL
- 데이터 상태(현재 main 브랜치 최신 commit hash·메시지)

## 주의

- **자동 트리거에서 호출 금지** — 사람이 직접 슬래시 명령으로 입력했을 때만.
- 발행은 비동기로 진행되며 캐러셀+Reels 둘 다일 경우 ~10~15분, Reels만일 경우 ~5~10분 소요. 이 명령은 트리거만 하고 종료.
- 같은 시점에 자동 트리거(07:00·19:00 KST)가 발행 중이면 `concurrency: instagram-post` 그룹 락에 의해 큐잉됨.
- workflow_dispatch는 **현재 main 브랜치의 최신 데이터**로 발행하므로, 발행 직전에 데이터 변경 push가 있었다면 그 변경분이 반영됨.
- 자동 트리거(push 기반)는 인자 받을 수 없어 항상 `mode=all`로 둘 다 발행.
