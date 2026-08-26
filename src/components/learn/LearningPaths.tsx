"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const paths = [
  {
    number: "01",
    level: "BEGINNER",
    title: "Start here.",
    description:
      "Learn the board, understand the pieces and build the fundamentals that every strong player needs.",
    skills: ["Board & pieces", "Opening principles", "Basic tactics"],
    move: "e4",
  },
  {
    number: "02",
    level: "DEVELOPING",
    title: "Think deeper.",
    description:
      "Develop your calculation, positional understanding and ability to turn ideas into purposeful moves.",
    skills: ["Tactics", "Strategy", "Calculation"],
    move: "Nf3",
  },
  {
    number: "03",
    level: "COMPETITIVE",
    title: "Play stronger.",
    description:
      "Prepare for serious games with deeper analysis, practical decision-making and tournament discipline.",
    skills: ["Game analysis", "Endgames", "Competition"],
    move: "Bb5",
  },
];

export default function LearningPaths() {
  const [activePath, setActivePath] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  /*
   * Reveal the section when it enters the viewport.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-shop-cream"
    >
      <div className="shop-container py-24 md:py-32 lg:py-40">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className={[
            "grid gap-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "lg:grid-cols-[0.7fr_1.3fr] lg:gap-20",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          ].join(" ")}
        >
          <div>
            <p className="shop-eyebrow text-shop-muted">
              02 — Learning paths
            </p>

            <p className="mt-8 hidden max-w-xs text-xs leading-5 text-shop-muted/70 lg:block">
              There is no single way to learn chess. Start where you are and
              keep building.
            </p>
          </div>

          <div>
            <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.88]">
              Start somewhere.
              <br />
              Go somewhere.
            </h2>

            <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
              SHoP learning is built around progression. Each path develops
              the thinking, confidence and practical skills needed for the
              next stage.
            </p>
          </div>
        </div>

        {/* =====================================================
            LEARNING PATHS
        ===================================================== */}

        <div
          className={[
            "mt-20 transition-all duration-1000 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0",
          ].join(" ")}
        >
          {/* Desktop navigation */}

          <div className="hidden border-t border-shop-border md:block">
            {paths.map((path, index) => {
              const active = activePath === index;

              return (
                <button
                  key={path.number}
                  type="button"
                  onClick={() => setActivePath(index)}
                  aria-pressed={active}
                  className={[
                    "group grid w-full grid-cols-[80px_1fr_120px]",
                    "items-center gap-8 border-b border-shop-border",
                    "py-7 text-left",
                    "transition-all duration-500",
                    active
                      ? "bg-shop-paper px-6"
                      : "hover:bg-shop-paper/60",
                  ].join(" ")}
                >
                  {/* Number */}

                  <span
                    className={[
                      "text-[10px] font-bold tracking-[0.2em]",
                      "transition-colors duration-500",
                      active
                        ? "text-shop-ink"
                        : "text-shop-muted",
                    ].join(" ")}
                  >
                    {path.number}
                  </span>

                  {/* Title */}

                  <span className="flex items-center gap-5">
                    <span
                      className={[
                        "shop-display text-4xl leading-none",
                        "transition-transform duration-500",
                        "lg:text-5xl",
                        active
                          ? "translate-x-2"
                          : "group-hover:translate-x-1",
                      ].join(" ")}
                    >
                      {path.title}
                    </span>

                    <span
                      className={[
                        "text-[9px] font-bold tracking-[0.18em]",
                        "transition-all duration-500",
                        active
                          ? "translate-x-0 opacity-60"
                          : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40",
                      ].join(" ")}
                    >
                      {path.level}
                    </span>
                  </span>

                  {/* Chess move */}

                  <span
                    className={[
                      "text-right font-mono text-sm",
                      "text-shop-muted",
                      "transition-transform duration-500",
                      active
                        ? "translate-x-0"
                        : "group-hover:translate-x-1",
                    ].join(" ")}
                  >
                    {path.move} →
                  </span>
                </button>
              );
            })}
          </div>

          {/* ===================================================
              DESKTOP ACTIVE DETAIL
          =================================================== */}

          <div className="hidden border-b border-shop-border md:block">
            <div
              key={paths[activePath].number}
              className="grid gap-10 px-6 py-12 lg:grid-cols-[0.7fr_1fr_0.8fr] lg:gap-16"
            >
              {/* Move */}

              <div className="overflow-hidden">
                <span className="block text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                  PATH {paths[activePath].number}
                </span>

                <p
                  key={`${activePath}-move`}
                  className="shop-display mt-5 text-6xl leading-none animate-[shop-path-detail-in_500ms_cubic-bezier(0.22,1,0.36,1)]"
                >
                  {paths[activePath].move}
                </p>
              </div>

              {/* Description */}

              <div className="overflow-hidden">
                <span className="block text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                  {paths[activePath].level}
                </span>

                <p
                  key={`${activePath}-description`}
                  className="mt-5 max-w-xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8 animate-[shop-path-detail-in_550ms_cubic-bezier(0.22,1,0.36,1)]"
                >
                  {paths[activePath].description}
                </p>
              </div>

              {/* Skills */}

              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                  YOU WILL WORK ON
                </span>

                <div className="mt-5">
                  {paths[activePath].skills.map(
                    (skill, index) => (
                      <div
                        key={skill}
                        className="group flex items-center justify-between border-b border-shop-border py-3 text-sm transition-transform duration-300 hover:translate-x-1"
                        style={{
                          animation:
                            visible
                              ? `shop-skill-in 500ms ${
                                  index * 80
                                }ms cubic-bezier(0.22,1,0.36,1) both`
                              : "none",
                        }}
                      >
                        <span>{skill}</span>

                        <span className="font-mono text-[10px] text-shop-muted">
                          0{index + 1}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              MOBILE
          =================================================== */}

          <div className="space-y-3 md:hidden">
            {paths.map((path, index) => {
              const active = activePath === index;

              return (
                <article
                  key={path.number}
                  className="border-t border-shop-border"
                >
                  <button
                    type="button"
                    onClick={() => setActivePath(index)}
                    aria-expanded={active}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">
                        {path.number}
                      </span>

                      <div>
                        <span className="shop-display text-3xl leading-none">
                          {path.title}
                        </span>

                        <span className="mt-2 block text-[9px] font-bold tracking-[0.18em] text-shop-muted">
                          {path.level}
                        </span>
                      </div>
                    </div>

                    <span
                      className={[
                        "flex h-8 w-8 items-center justify-center",
                        "border border-shop-border",
                        "text-lg",
                        "transition-transform duration-500",
                        active ? "rotate-45" : "",
                      ].join(" ")}
                    >
                      +
                    </span>
                  </button>

                  {/* Accordion */}

                  <div
                    className={[
                      "grid transition-all duration-500",
                      active
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={[
                          "pb-7 pl-9 transition-transform duration-500",
                          active
                            ? "translate-y-0"
                            : "-translate-y-3",
                        ].join(" ")}
                      >
                        <p className="text-sm leading-6 text-shop-muted">
                          {path.description}
                        </p>

                        <div className="mt-6 border-t border-shop-border">
                          {path.skills.map(
                            (skill, skillIndex) => (
                              <div
                                key={skill}
                                className="flex items-center justify-between border-b border-shop-border py-3 text-sm"
                                style={{
                                  animation:
                                    active
                                      ? `shop-skill-in 400ms ${
                                          skillIndex * 70
                                        }ms cubic-bezier(0.22,1,0.36,1) both`
                                      : "none",
                                }}
                              >
                                <span>{skill}</span>

                                <span className="font-mono text-[10px] text-shop-muted">
                                  0{skillIndex + 1}
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <span className="font-mono text-xs text-shop-muted">
                            First move: {path.move}
                          </span>

                          <span className="text-xs text-shop-muted">
                            {path.number} / 03
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            CTA
        ===================================================== */}

        <div
          className={[
            "mt-14 flex flex-col gap-6 border-t border-shop-border pt-8",
            "transition-all duration-1000 delay-300",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0",
            "sm:flex-row sm:items-center sm:justify-between",
          ].join(" ")}
        >
          <p className="max-w-xl text-sm leading-6 text-shop-muted">
            Not sure where you belong? Start with the basics. The important
            thing is making the first move.
          </p>

          <Link
            href="/join"
            className="group inline-flex w-fit items-center gap-4 bg-[#111111] px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
          >
            <span className="!text-[#F3EDE2]">
              Start learning
            </span>

            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}