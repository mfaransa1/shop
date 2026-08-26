import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

const supportAreas = [
  {
    number: "01",
    title: "Access",
    text: "Help make chess accessible to more young people by supporting boards, equipment and opportunities to participate.",
  },
  {
    number: "02",
    title: "Learning",
    text: "Support structured sessions where young players can learn the game, practise and develop their skills.",
  },
  {
    number: "03",
    title: "Competition",
    text: "Help create tournaments and competitive opportunities where players can test themselves and grow.",
  },
  {
    number: "04",
    title: "Community",
    text: "Support the space, people and experiences that make SHoP more than a place to play chess.",
  },
];

const waysToHelp = [
  {
    number: "01",
    title: "Give",
    label: "FINANCIAL SUPPORT",
    text: "Make a contribution that helps SHoP create more opportunities for young people.",
    href: "#give",
  },
  {
    number: "02",
    title: "Equip",
    label: "CHESS EQUIPMENT",
    text: "Help put more boards, pieces, clocks and learning materials into the hands of players.",
    href: "#give",
  },
  {
    number: "03",
    title: "Partner",
    label: "STRATEGIC SUPPORT",
    text: "Work with SHoP to create sustainable programmes, events and opportunities.",
    href: "#partner",
  },
  {
    number: "04",
    title: "Volunteer",
    label: "YOUR TIME",
    text: "Share your skills, knowledge or time with the community.",
    href: "#partner",
  },
];

const impactPoints = [
  "More young people introduced to chess",
  "More opportunities to learn and practise",
  "More access to tournaments and competition",
  "More spaces where young people can belong",
  "More confidence built through purposeful play",
  "More possibilities beyond the board",
];

