"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Chess, type Square } from "chess.js";
import ChessBoard from "@/components/chess/ChessBoard";
import { toDisplayBoard } from "@/lib/chess/board";

const FEN = "6k1/5ppp/8/8/7Q/8/8/5RK1 w - - 0 1";
const SOLUTION = { from: "h4" as Square, to: "d8" as Square };

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DailyPuzzle() {
  const [game, setGame] = useState(() => new Chess(FEN));
  const [selected, setSelected] = useState<Square | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [solved, setSolved] = useState(false);
  const [status, setStatus] = useState("White to move. Find checkmate in one.");
  const [saveMessage, setSaveMessage] = useState("");
  const board = useMemo(() => toDisplayBoard(game.board()), [game]);
  const legalTargets = useMemo(() => selected ? game.moves({ square: selected, verbose: true }).map((move) => move.to) : [], [game, selected]);

  async function saveResult(score: number, movesTried: number) {
    try {
      const response = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityType: "puzzle_solved",
          activityKey: `daily-puzzle:${todayKey()}`,
          score,
          completed: true,
          metadata: { puzzleId: "daily-back-rank-mate", notation: "Qd8#", attempts: movesTried, hintsUsed: hintLevel, date: todayKey() },
        }),
      });
      if (response.status === 401) {
        setSaveMessage("Puzzle solved locally. Sign in to save it to your learning record.");
        return;
      }
      if (!response.ok) throw new Error("save failed");
      setSaveMessage("Puzzle result saved to your player dashboard.");
    } catch {
      setSaveMessage("Puzzle solved, but progress could not be saved. Check your connection and try again later.");
    }
  }

  function handleSquareClick(square: Square) {
    if (solved) return;
    const piece = game.get(square);
    if (!selected) {
      if (piece?.color === "w") {
        setSelected(square);
        setStatus(square === SOLUTION.from ? "Queen selected. Find the mating square." : "Look for the queen's winning move.");
      } else {
        setStatus("Select the white queen on h4.");
      }
      return;
    }
    if (selected === square) {
      setSelected(null);
      setStatus("White to move. Find checkmate in one.");
      return;
    }

    setAttempts((value) => value + 1);
    const legalMove = game.moves({ square: selected, verbose: true }).find((move) => move.to === square);
    if (!legalMove) {
      setSelected(piece?.color === "w" ? square : null);
      setStatus("That is not a legal move. Try another square.");
      return;
    }
    const candidate = new Chess(game.fen());
    try {
      const move = candidate.move({ from: selected, to: square, ...(legalMove.promotion ? { promotion: "q" } : {}) });
      if (!move) {
        setSelected(piece?.color === "w" ? square : null);
        setStatus("That is not a legal move. Try another square.");
        return;
      }
      if (selected === SOLUTION.from && square === SOLUTION.to && candidate.isCheckmate()) {
        setGame(candidate);
        setSelected(null);
        setSolved(true);
        setStatus("Excellent — Qd8# is checkmate.");
        void saveResult(Math.max(40, 100 - hintLevel * 15), attempts + 1);
        return;
      }
      setSelected(null);
      setStatus(candidate.isCheckmate() ? "That is checkmate, but this puzzle asks for Qd8#." : "Legal move, but not the mating move. Reset and try again.");
    } catch {
      setSelected(null);
      setStatus("That is not a legal move. Try again.");
    }
  }

  function reset() {
    setGame(new Chess(FEN));
    setSelected(null);
    setAttempts(0);
    setHintLevel(0);
    setSolved(false);
    setStatus("White to move. Find checkmate in one.");
    setSaveMessage("");
  }

  return (
    <section id="daily-puzzle" className="scroll-mt-24 border border-shop-border bg-white p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
        <div>
          <p className="shop-eyebrow text-shop-muted">Daily puzzle · Mate in one</p>
          <h2 className="shop-display mt-4 text-4xl leading-none sm:text-5xl">Find the winning move.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-shop-muted">White to move. Use the queen and rook to finish the game. This curated position is checked with the chess rules engine before the answer is accepted.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-shop-muted"><span className="border border-shop-border px-3 py-2">Attempts: {attempts}</span><span className="border border-shop-border px-3 py-2">Hints: {hintLevel}/2</span><span className="border border-shop-border px-3 py-2">{solved ? "Solved" : "Not solved yet"}</span></div>
          <p role="status" aria-live="polite" className="mt-5 min-h-12 text-sm font-semibold leading-6">{status}</p>
          {saveMessage && <p role="status" className="mt-2 text-xs leading-5 text-shop-muted">{saveMessage}{saveMessage.includes("Sign in") && <> <Link className="underline underline-offset-4" href="/auth/login?next=%2Flearn%23daily-puzzle">Sign in</Link></>}</p>}
          {!solved && <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={hintLevel >= 2} onClick={() => { setHintLevel((level) => Math.min(2, level + 1)); setStatus(hintLevel === 0 ? "Hint: inspect the queen on h4 and the eighth rank." : "Solution: Qd8# — move the queen from h4 to d8."); }} className="border border-shop-border px-4 py-3 text-xs font-semibold hover:border-shop-ink disabled:opacity-40">{hintLevel === 0 ? "Show a hint" : hintLevel === 1 ? "Show final hint" : "Hints used"}</button><button type="button" onClick={reset} className="border border-shop-border px-4 py-3 text-xs font-semibold hover:border-shop-ink">Reset puzzle</button></div>}
          {solved && <button type="button" onClick={reset} className="mt-6 border border-shop-border px-4 py-3 text-xs font-semibold hover:border-shop-ink">Try again</button>}
        </div>
        <div className="mx-auto w-full max-w-[420px]"><ChessBoard board={board} selectedSquare={selected} legalTargets={legalTargets} disabled={solved} onSquareClick={handleSquareClick} showCoordinates /></div>
      </div>
    </section>
  );
}
