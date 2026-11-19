import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import PartnershipEnquiriesAdmin from "@/components/admin/PartnershipEnquiriesAdmin";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Partnership Enquiries | SHoP Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PartnershipEnquiriesPage() {
  let supabase;
  try { supabase = await createClient(); }
  catch { return <AdminMessage>Supabase authentication is not configured. Configure the public Supabase environment variables before opening the admin area.</AdminMessage>; }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");
  const allowed = (process.env.SHOP_ADMIN_EMAILS ?? "").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) return <AdminMessage>This account is signed in, but it is not authorised to review partnership enquiries.</AdminMessage>;
  return <><div className="border-b border-shop-border bg-shop-paper px-4 py-3 sm:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-shop-muted">SHoP Admin</span><Link href="/admin" className="text-sm font-semibold underline">Admin overview</Link></div></div><PartnershipEnquiriesAdmin /></>;
}
function AdminMessage({ children }: { children: ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-shop-cream px-5 py-16 text-shop-ink"><section className="w-full max-w-xl border border-shop-border bg-white p-8 sm:p-10"><p className="shop-eyebrow text-shop-muted">SHoP · Admin</p><h1 className="shop-display mt-4 text-4xl">Access unavailable.</h1><p className="mt-5 text-sm leading-7 text-shop-muted">{children}</p><Link href="/admin/login" className="mt-8 inline-flex bg-shop-ink px-5 py-3 text-sm font-semibold text-white">Go to admin sign in</Link></section></main>;
}
