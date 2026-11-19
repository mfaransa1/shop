-- SHoP Stage 5: dedicated school and sponsor partnership enquiries.
-- Public submissions are written only through the server-side API using the
-- Supabase service role. RLS intentionally has no anon/authenticated policies.

create table if not exists public.shop_partnership_enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('school', 'sponsor')),
  organisation text not null check (char_length(organisation) between 2 and 160),
  contact_name text not null check (char_length(contact_name) between 2 and 120),
  contact_role text not null check (char_length(contact_role) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 7 and 40),
  location text,
  interest text not null,
  scale text,
  timeline text,
  message text not null check (char_length(message) between 10 and 2500),
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'approved', 'declined', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shop_partnership_enquiries_created_at_idx
  on public.shop_partnership_enquiries (created_at desc);
create index if not exists shop_partnership_enquiries_kind_status_idx
  on public.shop_partnership_enquiries (kind, status, created_at desc);

alter table public.shop_partnership_enquiries enable row level security;

revoke all on table public.shop_partnership_enquiries from anon, authenticated;
grant all on table public.shop_partnership_enquiries to service_role;

create or replace function public.set_shop_partnership_enquiry_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shop_partnership_enquiries_updated_at
  on public.shop_partnership_enquiries;
create trigger shop_partnership_enquiries_updated_at
before update on public.shop_partnership_enquiries
for each row execute function public.set_shop_partnership_enquiry_updated_at();
