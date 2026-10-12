import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GameReview from "@/components/chess/GameReview";

export const metadata = { title: "Game Review | SHoP Chess" };
type Props = { params: Promise<{ id: string }> };

export default async function GameReviewPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect(`/login?next=/dashboard/games/${encodeURIComponent(id)}`);
  const { data: game, error } = await supabase.from("chess_games")
    .select("id, white_player_id, black_player_id, status, time_control, initial_time_ms, increment_ms, fen, pgn, ply, side_to_move, result, termination, created_at, finished_at")
    .eq("id", id).maybeSingle();
  if (error) return <main className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-2xl font-bold">Game Review</h1><p className="mt-4">Unable to load this game. Check that the chess migrations are installed.</p><Link href="/dashboard/games" className="mt-4 inline-block underline">Back to My Games</Link></main>;
  if (!game) notFound();
  const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", [game.white_player_id, game.black_player_id]);
  const names = Object.fromEntries((profiles ?? []).map((p: { id: string; display_name: string | null }) => [p.id, p.display_name || "SHoP Player"]));
  return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Chess Library</p><h1 className="mt-2 text-3xl font-bold">Game Review</h1></div><Link href="/dashboard/games" className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">← My Games</Link></div>
    <GameReview game={game} whiteName={names[game.white_player_id] ?? "White"} blackName={names[game.black_player_id] ?? "Black"} currentUserId={user.id} />
  </main>;
}
