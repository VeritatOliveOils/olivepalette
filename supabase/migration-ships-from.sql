-- Run once in Supabase → SQL Editor.
-- Separates where the olives grow from where the business ships from.
-- (Common case: a UK company selling oil grown in Spain.)

alter table public.producers
  add column if not exists ships_from text;

notify pgrst, 'reload schema';
