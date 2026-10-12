import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

const communityPaths = [
  {
    number: "01",
    title: "Find a game",
    label: "PLAY",
    description:
      "See which members are online and challenge someone to a game. When a challenge is accepted, the live game can open directly.",
    href: "/community/players",
    action: "Browse online players",
  },
  {
    number: "02",
    title: "Learn at your pace",
    label: "LEARN",
    description:
      "Build your understanding through chess lessons, practice and guided activities, whether you are learning the basics or refining your play.",
    href: "/learn",
    action: "Explore learning",
  },
  {
    number: "03",
    title: "Follow the standings",
    label: "PROGRESS",
    description:
      "Keep up with the club leaderboard and follow competitive progress based on the ratings and results recorded by the platform.",
    href: "/community/leaderboard",
    action: "View leaderboard",
  },
  {
    number: "04",
    title: "Meet at the board",
    label: "IN PERSON",
    description:
      "Explore club events and tournaments for opportunities to learn, play and connect beyond an online game.",
    href: "/events",
    action: "Explore events",
  },
];

const waysToContribute = [
  {
    title: "Join as a player",
    description: "Create an account, build your chess experience and take part in the community.",
    href: "/join",
    action: "Join SHoP",
  },
  {
    title: "Support the work",
    description: "Help make chess more accessible and support the growth of a community rooted in Kawangware.",
    href: "/support",
    action: "Ways to support",
  },
  {
    title: "Bring chess to learners",
    description: "Explore opportunities for schools and learning communities to connect with SHoP.",
    href: "/schools",
    action: "Explore school chess",
  },
];

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[120px]" />
            <div className="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#F3EDE2]/[0.025] blur-[130px]" />
          </div>

          <div className="shop-container relative grid min-h-[82vh] items-center gap-12 py-28 md:py-36 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="shop-eyebrow text-[#F3EDE2]/55">Southside House of Pawns · Community</p>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="shop-display mt-8 max-w-4xl text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.82]">
                  The board is bigger than the game.
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-8 max-w-xl text-base leading-7 text-[#F3EDE2]/65 sm:text-lg sm:leading-8">
                  SHoP brings chess, learning and people together in Kawangware, Nairobi. Play a game, improve your skills, follow club activity or find a way to take part in the community.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/join" className="inline-flex min-h-12 items-center justify-center bg-[#F3EDE2] px-6 py-3 text-sm font-semibold !text-[#111111] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3EDE2]">
                    Join SHoP
                  </Link>
                  <Link href="/community/players" className="inline-flex min-h-12 items-center justify-center border border-[#F3EDE2]/30 px-6 py-3 text-sm font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2] hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3EDE2]">
                    Find players
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="mt-12 border-t border-[#F3EDE2]/15 pt-5 text-[10px] font-bold tracking-[0.18em] text-[#F3EDE2]/45">
                  KAWANGWARE · NAIROBI · KENYA <span className="mx-2">/</span> KILA HATUA INA MAANA
                </div>
              </Reveal>
            </div>

            <Reveal delay={160}>
              <div className="relative mx-auto w-full max-w-[560px]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                  <Image
                    src="/images/sessions/session-02.jpg"
                    alt="Chess boards and community play at SHoP"
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-white/65">PLAY · LEARN · CONNECT</p>
                    <p className="shop-display mt-3 max-w-md text-3xl leading-tight text-white sm:text-4xl">Every move is a chance to grow.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-shop-cream">
          <div className="shop-container py-20 md:py-28">
            <Reveal>
              <div className="grid gap-8 border-b border-shop-border pb-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
                <p className="shop-eyebrow text-shop-muted">A place to take part</p>
                <div>
                  <h2 className="shop-display max-w-4xl text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.88]">Find your next move.</h2>
                  <p className="mt-6 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    Community means more than watching from the sidelines. Use the platform to meet players, practise, track progress and discover opportunities to connect over the game.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-0 md:grid-cols-2 md:gap-x-10">
              {communityPaths.map((item, index) => (
                <Reveal key={item.href} delay={index * 70}>
                  <article className="grid gap-4 border-b border-shop-border py-8 sm:grid-cols-[56px_1fr] sm:gap-6">
                    <span className="pt-1 text-[10px] font-bold tracking-[0.18em] text-shop-muted">{item.number}</span>
                    <div>
                      <p className="shop-eyebrow text-shop-muted">{item.label}</p>
                      <h3 className="shop-display mt-3 text-3xl leading-tight sm:text-4xl">{item.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-shop-muted">{item.description}</p>
                      <Link href={item.href} className="mt-5 inline-flex min-h-10 items-center border-b border-shop-ink/35 pb-1 text-sm font-semibold transition-colors hover:border-shop-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shop-ink">
                        {item.action}
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-20 md:py-28">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
                <p className="shop-eyebrow text-[#F3EDE2]/45">Beyond the board</p>
                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.88]">A community grows when people show up.</h2>
                  <p className="mt-6 max-w-2xl text-base leading-7 text-[#F3EDE2]/60 sm:text-lg sm:leading-8">
                    Whether you are a player, parent, coach, volunteer, school or supporter, there are different ways to help chess create meaningful opportunities. Start with the path that fits you.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-12 border-t border-[#F3EDE2]/15">
              {waysToContribute.map((item, index) => (
                <Reveal key={item.href} delay={index * 80}>
                  <div className="grid gap-4 border-b border-[#F3EDE2]/15 py-7 sm:grid-cols-[0.8fr_1.2fr_auto] sm:items-center sm:gap-8">
                    <h3 className="shop-display text-2xl sm:text-3xl">{item.title}</h3>
                    <p className="max-w-xl text-sm leading-6 text-[#F3EDE2]/55">{item.description}</p>
                    <Link href={item.href} className="inline-flex min-h-10 w-fit items-center border-b border-[#F3EDE2]/35 pb-1 text-sm font-semibold text-[#F3EDE2] transition-colors hover:border-[#F3EDE2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3EDE2]">
                      {item.action}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-shop-cream">
          <div className="shop-container py-24 md:py-32">
            <Reveal>
              <p className="shop-eyebrow text-shop-muted">Your place at the board</p>
              <h2 className="shop-display mt-7 max-w-6xl text-[clamp(3.5rem,8vw,8rem)] leading-[0.82]">Make your next move count.</h2>
              <p className="mt-7 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                Start playing, keep learning and meet others who share your interest in chess. Kila hatua ina maana.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/join" className="inline-flex min-h-12 items-center justify-center bg-[#111111] px-6 py-3 text-sm font-semibold !text-[#F3EDE2] transition-colors hover:bg-[#333333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shop-ink">
                  Join SHoP
                </Link>
                <Link href="/tournaments" className="inline-flex min-h-12 items-center justify-center border border-shop-ink/25 px-6 py-3 text-sm font-semibold transition-colors hover:bg-shop-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shop-ink">
                  Explore tournaments
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
