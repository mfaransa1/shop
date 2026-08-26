import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

const experiences = [
  {
    number: "01",
    title: "Play",
    text: "Sit down, make a move and discover the joy of playing chess with other people.",
    label: "THE BOARD",
  },
  {
    number: "02",
    title: "Learn",
    text: "Develop your game alongside players and coaches who want to see you improve.",
    label: "THE JOURNEY",
  },
  {
    number: "03",
    title: "Connect",
    text: "Meet people, build friendships and become part of something that extends beyond the board.",
    label: "THE COMMUNITY",
  },
];

const sessionSteps = [
  {
    number: "01",
    title: "Arrive",
    text: "Come through, find a board and settle into the room.",
  },
  {
    number: "02",
    title: "Play",
    text: "Get across the board and start making decisions.",
  },
  {
    number: "03",
    title: "Learn",
    text: "Analyse positions, ask questions and discover something new.",
  },
  {
    number: "04",
    title: "Compete",
    text: "Challenge yourself and test what you've been learning.",
  },
  {
    number: "05",
    title: "Connect",
    text: "Stay around, meet someone new and become part of the community.",
  },
];

const stories = [
  {
    number: "01",
    title: "First moves",
    text: "Every strong player starts somewhere. A first lesson, a first game and a first moment when the board begins to make sense.",
    image: "/images/sessions/session-01.jpg",
  },
  {
    number: "02",
    title: "Saturday together",
    text: "The room changes when people sit around the same board. Games become conversations, lessons become friendships and competition becomes community.",
    image: "/images/sessions/session-02.jpg",
  },
  {
    number: "03",
    title: "Beyond the board",
    text: "The lessons developed through chess travel with our players: patience, confidence, discipline and the courage to make the next move.",
    image: "/images/sessions/session-03.jpg",
  },
];

const involvement = [
  {
    number: "01",
    title: "Play with us",
    text: "Join a session, find a board and become part of the room.",
    href: "/join",
  },
  {
    number: "02",
    title: "Volunteer",
    text: "Help create more opportunities for young people to learn and play.",
    href: "/join",
  },
  {
    number: "03",
    title: "Partner",
    text: "Work with SHoP to create opportunities through chess.",
    href: "/join",
  },
  {
    number: "04",
    title: "Support",
    text: "Help us make the game more accessible to the community.",
    href: "/support",
  },
];

