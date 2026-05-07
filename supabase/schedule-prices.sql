-- ═══════════════════════════════════════════════════
-- stock-prices Edge Function 주기 갱신
--
-- 시장 시간대별로 빈도 분기 (장 시작 직후 "어제 종가" 표시 갭 최소화):
--   - 한국 장중 (KST 09:00-15:59 = UTC 00:00-06:59, Mon-Fri): 5분
--   - 미국 장중 (ET 09:00-21:00 ≈ UTC 13:00-20:59, Mon-Fri): 5분
--   - 그 외 시간 (장외·주말·새벽): 15분
--
-- 함수는 --no-verify-jwt로 배포돼 인증 헤더 불필요
-- 프론트는 Storage public URL을 직접 fetch (Edge Function 거치지 않음)
-- ═══════════════════════════════════════════════════

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

-- 기존 등록 정리 (이전 단일 15분 작업 + 신규 burst 작업 모두)
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

-- 1) 기본 15분 (off-hours·주말 안전망)
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

-- 2) 한국 장중 5분 burst — KST 09:00-15:59 = UTC 00:00-06:59, Mon-Fri
select cron.schedule(
  'stock-prices-refresh-kr-burst',
  '*/5 0-6 * * 1-5',
  $CRON$
    select net.http_get(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/stock-prices',
      timeout_milliseconds := 60000
    );
  $CRON$
);

-- 3) 미국 장중 5분 burst — ET 09:00-21:00 ≈ UTC 13:00-20:59, Mon-Fri
-- DST 전환(3월·11월) 시 ±1시간 어긋날 수 있으나 13-20 범위가 EDT·EST 모두 흡수
select cron.schedule(
  'stock-prices-refresh-us-burst',
  '*/5 13-20 * * 1-5',
  $CRON$
    select net.http_get(
      url := 'https://ytvcgoldauysvnqckzze.supabase.co/functions/v1/stock-prices',
      timeout_milliseconds := 60000
    );
  $CRON$
);

-- 등록 결과 확인
select jobname, schedule, active from cron.job where jobname like 'stock-prices-refresh%' order by jobname;
