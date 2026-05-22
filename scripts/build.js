#!/usr/bin/env node
// tretmani.me — build orchestrator.
// Reads Supabase data, generates static HTML for every salon, city, category, combo.
// Output: dist/

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureDir, writeFile, copyDir, readConfigCredentials, exists } from './lib/utils.js';
import { makeClient, fetchAllData } from './lib/db.js';
import { buildSalonPage } from './templates/salon.js';
import { buildListingPage, buildSimpleInfoPage } from './templates/listing.js';
import { buildSitemap, ROBOTS_TXT } from './lib/sitemap.js';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const OUT = path.join(ROOT, 'dist');

function log(msg) { console.log(`  · ${msg}`); }

async function clean() {
  await fs.rm(OUT, { recursive: true, force: true });
  await ensureDir(OUT);
}

async function copyStatic() {
  // Files/dirs that ship to dist as-is.
  for (const dir of ['styles', 'js', 'assets']) {
    if (await exists(path.join(ROOT, dir))) {
      await copyDir(path.join(ROOT, dir), path.join(OUT, dir));
    }
  }
  // Homepage stays static (hydrates from Supabase client-side).
  if (await exists(path.join(ROOT, 'index.html'))) {
    await fs.copyFile(path.join(ROOT, 'index.html'), path.join(OUT, 'index.html'));
  }
}

function getRelatedSalons(salon, allSalons, limit = 3) {
  // Prefer same category + same city, then same category any city, then any.
  const sameBoth = allSalons.filter(s => s.id !== salon.id && s.category_slug === salon.category_slug && s.city_slug === salon.city_slug);
  const sameCat = allSalons.filter(s => s.id !== salon.id && s.category_slug === salon.category_slug && !sameBoth.includes(s));
  const others = allSalons.filter(s => s.id !== salon.id && !sameBoth.includes(s) && !sameCat.includes(s));
  return [...sameBoth, ...sameCat, ...others].slice(0, limit);
}

async function buildSalonDetailPages(data) {
  const { salons, categories, cities } = data;
  let count = 0;
  for (const salon of salons) {
    const related = getRelatedSalons(salon, salons);
    const html = buildSalonPage({ salon, categories, cities, related });
    await writeFile(path.join(OUT, 'salon', salon.slug, 'index.html'), html);
    count++;
  }
  log(`${count} salon detail pages`);
}

async function buildCityPages(data) {
  const { salons, categories, cities } = data;
  let total = 0;
  let combo = 0;
  for (const city of cities) {
    const citySalons = salons.filter(s => s.city_slug === city.slug);
    if (citySalons.length === 0) continue;

    // City landing (all salons in city)
    await writeFile(
      path.join(OUT, 'grad', city.slug, 'index.html'),
      buildListingPage({ kind: 'city', city, salons: citySalons, allCategories: categories, allCities: cities })
    );
    total++;

    // City × Category combo pages
    for (const cat of categories) {
      const comboSalons = citySalons.filter(s => s.category_slug === cat.slug);
      if (comboSalons.length === 0) continue;
      await writeFile(
        path.join(OUT, 'grad', city.slug, cat.slug, 'index.html'),
        buildListingPage({ kind: 'combo', city, category: cat, salons: comboSalons, allCategories: categories, allCities: cities })
      );
      combo++;
    }
  }
  log(`${total} city pages + ${combo} city×category combos`);
}

async function buildCategoryPages(data) {
  const { salons, categories, cities } = data;
  let count = 0;
  for (const cat of categories) {
    const catSalons = salons.filter(s => s.category_slug === cat.slug);
    if (catSalons.length === 0) continue;
    await writeFile(
      path.join(OUT, 'kategorija', cat.slug, 'index.html'),
      buildListingPage({ kind: 'category', category: cat, salons: catSalons, allCategories: categories, allCities: cities })
    );
    count++;
  }
  log(`${count} category pages`);
}

async function buildAllSalonsPage(data) {
  const { salons, categories, cities } = data;
  await writeFile(
    path.join(OUT, 'saloni', 'index.html'),
    buildListingPage({ kind: 'all', salons, allCategories: categories, allCities: cities })
  );
  log(`/saloni/ index`);
}

async function buildInfoPages(data) {
  const { categories, cities } = data;
  const pages = [
    {
      path: ['uslovi', 'index.html'],
      title: 'Uslovi korišćenja',
      body: `<p>Korišćenjem sajta tretmani.me prihvataš ove uslove. Sve informacije o salonima su pribavljene direktno od vlasnika ili javnih izvora. Saloni su odgovorni za tačnost svojih podataka. tretmani.me ne posreduje u uslugama — služi isključivo za prikazivanje informacija i direktan kontakt.</p>
      <p>Za pitanja o ovim uslovima: <a href="mailto:info@tretmani.me">info@tretmani.me</a></p>`,
    },
    {
      path: ['privatnost', 'index.html'],
      title: 'Politika privatnosti',
      body: `<p>tretmani.me ne čuva lične podatke posjetilaca. Koristimo anonimne agregatne statistike (broj pregleda po salonu, broj klikova na telefon) koje koristimo za interne izvještaje i za izvještaje koje šaljemo salonima.</p>
      <p>Ne koristimo cookies za praćenje. Ne dijelimo podatke sa trećim stranama. Sav sadržaj salona je javno dostupan i pribavljen uz dozvolu salona.</p>
      <p>Za pitanja: <a href="mailto:info@tretmani.me">info@tretmani.me</a></p>`,
    },
    {
      path: ['kontakt', 'index.html'],
      title: 'Kontakt',
      body: `<p>Za sva pitanja, prijedloge ili saradnju:</p>
      <p><strong>Email:</strong> <a href="mailto:info@tretmani.me">info@tretmani.me</a></p>
      <p><strong>Instagram:</strong> @tretmani.me</p>
      <p>Ako si vlasnik salona i želiš da listingom budeš na sajtu — pošalji nam email sa imenom salona, gradom i Instagram profilom.</p>`,
    },
  ];

  for (const p of pages) {
    await writeFile(
      path.join(OUT, ...p.path),
      buildSimpleInfoPage({ title: p.title, body: p.body, allCategories: categories, allCities: cities })
    );
  }
  log(`${pages.length} info pages`);
}

async function buildSitemapAndRobots(data) {
  const xml = buildSitemap(data);
  await writeFile(path.join(OUT, 'sitemap.xml'), xml);
  await writeFile(path.join(OUT, 'robots.txt'), ROBOTS_TXT);
  log(`sitemap.xml + robots.txt`);
}

async function main() {
  const start = Date.now();
  console.log('\n🔨  tretmani.me build\n');

  log('cleaning dist/');
  await clean();

  log('copying static files');
  await copyStatic();

  log('reading Supabase credentials');
  const creds = await readConfigCredentials(path.join(ROOT, 'js', 'config.js'));

  log(`fetching data from ${creds.url}`);
  const client = makeClient(creds);
  const data = await fetchAllData(client);
  log(`${data.salons.length} salons, ${data.categories.length} categories, ${data.cities.length} cities`);

  await buildSalonDetailPages(data);
  await buildCityPages(data);
  await buildCategoryPages(data);
  await buildAllSalonsPage(data);
  await buildInfoPages(data);
  await buildSitemapAndRobots(data);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✓  done in ${elapsed}s — output: dist/\n`);
}

main().catch(err => {
  console.error('\n✗  build failed:\n', err);
  process.exit(1);
});
