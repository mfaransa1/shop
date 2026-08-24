import Image from "next/image";
import Reveal from "@/components/animations/Reveal";

const principles = ["Think", "Play", "Belong", "Become"];

export default function Mission() {
  return (
    <section className="relative overflow-hidden bg-[#111111] text-[#F3EDE2]">
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Top label */}
        <Reveal>
          <div className="flex items-center justify-between">
            <p className="shop-eyebrow text-[#F3EDE2]/50">
              02 — Our mission
            </p>

            <span className="hidden text-[9px] font-bold tracking-[0.25em] text-[#F3EDE2]/30 md:block">
              KAWANGWARE · NAIROBI
            </span>
          </div>
        </Reveal>

        {/* Photography-led statement */}
        <Reveal delay={100}>
          <div className="relative mt-12 overflow-hidden md:mt-16">
            <div className="relative aspect-[16/9] min-h-[480px] overflow-hidden md:min-h-[600px]">
              <Image
                src="/images/sessions/session-01.jpg"
                alt="Young people playing chess at SHoP"
                fill
                sizes="100vw"
                className="object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
              />

              {/* Image treatment */}
              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Statement */}
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 md:p-14 lg:p-16">
                <Reveal delay={250}>
                  <p className="shop-eyebrow text-[#F3EDE2]/65">
                    Why we exist
                  </p>
                </Reveal>

                <Reveal delay={350}>
                  <h2 className="shop-display mt-5 max-w-6xl text-[clamp(3.5rem,7vw,8rem)] leading-[0.84]">
                    A place to think.
                    <br />
                    A place to belong.
                  </h2>
                </Reveal>
              </div>

              {/* Image index */}
              <div className="absolute right-6 top-6 text-[9px] font-bold tracking-[0.2em] text-white/60 md:right-8 md:top-8">
                SHoP / 02
              </div>
            </div>
          </div>
        </Reveal>

        {/* Supporting copy */}
        <Reveal delay={150}>
          <div className="mt-10 grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                THE IDEA
              </span>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <p className="text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">
                SHoP creates a positive space where young people can discover
                chess, challenge themselves and connect with others.
              </p>

              <p className="text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">
                The game teaches patience, discipline and strategic thinking.
                But the bigger goal is what those lessons make possible beyond
                the board.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Principles */}
        <Reveal delay={250}>
          <div className="mt-16 grid border-t border-[#F3EDE2]/15 sm:grid-cols-4">
            {principles.map((item, index) => (
              <div
                key={item}
                className="group border-b border-[#F3EDE2]/15 py-6 transition-colors duration-300 hover:bg-[#F3EDE2]/[0.03] sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0"
              >
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                  0{index + 1}
                </span>

                <p className="shop-display mt-5 text-3xl transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}