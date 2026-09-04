-- Admin-configurable specification fields, shown on the public product page.
-- Kept as an additional layer alongside the existing fixed columns on
-- products (pixel_pitch_mm, panel_size, brightness_nits, resolution), which
-- stay as-is since the pixel-pitch calculator depends on a typed column.
create table public.spec_fields (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  unit text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.spec_fields is 'Owner-managed custom specification fields (e.g. "Refresh rate", "Warranty"), configured under /admin/settings and rendered dynamically on the product form and public product page.';

create trigger set_updated_at
  before update on public.spec_fields
  for each row execute function public.set_updated_at();

create table public.product_spec_values (
  product_id uuid not null references public.products(id) on delete cascade,
  spec_field_id uuid not null references public.spec_fields(id) on delete cascade,
  value text,
  primary key (product_id, spec_field_id)
);

comment on table public.product_spec_values is 'Per-product values for admin-defined spec_fields. Rows with a null/empty value are treated as unset and hidden on the public product page.';

create index product_spec_values_product_id_idx on public.product_spec_values(product_id);
create index product_spec_values_spec_field_id_idx on public.product_spec_values(spec_field_id);

alter table public.spec_fields enable row level security;
alter table public.product_spec_values enable row level security;

-- SPEC FIELDS: field definitions/labels aren't sensitive — anyone can read
-- them (needed so the public product page can label values); only Owner
-- manages them (matches permissions.canManageSiteSettings).
create policy "spec_fields_select" on public.spec_fields
  for select to anon, authenticated
  using (true);

create policy "spec_fields_insert_owner" on public.spec_fields
  for insert to authenticated
  with check (private.current_role() = 'owner');

create policy "spec_fields_update_owner" on public.spec_fields
  for update to authenticated
  using (private.current_role() = 'owner')
  with check (private.current_role() = 'owner');

create policy "spec_fields_delete_owner" on public.spec_fields
  for delete to authenticated
  using (private.current_role() = 'owner');

-- PRODUCT SPEC VALUES: mirrors products/product_images visibility, but
-- writable by owner/editor (same as the rest of a product's fields) rather
-- than owner-only, since editors fill these in from the product form.
create policy "product_spec_values_select_public" on public.product_spec_values
  for select to anon
  using (exists (
    select 1 from public.products p
    where p.id = product_spec_values.product_id and p.status = 'published'
  ));

create policy "product_spec_values_select_staff" on public.product_spec_values
  for select to authenticated
  using (private.current_role() in ('owner', 'editor', 'viewer'));

create policy "product_spec_values_insert_staff" on public.product_spec_values
  for insert to authenticated
  with check (private.current_role() in ('owner', 'editor'));

create policy "product_spec_values_update_staff" on public.product_spec_values
  for update to authenticated
  using (private.current_role() in ('owner', 'editor'))
  with check (private.current_role() in ('owner', 'editor'));

create policy "product_spec_values_delete_staff" on public.product_spec_values
  for delete to authenticated
  using (private.current_role() in ('owner', 'editor'));
