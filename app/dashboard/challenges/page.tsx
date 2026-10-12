import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import FriendChallenges from "@/components/community/FriendChallenges";
import OnlinePresence from "@/components/community/OnlinePresence";

export const metadata: Metadata = { title: "Friend challenges | SHoP" };
export const dynamic = "force-dynamic";

export default async function FriendChallengesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard/challenges");
  return <><Navbar /><OnlinePresence /><main className="min-h-screen bg-shop-cream pt-20 text-shop-ink"><section className="bg-[#111111] !text-[#F3EDE2]"><div className="shop-container py-14 md:py-20"><p className="shop-eyebrow !text-[#F3EDE2]/50">Community · Friendly competition</p><h1 className="shop-display mt-5 text-5xl sm:text-7xl">Your next match.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-[#F3EDE2]/65">Challenge a fellow SHoP player, accept invitations, and build your chess community one step at a time.</p></div></section><section className="shop-container py-10 md:py-14"><div className="mb-8 flex flex-wrap gap-3"><Link href="/dashboard" className="border border-shop-border px-4 py-3 text-sm font-semibold">← Dashboard</Link><Link href="/community/leaderboard" className="border border-shop-border px-4 py-3 text-sm font-semibold">Find players on leaderboard →</Link></div><FriendChallenges /></section></main><Footer /></>;
}
