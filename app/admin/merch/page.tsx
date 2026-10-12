import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminCMS } from "@/components/admin/AdminCMS";
export const dynamic = "force-dynamic";
export const metadata = { title: "Merch Shop | SHoP Admin", robots: { index: false, follow: false } };
export default async function AdminMerchPage(){
 let supabase; try { supabase=await createClient(); } catch { return <Message>Supabase authentication is not configured.</Message>; }
 const {data:{user}}=await supabase.auth.getUser(); if(!user?.email) redirect("/admin/login");
 const allowed=(process.env.SHOP_ADMIN_EMAILS??"").split(",").map(v=>v.trim().toLowerCase()).filter(Boolean);
 if(!allowed.includes(user.email.toLowerCase())) return <Message>This account is not authorised to manage SHoP merchandise.</Message>;
 return <div className="min-h-screen px-4 py-6 sm:px-8 sm:py-9"><AdminCMS adminEmail={user.email} initialCollection="products" showCollectionSwitcher={false}/></div>;
}
function Message({children}:{children:ReactNode}){return <main className="p-8"><section className="mx-auto max-w-xl border border-shop-border bg-white p-8"><h1 className="text-2xl font-semibold">Access unavailable</h1><p className="mt-3 text-sm">{children}</p><Link className="shop-admin-primary mt-6 inline-flex px-4 py-3" href="/admin/login">Sign in</Link></section></main>}
