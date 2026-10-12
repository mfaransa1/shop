import { NextResponse } from "next/server";import { requireAdminApiAccess } from "@/lib/admin-api-auth";import { shopDb } from "@/lib/shop-commerce-store";
export const dynamic="force-dynamic";
export async function GET(){const access=await requireAdminApiAccess();if(!access.ok)return access.response;try{const r=await shopDb("shop_orders?select=*,shop_order_items(*)&order=created_at.desc&limit=300");return NextResponse.json({orders:r.data});}catch{return NextResponse.json({error:"Could not load orders."},{status:503});}}
