import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

const upcomingEvents = [
  {
    number: "01",
    status: "UPCOMING",
    date: "01",
    month: "TBA",
    title: "SHoP Chess Tournament",
    type: "TOURNAMENT",
    description:
      "A community tournament bringing young players together to compete, learn and experience the energy of chess beyond regular sessions.",
  },
  {
    number: "02",
    status: "REGULAR",
    date: "SAT",
    month: "WEEKLY",
    title: "Saturday Chess Sessions",
    type: "COMMUNITY",
    description:
      "Weekly opportunities to learn, play, analyse games and spend time around the board with the SHoP community.",
  },
  {
    number: "03",
    status: "COMING SOON",
    date: "—",
    month: "TBA",
    title: "School Chess Events",
    type: "SCHOOLS",
    description:
      "Chess activities and competitions connecting schools, young players and the wider chess community.",
  },
];

const calendar = [
  {
    month: "01",
    title: "Saturday Sessions",
    frequency: "EVERY SATURDAY",
    description:
      "Regular community sessions for learning, playing and connecting.",
  },
  {
    month: "02",
    title: "Community Tournament",
    frequency: "UPCOMING",
    description:
      "A competitive day where players put their skills to the test.",
  },
  {
    month: "03",
    title: "School Chess",
    frequency: "COMING SOON",
    description:
      "Chess activities designed to bring more young players into the game.",
  },
  {
    month: "04",
    title: "Special Events",
    frequency: "AS ANNOUNCED",
    description:
      "Workshops, competitions and community activities throughout the year.",
  },
];

const tournamentTypes = [
  {
    number: "01",
    title: "Community",
    description:
      "Friendly competitive events where players can experience tournament chess in a welcoming environment.",
  },
  {
    number: "02",
    title: "Schools",
    description:
      "Events that create opportunities for young players to represent their schools and compete.",
  },
  {
    number: "03",
    title: "Open",
    description:
      "More competitive formats designed for players ready to test themselves against a wider field.",
  },
];

const highlights = [
  {
    number: "01",
    title: "The first move",
    text: "Every tournament begins with the same thing: someone sitting down and deciding to play.",
  },
  {
    number: "02",
    title: "The challenge",
    text: "Competition creates pressure, but it also creates some of the fastest opportunities to learn.",
  },
  {
    number: "03",
    title: "The next game",
    text: "Win or lose, every game gives you something to take into the next one.",
  },
];

