import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GameArchive from "@/components/chess/GameArchive";

export const metadata = { title: "My Games | SHoP Chess", description: "Browse, filter and review your SHoP chess games." };

type GameRow = {
  id: string;
  white_player_id: string;
  black_player_id: string;
  status: string;
  time_control: string;
  initial_time_ms: number;
  increment_ms: number;
  result: string | null;
  termination: string | null;
  ply: number;
  created_at: string;
  finished_at: string | null;
};

type ProfileRow = { id: string; display_name: string | null };

export default async function MyGamesPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login?next=/dashboard/games");

  const { data, error } = await supabase
    .from("chess_games")
    .select("id, white_player_id, black_player_id, status, time_control, initial_time_ms, increment_ms, result, termination, ply, created_at, finished_at")
    .or(`white_player_id.eq.${user.id},black_player_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-sm font-semibold text-teal-800 hover:text-teal-950">← Dashboard</Link>
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:p-6">
          <h1 className="text-xl font-semibold text-rose-950">We couldn’t load your games</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-900">Check that the Phase 4 chess migrations are applied and that your account can read its own games. Your games have not been changed.</p>
          <Link href="/dashboard" className="mt-4 inline-flex rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-100">Return to dashboard</Link>
        </div>
      </main>
    );
  }

  const rows = (data ?? []) as GameRow[];
  const ids = [...new Set(rows.flatMap((game) => [game.white_player_id, game.black_player_id]))];
  const { data: profileData } = ids.length
    ? await supabase.from("profiles").select("id, display_name").in("id", ids)
    : { data: [] as ProfileRow[] };
  const names = Object.fromEntries(((profileData ?? []) as ProfileRow[]).map((profile) => [profile.id, profile.display_name || "SHoP Player"]));

  const games = rows.map((game) => {
    const isWhite = game.white_player_id === user.id;
    const opponentId = isWhite ? game.black_player_id : game.white_player_id;
    const myResult = game.status !== "completed"
      ? "In progress"
      : game.result === "1/2-1/2"
        ? "Draw"
        : ((game.result === "1-0" && isWhite) || (game.result === "0-1" && !isWhite))
          ? "Win"
          : "Loss";
    return {
      ...game,
      opponent: names[opponentId] ?? "SHoP Player",
      myColour: isWhite ? "White" : "Black",
      myResult,
    };
  });

  const inProgress = games.filter((game) => game.myResult === "In progress").length;

  return (
    <main className="min-h-screen bg-slate-50/70">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-800">← Back to dashboard</Link>
        <header className="mt-5 mb-7 overflow-hidden rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">SHoP · Chess library</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">My Games</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Every match is a chance to learn. Find your games, revisit key moments and keep building your chess story.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard/performance" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Performance</Link>
              <Link href="/dashboard/challenges" className="rounded-xl bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300">Play a challenge ↗</Link>
            </div>
          </div>
          {inProgress > 0 && <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200"><span className="h-2 w-2 rounded-full bg-amber-300" />{inProgress} game{inProgress === 1 ? "" : "s"} in progress</div>}
        </header>
        <GameArchive games={games} />
        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Kila hatua ina maana.</span>
          <span>Showing your 200 most recent games.</span>
        </footer>
      </div>
    </main>
  );
}
