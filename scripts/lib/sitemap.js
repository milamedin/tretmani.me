const SITE = 'https://tretmani.me';

function urlEntry(loc, priority = '0.5', changefreq = 'weekly') {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function buildSitemap({ salons, cities, categories }) {
  const entries = [];
  entries.push(urlEntry('/', '1.0', 'daily'));
  entries.push(urlEntry('/saloni/', '0.9', 'daily'));

  for (const c of categories) {
    entries.push(urlEntry(`/kategorija/${c.slug}/`, '0.8', 'weekly'));
  }

  for (const city of cities) {
    entries.push(urlEntry(`/grad/${city.slug}/`, '0.8', 'weekly'));
    for (const cat of categories) {
      // Combo URL — high-value SEO target
      entries.push(urlEntry(`/grad/${city.slug}/${cat.slug}/`, '0.7', 'weekly'));
    }
  }

  for (const s of salons) {
    entries.push(urlEntry(`/salon/${s.slug}/`, '0.6', 'weekly'));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

export const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://tretmani.me/sitemap.xml
`;
