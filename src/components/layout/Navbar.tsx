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
        className="border-b border-shop-border/70 bg-shop-paper/95"
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
              className="inline-flex items-center bg-[#111111] px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-opacity duration-300 hover:opacity-80"
            >
              <span className="!text-[#F3EDE2]">Join SHoP</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="shop-mobile-menu"
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

        {/* Mobile menu: viewport-height panel with its own scroll area */}
        <div
          id="shop-mobile-menu"
          aria-label="Mobile navigation links"
          aria-hidden={!menuOpen}
          className={`fixed inset-x-0 top-20 bottom-0 z-[60] h-[calc(100dvh-5rem)] overflow-x-hidden overflow-y-auto overscroll-y-contain border-t border-shop-border/70 bg-shop-paper transition-all duration-300 lg:hidden ${
            menuOpen
              ? "visible translate-y-0 opacity-100 pointer-events-auto"
              : "invisible -translate-y-2 pointer-events-none opacity-0"
          }`}
        >
          <div className="shop-container pb-8 pt-3">
            <div className="flex flex-col">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-shop-border py-3 text-lg font-medium leading-snug"
                >
                  <span className="mr-3 inline-block min-w-6 text-xs font-semibold text-shop-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              ))}

              <div className="mt-5 flex flex-col gap-2 pb-4 sm:flex-row">
                {navigationActions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={() => setMenuOpen(false)}
                    className="bg-shop-ink px-4 py-3 text-center text-sm font-semibold !text-shop-cream"
                  >
                    {item.label}
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