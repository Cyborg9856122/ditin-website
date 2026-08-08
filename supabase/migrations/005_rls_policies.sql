-- Helper: current user's role, security definer so it can read profiles without
-- triggering recursive RLS checks on the profiles table itself.
-- NOTE: superseded by 007_harden_functions.sql, which moves this into the
-- `private` schema. Kept here for migration history / replay order.
create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inquiries enable row level security;

-- PROFILES: users can read their own row; Owner can read/manage everyone.
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.current_role() = 'owner');

create policy "profiles_insert_owner" on public.profiles
  for insert to authenticated
  with check (public.current_role() = 'owner');

create policy "profiles_update_owner" on public.profiles
  for update to authenticated
  using (public.current_role() = 'owner')
  with check (public.current_role() = 'owner');

create policy "profiles_update_self" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_delete_owner" on public.profiles
  for delete to authenticated
  using (public.current_role() = 'owner');

-- PRODUCTS: public can see published only; staff (owner/editor/viewer) see everything;
-- only owner/editor can write.
create policy "products_select_public" on public.products
  for select to anon
  using (status = 'published');

create policy "products_select_staff" on public.products
  for select to authenticated
  using (public.current_role() in ('owner', 'editor', 'viewer'));

create policy "products_insert_staff" on public.products
  for insert to authenticated
  with check (public.current_role() in ('owner', 'editor'));

create policy "products_update_staff" on public.products
  for update to authenticated
  using (public.current_role() in ('owner', 'editor'))
  with check (public.current_role() in ('owner', 'editor'));

create policy "products_delete_staff" on public.products
  for delete to authenticated
  using (public.current_role() in ('owner', 'editor'));

-- PRODUCT IMAGES: mirrors products.
create policy "product_images_select_public" on public.product_images
  for select to anon
  using (exists (
    select 1 from public.products p
    where p.id = product_images.product_id and p.status = 'published'
  ));

create policy "product_images_select_staff" on public.product_images
  for select to authenticated
  using (public.current_role() in ('owner', 'editor', 'viewer'));

create policy "product_images_insert_staff" on public.product_images
  for insert to authenticated
  with check (public.current_role() in ('owner', 'editor'));

create policy "product_images_update_staff" on public.product_images
  for update to authenticated
  using (public.current_role() in ('owner', 'editor'))
  with check (public.current_role() in ('owner', 'editor'));

create policy "product_images_delete_staff" on public.product_images
  for delete to authenticated
  using (public.current_role() in ('owner', 'editor'));

-- INQUIRIES: anyone (including anonymous site visitors) can submit; only staff can read;
-- only owner/editor can update status; only owner can delete.
create policy "inquiries_insert_anyone" on public.inquiries
  for insert
  with check (true);

create policy "inquiries_select_staff" on public.inquiries
  for select to authenticated
  using (public.current_role() in ('owner', 'editor', 'viewer'));

create policy "inquiries_update_staff" on public.inquiries
  for update to authenticated
  using (public.current_role() in ('owner', 'editor'))
  with check (public.current_role() in ('owner', 'editor'));

create policy "inquiries_delete_owner" on public.inquiries
  for delete to authenticated
  using (public.current_role() = 'owner');
