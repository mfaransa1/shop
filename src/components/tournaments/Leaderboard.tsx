"use client";

import type { LeaderboardEntry } from "@/types/tournament";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  title?: string;
  limit?: number;
  highlightPlayerId?: string;
  className?: string;
};

export default function Leaderboard({
  entries,
  title = "Leaderboard",
  limit,
  highlightPlayerId,
  className = "",
}: LeaderboardProps) {
  const visibleEntries = limit
    ? entries.slice(0, limit)
    : entries;

  return (
    <section
      className={[
        "overflow-hidden border border-shop-border bg-shop-cream text-[#111111]",
        className,
      ].join(" ")}
    >
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex items-center justify-between border-b border-shop-border px-5 py-5 sm:px-7">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-shop-muted">
            Standings
          </span>

          <h2 className="shop-display mt-2 text-3xl text-[#111111] sm:text-4xl">
            {title}
          </h2>
        </div>

        <span className="font-mono text-[9px] text-[#111111]/50">
          {entries.length}{" "}
          {entries.length === 1 ? "PLAYER" : "PLAYERS"}
        </span>
      </div>

      {/* =========================================================
          DESKTOP HEADER
      ========================================================= */}
      <div className="hidden grid-cols-[50px_1fr_80px_70px_70px_70px_70px] border-b border-shop-border px-5 py-3 text-[8px] font-bold uppercase tracking-[0.14em] text-[#111111]/45 md:grid md:px-7">
        <span>#</span>
        <span>Player</span>
        <span>Rating</span>
        <span>Played</span>
        <span>W</span>
        <span>D</span>
        <span>Pts</span>
      </div>

      {/* =========================================================
          LEADERBOARD ROWS
      ========================================================= */}
      <div>
        {visibleEntries.map((entry) => {
          const highlighted =
            entry.playerId === highlightPlayerId;

          return (
            <div
              key={entry.playerId}
              className={[
                "grid grid-cols-[38px_1fr_auto] gap-3 border-b border-shop-border px-5 py-5 last:border-b-0",
                "transition-colors duration-200",
                highlighted
                  ? "bg-[#111111] text-[#F3EDE2]"
                  : "bg-shop-cream text-[#111111] hover:bg-shop-paper",
                "md:grid-cols-[50px_1fr_80px_70px_70px_70px_70px] md:items-center md:px-7",
              ].join(" ")}
            >
              {/* Rank */}
              <span
                className={[
                  "font-mono text-xs",
                  highlighted
                    ? "text-[#F3EDE2]/70"
                    : "text-[#111111]/55",
                ].join(" ")}
              >
                {String(entry.rank).padStart(2, "0")}
              </span>

              {/* Player */}
              <div className="min-w-0">
                <p
                  className={[
                    "truncate text-sm font-semibold",
                    highlighted
                      ? "text-[#F3EDE2]"
                      : "text-[#111111]",
                  ].join(" ")}
                >
                  {entry.playerName}
                </p>

                {/* Mobile statistics */}
                <p
                  className={[
                    "mt-1 text-[8px] uppercase tracking-[0.12em] md:hidden",
                    highlighted
                      ? "text-[#F3EDE2]/40"
                      : "text-[#111111]/50",
                  ].join(" ")}
                >
                  {entry.played} played · {entry.wins}W ·{" "}
                  {entry.draws}D · {entry.losses}L
                </p>
              </div>

              {/* Rating */}
              <span
                className={[
                  "font-mono text-[10px]",
                  highlighted
                    ? "text-[#F3EDE2]/60"
                    : "text-[#111111]/60",
                ].join(" ")}
              >
                {entry.rating ?? "—"}
              </span>

              {/* Played */}
              <span
                className={[
                  "hidden font-mono text-[10px] md:block",
                  highlighted
                    ? "text-[#F3EDE2]/75"
                    : "text-[#111111]",
                ].join(" ")}
              >
                {entry.played}
              </span>

              {/* Wins */}
              <span
                className={[
                  "hidden font-mono text-[10px] md:block",
                  highlighted
                    ? "text-[#F3EDE2]/75"
                    : "text-[#111111]",
                ].join(" ")}
              >
                {entry.wins}
              </span>

              {/* Draws */}
              <span
                className={[
                  "hidden font-mono text-[10px] md:block",
                  highlighted
                    ? "text-[#F3EDE2]/75"
                    : "text-[#111111]",
                ].join(" ")}
              >
                {entry.draws}
              </span>

              {/* Points */}
              <span
                className={[
                  "font-mono text-sm font-semibold",
                  highlighted
                    ? "text-[#F3EDE2]"
                    : "text-[#111111]",
                ].join(" ")}
              >
                {entry.points}
              </span>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          EMPTY STATE
      ========================================================= */}
      {visibleEntries.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-[#111111]/45">
            No standings available yet.
          </p>
        </div>
      )}
    </section>
  );
}