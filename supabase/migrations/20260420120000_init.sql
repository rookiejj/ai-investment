-- 브리픽 카카오 친구톡 구독 서비스 스키마 초기화
-- 구독자 테이블: 친구톡 수신 대상 관리
-- 발송 로그: 일일 발송 결과 추적

create extension if not exists pgcrypto;

-- ═══════════════════════════════════════════════════
-- subscribers : 구독자
-- ═══════════════════════════════════════════════════
create table if not exists public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  phone         text not null,
  name          text,
  kakao_id      text,
  status        text not null default 'active'
                check (status in ('active', 'paused', 'expired', 'cancelled')),
  subscribed_at timestamptz not null default now(),
  expires_at    timestamptz,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index if not exists subscribers_phone_idx on public.subscribers(phone);
create index if not exists subscribers_status_idx on public.subscribers(status);
create unique index if not exists subscribers_kakao_id_idx
  on public.subscribers(kakao_id) where kakao_id is not null;

-- ═══════════════════════════════════════════════════
-- send_logs : 일일 발송 로그
-- ═══════════════════════════════════════════════════
create table if not exists public.send_logs (
  id             bigserial primary key,
  subscriber_id  uuid references public.subscribers(id) on delete set null,
  phone          text not null,
  message        text not null,
  char_count     integer,
  status         text not null check (status in ('success', 'fail', 'skipped')),
  aligo_code     text,
  aligo_message  text,
  aligo_msg_id   text,
  batch_id       uuid,
  sent_at        timestamptz not null default now()
);

create index if not exists send_logs_sent_at_idx on public.send_logs(sent_at desc);
create index if not exists send_logs_subscriber_idx on public.send_logs(subscriber_id);
create index if not exists send_logs_batch_idx on public.send_logs(batch_id);

-- ═══════════════════════════════════════════════════
-- updated_at 자동 갱신 트리거
-- ═══════════════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_subscribers_updated on public.subscribers;
create trigger trg_subscribers_updated
  before update on public.subscribers
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════
-- RLS : 기본 차단, service_role만 접근 가능
-- (향후 사용자 셀프 관리 UI 붙일 때 policy 추가)
-- ═══════════════════════════════════════════════════
alter table public.subscribers enable row level security;
alter table public.send_logs  enable row level security;
