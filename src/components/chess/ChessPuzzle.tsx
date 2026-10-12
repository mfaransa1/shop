"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import StandardChessBoard from "@/components/chess/StandardChessBoard";
import type { BoardSquare } from "@/components/chess/standardBoardTheme";

type Position = { from: Square; to: Square };
type Difficulty = "Beginner" | "Developing" | "Competitive";
type Puzzle = {
  id: string;
  title: string;
  theme: string;
  difficulty: Difficulty;
  fen: string;
  solution: Position;
  notation: string;
  description: string;
  hints: [string, string, string];
};

const PUZZLES: Puzzle[] = [
  {
    id: "back-rank-finish",
    title: "Back-rank finish",
    theme: "Queen checkmate",
    difficulty: "Beginner",
    fen: "6k1/5ppp/8/8/7Q/8/8/5RK1 w - - 0 1",
    solution: { from: "h4", to: "d8" },
    notation: "Qd8#",
    description: "White has one move that ends the game. Find the queen move that leaves the king with no legal escape.",
    hints: [
      "Look at the white queen on h4.",
      "The eighth rank is the key. Check which square lets the queen attack across it.",
      "Move the queen from h4 to d8: Qd8#.",
    ],
  },
  {
    id: "king-net",
    title: "Build a king net",
    theme: "Protected queen",
    difficulty: "Developing",
    fen: "7k/7p/5KQ1/8/8/8/8/8 w - - 0 1",
    solution: { from: "g6", to: "g7" },
    notation: "Qg7#",
    description: "The black king is boxed in. Find the queen move that gives check while the white king protects the finishing square.",
    hints: [
      "The queen on g6 can move one square forward.",
      "A checking queen move works only if the king cannot capture it or escape to g8.",
      "Move the queen from g6 to g7: Qg7#.",
    ],
  },
  {
    id: "cut-off-escape",
    title: "Cut off the escape",
    theme: "Restrict the king",
    difficulty: "Competitive",
    fen: "7k/4Q2p/5K2/8/8/8/8/8 w - - 0 1",
    solution: { from: "e7", to: "f8" },
    notation: "Qf8#",
    description: "The queen can take control of the eighth rank. Find the move that removes every safe square around the king.",
    hints: [
      "Look for a queen move to the eighth rank.",
      "The queen needs to control g8, while the white king covers g7.",
      "Move the queen from e7 to f8: Qf8#.",
    ],
  },
];

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const pieceSymbols: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

function getSquarePosition(square: Square) {
  return {
    x: files.indexOf(square[0]) * 12.5 + 6.25,
    y: (8 - Number(square[1])) * 12.5 + 6.25,
  };
}

