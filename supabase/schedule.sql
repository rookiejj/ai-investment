-- ═══════════════════════════════════════════════════
-- 매일 오전 8시(KST) 친구톡 발송 스케줄 (Vault 기반)
--
-- 사용 순서:
--   STEP 1 : 아래 Vault 블록의 <SERVICE_ROLE_KEY> 자리에 실제 키 붙여넣고 실행
--            (Dashboard > Project Settings > API > service_role)
--            한 번만 수행하면 이후엔 평문 키를 SQL에 쓰지 않아도 됨.
--   STEP 2 : 그 아래 cron 등록 블록 실행.
--
-- 키 교체 시: vault.update_secret() 만 다시 실행, cron은 손댈 필요 없음.
-- ═══════════════════════════════════════════════════

-- ───────────────────────────────────────────────
-- STEP 1 : Vault에 service_role key 저장 (최초 1회)
-- ───────────────────────────────────────────────
create extension if not exists supabase_vault;

-- 이미 있다면 덮어쓰기
do $$
begin
  if exists (select 1 from vault.secrets where name = 'service_role_key') then
    perform vault.update_secret(
      (select id from vault.secrets where name = 'service_role_key'),
      '<SERVICE_ROLE_KEY>'
    );
  else
    perform vault.create_secret(
      '<SERVICE_ROLE_KEY>',
      'service_role_key',
      'pg_cron Edge Function 호출용'
    );
  end if;
end $$;

-- 확인
select name, description, created_at, updated_at from vault.secrets where name = 'service_role_key';


-- ───────────────────────────────────────────────
-- STEP 2 : 매일 KST 08:00 발송 cron 등록
-- ───────────────────────────────────────────────
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'daily-friendtalk-send') then
    perform cron.unschedule('daily-friendtalk-send');
  end if;
end $$;

-- ⚠ 테스트 모드 : KST 08:00 ~ 24:00 매시 정각 (하루 17회)
--   원래 운영 스케줄로 돌릴 때는 '0 23 * * *' 로 교체
--   UTC 23:00 = KST 08:00, UTC 00~15:00 = KST 09~24:00
select cron.schedule(
  'daily-friendtalk-send',
  '0 0-15,23 * * *',
  $CRON$
    select net.http_post(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/daily-send',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'service_role_key'
        )
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 30000
    );
  $CRON$
);

-- 등록 확인
select jobname, schedule, active from cron.job where jobname = 'daily-friendtalk-send';
