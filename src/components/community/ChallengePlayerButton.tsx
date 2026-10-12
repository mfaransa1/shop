"use client";

import { useState } from "react";

export default function ChallengePlayerButton({ playerId, playerName }: { playerId: string; playerName: string }) {
  const [message, setMessage] = useState("Ready for a friendly game?");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function sendChallenge() {
    setSending(true); setNotice(""); setError("");
    try {
      const response = await fetch("/api/community/challenges", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, message }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Challenge invitation could not be sent.");
      setNotice(`Challenge invitation sent to ${playerName}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Challenge invitation could not be sent.");
    } finally { setSending(false); }
  }

  return <div className="mt-8 max-w-xl border border-shop-border bg-white p-5">
    <p className="shop-eyebrow text-shop-muted">Friendly match</p><h2 className="shop-display mt-2 text-2xl">Challenge {playerName}.</h2>
    <label className="mt-4 grid gap-2 text-sm font-semibold">Optional message<textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={240} rows={2} className="w-full border border-shop-border px-3 py-3 font-normal outline-none focus:border-shop-ink" /></label>
    <button onClick={() => void sendChallenge()} disabled={sending} className="mt-4 bg-shop-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{sending ? "Sending invitation…" : "Send challenge invitation →"}</button>
    {notice && <p role="status" className="mt-3 text-sm text-emerald-800">{notice} <a className="underline" href="/dashboard/challenges">View invitations</a></p>}
    {error && <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}
    <p className="mt-3 text-xs leading-5 text-shop-muted">This sends an invitation. Live multiplayer chess will be connected in a later milestone.</p>
  </div>;
}
