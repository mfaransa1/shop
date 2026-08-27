import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Reveal from "@/components/animations/Reveal";

const stories = [
  {
    number: "01",
    category: "PLAYER",
    title: "A place to belong",
    description:
      "Chess creates a space where young people can meet, learn from one another and become part of something bigger.",
    image: "/images/members/member-01.jpeg",
    href: "/community",
  },
  {
    number: "02",
    category: "COMMUNITY",
    title: "Every board brings people together",
    description:
      "The game may begin with two players, but the community around the board keeps growing.",
    image: "/images/members/member-02.jpeg",
    href: "/community",
  },
  {
    number: "03",
    category: "JOURNEY",
    title: "Every move is a lesson",
    description:
      "Winning matters. Losing matters. Learning from both matters even more.",
    image: "/images/members/member-03.jpeg",
    href: "/community",
  },
];

export default function CommunityStories() {
  return (
    <section className="overflow-hidden bg-shop-cream">
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* Header */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="shop-eyebrow text-shop-muted">
                07 — Community stories
              </p>

              <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted lg:block">
                Behind every game is a person, a journey and a story worth
                telling.
              </p>
            </div>

            <div>
              <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.9]">
                The people make the place.
              </h2>

              <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                SHoP is built around people. Young players, coaches, schools,
                families and volunteers all contribute to the community we are
                building.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Stories */}
        <div className="mt-20 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Featured story */}
          <Reveal delay={100}>
            <Link
              href={stories[0].href}
              className="group block"
            >
              <article>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#111111]">
                  <Image
                    src={stories[0].image}
                    alt={stories[0].title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 60vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                  />

                  {/* Image treatment */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* Editorial frame */}
                  <div className="pointer-events-none absolute inset-5 border border-white/0 transition-all duration-700 group-hover:inset-7 group-hover:border-white/20" />

                  {/* Image index */}
                  <div className="absolute right-6 top-6">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-white/55">
                      STORIES / 01
                    </span>
                  </div>

                  {/* Story content */}
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-white/60">
                        {stories[0].category}
                      </span>

                      <span className="h-px w-8 bg-white/30" />

                      <span className="text-[10px] font-bold tracking-[0.2em] text-white/60">
                        {stories[0].number}
                      </span>
                    </div>

                    <h3 className="shop-display mt-5 max-w-xl text-4xl leading-none text-white transition-transform duration-500 group-hover:translate-x-1 md:text-5xl lg:text-6xl">
                      {stories[0].title}
                    </h3>

                    <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 md:text-base">
                      {stories[0].description}
                    </p>

                    <div className="mt-6 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                      <span>Read the story</span>

                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-2"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </Reveal>

          {/* Supporting stories */}
          <div className="grid gap-6">
            {stories.slice(1).map((story, index) => (
              <Reveal
                key={story.number}
                delay={200 + index * 120}
                direction="up"
              >
                <Link
                  href={story.href}
                  className="group block"
                >
                  <article className="grid grid-cols-[120px_1fr] gap-5 border-b border-shop-border pb-6 sm:grid-cols-[160px_1fr]">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#111111]">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />

                      <div className="pointer-events-none absolute inset-2 border border-white/0 transition-all duration-500 group-hover:inset-3 group-hover:border-white/20" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                          {story.number}
                        </span>

                        <span className="h-px w-5 bg-shop-border" />

                        <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                          {story.category}
                        </span>
                      </div>

                      <h3 className="shop-display mt-4 text-2xl leading-none transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
                        {story.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-shop-muted">
                        {story.description}
                      </p>

                      <span
                        aria-hidden="true"
                        className="mt-4 text-shop-muted transition-transform duration-300 group-hover:translate-x-2"
                      >
                        →
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <Reveal delay={400}>
          <div className="mt-20 border-t border-shop-border pt-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-6 text-shop-muted">
                These are only the beginning. As SHoP grows, we want to document
                the people and moments that make this community special.
              </p>

              <Button
                href="/community"
                variant="primary"
                size="lg"
                className="!text-[#F3EDE2]"
              >
                <span className="!text-[#F3EDE2]">
                  Meet the community
                </span>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}