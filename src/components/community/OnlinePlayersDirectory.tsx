"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ChessTimeControlSelect from "@/components/chess/ChessTimeControlSelect";

type Player = {
  player_id: string;
  display_name: string;
  skill_level: string;
  bio: string;
  last_seen: string;
};

export default function OnlinePlayersDirectory() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [checkedAt, setCheckedAt] = useState("");
  const [challengingId, setChallengingId] = useState<string | null>(null);
  const [timeControlKey, setTimeControlKey] = useState("blitz-3-0");

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


  useEffect(() => {
    // Defer initial requests so the effect does not synchronously trigger state updates.
    const initialRefresh = window.setTimeout(() => {
      void refreshPlayers();
    }, 0);

    const playerTimer = window.setInterval(() => void refreshPlayers(), 30_000);

    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(playerTimer);
    };
  }, [refreshPlayers]);

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
          playerId: player.player_id,
          message: "",
          timeControlKey,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? `Could not challenge ${player.display_name}.`);
      }

      setNotice(result.message ?? `Challenge sent to ${player.display_name}. We'll open the game when they accept.`);
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
            Choose your preferred clock, challenge an online player, and receive an in-page invitation alert when they accept.
          </p>
          <ChessTimeControlSelect value={timeControlKey} onChange={setTimeControlKey} className="mt-4 max-w-xs" />
        </div>
        <button
          type="button"
          onClick={() => { setLoading(true); void refreshPlayers(); }}
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
            Review profile visibility 
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
                    : "Challenge "}
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
