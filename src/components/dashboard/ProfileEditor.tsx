"use client";

import { useState, type FormEvent } from "react";

type Props = { initialName: string; initialLevel: string };

export default function ProfileEditor({ initialName, initialLevel }: Props) {
  const [displayName, setDisplayName] = useState(initialName);
  const [skillLevel, setSkillLevel] = useState(["Beginner", "Developing", "Competitive"].includes(initialLevel) ? initialLevel : "Beginner");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/learning/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, skillLevel }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not save profile.");
      setMessage("Profile saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label htmlFor="profile-name" className="text-xs font-semibold">Display name</label>
        <input id="profile-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required minLength={2} maxLength={60} className="mt-2 w-full border border-shop-border bg-transparent px-4 py-3 text-sm outline-none focus:border-shop-ink" />
      </div>
      <div>
        <label htmlFor="profile-level" className="text-xs font-semibold">Current learning level</label>
        <select id="profile-level" value={skillLevel} onChange={(event) => setSkillLevel(event.target.value)} className="mt-2 w-full border border-shop-border bg-white px-4 py-3 text-sm outline-none focus:border-shop-ink">
          <option>Beginner</option><option>Developing</option><option>Competitive</option>
        </select>
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-800">{message}</p>}
      <button type="submit" disabled={busy} className="bg-shop-ink px-5 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50">{busy ? "Saving…" : "Save profile"}</button>
    </form>
  );
}
