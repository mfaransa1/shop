import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-shop-cream">
      <div className="shop-container py-28 md:py-40 lg:py-52">
        <div className="relative">
          {/* Background notation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 select-none font-mono text-[12rem] leading-none tracking-[-0.08em] text-shop-ink/[0.035] lg:block"
          >
            ♟
          </div>

          <p className="shop-eyebrow text-shop-muted">
           Your move
          </p>

          <h2 className="shop-display mt-8 max-w-6xl text-[clamp(4rem,9vw,10rem)] leading-[0.82]">
            Every move starts with a decision.
          </h2>

          <p className="mt-10 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
            Whether you want to play, volunteer, partner with us or help bring
            chess to more young people, there is a place for you at SHoP.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/join"
              className="group inline-flex items-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
            >
              <span className="!text-[#F3EDE2]">Join SHoP</span>

              <span
                aria-hidden="true"
                className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <Link
              href="/support"
              className="group inline-flex items-center gap-4 border border-shop-ink/20 px-7 py-4 text-sm font-semibold transition-all duration-300 hover:bg-shop-paper"
            >
              Support the mission

              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          {/* Closing line */}
          <div className="mt-24 flex items-center gap-5">
            <span className="h-px w-16 bg-shop-ink/30" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-shop-muted">
              Kila hatua ina maana
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}