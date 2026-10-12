import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChallengePlayerButton from "@/components/community/ChallengePlayerButton";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PublicPlayer = {
  player_id: string;
  display_name: string;
  skill_level: string;
  bio: string;
  puzzles_solved: number;
  lessons_completed: number;
  games_completed: number;
  joined_at: string | null;
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_shop_public_player_profile", { player_uuid: id });
  const player = (data?.[0] ?? null) as PublicPlayer | null;
  return {
    title: player ? `${player.display_name} | SHoP Player` : "Player profile | SHoP",
    description: player ? `Chess learning profile for ${player.display_name} at Southside House of Pawns.` : "A SHoP community player profile.",
  };
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="border border-shop-border bg-white p-5"><p className="shop-eyebrow text-shop-muted">{label}</p><p className="shop-display mt-3 text-4xl tabular-nums">{value.toLocaleString()}</p></div>;
}

export default async function PublicPlayerProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shop_public_player_profile", { player_uuid: id });
  if (error || !data?.length) notFound();
  const player = data[0] as PublicPlayer;
  const joined = player.joined_at
    ? new Intl.DateTimeFormat("en-KE", { month: "long", year: "numeric" }).format(new Date(player.joined_at))
    : null;

  return <><Navbar /><main className="min-h-screen bg-shop-cream pt-20 text-shop-ink">
    <section className="bg-[#111111] text-[#F3EDE2]"><div className="shop-container py-16 md:py-24">
      <p className="shop-eyebrow text-[#F3EDE2]/55">SHoP Community · Public player profile</p>
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#F3EDE2]/25 bg-[#F3EDE2]/10 text-2xl font-semibold" aria-hidden="true">{player.display_name.trim().charAt(0).toUpperCase() || "S"}</div>
          <h1 className="shop-display mt-5 text-5xl sm:text-7xl">{player.display_name}</h1>
          <p className="mt-4 text-sm text-[#F3EDE2]/65">{player.skill_level || "Beginner"}{joined ? ` · Learning with SHoP since ${joined}` : ""}</p>
        </div>
        <Link href="/community/leaderboard" className="inline-flex w-fit border border-[#F3EDE2]/30 px-5 py-3 text-sm font-semibold transition hover:bg-[#F3EDE2] hover:text-[#111111]">Community leaderboard ↗</Link>
      </div>
    </div></section>
    <section className="shop-container py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div><p className="shop-eyebrow text-shop-muted">About the player</p><h2 className="shop-display mt-3 text-3xl">A journey in progress.</h2><p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-shop-muted">{player.bio.trim() || "This player has not added a public introduction yet."}</p><p className="mt-6 border-l-2 border-shop-ink pl-4 text-xs leading-6 text-shop-muted">Only information the player chose to make public appears here. Contact details, private game records, and account information are never displayed.</p></div>
        <div><p className="shop-eyebrow text-shop-muted">Shared learning activity</p><h2 className="shop-display mt-3 text-3xl">Every step counts.</h2><div className="mt-6 grid gap-3 sm:grid-cols-3"><Stat label="Puzzles solved" value={Number(player.puzzles_solved) || 0} /><Stat label="Lessons completed" value={Number(player.lessons_completed) || 0} /><Stat label="Games completed" value={Number(player.games_completed) || 0} /></div><p className="mt-5 text-xs leading-6 text-shop-muted">These counts come from completed learning activity records. They describe practice history, not an official chess rating or verified competitive strength.</p></div>
      </div>
      <ChallengePlayerButton playerId={player.player_id} playerName={player.display_name} />
      <div className="mt-12 border-t border-shop-border pt-6"><Link href="/community/players" className="mr-6 text-sm font-semibold underline underline-offset-4">← Find online players</Link><Link href="/community/leaderboard" className="text-sm font-semibold underline underline-offset-4">← Back to leaderboard</Link></div>
    </section>
  </main><Footer /></>;
}
