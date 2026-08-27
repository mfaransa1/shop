import Link from "next/link";
import type { Tournament } from "@/types/tournament";

type TournamentCardProps = {
  tournament: Tournament;
  className?: string;
};

const statusLabels: Record<
  Tournament["status"],
  string
> = {
  upcoming: "Coming up",
  "registration-open": "Registration open",
  ongoing: "Live now",
  completed: "Completed",
};

export default function TournamentCard({
  tournament,
  className = "",
}: TournamentCardProps) {
  const date = new Date(
    `${tournament.date}T00:00:00`
  );

  const formattedDate = date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <article
      className={[
        "group overflow-hidden border border-shop-border bg-shop-cream",
        "transition-transform duration-500 hover:-translate-y-1",
        className,
      ].join(" ")}
    >
      <div className="relative overflow-hidden bg-[#111111] px-6 py-7 text-[#F3EDE2] sm:px-8">
        <div className="flex items-start justify-between gap-6">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/45">
            {statusLabels[tournament.status]}
          </span>

          {tournament.featured && (
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/30">
              Featured
            </span>
          )}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -right-4 font-serif text-[8rem] leading-none text-[#F3EDE2]/[0.025]"
        >
          ♞
        </div>

        <p className="mt-10 font-mono text-[10px] tracking-[0.12em] text-[#F3EDE2]/40">
          {formattedDate}
          {tournament.time
            ? ` · ${tournament.time}`
            : ""}
        </p>

        <h3 className="shop-display relative z-10 mt-4 max-w-lg text-4xl leading-[0.88] sm:text-5xl">
          {tournament.name}
        </h3>
      </div>

      <div className="p-6 sm:p-8">
        <p className="max-w-xl text-sm leading-6 text-shop-muted">
          {tournament.description}
        </p>

        <div className="mt-7 grid grid-cols-2 border-y border-shop-border">
          <div className="border-r border-shop-border py-4 pr-4">
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-shop-muted/60">
              Format
            </span>

            <p className="mt-2 text-sm font-semibold">
              {tournament.format}
            </p>
          </div>

          <div className="py-4 pl-4">
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-shop-muted/60">
              Location
            </span>

            <p className="mt-2 text-sm font-semibold">
              {tournament.location}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-5">
          <div>
            {tournament.registeredPlayers !==
              undefined &&
              tournament.maxPlayers !==
                undefined && (
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-shop-muted">
                  {tournament.registeredPlayers}/
                  {tournament.maxPlayers} players
                </p>
              )}

            {tournament.prize && (
              <p className="mt-2 text-xs text-shop-muted">
                {tournament.prize}
              </p>
            )}
          </div>

          <Link
            href={`/events/${tournament.slug}`}
            className="group/link inline-flex shrink-0 items-center gap-3 bg-[#111111] px-5 py-3 text-xs font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="!text-[#F3EDE2]">
              View tournament
            </span>

            <span className="!text-[#F3EDE2] transition-transform duration-300 group-hover/link:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}