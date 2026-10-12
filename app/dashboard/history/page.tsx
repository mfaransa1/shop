import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GameReplay from "@/components/community/GameReplay";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Game history | SHoP" };
export const dynamic = "force-dynamic";

type Activity = { id: string; activity_type: string; activity_key: string; score: number; completed: boolean; metadata: Record<string, unknown> | null; created_at: string };

export default async function GameHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard/history");
  const { data, error } = await supabase.from("learning_activity").select("id, activity_type, activity_key, score, completed, metadata, created_at").eq("user_id", user.id).eq("activity_type", "game_completed").eq("completed", true).order("created_at", { ascending: false }).limit(30);
  const games = (data ?? []) as Activity[];
  return <><Navbar /><main className="min-h-screen bg-shop-cream pt-20 text-shop-ink"><section className="bg-[#111111] text-[#F3EDE2]"><div className="shop-container py-14 md:py-20"><p className="shop-eyebrow text-[#F3EDE2]/50">Player area · Private history</p><h1 className="shop-display mt-5 text-6xl sm:text-7xl">Your games.</h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#F3EDE2]/65">Review completed games saved to your account. This history is visible only to you.</p></div></section><section className="shop-container py-10"><div className="mb-7 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-shop-muted">{games.length} recent completed {games.length === 1 ? "game" : "games"}</p><Link href="/dashboard" className="border border-shop-border px-4 py-3 text-sm font-semibold">← Dashboard</Link></div>{error ? <div role="status" className="border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">Game history could not be loaded. Confirm the player-learning migration has been applied.</div> : games.length === 0 ? <div className="border border-shop-border bg-white p-8"><h2 className="shop-display text-3xl">Your first replay starts here.</h2><p className="mt-3 text-sm leading-7 text-shop-muted">Finish a game against the computer while signed in. Games with a saved PGN can be replayed here.</p><Link href="/learn#play-computer" className="mt-5 inline-block bg-[#111111] px-5 py-3 text-sm font-semibold text-white">Play the computer →</Link></div> : <div className="space-y-8">{games.map((game) => { const meta = game.metadata ?? {}; const pgn = typeof meta.pgn === "string" ? meta.pgn : ""; return pgn ? <GameReplay key={game.id} pgn={pgn} result={String(meta.result ?? "Completed")} opponent={String(meta.opponent ?? "SHoP computer")} playedAt={game.created_at} /> : <article key={game.id} className="border border-shop-border bg-white p-5"><h2 className="font-semibold">{String(meta.opponent ?? "Computer game")}</h2><p className="mt-2 text-sm text-shop-muted">{String(meta.result ?? "Completed")} · {new Date(game.created_at).toLocaleString()}</p><p className="mt-2 text-xs text-shop-muted">This older game has no saved PGN, so replay is unavailable.</p></article>; })}</div>}</section></main><Footer /></>;
}
