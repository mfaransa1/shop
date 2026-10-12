import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api-auth";
import { shopDb } from "@/lib/shop-commerce-store";
export const dynamic = "force-dynamic";
type Pricing = { default_fee_kes: number; county_fees: Record<string, number> };
const validFee = (v: unknown) => Number.isInteger(v) && Number(v) >= 0 && Number(v) <= 20000;
export async function GET() {
 const access = await requireAdminApiAccess(); if (!access.ok) return access.response;
 try { const r = await shopDb("shop_commerce_settings?setting_key=eq.delivery_pricing&select=setting_value&limit=1"); const rows = Array.isArray(r.data) ? r.data as Array<{setting_value: Pricing}> : []; return NextResponse.json({ pricing: rows[0]?.setting_value ?? { default_fee_kes: 0, county_fees: {} } }); }
 catch { return NextResponse.json({ error: "Could not load delivery pricing." }, { status: 503 }); }
}
export async function PATCH(req: Request) {
 const access = await requireAdminApiAccess(); if (!access.ok) return access.response;
 try { const b = await req.json() as { defaultFeeKes?: unknown; countyFees?: unknown }; if (!validFee(b.defaultFeeKes) || !b.countyFees || typeof b.countyFees !== "object" || Array.isArray(b.countyFees)) return NextResponse.json({ error: "Enter valid whole-shilling delivery fees." }, { status: 400 });
 const fees: Record<string, number> = {}; for (const [county, fee] of Object.entries(b.countyFees as Record<string, unknown>)) { const key = county.trim().slice(0, 80); if (!key || !validFee(fee)) return NextResponse.json({ error: "Each county needs a valid fee (KSh 0–20,000)." }, { status: 400 }); fees[key] = Number(fee); }
 const pricing = { default_fee_kes: Number(b.defaultFeeKes), county_fees: fees }; await shopDb("shop_commerce_settings?on_conflict=setting_key", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ setting_key: "delivery_pricing", setting_value: pricing, updated_at: new Date().toISOString() }) }); return NextResponse.json({ pricing });
 } catch { return NextResponse.json({ error: "Could not save delivery pricing." }, { status: 503 }); }
}
