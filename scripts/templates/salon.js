import { escapeHtml as e, jsonScript } from '../lib/utils.js';
import { page, salonCard } from './_shared.js';

const DAYS_ME = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

function renderServiceGroups(services) {
  // Group by `group` field. If no group set, fall back to single "Usluge" group.
  const groups = new Map();
  for (const svc of services) {
    const key = svc.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(svc);
  }
  const hasMultipleGroups = groups.size > 1 || (groups.size === 1 && [...groups.keys()][0] !== '');

  return [...groups.entries()].map(([groupName, items]) => {
    const header = hasMultipleGroups && groupName ? `<h4>${e(groupName)}</h4>` : '';
    const rows = items.map(svc => {
      const name = svc.name || svc;
      const desc = svc.description ? `<span class="pricelist__desc">${e(svc.description)}</span>` : '';
      const priceVal = svc.price;
      let priceHtml = '';
      if (priceVal != null && priceVal !== '') {
        const priceStr = String(priceVal).trim();
        const formatted = /^\d/.test(priceStr) ? `€${priceStr}` : priceStr;
        const prefix = svc.from ? `<span class="pricelist__from">od</span> ` : '';
        priceHtml = `<span class="pricelist__price">${prefix}${e(formatted)}</span>`;
      } else {
        priceHtml = `<span class="pricelist__price pricelist__price--ask">cijena na upit</span>`;
      }
      return `<div class="pricelist__row"><div><span class="pricelist__name">${e(name)}</span>${desc}</div>${priceHtml}</div>`;
    }).join('');
    return `<div class="pricelist__group">${header}${rows}</div>`;
  }).join('');
}

