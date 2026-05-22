// Privremeni demo-cijenovnici za 3 test salona dok DB nije ažurirana
// preko data/patch-003-rich-services.sql.
// Build koristi ovaj fallback SAMO ako salon NEMA price polje u services iz DB-a.
// Posle pokretanja SQL patch-a, ovi fallback-i se NE primjenjuju.

export const DEMO_SERVICES = {
  'lumiere-aesthetics': [
    { group: 'Estetski tretmani lica', name: 'HIFU lifting (cijelo lice)', description: 'Neinvazivni lifting, trajanje rezultata do 18 mjeseci · 90 min', price: '350', from: true },
    { group: 'Estetski tretmani lica', name: 'PRP tretman lica', description: 'Vampirski tretman vlastitom plazmom · 60 min', price: '180' },
    { group: 'Estetski tretmani lica', name: 'Mezoterapija lica', description: 'Mikroiglice + serum, hidratacija i obnavljanje · 45 min', price: '90' },
    { group: 'Estetski tretmani lica', name: 'Higijenski tretman lica', description: 'Dubinsko čišćenje + maska + masaža · 60 min', price: '45' },
    { group: 'Laserska epilacija', name: 'Cijelo tijelo (žene)', description: 'Sve regije, 1 tretman', price: '220' },
    { group: 'Laserska epilacija', name: 'Paket 10 tretmana', description: 'Dijamantni laser, garantovan rezultat', price: '1800' },
    { group: 'Tijelo', name: 'Anti-celulit tretman (LPG)', description: 'Limfna drenaža + endermologija · 50 min', price: '60' },
    { group: 'Tijelo', name: 'Kavitacija', description: 'Razgradnja masnih ćelija · 45 min', price: '55' },
  ],
  'bella-studio': [
    { group: 'Šišanje i styling', name: 'Žensko šišanje', description: 'Konsultacija + pranje + šišanje + feniranje', price: '25' },
    { group: 'Šišanje i styling', name: 'Muško šišanje', description: 'Klasično ili moderno', price: '15' },
    { group: 'Šišanje i styling', name: 'Dječije šišanje', description: 'Do 12 godina', price: '10' },
    { group: 'Farbanje', name: 'Farbanje cijele dužine', description: 'Profesionalne boje, uključuje pranje i feniranje', price: '45', from: true },
    { group: 'Farbanje', name: 'Balayage / Highlights', description: 'Prirodan ombre efekat', price: '75', from: true },
    { group: 'Farbanje', name: 'Pramenovi', description: 'Klasični ili karamel', price: '55' },
    { group: 'Tretmani', name: 'Keratinski tretman', description: 'Glačanje + nutrijenti, traje do 4 mjeseca', price: '90', from: true },
    { group: 'Tretmani', name: 'Olaplex obnova', description: 'Obnova oštećene kose · 40 min', price: '40' },
  ],
  'rose-co': [
    { group: 'Nokti', name: 'Klasični manikir', description: 'Oblikovanje + nega kutikule + lak · 45 min', price: '15' },
    { group: 'Nokti', name: 'Manikir sa trajnim lakom', description: 'Gel polish, traje 2-3 sedmice', price: '25' },
    { group: 'Nokti', name: 'Klasični pedikir', description: 'Oblikovanje + nega + masaža stopala · 60 min', price: '20' },
    { group: 'Nokti', name: 'Medicinski pedikir', description: 'Stručan tretman urasli nokat, žuljevi, kalusi', price: '35' },
    { group: 'Tretmani lica', name: 'Higijenski tretman lica', description: 'Dubinsko čišćenje + maska · 60 min', price: '40' },
    { group: 'Tretmani lica', name: 'Anti-age tretman', description: 'Hidratacija + kolagen serum', price: '55' },
    { group: 'Depilacija', name: 'Cijela noga', description: 'Topli vosak, profesionalno', price: '18' },
    { group: 'Depilacija', name: 'Pazuh', description: 'Brzo i bezbolno', price: '7' },
    { group: 'Depilacija', name: 'Bikini linija', description: 'Klasično ili brazilski', price: '15', from: true },
  ],
};

export function enrichSalonServices(salons) {
  return salons.map(s => {
    const hasRichServices = Array.isArray(s.services) && s.services.some(svc => svc && svc.price);
    if (!hasRichServices && DEMO_SERVICES[s.slug]) {
      return { ...s, services: DEMO_SERVICES[s.slug] };
    }
    return s;
  });
}
