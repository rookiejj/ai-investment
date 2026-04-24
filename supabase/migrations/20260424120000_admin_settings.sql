-- 관리자 비밀번호 해시 저장 (단일 행)
-- 최초엔 env ADMIN_PASSWORD로 초기화, 이후 admin-api change_password에서 갱신

create table if not exists public.admin_settings (
  id          integer primary key default 1 check (id = 1),
  password_hash text not null,
  updated_at  timestamptz not null default now()
);

alter table public.admin_settings enable row level security;