export function buildSalonPage({ salon, categories, cities, related = [] }) {
  const cover = salon.cover_image || 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=80&auto=format&fit=crop';

  // Build gallery — use gallery array if present, else duplicate cover with placeholders.
  const galleryUrls = (Array.isArray(salon.gallery) && salon.gallery.length > 0)
    ? salon.gallery
    : [cover,
       'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1200&q=80&auto=format&fit=crop'];

  // First 5 visible in grid, rest go to lightbox-only.
  const visible = galleryUrls.slice(0, 5);
  const extra = galleryUrls.slice(5);

  const services = Array.isArray(salon.services) ? salon.services : [];
  const hours = salon.working_hours && typeof salon.working_hours === 'object' ? salon.working_hours : null;

  const title = `${salon.name} — ${salon.category_name || 'Salon'} ${salon.city_name || 'Crna Gora'} | tretmani.me`;
  const description = salon.short_description
    || `${salon.name} — ${salon.category_name || 'salon'} u ${salon.city_name || 'Crnoj Gori'}. Cijene, fotografije, kontakt. Verifikovan na tretmani.me.`;
  const canonical = `https://tretmani.me/salon/${salon.slug}/`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: salon.name,
    image: galleryUrls.slice(0, 3),
    url: canonical,
    telephone: salon.phone || undefined,
    priceRange: salon.price_range ? `${salon.price_range}+` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: salon.address || undefined,
      addressLocality: salon.city_name || undefined,
      addressCountry: 'ME',
    },
    aggregateRating: (salon.rating && salon.review_count) ? {
      '@type': 'AggregateRating',
      ratingValue: String(salon.rating),
      reviewCount: String(salon.review_count),
    } : undefined,
  };

  const body = `
  <div class="container">

    <nav class="crumbs" aria-label="Breadcrumbs">
      <a href="/">Početna</a>
      <span class="crumbs__sep">›</span>
      ${salon.city_slug ? `<a href="/grad/${e(salon.city_slug)}/">${e(salon.city_name)}</a><span class="crumbs__sep">›</span>` : ''}
      ${salon.category_slug ? `<a href="/kategorija/${e(salon.category_slug)}/">${e(salon.category_name)}</a><span class="crumbs__sep">›</span>` : ''}
      <span>${e(salon.name)}</span>
    </nav>

    <section class="salon-head">
      <div class="salon-head__top">
        <div>
          <h1 class="salon-head__title">${e(salon.name)}</h1>
          <div class="salon-head__meta">
            <span class="salon-head__meta__rating"><strong>${e(salon.rating || '—')}</strong> <span style="color: var(--text-muted)">(${e(salon.review_count || 0)} recenzija)</span></span>
            <span class="salon-head__sep">·</span>
            <span>${e(salon.category_name || '')}</span>
            ${salon.city_name ? `<span class="salon-head__sep">·</span><span>${e(salon.city_name)}</span>` : ''}
            ${salon.is_verified ? `<span class="salon-head__verified">✓ Verifikovano</span>` : ''}
          </div>
        </div>
        <div class="salon-head__actions">
          <button class="salon-head__btn">♡ Sačuvaj</button>
          <button class="salon-head__btn">↗ Podijeli</button>
        </div>
      </div>
    </section>

    <section class="gallery" aria-label="Galerija" id="gallery">
      ${visible.map((url, i) => `
      <button type="button" class="gallery__item ${i === 0 ? 'gallery__item--main' : ''}" data-gallery-index="${i}">
        <img src="${e(url)}" alt="${e(salon.name)} — fotografija ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" />
        ${i === visible.length - 1 && galleryUrls.length > 5 ? `<span class="gallery__more">⊞ Sve fotografije (${galleryUrls.length})</span>` : ''}
      </button>`).join('')}
    </section>

    ${extra.length ? `<div id="gallery-extra" hidden>
      ${extra.map((url, i) => `<img data-gallery-index="${i + 5}" src="${e(url)}" alt="${e(salon.name)} — fotografija ${i + 6}" />`).join('')}
    </div>` : ''}

    <div class="salon-layout">

      <article class="salon-content">

        ${salon.description ? `
        <section class="block">
          <h2 class="block__title">O salonu</h2>
          <div class="block__text">
            ${salon.description.split('\n\n').map(p => `<p>${e(p)}</p>`).join('')}
          </div>
        </section>` : ''}

        ${services.length ? `
        <section class="block">
          <h2 class="block__title">Usluge i cijenovnik</h2>
          <div class="pricelist">
            ${renderServiceGroups(services)}
          </div>
        </section>` : ''}

        ${hours ? `
        <section class="block">
          <h2 class="block__title">Radno vrijeme</h2>
          <div class="hours">
            ${DAYS_ME.map(day => {
              const key = day.toLowerCase();
              const today = new Date().getDay(); // 0=ned, 1=pon, ...
              const idx = DAYS_ME.indexOf(day);
              const isToday = (today === 0 ? 6 : today - 1) === idx;
              const time = hours[key] || hours[day] || null;
              const cls = isToday ? 'hours__row hours__row--today' : 'hours__row';
              const dayLabel = isToday ? `${day} · danas` : day;
              return `<div class="${cls}"><span class="hours__day">${e(dayLabel)}</span>${time ? `<span class="hours__time">${e(time)}</span>` : `<span class="hours__closed">Zatvoreno</span>`}</div>`;
            }).join('')}
          </div>
        </section>` : ''}

        ${salon.address ? `
        <section class="block">
          <h2 class="block__title">Lokacija</h2>
          <div class="map-block">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=18.5%2C42.0%2C20.5%2C43.0&layer=mapnik&marker=42.44%2C19.26"
              loading="lazy"
              title="Lokacija salona ${e(salon.name)}"></iframe>
            <div class="map-block__footer">
              <span class="map-block__address">${e(salon.address)}</span>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.address)}" class="map-block__link" target="_blank" rel="noopener">Pokaži uputstva →</a>
            </div>
          </div>
        </section>` : ''}

      </article>

      <aside class="sidebar">
        <div class="contact-card">
          ${salon.price_range ? `
          <div class="contact-card__price">
            <span class="contact-card__price__from" data-i18n="card.from">od</span>
            <span class="contact-card__price__num">${e(salon.price_range)}</span>
            <span class="contact-card__price__label">/ tretman</span>
          </div>` : ''}

          <button class="contact-card__cta contact-card__cta--phone" id="phone-reveal" data-salon-id="${e(salon.id)}" data-phone="${e(salon.phone || '')}">📞 Prikaži broj</button>

          <div class="contact-card__secondary">
            ${salon.phone ? `<a href="https://wa.me/${e(salon.phone.replace(/\D/g, ''))}" class="contact-card__btn" target="_blank" rel="noopener">WhatsApp</a>` : ''}
            ${salon.phone ? `<a href="viber://chat?number=${e(salon.phone.replace(/\D/g, ''))}" class="contact-card__btn">Viber</a>` : ''}
          </div>

          <div class="contact-card__info">
            ${salon.address ? `
            <div class="contact-card__row">
              <span class="contact-card__row__icon">◌</span>
              <div>
                <span class="contact-card__row__label">Adresa</span>
                <span class="contact-card__row__value">${e(salon.address)}</span>
              </div>
            </div>` : ''}
            ${salon.email ? `
            <div class="contact-card__row">
              <span class="contact-card__row__icon">✉</span>
              <div>
                <span class="contact-card__row__label">Email</span>
                <span class="contact-card__row__value">${e(salon.email)}</span>
              </div>
            </div>` : ''}
          </div>

          ${(salon.instagram || salon.facebook || salon.website) ? `
          <div class="contact-card__socials">
            ${salon.instagram ? `<a href="https://instagram.com/${e(salon.instagram.replace(/^@/, ''))}" target="_blank" rel="noopener" class="contact-card__social">Instagram</a>` : ''}
            ${salon.facebook ? `<a href="${e(salon.facebook.startsWith('http') ? salon.facebook : 'https://facebook.com/' + salon.facebook)}" target="_blank" rel="noopener" class="contact-card__social">Facebook</a>` : ''}
            ${salon.website ? `<a href="${e(salon.website)}" target="_blank" rel="noopener" class="contact-card__social">Web</a>` : ''}
          </div>` : ''}
        </div>
      </aside>

    </div>

  </div>

  ${related.length ? `
  <section class="section related-section">
    <div class="container">
      <div class="section__header">
        <div>
          <span class="eyebrow">Slični saloni</span>
          <h2 class="section__title">Još <em>${e(salon.category_name?.toLowerCase() || 'salona')}</em> ${salon.city_name ? `u ${e(salon.city_name)}` : 'u Crnoj Gori'}</h2>
        </div>
        ${salon.city_slug ? `<a href="/grad/${e(salon.city_slug)}/" class="section__link">Vidi sve →</a>` : ''}
      </div>
      <div class="salons">
        ${related.map(salonCard).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- LIGHTBOX -->
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Galerija">
    <div class="lightbox__inner">
      <div class="lightbox__image-wrap">
        <img class="lightbox__img" id="lightbox-img" src="" alt="" />
      </div>
      <button class="lightbox__nav lightbox__nav--prev" id="lightbox-prev" aria-label="Prethodna">‹</button>
      <button class="lightbox__nav lightbox__nav--next" id="lightbox-next" aria-label="Sljedeća">›</button>
      <button class="lightbox__close" id="lightbox-close" aria-label="Zatvori">✕</button>
      <div class="lightbox__counter" id="lightbox-counter">1 / ${galleryUrls.length}</div>
    </div>
  </div>`;

  return page({
    title,
    description,
    canonical,
    ogImage: galleryUrls[0],
    extraHead: `
  <link rel="stylesheet" href="/styles/salon.css" />
  <script type="application/ld+json">${jsonScript(jsonld)}</script>`,
    extraScripts: `<script src="/js/salon.js"></script>`,
    body,
    categories,
    cities,
  });
}
