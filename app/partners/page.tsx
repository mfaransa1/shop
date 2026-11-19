import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";
import PartnershipEnquiryForm from "@/components/partnerships/PartnershipEnquiryForm";

export const metadata: Metadata = {
  title: "Partner with SHoP | Southside House of Pawns",
  description: "Explore sponsorship and organisational partnerships with Southside House of Pawns, supporting chess, learning and youth development in Kawangware, Nairobi.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Partner with SHoP | Southside House of Pawns",
    description: "Start a conversation about sponsorship, equipment, events and youth development partnerships with SHoP.",
    type: "website",
    images: [{ url: "/images/optimized/chessbo3.webp", width: 1200, height: 1500, alt: "Chess session at SHoP" }],
  },
};

const partnershipAreas = [
  ["01", "Equip the game", "Support chessboards, pieces, clocks, learning materials and the practical resources that make regular play possible."],
  ["02", "Back young people", "Contribute to access, learning opportunities and positive youth development through chess."],
  ["03", "Strengthen events", "Explore support for tournaments, school activities, community events and the experiences around them."],
  ["04", "Share expertise", "Bring professional skills, services, mentoring or organisational reach to a community-led initiative."],
];

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-[78vh] overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#F3EDE2]/[0.045] blur-[130px] animate-[support-orb_14s_ease-in-out_infinite]" />
            <div className="absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[140px] animate-[support-orb-reverse_17s_ease-in-out_infinite]" />
            <div className="shop-hero-board absolute inset-0 opacity-[0.08]" />
          </div>
          <div className="shop-container relative z-10 grid min-h-[78vh] items-center gap-12 py-28 md:py-36 lg:grid-cols-[1.1fr_0.8fr]">
            <div>
              <Reveal><p className="shop-eyebrow text-[#F3EDE2]/50">Partnerships · Southside House of Pawns</p></Reveal>
              <Reveal delay={100}><h1 className="shop-display mt-8 max-w-5xl text-[clamp(4rem,9vw,9rem)] leading-[0.82]">Make room for the next move.</h1></Reveal>
              <Reveal delay={220}><p className="mt-8 max-w-xl text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">We welcome conversations with businesses, organisations and individuals who want to help make chess, learning and opportunity more accessible in Kawangware and beyond.</p></Reveal>
              <Reveal delay={320}><div className="mt-9 flex flex-wrap gap-3"><Link href="#enquiry" className="inline-flex bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-colors hover:bg-white">Discuss a partnership</Link><Link href="/schools" className="inline-flex border border-[#F3EDE2]/35 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">School programmes</Link></div></Reveal>
              <p className="mt-12 border-t border-[#F3EDE2]/15 pt-5 text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/40">KAWANGWARE · NAIROBI · KILA HATUA INA MAANA</p>
            </div>
            <Reveal delay={160}>
              <div className="relative mx-auto w-full max-w-[520px]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                  <Image src="/images/optimized/chessbo3.webp" alt="Young people taking part in a chess session" fill priority sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <p className="shop-display absolute bottom-7 left-7 right-7 text-3xl leading-tight text-white sm:text-4xl">The board is bigger than the game.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-shop-cream">
          <div className="shop-container py-20 md:py-28">
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
              <p className="shop-eyebrow text-shop-muted">01 — Ways to contribute</p>
              <div><h2 className="shop-display max-w-5xl text-[clamp(3rem,6vw,6rem)] leading-[0.88]">Partnership should create practical value.</h2><p className="mt-7 max-w-3xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">We are interested in thoughtful, transparent collaborations. The right approach depends on the organisation, the need and what can realistically be delivered together.</p></div>
            </div>
            <div className="mt-14 border-t border-shop-border">{partnershipAreas.map(([number,title,text])=><article key={number} className="grid gap-4 border-b border-shop-border py-8 md:grid-cols-[70px_0.75fr_1.25fr] md:gap-8"><span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">{number}</span><h3 className="shop-display text-3xl">{title}</h3><p className="max-w-2xl text-sm leading-7 text-shop-muted sm:text-base">{text}</p></article>)}</div>
          </div>
        </section>

        <section id="enquiry" className="scroll-mt-20 bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-20 md:py-28">
            <div className="mb-10 grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"><p className="shop-eyebrow text-[#F3EDE2]/45">02 — Start a partnership conversation</p><div><h2 className="shop-display max-w-5xl text-[clamp(3rem,6vw,6rem)] leading-[0.88]">What could we make possible?</h2><p className="mt-6 max-w-2xl text-sm leading-7 text-[#F3EDE2]/55 sm:text-base">Use this dedicated form for sponsorship, equipment, event support, professional expertise or a longer-term organisational partnership. This is an enquiry only, not a funding pledge or binding agreement.</p></div></div>
            <PartnershipEnquiryForm kind="sponsor" />
          </div>
        </section>

        <section className="bg-shop-cream"><div className="shop-container flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between"><div><p className="shop-eyebrow text-shop-muted">Have a different question?</p><h2 className="shop-display mt-3 text-3xl sm:text-4xl">Talk to the SHoP team.</h2></div><Link href="/contact" className="inline-flex w-fit border border-shop-ink px-6 py-4 text-sm font-semibold transition-colors hover:bg-shop-paper">Contact SHoP</Link></div></section>
      </main>
      <Footer />
    </>
  );
}
