-- Profiles: one row per admin/staff user (Owner, Editor, Viewer). Public site visitors never get a row here.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Admin/staff accounts only. Role controls access across the admin panel.';

-- Auto-create a profile row whenever a new auth user is created.
-- Role is read from the user's metadata (set by the Owner when inviting), defaulting to viewer.
-- NOTE: superseded by 007_harden_functions.sql, which moves this into the
-- `private` schema. Kept here for migration history / replay order.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
