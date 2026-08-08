create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category public.product_category not null,
  placement public.placement_type not null,
  availability public.availability_type not null,
  pixel_pitch_mm numeric(4,2),
  panel_size text,
  brightness_nits integer,
  resolution text,
  typical_use_case text,
  status public.product_status not null default 'draft',
  is_placeholder boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint brightness_positive check (brightness_nits is null or brightness_nits > 0),
  constraint pixel_pitch_range check (pixel_pitch_mm is null or (pixel_pitch_mm >= 1.0 and pixel_pitch_mm <= 10.0))
);

comment on table public.products is 'Ditin catalogue items. Ditin does not hold stock; this is a reference catalogue of what is sourced on order.';
comment on column public.products.is_placeholder is 'True for seeded example/placeholder products with no real photos, prices, or specs verified.';

create index products_category_idx on public.products(category);
create index products_status_idx on public.products(status);
create index products_placement_idx on public.products(placement);
create index products_availability_idx on public.products(availability);
create index products_slug_idx on public.products(slug);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.product_images is 'Gallery images per product, stored in the product-images storage bucket. Placeholder images until real photography exists.';

create index product_images_product_id_idx on public.product_images(product_id);

-- generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
