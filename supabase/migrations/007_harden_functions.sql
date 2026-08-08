-- Move internal helper functions to a schema PostgREST never exposes, so they
-- can't be called directly over the API — only used internally by RLS/triggers.
create schema if not exists private;

create or replace function private.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke execute on function private.current_role() from public;
grant execute on function private.current_role() to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role public.app_role;
begin
  begin
    requested_role := (new.raw_user_meta_data ->> 'role')::public.app_role;
  exception when others then
    requested_role := 'viewer';
  end;

  if requested_role is null then
    requested_role := 'viewer';
  end if;

  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', requested_role);

  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public;

drop trigger on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Repoint every policy from the old public helper to the new private one.
alter policy "profiles_select" on public.profiles
  using (auth.uid() = id or private.current_role() = 'owner');
alter policy "profiles_insert_owner" on public.profiles
  with check (private.current_role() = 'owner');
alter policy "profiles_update_owner" on public.profiles
  using (private.current_role() = 'owner')
  with check (private.current_role() = 'owner');
alter policy "profiles_delete_owner" on public.profiles
  using (private.current_role() = 'owner');

alter policy "products_select_staff" on public.products
  using (private.current_role() in ('owner', 'editor', 'viewer'));
alter policy "products_insert_staff" on public.products
  with check (private.current_role() in ('owner', 'editor'));
alter policy "products_update_staff" on public.products
  using (private.current_role() in ('owner', 'editor'))
  with check (private.current_role() in ('owner', 'editor'));
alter policy "products_delete_staff" on public.products
  using (private.current_role() in ('owner', 'editor'));

alter policy "product_images_select_staff" on public.product_images
  using (private.current_role() in ('owner', 'editor', 'viewer'));
alter policy "product_images_insert_staff" on public.product_images
  with check (private.current_role() in ('owner', 'editor'));
alter policy "product_images_update_staff" on public.product_images
  using (private.current_role() in ('owner', 'editor'))
  with check (private.current_role() in ('owner', 'editor'));
alter policy "product_images_delete_staff" on public.product_images
  using (private.current_role() in ('owner', 'editor'));

alter policy "inquiries_select_staff" on public.inquiries
  using (private.current_role() in ('owner', 'editor', 'viewer'));
alter policy "inquiries_update_staff" on public.inquiries
  using (private.current_role() in ('owner', 'editor'))
  with check (private.current_role() in ('owner', 'editor'));
alter policy "inquiries_delete_owner" on public.inquiries
  using (private.current_role() = 'owner');

alter policy "product_images_bucket_insert" on storage.objects
  with check (bucket_id = 'product-images' and private.current_role() in ('owner', 'editor'));
alter policy "product_images_bucket_update" on storage.objects
  using (bucket_id = 'product-images' and private.current_role() in ('owner', 'editor'))
  with check (bucket_id = 'product-images' and private.current_role() in ('owner', 'editor'));
alter policy "product_images_bucket_delete" on storage.objects
  using (bucket_id = 'product-images' and private.current_role() in ('owner', 'editor'));

drop function public.current_role();
drop function public.handle_new_user();

-- Fix mutable search_path on the updated_at trigger function too.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
