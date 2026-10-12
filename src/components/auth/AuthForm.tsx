"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register" | "forgot" | "update";

const copy: Record<Mode, { eyebrow: string; title: string; description: string; button: string }> = {
  login: { eyebrow: "Player account", title: "Welcome back.", description: "Sign in to continue your chess journey and see your saved progress.", button: "Sign in" },
  register: { eyebrow: "Start your journey", title: "Create your account.", description: "Save your learning progress, puzzle attempts, and games as you improve.", button: "Create account" },
  forgot: { eyebrow: "Account recovery", title: "Reset your password.", description: "We will send a secure password-reset link to your email address.", button: "Send reset link" },
  update: { eyebrow: "Account recovery", title: "Choose a new password.", description: "Use a strong password you do not use on other websites.", button: "Update password" },
};

export default function AuthForm({ mode, nextPath = "/dashboard", initialNotice = "" }: { mode: Mode; nextPath?: string; initialNotice?: string }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(initialNotice);
  const [busy, setBusy] = useState(false);
  const content = copy[mode];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        router.replace(nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard");
        router.refresh();
        return;
      }

      if (mode === "register") {
        if (displayName.trim().length < 2) throw new Error("Enter your name (at least two characters).");
        if (password.length < 8) throw new Error("Choose a password with at least eight characters.");
        if (password !== confirmPassword) throw new Error("Your passwords do not match.");
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: displayName.trim() },
            emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
          },
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace("/dashboard");
          router.refresh();
          return;
        }
        setMessage("Account created. Check your email and follow the verification link before signing in.");
        return;
      }

      if (mode === "forgot") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
        });
        if (authError) throw authError;
        setMessage("If an account exists for that address, a password-reset link has been sent.");
        return;
      }

      if (password.length < 8) throw new Error("Choose a password with at least eight characters.");
      if (password !== confirmPassword) throw new Error("Your passwords do not match.");
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setMessage("Password updated. You can continue to your player dashboard.");
      setPassword("");
      setConfirmPassword("");
      router.replace("/dashboard");
      router.refresh();
    } catch (caught) {
      const detail = caught instanceof Error ? caught.message : "Something went wrong. Please try again.";
      setError(detail.includes("Supabase") ? "Account services are not configured yet. Please contact the SHoP site administrator." : detail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-shop-cream px-5 py-16 text-shop-ink">
      <section className="w-full max-w-lg border border-shop-border bg-white p-7 sm:p-10">
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-shop-muted hover:text-shop-ink">SHoP · Southside House of Pawns</Link>
        <p className="shop-eyebrow mt-12 text-shop-muted">{content.eyebrow}</p>
        <h1 className="shop-display mt-4 text-5xl leading-none sm:text-6xl">{content.title}</h1>
        <p className="mt-5 text-sm leading-6 text-shop-muted">{content.description}</p>
        <form onSubmit={submit} className="mt-9 space-y-5">
          {mode === "register" && <div><label htmlFor="display-name" className="text-xs font-semibold">Your name</label><input id="display-name" autoComplete="name" required minLength={2} maxLength={60} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-2 w-full border border-shop-border bg-transparent px-4 py-3 text-sm outline-none focus:border-shop-ink" /></div>}
          {mode !== "update" && <div><label htmlFor="email" className="text-xs font-semibold">Email address</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-shop-border bg-transparent px-4 py-3 text-sm outline-none focus:border-shop-ink" /></div>}
          {mode !== "forgot" && <div><label htmlFor="password" className="text-xs font-semibold">{mode === "update" ? "New password" : "Password"}</label><input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 8} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-shop-border bg-transparent px-4 py-3 text-sm outline-none focus:border-shop-ink" />{mode !== "login" && <p className="mt-2 text-xs text-shop-muted">Use at least eight characters.</p>}</div>}
          {(mode === "register" || mode === "update") && <div><label htmlFor="confirm-password" className="text-xs font-semibold">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full border border-shop-border bg-transparent px-4 py-3 text-sm outline-none focus:border-shop-ink" /></div>}
          {error && <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          {message && <p role="status" className="border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{message}</p>}
          <button type="submit" disabled={busy} className="w-full bg-shop-ink px-5 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Please wait…" : content.button}</button>
        </form>
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-shop-muted">
          {mode === "login" && <><Link className="underline underline-offset-4 hover:text-shop-ink" href="/auth/forgot-password">Forgot password?</Link><Link className="underline underline-offset-4 hover:text-shop-ink" href="/auth/register">Create an account</Link></>}
          {mode === "register" && <Link className="underline underline-offset-4 hover:text-shop-ink" href="/auth/login">Already have an account? Sign in</Link>}
          {mode === "forgot" && <Link className="underline underline-offset-4 hover:text-shop-ink" href="/auth/login">Back to sign in</Link>}
          {mode === "update" && <Link className="underline underline-offset-4 hover:text-shop-ink" href="/auth/login">Back to sign in</Link>}
          <Link className="ml-auto underline underline-offset-4 hover:text-shop-ink" href="/learn">Explore learning</Link>
        </div>
      </section>
    </main>
  );
}
