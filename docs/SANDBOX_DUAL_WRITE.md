# RemoteTrigger Sandbox 듀얼 라이팅 명세 (Phase 1)

자동 갱신 sandbox가 기존 GitHub `push_files`(정적 *-data.js / *-update.js 파일)에 더해 **Supabase DB에도 동시 쓰기**하는 단계. 사고 시 한쪽이 죽어도 다른 쪽이 살아 있게 — 데이터 정합성·가시성 동시 확보.

## 변경 의도

| 사고 패턴 | 정적 파일 path | DB path |
|---|---|---|
| sha 충돌·partial commit (2026-05-14) | 일부 탭만 push, 나머지 stuck | 영향 없음 (개별 INSERT) |
| CF Pages 비결정적 500 (2026-05-13) | 빌드 success인데 서빙 500 | 영향 없음 (REST 직접) |
| Apt timeout·sandbox session 한도 | 어디든 죽으면 silent | failure 시 telegram 알림 |

Phase 1은 듀얼 라이팅 — 파일·DB가 동일 진실원본. Phase 2부터 클라이언트가 DB read로 옮기고, Phase 4에 파일 폐기.

## sandbox 환경 변수 (RemoteTrigger 측 박기)

```
BRIEFICK_WRITE_SECRET = <Supabase secret과 동일 값>
SUPABASE_URL = https://ytvcgoldauysvnqckzze.supabase.co
```

`BRIEFICK_WRITE_SECRET`는 Supabase Edge Function에 박혀있는 값과 같아야 401 회피. Sandbox prompt를 외부 공유한다면 secret을 prompt 평문에 박지 말고 sandbox env로 주입.

## 호출 패턴 — 각 탭 갱신 직후 2회 호출

### 1. tab_data UPSERT (종목·핀맵 payload)

```http
POST https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/write-tab-data
X-Briefick-Secret: <BRIEFICK_WRITE_SECRET>
Content-Type: application/json

{
  "tab_id": "kr",
  "payload": {
    "data": [ ... 기존 *-data.js의 data 변수 ... ]
    // ai탭만 META, BL도 같이:
    // "META": {...}, "BL": {...}
  },
  "version": "20260514-1900"
}
```

응답: `{"ok":true,"tab_id":"kr","updated_at":"..."}`

### 2. tab_updates INSERT (새 entry)

```http
POST https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/write-tab-update
X-Briefick-Secret: <BRIEFICK_WRITE_SECRET>
Content-Type: application/json

{
  "tab_id": "kr",
  "entry": {
    "date": "2026-05-14 19:10 KST",
    "summary": "줄바꿈 다중 문장...",
    "changes": [
      { "type": "...", "sector": "...", "detail": "...", "time": "..." }
    ]
  }
}
```

ai탭은 `entry.summary`·`entry.changes` 대신 entries 배열 형식 그대로:
```json
{
  "tab_id": "ai",
  "entry": {
    "date": "2026-05-14 19:10 KST",
    "entries": [
      { "text": "...", "time": "2026-05-14 19:10 KST" }
    ]
  }
}
```

응답:
- 신규 INSERT: `{"ok":true,"id":12345,"deduped":false,"source_hash":"..."}`
- 같은 hash 두 번째 호출: `{"ok":true,"deduped":true,"source_hash":"..."}` (멱등)

## 흐름 (탭마다 반복)

1. 데이터 조사 → `*-data.js`·`*-update.js` 파일 갱신
2. 트림·lint (기존 `scripts/trim-update-logs.js`·`scripts/lint-jargon.sh`)
3. **(추가) `write-tab-data` 호출** — payload·version 박아 UPSERT
4. **(추가) `write-tab-update` 호출** — 새 entry insert (멱등이라 재시도 안전)
5. GitHub `push_files` 기존대로 파일 push

3·4단계 실패해도 5단계 파일 push 계속. 둘 다 best effort, 한쪽 실패는 다른 쪽 fallback.

## 에러 처리

| 응답 | 의미 | sandbox 처리 |
|---|---|---|
| 200 + ok:true | 성공 | 다음 단계 |
| 200 + deduped:true | 이미 들어간 entry | 정상, 다음 단계 |
| 401 Unauthorized | X-Briefick-Secret 불일치 | sandbox env 점검 후 retry 1회. 또 401이면 skip + telegram |
| 400 invalid tab_id·payload | sandbox 측 잘못 | skip, 다음 탭으로 |
| 502 fetch failed | Supabase 일시 장애 | 5초 후 1회 retry. 또 fail이면 skip |
| timeout | 네트워크 | 1회 retry, 또 fail이면 skip |

skip은 **파일 push까지 막지 않는다** — DB는 다음 cron에서 다시 시도 가능 (멱등).

## 마커 commit과 동시 진행

기존 `data/.cartoon-marker` push는 그대로 — 카툰·인스타 발행 트리거. DB 쓰기와 무관하게 카툰 발행은 파일 push 시점에 발화. Phase 3에서 카툰·인스타 워크플로도 DB read로 옮길 예정 (그때 마커 폐기 가능성 검토).

## archive 자동 회전

`tab_updates`에 트리거 `rotate_tab_updates_main`이 박혀있어, 각 탭 main이 5건 초과하면 가장 오래된 entry를 `is_archive=true`로 자동 flag. 별도 호출 불필요. archive 30일 cutoff는 `select trim_tab_updates_archive(30);` 함수로 cron에서 호출 (Phase 3에서 archive-rotate.yml 갈음 가능).

## 검증

각 호출 후 응답 JSON `ok` 필드만 확인. 응답 본문 전체 log 남기지 말 것 — 응답에 source_hash·id 외엔 민감 정보 없지만 노이즈.

sandbox 종료 직전 telegram 알림에 "DB write 성공 5/5" 또는 "3/5 — kr·stocks 실패" 정도 요약 한 줄 첨부 권장.
