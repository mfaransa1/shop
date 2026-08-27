"use client";

import Link from "next/link";

type GameCardProps = {
  title: string;
  description?: string;
  level?: string;
  moves?: number;
  opening?: string;
  image?: string;
  href?: string;
  featured?: boolean;
  className?: string;
};

export default function GameCard({
  title,
  description,
  level = "All levels",
  moves,
  opening,
  image,
  href = "#",
  featured = false,
  className = "",
}: GameCardProps) {
  const content = (
    <>
      {/* Visual */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111111]">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111111]">
            <div className="text-center">
              <span className="font-serif text-[clamp(4rem,10vw,7rem)] leading-none text-[#F3EDE2]/20">
                ♞
              </span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="bg-[#F3EDE2] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.18em] text-[#111111]">
            {level}
          </span>
        </div>

        {featured && (
          <div className="absolute bottom-4 left-4">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60">
              Featured game
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="border border-t-0 border-shop-border bg-shop-cream p-6 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="shop-display text-3xl leading-[0.9] sm:text-4xl">
              {title}
            </h3>

            {description && (
              <p className="mt-4 max-w-lg text-sm leading-6 text-shop-muted">
                {description}
              </p>
            )}
          </div>

          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-shop-ink/15 text-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#111111] group-hover:text-[#F3EDE2]"
          >
            →
          </span>
        </div>

        {/* Metadata */}
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-shop-border pt-5">
          {opening && (
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-shop-muted">
              {opening}
            </span>
          )}

          {moves !== undefined && (
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-shop-muted">
              {moves} {moves === 1 ? "move" : "moves"}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (href === "#") {
    return (
      <div
        className={[
          "group block",
          "transition-transform duration-500",
          "hover:-translate-y-1",
          className,
        ].join(" ")}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={[
        "group block",
        "transition-transform duration-500",
        "hover:-translate-y-1",
        className,
      ].join(" ")}
    >
      {content}
    </Link>
  );
}