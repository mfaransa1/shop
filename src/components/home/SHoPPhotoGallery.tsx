import Image from "next/image";

const photographs = [
  { src: "/images/optimized/5555.webp", alt: "Young chess players gathered around a board", caption: "Learning together" },
  { src: "/images/optimized/688.webp", alt: "A young player concentrating over a chessboard", caption: "Focus and patience" },
  { src: "/images/optimized/67566.webp", alt: "Two players studying a chess position", caption: "Thinking ahead" },
  { src: "/images/optimized/089.webp", alt: "Players sharing a chess session", caption: "Community in action" },
  { src: "/images/optimized/images-1.webp", alt: "School learners taking part in a chess activity", caption: "Chess in schools" },
  { src: "/images/optimized/images-2.webp", alt: "A row of chessboards during a school activity", caption: "Room to learn" },
  { src: "/images/optimized/234.webp", alt: "A close view of a chess game in progress", caption: "Every move matters" },
  { src: "/images/optimized/0999.webp", alt: "Players gathered for a community chess event", caption: "Growing together" },
  { src: "/images/optimized/8799.webp", alt: "Two community members playing chess", caption: "Meet at the board" },
];

export default function SHoPPhotoGallery() {
  return (
    <section aria-labelledby="shop-gallery-title" className="bg-shop-paper">
      <div className="shop-container py-16 md:py-24">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="shop-eyebrow text-shop-muted">SHoP in pictures</p>
            <h2 id="shop-gallery-title" className="shop-display mt-4 text-4xl sm:text-5xl">Life around the board.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-shop-muted">Real moments from chess sessions, school activities and the people who make this community.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {photographs.map((photo, index) => (
            <figure key={photo.src} className={`group relative overflow-hidden bg-shop-cream ${index === 0 || index === 5 ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 767px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold text-white sm:p-5 sm:text-sm">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
