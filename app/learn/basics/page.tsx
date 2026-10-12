import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BeginnerLessons from "@/components/learn/BeginnerLessons";

export const metadata: Metadata = { title: "Beginner learning path", description: "Build your chess foundations with SHoP's beginner learning path." };

export default function BeginnerPathPage() {
  return <><Navbar /><main className="min-h-screen bg-shop-cream pt-20 text-shop-ink"><section className="bg-[#111111] text-[#F3EDE2]"><div className="shop-container py-20 md:py-28"><p className="shop-eyebrow text-[#F3EDE2]/45">SHoP Chess Education · Path 01</p><h1 className="shop-display mt-6 max-w-5xl text-6xl leading-[0.88] sm:text-8xl">Start with<br />the basics.</h1><p className="mt-8 max-w-2xl text-base leading-8 text-[#F3EDE2]/55">Four short lessons to help you understand the board, move the pieces legally, recognise check, and make better opening decisions.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/dashboard" className="bg-[#F3EDE2] px-5 py-4 text-xs font-bold !text-[#111111]">View my progress →</Link><Link href="/learn#daily-puzzle" className="border border-[#F3EDE2]/25 px-5 py-4 text-xs font-semibold">Try a puzzle</Link></div></div></section><section className="shop-container py-16 md:py-24"><BeginnerLessons /></section></main><Footer /></>;
}
