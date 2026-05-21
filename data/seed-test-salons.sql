-- Test seed data: 3 demo salona da bi homepage hidrirao iz Supabase-a.
-- Opciono. Obriši kad počneš dodavati prave salone preko Supabase Table Editora.

insert into salons (
  slug, name, category_id, city_id,
  address, phone, instagram, website,
  short_description, description, cover_image,
  services, price_range,
  rating, review_count,
  is_featured, is_verified, is_active,
  subscription_status
) values
(
  'lumiere-aesthetics',
  'Lumière Aesthetics',
  (select id from categories where slug = 'estetski-tretmani'),
  (select id from cities where slug = 'podgorica'),
  'Bulevar Sv. Petra Cetinjskog 12, Podgorica',
  '+382 67 123 456',
  'lumiere.aesthetics',
  'https://lumiere.me',
  'Premium estetski centar u centru Podgorice — HIFU, PRP, mezo, laser.',
  'Lumière Aesthetics je premium estetski centar koji već šest godina pruža vrhunske tretmane lica i tijela.',
  'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=900&q=80&auto=format&fit=crop',
  '[{"name":"HIFU"},{"name":"PRP"},{"name":"Mezo"}]'::jsonb,
  '€35',
  4.9, 124,
  true, true, true,
  'active'
),
(
  'bella-studio',
  'Bella Studio',
  (select id from categories where slug = 'frizerski-saloni'),
  (select id from cities where slug = 'budva'),
  'Stari grad bb, Budva',
  '+382 68 987 654',
  'bella.studio.budva',
  null,
  'Frizerski salon u srcu Starog grada Budve.',
  'Bella Studio je porodični frizerski salon sa preko 15 godina iskustva.',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80&auto=format&fit=crop',
  '[{"name":"Šišanje"},{"name":"Farbanje"},{"name":"Keratin"}]'::jsonb,
  '€15',
  4.8, 87,
  true, true, true,
  'active'
),
(
  'rose-co',
  'Rose & Co.',
  (select id from categories where slug = 'kozmeticki-saloni'),
  (select id from cities where slug = 'tivat'),
  'Porto Montenegro 4, Tivat',
  '+382 69 555 111',
  'rose.and.co',
  null,
  'Luksuzni kozmetički salon u Porto Montenegro.',
  'Rose & Co. nudi kompletnu paletu kozmetičkih tretmana u luksuznom ambijentu.',
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=900&q=80&auto=format&fit=crop',
  '[{"name":"Manikir"},{"name":"Pedikir"},{"name":"Tretman lica"}]'::jsonb,
  '€20',
  5.0, 42,
  true, true, true,
  'active'
);
