"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChessTimeControlSelect from "@/components/chess/ChessTimeControlSelect";
import { timeControlKeyFromValues } from "@/lib/chess/time-controls";

type Challenge = {
  id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  message: string;
  created_at: string;
  direction: "sent" | "received";
  other_player_name: string;
  chess_time_control?: string; chess_initial_time_ms?: number; chess_increment_ms?: number;
};

export default function FriendChallenges() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [timeControlKey, setTimeControlKey] = useState("blitz-3-0");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);
  const refreshInFlight = useRef(false);

  const refresh = useCallback(async () => {
    // Do not overlap polls or allow an older response to overwrite a newer status.
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;

    try {
      const response = await fetch("/api/community/challenges", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Could not load invitations.");
      }

      const nextChallenges = (result.challenges ?? []) as Challenge[];
      setChallenges(nextChallenges);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load invitations.",
      );
    } finally {
      setLoading(false);
      refreshInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => { void refresh(); }, 0);
    const interval = window.setInterval(() => { void refresh(); }, 5000);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
    };
  }, [refresh]);

  async function sendInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setNotice("");
    setError("");

    try {
      const response = await fetch("/api/community/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, message, timeControlKey }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Invitation could not be sent.");
      }
      setNotice(result.message ?? "Invitation sent.");
      setDisplayName("");
      setMessage("");
      await refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Invitation could not be sent.",
      );
    } finally {
      setSending(false);
    }
  }

  async function respond(id: string, status: "accepted" | "declined") {
    setNotice("");
    setError("");
    setRespondingId(id);

    try {
      const response = await fetch("/api/community/challenges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Response could not be saved.");
      }

      if (status === "accepted") {
        // Record the local status before navigating so a poll cannot race this action.
        setStartingId(id);
        setNotice("Challenge accepted. Opening the chess game…");
        router.push(
          `/chess/play/${encodeURIComponent(id)}?timeControl=${timeControlKeyFromValues(challenges.find((item) => item.id === id)?.chess_time_control ?? "blitz", Number(challenges.find((item) => item.id === id)?.chess_initial_time_ms ?? 180000), Number(challenges.find((item) => item.id === id)?.chess_increment_ms ?? 0))}`,
        );
        return;
      }

      setNotice(result.message ?? "Invitation declined.");
      await refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Response could not be saved.",
      );
    } finally {
      setRespondingId(null);
    }
  }

  function openGame(id: string) {
    setStartingId(id);
    const item = challenges.find((challenge) => challenge.id === id);
    router.push(`/chess/play/${encodeURIComponent(id)}?timeControl=${timeControlKeyFromValues(item?.chess_time_control ?? "blitz", Number(item?.chess_initial_time_ms ?? 180000), Number(item?.chess_increment_ms ?? 0))}`);
  }

  return (
    <div className="space-y-8">
      <section className="border border-shop-border bg-white p-6 md:p-8">
        <p className="shop-eyebrow text-shop-muted">Play together</p>
        <h2 className="shop-display mt-3 text-3xl">Invite a player.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-shop-muted">
          Browse players who are online, open their profile, and challenge them
          directly. Choose Bullet, Blitz or Rapid for every invitation. Accepted invitations open the game automatically.
        </p>
        <div className="mt-6">
          <Link
            href="/community/players"
            className="inline-flex bg-shop-ink px-5 py-3 text-sm font-semibold !text-white"
          >
            Find online players 
          </Link>
        </div>
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-semibold underline underline-offset-4">
            Or enter a display name manually
          </summary>
          <form onSubmit={sendInvitation} className="mt-4 grid gap-4">
            <ChessTimeControlSelect value={timeControlKey} onChange={setTimeControlKey} className="max-w-xs" />
            <label className="grid gap-2 text-sm font-semibold">
              Player’s public display name
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                minLength={2}
                maxLength={60}
                autoComplete="off"
                className="w-full border border-shop-border px-4 py-3 font-normal outline-none focus:border-shop-ink"
                placeholder="Exact public name"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Optional message
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={240}
                rows={3}
                className="w-full resize-y border border-shop-border px-4 py-3 font-normal outline-none focus:border-shop-ink"
                placeholder="Ready for a friendly game?"
              />
            </label>
            <div>
              <button
                disabled={sending}
                className="bg-shop-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send invitation "}
              </button>
            </div>
          </form>
        </details>
      </section>

      {notice && (
        <p role="status" className="border border-green-300 bg-green-50 p-4 text-sm text-green-900">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </p>
      )}

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="shop-eyebrow text-shop-muted">Your activity</p>
            <h2 className="shop-display mt-2 text-3xl">Challenge invitations.</h2>
          </div>
          <button
            onClick={() => void refresh()}
            className="border border-shop-border px-4 py-2 text-sm font-semibold"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-sm text-shop-muted">Loading invitations…</p>
        ) : challenges.length === 0 ? (
          <div className="border border-shop-border p-6 text-sm leading-7 text-shop-muted">
            No invitations yet. Invite an opted-in player above or share your public
            profile with a friend.
          </div>
        ) : (
          <div className="grid gap-3">
            {challenges.map((item) => (
              <article
                key={item.id}
                className="border border-shop-border bg-white p-5 md:flex md:items-center md:justify-between md:gap-5"
              >
                <div>
                  <p className="font-semibold">
                    {item.direction === "sent"
                      ? `Invitation to ${item.other_player_name}`
                      : `Invitation from ${item.other_player_name}`}
                  </p>
                  <p className="mt-1 text-xs text-shop-muted">
                    {new Date(item.created_at).toLocaleString()} · {item.status}
                  </p>
                  {item.message && (
                    <p className="mt-3 text-sm leading-6">“{item.message}”</p>
                  )}
                </div>

                {item.direction === "received" && item.status === "pending" && (
                  <div className="mt-4 flex gap-2 md:mt-0">
                    <button
                      disabled={respondingId === item.id}
                      onClick={() => void respond(item.id, "accepted")}
                      className="bg-shop-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {respondingId === item.id ? "Opening…" : "Accept & play"}
                    </button>
                    <button
                      disabled={respondingId === item.id}
                      onClick={() => void respond(item.id, "declined")}
                      className="border border-shop-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {item.status === "accepted" && (
                  <div className="mt-4 md:mt-0">
                    <button
                      disabled={startingId === item.id}
                      onClick={() => openGame(item.id)}
                      className="bg-shop-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {startingId === item.id ? "Opening game…" : "Play challenge "}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
