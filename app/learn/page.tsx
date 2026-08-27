import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";
import ChessPuzzle from "@/components/chess/ChessPuzzle";
import GameCard from "@/components/chess/GameCard";
import LearningPaths from "@/components/learn/LearningPaths";

const levels = [
  {
    number: "01",
    level: "Beginner",
    title: "Start with the board.",
    description:
      "Learn how the pieces move, understand the board and begin playing with confidence.",
    move: "e4",
  },
  {
    number: "02",
    level: "Intermediate",
    title: "See the position.",
    description:
      "Develop your tactical awareness, opening principles and ability to plan ahead.",
    move: "Nf3",
  },
  {
    number: "03",
    level: "Advanced",
    title: "Think several moves ahead.",
    description:
      "Deepen your strategy, analyse positions and prepare yourself for competitive play.",
    move: "Bb5",
  },
];

export default function LearnPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative min-h-[90vh] overflow-hidden bg-shop-cream">
          {/* Animated atmosphere */}
          <div aria-hidden="true" className="shop-hero-bg">
            <div className="shop-hero-board">
              {Array.from({ length: 64 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </div>

          {/* Chess notation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-2rem] top-40 z-10 hidden rotate-90 text-[9px] font-semibold tracking-[0.35em] text-shop-ink/[0.07] lg:block"
          >
            01. e4&nbsp;&nbsp; c5&nbsp;&nbsp; 02. Nf3&nbsp;&nbsp; Nc6&nbsp;&nbsp;
            03. d4&nbsp;&nbsp; cxd4
          </div>

          <div className="shop-container relative z-20 flex min-h-[90vh] items-center py-32 md:py-40 lg:py-48">
            <div className="w-full">
              {/* Eyebrow */}
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="shop-hero-line h-px w-10 origin-left bg-shop-ink/30" />

                  <p className="shop-eyebrow text-shop-muted">
                    Learn chess
                  </p>
                </div>
              </Reveal>

              {/* Heading */}
              <Reveal delay={120}>
                <h1 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,10vw,11rem)] leading-[0.8]">
                  Learn the game.
                  <br />
                  Learn to think.
                </h1>
              </Reveal>

              {/* Introduction */}
              <Reveal delay={280}>
                <div className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                      CHESS EDUCATION
                    </span>
                  </div>

                  <p className="max-w-3xl text-lg leading-8 text-shop-muted md:text-xl md:leading-9">
                    Whether you're touching a chessboard for the first time or
                    preparing for competition, SHoP gives you a place to learn,
                    practise and improve.
                  </p>
                </div>
              </Reveal>

              {/* Actions */}
              <Reveal delay={420}>
                <div className="mt-14 flex flex-wrap gap-3">
                  <a
                    href="#levels"
                    className="group inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="!text-[#F3EDE2]">
                      Find your level
                    </span>

                    <span
                      aria-hidden="true"
                      className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-y-1"
                    >
                      ↓
                    </span>
                  </a>

                  <Link
                    href="/join"
                    className="inline-flex items-center gap-4 border border-shop-ink/20 px-7 py-4 text-sm font-semibold transition-all duration-300 hover:bg-shop-paper"
                  >
                    Join SHoP
                  </Link>
                </div>
              </Reveal>

              {/* Footer metadata */}
              <Reveal delay={550}>
                <div className="mt-16 flex items-center justify-between border-t border-shop-ink/10 pt-6">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                    KAWANGWARE · NAIROBI · KENYA
                  </span>

                  <span className="hidden text-[9px] font-bold tracking-[0.2em] text-shop-muted sm:block">
                    SHoP / LEARN
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            LEVELS
        ========================================================= */}
        <section
          id="levels"
          className="scroll-mt-20 overflow-hidden bg-[#111111] text-[#F3EDE2]"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/50">
                  01 — Find your level
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.88]">
                    Start where you are.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/55 sm:text-lg sm:leading-8">
                    Chess is a journey. You don't need to know everything
                    before you make your first move.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-[#F3EDE2]/15">
              {levels.map((item, index) => (
                <Reveal key={item.number} delay={index * 120}>
                  <article className="group relative grid gap-8 border-b border-[#F3EDE2]/15 py-10 transition-colors duration-500 hover:bg-[#F3EDE2]/[0.035] md:grid-cols-[90px_0.7fr_1.3fr_100px] md:items-center md:gap-10 md:px-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      {item.number}
                    </span>

                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/40">
                        {item.level}
                      </span>

                      <h3 className="shop-display mt-3 text-4xl leading-none transition-transform duration-500 group-hover:translate-x-1 md:text-5xl">
                        {item.title}
                      </h3>
                    </div>

                    <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/50 md:text-base md:leading-7">
                      {item.description}
                    </p>

                    <div className="flex items-center md:justify-end">
                      <span className="font-mono text-sm font-semibold">
                        {item.move}
                      </span>

                      <span className="ml-3 text-[#F3EDE2]/40 transition-transform duration-500 group-hover:translate-x-2">
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
            LEARNING PATHS
        ========================================================= */}
        <LearningPaths />

        {/* =========================================================
            FEATURED GAMES
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-[#F3EDE2]/45">
                    02 — Study the game
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-[#F3EDE2]/35 lg:block">
                    Don't only learn the moves. Learn why they work.
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    See the game
                    <br />
                    differently.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Study positions, openings and tactical ideas through games
                    that give you something to look for—not just something to
                    memorise.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Reveal delay={100}>
                <GameCard
                  title="The First Move"
                  description="Understand why controlling the centre matters from the beginning."
                  level="Beginner"
                  moves={12}
                  opening="Opening"
                  featured
                  href="#practice"
                />
              </Reveal>

              <Reveal delay={180}>
                <GameCard
                  title="Find the Tactic"
                  description="Train your eye to recognise the opportunity before making your move."
                  level="Intermediate"
                  moves={18}
                  opening="Tactics"
                  href="#practice"
                />
              </Reveal>

              <Reveal delay={260}>
                <GameCard
                  title="Think Ahead"
                  description="Explore positions where planning several moves ahead changes everything."
                  level="Advanced"
                  moves={24}
                  opening="Strategy"
                  href="#practice"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            PRACTICE
        ========================================================= */}
        <section
          id="practice"
          className="scroll-mt-20 overflow-hidden bg-shop-cream"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            {/* Section introduction */}
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <Reveal>
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    03 — Practice
                  </p>

                  <div className="mt-8 hidden lg:block">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted/60">
                      THINK · CALCULATE · PLAY
                    </span>

                    <div className="mt-5 h-px w-24 bg-shop-ink/20" />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    The best way
                    <br />
                    to learn is to play.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Chess becomes clearer when you stop only reading about it
                    and start making decisions. Work through positions, test
                    ideas and learn to see possibilities before they happen.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Practice statement */}
            <Reveal delay={220}>
              <div className="mt-16 border-y border-shop-border py-7 md:mt-20 md:py-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-2xl text-sm leading-6 text-shop-muted">
                    One position. One decision. One move at a time.
                  </p>

                  <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-shop-muted">
                    WHITE TO MOVE
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Puzzle stage */}
            <Reveal delay={320}>
              <div className="relative mt-8 overflow-hidden bg-[#111111] text-[#F3EDE2] md:mt-10">
                {/* Ambient background */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#F3EDE2]/[0.025] blur-3xl" />

                  <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#F3EDE2]/[0.02] blur-3xl" />

                  <div className="absolute right-0 top-0 h-px w-1/3 bg-[#F3EDE2]/20" />

                  <div className="absolute bottom-0 left-0 h-px w-1/3 bg-[#F3EDE2]/20" />
                </div>

                {/* Puzzle header */}
                <div className="relative z-10 flex flex-col gap-5 border-b border-[#F3EDE2]/10 px-6 py-6 sm:px-10 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center border border-[#F3EDE2]/20 font-mono text-[10px]">
                      01
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/45">
                      SHoP Chess Puzzle
                    </span>
                  </div>

                  <span className="font-mono text-[9px] font-semibold tracking-[0.15em] text-[#F3EDE2]/30">
                    MATE IN ONE
                  </span>
                </div>

                {/* Puzzle */}
                <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16">
                  <ChessPuzzle />
                </div>
              </div>
            </Reveal>

            {/* Bottom note */}
            <Reveal delay={420}>
              <div className="mt-10 flex flex-col gap-5 border-t border-shop-border pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-shop-muted">
                  Don't worry about getting it right immediately. Good players
                  learn by looking at the position, making a decision and
                  understanding what happens next.
                </p>

                <span className="shop-eyebrow whitespace-nowrap text-shop-muted">
                  Kila hatua ina maana
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            BEYOND CHESS
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-28 md:py-40 lg:py-52">
            <Reveal>
              <p className="shop-eyebrow text-[#F3EDE2]/45">
                04 — Beyond the board
              </p>
            </Reveal>

            <Reveal delay={150}>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.8]">
                Chess teaches more than chess.
              </h2>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-12 grid gap-8 border-t border-[#F3EDE2]/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  "Patience",
                  "Discipline",
                  "Strategy",
                  "Confidence",
                ].map((skill, index) => (
                  <div key={skill}>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      0{index + 1}
                    </span>

                    <p className="shop-display mt-5 text-3xl md:text-4xl">
                      {skill}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            CTA
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-28 md:py-40 lg:py-52">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">
                Your move
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="shop-display mt-8 max-w-6xl text-[clamp(4rem,9vw,10rem)] leading-[0.82]">
                Ready to make
                <br />
                your first move?
              </h2>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/join"
                  className="group inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="!text-[#F3EDE2]">
                    Join SHoP
                  </span>

                  <span
                    aria-hidden="true"
                    className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-x-1"
                  >
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}