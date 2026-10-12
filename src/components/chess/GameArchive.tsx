"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Game = {
  id: string;
  status: string;
  time_control: string;
  initial_time_ms: number;
  increment_ms: number;
  result: string | null;
  termination: string | null;
  ply: number;
  created_at: string;
  finished_at: string | null;
  opponent: string;
  myColour: string;
  myResult: string;
};

type Filter = "all" | "win" | "draw" | "loss" | "in progress";

function titleCase(value: string) {
  return value.replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function timeControlLabel(value: string) {
  const labels: Record<string, string> = {
    bullet: "Bullet",
    "bullet-2-1": "Bullet · 2+1",
    blitz: "Blitz",
    "blitz-5": "Blitz · 5+0",
    rapid: "Rapid",
    "rapid-10-5": "Rapid · 10+5",
    "rapid-15-10": "Rapid · 15+10",
    custom: "Custom",
  };
  return labels[value] ?? titleCase(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function clockLabel(ms: number) {
  const minutes = Math.floor(Math.max(0, ms) / 60_000);
  const seconds = Math.floor((Math.max(0, ms) % 60_000) / 1_000);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function resultTone(result: string) {
  if (result === "Win") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (result === "Loss") return "border-rose-200 bg-rose-50 text-rose-800";
  if (result === "Draw") return "border-slate-200 bg-slate-100 text-slate-700";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function Icon({ name }: { name: "chess" | "search" | "filter" | "clock" | "review" | "arrow" | "calendar" | "sparkles" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  switch (name) {
    case "chess": return <svg {...common}><path d="M7 21h10M9 21l1-4h4l1 4M8 17h8l-1-5H9l-1 5ZM9 8l3-5 3 5M8 8h8l-1 4H9L8 8Z" /></svg>;
    case "search": return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
    case "filter": return <svg {...common}><path d="M4 6h16M7 12h10m-7 6h4" /></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "review": return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" /><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8M8 10h6" /></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
    case "sparkles": return <svg {...common}><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></svg>;
    default: return <svg {...common}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
  }
}

export default function GameArchive({ games }: { games: Game[] }) {
  const [result, setResult] = useState<Filter>("all");
  const [speed, setSpeed] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return games
      .filter((game) => result === "all" || game.myResult.toLocaleLowerCase() === result)
      .filter((game) => speed === "all" || (speed === "bullet" ? game.time_control.startsWith("bullet") : speed === "blitz" ? game.time_control.startsWith("blitz") : speed === "rapid" ? game.time_control.startsWith("rapid") : game.time_control === "custom"))
      .filter((game) => !query || game.opponent.toLocaleLowerCase().includes(query))
      .sort((a, b) => sort === "oldest" ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : sort === "longest" ? b.ply - a.ply : new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [games, result, speed, search, sort]);

  const wins = games.filter((game) => game.myResult === "Win").length;
  const draws = games.filter((game) => game.myResult === "Draw").length;
  const losses = games.filter((game) => game.myResult === "Loss").length;
  const completed = wins + draws + losses;
  const winRate = completed ? Math.round((wins / completed) * 100) : 0;
  const hasFilters = result !== "all" || speed !== "all" || search.trim() !== "";

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-slate-500">Games played</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{games.length}</p>
          <p className="mt-1 text-xs text-slate-500">Saved chess sessions</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-emerald-800">Wins</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-950">{wins}</p>
          <p className="mt-1 text-xs text-emerald-800">{winRate}% of completed games</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-slate-500">Draws</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{draws}</p>
          <p className="mt-1 text-xs text-slate-500">Half a point each</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-rose-800">Losses</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-rose-950">{losses}</p>
          <p className="mt-1 text-xs text-rose-800">Keep learning every game</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Game archive</h2>
              <p className="mt-1 text-sm text-slate-500">Find a match, revisit the moves and learn from the result.</p>
            </div>
            <Link href="/dashboard/challenges" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2">
              <Icon name="chess" /> Play a challenge <Icon name="arrow" />
            </Link>
          </div>
        </div>

        <div className="space-y-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <label className="relative block">
              <span className="sr-only">Search opponents</span>
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"><Icon name="search" /></span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search opponent…" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
              <span className="text-slate-400"><Icon name="filter" /></span>
              <span className="sr-only">Filter by result</span>
              <select value={result} onChange={(event) => setResult(event.target.value as Filter)} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-700 outline-none">
                <option value="all">All results</option><option value="win">Wins</option><option value="draw">Draws</option><option value="loss">Losses</option><option value="in progress">In progress</option>
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
              <span className="text-slate-400"><Icon name="clock" /></span>
              <span className="sr-only">Filter by time control</span>
              <select value={speed} onChange={(event) => setSpeed(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-700 outline-none">
                <option value="all">All time controls</option><option value="bullet">Bullet</option><option value="blitz">Blitz</option><option value="rapid">Rapid</option><option value="custom">Custom</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-800">{filtered.length}</span> of {games.length} games</p>
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="game-sort" className="text-slate-500">Sort:</label>
              <select id="game-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-teal-600">
                <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="longest">Longest games</option>
              </select>
              {hasFilters && <button type="button" onClick={() => { setResult("all"); setSpeed("all"); setSearch(""); }} className="rounded-lg px-2 py-1.5 font-semibold text-teal-800 hover:bg-teal-50">Clear filters</button>}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-14 text-center sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><Icon name="chess" /></div>
            <h3 className="mt-4 text-lg font-semibold text-slate-950">{games.length === 0 ? "Your chess story starts here" : "No games match these filters"}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{games.length === 0 ? "Play a friend challenge to start building your game library. Completed games will appear here for replay and review." : "Try another opponent name or clear the filters to see more games."}</p>
            {games.length === 0 ? <Link href="/dashboard/challenges" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">Find a player <Icon name="arrow" /></Link> : <button type="button" onClick={() => { setResult("all"); setSpeed("all"); setSearch(""); }} className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear filters</button>}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((game) => (
              <article key={game.id} className="group flex flex-col gap-4 px-4 py-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${game.myResult === "Win" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : game.myResult === "Loss" ? "border-rose-200 bg-rose-50 text-rose-800" : game.myResult === "Draw" ? "border-slate-200 bg-slate-100 text-slate-700" : "border-amber-200 bg-amber-50 text-amber-800"}`}>{game.myResult === "Win" ? "W" : game.myResult === "Loss" ? "L" : game.myResult === "Draw" ? "½" : "…"}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-slate-950">vs. {game.opponent || "SHoP Player"}</h3>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${resultTone(game.myResult)}`}>{game.myResult}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{game.myColour}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 sm:text-sm">
                      <span className="inline-flex items-center gap-1.5"><Icon name="calendar" />{formatDate(game.finished_at || game.created_at)}</span>
                      <span>{timeControlLabel(game.time_control)}</span>
                      <span>{clockLabel(game.initial_time_ms)} + {Math.round(game.increment_ms / 1000)}s</span>
                      <span>{Math.ceil(game.ply / 2)} moves</span>
                    </div>
                    {game.termination && <p className="mt-1.5 text-xs text-slate-400">{titleCase(game.termination)}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 pl-14 sm:pl-0">
                  <Link href={`/dashboard/games/${game.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2">
                    <Icon name="review" /> {game.myResult === "In progress" ? "Open game" : "Review game"} <Icon name="arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <p className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-500"><span className="mt-0.5 text-teal-700"><Icon name="sparkles" /></span>Use each review to replay your decisions. Engine analysis and move-quality labels appear when an analysis has been saved for that game.</p>
    </section>
  );
}
