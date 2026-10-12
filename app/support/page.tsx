import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";
import DonationCheckout from "@/components/support/DonationCheckout";

const supportOptions = [
  {
    number: "01",
    title: "Fund access",
    description: "Help make boards, pieces, clocks and learning opportunities more accessible to players.",
  },
  {
    number: "02",
    title: "Back learning",
    description: "Support practice sessions, learning resources and a welcoming place to develop chess skills.",
  },
  {
    number: "03",
    title: "Strengthen competition",
    description: "Help make organised play, tournament opportunities and the equipment around them possible.",
  },
  {
    number: "04",
    title: "Give your time",
    description: "Volunteer a skill, mentor a learner, help at an event or introduce SHoP to a potential partner.",
  },
];

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[130px] animate-[support-orb_14s_ease-in-out_infinite]" />
            <div className="absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#F3EDE2]/[0.025] blur-[140px] animate-[support-orb-reverse_17s_ease-in-out_infinite]" />
          </div>
          <div className="shop-container relative z-10 grid min-h-[82vh] items-center gap-14 py-32 md:py-40 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="shop-eyebrow text-[#F3EDE2]/55">Support Southside House of Pawns</p>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="shop-display mt-8 max-w-5xl text-[clamp(4rem,9vw,9rem)] leading-[0.82]">Help make the next move.</h1>
              </Reveal>
              <Reveal delay={220}>
                <p className="mt-9 max-w-xl text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">
                  SHoP is building a chess community rooted in Kawangware, Nairobi. Financial contributions, equipment, volunteering and partnerships can help more people learn, play and belong.
                </p>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="#donate" className="inline-flex bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-colors hover:bg-white">Explore donations</Link>
                  <Link href="/merch" className="inline-flex border border-[#F3EDE2]/35 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">Shop SHoP merchandise</Link>
                </div>
              </Reveal>
              <p className="mt-12 border-t border-[#F3EDE2]/15 pt-5 text-[10px] font-bold tracking-[0.2em] text-[#F3EDE2]/40">KAWANGWARE · NAIROBI · KILA HATUA INA MAANA</p>
            </div>
            <Reveal delay={180}>
              <div className="relative mx-auto w-full max-w-[560px]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                  <Image src="/images/sessions/session-02.jpg" alt="Chess session at SHoP" fill priority sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-white/65">THE BOARD IS BIGGER THAN THE GAME</p>
                    <p className="shop-display mt-3 text-3xl leading-tight text-white sm:text-4xl">A contribution can become an opportunity.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-shop-cream">
          <div className="shop-container py-20 md:py-28">
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
              <div><p className="shop-eyebrow text-shop-muted">01 — What your support helps</p></div>
              <div>
                <h2 className="shop-display max-w-5xl text-[clamp(3rem,6vw,6rem)] leading-[0.88]">Support the people and the possibilities around the board.</h2>
                <p className="mt-7 max-w-3xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">Contributions are intended to strengthen access to chess, learning resources, equipment and community activities. We will share specific funding needs and updates as they are confirmed.</p>
              </div>
            </div>
            <div className="mt-14 border-t border-shop-border">
              {supportOptions.map((item) => (
                <article key={item.number} className="grid gap-4 border-b border-shop-border py-7 md:grid-cols-[70px_0.75fr_1.25fr] md:items-start md:gap-8 md:py-9">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-shop-muted">{item.number}</span>
                  <h3 className="shop-display text-3xl">{item.title}</h3>
                  <p className="max-w-2xl text-sm leading-7 text-shop-muted sm:text-base">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="donate" className="scroll-mt-20 bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div><p className="shop-eyebrow text-[#F3EDE2]/45">02 — Make a donation</p><p className="mt-6 max-w-xs text-sm leading-6 text-[#F3EDE2]/45">Every amount matters. Choose a contribution level that works for you.</p></div>
              <div>
                <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,7vw,7rem)] leading-[0.84]">Give what you can.</h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-[#F3EDE2]/60 sm:text-lg sm:leading-8">Choose a one-time contribution and approve the secure M-Pesa prompt on your phone. Your donation is recorded only after server-side payment verification.</p>
                <div className="mt-8">
                  <DonationCheckout />
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/merch" className="inline-flex border border-[#F3EDE2]/30 px-5 py-3 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">Explore equipment and merch</Link>
                  <Link href="/schools" className="inline-flex border border-[#F3EDE2]/30 px-5 py-3 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">Explore school programmes</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-shop-cream">
          <div className="shop-container py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div><p className="shop-eyebrow text-shop-muted">03 — Equipment and merchandise</p></div>
              <div>
                <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6rem)] leading-[0.86]">Back the game. Take a piece of it home.</h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">Explore chessboards, pieces, clocks and SHoP-branded items. Product availability and prices will be confirmed before an order is accepted.</p>
                <Link href="/merch" className="mt-8 inline-flex bg-[#111111] px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-colors hover:bg-[#292929]">Explore SHoP merch</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="shop-eyebrow text-[#F3EDE2]/45">04 — Partner, volunteer, contribute</p>
                <h2 className="shop-display mt-6 max-w-5xl text-[clamp(3rem,6vw,6rem)] leading-[0.88]">There are many ways to help build the next move.</h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#F3EDE2]/60">Schools, organisations, businesses, volunteers and individuals can help with equipment, learning, events or specialist skills.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/join" className="inline-flex bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-colors hover:bg-white">Apply to join SHoP</Link>
                <Link href="/community" className="inline-flex border border-[#F3EDE2]/30 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">Meet the community</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
