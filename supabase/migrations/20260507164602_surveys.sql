-- ═══════════════════════════════════════════════════
-- surveys : 설문 정의 (관리자가 만들고 친구톡으로 URL 발송)
-- survey_responses : 응답 (익명, IP 해시로 중복 차단)
-- ═══════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- 설문 정의
create table if not exists public.surveys (
  id          text primary key,                                  -- 'YYYYMM-NN' 슬러그
  title       text not null,
  question    text not null,
  options     jsonb not null,                                    -- ["선택지1", "선택지2", ...]
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 응답 (익명)
create table if not exists public.survey_responses (
  id              uuid primary key default gen_random_uuid(),
  survey_id       text not null references public.surveys(id) on delete cascade,
  selected_index  int not null,                                  -- options 배열의 인덱스 (0부터)
  ip_hash         text,                                          -- SHA256(IP + secret), 중복 차단용
  user_agent      text,
  created_at      timestamptz not null default now()
);

-- 같은 IP가 같은 설문에 중복 응답 못 하도록 (ip_hash null이면 적용 안 됨)
create unique index if not exists ux_survey_responses_unique
  on public.survey_responses (survey_id, ip_hash) where ip_hash is not null;

-- 결과 집계 쿼리용 — survey_id + selected_index 그룹 카운트
create index if not exists ix_survey_responses_survey
  on public.survey_responses (survey_id, selected_index);

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_surveys_updated_at on public.surveys;
create trigger trg_surveys_updated_at
  before update on public.surveys
  for each row execute function public.set_updated_at();

-- RLS 활성화 — Edge Function이 service_role 키로 우회 접근. anon/auth 클라이언트의
-- 직접 SELECT·INSERT는 정책 없으므로 자동 차단(default deny). 정책 추가는 불필요.
alter table public.surveys enable row level security;
alter table public.survey_responses enable row level security;

-- 첫 설문 시드 — 가격 설문 (2026-05 첫 번째)
-- title이 곧 질문 역할 (관리자 폼에서 분리 입력 받지 않음)
insert into public.surveys (id, title, question, options, active) values (
  '202605-01',
  '매일 카톡 서비스를 구독한다면, 한 달에 얼마가 적당하다고 생각하시나요?',
  '매일 카톡 서비스를 구독한다면, 한 달에 얼마가 적당하다고 생각하시나요?',
  '["무료여야 함", "월 1,000원 이하", "월 1,000~3,000원", "월 3,000~5,000원", "월 5,000~9,900원", "월 9,900~19,900원", "월 19,900원 이상"]'::jsonb,
  true
)
on conflict (id) do nothing;
