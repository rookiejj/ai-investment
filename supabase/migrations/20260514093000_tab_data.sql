-- 시장 데이터·헤드라인 update 이력 테이블
--
-- 현재 정적 data/*.js 파일 5탭(kr·stocks·ai·commodity·unicorn) 갈음.
-- 자동 갱신 sandbox가 GitHub push_files 대신 DB UPSERT로 쓰고, 클라이언트는
-- PostgREST로 직접 read. 일본(jp)·calendar_events·company_ko도 동일 패턴.
--
-- 마이그레이션 전략 (Phase 1): 듀얼 라이팅 — sandbox가 파일 write + DB UPSERT
-- 둘 다 호출. 클라이언트는 잠시 파일 사용. Phase 2부터 클라이언트 read DB로.

-- ═══════════════════════════════════════════════════
-- tab_data : 시장별 종목·핀맵 데이터 (현재 *-data.js 갈음)
-- payload는 *-data.js 변수 묶음 JSONB. 탭별 schema 다름:
--   - kr/stocks: { data: [{ category, items: [{tk,nm,rs,r1,p1,r2,p2}] }] }
--   - ai: { META: {year, month}, BL: {...}, data: [{rank, name, products: [...]}] }
--   - commodity: { data: [{ category, items: [{tk,nm,rs,price,ytd,y1,range}] }] }
--   - unicorn: { data: [{ category, items: [{nm,rs,val,round,sector,ipo}] }] }
-- ═══════════════════════════════════════════════════
create table if not exists public.tab_data (
  tab_id      text primary key check (tab_id in ('kr','stocks','ai','commodity','unicorn','jp')),
  payload     jsonb not null,
  version     text not null,            -- "20260514-0710" KST YYYYMMDD-HHmm
  updated_at  timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- tab_updates : 헤드라인·changes 이력 (현재 *-update.js + *-update-archive.js 갈음)
-- 두 파일을 is_archive 플래그로 합침.
--   - is_archive=false : main entries (최대 5건, 화면 노출용)
--   - is_archive=true  : archive entries (30일 cutoff, mentions 깊이용)
--
-- raw는 entry 전체 JSONB. AI탭(entries:[{text,time}]) / 다른 탭(summary·changes) 둘 다 호환.
-- entry_date·summary·changes는 자주 쓰는 필드만 컬럼으로 빼서 인덱스·쿼리 최적화.
-- ═══════════════════════════════════════════════════
create table if not exists public.tab_updates (
  id           bigserial primary key,
  tab_id       text not null check (tab_id in ('kr','stocks','ai','commodity','unicorn','jp')),
  entry_date   timestamptz not null,    -- entry.date 파싱 (KST 표기 → tz)
  summary      text,                    -- AI탭은 null 가능 (entries 형식)
  changes      jsonb,                   -- AI탭은 null. 다른 탭은 changes 배열
  raw          jsonb not null,          -- entry 전체. AI 호환·미래 스키마 변경 안전판
  is_archive   boolean not null default false,
  source_hash  text,                    -- entry 본문 hash. dedup·중복 push 방지용
  created_at   timestamptz not null default now()
);

-- 인덱스: 화면 query (탭별 main 5건·archive 30일 cutoff)
create index if not exists tab_updates_lookup_idx
  on public.tab_updates (tab_id, is_archive, entry_date desc);

-- dedup: 같은 탭에서 동일 source_hash는 한 번만
create unique index if not exists tab_updates_hash_idx
  on public.tab_updates (tab_id, source_hash)
  where source_hash is not null;

-- ═══════════════════════════════════════════════════
-- RLS — anon은 SELECT만, service role은 RLS bypass (자동 갱신·migration 스크립트가 사용)
-- ═══════════════════════════════════════════════════
alter table public.tab_data    enable row level security;
alter table public.tab_updates enable row level security;

drop policy if exists "anon read tab_data"    on public.tab_data;
drop policy if exists "anon read tab_updates" on public.tab_updates;

create policy "anon read tab_data"
  on public.tab_data for select
  to anon, authenticated
  using (true);

create policy "anon read tab_updates"
  on public.tab_updates for select
  to anon, authenticated
  using (true);

-- ═══════════════════════════════════════════════════
-- 보조 view : 화면용 main 최신 5건 (탭별 entry_date desc)
-- 클라이언트가 PostgREST에서 select * from tab_updates_main 식으로 사용
-- ═══════════════════════════════════════════════════
create or replace view public.tab_updates_main as
  select tab_id, entry_date, summary, changes, raw, created_at
  from public.tab_updates
  where is_archive = false
  order by tab_id, entry_date desc;

-- ═══════════════════════════════════════════════════
-- archive 30일 cutoff 트림 함수 — pg_cron 또는 sandbox가 호출.
-- archive-rotate.yml 워크플로 갈음 가능.
-- ═══════════════════════════════════════════════════
create or replace function public.trim_tab_updates_archive(days integer default 30)
returns integer language plpgsql security definer as $$
declare
  deleted_count integer;
begin
  delete from public.tab_updates
    where is_archive = true
      and entry_date < now() - (days || ' days')::interval;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- ═══════════════════════════════════════════════════
-- main → archive 자동 이동 트리거 — main이 5건 초과하면 가장 오래된 entry를 archive로 flag 변경
-- 호출 시점: 새 entry insert 직후. trim은 archive 30일 cutoff 함수가 별개로.
-- ═══════════════════════════════════════════════════
create or replace function public.rotate_tab_updates_main()
returns trigger language plpgsql as $$
declare
  excess_id bigint;
begin
  if new.is_archive = false then
    -- 같은 탭의 main 6번째 이후를 archive로 flag
    loop
      select id into excess_id
        from public.tab_updates
        where tab_id = new.tab_id
          and is_archive = false
        order by entry_date desc, id desc
        offset 5
        limit 1;
      exit when excess_id is null;
      update public.tab_updates
        set is_archive = true
        where id = excess_id;
    end loop;
  end if;
  return new;
end;
$$;

drop trigger if exists tab_updates_rotate_main on public.tab_updates;
create trigger tab_updates_rotate_main
  after insert on public.tab_updates
  for each row execute function public.rotate_tab_updates_main();
