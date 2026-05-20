-- 7일 무료 체험 추적
-- subscribers.trial_used_at 으로 번호당 1회 제한.
-- 다음 지정 이벤트 시 수동으로 NULL 리셋해 재허용 가능.

alter table public.subscribers
  add column if not exists trial_used_at timestamptz;

create index if not exists subscribers_trial_used_at_idx
  on public.subscribers(trial_used_at)
  where trial_used_at is not null;
