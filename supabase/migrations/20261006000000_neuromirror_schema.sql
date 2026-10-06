create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(name) between 1 and 80),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null default '',
  journal_date date not null,
  mood text check (mood is null or mood in ('calm','happy','grateful','proud','tired','anxious','sad','reflective')),
  notebook_id uuid references public.notebooks(id) on delete set null,
  tags text[] not null default '{}',
  favorite boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))) stored
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null default '',
  deadline date,
  completed boolean not null default false,
  notebook_id uuid references public.notebooks(id) on delete set null,
  tags text[] not null default '{}',
  favorite boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))) stored
);

create table if not exists public.saved_memories (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  journal_id uuid not null references public.journals(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, journal_id)
);

create table if not exists public.cognitive_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  journal_id uuid not null references public.journals(id) on delete cascade,
  analysis jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  game text not null,
  score integer not null check (score >= 0),
  duration_ms integer not null check (duration_ms >= 0),
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists journals_user_date_idx on public.journals(user_id, journal_date desc);
create index if not exists journals_user_updated_idx on public.journals(user_id, updated_at desc);
create index if not exists journals_search_idx on public.journals using gin(search_vector);
create index if not exists notes_user_updated_idx on public.notes(user_id, updated_at desc);
create index if not exists notes_user_deadline_idx on public.notes(user_id, deadline);
create index if not exists notes_search_idx on public.notes using gin(search_vector);
create index if not exists insights_user_created_idx on public.cognitive_insights(user_id, created_at desc);
create index if not exists games_user_created_idx on public.game_results(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.notebooks enable row level security;
alter table public.journals enable row level security;
alter table public.notes enable row level security;
alter table public.saved_memories enable row level security;
alter table public.cognitive_insights enable row level security;
alter table public.game_results enable row level security;

create policy "profiles own rows" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "notebooks own rows" on public.notebooks for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "journals own rows" on public.journals for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "notes own rows" on public.notes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "saved memories own rows" on public.saved_memories for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "insights own rows" on public.cognitive_insights for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "game results own rows" on public.game_results for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.profiles, public.notebooks, public.journals, public.notes, public.saved_memories, public.cognitive_insights, public.game_results to authenticated;
