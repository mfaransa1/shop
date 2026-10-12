import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Collection = "events" | "products";
const TABLES: Record<Collection, string> = {
  events: "shop_site_events",
  products: "shop_merch_products",
};
const EVENT_FIELDS = "id,title,slug,summary,description,starts_at,ends_at,venue,registration_url,image_path,status,featured,sort_order,created_at,updated_at";
const PRODUCT_FIELDS = "id,name,slug,category,description,image_path,price_kes,availability,status,sort_order,created_at,updated_at";
const FIELDS: Record<Collection, string> = { events: EVENT_FIELDS, products: PRODUCT_FIELDS };
const STATUSES: Record<Collection, string[]> = {
  events: ["draft", "published", "cancelled", "completed"],
  products: ["draft", "published", "archived"],
};

function getCollection(value: string): Collection | null {
  return value === "events" || value === "products" ? value : null;
}
function normalise(payload: Record<string, unknown>, collection: Collection) {
  const text = (key: string, fallback = "") => typeof payload[key] === "string" ? (payload[key] as string).trim() : fallback;
  const slug = text("slug").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (collection === "events") {
    const status = text("status", "draft");
    if (!text("title") || !slug || !STATUSES.events.includes(status)) throw new Error("Enter a title and valid slug/status.");
    return {
      title: text("title"), slug, summary: text("summary"), description: text("description"),
      starts_at: text("starts_at") || null, ends_at: text("ends_at") || null,
      venue: text("venue", "Kawangware, Nairobi"), registration_url: text("registration_url"),
      image_path: text("image_path"), status, featured: payload.featured === true,
      sort_order: Number.isFinite(Number(payload.sort_order)) ? Math.trunc(Number(payload.sort_order)) : 0,
    };
  }
  const status = text("status", "draft");
  const rawPrice = payload.price_kes;
  const price = rawPrice === "" || rawPrice === null || rawPrice === undefined ? null : Number(rawPrice);
  if (!text("name") || !slug || !STATUSES.products.includes(status)) throw new Error("Enter a product name and valid slug/status.");
  if (price !== null && (!Number.isFinite(price) || price < 0)) throw new Error("Price must be a non-negative number or left blank.");
  return {
    name: text("name"), slug, category: text("category", "Equipment"), description: text("description"),
    image_path: text("image_path"), price_kes: price, availability: text("availability", "Enquire for availability"),
    status, sort_order: Number.isFinite(Number(payload.sort_order)) ? Math.trunc(Number(payload.sort_order)) : 0,
  };
}

async function supabaseRequest(url: string, key: string, path: string, init?: RequestInit) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function GET(_request: Request, context: { params: Promise<{ collection: string }> }) {
  const { collection: raw } = await context.params;
  const collection = getCollection(raw);
  if (!collection) return NextResponse.json({ error: "Unknown CMS collection." }, { status: 404 });
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;
  try {
    const query = new URLSearchParams({ select: FIELDS[collection], order: "sort_order.asc,created_at.desc", limit: "200" });
    const response = await supabaseRequest(access.supabaseUrl, access.serviceRoleKey, `${TABLES[collection]}?${query}`);
    if (!response.ok) {
      console.error(`SHoP CMS list failed: ${collection}, status ${response.status}`);
      return NextResponse.json({ error: "Could not load CMS content. Check that the CMS migration has been applied." }, { status: 502 });
    }
    return NextResponse.json({ items: await response.json() });
  } catch {
    return NextResponse.json({ error: "Could not connect to CMS storage." }, { status: 502 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ collection: string }> }) {
  const { collection: raw } = await context.params;
  const collection = getCollection(raw);
  if (!collection) return NextResponse.json({ error: "Unknown CMS collection." }, { status: 404 });
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;
  let payload: Record<string, unknown>;
  try { payload = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  let record: Record<string, unknown>;
  try { record = normalise(payload, collection); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid content." }, { status: 400 }); }
  try {
    const response = await supabaseRequest(access.supabaseUrl, access.serviceRoleKey, `${TABLES[collection]}?select=${FIELDS[collection]}`, {
      method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(record),
    });
    if (!response.ok) {
      const message = response.status === 409 ? "That slug is already in use." : "Could not save content. Check the database migration and required fields.";
      return NextResponse.json({ error: message }, { status: response.status === 409 ? 409 : 502 });
    }
    const items = await response.json() as unknown[];
    return NextResponse.json({ item: items[0] }, { status: 201 });
  } catch { return NextResponse.json({ error: "Could not connect to CMS storage." }, { status: 502 }); }
}

export async function PATCH(request: Request, context: { params: Promise<{ collection: string }> }) {
  const { collection: raw } = await context.params;
  const collection = getCollection(raw);
  if (!collection) return NextResponse.json({ error: "Unknown CMS collection." }, { status: 404 });
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;
  let payload: Record<string, unknown>;
  try { payload = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const id = typeof payload.id === "string" ? payload.id : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return NextResponse.json({ error: "Invalid content ID." }, { status: 400 });
  let record: Record<string, unknown>;
  try { record = normalise(payload, collection); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid content." }, { status: 400 }); }
  try {
    const query = new URLSearchParams({ id: `eq.${id}`, select: FIELDS[collection] });
    const response = await supabaseRequest(access.supabaseUrl, access.serviceRoleKey, `${TABLES[collection]}?${query}`, {
      method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(record),
    });
    if (!response.ok) return NextResponse.json({ error: response.status === 409 ? "That slug is already in use." : "Could not update content." }, { status: response.status === 409 ? 409 : 502 });
    const items = await response.json() as unknown[];
    if (!items.length) return NextResponse.json({ error: "Content not found." }, { status: 404 });
    return NextResponse.json({ item: items[0] });
  } catch { return NextResponse.json({ error: "Could not connect to CMS storage." }, { status: 502 }); }
}

export async function DELETE(request: Request, context: { params: Promise<{ collection: string }> }) {
  const { collection: raw } = await context.params;
  const collection = getCollection(raw);
  if (!collection) return NextResponse.json({ error: "Unknown CMS collection." }, { status: 404 });
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return NextResponse.json({ error: "Invalid content ID." }, { status: 400 });
  try {
    const response = await supabaseRequest(access.supabaseUrl, access.serviceRoleKey, `${TABLES[collection]}?id=eq.${id}`, { method: "DELETE" });
    if (!response.ok) return NextResponse.json({ error: "Could not delete content." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Could not connect to CMS storage." }, { status: 502 }); }
}
