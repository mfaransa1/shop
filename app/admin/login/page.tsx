"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage("Sign-in failed. Check your email and password.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setErrorMessage(
        "Admin sign-in is not configured yet. Please contact the site administrator."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-shop-cream px-5 py-16 text-shop-ink">
      <section className="w-full max-w-md border border-shop-border bg-white p-7 sm:p-10">
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-shop-muted transition-colors hover:text-shop-ink"
        >
          SHoP · Southside House of Pawns
        </Link>
        <p className="shop-eyebrow mt-12 text-shop-muted">Private area</p>
        <h1 className="shop-display mt-4 text-5xl leading-none">Admin sign in.</h1>
        <p className="mt-5 text-sm leading-6 text-shop-muted">
          Sign in with the authorised SHoP administrator account to review membership applications.
        </p>

        <form onSubmit={handleSubmit} className="mt-9 space-y-6">
          <div>
            <label htmlFor="admin-email" className="text-xs font-semibold">
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-shop-border bg-transparent px-4 py-3 text-sm outline-none focus:border-shop-ink"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-xs font-semibold">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full border border-shop-border bg-transparent px-4 py-3 text-sm outline-none focus:border-shop-ink"
            />
          </div>

          {errorMessage ? (
            <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-shop-ink px-5 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in to review applications"}
          </button>
        </form>
      </section>
    </main>
  );
}
