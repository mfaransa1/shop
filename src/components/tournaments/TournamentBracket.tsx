"use client";

import type {
  TournamentRound,
} from "@/types/tournament";

type TournamentBracketProps = {
  rounds: TournamentRound[];
  className?: string;
};

export default function TournamentBracket({
  rounds,
  className = "",
}: TournamentBracketProps) {
  if (!rounds.length) {
    return (
      <div
        className={[
          "border border-shop-border bg-shop-cream p-8",
          className,
        ].join(" ")}
      >
        <p className="text-sm text-shop-muted">
          Tournament bracket will appear here once
          the draw is available.
        </p>
      </div>
    );
  }

  return (
    <section
      className={[
        "overflow-x-auto border border-shop-border bg-shop-cream",
        className,
      ].join(" ")}
    >
      <div className="min-w-[900px] p-6 sm:p-8 lg:p-10">
        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: `repeat(${rounds.length}, minmax(190px, 1fr))`,
          }}
        >
          {rounds.map((round, roundIndex) => (
            <div key={round.id}>
              <div className="border-b border-shop-border pb-4">
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-shop-muted/60">
                  Round {roundIndex + 1}
                </span>

                <h3 className="shop-display mt-2 text-2xl">
                  {round.name}
                </h3>
              </div>

              <div
                className={[
                  "mt-6 space-y-5",
                  roundIndex === 1
                    ? "pt-10"
                    : "",
                  roundIndex === 2
                    ? "pt-20"
                    : "",
                ].join(" ")}
              >
                {round.matches.map((match) => {
                  const player1Name =
                    match.player1?.name ??
                    "TBD";

                  const player2Name =
                    match.player2?.name ??
                    "TBD";

                  const player1Winner =
                    match.winnerId ===
                    match.player1?.id;

                  const player2Winner =
                    match.winnerId ===
                    match.player2?.id;

                  return (
                    <div
                      key={match.id}
                      className="overflow-hidden border border-shop-border bg-shop-paper"
                    >
                      <div
                        className={[
                          "flex items-center justify-between border-b border-shop-border px-4 py-3",
                          player1Winner
                            ? "bg-[#111111] text-[#F3EDE2]"
                            : "",
                        ].join(" ")}
                      >
                        <span className="truncate text-xs font-semibold">
                          {player1Name}
                        </span>

                        <span className="ml-3 font-mono text-xs">
                          {match.player1Score ??
                            "—"}
                        </span>
                      </div>

                      <div
                        className={[
                          "flex items-center justify-between px-4 py-3",
                          player2Winner
                            ? "bg-[#111111] text-[#F3EDE2]"
                            : "",
                        ].join(" ")}
                      >
                        <span className="truncate text-xs font-semibold">
                          {player2Name}
                        </span>

                        <span className="ml-3 font-mono text-xs">
                          {match.player2Score ??
                            "—"}
                        </span>
                      </div>

                      <div className="border-t border-shop-border px-4 py-2">
                        <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-shop-muted/50">
                          {match.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}