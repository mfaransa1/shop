"use client";

import { useState } from "react";

type Settings = { publicProfile: boolean; showOnLeaderboard: boolean; bio: string };

export default function CommunityPrivacyForm({ initial }: { initial: Settings }) {
  const [settings, setSettings] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/community/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Could not save your settings.");
      setMessage("Your community privacy settings have been saved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save your settings."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={save} className="space-y-6 border border-shop-border bg-white p-6 sm:p-8"><div><p className="shop-eyebrow text-shop-muted">Visibility controls</p><h2 className="shop-display mt-3 text-3xl">Choose what to share.</h2><p className="mt-3 text-sm leading-6 text-shop-muted">Your email, private game history, and detailed activity records are never displayed by these settings.</p></div><label className="flex items-start gap-3 border-t border-shop-border pt-5"><input type="checkbox" className="mt-1 size-4 accent-black" checked={settings.publicProfile} onChange={(e) => setSettings((s) => ({ ...s, publicProfile: e.target.checked }))} /><span><strong className="block text-sm">Allow a public player profile</strong><span className="mt-1 block text-xs leading-5 text-shop-muted">Opt in to make your profile eligible for a public profile page. Public profile pages will be added in a later milestone.</span></span></label><label className="flex items-start gap-3 border-t border-shop-border pt-5"><input type="checkbox" className="mt-1 size-4 accent-black" checked={settings.showOnLeaderboard} onChange={(e) => setSettings((s) => ({ ...s, showOnLeaderboard: e.target.checked }))} /><span><strong className="block text-sm">Show me on the community leaderboard</strong><span className="mt-1 block text-xs leading-5 text-shop-muted">Displays your chosen name, learning level, completed activity counts, and points from saved records.</span></span></label><label className="block border-t border-shop-border pt-5"><span className="block text-sm font-semibold">Short bio (optional)</span><textarea value={settings.bio} maxLength={240} rows={4} onChange={(e) => setSettings((s) => ({ ...s, bio: e.target.value }))} placeholder="A little about your chess journey" className="mt-2 w-full border border-shop-border bg-shop-cream p-3 text-sm outline-none focus:border-shop-ink" /><span className="mt-1 block text-right text-xs text-shop-muted">{settings.bio.length}/240</span></label><button disabled={busy} type="submit" className="bg-[#111111] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save privacy settings"}</button>{message && <p role="status" className="text-sm text-shop-muted">{message}</p>}</form>;
}
