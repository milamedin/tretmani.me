# tretmani.me

Svi saloni i estetski tretmani Crne Gore na jednom mjestu.

## Stack
- **Frontend:** Vanilla HTML/CSS/JS, statički generisan
- **Backend / DB:** Supabase (PostgreSQL + REST API)
- **Build:** Node.js skripta čita iz Supabase, generiše statičke stranice u `dist/`
- **Hosting:** Cloudflare Pages (auto-deploy na svaki git push)
- **Admin:** Supabase Studio (Table Editor)

## Struktura
```
.
├── index.html              # homepage source (kopira se kao-jeste u dist)
├── styles/                 # CSS
├── js/                     # client-side JS (Supabase wrapper, i18n, lightbox)
├── scripts/
│   ├── build.js            # build orchestrator
│   ├── lib/
│   │   ├── db.js           # Supabase REST client (build-time)
│   │   ├── sitemap.js      # sitemap.xml generator
│   │   └── utils.js        # fs + escape helpers
│   └── templates/
│       ├── _shared.js      # header, footer, salon card
│       ├── salon.js        # salon detail page template
│       └── listing.js      # grad / kategorija / combo / saloni
├── data/
│   ├── schema.sql          # Supabase schema (run once)
│   ├── patch-001-grants.sql
│   ├── patch-002-sminka.sql
│   └── seed-test-salons.sql
└── dist/                   # build output (gitignored)
```

## Lokalni development

```bash
# Pokreni build i serviraj sa dist/
npm run dev

# Samo build (ne pali server)
npm run build
```

Sajt će biti na **http://localhost:4340**.

## Šta build generiše
Za svaki request na Supabase, build napravi:
- `/salon/{slug}/index.html` — detail stranica po salonu
- `/grad/{slug}/index.html` — gradska landing
- `/grad/{slug}/{kategorija-slug}/index.html` — **city × category combo** (top SEO target)
- `/kategorija/{slug}/index.html` — kategorija cross-city
- `/saloni/index.html` — lista svih
- `/uslovi/`, `/privatnost/`, `/kontakt/` — info stranice
- `sitemap.xml` + `robots.txt`

## Deploy (Cloudflare Pages)

Cloudflare Pages je već povezan na ovaj repo. Build settings:

| Setting | Value |
|---|---|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |
| **Node version** | `18` ili noviji |

Auto-deploy: svaki push na `main` pokreće build i deploy (~30s).

## Database

### Supabase setup (jednom)
1. Otvoriti Supabase projekt
2. SQL Editor → pokrenuti `data/schema.sql`
3. Pokrenuti `data/patch-001-grants.sql` (grants za anon role)
4. (Opciono) `data/seed-test-salons.sql` za 3 demo salona

### Dodati novi salon
1. Supabase Studio → Tables → `salons` → Insert row
2. Pop'uniti `slug`, `name`, `category_id`, `city_id`, ...
3. `git push` praznog commita (ili commit promjene)
4. Cloudflare Pages će ponovo buildovati i nova stranica je live

Buduće: webhook iz Supabase na promjenu → trigger CF Pages deploy hook (bez praznog commita).

## Brand
- Paleta: Beauty rose (off-white #FAF6F0 + dusty rose #C9A0A0 + wine #5A2A2A + gold #B59A6F)
- Fontovi: Cormorant Garamond (display, italic accent) + Inter (body)
- Logo: lowercase serif "tretmani" + rose dot + small caps "ME"

## Jezici
ME (default) + EN. Toggle u nav-u, izbor se pamti u localStorage.
