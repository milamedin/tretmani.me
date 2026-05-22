// Lightweight Supabase REST client — no SDK dependency, vanilla fetch.
(function () {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.TRETMANI_CONFIG;

  const baseHeaders = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  async function sbGet(path) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: baseHeaders });
    if (!res.ok) throw new Error(`Supabase GET ${path} → ${res.status}`);
    return res.json();
  }

  async function sbRpc(fnName, args) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(args || {}),
    });
    if (!res.ok) throw new Error(`Supabase RPC ${fnName} → ${res.status}`);
    return res.json();
  }

  const Tretmani = {
    async categories() {
      return sbGet('categories?select=*&order=sort_order.asc');
    },

    async cities() {
      return sbGet('cities?select=*&order=sort_order.asc');
    },

    async featuredSalons(limit = 6) {
      return sbGet(`public_salons?is_featured=eq.true&order=rating.desc&limit=${limit}`);
    },

    async salons({ category = '', city = '', sort = 'featured', limit = 24 } = {}) {
      const params = [`limit=${limit}`];
      if (category) params.push(`category_slug=eq.${encodeURIComponent(category)}`);
      if (city) params.push(`city_slug=eq.${encodeURIComponent(city)}`);
      switch (sort) {
        case 'rating':  params.push('order=rating.desc,review_count.desc'); break;
        case 'newest':  params.push('order=id.desc'); break;
        case 'featured':
        default:        params.push('order=is_featured.desc,rating.desc'); break;
      }
      return sbGet(`public_salons?${params.join('&')}`);
    },

    async salonCount({ category = '', city = '' } = {}) {
      const params = ['select=id'];
      if (category) params.push(`category_slug=eq.${encodeURIComponent(category)}`);
      if (city) params.push(`city_slug=eq.${encodeURIComponent(city)}`);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/public_salons?${params.join('&')}`, {
        headers: { ...baseHeaders, 'Prefer': 'count=exact', 'Range': '0-0' }
      });
      const range = res.headers.get('content-range') || '*/0';
      const total = parseInt(range.split('/')[1] || '0', 10);
      return Number.isFinite(total) ? total : 0;
    },

    async salonsByCity(citySlug, limit = 50) {
      return sbGet(`public_salons?city_slug=eq.${encodeURIComponent(citySlug)}&order=is_featured.desc,rating.desc&limit=${limit}`);
    },

    async salonsByCategory(categorySlug, limit = 50) {
      return sbGet(`public_salons?category_slug=eq.${encodeURIComponent(categorySlug)}&order=is_featured.desc,rating.desc&limit=${limit}`);
    },

    async salonBySlug(slug) {
      const rows = await sbGet(`public_salons?slug=eq.${encodeURIComponent(slug)}&limit=1`);
      return rows[0] || null;
    },

    async trackEvent(salonId, eventType) {
      try {
        await sbRpc('track_event', {
          p_salon_id: salonId,
          p_event_type: eventType,
          p_referrer: document.referrer || null,
          p_user_agent: navigator.userAgent,
        });
      } catch (err) {
        console.warn('Tracking failed (non-blocking):', err);
      }
    },
  };

  window.Tretmani = Tretmani;
})();
