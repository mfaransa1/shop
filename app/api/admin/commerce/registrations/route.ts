import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api-auth";
import { shopDb } from "@/lib/shop-commerce-store";
export const dynamic = "force-dynamic";
const allowed = new Set(["submitted", "under_review", "confirmed", "waitlisted", "rejected", "cancelled"]);
export async function GET() {
  const access = await requireAdminApiAccess(); if (!access.ok) return access.response;
  try { const r = await shopDb("shop_event_registrations?select=*&order=created_at.desc&limit=1000"); return NextResponse.json({ registrations: r.data }); }
  catch { return NextResponse.json({ error: "Could not load event registrations." }, { status: 503 }); }
}
export async function PATCH(req: Request) {
  const access = await requireAdminApiAccess(); if (!access.ok) return access.response;
  try { const b = await req.json() as { id?: unknown; status?: unknown; adminNotes?: unknown }; const id = typeof b.id === "string" ? b.id : ""; if (!/^[0-9a-f-]{36}$/i.test(id) || typeof b.status !== "string" || !allowed.has(b.status)) return NextResponse.json({ error: "Invalid registration update." }, { status: 400 });
    const adminNotes = typeof b.adminNotes === "string" ? b.adminNotes.trim().slice(0, 1000) : "";
    const r = await shopDb(`shop_event_registrations?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status: b.status, admin_notes: adminNotes, updated_at: new Date().toISOString() }) });
    return NextResponse.json({ registration: Array.isArray(r.data) ? r.data[0] : null });
  } catch { return NextResponse.json({ error: "Could not update registration." }, { status: 503 }); }
}
