-- ═══════════════════════════════════════════════════
-- 친구톡 발송 cron 스케줄 (Vault + Cron Secret 기반)
--
-- Supabase 신형 API 키(sb_*) 체계 이후, Edge Function은 --no-verify-jwt로
-- 배포되고 daily-send 함수가 X-Cron-Secret 헤더를 자체 검증합니다.
--
-- 사용 순서:
--   STEP 1 : <CRON_SECRET> 자리에 실제 값 붙여넣고 실행 (최초/교체 시)
--   STEP 2 : 아래 cron 등록 블록 실행
-- ═══════════════════════════════════════════════════

-- ───────────────────────────────────────────────
-- STEP 1 : Vault에 cron secret 저장
-- ───────────────────────────────────────────────
create extension if not exists supabase_vault;

do $$
begin
  if exists (select 1 from vault.secrets where name = 'cron_secret') then
    perform vault.update_secret(
      (select id from vault.secrets where name = 'cron_secret'),
      '<CRON_SECRET>'
    );
  else
    perform vault.create_secret(
      '<CRON_SECRET>',
      'cron_secret',
      'pg_cron daily-send 호출용 webhook secret'
    );
  end if;
end $$;

select name, description, updated_at from vault.secrets where name = 'cron_secret';


-- ───────────────────────────────────────────────
-- STEP 2 : cron 등록
--   ⚠ 야간 광고 친구톡은 법적 금지(KST 21:00~08:00). 카카오가 차단.
--     테스트 모드 : '0 23,0-11 * * *' (UTC) = KST 08~20시 매시 정각
--     운영 모드  : '0 23 * * 0-4'     (UTC) = KST 평일(월~금) 08:00 1회
--     ※ KST 08:00 = UTC 23:00(전날)이므로 UTC dow는 일~목(0~4)이 평일에 해당
-- ───────────────────────────────────────────────
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'daily-friendtalk-send') then
    perform cron.unschedule('daily-friendtalk-send');
  end if;
end $$;

select cron.schedule(
  'daily-friendtalk-send',
  '0 23 * * 0-4',  -- UTC 기준 = KST 평일(월~금) 08:00 1회
  $CRON$
    select net.http_post(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/daily-send',
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

select jobname, schedule, active from cron.job where jobname = 'daily-friendtalk-send';

-- 필요 시 기존 service_role_key Vault 항목 정리
-- select vault.secrets where name = 'service_role_key';
-- select vault.drop_secret((select id from vault.secrets where name = 'service_role_key'));
