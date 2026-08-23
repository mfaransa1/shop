import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-shop-paper">
        <section className="shop-container flex min-h-screen items-center pt-20">
          <div className="max-w-5xl py-24">
            <p className="shop-eyebrow mb-8 text-shop-muted">
              Southside House of Pawns · Kawangware
            </p>

            <h1 className="shop-display text-6xl leading-[0.95] sm:text-7xl lg:text-[8rem]">
              The board is bigger than the game.
            </h1>

            <div className="mt-10 max-w-xl">
              <p className="text-lg leading-8 text-shop-muted">
                We use chess to bring young people together, develop talent,
                build community and create positive possibilities.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/join"
                className="group inline-flex items-center gap-3 bg-shop-ink px-6 py-4 text-sm font-semibold text-shop-cream transition-transform duration-300 hover:-translate-y-1"
              >
                Join SHoP
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="/about"
                className="inline-flex items-center gap-3 border border-shop-border px-6 py-4 text-sm font-semibold transition-colors hover:bg-shop-cream"
              >
                Discover SHoP
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}