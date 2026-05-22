// Supabase REST client for build time (Node).

export function makeClient({ url, key }) {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  };

  async function get(path) {
    const res = await fetch(`${url}/rest/v1/${path}`, { headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Supabase GET ${path} → ${res.status}: ${body.slice(0, 200)}`);
    }
    return res.json();
  }

  return {
    async categories() {
      return get('categories?select=*&order=sort_order.asc');
    },

    async cities() {
      return get('cities?select=*&order=sort_order.asc');
    },

    async allSalons() {
      // Pull everything anon can see; build time uses the same anon endpoint as client.
      return get('public_salons?select=*&order=is_featured.desc,rating.desc&limit=1000');
    },
  };
}

export async function fetchAllData(client) {
  const [categories, cities, salons] = await Promise.all([
    client.categories(),
    client.cities(),
    client.allSalons(),
  ]);
  return { categories, cities, salons };
}
