-- ═══════════════════════════════════════════════════
-- 매일 오전 8시(KST) 친구톡 발송 스케줄
--
-- 사용법: Supabase 대시보드 > SQL Editor에 붙여넣고
-- 아래 두 플레이스홀더를 실제 값으로 바꾸어 실행.
--   <EDGE_FUNCTION_URL>  : 예) https://xxxxxxxx.supabase.co/functions/v1/daily-send
--   <SERVICE_ROLE_KEY>   : Settings > API > service_role key
--
-- 재등록 시에는 cron.unschedule 부분이 기존 job을 제거해 줌.
-- ═══════════════════════════════════════════════════

create extension if not exists pg_cron   with schema extensions;
create extension if not exists pg_net    with schema extensions;

-- 기존 잡 제거 (있으면)
do $$
begin
  if exists (select 1 from cron.job where jobname = 'daily-friendtalk-send') then
    perform cron.unschedule('daily-friendtalk-send');
  end if;
end $$;

-- 매일 UTC 23:00 = KST 08:00
select cron.schedule(
  'daily-friendtalk-send',
  '0 23 * * *',
  $CRON$
    select net.http_post(
      url := '<EDGE_FUNCTION_URL>',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 30000
    );
  $CRON$
);

-- 등록 확인
select jobname, schedule, active from cron.job where jobname = 'daily-friendtalk-send';
