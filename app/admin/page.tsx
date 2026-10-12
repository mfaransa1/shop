import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminWorkspace } from "@/components/admin/AdminWorkspace";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Overview | SHoP", robots: { index: false, follow: false } };

export default async function AdminOverviewPage() {
  let supabase;
  try { supabase = await createClient(); }
  catch { return <AdminAccessMessage message="Supabase authentication is not configured. Check the existing public Supabase environment variables." />; }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");
  const allowed = (process.env.SHOP_ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) return <AdminAccessMessage message="This account is signed in but is not authorised to manage SHoP." />;
  return <AdminWorkspace adminEmail={user.email} />;
}

function AdminAccessMessage({ message }: { message: string }) {
 return <main className="shop-admin min-h-screen bg-[#f5f4f0] px-5 py-20 text-[#20231f]"><section className="mx-auto max-w-xl border border-[#e4e1d9] bg-white p-8 sm:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8b6b2b]">SHoP · Admin</p><h1 className="mt-4 text-3xl font-semibold">Access unavailable</h1><p className="mt-4 text-sm leading-7 text-[#73746d]">{message}</p><a href="/admin/login" className="shop-admin-primary mt-7 inline-flex rounded-sm px-5 py-3 text-sm font-semibold no-underline">Go to admin sign in</a></section></main>;
}
