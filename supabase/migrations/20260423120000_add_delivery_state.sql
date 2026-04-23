-- 구독자별 최근 발송 상태 스냅샷 컬럼
-- daily-send가 발송 후 자동으로 갱신: ok / not_friend / blocked / paused_ad / unknown

alter table public.subscribers
  add column if not exists delivery_state text not null default 'ok'
  check (delivery_state in ('ok','not_friend','blocked','paused_ad','unknown'));

create index if not exists subscribers_delivery_state_idx
  on public.subscribers(delivery_state);
