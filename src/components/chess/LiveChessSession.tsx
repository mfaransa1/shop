"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chess, type Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import StandardChessBoard from "@/components/chess/StandardChessBoard";
import type { BoardSquare } from "@/components/chess/standardBoardTheme";

type Game = {
  id: string; challenge_id: string | null; white_player_id: string; black_player_id: string;
  status: "waiting" | "active" | "completed" | "aborted"; time_control: string; initial_time_ms: number;
  increment_ms: number; fen: string; pgn: string; ply: number; side_to_move: "w" | "b";
  white_time_ms: number; black_time_ms: number; clock_started_at: string; result: string | null;
  termination: string | null; finished_at: string | null;
  first_move_deadline_at: string | null; white_ready?: boolean; black_ready?: boolean;
};
type MoveRow = { id: number; ply: number; player_id: string; san: string; from_square: string; to_square: string; promotion: string | null; fen_after: string; created_at: string };
type Snapshot = { game: Game; moves: MoveRow[] };

function formatTime(ms: number) {
  const safe = Math.max(0, ms);
  const seconds = Math.ceil(safe / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  const tenths = Math.floor((safe % 1000) / 100);
  return minutes > 0 ? `${minutes}:${String(remainder).padStart(2, "0")}` : `${remainder}.${tenths}`;
}
function displayClock(game: Game, side: "w" | "b", now: number) {
  const stored = side === "w" ? game.white_time_ms : game.black_time_ms;
  if (game.status !== "active" || game.side_to_move !== side) return stored;
  return stored - Math.max(0, now - new Date(game.clock_started_at).getTime());
}

export default function LiveChessSession() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [userId, setUserId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(0);
  const supabase = useMemo(() => createClient(), []);
  const audioRefs = useRef<{ move: HTMLAudioElement | null; checkmate: HTMLAudioElement | null }>({ move: null, checkmate: null });
  const soundState = useRef<{ gameId: string; ply: number; terminal: string | null } | null>(null);

  useEffect(() => {
    const move = new Audio("/sounds/move.mp3");
    const checkmate = new Audio("/sounds/checkmate.mp3");
    move.preload = "auto";
    checkmate.preload = "auto";
    move.volume = 0.45;
    checkmate.volume = 0.6;
    audioRefs.current = { move, checkmate };
    return () => {
      move.pause(); checkmate.pause();
      audioRefs.current = { move: null, checkmate: null };
    };
  }, []);

  useEffect(() => {
    if (!snapshot?.game) return;
    const current = snapshot.game;
    const terminal = current.status === "completed" || current.status === "aborted"
      ? `${current.id}:${current.status}:${current.termination ?? "unknown"}:${current.result ?? "none"}`
      : null;
    const previous = soundState.current;
    if (!previous || previous.gameId !== current.id) {
      // Initial page load should not replay sounds for historical moves/results.
      soundState.current = { gameId: current.id, ply: current.ply, terminal };
      return;
    }
    const newMove = current.ply > previous.ply;
    const newCheckmate = current.status === "completed" && current.termination === "checkmate" && previous.terminal !== terminal;
    if (newCheckmate) {
      const audio = audioRefs.current.checkmate;
      if (audio) { audio.currentTime = 0; void audio.play().catch(() => {}); }
    } else if (newMove) {
      const audio = audioRefs.current.move;
      if (audio) { audio.currentTime = 0; void audio.play().catch(() => {}); }
    }
    soundState.current = { gameId: current.id, ply: current.ply, terminal };
  }, [snapshot?.game]);

  const load = useCallback(async (quiet = false) => {
    try {
      const response = await fetch(`/api/chess/games/${id}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load this game.");
      setSnapshot((previous) => {
        if (previous && previous.game.ply > payload.game.ply) return previous;
        return payload as Snapshot;
      });
      if (!quiet) setNotice("");
    } catch (error) {
      if (!quiet) setNotice(error instanceof Error ? error.message : "Could not load this game.");
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active) setUserId(data.user?.id ?? ""); });
    const initialLoad = window.setTimeout(() => { void load(); }, 0);
    const channel = supabase.channel(`chess-game-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chess_games", filter: `id=eq.${id}` }, () => { void load(true); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chess_game_moves", filter: `game_id=eq.${id}` }, () => { void load(true); })
      .subscribe();
    // Polling is a resilient fallback if Realtime is unavailable or a notification is missed.
    const refresh = window.setInterval(() => { void load(true); }, 2500);
    const clock = window.setInterval(() => setNow(Date.now()), 100);
    return () => { active = false; window.clearTimeout(initialLoad); window.clearInterval(refresh); window.clearInterval(clock); void supabase.removeChannel(channel); };
  }, [id, load, supabase]);

  const game = snapshot?.game;
  const chess = useMemo(() => {
    const instance = new Chess();
    if (game?.fen) { try { instance.load(game.fen); } catch { /* keep initial board until refreshed */ } }
    return instance;
  }, [game]);
  const isWhite = Boolean(game && userId === game.white_player_id);
  const isBlack = Boolean(game && userId === game.black_player_id);
  const isParticipant = isWhite || isBlack;
  const myTurn = Boolean(game && game.status === "active" && ((game.side_to_move === "w" && isWhite) || (game.side_to_move === "b" && isBlack)));


  async function submitMove(from: Square, to: Square) {
    if (!game || !myTurn || busy) return;
    const movingPiece = chess.get(from);
    let promotion: string | undefined;
    if (movingPiece?.type === "p" && (to.endsWith("8") || to.endsWith("1"))) {
      const answer = window.prompt("Promote to: q (queen), r (rook), b (bishop), or n (knight)", "q")?.toLowerCase();
      if (!answer || !["q", "r", "b", "n"].includes(answer)) { return; }
      promotion = answer;
    }
    setBusy(true); setNotice("");
    try {
      const response = await fetch(`/api/chess/games/${game.id}/moves`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ from, to, promotion, expectedPly: game.ply }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Move could not be submitted.");
      await load(true);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Move could not be submitted.");
      await load(true);
    } finally { setBusy(false); }
  }

  async function action(actionName: "resign" | "offer_draw" | "accept_draw") {
    if (!game || busy) return;
    if (actionName === "resign" && !window.confirm("Resign this game?")) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch(`/api/chess/games/${game.id}/action`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: actionName }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Action could not be completed.");
      await load(true);
      setNotice(actionName === "offer_draw" ? "Draw offer sent." : "Game updated.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Action could not be completed."); }
    finally { setBusy(false); }
  }



  if (!game) return <main className="mx-auto max-w-4xl p-6"><p className="text-sm text-slate-500">Loading chess game…</p>{notice && <p role="alert" className="mt-3 text-red-600">{notice}</p>}</main>;
  if (!isParticipant && userId) return <main className="mx-auto max-w-4xl p-6"><h1 className="text-xl font-bold">Game unavailable</h1><p>You are not a participant in this game.</p></main>;
  const whiteClock = displayClock(game, "w", now);
  const blackClock = displayClock(game, "b", now);
  const lastMove = snapshot?.moves.at(-1);
  const firstMoveRemainingMs = game.first_move_deadline_at && game.status === "active" && game.ply === 0
    ? Math.max(0, new Date(game.first_move_deadline_at).getTime() - now)
    : null;
  const isWinner = game.result === (isWhite ? "1-0" : "0-1");
  const isDraw = game.result === "1/2-1/2";
  const resultHeadline = !isParticipant ? null : game.status === "aborted" || game.termination === "aborted"
    ? "Game abandoned — no winner"
    : game.termination === "checkmate"
      ? (isWinner ? "CHECKMATE — You win!" : "CHECKMATE — You lose.")
      : game.termination === "timeout"
        ? (isWinner ? "You win on time!" : "You lose on time.")
        : game.status === "completed"
          ? (isDraw ? "Draw" : isWinner ? "You win!" : "You lose.")
          : null;

  return <main className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)] md:p-6">
    <section className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs uppercase tracking-[.18em] text-slate-500">SHoP LIVE CHESS</p><h1 className="text-2xl font-bold">{game.time_control.charAt(0).toUpperCase() + game.time_control.slice(1)} game</h1></div><span className={`rounded-full px-3 py-1 text-sm ${game.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{game.status === "waiting" ? "Waiting for both players" : game.status === "active" ? "Live" : `Finished · ${game.termination === "aborted" ? "Abandoned" : game.result ?? "Game over"}`}</span></div>
      <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-900 p-3 text-white"><span>{isBlack ? "You · Black" : "Opponent · Black"}</span><strong className={`rounded-lg px-3 py-1 font-mono text-xl ${game.side_to_move === "b" && game.status === "active" ? "bg-amber-300 text-slate-950" : "bg-slate-700"}`}>{formatTime(blackClock)}</strong></div>
      <div className="mx-auto w-full max-w-[680px]">
        <StandardChessBoard
          fen={game.fen}
          orientation={isBlack ? "black" : "white"}
          disabled={!myTurn || busy || game.status !== "active"}
          lastMove={lastMove ? { from: lastMove.from_square as BoardSquare, to: lastMove.to_square as BoardSquare } : null}
          getLegalTargets={(square) => chess.moves({ square: square as Square, verbose: true }).map((move) => move.to as BoardSquare)}
          onMove={(from, to) => submitMove(from as Square, to as Square)}
          className="shop-live-board"
        />
      </div>
      <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-900 p-3 text-white"><span>{isWhite ? "You · White" : "Opponent · White"}</span><strong className={`rounded-lg px-3 py-1 font-mono text-xl ${game.side_to_move === "w" && game.status === "active" ? "bg-amber-300 text-slate-950" : "bg-slate-700"}`}>{formatTime(whiteClock)}</strong></div>
      {resultHeadline && <div role="status" className={`mt-4 border p-4 ${game.termination === "checkmate" || game.termination === "timeout" ? "border-amber-300 bg-amber-50 text-slate-950" : "border-slate-200 bg-slate-50 text-slate-800"}`}><p className="text-lg font-bold">{resultHeadline}</p><p className="mt-1 text-sm">{game.termination ? game.termination.replaceAll("_", " ") : "Game finished"}{game.result ? ` · ${game.result}` : ""}</p></div>}
      {firstMoveRemainingMs !== null && <div className="mt-4 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-semibold">Make the first move before the deadline.</p><p className="mt-1">If no first move is played within the opening minute, the game is abandoned with no winner.</p><p className="mt-2 font-mono text-xl font-bold">{formatTime(firstMoveRemainingMs)}</p></div>}
      <p className="mt-3 text-sm text-slate-500">{game.status === "waiting" ? "Waiting for both players to join. The clock will start only when both are present." : game.status !== "active" ? `Result: ${game.result ?? "No winner"}${game.termination ? ` · ${game.termination.replaceAll("_", " ")}` : ""}` : myTurn ? "Your turn — select a piece, then its destination." : "Waiting for your opponent's move…"}</p>
    </section>
    <aside className="space-y-4">
      <section className="rounded-2xl border border-slate-200 p-4"><h2 className="mb-3 text-lg font-semibold">Game controls</h2><div className="grid grid-cols-2 gap-2"><button className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50" disabled={!isParticipant || game.status !== "active" || busy} onClick={() => void action("offer_draw")}>Offer draw</button><button className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50" disabled={!isParticipant || game.status !== "active" || busy} onClick={() => void action("accept_draw")}>Accept draw</button><button className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50" disabled={!isParticipant || game.status !== "active" || busy} onClick={() => void action("resign")}>Resign</button></div>{notice && <p role="status" className="mt-3 text-sm text-amber-800">{notice}</p>}<p className="mt-3 text-xs text-slate-500">Moves synchronize through Supabase Realtime with a polling fallback.</p></section>
      <section className="rounded-2xl border border-slate-200 p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Move history</h2><span className="text-xs text-slate-500">{snapshot?.moves.length ?? 0} plies</span></div><div className="max-h-80 overflow-auto rounded-lg bg-slate-50 p-2"><div className="grid grid-cols-[2rem_1fr_1fr] gap-x-3 gap-y-1 font-mono text-sm">{Array.from({ length: Math.ceil((snapshot?.moves.length ?? 0) / 2) }, (_, i) => <div key={i} className="contents"><span className="text-slate-400">{i + 1}.</span><span>{snapshot?.moves[i * 2]?.san ?? ""}</span><span>{snapshot?.moves[i * 2 + 1]?.san ?? ""}</span></div>)}</div></div><button className="mt-3 w-full rounded-lg border px-3 py-2 text-sm" onClick={() => router.push("/dashboard/games")}>My Games & Review</button></section>
      <section className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><h2 className="mb-1 font-semibold text-slate-900">Connection status</h2><p>{game.status === "waiting" ? "You are in the lobby. The game clock is paused until both players open this game." : game.status === "active" ? "This game refreshes automatically. If you reconnect, the latest saved position will be restored." : "This game is saved. The review library will make completed games easier to revisit."}</p></section>
    </aside>
  </main>;
}
