-- Run this once in Supabase → SQL Editor → New query.
-- Adds an optional, more precise harvest date (e.g. "November 2025") alongside harvest_year.

alter table public.products
  add column if not exists harvest_date text;
