import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminAnnouncements } from "@/components/admin/AdminAnnouncements";
export const metadata={title:"Announcements | SHoP Admin",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function AnnouncementsPage(){let supabase;try{supabase=await createClient()}catch{return <Message>Supabase authentication is not configured. Check the public Supabase environment variables.</Message>}const {data:{user}}=await supabase.auth.getUser();if(!user?.email)redirect("/admin/login");const allowed=(process.env.SHOP_ADMIN_EMAILS??"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);if(!allowed.includes(user.email.toLowerCase()))return <Message>This account is not authorised to manage SHoP content.</Message>;return <AdminAnnouncements/>}
function Message({children}:{children:ReactNode}){return <main className="flex min-h-screen items-center justify-center bg-shop-cream px-5 py-16 text-shop-ink"><section className="w-full max-w-xl border border-shop-border bg-white p-8"><p className="shop-eyebrow text-shop-muted">SHoP · Admin</p><h1 className="shop-display mt-4 text-4xl">Access unavailable.</h1><p className="mt-5 text-sm leading-7 text-shop-muted">{children}</p><Link href="/admin/login" className="mt-8 inline-flex bg-shop-ink px-5 py-3 text-sm font-semibold text-white">Admin sign in</Link></section></main>}
