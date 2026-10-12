import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";
import ChessPuzzle from "@/components/chess/ChessPuzzle";
import LearningPaths from "@/components/learn/LearningPaths";

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
                    href="#learning-paths"
                    className="group inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="!text-[#F3EDE2]">
                      Explore learning paths
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
            LEARNING PATHS
        ========================================================= */}
        <div id="learning-paths" className="scroll-mt-20">
          <LearningPaths />
        </div>

        {/* =========================================================
            PUT LEARNING INTO PRACTICE
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-20 md:py-28 lg:py-32">
            <Reveal>
              <p className="shop-eyebrow text-[#F3EDE2]/45">Learn by doing</p>
              <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
                <h2 className="shop-display max-w-3xl text-[clamp(3rem,6vw,6rem)] leading-[0.88]">
                  Take the next step.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[#F3EDE2]/60 sm:text-lg sm:leading-8">
                  Build confidence through practice, learn alongside other players, and put your skills to use in club games and competitions.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-0 border-t border-[#F3EDE2]/15 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/dashboard" className="group border-b border-[#F3EDE2]/15 py-6 sm:border-r sm:px-6 lg:px-7">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F3EDE2]/40">01 · Practice</span>
                <h3 className="shop-display mt-4 text-3xl">Your chess dashboard</h3>
                <p className="mt-3 text-sm leading-6 text-[#F3EDE2]/55">Continue your chess journey and access the activities available to your account.</p>
                <span className="mt-5 inline-flex border-b border-[#F3EDE2]/40 pb-1 text-sm font-semibold">Open dashboard</span>
              </Link>
              <Link href="/community" className="group border-b border-[#F3EDE2]/15 py-6 sm:px-6 lg:px-7">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F3EDE2]/40">02 · Connect</span>
                <h3 className="shop-display mt-4 text-3xl">Learn with others</h3>
                <p className="mt-3 text-sm leading-6 text-[#F3EDE2]/55">Meet the SHoP community, discover players and find ways to take part.</p>
                <span className="mt-5 inline-flex border-b border-[#F3EDE2]/40 pb-1 text-sm font-semibold">Explore community</span>
              </Link>
              <Link href="/tournaments" className="group border-b border-[#F3EDE2]/15 py-6 sm:col-span-2 sm:px-6 lg:col-span-1 lg:border-l lg:px-7">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F3EDE2]/40">03 · Compete</span>
                <h3 className="shop-display mt-4 text-3xl">Play with purpose</h3>
                <p className="mt-3 text-sm leading-6 text-[#F3EDE2]/55">Explore tournament information and prepare to test your skills over the board.</p>
                <span className="mt-5 inline-flex border-b border-[#F3EDE2]/40 pb-1 text-sm font-semibold">Explore tournaments</span>
              </Link>
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