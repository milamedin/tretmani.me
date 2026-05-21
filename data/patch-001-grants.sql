-- Patch 001: missing grants on categories and cities for anon role.
-- Bez ovoga, frontend ne moze čitati listu kategorija i gradova.
-- Pokreni jednom u Supabase SQL Editoru.

grant select on categories to anon;
grant select on cities to anon;
