-- 결제 연동 스키마
-- subscribers에 결제 만료일·마지막 결제 식별자·PG 기록 추가
-- payments 테이블로 결제 이력 보관

alter table public.subscribers
  add column if not exists paid_until       timestamptz,
  add column if not exists last_payment_id  text,
  add column if not exists payment_provider text;

create index if not exists subscribers_paid_until_idx
  on public.subscribers(paid_until);

-- ═══════════════════════════════════════════════════
-- payments : 결제 이력
-- ═══════════════════════════════════════════════════
create table if not exists public.payments (
  id             bigserial primary key,
  subscriber_id  uuid references public.subscribers(id) on delete set null,
  payment_id     text not null unique,
  provider       text not null default 'portone',
  amount         integer not null,
  currency       text not null default 'KRW',
  status         text not null check (status in ('paid','failed','refunded')),
  order_name     text,
  paid_at        timestamptz,
  raw_response   jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists payments_subscriber_idx on public.payments(subscriber_id);
create index if not exists payments_created_at_idx on public.payments(created_at desc);

alter table public.payments enable row level security;
