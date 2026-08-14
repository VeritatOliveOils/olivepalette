-- Run once in Supabase → SQL Editor → New query.
-- Lets producers say they welcome retail/wholesale enquiries, with a trade contact.

alter table public.producers
  add column if not exists wholesale_available boolean not null default false,
  add column if not exists trade_contact_email text,
  add column if not exists trade_notes text;
