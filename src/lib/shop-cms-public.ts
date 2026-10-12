/** Public, read-only access to published SHoP CMS content. Falls back safely when
 * public Supabase configuration or CMS records are unavailable. */
export type ShopCmsEvent = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  starts_at: string | null;
  ends_at: string | null;
  venue: string;
  registration_url: string;
  image_path: string;
  status: "draft" | "published" | "cancelled" | "completed";
  featured: boolean;
  sort_order: number;
};

export type ShopCmsProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image_path: string;
  price_kes: number | null;
  availability: string;
  status: "draft" | "published" | "archived";
  sort_order: number;
};

async function readPublished<T>(table: string, select: string): Promise<T[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const query = new URLSearchParams({
      select,
      status: "eq.published",
      order: "sort_order.asc,created_at.desc",
      limit: "100",
    });
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export function getPublishedShopEvents() {
  return readPublished<ShopCmsEvent>(
    "shop_site_events",
    "id,title,slug,summary,description,starts_at,ends_at,venue,registration_url,image_path,status,featured,sort_order,created_at",
  );
}

export function getPublishedShopProducts() {
  return readPublished<ShopCmsProduct>(
    "shop_merch_products",
    "id,name,slug,category,description,image_path,price_kes,availability,status,sort_order,created_at",
  );
}
