-- ═══════════════════════════════════════════════════
-- stock-prices Edge Function 주기 갱신 (5분)
--
-- 매 5분 stock-prices 함수 호출 → Yahoo fetch → Storage `prices/latest.json` 갱신
-- 장 시작 직후 "어제 종가" 표시 갭을 최대 5분 이내로 좁힘
--
-- 비용: 8,640회/월 Edge Function (무료 500k 중 1.7%), Yahoo는 인증 없는 v8/chart라 무제한
-- 함수는 --no-verify-jwt로 배포돼 인증 헤더 불필요
-- 프론트는 Storage public URL을 직접 fetch (Edge Function 거치지 않음)
-- ═══════════════════════════════════════════════════

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

-- 기존 등록 정리 (이전 15분 단일 작업 + burst 변형 모두)
do $$
begin
  if exists (select 1 from cron.job where jobname = 'stock-prices-refresh') then
    perform cron.unschedule('stock-prices-refresh');
  end if;
  if exists (select 1 from cron.job where jobname = 'stock-prices-refresh-kr-burst') then
    perform cron.unschedule('stock-prices-refresh-kr-burst');
  end if;
  if exists (select 1 from cron.job where jobname = 'stock-prices-refresh-us-burst') then
    perform cron.unschedule('stock-prices-refresh-us-burst');
  end if;
end $$;

-- 매 5분 갱신 (UTC 균일, 시간대·요일 분기 없음)
select cron.schedule(
  'stock-prices-refresh',
  '*/5 * * * *',
  $CRON$
    select net.http_get(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/stock-prices',
      timeout_milliseconds := 60000
    );
  $CRON$
);

select jobname, schedule, active from cron.job where jobname = 'stock-prices-refresh';
