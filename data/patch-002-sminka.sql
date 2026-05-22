-- Patch 002: dodaje "Šminka" kao novu kategoriju.
-- Pokreni jednom u Supabase SQL Editoru.

insert into categories (slug, name, icon, sort_order) values
  ('sminka', 'Šminka', '✿', 5)
on conflict (slug) do nothing;
