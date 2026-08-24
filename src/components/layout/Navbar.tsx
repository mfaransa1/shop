"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation, navigationActions } from "@/data/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Main navigation"
        className="border-b border-shop-border/70 bg-shop-paper/90 backdrop-blur-md"
      >
        <div className="shop-container flex h-20 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="SHoP home"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex h-10 w-10 items-center justify-center">
              <img
                src="/images/brand/logo-mark.svg"
                alt=""
                className="h-full w-full object-contain"
              />
            </span>

            <span className="hidden sm:block">
              <span className="block text-sm font-bold tracking-[0.18em]">
                SHoP
              </span>
              <span className="block text-[9px] font-semibold tracking-[0.16em] text-shop-muted">
                SOUTHSIDE HOUSE OF PAWNS
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium transition-colors duration-300 hover:text-shop-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/support"
              className="px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-60"
            >
              Support
            </Link>
            <Link
              href="/join"
              className="group inline-flex items-center gap-3 bg-[#111111] px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="!text-[#F3EDE2]">Join SHoP</span>

              <span
                aria-hidden="true"
                className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={`block h-px w-6 bg-shop-ink transition-transform duration-300 ${
                menuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-shop-ink transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-shop-ink transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden border-t border-shop-border/70 bg-shop-paper transition-all duration-500 ${
            menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          } lg:hidden`}
        >
          <div className="shop-container py-8">
            <div className="flex flex-col">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-shop-border py-5 text-2xl font-medium"
                >
                  <span className="mr-4 text-xs font-semibold text-shop-muted">
                    0{index + 1}
                  </span>
                  {item.label}
                </Link>
              ))}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {navigationActions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="bg-shop-ink px-5 py-4 text-center text-sm font-semibold text-shop-cream"
                  >
                    {item.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}