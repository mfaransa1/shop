import Link from "next/link";
import Reveal from "@/components/animations/Reveal";

const journey = [
  {
    number: "01",
    title: "Discover",
    text: "Find the board, discover the game and begin to see possibilities in every position.",
    move: "e4",
  },
  {
    number: "02",
    title: "Learn",
    text: "Build the fundamentals, develop strategic thinking and learn to make purposeful decisions.",
    move: "Nf3",
  },
  {
    number: "03",
    title: "Compete",
    text: "Put your ideas to the test, compete with others and learn from every game.",
    move: "Bb5",
  },
  {
    number: "04",
    title: "Lead",
    text: "Take the discipline, confidence and strategic thinking developed through chess beyond the board.",
    move: "O-O",
  },
];

export default function ChessJourney() {
  return (
    <section className="overflow-hidden bg-shop-paper">
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Header */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="shop-eyebrow text-shop-muted">
                03 — The chess journey
              </p>
            </div>

            <div>
              <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.9]">
                You don't just learn chess. You learn how to think.
              </h2>

              <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                At SHoP, chess is a journey. Each stage builds something that
                matters both on and beyond the board.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Journey */}
        <div className="mt-20 border-t border-shop-border">
          {journey.map((item, index) => (
            <Reveal
              key={item.number}
              delay={index * 100}
              direction="up"
            >
              <article
                className="
                  group relative grid border-b border-shop-border
                  py-10 transition-all duration-500
                  hover:bg-shop-cream
                  md:grid-cols-[100px_0.8fr_1.2fr_100px]
                  md:items-center md:gap-8 md:px-6
                "
              >
                {/* Hover line */}
                <span
                  aria-hidden="true"
                  className="
                    absolute left-0 top-0 h-full w-0.5 origin-top
                    scale-y-0 bg-shop-ink
                    transition-transform duration-500
                    group-hover:scale-y-100
                  "
                />

                {/* Number */}
                <span
                  className="
                    text-xs font-bold tracking-[0.2em] text-shop-muted
                    transition-transform duration-500
                    group-hover:translate-x-1
                  "
                >
                  {item.number}
                </span>

                {/* Title */}
                <h3
                  className="
                    shop-display mt-5 text-4xl leading-none
                    transition-transform duration-500
                    group-hover:translate-x-2
                    md:mt-0 md:text-5xl lg:text-6xl
                  "
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-6 max-w-xl text-sm leading-6 text-shop-muted
                    transition-colors duration-500
                    group-hover:text-shop-ink/70
                    md:mt-0 md:text-base md:leading-7
                  "
                >
                  {item.text}
                </p>

                {/* Chess move */}
                <div className="mt-8 flex items-center md:mt-0 md:justify-end">
                  <span
                    className="
                      font-mono text-sm font-semibold tracking-wide
                      transition-transform duration-500
                      group-hover:-translate-x-1
                    "
                  >
                    {item.move}
                  </span>

                  <span
                    aria-hidden="true"
                    className="
                      ml-3 inline-block text-shop-muted
                      transition-transform duration-500
                      group-hover:translate-x-2
                    "
                  >
                    →
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal delay={400}>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-sm leading-6 text-shop-muted">
              Whether you're touching a chessboard for the first time or
              preparing for your next tournament, there's a place for you at
              SHoP.
            </p>

            <Link
              href="/learn"
              className="
                group inline-flex w-fit items-center gap-4
                bg-[#111111] px-6 py-4 text-sm font-semibold
                !text-[#F3EDE2]
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <span className="!text-[#F3EDE2]">Explore chess</span>

              <span
                aria-hidden="true"
                className="
                  !text-[#F3EDE2]
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}