import Image from "next/image";
import Link from "next/link";

type MemberCardProps = {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  href?: string;
  number?: string;
  featured?: boolean;
};

export default function MemberCard({
  name,
  role,
  bio,
  image,
  href,
  number,
  featured = false,
}: MemberCardProps) {
  const content = (
    <article
      className={[
        "group h-full overflow-hidden border border-shop-border bg-shop-cream",
        "transition-transform duration-500 hover:-translate-y-1",
        featured ? "md:col-span-2" : "",
      ].join(" ")}
    >
      {image && (
        <div
          className={[
            "relative overflow-hidden bg-shop-paper",
            featured ? "aspect-[16/9]" : "aspect-[4/3]",
          ].join(" ")}
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {number && (
            <span className="absolute left-5 top-5 text-[9px] font-bold tracking-[0.2em] text-white/65">
              {number}
            </span>
          )}
        </div>
      )}

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-shop-muted/60">
              {role}
            </span>

            <h3 className="shop-display mt-3 text-3xl leading-none text-shop-ink sm:text-4xl">
              {name}
            </h3>
          </div>

          {href && (
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-shop-muted transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          )}
        </div>

        {bio && (
          <p className="mt-5 max-w-xl text-sm leading-6 text-shop-muted">
            {bio}
          </p>
        )}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}