"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  player_id: string;
  display_name: string;
  skill_level: string;
  bio: string;
  last_seen: string;
};

type Challenge = {
  id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  created_at: string;
  direction: "sent" | "received";
};

export default function OnlinePlayersDirectory() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [checkedAt, setCheckedAt] = useState("");
  const [challengingId, setChallengingId] = useState<string | null>(null);
  const previousStatuses = useRef<Map<string, string>>(new Map());
  const challengesInitialized = useRef(false);
  const refreshInFlight = useRef(false);
  const autoOpened = useRef(false);

  const refreshPlayers = useCallback(async () => {
    try {
      const response = await fetch("/api/community/players", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Could not load online players.");
      }
      setPlayers(result.players ?? []);
      setCheckedAt(result.checkedAt ?? new Date().toISOString());
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load online players.");
    } finally {
      setLoading(false);
    }
  }, []);

  // If this page's sender challenge becomes accepted, open it without requiring
  // the player to return to /dashboard/challenges and click Play challenge.
  const refreshChallenges = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;

    try {
      const response = await fetch("/api/community/challenges", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) return;

      const challenges = (result.challenges ?? []) as Challenge[];
      const previous = previousStatuses.current;
      const acceptedNow = challenges.find(
        (item) =>
          item.direction === "sent" &&
          item.status === "accepted" &&
          previous.get(item.id) === "pending",
      );

      previousStatuses.current = new Map(
        challenges.map((item) => [item.id, item.status]),
      );

      // Never auto-open a previously accepted challenge on first load.
      if (!challengesInitialized.current) {
        challengesInitialized.current = true;
        return;
      }

      if (acceptedNow && !autoOpened.current) {
        autoOpened.current = true;
        setNotice("Your opponent accepted. Opening the chess game…");
        router.push(`/chess/play/${encodeURIComponent(acceptedNow.id)}?timeControl=blitz`);
      }
    } catch {
      // Challenge polling is best-effort; don't interrupt browsing.
    } finally {
      refreshInFlight.current = false;
    }
  }, [router]);

  useEffect(() => {
    // Defer initial requests so the effect does not synchronously trigger state updates.
    const initialRefresh = window.setTimeout(() => {
      void refreshPlayers();
      void refreshChallenges();
    }, 0);

    const playerTimer = window.setInterval(() => void refreshPlayers(), 30_000);
    const challengeTimer = window.setInterval(() => void refreshChallenges(), 5_000);

    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(playerTimer);
      window.clearInterval(challengeTimer);
    };
  }, [refreshPlayers, refreshChallenges]);

  async function challengePlayer(player: Player) {
    setChallengingId(player.player_id);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/community/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          displayName: player.display_name,
          message: "",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? `Could not challenge ${player.display_name}.`);
      }

      setNotice(result.message ?? `Challenge sent to ${player.display_name}. We'll open the game when they accept.`);
      // Seed current state from the API so the next poll can detect the transition.
      await refreshChallenges();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send the challenge.");
    } finally {
      setChallengingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="shop-eyebrow text-shop-muted">Live club presence</p>
          <h2 className="shop-display mt-2 text-3xl">Players online now.</h2>
          <p className="mt-2 text-sm leading-6 text-shop-muted">
            Challenge an online player directly. When they accept, your game opens automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setLoading(true); void refreshPlayers(); void refreshChallenges(); }}
          className="border border-shop-border px-4 py-2 text-sm font-semibold"
        >
          Refresh list ↻
        </button>
      </div>

      {notice && (
        <p role="status" className="mb-5 border border-green-300 bg-green-50 p-4 text-sm text-green-900">
          {notice}
        </p>
      )}
      {error && (
        <div role="alert" className="mb-5 border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {loading ? (
        <p className="border border-shop-border bg-white p-6 text-sm text-shop-muted">
          Checking who is online…
        </p>
      ) : players.length === 0 ? (
        <div className="border border-shop-border bg-white p-8">
          <h3 className="shop-display text-2xl">No players showing online yet.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-shop-muted">
            Players need to be signed in and active on the SHoP dashboard or challenge page, with public-profile visibility enabled.
            Invite a friend to sign in and opt in to appear here.
          </p>
          <Link
            href="/dashboard/community-settings"
            className="mt-5 inline-flex border border-shop-border px-4 py-3 text-sm font-semibold"
          >
            Review profile visibility →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <article key={player.player_id} className="border border-shop-border bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-shop-border bg-shop-cream text-lg font-semibold">
                  {player.display_name.trim().charAt(0).toUpperCase() || "S"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{player.display_name}</p>
                  <p className="mt-1 text-xs text-shop-muted">{player.skill_level || "Beginner"}</p>
                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                    Online now
                  </p>
                </div>
              </div>

              {player.bio && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-shop-muted">{player.bio}</p>
              )}

              <button
                type="button"
                disabled={challengingId !== null}
                onClick={() => void challengePlayer(player)}
                className="mt-5 flex w-full items-center justify-center bg-shop-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {challengingId === player.player_id
                  ? "Sending challenge…"
                  : challengingId
                    ? "Please wait…"
                    : "Challenge →"}
              </button>
            </article>
          ))}
        </div>
      )}

      {checkedAt && (
        <p className="mt-4 text-xs text-shop-muted">
          Last checked {new Date(checkedAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}.
        </p>
      )}
    </div>
  );
}
