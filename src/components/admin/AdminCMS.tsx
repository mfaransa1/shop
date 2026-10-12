"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Collection = "events" | "products";
type CMSItem = Record<string, string | number | boolean | null> & { id: string; created_at?: string };

const emptyEvent = { title: "", slug: "", summary: "", description: "", starts_at: "", ends_at: "", venue: "Kawangware, Nairobi", registration_url: "", image_path: "", status: "draft", featured: false, sort_order: 0 };
const emptyProduct = { name: "", slug: "", category: "Equipment", description: "", image_path: "", price_kes: "", availability: "Enquire for availability", status: "draft", sort_order: 0 };
const inputClass = "mt-1 w-full border border-shop-border bg-white px-3 py-2.5 text-sm text-shop-ink outline-none focus:border-shop-ink";
const labelClass = "block text-xs font-semibold text-shop-muted";

function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function localDateTime(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function AdminCMS({ adminEmail, initialCollection = "events", showCollectionSwitcher = true }: { adminEmail: string; initialCollection?: Collection; showCollectionSwitcher?: boolean }) {
  const router = useRouter();
  const [collection, setCollection] = useState<Collection>(initialCollection);
  const [items, setItems] = useState<CMSItem[]>([]);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({ ...emptyEvent });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/admin/cms/${collection}`, { cache: "no-store" });
      const result = await response.json() as { items?: CMSItem[]; error?: string };
      if (response.status === 401) { router.replace("/admin/login"); router.refresh(); return; }
      if (!response.ok) { setError(result.error || "Could not load content."); setItems([]); return; }
      setItems(result.items ?? []);
    } catch { setError("Could not connect to CMS storage. Please try again."); setItems([]); }
    finally { setLoading(false); }
  }, [collection, router]);

  useEffect(() => { void loadItems(); }, [loadItems]);
  useEffect(() => { setForm(collection === "events" ? { ...emptyEvent } : { ...emptyProduct }); setEditingId(null); setNotice(""); setError(""); }, [collection]);

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => Object.values(item).some((value) => String(value ?? "").toLowerCase().includes(term)));
  }, [items, search]);

  function setField(key: string, value: string | number | boolean) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if ((key === "title" || key === "name") && !editingId) next.slug = slugify(String(value));
      return next;
    });
  }
  function editItem(item: CMSItem) {
    const next: Record<string, string | number | boolean> = {};
    const keys = collection === "events" ? Object.keys(emptyEvent) : Object.keys(emptyProduct);
    for (const key of keys) {
      const value = item[key];
      next[key] = key === "starts_at" || key === "ends_at" ? localDateTime(value) : value === null || value === undefined ? "" : value as string | number | boolean;
    }
    setForm(next); setEditingId(item.id); setNotice(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function resetForm() {
    setForm(collection === "events" ? { ...emptyEvent } : { ...emptyProduct }); setEditingId(null); setError("");
  }
  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const payload = { ...form, ...(editingId ? { id: editingId } : {}) };
      const response = await fetch(`/api/admin/cms/${collection}`, { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string };
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) { setError(result.error || "Could not save this item."); return; }
      setNotice(editingId ? "Changes saved." : "Item created.");
      resetForm(); await loadItems();
    } catch { setError("Could not connect to the CMS. Your changes have not been confirmed."); }
    finally { setSaving(false); }
  }
  async function deleteItem(item: CMSItem) {
    const name = String(item.title ?? item.name ?? "this item");
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/cms/${collection}?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) { setError(result.error || "Could not delete item."); return; }
      if (editingId === item.id) resetForm();
      setNotice("Item deleted."); await loadItems();
    } catch { setError("Could not connect to the CMS. Please try again."); }
  }

  const isEvent = collection === "events";
  const titleKey = isEvent ? "title" : "name";
  const statusOptions = isEvent ? ["draft", "published", "cancelled", "completed"] : ["draft", "published", "archived"];
  const title = (item: CMSItem) => String(item[titleKey] ?? "Untitled");

  return <main className="min-h-screen bg-shop-cream px-4 py-8 text-shop-ink sm:px-8 lg:px-12">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-shop-border pb-6">
        <div><p className="shop-eyebrow text-shop-muted">SHoP · Admin workspace</p><h1 className="shop-display mt-3 text-4xl sm:text-5xl">Content studio.</h1><p className="mt-3 text-sm text-shop-muted">Signed in as {adminEmail}</p><Link href="/admin/cms/announcements" className="mt-4 inline-flex border border-shop-border bg-white px-4 py-2.5 text-sm font-semibold">Manage announcements</Link></div>
        <div className="flex flex-wrap gap-2"><Link href="/admin" className="border border-shop-border px-4 py-2.5 text-sm font-semibold hover:bg-white">Applications</Link><Link href="/admin/tournaments" className="border border-shop-border px-4 py-2.5 text-sm font-semibold hover:bg-white">Tournament registrations</Link><Link href="/" className="border border-shop-border px-4 py-2.5 text-sm font-semibold hover:bg-white">View website</Link></div>
      </header>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-lg font-semibold">Manage website content</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-shop-muted">Create drafts, update details and publish items when ready. Upload event and product images directly here; images are stored in SHoP media storage.</p></div>
        {showCollectionSwitcher && <div className="inline-flex border border-shop-border bg-white p-1">
          <button type="button" onClick={() => setCollection("events")} className={`px-4 py-2 text-sm font-semibold ${isEvent ? "bg-shop-ink text-white" : "text-shop-muted hover:text-shop-ink"}`}>Events & tournaments</button>
          <button type="button" onClick={() => setCollection("products")} className={`px-4 py-2 text-sm font-semibold ${!isEvent ? "bg-shop-ink text-white" : "text-shop-muted hover:text-shop-ink"}`}>Merch products</button>
        </div>}
      </div>

      {error && <p role="alert" className="mt-5 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p role="status" className="mt-5 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}

      <div className="mt-7 grid items-start gap-7 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={saveItem} className="border border-shop-border bg-shop-paper p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3"><div><p className="shop-eyebrow text-shop-muted">{editingId ? "Edit existing item" : "Create new item"}</p><h3 className="shop-display mt-3 text-3xl">{editingId ? "Make an update." : isEvent ? "Add an event." : "Add a product."}</h3></div>{editingId && <button type="button" onClick={resetForm} className="text-xs font-semibold underline">Cancel edit</button>}</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>{isEvent ? "Event title *" : "Product name *"}<input required className={inputClass} value={String(form[titleKey] ?? "")} onChange={(e) => setField(titleKey, e.target.value)} /></label>
            <label className={labelClass}>URL slug *<input required className={inputClass} value={String(form.slug ?? "")} onChange={(e) => setField("slug", slugify(e.target.value))} /><span className="mt-1 block font-normal">{isEvent ? `/tournaments#${String(form.slug || "event-slug")}` : `/merch#${String(form.slug || "product-slug")}`}</span></label>
            <label className={labelClass}>Status<select className={inputClass} value={String(form.status ?? "draft")} onChange={(e) => setField("status", e.target.value)}>{statusOptions.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select></label>
            {isEvent ? <>
              <label className={labelClass}>Start date and time<input type="datetime-local" className={inputClass} value={String(form.starts_at ?? "")} onChange={(e) => setField("starts_at", e.target.value)} /></label>
              <label className={labelClass}>End date and time<input type="datetime-local" className={inputClass} value={String(form.ends_at ?? "")} onChange={(e) => setField("ends_at", e.target.value)} /></label>
              <label className={labelClass}>Venue<input className={inputClass} value={String(form.venue ?? "")} onChange={(e) => setField("venue", e.target.value)} /></label>
              <label className={labelClass}>Registration URL<input type="url" className={inputClass} placeholder="https://…" value={String(form.registration_url ?? "")} onChange={(e) => setField("registration_url", e.target.value)} /></label>
              <label className={`${labelClass} sm:col-span-2`}>Short summary<textarea rows={2} className={inputClass} value={String(form.summary ?? "")} onChange={(e) => setField("summary", e.target.value)} /></label>
              <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={form.featured === true} onChange={(e) => setField("featured", e.target.checked)} /> Feature this event</label>
            </> : <>
              <label className={labelClass}>Category<input className={inputClass} value={String(form.category ?? "")} onChange={(e) => setField("category", e.target.value)} /></label>
              <label className={labelClass}>Price (KSh)<input type="number" min="0" step="0.01" className={inputClass} placeholder="Leave blank if not set" value={String(form.price_kes ?? "")} onChange={(e) => setField("price_kes", e.target.value)} /></label>
              <label className={`${labelClass} sm:col-span-2`}>Availability label<input className={inputClass} value={String(form.availability ?? "")} onChange={(e) => setField("availability", e.target.value)} /></label>
            </>}
            <label className={`${labelClass} sm:col-span-2`}>Description<textarea rows={4} className={inputClass} value={String(form.description ?? "")} onChange={(e) => setField("description", e.target.value)} /></label>
            <div className={`${labelClass} sm:col-span-2`}>
              <span>Image upload</span>
              <input aria-label="Upload image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={`${inputClass} file:mr-3 file:border-0 file:bg-shop-ink file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white`} disabled={uploadingImage} onChange={async (e) => {
                const input = e.currentTarget;
                const file = input.files?.[0];
                if (!file) return;
                setError(""); setNotice(""); setUploadingImage(true);
                try {
                  const body = new FormData(); body.append("file", file); body.append("collection", collection);
                  const response = await fetch("/api/admin/cms/upload", { method: "POST", body });
                  const result = await response.json() as { url?: string; error?: string };
                  if (response.status === 401) { router.replace("/admin/login"); return; }
                  if (!response.ok || !result.url) { setError(result.error || "Image upload failed."); return; }
                  setField("image_path", result.url); setNotice("Image uploaded. Save the item to keep this image linked.");
                } catch { setError("Could not upload image. Please try again."); }
                finally { setUploadingImage(false); input.value = ""; }
              }} />
              <span className="mt-1 block font-normal">JPEG, PNG, WebP or GIF · maximum 5 MB. Uploading fills the image field automatically.</span>
              {Boolean(form.image_path) && <div className="mt-3 flex items-start gap-3 rounded border border-shop-border bg-white p-3"><img src={String(form.image_path)} alt="Selected upload preview" className="h-24 w-24 rounded object-cover" /><div className="min-w-0 flex-1"><p className="break-all text-xs font-normal text-shop-muted">{String(form.image_path)}</p><button type="button" onClick={() => setField("image_path", "")} className="mt-2 text-xs font-semibold underline">Remove image</button></div></div>}
            </div>
            <label className={labelClass}>Display order<input type="number" className={inputClass} value={String(form.sort_order ?? 0)} onChange={(e) => setField("sort_order", Number(e.target.value))} /></label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><button disabled={saving} className="bg-shop-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : editingId ? "Save changes" : "Create item"}</button><button type="button" onClick={resetForm} className="border border-shop-border px-5 py-3 text-sm font-semibold hover:bg-white">Clear form</button></div>
        </form>

        <section className="min-w-0 border border-shop-border bg-shop-paper p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="shop-eyebrow text-shop-muted">Content library</p><h3 className="shop-display mt-3 text-3xl">{isEvent ? "Events & tournaments." : "Merch catalogue."}</h3></div><button type="button" onClick={() => void loadItems()} className="border border-shop-border px-3 py-2 text-xs font-semibold hover:bg-white">Refresh list</button></div>
          <input aria-label="Search content" className={`${inputClass} mt-5`} placeholder="Search by title, slug, status…" value={search} onChange={(e) => setSearch(e.target.value)} />
          {loading ? <p className="py-10 text-sm text-shop-muted">Loading content…</p> : visibleItems.length === 0 ? <p className="py-10 text-sm text-shop-muted">No items found. Create your first {isEvent ? "event" : "product"} using the form.</p> : <div className="mt-4 divide-y divide-shop-border">{visibleItems.map((item) => <article key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold">{title(item)}</h4><span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${item.status === "published" ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-700"}`}>{String(item.status ?? "draft")}</span>{item.featured === true && <span className="text-[10px] font-bold uppercase tracking-wider text-shop-muted">Featured</span>}</div><p className="mt-1 break-all text-xs text-shop-muted">/{String(item.slug ?? "")}{isEvent && item.starts_at ? ` · ${new Date(String(item.starts_at)).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}` : !isEvent && item.price_kes !== null && item.price_kes !== "" ? ` · KSh ${Number(item.price_kes).toLocaleString("en-KE")}` : ""}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-shop-muted">{String(item.summary ?? item.description ?? "")}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => editItem(item)} className="border border-shop-border px-3 py-2 text-xs font-semibold hover:bg-white">Edit</button><button type="button" onClick={() => void deleteItem(item)} className="border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-50">Delete</button></div></article>)}</div>}
        </section>
      </div>
      <p className="mt-8 border-t border-shop-border pt-5 text-xs leading-6 text-shop-muted">Manage published website content here. Membership applications and tournament registrations remain available in their dedicated admin sections.</p>
    </div>
  </main>;
}
