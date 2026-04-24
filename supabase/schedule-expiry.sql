-- ═══════════════════════════════════════════════════
-- 만료 임박 알림톡 cron 스케줄 (D-1, KST 20:00)
--
-- 매일 KST 20:00(= UTC 11:00)에 expiry-notice Edge Function 호출.
-- 함수는 '내일(KST 기준)' 만료 예정 active 구독자에게 알림톡 발송.
--
-- 사전 요구:
--   · vault.secrets 에 cron_secret 이미 저장돼 있을 것 (schedule.sql 참고)
--   · expiry-notice 함수가 --no-verify-jwt 로 배포돼 있을 것
--   · supabase secrets 에 ALIMTALK_EXPIRY_TEMPLATE_ID 설정 (미설정 시 발송 스킵)
-- ═══════════════════════════════════════════════════

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'daily-expiry-notice') then
    perform cron.unschedule('daily-expiry-notice');
  end if;
end $$;

select cron.schedule(
  'daily-expiry-notice',
  '0 12 * * *',  -- UTC 12:00 = KST 21:00 (테스트 중, 운영 시 11:00 UTC = 20:00 KST로 복귀)
  $CRON$
    select net.http_post(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/expiry-notice',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'X-Cron-Secret', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'cron_secret'
        )
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 30000
    );
  $CRON$
);

select jobname, schedule, active from cron.job where jobname = 'daily-expiry-notice';
