// Lightweight i18n. Switch language by calling window.i18n.set('en' | 'me').
// Translates any element with [data-i18n="key"] (text) or [data-i18n-attr="attr:key"] (attribute).
(function () {
  const DICT = {
    me: {
      // nav
      'nav.za_salone': 'Za salone',

      // hero
      'hero.eyebrow': 'Svi saloni Crne Gore',
      'hero.title_pre': 'Tvoj ',
      'hero.title_em': 'ritual ljepote',
      'hero.title_post': ' počinje ovdje.',
      'hero.subtitle': 'Najbolji frizerski, kozmetički i estetski saloni Crne Gore na jednom mjestu. Pretraži, uporedi, i pozovi direktno.',
      'hero.stat_salons': 'verifikovanih salona',
      'hero.stat_cities': 'gradova',
      'hero.stat_rating': 'prosječna ocjena',
      'hero.badge_main': 'Beauty',
      'hero.badge_sub': 'platforma Crne Gore',

      // explorer
      'explorer.eyebrow': 'Naša kolekcija',
      'explorer.title_pre': 'Pronađi ',
      'explorer.title_em': 'svoj salon',
      'explorer.subtitle': 'Filtriraj po gradu, kategoriji i ocjeni.',
      'explorer.count_label': 'salona pronađeno',
      'explorer.count_label_singular': 'salon pronađen',
      'filter.all_categories': 'Sve kategorije',
      'filter.frizerski': '✂ Frizerski',
      'filter.kozmeticki': '✦ Kozmetički',
      'filter.estetski': '◈ Estetski',
      'filter.masaze': '❋ Masaže',
      'filter.sminka': '✿ Šminka',
      'filter.all_cities': 'Sve gradove',
      'filter.sort_featured': 'Izdvojeni prvo',
      'filter.sort_rating': 'Najbolja ocjena',
      'filter.sort_newest': 'Najnovije',
      'filter.loading': 'Učitavam salone…',
      'filter.empty': 'Nema salona za ove filtere. Promijeni grad ili kategoriju.',
      'filter.load_more': 'Učitaj još salona',

      // salon card
      'card.featured': 'Izdvojeno',
      'card.new': 'Novo',
      'card.from': 'od',
      'card.show_phone': 'Prikaži broj',
      'card.save': 'Sačuvaj',

      // why
      'why.eyebrow': 'Zašto tretmani.me',
      'why.title_pre': 'Standard ',
      'why.title_em': 'nove generacije',
      'why.subtitle': 'Kompletan vodič kroz beauty industriju u Crnoj Gori.',
      'why.1.title': 'Verifikovano',
      'why.1.desc': 'Svaki salon prolazi ručnu provjeru prije listanja.',
      'why.2.title': 'Direktan kontakt',
      'why.2.desc': 'Bez registracije, bez aplikacija — pozoveš jednim klikom.',
      'why.3.title': 'Cijela Crna Gora',
      'why.3.desc': 'Od Podgorice do Herceg Novog — 12 gradova, sve kategorije.',
      'why.4.title': 'Iskrene recenzije',
      'why.4.desc': 'Ocjene od ljudi koji su zaista bili na tretmanu.',

      // CTA salons
      'cta.eyebrow': 'Za vlasnike salona',
      'cta.title_pre': 'Tvoj salon zaslužuje ',
      'cta.title_em': 'vrhunsku prezentaciju',
      'cta.title_post': '.',
      'cta.desc': 'Listanje uz najbolje salone Crne Gore. Profesionalne fotografije, mjesečni izvještaj o pregledima i pozivima.',
      'cta.perk1': 'Profesionalna fotografija uključena',
      'cta.perk2': 'Mjesečni izvještaj o pregledima i pozivima',
      'cta.perk3': 'Bez ugovora, bez provizije po klijentu',
      'cta.btn': 'Saznaj više →',

      // footer
      'footer.tagline': 'Svi saloni Crne Gore na jednom mjestu. Pronađi pravo mjesto za sebe.',
      'footer.categories': 'Kategorije',
      'footer.cities': 'Gradovi',
      'footer.info': 'Informacije',
      'footer.cat_frizerski': 'Frizerski saloni',
      'footer.cat_kozmeticki': 'Kozmetički saloni',
      'footer.cat_estetski': 'Estetski tretmani',
      'footer.cat_masaze': 'Masaže i wellness',
      'footer.cat_sminka': 'Šminka',
      'footer.for_salons': 'Za salone',
      'footer.contact': 'Kontakt',
      'footer.terms': 'Uslovi korišćenja',
      'footer.privacy': 'Privatnost',
      'footer.rights': 'Sva prava zadržana',
    },
    en: {
      'nav.za_salone': 'For salons',

      'hero.eyebrow': 'Every salon in Montenegro',
      'hero.title_pre': 'Your ',
      'hero.title_em': 'beauty ritual',
      'hero.title_post': ' starts here.',
      'hero.subtitle': 'Montenegro\'s best hair, beauty and aesthetic salons in one place. Search, compare, and call directly.',
      'hero.stat_salons': 'verified salons',
      'hero.stat_cities': 'cities',
      'hero.stat_rating': 'average rating',
      'hero.badge_main': 'Beauty',
      'hero.badge_sub': 'platform of Montenegro',

      'explorer.eyebrow': 'Our collection',
      'explorer.title_pre': 'Find ',
      'explorer.title_em': 'your salon',
      'explorer.subtitle': 'Filter by city, category and rating.',
      'explorer.count_label': 'salons found',
      'explorer.count_label_singular': 'salon found',
      'filter.all_categories': 'All categories',
      'filter.frizerski': '✂ Hair',
      'filter.kozmeticki': '✦ Beauty',
      'filter.estetski': '◈ Aesthetics',
      'filter.masaze': '❋ Massage',
      'filter.sminka': '✿ Makeup',
      'filter.all_cities': 'All cities',
      'filter.sort_featured': 'Featured first',
      'filter.sort_rating': 'Highest rated',
      'filter.sort_newest': 'Newest',
      'filter.loading': 'Loading salons…',
      'filter.empty': 'No salons match these filters. Try a different city or category.',
      'filter.load_more': 'Load more salons',

      'card.featured': 'Featured',
      'card.new': 'New',
      'card.from': 'from',
      'card.show_phone': 'Show number',
      'card.save': 'Save',

      'why.eyebrow': 'Why tretmani.me',
      'why.title_pre': 'A new generation ',
      'why.title_em': 'standard',
      'why.subtitle': 'A complete guide to the beauty industry in Montenegro.',
      'why.1.title': 'Verified',
      'why.1.desc': 'Every salon is hand-checked before being listed.',
      'why.2.title': 'Direct contact',
      'why.2.desc': 'No sign-up, no apps — call with one tap.',
      'why.3.title': 'All of Montenegro',
      'why.3.desc': 'From Podgorica to Herceg Novi — 12 cities, every category.',
      'why.4.title': 'Honest reviews',
      'why.4.desc': 'Ratings from real people who actually visited.',

      'cta.eyebrow': 'For salon owners',
      'cta.title_pre': 'Your salon deserves a ',
      'cta.title_em': 'premium presentation',
      'cta.title_post': '.',
      'cta.desc': 'Listed alongside Montenegro\'s best salons. Professional photography, monthly views & call reports.',
      'cta.perk1': 'Professional photography included',
      'cta.perk2': 'Monthly report on views and calls',
      'cta.perk3': 'No contract, no per-client commission',
      'cta.btn': 'Learn more →',

      'footer.tagline': 'Every salon in Montenegro in one place. Find the right spot for you.',
      'footer.categories': 'Categories',
      'footer.cities': 'Cities',
      'footer.info': 'Info',
      'footer.cat_frizerski': 'Hair salons',
      'footer.cat_kozmeticki': 'Beauty salons',
      'footer.cat_estetski': 'Aesthetic treatments',
      'footer.cat_masaze': 'Massage & wellness',
      'footer.cat_sminka': 'Makeup',
      'footer.for_salons': 'For salons',
      'footer.contact': 'Contact',
      'footer.terms': 'Terms of use',
      'footer.privacy': 'Privacy',
      'footer.rights': 'All rights reserved',
    },
  };

  const STORAGE_KEY = 'tretmani.lang';
  let current = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) || 'me';
  if (!DICT[current]) current = 'me';

  function t(key) {
    return (DICT[current] && DICT[current][key]) || key;
  }

  function apply(root) {
    const scope = root || document;

    scope.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val != null) el.textContent = val;
    });

    scope.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.dataset.i18nAttr;
      spec.split(';').forEach(part => {
        const [attr, key] = part.split(':').map(s => s.trim());
        if (attr && key) {
          const val = t(key);
          if (val != null) el.setAttribute(attr, val);
        }
      });
    });

    document.documentElement.setAttribute('lang', current);
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) toggleBtn.textContent = current === 'me' ? 'EN' : 'ME';
  }

  function set(lang) {
    if (!DICT[lang]) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  }

  function toggle() {
    set(current === 'me' ? 'en' : 'me');
  }

  window.i18n = { t, set, apply, toggle, get current() { return current; } };

  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('lang-toggle')?.addEventListener('click', toggle);
  });
})();
