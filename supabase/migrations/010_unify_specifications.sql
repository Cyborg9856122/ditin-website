-- Unify product specifications into a single flexible library. Previously
-- there were two tiers: fixed typed columns on products (pixel_pitch_mm,
-- panel_size, brightness_nits, resolution) and admin-defined spec_fields.
-- This migration folds the fixed columns into spec_fields as ordinary
-- fields (flagged via field_key so app code can still find "the" pixel
-- pitch field for the viewing-distance calculator), adds a field_type so
-- fields can render as text/number/dropdown/multiselect/boolean, adds
-- spec_field_options for the two choice types, and adds is_archived so a
-- field can be retired without deleting historical product data.

create type public.spec_field_type as enum ('text', 'number', 'dropdown', 'multiselect', 'boolean');

alter table public.spec_fields
  add column field_type public.spec_field_type not null default 'text',
  add column field_key text unique,
  add column is_archived boolean not null default false;

comment on column public.spec_fields.field_key is 'Reserved key for fields the app depends on beyond generic display (e.g. pixel_pitch_mm feeds the viewing-distance calculator). Null for ordinary admin-created fields.';
comment on column public.spec_fields.is_archived is 'Archived fields are hidden from the product form and public page but their historical product_spec_values rows are kept.';

create table public.spec_field_options (
  id uuid primary key default gen_random_uuid(),
  spec_field_id uuid not null references public.spec_fields(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.spec_field_options is 'Selectable options for spec_fields of type dropdown/multiselect. product_spec_values.value stores the option id (dropdown) or a JSON array of option ids (multiselect).';

create index spec_field_options_spec_field_id_idx on public.spec_field_options(spec_field_id);

alter table public.spec_field_options enable row level security;

create policy "spec_field_options_select" on public.spec_field_options
  for select to anon, authenticated
  using (true);

create policy "spec_field_options_insert_owner" on public.spec_field_options
  for insert to authenticated
  with check (private.current_role() = 'owner');

create policy "spec_field_options_update_owner" on public.spec_field_options
  for update to authenticated
  using (private.current_role() = 'owner')
  with check (private.current_role() = 'owner');

create policy "spec_field_options_delete_owner" on public.spec_field_options
  for delete to authenticated
  using (private.current_role() = 'owner');

-- Seed the four previously-fixed columns as ordinary (system-keyed) fields,
-- placed ahead of whatever custom fields already exist.
with base as (
  select coalesce(max(sort_order), -1) as max_order from public.spec_fields
),
seed (label, unit, field_type, field_key, rn) as (
  values
    ('Pixel pitch', 'mm', 'number', 'pixel_pitch_mm', 1),
    ('Panel size', null, 'text', 'panel_size', 2),
    ('Brightness', 'nits', 'number', 'brightness_nits', 3),
    ('Resolution', null, 'text', 'resolution', 4)
)
insert into public.spec_fields (label, unit, field_type, field_key, sort_order)
select seed.label, seed.unit, seed.field_type::public.spec_field_type, seed.field_key, base.max_order + seed.rn
from seed, base;

-- Copy existing values from the fixed columns into product_spec_values.
insert into public.product_spec_values (product_id, spec_field_id, value)
select p.id, f.id, p.pixel_pitch_mm::text
from public.products p, public.spec_fields f
where f.field_key = 'pixel_pitch_mm' and p.pixel_pitch_mm is not null;

insert into public.product_spec_values (product_id, spec_field_id, value)
select p.id, f.id, p.panel_size
from public.products p, public.spec_fields f
where f.field_key = 'panel_size' and p.panel_size is not null and p.panel_size <> '';

insert into public.product_spec_values (product_id, spec_field_id, value)
select p.id, f.id, p.brightness_nits::text
from public.products p, public.spec_fields f
where f.field_key = 'brightness_nits' and p.brightness_nits is not null;

insert into public.product_spec_values (product_id, spec_field_id, value)
select p.id, f.id, p.resolution
from public.products p, public.spec_fields f
where f.field_key = 'resolution' and p.resolution is not null and p.resolution <> '';

-- The fixed columns are now redundant — drop them (and their checks) so
-- there's exactly one place specification data lives.
alter table public.products
  drop constraint if exists pixel_pitch_range,
  drop constraint if exists brightness_positive,
  drop column if exists pixel_pitch_mm,
  drop column if exists panel_size,
  drop column if exists brightness_nits,
  drop column if exists resolution;
