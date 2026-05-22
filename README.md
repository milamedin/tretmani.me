# tretmani.me

Svi saloni i estetski tretmani Crne Gore na jednom mjestu.

## Stack
- **Frontend:** Vanilla HTML/CSS/JS na Cloudflare Pages (git deploy)
- **Backend / DB:** Supabase (PostgreSQL + REST API + Auth)
- **Admin:** Supabase Studio (Table Editor)
- **Hosting:** Cloudflare Pages (frontend) + Supabase (data + tracking)

## Struktura
```
.
├── index.html             # homepage
├── styles/
│   ├── tokens.css         # design tokens (Beauty rose palette)
│   └── main.css           # all UI styles
├── js/
│   └── main.js            # frontend logic + Supabase calls
├── data/
│   └── schema.sql         # Supabase database schema
├── assets/
│   └── img/               # logo, favicons, salon photos
└── README.md
```

## Lokalni preview
```
npx serve . -p 4340
# ili
python3 -m http.server 4340
```

## Deploy
1. Push na `main` → Cloudflare Pages auto-deploy
2. Custom domain: tretmani.me (preko Cloudflare DNS)

## Database setup (jednom)
1. Otvoriti Supabase projekt (https://supabase.com)
2. SQL Editor → kopirati i pokrenuti `data/schema.sql`
3. Settings → API → kopirati URL i `anon` key
4. Dodati u `js/main.js` (ili `.env` ako koristimo build step)

## Brand
- Paleta: Beauty rose (off-white #FAF7F2 + dusty rose #C9A0A0 + tamno sivo #2A2520)
- Font: Cormorant Garamond (display) + Inter (body)
