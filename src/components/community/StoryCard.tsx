import Image from "next/image";
import Link from "next/link";

type StoryCardProps = {
  title: string;
  text: string;
  image?: string;
  number?: string;
  href?: string;
  featured?: boolean;
};

export default function StoryCard({
  title,
  text,
  image,
  number,
  href,
  featured = false,
}: StoryCardProps) {
  const card = (
    <article
      className={[
        "group overflow-hidden border border-shop-border bg-shop-cream",
        "transition-transform duration-500 hover:-translate-y-1",
        featured ? "md:col-span-2" : "",
      ].join(" ")}
    >
      {image && (
        <div
          className={[
            "relative overflow-hidden bg-shop-paper",
            featured ? "aspect-[16/8]" : "aspect-[4/3]",
          ].join(" ")}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {number && (
            <span className="absolute left-5 top-5 text-[9px] font-bold tracking-[0.2em] text-white/60">
              {number}
            </span>
          )}
        </div>
      )}

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-6">
          <h3 className="shop-display max-w-xl text-3xl leading-[0.92] text-shop-ink sm:text-4xl">
            {title}
          </h3>

          {href && (
            <span
              aria-hidden="true"
              className="shrink-0 text-shop-muted transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          )}
        </div>

        <p className="mt-5 max-w-xl text-sm leading-6 text-shop-muted">
          {text}
        </p>
      </div>
    </article>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
}