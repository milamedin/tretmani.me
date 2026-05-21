// tretmani.me — frontend logic.
// Loads dynamic data from Supabase, falls back to static demo if empty.

document.addEventListener('DOMContentLoaded', () => {
  bindPhoneButtons();
  hydrateFeaturedSalons();
  hydrateCategoryCounts();
});

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

async function hydrateFeaturedSalons() {
  const container = document.getElementById('featured-salons');
  if (!container || !window.Tretmani) return;

  try {
    const salons = await window.Tretmani.featuredSalons(3);
    if (!salons || salons.length === 0) {
      console.info('No featured salons in DB yet — keeping static demo cards.');
      return;
    }
    container.innerHTML = salons.map(renderSalonCard).join('');
    bindPhoneButtons();
  } catch (err) {
    console.warn('Failed to load featured salons, using static demo:', err);
  }
}

async function hydrateCategoryCounts() {
  if (!window.Tretmani) return;
  try {
    const cats = await window.Tretmani.categories();
    if (!cats || cats.length === 0) return;
    // Future: also query counts per category and update DOM
    console.info('Categories loaded from Supabase:', cats.map(c => c.name).join(', '));
  } catch (err) {
    console.warn('Failed to load categories:', err);
  }
}

function renderSalonCard(s) {
  const cover = s.cover_image || 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=700&q=80&auto=format&fit=crop';
  const services = (s.services && Array.isArray(s.services)
    ? s.services.slice(0, 3).map(svc => svc.name || svc).filter(Boolean)
    : []);
  const badge = s.is_featured ? '<span class="salon__badge">★ Featured</span>' : '';
  const priceFrom = s.price_range || '';

  return `
    <a href="/salon/${escapeHtml(s.slug)}/" class="salon" data-salon-id="${s.id}">
      <div class="salon__image">
        <img src="${escapeHtml(cover)}" alt="${escapeHtml(s.name)}" loading="lazy" />
        ${badge}
        <span class="salon__heart">♡</span>
      </div>
      <div class="salon__body">
        <div class="salon__meta">
          <div class="salon__category">${escapeHtml(s.category_name || '')}</div>
          <div class="salon__rating">${(s.rating || 0).toFixed(1)} <span>(${s.review_count || 0})</span></div>
        </div>
        <h3 class="salon__name">${escapeHtml(s.name)}</h3>
        <div class="salon__location">${escapeHtml(s.city_name || '')}</div>
        ${services.length ? `<div class="salon__services">${services.map(svc => `<span>${escapeHtml(svc)}</span>`).join('')}</div>` : ''}
        <div class="salon__footer">
          <div class="salon__price">${priceFrom ? `od <strong>${escapeHtml(priceFrom)}</strong>` : ''}</div>
          <button class="salon__phone-btn" data-salon-id="${s.id}" data-phone="${escapeHtml(s.phone || '')}">Prikaži broj</button>
        </div>
      </div>
    </a>
  `;
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
