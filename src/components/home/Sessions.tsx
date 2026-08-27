import Image from "next/image";

import Reveal from "@/components/animations/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const sessions = [
  {
    number: "01",
    title: "Learn",
    description:
      "Build your chess fundamentals with guided training designed for different levels of experience.",
    image: "/images/sessions/session-01.jpg",
  },
  {
    number: "02",
    title: "Play",
    description:
      "Sit across the board, test your ideas and discover the joy of playing with others.",
    image: "/images/sessions/session-02.jpg",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Meet other young players, coaches and members of a community built around chess.",
    image: "/images/sessions/session-03.jpg",
  },
];

export default function Sessions() {
  return (
    <section className="overflow-hidden bg-shop-cream">
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Header */}
        <Reveal>
          <SectionHeading
            eyebrow="04 — At SHoP"
            title="Come for the chess. Stay for the community."
            description="Our sessions are places to learn, play, compete and connect. Every board creates another opportunity to grow."
          />
        </Reveal>

        {/* Session cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-3 md:gap-5">
          {sessions.map((session, index) => (
            <Reveal
              key={session.number}
              delay={index * 120}
            >
              <article className="group">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111111]">
                  <Image
                    src={session.image}
                    alt={`SHoP ${session.title} session`}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Subtle image frame */}
                  <div className="pointer-events-none absolute inset-4 border border-white/0 transition-all duration-700 group-hover:inset-6 group-hover:border-white/20" />

                  {/* Session label */}
                  <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/70">
                      SESSION {session.number}
                    </span>
                  </div>

                  {/* Corner label */}
                  <div className="absolute right-5 top-5">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-white/60">
                      SHoP
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="border-b border-shop-border py-7">
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="shop-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-1">
                      {session.title}
                    </h3>

                    <span className="mt-1 text-shop-muted transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>

                  <p className="mt-5 max-w-sm text-sm leading-6 text-shop-muted">
                    {session.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Footer */}
        <Reveal delay={350}>
          <div className="mt-14 flex flex-col gap-6 border-t border-shop-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="shop-eyebrow text-shop-muted">
                Saturday sessions
              </p>

              <p className="mt-2 text-sm text-shop-muted">
                Everyone deserves a place at the board.
              </p>
            </div>

            <Button
              href="/join"
              variant="primary"
              size="lg"
              className="!text-[#F3EDE2]"
            >
              <span className="!text-[#F3EDE2]">
                Join a session
              </span>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}