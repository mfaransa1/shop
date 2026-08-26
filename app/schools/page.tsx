import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

const schoolBenefits = [
  {
    number: "01",
    title: "Discover",
    text: "Introduce students to chess in an environment that makes learning the game approachable, engaging and social.",
  },
  {
    number: "02",
    title: "Develop",
    text: "Use chess to strengthen concentration, patience, problem-solving and strategic thinking.",
  },
  {
    number: "03",
    title: "Compete",
    text: "Give students opportunities to test their skills through games, school events and tournaments.",
  },
  {
    number: "04",
    title: "Grow",
    text: "Create experiences that help young people build confidence and carry what they learn beyond the chessboard.",
  },
];

const programmeSteps = [
  {
    number: "01",
    title: "Connect",
    text: "We understand the school's goals, students and existing activities.",
  },
  {
    number: "02",
    title: "Introduce",
    text: "Students are introduced to chess through practical, engaging sessions.",
  },
  {
    number: "03",
    title: "Develop",
    text: "Regular learning helps students build stronger chess and thinking skills.",
  },
  {
    number: "04",
    title: "Compete",
    text: "Students get opportunities to play against others and experience competition.",
  },
  {
    number: "05",
    title: "Continue",
    text: "The relationship can grow through regular sessions, events and tournaments.",
  },
];

const opportunities = [
  {
    number: "01",
    title: "Chess clubs",
    text: "Build or strengthen a school chess club with structured sessions and practical support.",
  },
  {
    number: "02",
    title: "School events",
    text: "Bring chess activities, demonstrations and competitions into the school environment.",
  },
  {
    number: "03",
    title: "Tournaments",
    text: "Create opportunities for students to compete, represent their schools and learn through competition.",
  },
  {
    number: "04",
    title: "Partnerships",
    text: "Work with SHoP to create a longer-term chess and youth development programme.",
  },
];

const outcomes = [
  "Concentration",
  "Problem-solving",
  "Discipline",
  "Strategic thinking",
  "Confidence",
  "Decision-making",
];

