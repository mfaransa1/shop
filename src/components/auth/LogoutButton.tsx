"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/auth/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return <button type="button" onClick={logout} disabled={busy} className="border border-shop-border px-4 py-3 text-xs font-semibold transition-colors hover:border-shop-ink disabled:opacity-50">{busy ? "Signing out…" : "Sign out"}</button>;
}
