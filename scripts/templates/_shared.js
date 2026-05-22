import { escapeHtml as e } from '../lib/utils.js';

export function head({ title, description, canonical, ogImage, extraHead = '' }) {
  return `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${e(title)}</title>
  <meta name="description" content="${e(description)}" />
  <meta property="og:title" content="${e(title)}" />
  <meta property="og:description" content="${e(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="sr_ME" />
  ${ogImage ? `<meta property="og:image" content="${e(ogImage)}" />` : ''}
  ${canonical ? `<link rel="canonical" href="${e(canonical)}" />` : ''}
  <link rel="stylesheet" href="/styles/main.css" />
  ${extraHead}`;
}

export function header() {
  return `
  <header class="header">
    <div class="container header__inner">
      <a href="/" class="logo">
        tretmani<span class="logo__dot">.</span><span class="logo__suffix">ME</span>
      </a>
      <nav class="nav">
        <button id="lang-toggle" class="lang-toggle" aria-label="Promijeni jezik">EN</button>
        <a href="/#cta-salons" class="nav__link nav__cta" data-i18n="nav.za_salone">Za salone</a>
      </nav>
    </div>
  </header>`;
}

export function footer({ categories = [], cities = [] } = {}) {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__col footer__about">
          <a href="/" class="logo">
            tretmani<span class="logo__dot">.</span><span class="logo__suffix">ME</span>
          </a>
          <p data-i18n="footer.tagline">Svi saloni Crne Gore na jednom mjestu. Pronađi pravo mjesto za sebe.</p>
          <div class="footer__social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="TikTok">TT</a>
          </div>
        </div>
        <div class="footer__col">
          <h4 data-i18n="footer.categories">Kategorije</h4>
          <ul>
            ${categories.map(c => `<li><a href="/kategorija/${e(c.slug)}/">${e(c.name)}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer__col">
          <h4 data-i18n="footer.cities">Gradovi</h4>
          <ul>
            ${cities.slice(0, 6).map(c => `<li><a href="/grad/${e(c.slug)}/">${e(c.name)}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer__col">
          <h4 data-i18n="footer.info">Informacije</h4>
          <ul>
            <li><a href="/#cta-salons" data-i18n="footer.for_salons">Za salone</a></li>
            <li><a href="mailto:info@tretmani.me" data-i18n="footer.contact">Kontakt</a></li>
            <li><a href="/uslovi/" data-i18n="footer.terms">Uslovi korišćenja</a></li>
            <li><a href="/privatnost/" data-i18n="footer.privacy">Privatnost</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© 2026 tretmani.me · <span data-i18n="footer.rights">Sva prava zadržana</span></span>
        <span>Crna Gora · ME</span>
      </div>
    </div>
  </footer>`;
}

export function scripts({ extraScripts = '' } = {}) {
  return `
  <script src="/js/config.js"></script>
  <script src="/js/supabase.js"></script>
  <script src="/js/i18n.js"></script>
  ${extraScripts}`;
}

export function salonCard(s) {
  const cover = s.cover_image || 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=700&q=80&auto=format&fit=crop';
  const services = (Array.isArray(s.services) ? s.services : [])
    .slice(0, 3)
    .map(svc => svc.name || svc)
    .filter(Boolean);
  const badge = s.is_featured
    ? `<span class="salon__badge">★ <span data-i18n="card.featured">Izdvojeno</span></span>`
    : (s.is_verified ? `<span class="salon__badge salon__badge--new" data-i18n="card.new">Novo</span>` : '');
  const ratingNum = typeof s.rating === 'number' ? s.rating.toFixed(1) : (s.rating || '—');
  const priceFrom = s.price_range || '';

  return `
    <a href="/salon/${e(s.slug)}/" class="salon" data-salon-id="${e(s.id)}">
      <div class="salon__image">
        <img src="${e(cover)}" alt="${e(s.name)}" loading="lazy" />
        ${badge}
        <span class="salon__heart" role="button" aria-label="Sačuvaj" data-i18n-attr="aria-label:card.save">♡</span>
      </div>
      <div class="salon__body">
        <div class="salon__meta">
          <div class="salon__category">${e(s.category_name || '')}</div>
          <div class="salon__rating">${e(ratingNum)} <span>(${e(s.review_count || 0)})</span></div>
        </div>
        <h3 class="salon__name">${e(s.name)}</h3>
        <div class="salon__location">${e(s.city_name || '')}</div>
        ${services.length ? `<div class="salon__services">${services.map(svc => `<span>${e(svc)}</span>`).join('')}</div>` : ''}
        <div class="salon__footer">
          <div class="salon__price">${priceFrom ? `<span data-i18n="card.from">od</span> <strong>${e(priceFrom)}</strong>` : ''}</div>
          <button class="salon__phone-btn" data-salon-id="${e(s.id)}" data-phone="${e(s.phone || '')}" data-i18n="card.show_phone">Prikaži broj</button>
        </div>
      </div>
    </a>`;
}

export function page({ title, description, canonical, ogImage, lang = 'me', extraHead = '', extraScripts = '', body, categories = [], cities = [] }) {
  return `<!DOCTYPE html>
<html lang="${e(lang)}">
<head>${head({ title, description, canonical, ogImage, extraHead })}
</head>
<body>
${header()}
<main>
${body}
</main>
${footer({ categories, cities })}
${scripts({ extraScripts })}
</body>
</html>`;
}
