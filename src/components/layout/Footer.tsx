"use client";

import Link from "next/link";
import Image from "next/image";

import SocialLinks from "@/components/layout/SocialLinks";

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
      <div className="shop-container">
        {/* Main footer */}
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

          {/* Social links */}
          <div className="mt-20 border-t border-[#F3EDE2]/15 pt-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3EDE2]/35">
                  Follow SHoP
                </p>

                <p className="mt-2 text-sm text-[#F3EDE2]/40">
                  Follow the journey beyond the board.
                </p>
              </div>

              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#F3EDE2]/15 py-8">
          <div className="flex flex-col gap-5 text-[10px] font-semibold tracking-[0.12em] text-[#F3EDE2]/35 md:flex-row md:items-center md:justify-between">
            {/* Copyright + developer credit */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span>© {new Date().getFullYear()} SHoP</span>

              <span>·</span>

              <span>Southside House of Pawns</span>

              <span>·</span>

              <span>
                Built by{" "}
                <a
                  href="https://kurarinsolutions.co.ke/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#F3EDE2]/50 transition-colors duration-300 hover:text-[#F3EDE2]"
                >
                  Kurarin Solutions
                </a>
              </span>
            </div>

            {/* Location + back to top */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6 md:items-center">
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
      </div>
    </footer>
  );
}