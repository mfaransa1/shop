import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Reveal from "@/components/animations/Reveal";

const beliefs = [
  {
    number: "01",
    title: "Think",
    text: "Chess teaches young people to slow down, read the position and make purposeful decisions.",
  },
  {
    number: "02",
    title: "Play",
    text: "The board gives young people a place to challenge themselves, compete and enjoy the game.",
  },
  {
    number: "03",
    title: "Belong",
    text: "A chessboard can bring people together. SHoP turns that connection into community.",
  },
  {
    number: "04",
    title: "Become",
    text: "The discipline and confidence developed through chess can travel far beyond the board.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
{/* =========================================================
    HERO
========================================================= */}
<section className="relative overflow-hidden bg-shop-cream">
  {/* Animated atmosphere */}
  <div aria-hidden="true" className="shop-hero-bg">
    <div className="shop-hero-board">
      {Array.from({ length: 64 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  </div>

  {/* Decorative notation */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute right-[-3rem] top-32 z-10 hidden rotate-90 text-[9px] font-semibold tracking-[0.35em] text-shop-ink/[0.07] lg:block"
  >
    01. e4&nbsp;&nbsp;&nbsp; c5&nbsp;&nbsp;&nbsp; 02. Nf3&nbsp;&nbsp;&nbsp;
    Nc6&nbsp;&nbsp;&nbsp; 03. d4
  </div>

  {/* Content */}
  <div className="shop-container relative z-20 py-32 md:py-40 lg:py-52">
    {/* Eyebrow */}
    <Reveal>
      <div className="flex items-center gap-4">
        <span className="shop-hero-line h-px w-10 origin-left bg-shop-ink/30" />

        <p className="shop-eyebrow text-shop-muted">
          About SHoP
        </p>
      </div>
    </Reveal>

    {/* Headline */}
    <div className="relative mt-8 overflow-hidden">
      <Reveal delay={120}>
        <h1 className="shop-display max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.82]">
          More than
          <br />
          <span className="relative inline-block">
            a chess club.

            <span
              aria-hidden="true"
              className="shop-hero-underline absolute bottom-[0.08em] left-0 h-[2px] w-full origin-left bg-shop-ink/20"
            />
          </span>
        </h1>
      </Reveal>
    </div>

    {/* Supporting content */}
    <Reveal delay={300}>
      <div className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
            SOUTHSIDE HOUSE OF PAWNS
          </span>
        </div>

        <p className="max-w-3xl text-lg leading-8 text-shop-muted md:text-xl md:leading-9">
          SHoP is a chess community working with schools and young
          people in Kawangware, Nairobi. We use chess as a starting
          point for connection, learning, discipline and positive
          possibility.
        </p>
      </div>
    </Reveal>

    {/* Metadata */}
    <Reveal delay={450}>
      <div className="mt-16 flex items-center justify-between border-t border-shop-ink/10 pt-6">
        <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
          KAWANGWARE · NAIROBI · KENYA
        </span>

        <span className="hidden text-[9px] font-bold tracking-[0.2em] text-shop-muted sm:block">
          SHoP / 01
        </span>
      </div>
    </Reveal>
  </div>
</section>

        {/* =========================================================
            WHY WE EXIST
        ========================================================= */}
        <section className="overflow-hidden bg-shop-paper">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">
                  02 — Why we exist
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.88]">
                    Create alternatives. Create possibility.
                  </h2>

                  <p className="mt-8 max-w-3xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    SHoP is built around the belief that access to positive
                    activities, supportive relationships and meaningful
                    opportunities can help young people imagine a different
                    future.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            BELIEFS
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">
                  03 — What we believe
                </p>

                <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.88]">
                  Four ideas behind every move.
                </h2>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-shop-border">
              {beliefs.map((belief, index) => (
                <Reveal
                  key={belief.number}
                  delay={index * 100}
                >
                  <article className="group grid gap-6 border-b border-shop-border py-10 transition-colors duration-500 hover:bg-shop-paper md:grid-cols-[100px_0.8fr_1.2fr] md:items-center md:gap-8 md:px-6">
                    <span className="text-xs font-bold tracking-[0.2em] text-shop-muted">
                      {belief.number}
                    </span>

                    <h3 className="shop-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-5xl lg:text-6xl">
                      {belief.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-shop-muted md:text-base md:leading-7">
                      {belief.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            VISION
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-28 md:py-40 lg:py-52">
            <Reveal>
              <p className="shop-eyebrow text-[#F3EDE2]/45">
                04 — Our vision
              </p>
            </Reveal>

            <Reveal delay={150}>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.8]">
                A generation that knows its next move.
              </h2>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-12 flex flex-col gap-8 border-t border-[#F3EDE2]/15 pt-8 md:flex-row md:items-center md:justify-between">
                <p className="max-w-2xl text-base leading-7 text-[#F3EDE2]/55 sm:text-lg sm:leading-8">
                  We want SHoP to grow into a community where more young people
                  can access chess, develop their potential and find
                  opportunities to lead.
                </p>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/35">
                  Kila hatua ina maana
                </span>
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
                Be part of what comes next.
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
                  href="/support"
                  className="inline-flex items-center gap-4 border border-shop-ink/20 px-7 py-4 text-sm font-semibold transition-all duration-300 hover:bg-shop-paper"
                >
                  Support the mission
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