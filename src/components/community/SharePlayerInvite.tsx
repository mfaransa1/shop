"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SharePlayerInvite() {
  const [url, setUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) setUrl(`${window.location.origin}/community/players/${data.user.id}`);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function share() {
    if (!url) return;
    setNotice("");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Play chess with me on SHoP", text: "Join me for a chess game with Southside House of Pawns.", url });
        setNotice("Invite link shared.");
      } else {
        await navigator.clipboard.writeText(url);
        setNotice("Your player invite link has been copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        setNotice("Your player invite link has been copied.");
      } catch {
        setNotice("Could not share automatically. Copy the link shown below.");
      }
    }
  }

  return (
    <section className="border border-shop-border bg-white p-6 md:p-8">
      <p className="shop-eyebrow text-shop-muted">Bring a friend to the board</p>
      <h2 className="shop-display mt-3 text-3xl">Share your player invite.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-shop-muted">Send your public SHoP player profile to a friend. They can view your profile, sign in and challenge you to a game.</p>
      {url && <p className="mt-4 break-all border border-shop-border bg-shop-cream p-3 text-xs text-shop-muted">{url}</p>}
      <button type="button" disabled={loading || !url} onClick={() => void share()} className="mt-4 bg-shop-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Preparing invite link…" : "Share invite link"}</button>
      {notice && <p role="status" className="mt-3 text-sm text-emerald-800">{notice}</p>}
      <p className="mt-3 text-xs leading-5 text-shop-muted">Make sure your player profile is set to public in Community Settings so invited friends can open it.</p>
      <a href="/dashboard/community-settings" className="mt-2 inline-flex text-xs font-semibold underline underline-offset-4">Review profile visibility</a>
    </section>
  );
}
