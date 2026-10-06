alter table public.notebooks add constraint notebooks_user_id_id_key unique (user_id, id);
alter table public.journals drop constraint if exists journals_notebook_id_fkey;
alter table public.journals add constraint journals_notebook_owner_fkey foreign key (user_id, notebook_id) references public.notebooks(user_id, id) on delete set null (notebook_id);
alter table public.notes drop constraint if exists notes_notebook_id_fkey;
alter table public.notes add constraint notes_notebook_owner_fkey foreign key (user_id, notebook_id) references public.notebooks(user_id, id) on delete set null (notebook_id);

drop policy if exists "saved memories own rows" on public.saved_memories;
create policy "saved memories own rows" on public.saved_memories for all to authenticated
using ((select auth.uid()) = user_id and exists (select 1 from public.journals j where j.id = journal_id and j.user_id = (select auth.uid())))
with check ((select auth.uid()) = user_id and exists (select 1 from public.journals j where j.id = journal_id and j.user_id = (select auth.uid())));

drop policy if exists "insights own rows" on public.cognitive_insights;
create policy "insights own rows" on public.cognitive_insights for all to authenticated
using ((select auth.uid()) = user_id and exists (select 1 from public.journals j where j.id = journal_id and j.user_id = (select auth.uid())))
with check ((select auth.uid()) = user_id and exists (select 1 from public.journals j where j.id = journal_id and j.user_id = (select auth.uid())));
