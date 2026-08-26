-- Run once in Supabase → SQL Editor.
-- The Olive Vine mailing list. Anyone can subscribe; only the curator can read it.

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,                       -- which page they signed up from
  unsubscribed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists subscribers_created_idx on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;

-- Anyone may join the list…
create policy "Anyone can subscribe" on public.subscribers
  for insert with check (true);

-- …but only admins can read it. Subscriber emails are never public.
create policy "Admins read subscribers" on public.subscribers
  for select using (public.is_admin());

create policy "Admins update subscribers" on public.subscribers
  for update using (public.is_admin());

notify pgrst, 'reload schema';
