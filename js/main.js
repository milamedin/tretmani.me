// tretmani.me — homepage frontend logic
// Hydrates salon grid from Supabase, wires filter chips + city + sort selects.
// Re-renders when language changes via window.i18n.

const state = {
  category: '',
  city: '',
  sort: 'featured',
  limit: 24,
  cache: null,
  count: 0,
};

document.addEventListener('DOMContentLoaded', () => {
  if (!window.Tretmani) return;
  bindCategoryChips();
  bindFilters();
  loadSalons();
});

document.addEventListener('i18n:changed', () => {
  if (state.cache) renderGrid(state.cache);
  updateCount(state.count);
});

function bindCategoryChips() {
  const chips = document.querySelectorAll('#category-chips .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');
      state.category = chip.dataset.category || '';
      loadSalons();
    });
  });
}

function bindFilters() {
  document.getElementById('city-select')?.addEventListener('change', (e) => {
    state.city = e.target.value;
    loadSalons();
  });

  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    loadSalons();
  });
}

async function loadSalons() {
  const grid = document.getElementById('salons-grid');
  if (!grid) return;

  const loadingMsg = t('filter.loading', 'Učitavam salone…');
  grid.innerHTML = `<div class="salons__loading">${escapeHtml(loadingMsg)}</div>`;

  try {
    const [salons, total] = await Promise.all([
      window.Tretmani.salons(state),
      window.Tretmani.salonCount({ category: state.category, city: state.city }),
    ]);

    state.cache = salons;
    state.count = total;

    updateCount(total);

    if (!salons || salons.length === 0) {
      const empty = t('filter.empty', 'Nema salona za ove filtere. Promijeni grad ili kategoriju.');
      grid.innerHTML = `<div class="salons__empty">${escapeHtml(empty)}</div>`;
      return;
    }

    renderGrid(salons);
  } catch (err) {
    console.error('Failed to load salons:', err);
    grid.innerHTML = `<div class="salons__empty">${escapeHtml(t('filter.empty', 'Greška pri učitavanju.'))}</div>`;
  }
}

function renderGrid(salons) {
  const grid = document.getElementById('salons-grid');
  if (!grid) return;
  grid.innerHTML = salons.map(renderSalonCard).join('');
  bindPhoneButtons();
}

function updateCount(total) {
  const el = document.getElementById('result-count');
  if (!el) return;
  const labelKey = total === 1 ? 'explorer.count_label_singular' : 'explorer.count_label';
  const label = t(labelKey, total === 1 ? 'salon pronađen' : 'salona pronađeno');
  el.innerHTML = `<strong>${total}</strong><span>${escapeHtml(label)}</span>`;
}

function bindPhoneButtons() {
  document.querySelectorAll('.salon__phone-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const phone = btn.dataset.phone || '+382 ## ### ###';
      btn.textContent = phone;
      btn.style.cursor = 'default';

      const salonId = btn.dataset.salonId;
      if (salonId && window.Tretmani) {
        window.Tretmani.trackEvent(Number(salonId), 'phone_click');
      }
    });
  });
}

function renderSalonCard(s) {
  const cover = s.cover_image || 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=700&q=80&auto=format&fit=crop';
  const services = (s.services && Array.isArray(s.services)
    ? s.services.slice(0, 3).map(svc => svc.name || svc).filter(Boolean)
    : []);
  const badge = s.is_featured
    ? `<span class="salon__badge">★ ${escapeHtml(t('card.featured', 'Izdvojeno'))}</span>`
    : (s.is_verified ? `<span class="salon__badge salon__badge--new">${escapeHtml(t('card.new', 'Novo'))}</span>` : '');
  const priceFrom = s.price_range || '';
  const ratingNum = typeof s.rating === 'number' ? s.rating.toFixed(1) : (s.rating || '—');
  const fromLabel = t('card.from', 'od');
  const phoneLabel = t('card.show_phone', 'Prikaži broj');
  const saveLabel = t('card.save', 'Sačuvaj');

  return `
    <a href="/salon/${escapeHtml(s.slug)}/" class="salon" data-salon-id="${s.id}">
      <div class="salon__image">
        <img src="${escapeHtml(cover)}" alt="${escapeHtml(s.name)}" loading="lazy" />
        ${badge}
        <span class="salon__heart" role="button" aria-label="${escapeHtml(saveLabel)}">♡</span>
      </div>
      <div class="salon__body">
        <div class="salon__meta">
          <div class="salon__category">${escapeHtml(s.category_name || '')}</div>
          <div class="salon__rating">${ratingNum} <span>(${s.review_count || 0})</span></div>
        </div>
        <h3 class="salon__name">${escapeHtml(s.name)}</h3>
        <div class="salon__location">${escapeHtml(s.city_name || '')}</div>
        ${services.length ? `<div class="salon__services">${services.map(svc => `<span>${escapeHtml(svc)}</span>`).join('')}</div>` : ''}
        <div class="salon__footer">
          <div class="salon__price">${priceFrom ? `${escapeHtml(fromLabel)} <strong>${escapeHtml(priceFrom)}</strong>` : ''}</div>
          <button class="salon__phone-btn" data-salon-id="${s.id}" data-phone="${escapeHtml(s.phone || '')}">${escapeHtml(phoneLabel)}</button>
        </div>
      </div>
    </a>
  `;
}

function t(key, fallback) {
  return window.i18n ? window.i18n.t(key) : (fallback || key);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
