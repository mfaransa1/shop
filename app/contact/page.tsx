import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

export const metadata: Metadata = {
  title: "Contact SHoP",
  description: "Contact Southside House of Pawns in Kawangware, Nairobi about membership, chess sessions, schools, partnerships and support.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact SHoP | Southside House of Pawns",
    description: "Talk to SHoP about chess, membership, schools and partnerships in Kawangware, Nairobi.",
    type: "website",
  },
};

export default function ContactPage() {
  const whatsappNumber = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP ?? "").replace(/[^0-9]/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello SHoP, I would like to get in touch.")}` : null;

  return (
    <>
      <Navbar />
      <main className="bg-shop-cream pt-20 text-shop-ink">
        <section className="bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container grid min-h-[48vh] items-end gap-8 py-20 md:py-28 lg:grid-cols-[1fr_0.65fr]">
            <Reveal>
              <p className="shop-eyebrow text-[#F3EDE2]/55">Southside House of Pawns · Contact</p>
              <h1 className="shop-display mt-7 max-w-4xl text-[clamp(3.7rem,8vw,8rem)] leading-[0.84]">Let&apos;s talk chess.</h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-lg text-base leading-7 text-[#F3EDE2]/65">Whether you want to join, bring chess to a school, partner with SHoP or learn more about our work, we would be glad to hear from you.</p>
            </Reveal>
          </div>
        </section>
        <section className="shop-container grid gap-12 py-16 md:py-24 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="shop-eyebrow text-shop-muted">Get in touch</p>
            <h2 className="shop-display mt-5 text-4xl sm:text-5xl">A conversation can start the next move.</h2>
            <p className="mt-6 text-sm leading-7 text-shop-muted">SHoP is based in Kawangware, Nairobi, Kenya.</p>
          </div>
          <div className="grid gap-px border border-shop-border bg-shop-border sm:grid-cols-2">
            <div className="bg-shop-paper p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-shop-muted">Email</p>
              <h3 className="shop-display mt-4 text-2xl">Write to SHoP</h3>
              <a href="mailto:shopchesske@gmail.com" className="mt-5 inline-flex text-sm font-semibold underline underline-offset-4">shopchesske@gmail.com</a>
            </div>
            <div className="bg-shop-paper p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-shop-muted">WhatsApp</p>
              <h3 className="shop-display mt-4 text-2xl">Start a conversation</h3>
              {whatsappUrl ? (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex border border-shop-ink px-4 py-3 text-sm font-semibold transition-colors hover:bg-shop-ink hover:text-shop-cream">Message SHoP on WhatsApp</a>
              ) : (
                <p className="mt-5 text-sm leading-6 text-shop-muted">WhatsApp contact will appear here once the official SHoP number is configured.</p>
              )}
            </div>
            <div className="bg-shop-paper p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-shop-muted">Schools and partnerships</p>
              <h3 className="shop-display mt-4 text-2xl">Bring chess to learners</h3>
              <Link href="/schools" className="mt-5 inline-flex text-sm font-semibold underline underline-offset-4">Explore school programmes</Link>
            </div>
            <div className="bg-shop-paper p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-shop-muted">Membership</p>
              <h3 className="shop-display mt-4 text-2xl">Find your place at the board</h3>
              <Link href="/join" className="mt-5 inline-flex text-sm font-semibold underline underline-offset-4">Join SHoP</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
