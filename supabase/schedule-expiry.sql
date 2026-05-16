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

-- ⚠ 2026-05-16: vault.decrypted_secrets 서브쿼리를 cron 실행 시점에 동적 평가하면
-- pg_cron worker 컨텍스트에서 silently fail (schedule.sql 헤더 주석 참조). DO block에서
-- 등록 시점에 Vault 값 1회 꺼내 평문 substitution.
do $$
declare
  v_secret text;
  v_cmd    text;
begin
  select decrypted_secret into v_secret
  from vault.decrypted_secrets where name = 'cron_secret';

  if v_secret is null then
    raise exception 'cron_secret not found in vault — run schedule.sql STEP 1 first';
  end if;

  v_cmd := format($SQL$
    select net.http_post(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/expiry-notice',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'X-Cron-Secret', %L
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 30000
    );
  $SQL$, v_secret);

  if exists (select 1 from cron.job where jobname = 'daily-expiry-notice') then
    perform cron.unschedule('daily-expiry-notice');
  end if;

  perform cron.schedule(
    'daily-expiry-notice',
    '0 11 * * *',  -- UTC 11:00 = KST 20:00
    v_cmd
  );
end $$;

select jobname, schedule, active from cron.job where jobname = 'daily-expiry-notice';