export default function TournamentsPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative min-h-screen overflow-hidden bg-[#111111] text-[#F3EDE2]">
          {/* Ambient gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[130px] animate-[events-orb_13s_ease-in-out_infinite]" />

            <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[#F3EDE2]/[0.025] blur-[140px] animate-[events-orb-reverse_16s_ease-in-out_infinite]" />
          </div>

          {/* Chess notation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-4rem] top-1/3 hidden rotate-90 text-[9px] font-semibold tracking-[0.4em] text-[#F3EDE2]/[0.06] lg:block"
          >
            01. e4&nbsp;&nbsp; c5&nbsp;&nbsp; 02. Nf3&nbsp;&nbsp; Nc6&nbsp;&nbsp;
            03. d4&nbsp;&nbsp; cxd4&nbsp;&nbsp; 04. Nxd4
          </div>

          <div className="shop-container relative z-10 flex min-h-screen items-center py-32 md:py-40 lg:py-44">
            <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
              {/* Hero copy */}
              <div>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-10 bg-[#F3EDE2]/40" />

                    <p className="shop-eyebrow text-[#F3EDE2]/55">
                      Events · Tournaments
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <h1 className="shop-display mt-8 max-w-6xl text-[clamp(4rem,9vw,9.5rem)] leading-[0.8]">
                    The next move
                    <br />
                    starts here.
                  </h1>
                </Reveal>

                <Reveal delay={260}>
                  <p className="mt-10 max-w-xl text-base leading-7 text-[#F3EDE2]/55 sm:text-lg sm:leading-8">
                    From Saturday sessions to competitive tournaments, SHoP
                    creates opportunities for young players to play, compete
                    and discover what they can do.
                  </p>
                </Reveal>

                <Reveal delay={400}>
                  <div className="mt-10 flex flex-wrap gap-3">
  <Link
    href="#upcoming"
    className="group inline-flex items-center gap-4 bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-all duration-300 hover:-translate-y-1"
  >
    <span className="!text-[#111111]">
      See upcoming events
    </span>

    <span
      aria-hidden="true"
      className="!text-[#111111] transition-transform duration-300 group-hover:translate-y-1"
    >
      ↓
    </span>
  </Link>

  <Link
    href="/join"
    className="inline-flex items-center gap-4 border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:bg-[#F3EDE2] hover:!text-[#111111]"
  >
    <span className="!text-current">
      Join SHoP
    </span>
  </Link>
</div>
                </Reveal>

                <Reveal delay={520}>
                  <div className="mt-14 flex items-center justify-between border-t border-[#F3EDE2]/10 pt-5">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                      KAWANGWARE · NAIROBI
                    </span>

                    <span className="hidden text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30 sm:block">
                      SHoP / EVENTS
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Hero visual */}
              <Reveal delay={180}>
                <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                    <Image
                      src="/images/sessions/session-03.jpg"
                      alt="Chess players during a SHoP session"
                      fill
                      priority
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="object-cover object-center animate-[events-image-in_1200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    <div className="absolute left-5 top-5">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-white/55">
                        SHoP / 07
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                        COMPETITION
                      </span>

                      <p className="shop-display mt-3 text-3xl leading-none text-white sm:text-4xl">
                        Every game is another opportunity.
                      </p>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 -left-4 bg-[#F3EDE2] px-5 py-4 text-[#111111] sm:-left-7">
                    <span className="text-[9px] font-bold tracking-[0.18em]">
                      MAKE YOUR MOVE
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            UPCOMING
        ========================================================= */}
        <section
          id="upcoming"
          className="scroll-mt-20 overflow-hidden bg-shop-cream"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    01 — Upcoming
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted lg:block">
                    There is always another game to prepare for.
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Find your next game.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Follow upcoming tournaments, regular sessions and new
                    opportunities to compete with the SHoP community.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-shop-border">
              {upcomingEvents.map((event, index) => (
                <Reveal key={event.number} delay={index * 100}>
                  <article className="group grid gap-7 border-b border-shop-border py-9 transition-colors duration-500 hover:bg-shop-paper md:grid-cols-[80px_150px_1fr_80px] md:items-center md:gap-8 md:px-6 md:py-11">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                      {event.number}
                    </span>

                    <div>
                      <span className="block text-[9px] font-bold tracking-[0.18em] text-shop-muted/70">
                        {event.status}
                      </span>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="shop-display text-4xl leading-none">
                          {event.date}
                        </span>

                        <span className="text-[9px] font-bold tracking-[0.15em] text-shop-muted">
                          {event.month}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                        {event.type}
                      </span>

                      <h3 className="shop-display mt-3 text-3xl leading-none transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                        {event.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-sm leading-6 text-shop-muted">
                        {event.description}
                      </p>
                    </div>

                    <div className="flex md:justify-end">
                      <span className="flex h-11 w-11 items-center justify-center border border-shop-border text-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#111111] group-hover:text-[#F3EDE2]">
                        →
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            CALENDAR
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  02 — Calendar
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Keep an eye on the board.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Regular sessions and special events create a rhythm for
                    the SHoP community throughout the year.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-[#F3EDE2]/15">
              {calendar.map((item, index) => (
                <Reveal key={item.month} delay={index * 80}>
                  <article className="group grid gap-6 border-b border-[#F3EDE2]/15 py-8 md:grid-cols-[90px_0.8fr_0.8fr_1.2fr] md:items-center md:gap-10 md:px-6 md:py-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      {item.month}
                    </span>

                    <h3 className="shop-display text-3xl leading-none transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                      {item.title}
                    </h3>

                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/40">
                      {item.frequency}
                    </span>

                    <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/45 md:text-base md:leading-7">
                      {item.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            TOURNAMENT TYPES
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">
                  03 — Tournament formats
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Different boards.
                    <br />
                    Same game.
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-shop-border">
              {tournamentTypes.map((item, index) => (
                <Reveal key={item.number} delay={index * 100}>
                  <article className="group grid gap-7 border-b border-shop-border py-10 transition-colors duration-500 hover:bg-shop-paper md:grid-cols-[80px_0.8fr_1.2fr] md:items-center md:gap-10 md:px-6 md:py-12">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                      {item.number}
                    </span>

                    <h3 className="shop-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                      {item.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-shop-muted md:text-base md:leading-7">
                      {item.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SATURDAY SESSIONS
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-[#F3EDE2]/45">
                    04 — Saturday sessions
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Competition starts with practice.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Before the tournament comes the board. Join regular
                    Saturday sessions to build your game and meet the people
                    you'll eventually compete alongside.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-16 grid gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-stretch">
                <div className="relative min-h-[420px] overflow-hidden">
                  <Image
                    src="/images/sessions/session-01.jpg"
                    alt="Chess session at SHoP"
                    fill
                    sizes="(max-width: 767px) 100vw, 60vw"
                    className="object-cover transition-transform duration-1000 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-6 left-6">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                      EVERY SATURDAY
                    </span>

                    <p className="shop-display mt-3 text-3xl text-white sm:text-4xl">
                      Everyone deserves a place at the board.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between border border-[#F3EDE2]/15 p-7 sm:p-9">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                      BEFORE THE GAME
                    </span>

                    <div className="mt-8 space-y-5">
                      {[
                        "Learn",
                        "Practise",
                        "Analyse",
                        "Compete",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between border-b border-[#F3EDE2]/10 pb-4"
                        >
                          <span className="text-sm">
                            {item}
                          </span>

                          <span className="font-mono text-[10px] text-[#F3EDE2]/35">
                            0{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/join"
                    className="group mt-10 inline-flex w-fit items-center gap-4 border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-all duration-300 hover:bg-[#F3EDE2] hover:text-[#111111]"
                  >
                    Join a session

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            PAST GAMES / HIGHLIGHTS
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">
                  05 — Past games
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Every game leaves something behind.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Results matter, but what players learn from each game
                    matters more.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-shop-border">
              {highlights.map((item, index) => (
                <Reveal key={item.number} delay={index * 100}>
                  <article className="grid gap-6 border-b border-shop-border py-10 md:grid-cols-[80px_0.8fr_1.2fr] md:items-center md:gap-10 md:px-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                      {item.number}
                    </span>

                    <h3 className="shop-display text-3xl leading-none md:text-4xl">
                      {item.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-shop-muted md:text-base md:leading-7">
                      {item.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            GET INVOLVED
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  06 — Get involved
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Your next move can start here.
                  </h2>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-14 flex flex-col gap-6 border-t border-[#F3EDE2]/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/45">
                  Whether you're ready to compete, learn or simply sit down
                  for your first game, there is a place for you at SHoP.
                </p>

                <Link
                  href="/join"
                  className="group inline-flex w-fit items-center gap-4 bg-[#F3EDE2] px-7 py-4 text-sm font-semibold text-[#111111] transition-all duration-300 hover:-translate-y-1"
                >
                  Join SHoP

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-28 md:py-40 lg:py-52">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">
                Your next game
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.8]">
                Ready for
                <br />
                your next move?
              </h2>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/join"
                  className="group inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="!text-[#F3EDE2]">
                    Join SHoP
                  </span>

                  <span className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/community"
                  className="inline-flex items-center gap-4 border border-shop-ink/20 px-7 py-4 text-sm font-semibold transition-colors duration-300 hover:bg-shop-paper"
                >
                  Meet the community
                </Link>
              </div>
            </Reveal>

            <Reveal delay={380}>
              <div className="mt-16 flex items-center justify-between border-t border-shop-border pt-6">
                <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                  KAWANGWARE · NAIROBI · KENYA
                </span>

                <span className="hidden text-[9px] font-bold tracking-[0.2em] text-shop-muted sm:block">
                  KILA HATUA INA MAANA
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}