-- tab_updates_main 뷰 제거 (2026-06-01).
--
-- 이 뷰는 20260514093000_tab_data.sql 에서 "클라이언트가 PostgREST 로 select" 용도로
-- 만들었으나, 실제 read 경로(read-tab-data Edge Function)는 tab_updates 테이블을 직접
-- 쿼리한다. 코드 어디서도 이 뷰를 읽지 않는 죽은 객체.
--
-- Supabase Advisor 가 CRITICAL(Security Definer View)로 플래그: Postgres 뷰는 기본적으로
-- 소유자(postgres) 권한으로 실행돼 하위 테이블 RLS 를 우회. tab_updates 는 어차피
-- "anon read using(true)" 로 공개라 실제 노출 위험은 없지만, 안 쓰는 뷰이므로 drop 해
-- 경고를 제거하고 dead 인프라를 정리한다.
--
-- 만약 향후 PostgREST 로 main 5건을 직접 select 할 일이 생기면, security_invoker=true 로
-- 새로 만들 것 (RLS 우회 방지).

drop view if exists public.tab_updates_main;
