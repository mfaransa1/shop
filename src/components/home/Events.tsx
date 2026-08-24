import Link from "next/link";
import Reveal from "@/components/animations/Reveal";

const events = [
  {
    number: "01",
    date: "UPCOMING",
    title: "SHoP Chess Tournament",
    description:
      "A community tournament bringing players together to compete, learn and connect.",
    type: "TOURNAMENT",
  },
  {
    number: "02",
    date: "REGULAR",
    title: "Saturday Chess Sessions",
    description:
      "Weekly opportunities to learn, play and spend time around the board.",
    type: "COMMUNITY",
  },
  {
    number: "03",
    date: "COMING SOON",
    title: "School Chess Events",
    description:
      "Chess activities and competitions connecting schools and young players.",
    type: "SCHOOLS",
  },
];

export default function Events() {
  return (
    <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Header */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="shop-eyebrow text-[#F3EDE2]/50">
                06 — Events
              </p>

              <p className="mt-8 hidden max-w-xs text-xs leading-5 text-[#F3EDE2]/40 lg:block">
                From Saturday sessions to competitive tournaments, there is
                always another move to make.
              </p>
            </div>

            <div>
              <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.9]">
                The next move starts here.
              </h2>

              <p className="mt-8 max-w-2xl text-base leading-7 text-[#F3EDE2]/60 sm:text-lg sm:leading-8">
                Follow SHoP events, tournaments and community activities as we
                create more opportunities for young people to play and compete.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Events */}
        <div className="mt-20 border-t border-[#F3EDE2]/15">
          {events.map((event, index) => (
            <Reveal
              key={event.number}
              delay={index * 120}
              direction="up"
            >
              <article
                className="
                  group relative grid gap-6
                  border-b border-[#F3EDE2]/15
                  py-8 transition-colors duration-500
                  hover:bg-[#F3EDE2]/[0.035]
                  md:grid-cols-[80px_160px_1fr_120px]
                  md:items-center md:gap-8 md:py-10
                "
              >
                {/* Active line */}
                <span
                  aria-hidden="true"
                  className="
                    absolute left-0 top-0 h-full w-px
                    origin-top scale-y-0
                    bg-[#F3EDE2]
                    transition-transform duration-500
                    group-hover:scale-y-100
                  "
                />

                {/* Number */}
                <span
                  className="
                    text-[10px] font-bold tracking-[0.2em]
                    text-[#F3EDE2]/30
                    transition-transform duration-500
                    group-hover:translate-x-1
                  "
                >
                  {event.number}
                </span>

                {/* Date */}
                <span
                  className="
                    text-[10px] font-bold tracking-[0.18em]
                    text-[#F3EDE2]/50
                    transition-colors duration-300
                    group-hover:text-[#F3EDE2]/80
                  "
                >
                  {event.date}
                </span>

                {/* Main */}
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                    {event.type}
                  </span>

                  <h3
                    className="
                      shop-display mt-3 text-3xl leading-none
                      transition-transform duration-500
                      group-hover:translate-x-1
                      sm:text-4xl
                    "
                  >
                    {event.title}
                  </h3>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-[#F3EDE2]/50">
                    {event.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center md:justify-end">
                  <span
                    className="
                      flex h-12 w-12 items-center justify-center
                      border border-[#F3EDE2]/20
                      text-lg
                      transition-all duration-500
                      group-hover:-translate-y-1
                      group-hover:border-[#F3EDE2]
                      group-hover:bg-[#F3EDE2]
                      group-hover:text-[#111111]
                    "
                  >
                    →
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Footer */}
        <Reveal delay={350}>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/50">
              Whether you're playing your first game or preparing for a
              tournament, there is always another move ahead.
            </p>

            <Link
              href="/tournaments"
              className="
                group inline-flex w-fit items-center gap-4
                border border-[#F3EDE2]/30
                px-6 py-4 text-sm font-semibold
                !text-[#F3EDE2]
                transition-all duration-300
                hover:bg-[#F3EDE2]
                hover:!text-[#111111]
              "
            >
              <span className="!text-current">View all events</span>

              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
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