import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Reveal from "@/components/animations/Reveal";

const principles = [
  {
    number: "01",
    title: "Think with intention",
    text: "Chess invites us to pause, recognise patterns, weigh possibilities and take responsibility for our decisions.",
  },
  {
    number: "02",
    title: "Learn by doing",
    text: "Progress comes through practice: studying ideas, solving positions, playing games and reflecting on what happened.",
  },
  {
    number: "03",
    title: "Grow together",
    text: "A game can start a conversation between people with different experiences. Respect, patience and fair play matter at every level.",
  },
  {
    number: "04",
    title: "Make room for possibility",
    text: "We want more young people to encounter chess, develop confidence and discover what consistent effort can make possible.",
  },
];

const pathways = [
  {
    label: "LEARN",
    title: "Build your understanding",
    text: "Explore learning material and practise the ideas that help you make better moves.",
    href: "/learn",
    link: "Explore learning",
  },
  {
    label: "PLAY",
    title: "Take a seat at the board",
    text: "Meet other players, explore the community and take part in chess beyond solo practice.",
    href: "/community",
    link: "Visit the community",
  },
  {
    label: "COMPETE",
    title: "Follow club competitions",
    text: "Find tournament and event information as SHoP's chess activities develop.",
    href: "/tournaments",
    link: "Explore tournaments",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-shop-cream">
          <div aria-hidden="true" className="shop-hero-bg">
            <div className="shop-hero-board">
              {Array.from({ length: 64 }, (_, index) => <span key={index} />)}
            </div>
          </div>
          <div className="shop-container relative z-10 py-28 md:py-40 lg:py-48">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="shop-hero-line h-px w-10 origin-left bg-shop-ink/30" />
                <p className="shop-eyebrow text-shop-muted">About Southside House of Pawns</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="shop-display mt-8 max-w-7xl text-[clamp(3.8rem,9vw,9.5rem)] leading-[0.84]">
                The board is
                <br />
                bigger than
                <br />
                <span className="relative inline-block">the game<span aria-hidden="true" className="shop-hero-underline absolute bottom-[0.02em] left-0 h-[2px] w-full bg-shop-ink/25" /></span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-12 grid gap-8 border-t border-shop-ink/10 pt-7 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">KAWANGWARE · NAIROBI · KENYA</p>
                <div className="max-w-3xl">
                  <p className="text-lg leading-8 text-shop-muted md:text-xl md:leading-9">
                    Southside House of Pawns (SHoP) is a chess community rooted in Kawangware. We use the game as a way to learn, practise thoughtful decision-making, meet others and make more room for young people to grow.
                  </p>
                  <p className="mt-5 text-sm font-semibold tracking-wide text-shop-ink">Kila hatua ina maana.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-shop-paper">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">01 — Why SHoP</p>
                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.88]">A game worth taking beyond the board.</h2>
                  <p className="mt-8 max-w-3xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Chess gives us a shared language. A position can teach patience; a difficult game can teach resilience; a thoughtful opponent can teach respect. SHoP is building a place where people can discover the game, keep learning and connect through it.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="overflow-hidden bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <p className="shop-eyebrow text-shop-muted">02 — What guides us</p>
                <h2 className="shop-display max-w-5xl text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.88]">Small moves. Lasting lessons.</h2>
              </div>
            </Reveal>
            <div className="mt-16 border-t border-shop-border">
              {principles.map((principle, index) => (
                <Reveal key={principle.number} delay={index * 70}>
                  <article className="group grid gap-4 border-b border-shop-border py-8 md:grid-cols-[80px_0.9fr_1.1fr] md:items-center md:gap-8 md:py-10">
                    <span className="text-xs font-bold tracking-[0.2em] text-shop-muted">{principle.number}</span>
                    <h3 className="shop-display text-3xl leading-tight transition-transform duration-300 group-hover:translate-x-1 md:text-4xl">{principle.title}</h3>
                    <p className="max-w-xl text-sm leading-7 text-shop-muted md:text-base">{principle.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-shop-paper">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">03 — Find your next move</p>
              <h2 className="shop-display mt-6 max-w-5xl text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.88]">There is more than one way to begin.</h2>
            </Reveal>
            <div className="mt-14 grid gap-0 border-t border-shop-border md:grid-cols-3 md:divide-x md:divide-shop-border">
              {pathways.map((pathway, index) => (
                <Reveal key={pathway.label} delay={index * 90}>
                  <article className="flex h-full flex-col border-b border-shop-border py-8 md:border-b-0 md:px-6 md:py-8 md:first:pl-0 md:last:pr-0">
                    <p className="shop-eyebrow text-shop-muted">{pathway.label}</p>
                    <h3 className="shop-display mt-5 text-3xl leading-tight">{pathway.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-shop-muted">{pathway.text}</p>
                    <Link href={pathway.href} className="mt-7 inline-flex w-fit border-b border-shop-ink pb-2 text-sm font-semibold text-shop-ink transition-colors hover:text-shop-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shop-ink">
                      {pathway.link}
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <p className="shop-eyebrow text-[#F3EDE2]/50">04 — The future we are working towards</p>
              <h2 className="shop-display mt-8 max-w-7xl text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.84]">More access.<br />More learning.<br />More possibility.</h2>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-10 grid gap-8 border-t border-[#F3EDE2]/15 pt-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
                <p className="max-w-2xl text-base leading-8 text-[#F3EDE2]/65 sm:text-lg">
                  Our ambition is to make chess more accessible, support a culture of learning and create opportunities for people to participate. We will measure our progress through the work we do, not promises alone.
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/45">Kila hatua ina maana.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">Your move</p>
              <h2 className="shop-display mt-7 max-w-6xl text-[clamp(3.5rem,8vw,8rem)] leading-[0.84]">Help shape what comes next.</h2>
              <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">Whether you want to apply for membership, support the work or simply explore chess with the community, there is a place to start.</p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/join" className="inline-flex min-h-12 items-center justify-center bg-[#111111] px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-colors hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shop-ink">Apply for membership</Link>
                <Link href="/support" className="inline-flex min-h-12 items-center justify-center border border-shop-ink/25 px-6 py-4 text-sm font-semibold text-shop-ink transition-colors hover:bg-shop-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shop-ink">Support SHoP</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
