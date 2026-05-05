-- ═══════════════════════════════════════════════════
-- stock-prices Edge Function 주기 갱신 (15분)
--
-- 매 15분 stock-prices 함수를 호출 → Yahoo fetch → Storage `prices/latest.json` 갱신
-- 함수는 --no-verify-jwt로 배포돼 인증 헤더 불필요
-- 프론트는 Storage public URL을 직접 fetch (Edge Function 거치지 않음)
-- ═══════════════════════════════════════════════════

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

-- 기존 등록 정리
do $$
begin
  if exists (select 1 from cron.job where jobname = 'stock-prices-refresh') then
    perform cron.unschedule('stock-prices-refresh');
  end if;
end $$;

-- 매 15분 갱신 (UTC 균일)
select cron.schedule(
  'stock-prices-refresh',
  '*/15 * * * *',
  $CRON$
    select net.http_get(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/stock-prices',
      timeout_milliseconds := 60000
    );
  $CRON$
);

select jobname, schedule, active from cron.job where jobname = 'stock-prices-refresh';
