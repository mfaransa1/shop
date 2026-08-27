import Image from "next/image";
import Link from "next/link";

type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
};

type GalleryProps = {
  items: GalleryItem[];
  className?: string;
};

export default function Gallery({
  items,
  className = "",
}: GalleryProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div
      className={[
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-12",
        className,
      ].join(" ")}
    >
      {items.map((item, index) => {
        const featured = index === 0;
        const wide = index === 3;

        const image = (
          <div
            className={[
              "group relative h-full min-h-[260px] overflow-hidden bg-shop-paper",
              featured
                ? "lg:col-span-7 lg:row-span-2 lg:min-h-[540px]"
                : wide
                  ? "lg:col-span-5"
                  : "lg:col-span-5",
            ].join(" ")}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={
                featured
                  ? "(max-width: 1024px) 100vw, 58vw"
                  : "(max-width: 1024px) 100vw, 42vw"
              }
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute left-5 top-5">
              <span className="text-[8px] font-bold tracking-[0.2em] text-white/55">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {item.caption && (
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-semibold text-white">
                  {item.caption}
                </p>
              </div>
            )}
          </div>
        );

        if (item.href) {
          return (
            <Link
              key={`${item.src}-${index}`}
              href={item.href}
              className={[
                "block",
                featured
                  ? "lg:col-span-7 lg:row-span-2"
                  : "lg:col-span-5",
              ].join(" ")}
            >
              {image}
            </Link>
          );
        }

        return (
          <div
            key={`${item.src}-${index}`}
            className={
              featured
                ? "lg:col-span-7 lg:row-span-2"
                : "lg:col-span-5"
            }
          >
            {image}
          </div>
        );
      })}
    </div>
  );
}