import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommunityPrivacyForm from "@/components/community/CommunityPrivacyForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Community privacy | SHoP" };
export const dynamic = "force-dynamic";

export default async function CommunityPrivacyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard/community-settings");
  const { data } = await supabase.from("profiles").select("public_profile, show_on_leaderboard, bio").eq("id", user.id).maybeSingle();
  return <><Navbar /><main className="min-h-screen bg-shop-cream pt-20 text-shop-ink"><section className="bg-[#111111] text-[#F3EDE2]"><div className="shop-container py-14 md:py-20"><p className="shop-eyebrow text-[#F3EDE2]/50">Player area · Privacy controls</p><h1 className="shop-display mt-5 text-6xl sm:text-7xl">Your community,<br />your choice.</h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#F3EDE2]/65">Choose whether your profile and learning totals can be visible to other visitors. These settings start private.</p></div></section><section className="shop-container py-10"><div className="mx-auto max-w-3xl"><CommunityPrivacyForm initial={{ publicProfile: data?.public_profile ?? false, showOnLeaderboard: data?.show_on_leaderboard ?? false, bio: data?.bio ?? "" }} /><Link href="/community/leaderboard" className="mt-6 inline-block text-sm font-semibold underline underline-offset-4">View community leaderboard →</Link><br /><Link href="/dashboard" className="mt-4 inline-block text-sm text-shop-muted">← Back to dashboard</Link></div></section></main><Footer /></>;
}
