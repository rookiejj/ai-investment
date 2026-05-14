-- archive 30일 cutoff 함수 폐기. DB 저장이라 무한 누적 OK, 성능 영향 무시할 수준
-- (1년 후도 ~수천 row, query에 영향 없음).
-- main 5건 한도 트리거 rotate_tab_updates_main은 유지 — 화면 노출 영역 한도 그대로.
drop function if exists public.trim_tab_updates_archive(integer);