export default function CommunityPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative min-h-screen overflow-hidden bg-[#111111] text-[#F3EDE2]">
          {/* Ambient background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[120px] animate-[community-orb_12s_ease-in-out_infinite]" />

            <div className="absolute -right-32 bottom-0 h-[35rem] w-[35rem] rounded-full bg-[#F3EDE2]/[0.025] blur-[130px] animate-[community-orb-reverse_15s_ease-in-out_infinite]" />
          </div>

          <div className="shop-container relative z-10 flex min-h-screen items-center py-32 md:py-40 lg:py-44">
            <div className="grid w-full items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              {/* Text */}
              <div>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-10 bg-[#F3EDE2]/40" />

                    <p className="shop-eyebrow text-[#F3EDE2]/55">
                      Community
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <h1 className="shop-display mt-8 max-w-4xl text-[clamp(4rem,9vw,9.5rem)] leading-[0.8]">
                    This is bigger
                    <br />
                    than chess.
                  </h1>
                </Reveal>

                <Reveal delay={260}>
                  <p className="mt-10 max-w-xl text-base leading-7 text-[#F3EDE2]/55 sm:text-lg sm:leading-8">
                    SHoP is a place where young people come together to play,
                    learn, compete and discover what becomes possible when
                    they have a place to belong.
                  </p>
                </Reveal>

                <Reveal delay={400}>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      href="#people"
                      className="group inline-flex items-center gap-4 bg-[#F3EDE2] px-6 py-4 text-sm font-semibold text-[#111111] transition-all duration-300 hover:-translate-y-1"
                    >
                      <span>Meet the community</span>

                      <span className="transition-transform duration-300 group-hover:translate-y-1">
                        ↓
                      </span>
                    </Link>

                    <Link
                      href="/join"
                      className="inline-flex items-center gap-4 border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-all duration-300 hover:bg-[#F3EDE2] hover:text-[#111111]"
                    >
                      Join SHoP
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={520}>
                  <div className="mt-14 flex items-center justify-between border-t border-[#F3EDE2]/10 pt-5">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                      KAWANGWARE · NAIROBI
                    </span>

                    <span className="hidden text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30 sm:block">
                      SHoP / COMMUNITY
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Hero photograph */}
              <Reveal delay={180}>
                <div className="relative mx-auto w-full max-w-[680px] lg:ml-auto">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                    <Image
                      src="/images/sessions/session-02.jpg"
                      alt="Young people playing chess at SHoP"
                      fill
                      priority
                      sizes="(max-width: 1023px) 100vw, 55vw"
                      className="object-cover object-center animate-[community-image-in_1200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute left-5 top-5">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-white/55">
                        SHoP / 01
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                        THE ROOM
                      </p>

                      <p className="shop-display mt-3 text-3xl leading-none text-white sm:text-4xl">
                        Everyone has a place at the board.
                      </p>
                    </div>
                  </div>

                  {/* Floating label */}
                  <div className="absolute -bottom-5 -left-4 bg-[#F3EDE2] px-5 py-4 text-[#111111] sm:-left-7">
                    <span className="text-[9px] font-bold tracking-[0.18em]">
                      KILA HATUA INA MAANA
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            PEOPLE
        ========================================================= */}
        <section
          id="people"
          className="overflow-hidden bg-shop-cream"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    01 — The people
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted lg:block">
                    A community is not a building. It is the people who show
                    up and make the space what it is.
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-6xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    A board is just a beginning.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Behind every game is a person. Players, coaches, families,
                    volunteers and friends all contribute to the environment
                    we are building at SHoP.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Large statement */}
            <Reveal delay={180}>
              <div className="mt-16 border-y border-shop-border py-10 md:mt-20 md:py-14">
                <div className="grid gap-8 md:grid-cols-[0.35fr_1fr] md:gap-16">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                    WHAT CONNECTS US
                  </span>

                  <p className="shop-display max-w-5xl text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
                    The love of the game is where we meet. What we build
                    together is where we stay.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            EXPERIENCES
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  02 — Come as you are
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    There is more than one way to belong.
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-[#F3EDE2]/15">
              {experiences.map((item, index) => (
                <Reveal key={item.number} delay={index * 100}>
                  <article className="group grid gap-8 border-b border-[#F3EDE2]/15 py-10 transition-all duration-500 hover:bg-[#F3EDE2]/[0.025] md:grid-cols-[80px_0.7fr_1.3fr_120px] md:items-center md:gap-10 md:px-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      {item.number}
                    </span>

                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                        {item.label}
                      </span>

                      <h3 className="shop-display mt-3 text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                        {item.title}
                      </h3>
                    </div>

                    <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/50 md:text-base md:leading-7">
                      {item.text}
                    </p>

                    <div className="md:text-right">
                      <span className="font-mono text-sm text-[#F3EDE2]/45 transition-transform duration-300 group-hover:translate-x-1">
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
            COMMUNITY STORIES
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    03 — Community stories
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Every board holds a story.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    The most important part of SHoP isn't the score at the end
                    of a game. It is what happens to the people who played it.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 space-y-16 md:space-y-24">
              {stories.map((story, index) => (
                <Reveal key={story.number} delay={100}>
                  <article
                    className={[
                      "grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20",
                      index % 2 === 1
                        ? "md:[&>*:first-child]:order-2"
                        : "",
                    ].join(" ")}
                  >
                    {/* Image */}
                    <div className="group relative aspect-[4/5] overflow-hidden bg-[#111111]">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        sizes="(max-width: 767px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      <span className="absolute left-5 top-5 text-[9px] font-bold tracking-[0.2em] text-white/55">
                        SHoP / {story.number}
                      </span>
                    </div>

                    {/* Story */}
                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                        STORY {story.number}
                      </span>

                      <h3 className="shop-display mt-5 text-5xl leading-[0.88] sm:text-6xl">
                        {story.title}
                      </h3>

                      <p className="mt-7 max-w-lg text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                        {story.text}
                      </p>

                      <div className="mt-8 h-px w-16 bg-shop-ink/25" />
                    </div>
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
                    04 — Saturdays at SHoP
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-[#F3EDE2]/35 lg:block">
                    A session is more than scheduled time on a chessboard. It
                    is time spent learning and being around people.
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    One room.
                    <br />
                    Many moves.
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-[#F3EDE2]/15">
              {sessionSteps.map((step, index) => (
                <Reveal key={step.number} delay={index * 70}>
                  <article className="group grid gap-6 border-b border-[#F3EDE2]/15 py-8 md:grid-cols-[80px_0.7fr_1.3fr] md:items-center md:gap-10 md:px-6 md:py-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      {step.number}
                    </span>

                    <h3 className="shop-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                      {step.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/50 md:text-base md:leading-7">
                      {step.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={300}>
              <div className="mt-12 flex flex-col gap-6 border-t border-[#F3EDE2]/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/45">
                  Saturday is where many of the SHoP stories begin.
                </p>

                <Link
                  href="/join"
                  className="group inline-flex w-fit items-center gap-4 border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-all duration-300 hover:bg-[#F3EDE2] hover:text-[#111111]"
                >
                  Join a session

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            EVERYONE HAS A PLACE
        ========================================================= */}
        <section className="relative overflow-hidden bg-shop-cream">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-1/2 h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-shop-ink/[0.025] blur-[120px]" />
          </div>

          <div className="shop-container relative py-28 md:py-40 lg:py-52">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">
                05 — Everyone has a place
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.8]">
                There is always
                <br />
                room at the board.
              </h2>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-12 grid gap-8 border-t border-shop-border pt-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                  BELONGING
                </span>

                <p className="max-w-3xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                  We believe every young person deserves an environment where
                  they can ask questions, make mistakes, challenge themselves
                  and feel seen. Chess gives us a way to create that
                  environment together.
                </p>
              </div>
            </Reveal>
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
                    You can be part of the next move.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Communities grow when people choose to show up. Find the
                    way that makes sense for you.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-[#F3EDE2]/15">
              {involvement.map((item, index) => (
                <Reveal key={item.number} delay={index * 80}>
                  <Link
                    href={item.href}
                    className="group grid gap-6 border-b border-[#F3EDE2]/15 py-8 transition-all duration-500 hover:bg-[#F3EDE2]/[0.035] md:grid-cols-[80px_0.8fr_1.2fr_80px] md:items-center md:gap-10 md:px-6 md:py-10"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      {item.number}
                    </span>

                    <h3 className="shop-display text-3xl leading-none transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">
                      {item.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/45 md:text-base md:leading-7">
                      {item.text}
                    </p>

                    <span className="flex h-11 w-11 items-center justify-center border border-[#F3EDE2]/20 text-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#F3EDE2] group-hover:text-[#111111] md:ml-auto">
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-28 md:py-40 lg:py-52">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">
                Your place at the board
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.8]">
                Your move
                <br />
                starts here.
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
                  href="/support"
                  className="inline-flex items-center gap-4 border border-shop-ink/20 px-7 py-4 text-sm font-semibold transition-colors duration-300 hover:bg-shop-paper"
                >
                  Support the community
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