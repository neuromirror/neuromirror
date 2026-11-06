-- Migration: Fix usage limits concurrency race conditions and add cognitive analysis request ledger
-- Prevents TOCTOU bypasses, concurrent request flooding, and unpaid AI inference drain.

-- 1. Create atomic tracking table for cognitive analysis requests
create table if not exists public.cognitive_analysis_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  journal_id uuid references public.journals(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists cognitive_analysis_requests_user_created_idx 
  on public.cognitive_analysis_requests(user_id, created_at desc);

alter table public.cognitive_analysis_requests enable row level security;

create policy "cognitive request owner read" 
  on public.cognitive_analysis_requests 
  for select to authenticated 
  using ((select auth.uid()) = user_id);

create policy "cognitive request owner insert" 
  on public.cognitive_analysis_requests 
  for insert to authenticated 
  with check ((select auth.uid()) = user_id);

grant select, insert on public.cognitive_analysis_requests to authenticated;

-- 2. Atomic claim function for cognitive analysis with advisory locking against race conditions
create or replace function public.claim_cognitive_analysis(target_journal_id uuid default null)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare 
  n integer;
begin
  if auth.uid() is null then 
    return false; 
  end if;

  -- Acquire transaction-level advisory lock on the user's UUID hash
  -- This serializes concurrent requests for the same user, closing the TOCTOU window
  perform pg_advisory_xact_lock(hashtext(auth.uid()::text));

  -- Count attempts within the sliding 1-hour window
  select count(*) into n 
  from public.cognitive_analysis_requests 
  where user_id = auth.uid() 
    and created_at > now() - interval '1 hour';

  if n >= 10 then 
    return false; 
  end if;

  -- Atomically reserve quota BEFORE calling external AI API
  insert into public.cognitive_analysis_requests(user_id, journal_id) 
  values (auth.uid(), target_journal_id);

  return true;
end;
$$;

revoke all on function public.claim_cognitive_analysis(uuid) from public, anon;
grant execute on function public.claim_cognitive_analysis(uuid) to authenticated;

-- 3. Update claim_voice_transcription to include advisory locking against concurrency race conditions
create or replace function public.claim_voice_transcription()
returns boolean language plpgsql security invoker set search_path = '' as $$
declare 
  n integer;
begin
  if auth.uid() is null then 
    return false; 
  end if;

  -- Acquire transaction-level advisory lock on the user's UUID hash
  perform pg_advisory_xact_lock(hashtext(auth.uid()::text));

  select count(*) into n 
  from public.voice_transcription_requests 
  where user_id = auth.uid() 
    and created_at > now() - interval '1 hour';

  if n >= 10 then 
    return false; 
  end if;

  insert into public.voice_transcription_requests(user_id) 
  values (auth.uid());

  return true;
end;
$$;

revoke all on function public.claim_voice_transcription() from public, anon;
grant execute on function public.claim_voice_transcription() to authenticated;
