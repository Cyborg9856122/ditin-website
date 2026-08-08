create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  company text,
  phone_whatsapp text not null,
  email text,
  rent_or_buy public.rent_or_buy_choice not null,
  screen_type public.product_category,
  indoor_or_outdoor public.placement_type,
  approx_size text,
  budget text,
  rental_start_date date,
  rental_end_date date,
  purpose text,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rental_dates_only_when_renting check (
    rent_or_buy = 'rent' or (rental_start_date is null and rental_end_date is null)
  )
);

comment on table public.inquiries is 'Inquiry form submissions. Public can insert; only staff (owner/editor/viewer) can read.';

create index inquiries_status_idx on public.inquiries(status);
create index inquiries_created_at_idx on public.inquiries(created_at desc);
create index inquiries_product_id_idx on public.inquiries(product_id);

create trigger set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();
