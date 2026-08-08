create index products_created_by_idx on public.products(created_by);
create index products_updated_by_idx on public.products(updated_by);

-- Wrap auth.uid() in a scalar subselect so Postgres evaluates it once per
-- query instead of once per row (Supabase RLS performance best practice).
alter policy "profiles_select" on public.profiles
  using ((select auth.uid()) = id or private.current_role() = 'owner');

-- Merge the two UPDATE policies on profiles into one (same effective access,
-- avoids running two permissive policies per query).
drop policy "profiles_update_owner" on public.profiles;
drop policy "profiles_update_self" on public.profiles;
create policy "profiles_update" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id or private.current_role() = 'owner')
  with check ((select auth.uid()) = id or private.current_role() = 'owner');
