-- Run once in Supabase → SQL Editor → New query.
-- Structured, verifiable awards (per oil) and press coverage (per producer).

alter table public.products
  add column if not exists awards_json jsonb not null default '[]'::jsonb;

alter table public.producers
  add column if not exists press jsonb not null default '[]'::jsonb;

-- Shapes stored:
-- awards_json: [{ "competition": "NYIOOC World Olive Oil Competition",
--                 "year": 2026, "category": "Robust / Picual",
--                 "award": "Gold", "url": "https://...", "verified": true }]
-- press:       [{ "outlet": "Olive Oil Times", "title": "...",
--                 "date": "March 2026", "url": "https://...", "verified": true }]
