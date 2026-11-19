"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getTimeControlPreset, timeControlKeyFromValues } from "@/lib/chess/time-controls";

type Challenge = {
  id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  message: string;
  created_at: string;
  direction: "sent" | "received";
  other_player_name: string;
  chess_time_control?: string;
  chess_initial_time_ms?: number;
  chess_increment_ms?: number;
};

function gameUrl(challenge: Challenge) {
  const key = timeControlKeyFromValues(
    challenge.chess_time_control ?? "blitz",
    Number(challenge.chess_initial_time_ms ?? 180_000),
    Number(challenge.chess_increment_ms ?? 0),
  );
  return `/chess/play/${encodeURIComponent(challenge.id)}?timeControl=${key}`;
}

export default function GlobalChallengeNotifications() {
  const router = useRouter();
  const pathname = usePathname();
  const [incoming, setIncoming] = useState<Challenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const previous = useRef<Map<string, string>>(new Map());
  const initialized = useRef(false);
  const inFlight = useRef(false);
  const handled = useRef<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (inFlight.current || document.visibilityState === "hidden") return;
    inFlight.current = true;
    try {
      const response = await fetch("/api/community/challenges", { cache: "no-store" });
      if (response.status === 401) return;
      const result = await response.json();
      if (!response.ok) return;
      const challenges = (result.challenges ?? []) as Challenge[];
      const old = previous.current;

      // If the sender is active on any SHoP page, move them into the game as soon
      // as the recipient accepts. Existing accepted invitations are not auto-opened.
      if (initialized.current) {
        const accepted = challenges.find((item) =>
          item.direction === "sent" && item.status === "accepted" &&
          old.get(item.id) === "pending" && !handled.current.has(item.id),
        );
        if (accepted) {
          handled.current.add(accepted.id);
          router.push(gameUrl(accepted));
        }
      }

      previous.current = new Map(challenges.map((item) => [item.id, item.status]));
      initialized.current = true;

      const nextIncoming = challenges.find((item) =>
        item.direction === "received" && item.status === "pending" && !handled.current.has(item.id),
      );
      if (nextIncoming) setIncoming((current) => current?.id === nextIncoming.id ? current : nextIncoming);
      else setIncoming((current) => current && challenges.some((item) => item.id === current.id && item.status === "pending") ? current : null);
    } catch {
      // Notifications are best-effort and must never disrupt normal site navigation.
    } finally {
      inFlight.current = false;
    }
  }, [router]);

  useEffect(() => {
    const first = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 5_000);
    const onVisibility = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  async function respond(status: "accepted" | "declined") {
    if (!incoming) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/community/challenges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: incoming.id, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not respond to this challenge.");
      const item = incoming;
      handled.current.add(item.id);
      setIncoming(null);
      if (status === "accepted") router.push(gameUrl(item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not respond to this challenge.");
    } finally {
      setBusy(false);
    }
  }

  if (!incoming || pathname === "/dashboard/challenges") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-3 sm:items-center sm:p-6" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="shop-challenge-notice-title" className="w-full max-w-md border border-shop-border bg-shop-paper p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="shop-eyebrow text-shop-muted">SHoP · Live challenge</p>
            <h2 id="shop-challenge-notice-title" className="shop-display mt-3 text-3xl">You have a game invitation.</h2>
          </div>
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dcebd8] text-xl text-[#205c2c]">♟</span>
        </div>
        <p className="mt-5 text-sm leading-6"><strong>{incoming.other_player_name}</strong> wants to play a game with you.</p>
        {incoming.message && <blockquote className="mt-3 border-l-2 border-shop-ink/30 pl-3 text-sm italic leading-6 text-shop-muted">“{incoming.message}”</blockquote>}
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-shop-muted">Selected time: {getTimeControlPreset(timeControlKeyFromValues(incoming.chess_time_control ?? "blitz", Number(incoming.chess_initial_time_ms ?? 180_000), Number(incoming.chess_increment_ms ?? 0))).label}</p>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" disabled={busy} onClick={() => void respond("declined")} className="border border-shop-border px-4 py-3 text-sm font-semibold disabled:opacity-50">Decline</button>
          <button type="button" disabled={busy} onClick={() => void respond("accepted")} className="bg-shop-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Please wait…" : "Accept & play"}</button>
        </div>
        <p className="mt-4 text-xs leading-5 text-shop-muted">You can accept this invitation from anywhere on the SHoP website. Your game will open automatically.</p>
      </section>
    </div>
  );
}
