import Image from "next/image";

import Button from "@/components/ui/Button";
import Reveal from "@/components/animations/Reveal";

const highlights = [
  {
    number: "01",
    title: "Schools",
    text: "Taking chess into schools gives more young people an opportunity to discover the game and what it can teach them.",
  },
  {
    number: "02",
    title: "Players",
    text: "Young players bring energy, curiosity and ambition to every board.",
  },
  {
    number: "03",
    title: "Community",
    text: "Coaches, families, volunteers and schools help turn individual games into a community.",
  },
];

export default function SchoolImpact() {
  return (
    <section className="overflow-hidden bg-shop-paper">
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Intro */}
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="shop-eyebrow text-shop-muted">
                05 — Beyond the board
              </p>

              <h2 className="shop-display mt-6 max-w-5xl text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.86]">
                Take the board where the future is.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-shop-muted md:pb-2">
              SHoP grows through the people and places that make chess
              accessible to young people.
            </p>
          </div>
        </Reveal>

        {/* Editorial composition */}
        <Reveal delay={100}>
          <div className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Large image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#111111] lg:aspect-[5/4]">
              <Image
                src="/images/schools/school-01.jpg"
                alt="Young people participating in chess at a SHoP school"
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-7 md:p-10">
                <span className="text-[9px] font-bold tracking-[0.2em] text-white/60">
                  SHoP × SCHOOLS
                </span>

                <p className="shop-display mt-4 max-w-lg text-3xl leading-none text-white md:text-4xl">
                  More boards. More minds. More possibilities.
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col justify-between bg-[#111111] p-8 text-[#F3EDE2] md:p-10 lg:p-12">
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                  THE COMMUNITY
                </span>

                <h3 className="shop-display mt-10 text-[clamp(2.75rem,5vw,5rem)] leading-[0.88]">
                  Nobody plays alone.
                </h3>

                <p className="mt-8 max-w-md text-sm leading-6 text-[#F3EDE2]/55 md:text-base md:leading-7">
                  A chessboard brings two players together. A community makes
                  sure they keep coming back.
                </p>
              </div>

              <div className="mt-16">
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                  KAWANGWARE · NAIROBI
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Highlights */}
        <Reveal delay={200}>
          <div className="mt-16 grid border-t border-shop-border md:grid-cols-3">
            {highlights.map((item, index) => (
              <article
                key={item.number}
                className="
                  group border-b border-shop-border py-8
                  transition-colors duration-300
                  hover:bg-shop-cream
                  md:border-b-0 md:border-l md:px-8
                  md:first:border-l-0 md:first:pl-0
                "
              >
                <span
                  className="
                    text-[9px] font-bold tracking-[0.2em] text-shop-muted
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                >
                  {item.number}
                </span>

                <h3
                  className="
                    shop-display mt-5 text-3xl
                    transition-transform duration-300
                    group-hover:translate-x-1
                    md:text-4xl
                  "
                >
                  {item.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-6 text-shop-muted">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={300}>
          <div className="mt-12 flex flex-col gap-5 border-t border-shop-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-shop-muted">
              Interested in bringing chess to your school?
            </p>

            <Button
              href="/schools"
              variant="primary"
              size="lg"
              className="!text-[#F3EDE2]"
            >
              <span className="!text-[#F3EDE2]">
                Work with SHoP
              </span>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}