export default function ChessPuzzle() {
  const [activePuzzleId, setActivePuzzleId] = useState(PUZZLES[0].id);
  const activePuzzle = PUZZLES.find((puzzle) => puzzle.id === activePuzzleId) ?? PUZZLES[0];
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | Difficulty>("All");
  const [game, setGame] = useState(() => new Chess(PUZZLES[0].fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [currentSolved, setCurrentSolved] = useState(false);
  const [timedMode, setTimedMode] = useState(false);
  const [timedStatus, setTimedStatus] = useState<"idle" | "running" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [timedSolved, setTimedSolved] = useState(0);
  const [timedAttempts, setTimedAttempts] = useState(0);
  const remainingSecondsRef = useRef(60);
  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lastMove, setLastMove] = useState<Position | null>(null);
  const [status, setStatus] = useState("White to move · Find the checkmate");
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const solved = timedMode ? currentSolved : solvedIds.includes(activePuzzle.id);
  const boardDisabled = solved || animating || (timedMode && timedStatus !== "running");
  const visiblePuzzles = difficultyFilter === "All"
    ? PUZZLES
    : PUZZLES.filter((puzzle) => puzzle.difficulty === difficultyFilter);
  const legalTargets = useMemo<Square[]>(() => selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true }).map((move) => move.to)
    : [], [game, selectedSquare]);

  const animationFrom = getSquarePosition(activePuzzle.solution.from);
  const animationTo = getSquarePosition(activePuzzle.solution.to);
  const deltaX = animationTo.x - animationFrom.x;
  const deltaY = animationTo.y - animationFrom.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  function clearAnimation() {
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }
  }

  function resetPuzzle() {
    if (timedMode && timedStatus !== "running") return;
    if (solved) return;
    clearAnimation();
    setGame(new Chess(activePuzzle.fen));
    setSelectedSquare(null);
    setCurrentSolved(false);
    setHintLevel(0);
    setAttempts(0);
    setAnimating(false);
    setLastMove(null);
    setStatus("White to move · Find the checkmate");
  }

  function selectPuzzle(puzzle: Puzzle) {
    if (timedMode && timedStatus !== "running") return;
    clearAnimation();
    setActivePuzzleId(puzzle.id);
    setGame(new Chess(puzzle.fen));
    setSelectedSquare(null);
    setCurrentSolved(false);
    setHintLevel(0);
    setAttempts(0);
    setAnimating(false);
    setLastMove(null);
    setStatus("White to move · Find the checkmate");
  }

  function startTimedSession() {
    clearAnimation();
    const firstPuzzle = PUZZLES[0];
    setActivePuzzleId(firstPuzzle.id);
    setGame(new Chess(firstPuzzle.fen));
    setSelectedSquare(null);
    setCurrentSolved(false);
    setHintLevel(0);
    setAttempts(0);
    setAnimating(false);
    setLastMove(null);
    setStatus("Sprint started. Find as many checkmates as you can.");
    remainingSecondsRef.current = 60;
    setTimeLeft(60);
    setTimedSolved(0);
    setTimedAttempts(0);
    setTimedMode(true);
    setTimedStatus("running");
  }

  function endTimedSession() {
    clearAnimation();
    setAnimating(false);
    setSelectedSquare(null);
    setTimedStatus("finished");
    setStatus("Sprint ended. Your result is shown above the puzzle library.");
  }

  function exitTimedMode() {
    clearAnimation();
    setAnimating(false);
    setSelectedSquare(null);
    setTimedMode(false);
    setTimedStatus("idle");
    setCurrentSolved(false);
    setGame(new Chess(activePuzzle.fen));
    setHintLevel(0);
    setAttempts(0);
    setLastMove(null);
    setStatus("Practice mode · Find the checkmate");
  }

  function selectDifficulty(filter: "All" | Difficulty) {
    setDifficultyFilter(filter);
    const nextPuzzles = filter === "All" ? PUZZLES : PUZZLES.filter((puzzle) => puzzle.difficulty === filter);
    if (!nextPuzzles.some((puzzle) => puzzle.id === activePuzzle.id)) {
      selectPuzzle(nextPuzzles[0]);
    }
  }

  useEffect(() => {
    if (!timedMode || timedStatus !== "running") return;

    const interval = window.setInterval(() => {
      const nextSeconds = Math.max(0, remainingSecondsRef.current - 1);
      remainingSecondsRef.current = nextSeconds;
      setTimeLeft(nextSeconds);

      if (nextSeconds === 0) {
        if (animationTimer.current) {
          clearTimeout(animationTimer.current);
          animationTimer.current = null;
        }
        setAnimating(false);
        setSelectedSquare(null);
        setTimedStatus("finished");
        setStatus("Time is up. Your 60-second sprint is complete.");
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timedMode, timedStatus]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSquare(null);
        setStatus("White to move · Find the checkmate");
      }
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        resetPuzzle();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearAnimation();
    };
    // Keep keyboard controls aligned with the current puzzle and sprint state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePuzzle.id, activePuzzle.fen, timedMode, timedStatus, solved]);

  function animateSolution() {
    setSelectedSquare(null);
    setAnimating(true);
    setStatus("Good move...");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    animationTimer.current = setTimeout(() => {
      animationTimer.current = null;
      const nextGame = new Chess(game.fen());
      try {
        const move = nextGame.move({ from: activePuzzle.solution.from, to: activePuzzle.solution.to });
        if (!move || !nextGame.isCheckmate()) {
          setAnimating(false);
          setStatus("That move does not produce checkmate. Please report this puzzle.");
          return;
        }
        setGame(nextGame);
        setLastMove(activePuzzle.solution);
        setAnimating(false);
        setCurrentSolved(true);
        setSolvedIds((current) => current.includes(activePuzzle.id) ? current : [...current, activePuzzle.id]);
        if (timedMode) setTimedSolved((current) => current + 1);
        setStatus(`Excellent. ${activePuzzle.notation} — Checkmate.`);
      } catch {
        setAnimating(false);
        setStatus("Something went wrong. Reset the puzzle and try again.");
      }
    }, reducedMotion ? 50 : 650);
  }

  function handleStandardBoardMove(from: BoardSquare, to: BoardSquare) {
    if (boardDisabled) return;
    setAttempts((current) => current + 1);
    setTotalAttempts((current) => current + 1);
    if (timedMode) setTimedAttempts((current) => current + 1);

    if (from !== activePuzzle.solution.from || to !== activePuzzle.solution.to) {
      setSelectedSquare(null);
      setStatus("That is a legal move, but it is not the puzzle solution. Look for the checkmate.");
      return;
    }

    const nextGame = new Chess(game.fen());
    try {
      const move = nextGame.move({ from, to });
      if (!move || !nextGame.isCheckmate()) {
        setSelectedSquare(null);
        setStatus("That move does not produce checkmate. Try another move.");
        return;
      }
      animateSolution();
    } catch {
      setSelectedSquare(null);
      setStatus("That move is not legal. Try again.");
    }
  }

  function handleSquareClick(square: Square) {
    if (boardDisabled) return;
    const piece = game.get(square);

    if (!selectedSquare) {
      if (!piece) {
        setStatus("Select the highlighted white queen.");
        return;
      }
      if (piece.color !== "w") {
        setStatus("It is White's move.");
        return;
      }
      if (square !== activePuzzle.solution.from) {
        setStatus("Look for the queen's winning move.");
        return;
      }
      setSelectedSquare(square);
      setStatus("Queen selected. Find the winning square.");
      return;
    }

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setStatus("White to move · Find the checkmate");
      return;
    }

    setAttempts((current) => current + 1);
    setTotalAttempts((current) => current + 1);
    if (timedMode) setTimedAttempts((current) => current + 1);

    try {
      const nextGame = new Chess(game.fen());
      const move = nextGame.move({ from: selectedSquare, to: square });
      if (!move) {
        setSelectedSquare(null);
        setStatus("That move is not legal.");
        return;
      }
      const isSolution = selectedSquare === activePuzzle.solution.from
        && square === activePuzzle.solution.to
        && nextGame.isCheckmate();
      if (isSolution) {
        animateSolution();
        return;
      }
      setSelectedSquare(null);
      setStatus(nextGame.isCheckmate()
        ? "That's checkmate, but not the solution this puzzle is teaching."
        : "Legal move, but not the winning move. Try again.");
    } catch {
      setSelectedSquare(null);
      setStatus("That move is not legal.");
    }
  }

  const nextUnsolvedPuzzle = PUZZLES.find((puzzle) => !solvedIds.includes(puzzle.id) && puzzle.id !== activePuzzle.id);
  const activePuzzleIndex = PUZZLES.findIndex((puzzle) => puzzle.id === activePuzzle.id);
  const nextTimedPuzzle = PUZZLES[(activePuzzleIndex + 1) % PUZZLES.length];
  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">PUZZLE LIBRARY / {String(PUZZLES.findIndex((puzzle) => puzzle.id === activePuzzle.id) + 1).padStart(2, "0")}</span>
          <h3 className="shop-display mt-3 text-4xl leading-none sm:text-5xl">Find the move.</h3>
          <p className="mt-3 text-sm text-[#F3EDE2]/50">{activePuzzle.title} · {activePuzzle.theme}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em]">
          <span className="border border-[#F3EDE2]/15 px-3 py-2 text-[#F3EDE2]/60">{activePuzzle.difficulty}</span>
          <span className={solved ? "text-[#F3EDE2]" : "text-[#F3EDE2]/40"}>{solved ? "Solved" : "Mate in 1"}</span>
        </div>
      </div>

      <section aria-label="Timed chess training" className="mb-8 border border-[#F3EDE2]/15 bg-[#F3EDE2]/[0.035] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/40">OPTIONAL CHALLENGE</p>
            <h4 className="mt-2 text-lg font-semibold text-[#F3EDE2]">60-second chess sprint</h4>
            <p className="mt-2 text-sm leading-6 text-[#F3EDE2]/50">
              Solve as many mate-in-one puzzles as you can before the clock runs out. Your score is for this session only.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {timedMode && <div className="min-w-20 text-right" aria-live="polite">
              <span className="block text-[9px] font-bold tracking-[0.15em] text-[#F3EDE2]/40">TIME LEFT</span>
              <span className={`font-mono text-2xl font-semibold tabular-nums ${timeLeft <= 10 && timedStatus === "running" ? "text-amber-300" : "text-[#F3EDE2]"}`}>{formattedTime}</span>
            </div>}
            {!timedMode ? (
              <button type="button" onClick={startTimedSession} className="bg-[#F3EDE2] px-5 py-3 text-xs font-bold text-[#111111] transition-opacity hover:opacity-85">Start sprint →</button>
            ) : timedStatus === "running" ? (
              <button type="button" onClick={endTimedSession} className="border border-[#F3EDE2]/25 px-4 py-3 text-xs font-semibold text-[#F3EDE2] transition-colors hover:bg-[#F3EDE2]/10">End sprint</button>
            ) : (
              <button type="button" onClick={startTimedSession} className="bg-[#F3EDE2] px-5 py-3 text-xs font-bold text-[#111111] transition-opacity hover:opacity-85">Try again →</button>
            )}
          </div>
        </div>
        {timedMode && <>
          <div className="mt-5 h-1.5 overflow-hidden bg-[#F3EDE2]/10" role="progressbar" aria-label="Sprint time remaining" aria-valuemin={0} aria-valuemax={60} aria-valuenow={timeLeft}>
            <div className={`h-full transition-[width] duration-1000 ${timeLeft <= 10 ? "bg-amber-300" : "bg-[#F3EDE2]"}`} style={{ width: `${(timeLeft / 60) * 100}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#F3EDE2]/55" aria-live="polite">
            <span><strong className="text-[#F3EDE2]">{timedSolved}</strong> solved</span>
            <span><strong className="text-[#F3EDE2]">{timedAttempts}</strong> move attempts</span>
            <span>{timedStatus === "running" ? "Sprint in progress" : `Sprint finished · ${timedSolved} solved`}</span>
          </div>
          {timedStatus === "finished" && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F3EDE2]/10 pt-4">
            <p className="text-sm text-[#F3EDE2]/65">{timedSolved === 0 ? "Keep practising and try again." : `You solved ${timedSolved} ${timedSolved === 1 ? "puzzle" : "puzzles"}. Ready for another round?`}</p>
            <button type="button" onClick={exitTimedMode} className="border border-[#F3EDE2]/25 px-4 py-2 text-xs font-semibold text-[#F3EDE2] hover:bg-[#F3EDE2]/10">Return to practice</button>
          </div>}
        </>}
      </section>

      <div className="mb-8 border-y border-[#F3EDE2]/10 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">CHOOSE A CHALLENGE</p>
            <p className="mt-2 text-xs text-[#F3EDE2]/45">Solved {solvedIds.length} of {PUZZLES.length} · {totalAttempts} total attempts</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter puzzles by difficulty">
            {(["All", "Beginner", "Developing", "Competitive"] as const).map((filter) => (
              <button key={filter} type="button" onClick={() => selectDifficulty(filter)} aria-pressed={difficultyFilter === filter}
                className={`border px-3 py-2 text-[10px] font-semibold transition-colors ${difficultyFilter === filter ? "border-[#F3EDE2] bg-[#F3EDE2] text-[#111111]" : "border-[#F3EDE2]/20 text-[#F3EDE2]/60 hover:border-[#F3EDE2]/50"}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {visiblePuzzles.map((puzzle) => {
            const active = puzzle.id === activePuzzle.id;
            const puzzleSolved = solvedIds.includes(puzzle.id);
            return (
              <button key={puzzle.id} type="button" onClick={() => selectPuzzle(puzzle)} disabled={timedMode && timedStatus !== "running"} aria-pressed={active}
                className={`border p-4 text-left transition-colors ${active ? "border-[#F3EDE2]/70 bg-[#F3EDE2]/[0.08]" : "border-[#F3EDE2]/10 hover:border-[#F3EDE2]/35"}`}>
                <span className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#F3EDE2]/40">
                  <span>{puzzle.difficulty}</span><span>{puzzleSolved ? "✓ Solved" : "Not solved"}</span>
                </span>
                <span className="mt-3 block text-sm font-semibold">{puzzle.title}</span>
                <span className="mt-1 block text-xs text-[#F3EDE2]/45">{puzzle.theme}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="mx-auto w-full max-w-[620px]">
          <div className={`relative ${solved ? "animate-[shop-checkmate_700ms_ease-out]" : ""}`}>
            <StandardChessBoard
              fen={game.fen()}
              disabled={boardDisabled}
              orientation="white"
              showCoordinates
              getLegalTargets={(square) => game.moves({ square: square as Square, verbose: true }).map((move) => move.to as BoardSquare)}
              onMove={handleStandardBoardMove}
              selectedSquare={selectedSquare as BoardSquare | null}
              lastMove={lastMove ? { from: lastMove.from as BoardSquare, to: lastMove.to as BoardSquare } : null}
              renderPiece={(piece) => <span className={piece.color === "w" ? "text-[#F3EDE2] drop-shadow-[0_4px_5px_rgba(0,0,0,0.35)]" : "text-[#111111]"}>{pieceSymbols[piece.color][piece.type]}</span>}
              className="w-full"
            />
            {solved && <div className="pointer-events-none absolute bottom-4 left-4 z-30"><span className="bg-[#111111]/90 px-3 py-2 font-mono text-xs font-bold text-[#F3EDE2]">{activePuzzle.notation}</span></div>}
          </div>
        </div>

        <div>
          <div aria-live="polite" className="border-t border-[#F3EDE2]/15 pt-6">
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">POSITION</span>
            <p className="mt-4 text-sm leading-7 text-[#F3EDE2]/60">{activePuzzle.description}</p>
            <p className={`mt-5 min-h-12 text-sm font-semibold leading-6 ${solved ? "text-[#F3EDE2]" : "text-[#F3EDE2]/80"}`}>{status}</p>
          </div>

          <div className="mt-8 border-t border-[#F3EDE2]/15 pt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">YOUR MOVE</span>
              <span className="font-mono text-sm text-[#F3EDE2]/60">{selectedSquare ? `${selectedSquare} → ?` : solved ? activePuzzle.notation : "—"}</span>
            </div>
          </div>

          {!solved && <div className="mt-8 border-t border-[#F3EDE2]/15 pt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">HINT {hintLevel}/3</span>
              <span className="font-mono text-[10px] text-[#F3EDE2]/35">{attempts} {attempts === 1 ? "ATTEMPT" : "ATTEMPTS"}</span>
            </div>
            <p className="mt-3 min-h-12 text-sm leading-6 text-[#F3EDE2]/60" aria-live="polite">{hintLevel === 0 ? "Try the position first. Reveal a hint only when you need help." : activePuzzle.hints[hintLevel - 1]}</p>
            <button type="button" onClick={() => setHintLevel((level) => Math.min(3, level + 1))} disabled={hintLevel >= 3 || animating || (timedMode && timedStatus !== "running")} className="mt-4 w-full border border-[#F3EDE2]/25 px-5 py-3 text-xs font-semibold transition-colors hover:bg-[#F3EDE2] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-40">{hintLevel >= 3 ? "Solution revealed" : hintLevel === 0 ? "Show a hint" : "Show next hint"}</button>
          </div>}

          {solved && <div className="mt-8 border-t border-[#F3EDE2]/15 pt-6">
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">SOLUTION</span>
            <p className="mt-3 text-sm leading-6 text-[#F3EDE2]/60"><strong className="text-[#F3EDE2]">{activePuzzle.notation}</strong> delivers checkmate. Review the position and look for the squares controlled by your queen and king.</p>
            {timedMode && timedStatus === "running" ? (
              <button type="button" onClick={() => selectPuzzle(nextTimedPuzzle)} className="mt-5 w-full bg-[#F3EDE2] px-5 py-3 text-xs font-bold text-[#111111] transition-opacity hover:opacity-85">Next puzzle →</button>
            ) : !timedMode && nextUnsolvedPuzzle ? (
              <button type="button" onClick={() => selectPuzzle(nextUnsolvedPuzzle)} className="mt-5 w-full bg-[#F3EDE2] px-5 py-3 text-xs font-bold text-[#111111] transition-opacity hover:opacity-85">Next unsolved puzzle →</button>
            ) : null}
          </div>}

          <button type="button" onClick={resetPuzzle} disabled={solved || animating || (timedMode && timedStatus !== "running")} className="mt-8 w-full border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold transition-all duration-300 hover:bg-[#F3EDE2] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-35">Reset puzzle</button>
          <p className="mt-4 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[#F3EDE2]/25">Press R to reset · Esc to cancel</p>
          {timedMode && timedStatus === "running" && <button type="button" onClick={exitTimedMode} className="mt-3 w-full text-xs text-[#F3EDE2]/45 underline underline-offset-4 hover:text-[#F3EDE2]">Exit sprint and return to practice</button>}
        </div>
      </div>
    </div>
  );
}