export default function SupportPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative min-h-screen overflow-hidden bg-[#111111] text-[#F3EDE2]">
          {/* Ambient atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[130px] animate-[support-orb_14s_ease-in-out_infinite]" />

            <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[#F3EDE2]/[0.025] blur-[140px] animate-[support-orb-reverse_17s_ease-in-out_infinite]" />
          </div>

          {/* Background statement */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-10 right-[-4rem] hidden text-[9px] font-bold tracking-[0.4em] text-[#F3EDE2]/[0.055] lg:block"
          >
            SUPPORT · ACCESS · OPPORTUNITY · COMMUNITY
          </div>

          <div className="shop-container relative z-10 flex min-h-screen items-center py-32 md:py-40 lg:py-44">
            <div className="grid w-full items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              {/* Copy */}
              <div>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-10 bg-[#F3EDE2]/40" />

                    <p className="shop-eyebrow text-[#F3EDE2]/55">
                      Support SHoP
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <h1 className="shop-display mt-8 max-w-6xl text-[clamp(4rem,9vw,9.5rem)] leading-[0.8]">
                    Help make
                    <br />
                    the next move.
                  </h1>
                </Reveal>

                <Reveal delay={260}>
                  <p className="mt-10 max-w-xl text-base leading-7 text-[#F3EDE2]/55 sm:text-lg sm:leading-8">
                    SHoP uses chess to create spaces where young people can
                    learn, play, compete and belong. Your support helps make
                    those opportunities possible.
                  </p>
                </Reveal>

                <Reveal delay={400}>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      href="#give"
                      className="group inline-flex items-center gap-4 bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="!text-[#111111]">
                        Support SHoP
                      </span>

                      <span
                        aria-hidden="true"
                        className="!text-[#111111] transition-transform duration-300 group-hover:translate-y-1"
                      >
                        ↓
                      </span>
                    </Link>

                    <Link
                      href="#impact"
                      className="inline-flex items-center gap-4 border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:bg-[#F3EDE2] hover:!text-[#111111]"
                    >
                      <span className="!text-current">
                        See the impact
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
                      SHoP / SUPPORT
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Hero image */}
              <Reveal delay={180}>
                <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                    <Image
                      src="/images/sessions/session-02.jpg"
                      alt="Young people playing chess at SHoP"
                      fill
                      priority
                      sizes="(max-width: 1023px) 100vw, 52vw"
                      className="object-cover object-center animate-[support-image-in_1200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <span className="absolute left-5 top-5 text-[9px] font-bold tracking-[0.2em] text-white/55">
                      SHoP / SUPPORT
                    </span>

                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                        THE BIGGER PICTURE
                      </span>

                      <p className="shop-display mt-3 max-w-lg text-3xl leading-none text-white sm:text-4xl">
                        A contribution can become an opportunity.
                      </p>
                    </div>
                  </div>

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
            WHY SUPPORT
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    01 — Why support
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted lg:block">
                    The board is simple. The opportunities around it are not.
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-6xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Chess is the medium.
                    <br />
                    Opportunity is the goal.
                  </h2>

                  <p className="mt-8 max-w-3xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Supporting SHoP means helping us create more spaces where
                    young people can discover chess and experience the wider
                    benefits that come from learning, playing and belonging.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-16 border-y border-shop-border py-10 md:mt-20 md:py-14">
                <div className="grid gap-8 md:grid-cols-[0.35fr_1fr] md:gap-16">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                    THE IDEA
                  </span>

                  <p className="shop-display max-w-5xl text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
                    When more people have access to the board, more people get
                    the chance to discover what they are capable of.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            WHERE SUPPORT GOES
        ========================================================= */}
        <section
          id="impact"
          className="scroll-mt-20 overflow-hidden bg-[#111111] text-[#F3EDE2]"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  02 — Where support goes
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Put your support
                    <br />
                    behind possibility.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Every contribution helps strengthen the environment around
                    the game.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-[#F3EDE2]/15">
              {supportAreas.map((item, index) => (
                <Reveal key={item.number} delay={index * 90}>
                  <article className="group grid gap-7 border-b border-[#F3EDE2]/15 py-9 transition-colors duration-500 hover:bg-[#F3EDE2]/[0.025] md:grid-cols-[80px_0.8fr_1.2fr] md:items-center md:gap-10 md:px-6 md:py-11">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      {item.number}
                    </span>

                    <h3 className="shop-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                      {item.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/45 md:text-base md:leading-7">
                      {item.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            IMPACT LIST
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <Reveal>
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    03 — What support makes possible
                  </p>
                </div>
              </Reveal>

              <div>
                <Reveal delay={120}>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Small moves.
                    <br />
                    Bigger possibilities.
                  </h2>
                </Reveal>

                <Reveal delay={240}>
                  <div className="mt-12 border-t border-shop-border">
                    {impactPoints.map((point, index) => (
                      <div
                        key={point}
                        className="group flex items-center justify-between gap-6 border-b border-shop-border py-5"
                      >
                        <div className="flex items-center gap-5">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                            0{index + 1}
                          </span>

                          <p className="text-sm leading-6 sm:text-base">
                            {point}
                          </p>
                        </div>

                        <span className="text-shop-muted transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            WAYS TO HELP
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  04 — Ways to help
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    There is more than one way to make a move.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Give what you can. Share what you know. Bring your time,
                    skills or connections.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-[#F3EDE2]/15">
              {waysToHelp.map((item, index) => (
                <Reveal key={item.number} delay={index * 80}>
                  <Link
                    href={item.href}
                    className="group grid gap-6 border-b border-[#F3EDE2]/15 py-9 transition-colors duration-500 hover:bg-[#F3EDE2]/[0.03] md:grid-cols-[80px_0.8fr_1.2fr_70px] md:items-center md:gap-10 md:px-6 md:py-11"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      {item.number}
                    </span>

                    <div>
                      <span className="text-[9px] font-bold tracking-[0.18em] text-[#F3EDE2]/35">
                        {item.label}
                      </span>

                      <h3 className="shop-display mt-3 text-3xl leading-none transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">
                        {item.title}
                      </h3>
                    </div>

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
            GIVE
        ========================================================= */}
        <section
          id="give"
          className="scroll-mt-20 overflow-hidden bg-shop-cream"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <Reveal>
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    05 — Give
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted lg:block">
                    Every contribution is a move toward greater access.
                  </p>
                </div>
              </Reveal>

              <div>
                <Reveal delay={120}>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.5rem,7vw,7rem)] leading-[0.84]">
                    Give what you can.
                  </h2>
                </Reveal>

                <Reveal delay={240}>
                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Whether you are making a one-time contribution or looking
                    for a longer-term way to support SHoP, your help can create
                    more opportunities around the board.
                  </p>
                </Reveal>

                {/* Donation placeholder */}
                <Reveal delay={360}>
                  <div className="mt-12 border border-shop-border bg-shop-paper p-7 sm:p-10">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                      SUPPORT SHoP
                    </span>

                    <p className="shop-display mt-5 max-w-2xl text-3xl leading-[0.9] sm:text-4xl">
                      Your contribution can help put another board in the
                      room.
                    </p>

                    <p className="mt-5 max-w-xl text-sm leading-6 text-shop-muted">
                      Donation options can be connected here once your payment
                      method is ready.
                    </p>

                    <Link
                      href="/join"
                      className="group mt-8 inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="!text-[#F3EDE2]">
                        Support SHoP
                      </span>

                      <span
                        aria-hidden="true"
                        className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            PARTNER
        ========================================================= */}
        <section
          id="partner"
          className="scroll-mt-20 overflow-hidden bg-[#111111] text-[#F3EDE2]"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  06 — Partner
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.5rem,7vw,7rem)] leading-[0.84]">
                    Build the next move with us.
                  </h2>

                  <p className="mt-8 max-w-3xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Organisations, schools, businesses and individuals can
                    help SHoP create stronger opportunities for young people.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-16 border-y border-[#F3EDE2]/15 py-8 md:mt-20 md:py-10">
                <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-2xl text-sm leading-6 text-[#F3EDE2]/45 md:text-base md:leading-7">
                    Have an idea for how you can contribute? We'd like to hear
                    it.
                  </p>

                  <Link
                    href="/join"
                    className="group inline-flex w-fit items-center gap-4 bg-[#F3EDE2] px-7 py-4 text-sm font-semibold !text-[#111111] transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="!text-[#111111]">
                      Start a conversation
                    </span>

                    <span
                      aria-hidden="true"
                      className="!text-[#111111] transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}
        <section className="relative overflow-hidden bg-shop-cream">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-shop-ink/[0.025] blur-[130px]" />
          </div>

          <div className="shop-container relative py-28 md:py-40 lg:py-52">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">
                Make a move
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.8]">
                Help create
                <br />
                what comes next.
              </h2>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="#give"
                  className="group inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="!text-[#F3EDE2]">
                    Support SHoP
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