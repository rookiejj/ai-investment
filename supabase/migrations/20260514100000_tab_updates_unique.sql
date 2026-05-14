-- tab_updates의 source_hash dedup 인덱스를 일반 unique constraint로 변경.
-- 이유: partial index(WHERE source_hash IS NOT NULL)는 PostgREST `on_conflict`
-- 매개변수가 매칭 못 함 (PostgreSQL 42P10). source_hash는 import·sandbox 모두에서
-- 항상 채워지므로 NOT NULL + 일반 unique constraint가 안전·깔끔.

-- 이전 partial index 제거
drop index if exists public.tab_updates_hash_idx;

-- source_hash NOT NULL 강제 (기존 데이터엔 영향 없음 — tab_updates 비어있음 가정)
alter table public.tab_updates
  alter column source_hash set not null;

-- 일반 unique constraint로 대체
alter table public.tab_updates
  add constraint tab_updates_hash_uniq unique (tab_id, source_hash);
