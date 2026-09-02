-- ═══════════════════════════════════════════════════
-- 친구톡 발송 cron 스케줄 (Vault + Cron Secret 기반)
--
-- Supabase 신형 API 키(sb_*) 체계 이후, Edge Function은 --no-verify-jwt로
-- 배포되고 daily-send 함수가 X-Cron-Secret 헤더를 자체 검증합니다.
--
-- ⚠ 2026-05-16 사고 후 정정:
--   cron 명령에서 vault.decrypted_secrets 서브쿼리를 동적으로 평가하면
--   pg_cron worker 컨텍스트에서 silently fail (cron.job_run_details는 succeeded인데
--   net._http_response·함수 로그 0건). 본인 1명 발송 테스트로 평문 substitution이
--   fix임을 확정. STEP 2의 cron 등록은 DO block 안에서 Vault 값을 한 번 꺼내
--   `format(... %L ...)`로 평문 박는 방식으로 변경.
--
-- 사용 순서:
--   STEP 1 : <CRON_SECRET> 자리에 실제 값 붙여넣고 실행 (최초/교체 시)
--   STEP 2 : 아래 cron 등록 DO block 실행 (Vault 값을 등록 시점에 평문 substitution)
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
--     운영 모드  : '0 23 * * *'        (UTC) = KST 매일 08:00 1회 (일요일 포함)
--     ※ KST 08:00 = UTC 23:00(전날)이므로 UTC dow 0~6 전체 = KST 월~일
--     ※ 일요일(KST)에 해당하는 UTC dow=6(토)도 포함
-- ───────────────────────────────────────────────
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

-- DO block: 등록 시점에 Vault에서 secret을 1회 꺼내 cron 명령에 평문 substitution.
-- cron 실행 시점엔 vault 접근 없이 박힌 값으로 호출 → pg_cron worker 컨텍스트의
-- vault 동적 평가 fail 우회. cron.job 테이블은 supabase_admin/postgres만 접근 가능.
do $$
declare
  v_secret text;
  v_cmd    text;
begin
  select decrypted_secret into v_secret
  from vault.decrypted_secrets where name = 'cron_secret';

  if v_secret is null then
    raise exception 'cron_secret not found in vault — run STEP 1 first';
  end if;

  v_cmd := format($SQL$
    select net.http_post(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/daily-send',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'X-Cron-Secret', %L
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 30000
    );
  $SQL$, v_secret);

  if exists (select 1 from cron.job where jobname = 'daily-friendtalk-send') then
    perform cron.unschedule('daily-friendtalk-send');
  end if;

  perform cron.schedule(
    'daily-friendtalk-send',
    '0 23 * * *',  -- UTC 기준 = KST 매일 08:00 1회 (일요일 포함)
    v_cmd
  );
end $$;

select jobname, schedule, active from cron.job where jobname = 'daily-friendtalk-send';

-- 필요 시 기존 service_role_key Vault 항목 정리
-- select vault.secrets where name = 'service_role_key';
-- select vault.drop_secret((select id from vault.secrets where name = 'service_role_key'));
