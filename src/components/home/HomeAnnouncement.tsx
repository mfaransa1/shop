import Link from "next/link";

export const dynamic = "force-dynamic";

type Announcement = {
  title: string;
  message: string;
  link_label: string;
  link_url: string;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
};

export default async function HomeAnnouncement() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  let item: Announcement | undefined;
  try {
    const now = new Date().toISOString();
    const query = new URLSearchParams({
      select: "title,message,link_label,link_url,starts_at,ends_at,sort_order",
      status: "eq.published",
      order: "sort_order.asc,created_at.desc",
      limit: "5",
      or: `(starts_at.is.null,starts_at.lte.${now})`,
    });
    const response = await fetch(`${url}/rest/v1/shop_site_announcements?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const announcements = await response.json() as Announcement[];
    const currentTime = Date.now();
    item = announcements.find((announcement) =>
      (!announcement.starts_at || new Date(announcement.starts_at).getTime() <= currentTime) &&
      (!announcement.ends_at || new Date(announcement.ends_at).getTime() >= currentTime)
    );
  } catch {
    return null;
  }

  if (!item) return null;
  const href = item.link_url.trim();
  const safeHref = /^\/(?!\/)/.test(href) || /^https:\/\//i.test(href);
  return (
    <aside aria-label="SHoP announcement" className="border-b border-shop-border bg-shop-ink px-4 py-3 text-shop-cream">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-sm leading-6"><strong className="mr-2">{item.title}</strong>{item.message}</p>
        {href && item.link_label && safeHref && (
          href.startsWith("/")
            ? <Link href={href} className="shrink-0 text-xs font-semibold underline underline-offset-4">{item.link_label}</Link>
            : <a href={href} rel="noopener noreferrer" target="_blank" className="shrink-0 text-xs font-semibold underline underline-offset-4">{item.link_label}</a>
        )}
      </div>
    </aside>
  );
}
