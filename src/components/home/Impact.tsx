import { impactStats } from "@/data/impact";

export default function Impact() {
  return (
    <section
      id="impact"
      className="border-t border-shop-border bg-shop-paper"
    >
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Intro */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="shop-eyebrow text-shop-muted">01 — Our impact</p>
          </div>

          <div>
            <h2 className="shop-display max-w-5xl text-[clamp(3rem,6vw,6.5rem)] leading-[0.9]">
              Chess is the medium. People are the impact.
            </h2>

            <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
              SHoP uses chess as a starting point for connection, learning,
              discipline and opportunity. The real measure of the work is what
              happens beyond the board.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-20 grid border-t border-shop-border sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat, index) => (
            <article
              key={stat.label}
              className={`group border-shop-border py-8 sm:px-8 ${
                index > 0 ? "border-t sm:border-l lg:border-t-0" : ""
              } ${index === 2 ? "lg:border-l" : ""}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                  0{index + 1}
                </span>

                <span className="text-xs text-shop-muted transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </div>

              <div className="shop-display mt-12 text-6xl leading-none sm:text-7xl">
                {stat.value === null ? "—" : `${stat.value}${stat.suffix}`}
              </div>

              <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.12em]">
                {stat.label}
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-6 text-shop-muted">
                {stat.description}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom statement */}
        <div className="mt-24 border-t border-shop-border pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-6 text-shop-muted">
              Every game creates an opportunity to learn. Every session creates
              an opportunity to belong. Every move can lead somewhere.
            </p>

            <span className="shop-eyebrow text-shop-muted">
              Kila hatua ina maana
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}