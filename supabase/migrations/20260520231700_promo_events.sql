-- 프로모 이벤트 시스템
-- ─────────────────────────────────────────────────────────────────
-- 기존: subscribers.trial_used_at 단일 timestamp → "평생 1회" 만 표현 가능.
-- 신규: 다중 이벤트 발행, 같은 번호가 서로 다른 이벤트엔 각각 1회씩 보너스 받기.
--
-- 정책:
--   - 같은 이벤트 같은 번호 1회 (unique(event_id, phone))
--   - 다른 이벤트는 별개 — 매번 새 redemption 발급
--   - 결제 시 적용 가능한 이벤트가 여럿이면 가장 큰 보너스 1개만 (stacking 안 함)
--
-- 호환:
--   - subscribers.trial_used_at 컬럼은 drop 안 함 (롤백 안전망, 다음 정리 사이클에 drop)
--   - check-subscription 응답에 trial_eligible 도 같이 반환 (구 클라이언트 호환)
-- ─────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════
-- promo_events : 발행된 프로모 이벤트
-- ═══════════════════════════════════════════════════
create table if not exists public.promo_events (
  id           bigserial primary key,
  code         text unique not null,        -- 사람이 읽는 키 (예: launch-first-payment-7d-2026q2)
  name         text not null,               -- UI 노출용 이름 (예: "첫 결제 시 7일 추가")
  description  text,
  bonus_days   integer not null check (bonus_days >= 0),
  -- 자격 조건:
  --   first_payment : 이전 결제 이력 없음 (subscribers.last_payment_id IS NULL)
  --   all           : 모든 결제자 (기존 사용자 포함 — 깜짝 보너스 등)
  --   returning     : 만료/취소 상태에서 재결제 (status != 'active')
  eligible_for text not null check (eligible_for in ('first_payment','all','returning')),
  starts_at    timestamptz not null,
  ends_at      timestamptz,                 -- null = 무기한 active
  active       boolean not null default true, -- 수동 on/off (kill switch)
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists promo_events_active_idx
  on public.promo_events(active, starts_at, ends_at)
  where active = true;

drop trigger if exists trg_promo_events_updated on public.promo_events;
create trigger trg_promo_events_updated
  before update on public.promo_events
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════
-- promo_redemptions : 이벤트 적용 이력 (번호별)
-- ═══════════════════════════════════════════════════
create table if not exists public.promo_redemptions (
  id                 bigserial primary key,
  event_id           bigint  not null references public.promo_events(id) on delete restrict,
  subscriber_id      uuid    references public.subscribers(id) on delete set null,
  phone              text    not null,
  payment_id         text,                  -- 어떤 결제에서 적용됐는지 (null 허용 — 향후 0원 이벤트 대비)
  bonus_days_applied integer not null check (bonus_days_applied >= 0),
  redeemed_at        timestamptz not null default now()
);

-- 같은 이벤트는 번호당 1회 — race condition 차단
create unique index if not exists promo_redemptions_event_phone_uniq
  on public.promo_redemptions(event_id, phone);

create index if not exists promo_redemptions_phone_idx
  on public.promo_redemptions(phone);

create index if not exists promo_redemptions_subscriber_idx
  on public.promo_redemptions(subscriber_id);

-- RLS: service_role 만 접근
alter table public.promo_events      enable row level security;
alter table public.promo_redemptions enable row level security;

-- ═══════════════════════════════════════════════════
-- 시드: 현재 진행 중인 첫 결제 보너스 이벤트
-- ═══════════════════════════════════════════════════
insert into public.promo_events (code, name, description, bonus_days, eligible_for, starts_at, ends_at, active)
values (
  'launch-first-payment-7d-2026q2',
  '첫 결제 시 7일 추가',
  '베타 런칭 기념 — 첫 결제 사용자 번호당 1회 7일 무료 추가',
  7,
  'first_payment',
  '2026-04-21 00:00:00+09'::timestamptz,
  null,
  true
)
on conflict (code) do nothing;

-- ═══════════════════════════════════════════════════
-- 백필: 기존 trial_used_at NOT NULL 인 row 를 redemption 으로 변환
-- ─────────────────────────────────────────────────────
-- subscribers.trial_used_at 가 채워진 경우 = payment-confirm 이 첫 결제 보너스를 지급한 케이스.
-- promo_redemptions 에 동일한 정보를 1회성 백필. payment_id 는 last_payment_id 로 추정 매핑.
-- ═══════════════════════════════════════════════════
insert into public.promo_redemptions (event_id, subscriber_id, phone, payment_id, bonus_days_applied, redeemed_at)
select
  (select id from public.promo_events where code = 'launch-first-payment-7d-2026q2'),
  s.id,
  s.phone,
  s.last_payment_id,
  7,
  s.trial_used_at
from public.subscribers s
where s.trial_used_at is not null
on conflict (event_id, phone) do nothing;
