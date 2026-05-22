import { escapeHtml as e, pluralize } from '../lib/utils.js';
import { page, salonCard } from './_shared.js';

// Used for: city landing, category landing, city × category combo, all-salons listing.
export function buildListingPage({
  kind,           // 'city' | 'category' | 'combo' | 'all'
  city,           // { slug, name } | null
  category,       // { slug, name, icon } | null
  salons,
  allCategories,
  allCities,
}) {
  let title, h1, h1Em, intro, canonical, ogImage;

  if (kind === 'combo' && city && category) {
    title = `${category.name} ${city.name} — Saloni i cijene | tretmani.me`;
    h1 = category.name;
    h1Em = `u ${city.name}`;
    intro = `Pregled svih ${category.name.toLowerCase()} salona u ${city.name}. Pronađi salon, vidi cijene i recenzije, pozovi direktno.`;
    canonical = `https://tretmani.me/grad/${city.slug}/${category.slug}/`;
  } else if (kind === 'city' && city) {
    title = `Saloni u ${city.name} — frizerski, kozmetički, estetski | tretmani.me`;
    h1 = `Saloni`;
    h1Em = `u ${city.name}`;
    intro = `Svi verifikovani saloni u ${city.name} na jednom mjestu — frizerski, kozmetički, estetski tretmani i wellness.`;
    canonical = `https://tretmani.me/grad/${city.slug}/`;
  } else if (kind === 'category' && category) {
    title = `${category.name} Crna Gora — Saloni i cijene | tretmani.me`;
    h1 = category.name;
    h1Em = `u Crnoj Gori`;
    intro = `${category.name} u Crnoj Gori — sve gradove, sve cijene, sve recenzije. Pronađi najbolji salon i pozovi direktno.`;
    canonical = `https://tretmani.me/kategorija/${category.slug}/`;
  } else {
    title = `Svi saloni Crne Gore | tretmani.me`;
    h1 = `Svi`;
    h1Em = `saloni Crne Gore`;
    intro = `Kompletna lista verifikovanih salona u Crnoj Gori. Filtriraj po gradu i kategoriji.`;
    canonical = `https://tretmani.me/saloni/`;
  }

  ogImage = salons[0]?.cover_image || '';

  const count = salons.length;
  const countLabel = pluralize(count, 'salon', 'salona', 'salona');
  const foundLabel = pluralize(count, 'pronađen', 'pronađena', 'pronađeno');

  const body = `
  <section class="listing-hero">
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumbs">
        <a href="/">Početna</a>
        <span class="crumbs__sep">›</span>
        ${kind === 'combo' ? `<a href="/grad/${e(city.slug)}/">${e(city.name)}</a><span class="crumbs__sep">›</span><span>${e(category.name)}</span>` : ''}
        ${kind === 'city' ? `<span>${e(city.name)}</span>` : ''}
        ${kind === 'category' ? `<span>${e(category.name)}</span>` : ''}
        ${kind === 'all' ? `<span>Svi saloni</span>` : ''}
      </nav>

      <div class="listing-hero__inner">
        <div class="listing-hero__content">
          <span class="eyebrow">${kind === 'combo' ? 'Lokalni izbor' : kind === 'city' ? 'Gradski vodič' : kind === 'category' ? 'Po kategoriji' : 'Cijela CG'}</span>
          <h1 class="listing-hero__title">${e(h1)} <em>${e(h1Em)}</em></h1>
          <p class="listing-hero__intro">${e(intro)}</p>
          <div class="listing-hero__count">
            <strong>${count}</strong> ${e(countLabel)} ${e(foundLabel)}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="explorer">
    <div class="container">

      <div class="filters listing-filters">
        ${kind !== 'all' && kind !== 'city' && allCategories ? `
        <div class="filter-chips">
          <a href="${kind === 'combo' ? `/grad/${e(city.slug)}/` : '/saloni/'}" class="chip">Sve kategorije</a>
          ${allCategories.map(c => {
            const href = city ? `/grad/${e(city.slug)}/${e(c.slug)}/` : `/kategorija/${e(c.slug)}/`;
            const isActive = category && category.slug === c.slug;
            return `<a href="${href}" class="chip ${isActive ? 'chip--active' : ''}">${e(c.icon || '')} ${e(c.name)}</a>`;
          }).join('')}
        </div>` : ''}

        ${(kind === 'city' || kind === 'all') && allCategories ? `
        <div class="filter-chips">
          ${allCategories.map(c => {
            const href = city ? `/grad/${e(city.slug)}/${e(c.slug)}/` : `/kategorija/${e(c.slug)}/`;
            return `<a href="${href}" class="chip">${e(c.icon || '')} ${e(c.name)}</a>`;
          }).join('')}
        </div>` : ''}

        ${kind === 'category' && allCities ? `
        <div class="filter-chips">
          ${allCities.slice(0, 8).map(c => `<a href="/grad/${e(c.slug)}/${e(category.slug)}/" class="chip">${e(c.name)}</a>`).join('')}
        </div>` : ''}
      </div>

      <div class="salons">
        ${salons.length === 0
          ? `<div class="salons__empty">Trenutno nema salona u ovoj kategoriji. <a href="/" style="text-decoration: underline">Pretraži druge.</a></div>`
          : salons.map(salonCard).join('')}
      </div>

    </div>
  </section>`;

  return page({
    title,
    description: intro,
    canonical,
    ogImage,
    body,
    categories: allCategories,
    cities: allCities,
  });
}

export function buildSimpleInfoPage({ title, body, allCategories, allCities }) {
  return page({
    title: `${title} | tretmani.me`,
    description: title,
    canonical: '',
    body: `
    <section class="section">
      <div class="container" style="max-width: 720px;">
        <h1 class="section__title">${e(title)}</h1>
        ${body}
      </div>
    </section>`,
    categories: allCategories,
    cities: allCities,
  });
}
