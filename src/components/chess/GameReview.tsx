"use client";

import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import StandardChessBoard from "@/components/chess/StandardChessBoard";
import type { BoardSquare } from "@/components/chess/standardBoardTheme";
import StockfishReviewPanel from "@/components/chess/StockfishReviewPanel";

type GameInfo = { id: string; white_player_id: string; black_player_id: string; status: string; time_control: string; initial_time_ms: number; increment_ms: number; fen: string; pgn: string; ply: number; side_to_move: string; result: string | null; termination: string | null; created_at: string; finished_at: string | null };
type Move = { ply: number; san: string; fen_after: string; from_square: string; to_square: string; promotion: string | null; player_id: string; created_at: string };
export default function GameReview({ game, whiteName, blackName, currentUserId }: { game: GameInfo; whiteName: string; blackName: string; currentUserId: string }) {
  const [moves, setMoves] = useState<Move[]>([]);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let alive = true; (async () => { try { const response = await fetch(`/api/chess/games/${game.id}`, { cache: "no-store" }); const body = await response.json(); if (!response.ok) throw new Error(body.error || "Could not load move history."); if (alive) setMoves(body.moves ?? []); } catch (e) { if (alive) setError(e instanceof Error ? e.message : "Could not load move history."); } finally { if (alive) setLoading(false); } })(); return () => { alive = false; }; }, [game.id]);
  const positions = useMemo(() => { const out = [new Chess().fen()]; for (const move of moves) out.push(move.fen_after); return out; }, [moves]);
  const fen = positions[Math.min(index, positions.length - 1)] ?? new Chess().fen();
  const currentMove = index > 0 ? moves[index - 1] : null;
  const isParticipant = currentUserId === game.white_player_id || currentUserId === game.black_player_id;
  const exportPgn = () => { const pgn = game.pgn || ""; if (!pgn.trim()) { setError("This game has no saved PGN yet."); return; } const blob = new Blob([pgn], { type: "application/x-chess-pgn;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `shop-game-${game.id}.pgn`; a.click(); URL.revokeObjectURL(url); };
  return <><div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
    <section className="min-w-0 rounded-2xl border bg-white p-3 sm:p-5"><div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-sm text-gray-500">Black</p><p className="font-semibold">{blackName}</p></div><div className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold">{game.result ?? (game.status === "active" ? "In progress" : "—")}</div></div>
      <div className="mx-auto w-full max-w-[620px]">
        <StandardChessBoard
          fen={fen}
          disabled
          orientation="white"
          showCoordinates
          lastMove={currentMove ? { from: currentMove.from_square as BoardSquare, to: currentMove.to_square as BoardSquare } : null}
          className="w-full"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3"><div><p className="text-sm text-gray-500">White</p><p className="font-semibold">{whiteName}</p></div><span className="text-sm text-gray-500">Position {index} / {moves.length}</span></div>
      <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setIndex(0)} disabled={index === 0} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40" aria-label="First move">|◀</button><button onClick={() => setIndex((v) => Math.max(0, v - 1))} disabled={index === 0} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40" aria-label="Previous move">← Previous</button><button onClick={() => setIndex((v) => Math.min(moves.length, v + 1))} disabled={index >= moves.length} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40" aria-label="Next move">Next →</button><button onClick={() => setIndex(moves.length)} disabled={index >= moves.length} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40" aria-label="Last move">Last ▶|</button><button onClick={exportPgn} className="ml-auto rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">Export PGN</button></div>
    </section>
    <aside className="rounded-2xl border bg-white p-4 sm:p-5"><h2 className="text-xl font-bold">Move list</h2><p className="mt-1 text-sm text-gray-500">Select a move to jump to that position.</p>{loading && <p className="mt-4 text-sm">Loading moves…</p>}{error && <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}{!loading && !error && moves.length === 0 && <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">No moves have been saved for this game yet.</p>}<div className="mt-4 grid max-h-[520px] grid-cols-[48px_1fr_1fr] gap-1 overflow-y-auto text-sm"><div className="p-2 text-gray-500">#</div><div className="p-2 font-semibold">White</div><div className="p-2 font-semibold">Black</div>{Array.from({ length: Math.ceil(moves.length / 2) }, (_, row) => <div key={row} className="contents"><div className="p-2 text-gray-500">{row + 1}.</div>{[moves[row * 2], moves[row * 2 + 1]].map((m, col) => m ? <button key={m.ply} onClick={() => setIndex(m.ply)} className={`rounded px-2 py-2 text-left hover:bg-gray-100 ${index === m.ply ? "bg-teal-100 font-bold text-teal-950" : ""}`}>{m.san}</button> : <span key={`empty-${row}-${col}`} />)}</div>)}</div><div className="mt-5 border-t pt-4 text-sm"><p><span className="text-gray-500">Time control:</span> {game.time_control} ({Math.round(game.initial_time_ms / 60000)}+{Math.round(game.increment_ms / 1000)})</p><p className="mt-2"><span className="text-gray-500">Status:</span> {game.status}</p><p className="mt-2"><span className="text-gray-500">Termination:</span> {game.termination?.replaceAll("_", " ") ?? "—"}</p><p className="mt-2"><span className="text-gray-500">Moves recorded:</span> {moves.length}</p>{!isParticipant && <p className="mt-2 text-xs text-amber-700">You are not listed as a participant.</p>}</div></aside>
  </div><div className="mt-6"><StockfishReviewPanel positions={positions} moves={moves} /></div></>;
}
