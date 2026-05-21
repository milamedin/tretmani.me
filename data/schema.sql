-- =====================================================
-- tretmani.me — Supabase DB schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- =====================================================

-- 1. CATEGORIES (frizerski, kozmeticki, estetski, masaze)
create table if not exists categories (
  id          smallserial primary key,
  slug        text unique not null,
  name        text not null,
  icon        text,
  sort_order  smallint default 0
);

insert into categories (slug, name, icon, sort_order) values
  ('frizerski-saloni',    'Frizerski saloni',  '✂', 1),
  ('kozmeticki-saloni',   'Kozmetički saloni', '✦', 2),
  ('estetski-tretmani',   'Estetski tretmani', '◈', 3),
  ('masaze-wellness',     'Masaže i wellness', '❋', 4)
on conflict (slug) do nothing;

-- 2. CITIES (Podgorica, Budva, Bar, ...)
create table if not exists cities (
  id          smallserial primary key,
  slug        text unique not null,
  name        text not null,
  region      text,
  sort_order  smallint default 0
);

insert into cities (slug, name, region, sort_order) values
  ('podgorica',     'Podgorica',     'centar',   1),
  ('budva',         'Budva',         'primorje', 2),
  ('bar',           'Bar',           'primorje', 3),
  ('kotor',         'Kotor',         'primorje', 4),
  ('tivat',         'Tivat',         'primorje', 5),
  ('herceg-novi',   'Herceg Novi',   'primorje', 6),
  ('niksic',        'Nikšić',        'centar',   7),
  ('cetinje',       'Cetinje',       'centar',   8),
  ('bijelo-polje',  'Bijelo Polje',  'sjever',   9),
  ('berane',        'Berane',        'sjever',  10),
  ('pljevlja',      'Pljevlja',      'sjever',  11),
  ('ulcinj',        'Ulcinj',        'primorje', 12)
on conflict (slug) do nothing;

-- 3. SALONS — the main table
create table if not exists salons (
  id                  bigserial primary key,
  slug                text unique not null,
  name                text not null,

  category_id         smallint references categories(id),
  city_id             smallint references cities(id),

  address             text,
  phone               text,
  phone_secondary     text,

  instagram           text,
  facebook            text,
  website             text,
  email               text,

  owner_name          text,
  working_hours       jsonb,
  services            jsonb,
  price_range         text,

  description         text,
  short_description   text,
  cover_image         text,
  gallery             jsonb,

  rating              numeric(3,2) default 0,
  review_count        integer default 0,

  is_featured         boolean default false,
  is_verified         boolean default false,
  is_active           boolean default true,

  subscription_status text default 'free-trial',
  subscription_start  date,
  subscription_end    date,
  monthly_fee_eur     numeric(6,2),

  internal_notes      text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists idx_salons_city      on salons(city_id);
create index if not exists idx_salons_category  on salons(category_id);
create index if not exists idx_salons_active    on salons(is_active);
create index if not exists idx_salons_featured  on salons(is_featured);

-- 4. EVENTS — tracking views and phone clicks
create table if not exists salon_events (
  id          bigserial primary key,
  salon_id    bigint references salons(id) on delete cascade,
  event_type  text not null,
  occurred_on date default current_date,
  occurred_at timestamptz default now(),
  user_agent  text,
  referrer    text,
  ip_hash     text
);

create index if not exists idx_events_salon_date on salon_events(salon_id, occurred_on);
create index if not exists idx_events_type       on salon_events(event_type);

-- 5. MONTHLY STATS — pre-aggregated for fast monthly reports
create table if not exists salon_monthly_stats (
  salon_id      bigint references salons(id) on delete cascade,
  year_month    text not null,
  profile_views integer default 0,
  phone_clicks  integer default 0,
  instagram_clicks integer default 0,
  website_clicks integer default 0,
  primary key (salon_id, year_month)
);

-- 6. PUBLIC VIEW — what the website reads (excludes internal_notes, owner contact)
create or replace view public_salons as
select
  s.id, s.slug, s.name,
  c.slug as category_slug, c.name as category_name,
  city.slug as city_slug, city.name as city_name,
  s.address, s.phone, s.instagram, s.facebook, s.website,
  s.working_hours, s.services, s.price_range,
  s.description, s.short_description, s.cover_image, s.gallery,
  s.rating, s.review_count,
  s.is_featured, s.is_verified
from salons s
left join categories c   on c.id   = s.category_id
left join cities city    on city.id = s.city_id
where s.is_active = true
  and (s.subscription_status in ('free-trial', 'active', 'featured'));

-- 7. RPC FUNCTION — call from frontend to log a view/click safely
create or replace function track_event(
  p_salon_id bigint,
  p_event_type text,
  p_ip_hash text default null,
  p_referrer text default null,
  p_user_agent text default null
) returns void
language plpgsql security definer as $$
begin
  if p_event_type not in ('view', 'phone_click', 'instagram_click', 'website_click') then
    return;
  end if;

  insert into salon_events (salon_id, event_type, ip_hash, referrer, user_agent)
  values (p_salon_id, p_event_type, p_ip_hash, p_referrer, p_user_agent);

  insert into salon_monthly_stats (salon_id, year_month, profile_views, phone_clicks, instagram_clicks, website_clicks)
  values (
    p_salon_id,
    to_char(current_date, 'YYYY-MM'),
    case when p_event_type = 'view' then 1 else 0 end,
    case when p_event_type = 'phone_click' then 1 else 0 end,
    case when p_event_type = 'instagram_click' then 1 else 0 end,
    case when p_event_type = 'website_click' then 1 else 0 end
  )
  on conflict (salon_id, year_month) do update set
    profile_views    = salon_monthly_stats.profile_views    + excluded.profile_views,
    phone_clicks     = salon_monthly_stats.phone_clicks     + excluded.phone_clicks,
    instagram_clicks = salon_monthly_stats.instagram_clicks + excluded.instagram_clicks,
    website_clicks   = salon_monthly_stats.website_clicks   + excluded.website_clicks;
end; $$;

-- 8. ROW LEVEL SECURITY — anon role can SELECT from public_salons and call track_event only
alter table salons enable row level security;
alter table salon_events enable row level security;
alter table salon_monthly_stats enable row level security;

drop policy if exists "anon can read active salons" on salons;
create policy "anon can read active salons" on salons
  for select to anon using (is_active = true);

drop policy if exists "anon can insert events" on salon_events;
create policy "anon can insert events" on salon_events
  for insert to anon with check (true);

grant execute on function track_event to anon;
grant select on public_salons to anon;
grant select on categories to anon;
grant select on cities to anon;
