create table if not exists public.voice_transcription_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists voice_transcription_requests_user_created_idx on public.voice_transcription_requests(user_id, created_at desc);
alter table public.voice_transcription_requests enable row level security;
create policy "voice request owner read" on public.voice_transcription_requests for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.voice_transcription_requests to authenticated;
grant insert on public.voice_transcription_requests to authenticated;
create policy "voice request owner insert" on public.voice_transcription_requests for insert to authenticated with check ((select auth.uid()) = user_id);

create or replace function public.claim_voice_transcription()
returns boolean language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
  if auth.uid() is null then return false; end if;
  select count(*) into n from public.voice_transcription_requests where user_id = auth.uid() and created_at > now() - interval '1 hour';
  if n >= 10 then return false; end if;
  insert into public.voice_transcription_requests(user_id) values (auth.uid());
  return true;
end;
$$;
revoke all on function public.claim_voice_transcription() from public, anon;
grant execute on function public.claim_voice_transcription() to authenticated;
