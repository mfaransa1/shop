"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const PRESETS: Record<string, { timeControl: string; initialTimeMs: number; incrementMs: number }> = {
  bullet: { timeControl: "bullet", initialTimeMs: 60_000, incrementMs: 0 },
  "bullet-2-1": { timeControl: "bullet", initialTimeMs: 120_000, incrementMs: 1_000 },
  blitz: { timeControl: "blitz", initialTimeMs: 180_000, incrementMs: 2_000 },
  "blitz-5": { timeControl: "blitz", initialTimeMs: 300_000, incrementMs: 0 },
  rapid: { timeControl: "rapid", initialTimeMs: 600_000, incrementMs: 0 },
  "rapid-10-5": { timeControl: "rapid", initialTimeMs: 600_000, incrementMs: 5_000 },
  "rapid-15-10": { timeControl: "rapid", initialTimeMs: 900_000, incrementMs: 10_000 },
};

export default function StartChallengeGamePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const choice = search.get("timeControl") || "blitz";
  const requestKey = useRef("");

  const start = useCallback(async () => {
    const key = `${challengeId}:${choice}:${attempt}`;
    if (requestKey.current === key) return;
    requestKey.current = key;
    setStarting(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const preset = PRESETS[choice] ?? PRESETS.blitz;
      const response = await fetch("/api/chess/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({ challengeId, ...preset }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const record = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
      if (!response.ok) {
        const message = typeof record.error === "string" ? record.error : `Game creation failed (HTTP ${response.status}).`;
        throw new Error(`${message} Check that migrations 013 and 014 are applied and the challenge status is accepted.`);
      }
      const game = record.game && typeof record.game === "object" ? record.game as Record<string, unknown> : null;
      if (!game || typeof game.id !== "string") throw new Error("The server responded without a game ID. Check the POST /api/chess/games response and shop_start_chess_game RPC.");
      router.replace(`/chess/game/${encodeURIComponent(game.id)}`);
    } catch (cause) {
      requestKey.current = "";
      if (cause instanceof DOMException && cause.name === "AbortError") {
        setError("The game-start request timed out after 15 seconds. The database RPC may be missing, blocked, or still running. Check Supabase migration 202610090014_live_chess_server_api.sql and the browser Network tab for POST /api/chess/games.");
      } else {
        setError(cause instanceof Error ? cause.message : "Could not start the game. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      setStarting(false);
    }
  }, [challengeId, choice, attempt, router]);

  useEffect(() => { void start(); }, [start]);

  return <main className="mx-auto max-w-xl p-6">
    <p className="text-xs uppercase tracking-[.18em] text-slate-500">SHoP LIVE CHESS</p>
    <h1 className="mt-2 text-2xl font-bold">{starting ? "Starting your game" : error ? "We couldn't start the game" : "Opening chessboard…"}</h1>
    <p className="mt-2 text-slate-600">Preparing your accepted challenge using the <strong>{choice}</strong> time control…</p>
    {starting && <div className="mt-5 h-2 overflow-hidden rounded bg-slate-200"><div className="h-full w-1/2 animate-pulse bg-slate-800" /></div>}
    {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert">
      <p>{error}</p>
      <button type="button" onClick={() => { requestKey.current = ""; setAttempt((value) => value + 1); }} className="mt-4 bg-slate-900 px-4 py-2 font-semibold text-white">Retry starting game</button>
      <button type="button" onClick={() => router.push("/dashboard/challenges")} className="ml-2 mt-4 border border-red-300 px-4 py-2 font-semibold">Back to challenges</button>
    </div>}
    <p className="mt-4 text-xs text-slate-500">If this remains on screen, the server response or database function is failing; this page will now show a specific error instead of waiting indefinitely.</p>
  </main>;
}
