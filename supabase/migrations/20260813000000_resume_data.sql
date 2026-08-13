create table if not exists public.resume_data (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.resume_data enable row level security;

create policy "service role only" on public.resume_data
  using (false);