export default function SchoolsPage() {
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
            <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[130px] animate-[schools-orb_14s_ease-in-out_infinite]" />

            <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[#F3EDE2]/[0.025] blur-[140px] animate-[schools-orb-reverse_17s_ease-in-out_infinite]" />
          </div>

          {/* Background notation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-5rem] top-1/3 hidden rotate-90 text-[9px] font-semibold tracking-[0.4em] text-[#F3EDE2]/[0.055] lg:block"
          >
            SCHOOL CHESS · LEARN · PLAY · COMPETE · GROW
          </div>

          <div className="shop-container relative z-10 flex min-h-screen items-center py-32 md:py-40 lg:py-44">
            <div className="grid w-full items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              {/* Copy */}
              <div>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-10 bg-[#F3EDE2]/40" />

                    <p className="shop-eyebrow text-[#F3EDE2]/55">
                      Schools · Chess · Opportunity
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <h1 className="shop-display mt-8 max-w-6xl text-[clamp(4rem,9vw,9.5rem)] leading-[0.8]">
                    Put chess
                    <br />
                    in the room.
                  </h1>
                </Reveal>

                <Reveal delay={260}>
                  <p className="mt-10 max-w-xl text-base leading-7 text-[#F3EDE2]/55 sm:text-lg sm:leading-8">
                    SHoP works with schools to create opportunities for young
                    people to discover chess, develop their thinking and
                    experience the confidence that comes from learning to make
                    purposeful decisions.
                  </p>
                </Reveal>

                <Reveal delay={400}>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      href="#programme"
                      className="group inline-flex items-center gap-4 bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="!text-[#111111]">
                        Explore the programme
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
                        Talk to SHoP
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
                      SHoP / SCHOOLS
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Hero image */}
              <Reveal delay={180}>
                <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                    <Image
                      src="/images/sessions/session-03.jpg"
                      alt="Young people playing chess"
                      fill
                      priority
                      sizes="(max-width: 1023px) 100vw, 52vw"
                      className="object-cover object-center animate-[schools-image-in_1200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <span className="absolute left-5 top-5 text-[9px] font-bold tracking-[0.2em] text-white/55">
                      SHoP / SCHOOLS
                    </span>

                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                        THE OPPORTUNITY
                      </span>

                      <p className="shop-display mt-3 max-w-lg text-3xl leading-none text-white sm:text-4xl">
                        Every student deserves the chance to make the next
                        move.
                      </p>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 -left-4 bg-[#F3EDE2] px-5 py-4 text-[#111111] sm:-left-7">
                    <span className="text-[9px] font-bold tracking-[0.18em]">
                      CHESS FOR YOUNG MINDS
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            INTRO
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    01 — Why schools
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted lg:block">
                    Chess can begin as a game and become a powerful learning
                    environment.
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-6xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Chess belongs in education.
                  </h2>

                  <p className="mt-8 max-w-3xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    A chessboard gives students a practical environment in
                    which decisions have consequences. They learn to slow
                    down, recognise patterns, think ahead and respond when
                    things don't go according to plan.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-16 border-y border-shop-border py-10 md:mt-20 md:py-14">
                <div className="grid gap-8 md:grid-cols-[0.35fr_1fr] md:gap-16">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                    THE BIGGER IDEA
                  </span>

                  <p className="shop-display max-w-5xl text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
                    We are not only teaching students how to play a game. We
                    are creating space for them to learn how to think.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            WHAT STUDENTS GAIN
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-[#F3EDE2]/45">
                  02 — What students gain
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    The game teaches more than the game.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    Chess provides repeated opportunities to practise skills
                    that matter in classrooms, competitions and everyday life.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 grid border-t border-[#F3EDE2]/15 sm:grid-cols-2 lg:grid-cols-3">
              {outcomes.map((outcome, index) => (
                <Reveal key={outcome} delay={index * 70}>
                  <div className="group border-b border-[#F3EDE2]/15 p-7 sm:border-r sm:p-9 lg:p-10">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      0{index + 1}
                    </span>

                    <p className="shop-display mt-10 text-3xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                      {outcome}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PROGRAMME
        ========================================================= */}
        <section
          id="programme"
          className="scroll-mt-20 overflow-hidden bg-shop-cream"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    03 — The programme
                  </p>

                  <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted lg:block">
                    From the first introduction to competitive opportunities,
                    every stage has a purpose.
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    From first move
                    <br />
                    to competition.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    SHoP can work alongside schools to create a pathway that
                    grows with students.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-shop-border">
              {programmeSteps.map((step, index) => (
                <Reveal key={step.number} delay={index * 80}>
                  <article className="group grid gap-6 border-b border-shop-border py-8 transition-colors duration-500 hover:bg-shop-paper md:grid-cols-[80px_0.8fr_1.2fr] md:items-center md:gap-10 md:px-6 md:py-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                      {step.number}
                    </span>

                    <h3 className="shop-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                      {step.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-shop-muted md:text-base md:leading-7">
                      {step.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PHOTO + MESSAGE
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-stretch md:gap-10">
              <Reveal>
                <div className="relative min-h-[460px] overflow-hidden md:min-h-[620px]">
                  <Image
                    src="/images/sessions/session-01.jpg"
                    alt="Students playing chess"
                    fill
                    sizes="(max-width: 767px) 100vw, 60vw"
                    className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <span className="absolute left-5 top-5 text-[9px] font-bold tracking-[0.2em] text-white/55">
                    SHoP / SCHOOL CHESS
                  </span>

                  <div className="absolute bottom-7 left-7 right-7">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                      LEARNING THROUGH PLAY
                    </span>

                    <p className="shop-display mt-3 max-w-xl text-3xl leading-none text-white sm:text-4xl">
                      Give students a board and give them a problem to solve.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="flex flex-col justify-between border border-[#F3EDE2]/15 p-7 sm:p-10 md:p-12">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                      BEYOND THE BOARD
                    </span>

                    <p className="shop-display mt-8 text-4xl leading-[0.9] sm:text-5xl">
                      Every position asks a question.
                    </p>

                    <p className="mt-7 text-sm leading-6 text-[#F3EDE2]/50 sm:text-base sm:leading-7">
                      Students learn that there can be several possible
                      answers, that choices have consequences and that the
                      position can change with one decision.
                    </p>
                  </div>

                  <div className="mt-12 border-t border-[#F3EDE2]/10 pt-7">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      THE SHoP APPROACH
                    </span>

                    <p className="mt-4 text-sm leading-6 text-[#F3EDE2]/45">
                      Practical. Social. Challenging. Designed around the
                      student.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            OPPORTUNITIES
        ========================================================= */}
        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">
                  04 — Ways to work together
                </p>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    Build something
                    <br />
                    that lasts.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Every school is different. We can work around your
                    students, schedule and goals.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-shop-border">
              {opportunities.map((item, index) => (
                <Reveal key={item.number} delay={index * 80}>
                  <article className="group grid gap-7 border-b border-shop-border py-9 transition-colors duration-500 hover:bg-shop-paper md:grid-cols-[80px_0.8fr_1.2fr] md:items-center md:gap-10 md:px-6 md:py-11">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                      {item.number}
                    </span>

                    <h3 className="shop-display text-3xl leading-none transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">
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
            SCHOOL PARTNERSHIP
        ========================================================= */}
        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-[#F3EDE2]/45">
                    05 — Partnership
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-6xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    A school can be
                    <br />
                    a starting point.
                  </h2>

                  <p className="mt-8 max-w-3xl text-base leading-7 text-[#F3EDE2]/50 sm:text-lg sm:leading-8">
                    We want schools to be places where young people encounter
                    opportunity. Chess can be one of the ways that opportunity
                    begins.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-16 border-y border-[#F3EDE2]/15 py-8 md:mt-20 md:py-10">
                <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-2xl text-sm leading-6 text-[#F3EDE2]/45 md:text-base md:leading-7">
                    Interested in bringing chess to your school? Start a
                    conversation with SHoP.
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
                Bring chess to your school
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(4rem,9vw,10rem)] leading-[0.8]">
                The next
                <br />
                move starts here.
              </h2>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/join"
                  className="group inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="!text-[#F3EDE2]">
                    Partner with SHoP
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