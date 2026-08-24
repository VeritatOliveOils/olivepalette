-- Run once in Supabase → SQL Editor.
-- Lets producers price in their own currency instead of forcing USD.

alter table public.products
  add column if not exists currency text not null default 'USD';
