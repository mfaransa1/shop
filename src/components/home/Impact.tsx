import Image from "next/image";

import { impactStats } from "@/data/impact";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/animations/Reveal";

export default function Impact() {
  return (
    <section
      id="impact"
      className="border-t border-shop-border bg-shop-paper"
    >
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Intro */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
            {/* Left — label + image */}
            <div>
              <p className="shop-eyebrow text-shop-muted">
                01 — Our impact
              </p>

              <Reveal delay={120}>
                <div className="relative mt-10 max-w-[360px] overflow-hidden md:mt-14">
                  <div className="relative aspect-[4/5] overflow-hidden bg-shop-cream">
                    <Image
                      src="/images/123.jpeg"
                      alt="Young people participating in a SHoP chess session"
                      fill
                      sizes="(max-width: 1023px) 360px, 30vw"
                      className="object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                    />

                    {/* Image treatment */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                    {/* Image label */}
                    <span className="absolute bottom-4 left-4 text-[8px] font-bold uppercase tracking-[0.2em] text-white/75">
                      SHoP / 01
                    </span>
                  </div>

                  {/* Editorial image marker */}
                  <div className="absolute -bottom-3 -right-3 bg-[#111111] px-4 py-3 text-[#F3EDE2]">
                    <span className="text-[8px] font-bold uppercase tracking-[0.18em]">
                      The impact
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — statement */}
            <div className="lg:pt-1">
              <h2 className="shop-display max-w-5xl text-[clamp(3rem,6vw,6.5rem)] leading-[0.9]">
                Chess is the medium. People are the impact.
              </h2>

              <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                SHoP uses chess as a starting point for connection, learning,
                discipline and opportunity. The real measure of the work is
                what happens beyond the board.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Statistics */}
        <div className="mt-20 grid border-t border-shop-border sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 100}
              direction="up"
            >
              <article
                className={`group border-shop-border py-8 sm:px-8 ${
                  index > 0
                    ? "border-t sm:border-l lg:border-t-0"
                    : ""
                } ${index === 2 ? "lg:border-l" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-xs text-shop-muted transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </div>

                <div className="shop-display mt-12 text-6xl leading-none sm:text-7xl">
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </div>

                <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.12em]">
                  {stat.label}
                </h3>

                <p className="mt-4 max-w-xs text-sm leading-6 text-shop-muted">
                  {stat.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Bottom statement */}
        <Reveal delay={350}>
          <div className="mt-24 border-t border-shop-border pt-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl text-sm leading-6 text-shop-muted">
                Every game creates an opportunity to learn. Every session
                creates an opportunity to belong. Every move can lead
                somewhere.
              </p>

              <span className="shop-eyebrow text-shop-muted">
                Kila hatua ina maana
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}