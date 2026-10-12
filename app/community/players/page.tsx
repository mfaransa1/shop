import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OnlinePlayersDirectory from "@/components/community/OnlinePlayersDirectory";
import OnlinePresence from "@/components/community/OnlinePresence";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Players online | SHoP" };
export const dynamic = "force-dynamic";

export default async function OnlinePlayersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/community/players");
  return <><Navbar /><OnlinePresence /><main className="min-h-screen bg-shop-cream pt-20 text-shop-ink"><section className="bg-[#111111] text-[#F3EDE2]"><div className="shop-container py-16 md:py-24"><p className="shop-eyebrow text-[#F3EDE2]/50">SHoP Community · Find a game</p><h1 className="shop-display mt-5 text-6xl sm:text-7xl">Who’s around?</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-[#F3EDE2]/65">Find players who are active now, open their profile, and send a challenge without needing to know their exact display name.</p></div></section><section className="shop-container py-12 md:py-16"><OnlinePlayersDirectory /><div className="mt-10 flex flex-wrap gap-3"><Link href="/dashboard/challenges" className="border border-shop-ink px-5 py-3 text-sm font-semibold hover:bg-white">Your challenge invitations →</Link><Link href="/dashboard" className="border border-shop-border px-5 py-3 text-sm font-semibold hover:bg-white">Back to dashboard</Link></div></section></main><Footer /></>;
}
