import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Chess Improvement Report | SHoP" };

type GameRow = {
  id: string;
  white_player_id: string;
  black_player_id: string;
  status: string;
  time_control: string | null;
  result: string | null;
  ply: number | null;
  created_at: string;
  finished_at: string | null;
};
type Quality = "Best move" | "Good" | "Inaccuracy" | "Mistake" | "Blunder" | "Not classified";
type QualityRow = { ply?: number; quality?: Quality; lossCp?: number | null; loss_cp?: number | null };
type AnalysisRow = { game_id: string; depth: number; move_quality: unknown; summary: unknown; updated_at: string };
type Counts = { best: number; good: number; inaccuracies: number; mistakes: number; blunders: number; unclassified: number; classified: number; lossCpTotal: number; lossCpCount: number };

const emptyCounts = (): Counts => ({ best: 0, good: 0, inaccuracies: 0, mistakes: 0, blunders: 0, unclassified: 0, classified: 0, lossCpTotal: 0, lossCpCount: 0 });
function parseQuality(value: unknown): QualityRow[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is QualityRow => Boolean(item) && typeof item === "object");
}
function addQuality(counts: Counts, rows: QualityRow[]) {
  for (const row of rows) {
    switch (row.quality) {
      case "Best move": counts.best += 1; counts.classified += 1; break;
      case "Good": counts.good += 1; counts.classified += 1; break;
      case "Inaccuracy": counts.inaccuracies += 1; counts.classified += 1; break;
      case "Mistake": counts.mistakes += 1; counts.classified += 1; break;
      case "Blunder": counts.blunders += 1; counts.classified += 1; break;
      default: counts.unclassified += 1; break;
    }
    const loss = typeof row.lossCp === "number" ? row.lossCp : typeof row.loss_cp === "number" ? row.loss_cp : null;
    if (loss !== null && Number.isFinite(loss) && loss >= 0) { counts.lossCpTotal += loss; counts.lossCpCount += 1; }
  }
}
function outcome(game: GameRow, userId: string): "W" | "D" | "L" | null {
  if (game.status !== "completed" || !game.result) return null;
  if (game.result === "1/2-1/2") return "D";
  const won = (game.result === "1-0" && game.white_player_id === userId) || (game.result === "0-1" && game.black_player_id === userId);
  return won ? "W" : "L";
}
function labelDate(value: string) { return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)); }
function Card({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-gray-500">{detail}</p></div>;
}

export default async function ChessPerformancePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login?next=/dashboard/performance");

  const { data: gameData, error: gameError } = await supabase.from("chess_games")
    .select("id, white_player_id, black_player_id, status, time_control, result, ply, created_at, finished_at")
    .or(`white_player_id.eq.${user.id},black_player_id.eq.${user.id}`)
    .order("created_at", { ascending: false }).limit(500);

  if (gameError) return <main className="mx-auto max-w-6xl px-4 py-10"><h1 className="text-3xl font-bold">Chess Improvement Report</h1><p className="mt-4 rounded-xl border p-4">We could not load your games. Confirm the Phase 4 chess migrations are applied, then try again.</p><Link className="mt-4 inline-block underline" href="/dashboard">Back to dashboard</Link></main>;

  const games = (gameData ?? []) as GameRow[];
  const completed = games.filter((game) => outcome(game, user.id) !== null);
  const gameIds = completed.map((game) => game.id);
  let analyses: AnalysisRow[] = [];
  let analysisUnavailable = false;
  if (gameIds.length) {
    const { data, error } = await supabase.from("chess_game_analyses")
      .select("game_id, depth, move_quality, summary, updated_at")
      .in("game_id", gameIds);
    if (error) analysisUnavailable = true;
    else analyses = (data ?? []) as AnalysisRow[];
  }
  const analysisByGame = new Map(analyses.map((analysis) => [analysis.game_id, analysis]));
  const aggregate = emptyCounts();
  for (const analysis of analyses) addQuality(aggregate, parseQuality(analysis.move_quality));
  const analyzedGames = completed.filter((game) => analysisByGame.has(game.id));
  const wins = completed.filter((game) => outcome(game, user.id) === "W").length;
  const draws = completed.filter((game) => outcome(game, user.id) === "D").length;
  const losses = completed.filter((game) => outcome(game, user.id) === "L").length;
  const coverage = completed.length ? Math.round(analyzedGames.length / completed.length * 100) : 0;
  const perGameBlunders = analyzedGames.length ? (aggregate.blunders / analyzedGames.length).toFixed(1) : "—";
  const perGameMistakes = analyzedGames.length ? (aggregate.mistakes / analyzedGames.length).toFixed(1) : "—";
  const averageLoss = aggregate.lossCpCount ? (aggregate.lossCpTotal / aggregate.lossCpCount / 100).toFixed(2) : "—";
  const lastTen = completed.slice(0, 10);
  const previousTen = completed.slice(10, 20);
  const score = (list: GameRow[]) => list.length ? Math.round(list.reduce((sum, game) => sum + (outcome(game, user.id) === "W" ? 1 : outcome(game, user.id) === "D" ? 0.5 : 0), 0) / list.length * 100) : null;
  const lastScore = score(lastTen);
  const previousScore = score(previousTen);
  const scoreTrend = lastScore === null || previousScore === null ? "Not enough games to compare" : lastScore > previousScore ? `Up ${lastScore - previousScore} percentage points` : lastScore < previousScore ? `Down ${previousScore - lastScore} percentage points` : "Unchanged";
  const recentAnalyzed = analyzedGames.slice(0, 8);

  return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">SHoP Chess Library</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Chess Improvement Report</h1><p className="mt-2 max-w-2xl text-sm text-gray-600">Patterns from your saved Stockfish reviews, alongside your match results. Engine classifications are heuristics, not an official rating.</p><p className="mt-1 text-xs text-gray-500">Based on the latest {games.length} saved games{games.length === 500 ? " (archive limit reached)" : ""}.</p></div>
      <div className="flex flex-wrap gap-2"><Link href="/dashboard/games" className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">My Games</Link><Link href="/dashboard" className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">Dashboard</Link></div>
    </header>

    {analysisUnavailable && <div role="status" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Saved engine reports could not be loaded. Confirm the Phase 4.8 analysis migration is applied and that participant access policies are enabled. Match results below may still be available.</div>}

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Analyzed games" value={`${analyzedGames.length} / ${completed.length}`} detail={`${coverage}% of completed games have saved analysis`} />
      <Card label="Blunders per analyzed game" value={perGameBlunders} detail={`${aggregate.blunders} total classified blunders`} />
      <Card label="Mistakes per analyzed game" value={perGameMistakes} detail={`${aggregate.mistakes} total classified mistakes`} />
      <Card label="Average classified evaluation loss" value={averageLoss === "—" ? "—" : `${averageLoss} pawns`} detail="Mean loss where the saved report included a numeric loss; not an accuracy score" />
    </section>

    <section className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Move-quality patterns</h2><p className="mt-1 text-sm text-gray-500">Counts from saved analysis reports only; unanalysed games are excluded.</p>
        <div className="mt-5 space-y-4">{([ ["Best moves", aggregate.best, "bg-emerald-500"], ["Good moves", aggregate.good, "bg-teal-500"], ["Inaccuracies", aggregate.inaccuracies, "bg-amber-400"], ["Mistakes", aggregate.mistakes, "bg-orange-500"], ["Blunders", aggregate.blunders, "bg-rose-500"], ["Not classified", aggregate.unclassified, "bg-gray-300"] ] as [string, number, string][]).map(([label, count, color]) => <div key={label}><div className="flex items-center justify-between text-sm"><span className="font-medium">{label}</span><span className="text-gray-500">{count}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full ${color}`} style={{ width: `${aggregate.classified + aggregate.unclassified ? count / (aggregate.classified + aggregate.unclassified) * 100 : 0}%` }} /></div></div>)}</div>
        <p className="mt-5 text-xs text-gray-500">Classification thresholds depend on the saved analysis implementation and engine depth. Counts should be compared only across reports produced with compatible settings.</p>
      </div>
      <div className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Match results & recent trend</h2><p className="mt-1 text-sm text-gray-500">Results are calculated separately from Stockfish move classifications.</p>
        <div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-xl bg-teal-50 p-3"><p className="text-xs text-teal-800">Wins</p><p className="mt-1 text-2xl font-bold text-teal-950">{wins}</p></div><div className="rounded-xl bg-amber-50 p-3"><p className="text-xs text-amber-800">Draws</p><p className="mt-1 text-2xl font-bold text-amber-950">{draws}</p></div><div className="rounded-xl bg-rose-50 p-3"><p className="text-xs text-rose-800">Losses</p><p className="mt-1 text-2xl font-bold text-rose-950">{losses}</p></div></div>
        <div className="mt-5 rounded-xl bg-gray-50 p-4"><p className="text-sm text-gray-500">Score rate across latest 10 completed games</p><p className="mt-1 text-2xl font-bold">{lastScore === null ? "—" : `${lastScore}%`}</p><p className="mt-3 text-sm text-gray-500">Compared with the previous 10 games</p><p className="mt-1 font-semibold">{scoreTrend}</p><p className="mt-2 text-xs text-gray-500">A result trend is not a measure of engine accuracy or playing strength.</p></div>
      </div>
    </section>

    <section className="mt-8 rounded-2xl border bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Recently analyzed games</h2><p className="mt-1 text-sm text-gray-500">Open a report to inspect its move-by-move classifications and candidate lines.</p></div><Link href="/dashboard/games" className="text-sm font-semibold text-teal-800 underline">Browse all games</Link></div>
      {recentAnalyzed.length ? <div className="mt-4 divide-y">{recentAnalyzed.map((game) => { const analysis = analysisByGame.get(game.id); const rows = parseQuality(analysis?.move_quality); const counts = emptyCounts(); addQuality(counts, rows); const result = outcome(game, user.id); const outcomeLabel = result === "W" ? "Win" : result === "D" ? "Draw" : "Loss"; return <div key={game.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{game.time_control || "Chess game"} · {outcomeLabel}</p><p className="mt-1 text-xs text-gray-500">{labelDate(game.finished_at ?? game.created_at)} · Depth {analysis?.depth ?? "—"} · {rows.length} classified move records</p><p className="mt-1 text-xs text-gray-500">{counts.inaccuracies} inaccuracies · {counts.mistakes} mistakes · {counts.blunders} blunders</p></div><Link href={`/dashboard/games/${game.id}`} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50">Review game</Link></div>; })}</div> : <div className="mt-4 rounded-xl border border-dashed p-6 text-center"><h3 className="font-semibold">No saved engine reports yet</h3><p className="mt-2 text-sm text-gray-600">Open a completed game, run Stockfish analysis and wait for the saved confirmation. Your cross-game report will update after that.</p><Link href="/dashboard/games" className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Open My Games</Link></div>}
    </section>
    <p className="mt-6 text-xs text-gray-500">SHoP summarizes the saved reports available to your account. Reports may differ by engine version and depth; this page does not invent missing analysis, opening labels or accuracy percentages.</p>
  </main>;
}
