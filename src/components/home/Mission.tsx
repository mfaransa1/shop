import Link from "next/link";

export default function Mission() {
  return (
    <section className="relative overflow-hidden bg-[#111111] text-[#F3EDE2]">
      <div className="shop-container py-28 md:py-40 lg:py-52">
        <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          {/* Label */}
          <div>
            <p className="shop-eyebrow text-[#F3EDE2]/50">
              02 — Our mission
            </p>

            <div className="mt-8 hidden lg:block">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                SHoP / KAWANGWARE / NAIROBI
              </span>
            </div>
          </div>

          {/* Main story */}
          <div>
            <h2 className="shop-display max-w-6xl text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.88]">
              Every young person deserves a place to think, play, belong and
              become.
            </h2>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <p className="text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">
                SHoP uses chess to create a space where young people can
                discover their abilities, challenge themselves and build
                meaningful relationships with others.
              </p>

              <p className="text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">
                Our goal goes beyond teaching the game. We want every session
                to create confidence, discipline, strategic thinking and a
                sense of possibility.
              </p>
            </div>

            {/* Mission principles */}
            <div className="mt-20 grid border-t border-[#F3EDE2]/15 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Think",
                "Play",
                "Belong",
                "Become",
              ].map((item, index) => (
                <div
                  key={item}
                  className="border-[#F3EDE2]/15 py-7 sm:px-6 lg:border-l lg:first:border-l-0"
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                    0{index + 1}
                  </span>

                  <h3 className="shop-display mt-6 text-3xl sm:text-4xl">
                    {item}
                  </h3>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16">
              <Link
                href="/about"
                className="group inline-flex items-center gap-4 border border-[#F3EDE2]/30 px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:bg-[#F3EDE2] hover:!text-[#111111]"
              >
                Discover our story
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial marker */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 right-8 hidden text-[9px] font-bold tracking-[0.3em] text-[#F3EDE2]/20 lg:block"
      >
        KILA HATUA INA MAANA
      </div>
    </section>
  );
}