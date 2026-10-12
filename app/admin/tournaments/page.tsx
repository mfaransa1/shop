import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminTournamentRegistrations } from "@/components/admin/AdminTournamentRegistrations";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Tournament Registrations | SHoP Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTournamentRegistrationsPage() {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return (
      <AdminMessage>
        Supabase authentication is not configured. Set the public Supabase environment variables before opening the admin area.
      </AdminMessage>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/admin/login");

  const allowedEmails = (process.env.SHOP_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!allowedEmails.includes(user.email.toLowerCase())) {
    return (
      <AdminMessage>
        This account is signed in, but it is not authorised to review SHoP tournament registrations.
      </AdminMessage>
    );
  }

  return (
    <>
      <div className="border-b border-shop-border bg-shop-paper px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-shop-muted">SHoP Admin</span>
          <Link href="/admin/cms" className="border border-shop-border px-4 py-2 text-sm font-semibold hover:bg-white">Open Content Studio</Link>
        </div>
      </div>
      <AdminTournamentRegistrations adminEmail={user.email} />
    </>
  );
}

function AdminMessage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-shop-cream px-5 py-16 text-shop-ink">
      <section className="w-full max-w-xl border border-shop-border bg-white p-8 sm:p-10">
        <p className="shop-eyebrow text-shop-muted">SHoP · Admin</p>
        <h1 className="shop-display mt-4 text-4xl">Access unavailable.</h1>
        <p className="mt-5 text-sm leading-7 text-shop-muted">{children}</p>
        <Link href="/admin/login" className="mt-8 inline-flex bg-shop-ink px-5 py-3 text-sm font-semibold text-white">
          Go to admin sign in
        </Link>
      </section>
    </main>
  );
}
