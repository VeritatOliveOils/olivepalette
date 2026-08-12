-- OlivePalette schema. Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

-- Admins (you). Add yourself after signing up:
--   insert into public.admin_users (id) select id from auth.users where email = 'you@example.com';
create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade
);

-- Producer profile, one per auth user
create table public.producers (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  region text,
  country text,
  story text,
  website text,
  instagram_url text,
  logo_url text,
  is_women_led boolean not null default false,
  shipping_regions text[] not null default '{}',   -- e.g. {US, EU, UK, Canada}
  certifications_text text,                         -- PDO/PGI, organic body, etc.
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  name text not null,
  description text,
  category text,                                    -- extra virgin, flavored, etc.
  varietals text[] not null default '{}',
  region text,
  country text,
  farm_name text,
  harvest_year int,
  intensity text check (intensity in ('delicate', 'medium', 'robust')),
  flavor_tags text[] not null default '{}',
  tasting_notes text,
  pairings text[] not null default '{}',
  fruitiness int check (fruitiness between 0 and 10),
  bitterness int check (bitterness between 0 and 10),
  pungency int check (pungency between 0 and 10),
  polyphenols_ppm int,
  size_ml int,
  packaging text,                                   -- glass, tin, bag-in-box
  price_usd numeric(10,2),
  buy_url text,
  image_url text,
  organic boolean default false,
  awards text,
  acidity text,
  created_at timestamptz not null default now()
);

create index products_producer_idx on public.products (producer_id);
create index products_status_idx on public.products (status);
create index products_intensity_idx on public.products (intensity);
create index products_flavor_tags_idx on public.products using gin (flavor_tags);

-- Affiliate click tracking
create table public.click_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  producer_id uuid not null references public.producers (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

create index click_events_product_idx on public.click_events (product_id);
create index click_events_producer_idx on public.click_events (producer_id);
create index click_events_time_idx on public.click_events (clicked_at);

-- Helper: is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

-- Row Level Security
alter table public.admin_users enable row level security;
alter table public.producers enable row level security;
alter table public.products enable row level security;
alter table public.click_events enable row level security;

-- admin_users: users may check their own membership; rows managed via SQL editor only
create policy "Check own admin membership" on public.admin_users
  for select using (id = auth.uid());

-- producers: public read; owners manage their own profile
create policy "Public read producers" on public.producers
  for select using (true);

create policy "Producers insert own profile" on public.producers
  for insert with check (auth.uid() = id);

create policy "Producers update own profile" on public.producers
  for update using (auth.uid() = id);

-- products: public sees approved only; owners and admins see all of theirs
create policy "Read approved or own products" on public.products
  for select using (status = 'approved' or auth.uid() = producer_id or public.is_admin());

-- Producers can insert/update their own products, but always as 'pending'
-- (any edit goes back into your review queue; only admins can set 'approved')
create policy "Producers insert own products as pending" on public.products
  for insert with check (auth.uid() = producer_id and status = 'pending');

create policy "Producers update own products to pending" on public.products
  for update using (auth.uid() = producer_id)
  with check (auth.uid() = producer_id and status = 'pending');

create policy "Producers delete own products" on public.products
  for delete using (auth.uid() = producer_id);

-- Admins can approve/reject any product
create policy "Admins update any product" on public.products
  for update using (public.is_admin());

-- click_events: anyone can log a click (via the /go redirect); admins and the
-- affected producer can read
create policy "Anyone can log clicks" on public.click_events
  for insert with check (true);

create policy "Admins and owners read clicks" on public.click_events
  for select using (public.is_admin() or auth.uid() = producer_id);
