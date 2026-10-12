"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import StandardChessBoard from "@/components/chess/StandardChessBoard";
import type { BoardSquare } from "@/components/chess/standardBoardTheme";

type Props = { pgn: string; result: string; opponent: string; playedAt: string };

export default function GameReplay({ pgn, result, opponent, playedAt }: Props) {
  const positions = useMemo(() => {
    const chess = new Chess();
    const states: Array<{ fen: string; san: string; turn: string; lastMove: { from: BoardSquare; to: BoardSquare } | null }> = [{ fen: chess.fen(), san: "Starting position", turn: "White to move", lastMove: null }];
    try {
      chess.loadPgn(pgn);
      const history = chess.history({ verbose: true });
      const replay = new Chess();
      for (const move of history) {
        replay.move({ from: move.from, to: move.to, promotion: move.promotion });
        states.push({ fen: replay.fen(), san: move.san, turn: replay.turn() === "w" ? "White to move" : "Black to move", lastMove: { from: move.from as BoardSquare, to: move.to as BoardSquare } });
      }
    } catch {
      return [{ fen: new Chess().fen(), san: "This saved game has an invalid PGN record.", turn: "Replay unavailable", lastMove: null }];
    }
    return states;
  }, [pgn]);
  const [index, setIndex] = useState(0);
  const current = positions[Math.min(index, positions.length - 1)];
  return <section className="border border-shop-border bg-white p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="shop-eyebrow text-shop-muted">Saved game replay</p><h2 className="shop-display mt-2 text-3xl">{opponent || "Computer opponent"}</h2><p className="mt-2 text-xs text-shop-muted">{new Date(playedAt).toLocaleString()} · {result}</p></div><span className="border border-shop-border px-3 py-2 text-xs">Move {index} / {positions.length - 1}</span></div><div className="mx-auto mt-6 w-full max-w-[440px]"><StandardChessBoard fen={current.fen} lastMove={current.lastMove} disabled showCoordinates /></div><p className="mt-4 text-center text-sm font-semibold">{current.san} · {current.turn}</p><div className="mt-5 flex justify-center gap-2"><button type="button" onClick={() => setIndex(0)} disabled={index === 0} className="border border-shop-border px-4 py-3 text-sm disabled:opacity-40">Start</button><button type="button" onClick={() => setIndex((n) => Math.max(0, n - 1))} disabled={index === 0} className="border border-shop-border px-4 py-3 text-sm disabled:opacity-40">Previous</button><button type="button" onClick={() => setIndex((n) => Math.min(positions.length - 1, n + 1))} disabled={index >= positions.length - 1} className="bg-[#111111] px-4 py-3 text-sm text-white disabled:opacity-40">Next</button><button type="button" onClick={() => setIndex(positions.length - 1)} disabled={index >= positions.length - 1} className="border border-shop-border px-4 py-3 text-sm disabled:opacity-40">End</button></div></section>;
}
