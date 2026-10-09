import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminApplications } from "@/components/admin/AdminApplications";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Membership Applications | SHoP Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
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

  if (!user?.email) {
    redirect("/admin/login");
  }

  const allowedEmails = (process.env.SHOP_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!allowedEmails.includes(user.email.toLowerCase())) {
    return (
      <AdminMessage>
        This account is signed in, but it is not authorised to review SHoP membership applications. Contact the site administrator if you need access.
      </AdminMessage>
    );
  }

  return <AdminApplications adminEmail={user.email} />;
}

function AdminMessage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-shop-cream px-5 py-16 text-shop-ink">
      <section className="w-full max-w-xl border border-shop-border bg-white p-8 sm:p-10">
        <p className="shop-eyebrow text-shop-muted">SHoP · Admin</p>
        <h1 className="shop-display mt-4 text-4xl">Access unavailable.</h1>
        <p className="mt-5 text-sm leading-7 text-shop-muted">{children}</p>
        <Link
          href="/admin/login"
          className="mt-8 inline-flex bg-shop-ink px-5 py-3 text-sm font-semibold text-white"
        >
          Go to admin sign in
        </Link>
      </section>
    </main>
  );
}
