import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

import TournamentCard from "@/components/tournaments/TournamentCard";
import Leaderboard from "@/components/tournaments/Leaderboard";
import TournamentBracket from "@/components/tournaments/TournamentBracket";

import {
  getTournamentBySlug,
  tournaments,
} from "@/data/events";

type TournamentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return tournaments.map((tournament) => ({
    slug: tournament.slug,
  }));
}

export default async function TournamentPage({
  params,
}: TournamentPageProps) {
  const { slug } = await params;

  const tournament = getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const date = new Date(
    `${tournament.date}T00:00:00`
  );

  const formattedDate = date.toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <>
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#111111] text-[#F3EDE2]">
          {/* Ambient chess atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#F3EDE2]/[0.025] blur-[120px]" />

            <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#F3EDE2]/[0.02] blur-[130px]" />

            <div className="absolute right-[8%] top-[20%] hidden font-serif text-[18rem] leading-none text-[#F3EDE2]/[0.018] lg:block">
              ♞
            </div>
          </div>

          <div className="shop-container relative z-10 py-28 md:py-36 lg:py-44">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#F3EDE2]/30" />

                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  SHoP / Tournament
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-8 max-w-6xl">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/40">
                  {tournament.status.replace(
                    "-",
                    " "
                  )}
                </span>

                <h1 className="shop-display mt-5 text-[clamp(4rem,9vw,9rem)] leading-[0.8]">
                  {tournament.name}
                </h1>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-12 grid gap-8 border-t border-[#F3EDE2]/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#F3EDE2]/35">
                    Date
                  </span>

                  <p className="mt-3 text-sm font-semibold">
                    {formattedDate}
                  </p>
                </div>

                <div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#F3EDE2]/35">
                    Time
                  </span>

                  <p className="mt-3 text-sm font-semibold">
                    {tournament.time ?? "TBA"}
                  </p>
                </div>

                <div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#F3EDE2]/35">
                    Format
                  </span>

                  <p className="mt-3 text-sm font-semibold">
                    {tournament.format}
                  </p>
                </div>

                <div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#F3EDE2]/35">
                    Venue
                  </span>

                  <p className="mt-3 text-sm font-semibold">
                    {tournament.venue}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            INTRO + REGISTRATION
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
              <Reveal>
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    01 — About the tournament
                  </p>

                  <h2 className="shop-display mt-8 max-w-4xl text-[clamp(3.25rem,6vw,6rem)] leading-[0.86]">
                    Play the position.
                    <br />
                    Meet the people.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    {tournament.description}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className="border border-shop-border bg-shop-paper p-7 sm:p-9">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-shop-muted">
                    Tournament details
                  </span>

                  <div className="mt-8 divide-y divide-shop-border">
                    <div className="flex items-center justify-between gap-5 py-4">
                      <span className="text-xs text-shop-muted">
                        Entry
                      </span>

                      <span className="text-sm font-semibold">
                        {tournament.entryFee ??
                          "Contact SHoP"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 py-4">
                      <span className="text-xs text-shop-muted">
                        Prize
                      </span>

                      <span className="text-right text-sm font-semibold">
                        {tournament.prize ??
                          "TBA"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 py-4">
                      <span className="text-xs text-shop-muted">
                        Players
                      </span>

                      <span className="text-sm font-semibold">
                        {tournament.registeredPlayers ??
                          0}
                        {tournament.maxPlayers
                          ? ` / ${tournament.maxPlayers}`
                          : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 py-4">
                      <span className="text-xs text-shop-muted">
                        Location
                      </span>

                      <span className="text-right text-sm font-semibold">
                        {tournament.location}
                      </span>
                    </div>
                  </div>

                  {tournament.status ===
                    "registration-open" && (
                    <Link
                      href="/join"
                      className="group mt-7 flex items-center justify-between bg-[#111111] px-5 py-4 text-sm font-semibold !text-[#F3EDE2] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <span className="!text-[#F3EDE2]">
                        Register interest
                      </span>

                      <span className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            LEADERBOARD
        ========================================================= */}
        {tournament.leaderboard.length > 0 && (
          <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
            <div className="shop-container py-24 md:py-32 lg:py-40">
              <Reveal>
                <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                  <p className="shop-eyebrow text-[#F3EDE2]/45">
                    02 — Standings
                  </p>

                  <div>
                    <h2 className="shop-display text-[clamp(3.25rem,6vw,6rem)] leading-[0.86]">
                      Who is
                      <br />
                      leading?
                    </h2>

                    <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/45">
                      Follow the tournament as players battle for position
                      across every round.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-16">
                  <Leaderboard
                    entries={tournament.leaderboard}
                    title={tournament.name}
                  />
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* =========================================================
            BRACKET
        ========================================================= */}
        {tournament.rounds &&
          tournament.rounds.length > 0 && (
            <section className="overflow-hidden bg-shop-cream">
              <div className="shop-container py-24 md:py-32 lg:py-40">
                <Reveal>
                  <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                    <p className="shop-eyebrow text-shop-muted">
                      03 — Tournament bracket
                    </p>

                    <div>
                      <h2 className="shop-display text-[clamp(3.25rem,6vw,6rem)] leading-[0.86]">
                        Every round
                        <br />
                        changes the board.
                      </h2>

                      <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                        Follow the path from the opening round to the final.
                      </p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={160}>
                  <div className="mt-16">
                    <TournamentBracket
                      rounds={tournament.rounds}
                    />
                  </div>
                </Reveal>
              </div>
            </section>
          )}

        {/* =========================================================
            PLAYERS
        ========================================================= */}
        {tournament.players.length > 0 && (
          <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
            <div className="shop-container py-24 md:py-32 lg:py-40">
              <Reveal>
                <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                  <p className="shop-eyebrow text-[#F3EDE2]/45">
                    04 — Players
                  </p>

                  <div>
                    <h2 className="shop-display text-[clamp(3.25rem,6vw,6rem)] leading-[0.86]">
                      Know who
                      <br />
                      you're playing.
                    </h2>
                  </div>
                </div>
              </Reveal>

              <div className="mt-16 grid gap-px bg-[#F3EDE2]/10 sm:grid-cols-2 lg:grid-cols-4">
                {tournament.players.map(
                  (player, index) => (
                    <Reveal
                      key={player.id}
                      delay={index * 60}
                    >
                      <div className="h-full bg-[#111111] p-6 transition-colors duration-300 hover:bg-[#F3EDE2]/[0.035] sm:p-7">
                        <span className="font-mono text-[9px] text-[#F3EDE2]/25">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h3 className="shop-display mt-8 text-2xl leading-none">
                          {player.name}
                        </h3>

                        {player.rating && (
                          <p className="mt-4 font-mono text-[9px] text-[#F3EDE2]/40">
                            RATING {player.rating}
                          </p>
                        )}

                        {player.club && (
                          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#F3EDE2]/25">
                            {player.club}
                          </p>
                        )}
                      </div>
                    </Reveal>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            BACK TO EVENTS
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-20 md:py-28">
            <Reveal>
              <div className="flex flex-col gap-6 border-t border-shop-border pt-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-shop-muted">
                    More from SHoP
                  </span>

                  <p className="mt-3 text-sm text-shop-muted">
                    Explore more tournaments and community events.
                  </p>
                </div>

                <Link
                  href="/events"
                  className="group inline-flex w-fit items-center gap-3 text-sm font-semibold"
                >
                  All events

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}