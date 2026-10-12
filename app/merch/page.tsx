import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";
import { getPublishedShopProducts } from "@/lib/shop-cms-public";
import { AddToBasketButton, BasketLink } from "@/components/merch/AddToBasketButton";

const products = [
  {
    category: "PLAY",
    name: "Chessboard sets",
    description: "Everyday boards and complete sets for home practice, club sessions and gifts.",
    image: "/images/merch/chessboard-set.jpg",
    alt: "Chessboard set product image placeholder",
    availability: "Enquire for availability",
  },
  {
    category: "EQUIPMENT",
    name: "Chess pieces",
    description: "Replacement pieces and sets for players, schools and community chess spaces.",
    image: "/images/merch/chess-pieces.jpg",
    alt: "Chess pieces product image placeholder",
    availability: "Enquire for availability",
  },
  {
    category: "TRAINING",
    name: "Chess clocks",
    description: "Timing equipment for practice games and organised competition.",
    image: "/images/merch/chess-clock.jpg",
    alt: "Chess clock product image placeholder",
    availability: "Enquire for availability",
  },
  {
    category: "SHoP GOODS",
    name: "Club apparel",
    description: "SHoP-branded shirts and other club items, subject to confirmed stock and sizing.",
    image: "/images/merch/shop-apparel.jpg",
    alt: "SHoP club apparel product image placeholder",
    availability: "Coming soon",
  },
  {
    category: "LEARNING",
    name: "Learning materials",
    description: "Chess notebooks, score sheets and practice materials for players and schools.",
    image: "/images/merch/chess-learning-materials.jpg",
    alt: "Chess learning materials product image placeholder",
    availability: "Enquire for availability",
  },
  {
    category: "CLUB SUPPORT",
    name: "Sponsor a board",
    description: "Support access to equipment by helping fund a board set for club or learning use.",
    image: "/images/merch/sponsor-a-board.jpg",
    alt: "Chessboard for a community programme product image placeholder",
    availability: "Support option",
  },
];

export default async function MerchPage() {
  const cmsProducts = await getPublishedShopProducts();
  const displayProducts = cmsProducts.length > 0
    ? cmsProducts.map((product) => ({
        id: product.id,
        category: product.category.toUpperCase(),
        name: product.name,
        description: product.description,
        image: product.image_path || "/images/merch/chessboard-set.jpg",
        alt: `${product.name} product image`,
        availability: product.availability,
        price: product.price_kes,
      }))
    : products.map((product) => ({ ...product, id: product.name, price: null as number | null }));

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-12 h-[32rem] w-[32rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[130px]" />
          <div className="shop-container relative grid min-h-[70vh] items-center gap-12 py-32 md:py-40 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <Reveal><p className="shop-eyebrow text-[#F3EDE2]/50">The SHoP store</p></Reveal>
              <Reveal delay={100}><h1 className="shop-display mt-8 max-w-5xl text-[clamp(4rem,9vw,9rem)] leading-[0.82]">Good gear. Better games.</h1></Reveal>
              <Reveal delay={220}><p className="mt-9 max-w-xl text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">Explore chess equipment, learning essentials and future SHoP-branded merchandise. Buying from the store can help support a culture of chess, practice and belonging.</p></Reveal>
              <Reveal delay={320}><div className="mt-9 flex flex-wrap gap-3"><Link href="#products" className="inline-flex bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-colors hover:bg-white">Browse products</Link><Link href="/support#donate" className="inline-flex border border-[#F3EDE2]/30 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">Support SHoP</Link></div></Reveal>
            </div>
            <Reveal delay={180}>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F3EDE2]/5">
                <Image src="/images/merch/chessboard-hero.jpg" alt="Chessboard merchandise hero image placeholder" fill priority sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 text-[10px] font-bold tracking-[0.2em] text-white/75">KILA HATUA INA MAANA</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="products" className="scroll-mt-20 bg-shop-cream">
          <div className="shop-container py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-end">
              <div><p className="shop-eyebrow text-shop-muted">01 — Equipment and goods</p><h2 className="shop-display mt-5 text-5xl leading-[0.88] sm:text-6xl">Made for the next move.</h2></div>
              <p className="max-w-2xl text-sm leading-7 text-shop-muted sm:text-base">This is the starting catalogue. Product images, prices, stock, delivery options and payment checkout must be confirmed before orders can be taken. Select an item to register your interest while the store is being prepared.</p>
            </div>
            <div className="mb-5 flex justify-end"><BasketLink /></div>
            <div className="mt-12 grid gap-px border border-shop-border bg-shop-border sm:grid-cols-2 lg:grid-cols-3">
              {displayProducts.map((product, index) => (
                <article key={product.id} className="group flex flex-col bg-shop-paper p-4 sm:p-5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e4da]">
                    <Image src={product.image} alt={product.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                    <span className="absolute left-3 top-3 bg-shop-paper px-3 py-2 text-[9px] font-bold tracking-[0.16em] text-shop-ink">{product.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-2 pt-5">
                    <div className="flex items-start justify-between gap-3"><h3 className="shop-display text-3xl leading-none">{product.name}</h3><span className="shrink-0 text-[9px] font-bold tracking-[0.12em] text-shop-muted">{String(index + 1).padStart(2, "0")}</span></div>
                    <p className="mt-4 flex-1 text-sm leading-6 text-shop-muted">{product.description}</p>
                    <div className="mt-6 border-t border-shop-border pt-4">
                      {product.price !== null && product.price !== undefined && (
                        <p className="mb-2 text-sm font-semibold text-shop-ink">KSh {Number(product.price).toLocaleString("en-KE")}</p>
                      )}
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-shop-muted">{product.availability}</p>
                      {product.price !== null && product.price !== undefined && typeof product.id === "string" && /^[0-9a-f-]{36}$/i.test(product.id) ? <AddToBasketButton product={{ id: product.id, name: product.name, price: Number(product.price), image: product.image }} /> : <Link href="/support#merch-enquiry" className="mt-4 inline-flex w-full justify-center border border-shop-ink px-4 py-3 text-sm font-semibold transition-colors hover:bg-shop-ink hover:text-shop-paper">Enquire about this item</Link>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container grid gap-8 py-20 md:py-28 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="shop-eyebrow text-[#F3EDE2]/45">02 — More than a purchase</p><h2 className="shop-display mt-6 max-w-5xl text-[clamp(3.25rem,6vw,6rem)] leading-[0.86]">Every board can open a door.</h2><p className="mt-6 max-w-2xl text-base leading-7 text-[#F3EDE2]/60">Looking to supply equipment to a school, sponsor a set or discuss a bulk order? Tell us what you have in mind and we can work through the details.</p></div>
            <div className="flex flex-wrap gap-3"><Link href="/support#donate" className="inline-flex bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-colors hover:bg-white">Fund equipment</Link><Link href="/schools" className="inline-flex border border-[#F3EDE2]/30 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">School programmes</Link></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
