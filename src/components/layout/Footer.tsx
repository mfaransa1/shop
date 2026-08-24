"use client";
import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Learn", href: "/learn" },
      { label: "Community", href: "/community" },
      { label: "Schools", href: "/schools" },
      { label: "Tournaments", href: "/tournaments" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Join SHoP", href: "/join" },
      { label: "Support us", href: "/support" },
      { label: "Volunteer", href: "/join" },
      { label: "Partner with us", href: "/support" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#111111] text-[#F3EDE2]">
      {/* Main footer */}
      <div className="shop-container">
        <div className="border-b border-[#F3EDE2]/15 py-20 md:py-28 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            {/* Brand statement */}
            <div>
              <Link
                href="/"
                className="group inline-flex items-center gap-4"
              >
                <span className="flex h-12 w-12 items-center justify-center">
                  <Image
                    src="/images/brand/logo-mark.svg"
                    alt="SHoP"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </span>

                <span>
                  <span className="block text-sm font-bold tracking-[0.18em]">
                    SHoP
                  </span>

                  <span className="mt-1 block text-[9px] font-semibold tracking-[0.16em] text-[#F3EDE2]/45">
                    SOUTHSIDE HOUSE OF PAWNS
                  </span>
                </span>
              </Link>

              <h2 className="shop-display mt-12 max-w-4xl text-[clamp(4rem,8vw,8.5rem)] leading-[0.82]">
                The board is bigger than the game.
              </h2>

              <div className="mt-10 flex items-center gap-4">
                <span className="h-px w-12 bg-[#F3EDE2]/30" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/45">
                  Kila hatua ina maana
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="grid gap-12 sm:grid-cols-2 lg:pt-16">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/35">
                    {group.title}
                  </p>

                  <nav className="mt-6 flex flex-col items-start">
                    {group.links.map((link) => (
                      <Link
                        key={`${group.title}-${link.label}`}
                        href={link.href}
                        className="group/link flex items-center gap-3 py-2 text-sm text-[#F3EDE2]/65 transition-colors duration-300 hover:text-[#F3EDE2]"
                      >
                        <span>{link.label}</span>

                        <span className="opacity-0 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:opacity-100">
                          →
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* CTA strip */}
          <div className="mt-20 border-t border-[#F3EDE2]/15 pt-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Ready to make your move?
                </p>

                <p className="mt-2 text-sm text-[#F3EDE2]/40">
                  Join the SHoP community in Kawangware.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/join"
                  className="group inline-flex items-center gap-4 bg-[#F3EDE2] px-6 py-4 text-sm font-semibold text-[#111111] transition-all duration-300 hover:-translate-y-1"
                >
                  <span>Join SHoP</span>

                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>

                <Link
                  href="/support"
                  className="inline-flex items-center gap-4 border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition-colors duration-300 hover:border-[#F3EDE2]/60"
                >
                  Support SHoP
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 py-8 text-[10px] font-semibold tracking-[0.12em] text-[#F3EDE2]/35 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <span>© {new Date().getFullYear()} SHoP</span>
            <span className="hidden sm:block">·</span>
            <span>Southside House of Pawns</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <span>KAWANGWARE · NAIROBI · KENYA</span>

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="group flex items-center gap-2 text-left transition-colors duration-300 hover:text-[#F3EDE2]"
            >
              BACK TO TOP
              <span className="transition-transform duration-300 group-hover:-translate-y-1">
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}