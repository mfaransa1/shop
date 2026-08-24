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
      {/* Editorial background notation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute right-5 top-32 hidden rotate-90 text-[9px] font-semibold tracking-[0.35em] text-shop-ink/10 lg:block">
          {moves.join("    ")}
        </div>

        <div className="absolute bottom-8 left-0 hidden text-[9px] font-semibold tracking-[0.35em] text-shop-ink/10 lg:block">
          KAWANGWARE · NAIROBI · KENYA · SHoP · KILA HATUA INA MAANA
        </div>
      </div>

      {/* Main content */}
      <div className="shop-container relative flex min-h-screen items-center pt-28 lg:pt-32">
        <div className="grid w-full items-center gap-16 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-24">
          {/* LEFT */}
          <div className="relative z-10">
            {/* Brand */}
            <div className="shop-reveal mb-10 flex items-center gap-4">
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

            {/* Eyebrow */}
            <p className="shop-reveal shop-eyebrow mb-6 text-shop-muted [animation-delay:120ms]">
              Chess · Community · Possibility
            </p>

            {/* Headline */}
            <h1 className="shop-display shop-reveal max-w-5xl text-[clamp(4rem,8vw,8.5rem)] leading-[0.88] text-shop-ink [animation-delay:180ms]">
              The board is bigger than the game.
            </h1>

            {/* Description */}
            <div className="shop-reveal mt-10 max-w-xl [animation-delay:300ms]">
              <p className="text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                We use chess to bring young people together, develop talent,
                build confidence and create positive possibilities beyond the
                board.
              </p>
            </div>

            {/* Actions */}
            <div className="shop-reveal mt-10 flex flex-wrap items-center gap-3 [animation-delay:420ms]">
              <Link
                href="/join"
                className="group inline-flex items-center gap-4 bg-[#111111] px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
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
                href="/about"
                className="inline-flex items-center gap-4 border border-shop-ink/20 px-6 py-4 text-sm font-semibold transition-all duration-300 hover:bg-shop-paper"
              >
                Our story
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            {/* Philosophy */}
            <div className="shop-reveal mt-16 flex items-center gap-5 [animation-delay:520ms]">
              <span className="h-px w-12 bg-shop-ink/30" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-shop-muted">
                Kila hatua ina maana
              </span>
            </div>
          </div>

          {/* RIGHT — CHESS VISUAL */}
          <div className="shop-reveal relative mx-auto w-full max-w-[620px] [animation-delay:250ms] lg:ml-auto">
            <div className="relative aspect-square overflow-hidden bg-[#111111]">
              {/* Chess board */}
              <div
                aria-hidden="true"
                className="absolute inset-[9%] grid grid-cols-8 grid-rows-8 opacity-30"
              >
                {Array.from({ length: 64 }).map((_, index) => {
                  const row = Math.floor(index / 8);
                  const col = index % 8;
                  const dark = (row + col) % 2 === 1;

                  return (
                    <div
                      key={index}
                      className={dark ? "bg-[#F3EDE2]" : "bg-[#111111]"}
                    />
                  );
                })}
              </div>

              {/* Central pawn */}
              <div
                aria-hidden="true"
                className="shop-pawn absolute inset-0 flex items-center justify-center"
              >
                <span className="font-serif text-[clamp(9rem,18vw,16rem)] leading-none text-[#F3EDE2] drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]">
                  ♟
                </span>
              </div>

              {/* Board coordinates */}
              <span className="absolute left-5 top-5 text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/50">
                01
              </span>

              <span className="absolute bottom-5 right-5 text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/50">
                SHoP
              </span>

              {/* Decorative lines */}
              <div className="absolute bottom-0 left-0 h-px w-1/3 bg-[#F3EDE2]/40" />
              <div className="absolute right-0 top-0 h-1/3 w-px bg-[#F3EDE2]/40" />
            </div>

            {/* Kawangware label */}
            <div className="absolute -right-3 -top-5 z-20 bg-[#111111] px-5 py-3 text-[#F3EDE2] sm:-right-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                Kawangware
              </p>
            </div>

            {/* First move card */}
            <div className="absolute -bottom-6 -left-4 z-20 bg-shop-paper px-6 py-4 shadow-[0_12px_35px_rgba(0,0,0,0.08)] sm:-left-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted">
                First move
              </p>

              <p className="shop-display mt-1 text-2xl">01. e4</p>
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