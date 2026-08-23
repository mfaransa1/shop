import Link from "next/link";

const moves = [
  "01. e4",
  "01... c5",
  "02. Nf3",
  "02... Nc6",
  "03. d4",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-shop-cream">
      {/* Background chess notation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute right-[-3rem] top-[28%] hidden rotate-90 text-[10px] font-semibold tracking-[0.35em] text-shop-ink/10 lg:block">
          {moves.join("    ")}
        </div>

        <div className="absolute bottom-10 left-[-2rem] hidden text-[10px] font-semibold tracking-[0.35em] text-shop-ink/10 lg:block">
          KAWANGWARE · NAIROBI · KENYA · SHoP ·
        </div>
      </div>

      <div className="shop-container relative flex min-h-screen items-center pt-20">
        <div className="grid w-full items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-28">
          {/* Copy */}
          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-4">
              <img
                src="/images/brand/logo-mark.svg"
                alt=""
                className="h-12 w-12 object-contain"
              />

              <div>
                <p className="shop-eyebrow text-shop-ink">
                  Southside House of Pawns
                </p>

                <p className="mt-1 text-xs font-medium tracking-wide text-shop-muted">
                  Kawangware · Nairobi
                </p>
              </div>
            </div>

            <p className="shop-eyebrow mb-6 text-shop-muted">
              Chess · Community · Possibility
            </p>

            <h1 className="shop-display max-w-5xl text-[clamp(4rem,8vw,8.5rem)] leading-[0.88] text-shop-ink">
              The board is bigger than the game.
            </h1>

            <div className="mt-10 max-w-xl">
              <p className="text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                We use chess to bring young people together, develop talent,
                build confidence and create positive possibilities beyond the
                board.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/join"
                className="group inline-flex items-center gap-4 bg-shop-ink px-6 py-4 text-sm font-semibold text-shop-cream transition-all duration-300 hover:-translate-y-1"
              >
                Join SHoP
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-4 border border-shop-ink/20 px-6 py-4 text-sm font-semibold transition-all duration-300 hover:bg-shop-paper"
              >
                Our story
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-5">
              <span className="h-px w-12 bg-shop-ink/30" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-shop-muted">
                Kila hatua ina maana
              </span>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
            <div className="relative aspect-square overflow-hidden bg-shop-ink">
              {/* Chess board */}
              <div className="absolute inset-[9%] grid grid-cols-8 grid-rows-8 opacity-30">
                {Array.from({ length: 64 }).map((_, index) => {
                  const row = Math.floor(index / 8);
                  const col = index % 8;
                  const dark = (row + col) % 2 === 1;

                  return (
                    <div
                      key={index}
                      className={dark ? "bg-shop-cream" : "bg-shop-ink"}
                    />
                  );
                })}
              </div>

              {/* Large logo mark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/images/brand/logo-mark.svg"
                  alt=""
                  className="relative z-10 w-[48%] max-w-[260px] invert"
                />
              </div>

              {/* Coordinates */}
              <span className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.2em] text-shop-cream/50">
                01
              </span>

              <span className="absolute bottom-4 right-4 text-[10px] font-bold tracking-[0.2em] text-shop-cream/50">
                SHoP
              </span>

              {/* Corner line */}
              <div className="absolute bottom-0 left-0 h-px w-1/3 bg-shop-cream/40" />
              <div className="absolute right-0 top-0 h-1/3 w-px bg-shop-cream/40" />
            </div>

            {/* Floating move notation */}
            <div className="absolute -bottom-6 -left-4 z-20 bg-shop-paper px-5 py-4 shadow-sm sm:-left-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted">
                First move
              </p>

              <p className="shop-display mt-1 text-2xl">
                01. e4
              </p>
            </div>

            {/* Small editorial label */}
            <div className="absolute -right-3 -top-5 z-20 hidden bg-shop-ink px-4 py-3 text-shop-cream sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                Kawangware
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-shop-muted">
          Scroll to explore
        </span>

        <span className="h-8 w-px bg-shop-ink/30" />
      </div>
    </section>
  );
}