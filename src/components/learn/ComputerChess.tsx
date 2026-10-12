"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square, type Move } from "chess.js";
import Link from "next/link";
import StandardChessBoard from "@/components/chess/StandardChessBoard";
import type { BoardSquare } from "@/components/chess/standardBoardTheme";
import { StockfishClient, type StockfishResult } from "@/lib/chess/stockfishClient";

const PIECE_VALUES: Record<string, number> = { p: 100, n: 320, b: 335, r: 500, q: 900, k: 0 };

type Difficulty = "beginner" | "easy" | "medium" | "hard";

const DIFFICULTIES: Record<Difficulty, { label: string; skill: number; depth: number; description: string }> = {
  beginner: { label: "Beginner", skill: 0, depth: 1, description: "Stockfish at a deliberately low playing strength." },
  easy: { label: "Easy", skill: 5, depth: 2, description: "A casual opponent that still spots many tactics." },
  medium: { label: "Medium", skill: 10, depth: 3, description: "A balanced opponent for regular practice." },
  hard: { label: "Hard", skill: 16, depth: 4, description: "A strong tactical opponent. Increase thinking time for deeper play." },
};

function evaluatePosition(game: Chess): number {
  if (game.isCheckmate()) return game.turn() === "w" ? -100000 : 100000;
  if (game.isDraw()) return 0;
  let score = 0;
  const board = game.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] ?? 0;
      const advance = piece.type === "p" ? (piece.color === "w" ? 6 - row : row - 1) * 7 : 0;
      const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col);
      const centerBonus = piece.type === "n" || piece.type === "b" ? Math.round((7 - centerDistance) * 4) : 0;
      score += (piece.color === "w" ? 1 : -1) * (value + advance + centerBonus);
    }
  }
  // A small check bonus encourages forcing moves without dominating material.
  if (game.isCheck()) score += game.turn() === "w" ? -18 : 18;
  return score;
}

function moveOrderScore(move: Move): number {
  let score = 0;
  if (move.captured) score += 10 * (PIECE_VALUES[move.captured] ?? 0) - (PIECE_VALUES[move.piece] ?? 0);
  if (move.promotion) score += PIECE_VALUES[move.promotion] ?? 0;
  if (move.san.includes("+")) score += 40;
  if (move.san.includes("#")) score += 100000;
  return score;
}

function searchBestMove(game: Chess, depth: number, alpha: number, beta: number): number {
  if (depth <= 0 || game.isGameOver()) return evaluatePosition(game);
  const moves = game.moves({ verbose: true }).sort((a, b) => moveOrderScore(b) - moveOrderScore(a));
  if (!moves.length) return evaluatePosition(game);
  const maximizing = game.turn() === "w";
  let best = maximizing ? -Infinity : Infinity;
  for (const move of moves) {
    const child = new Chess(game.fen());
    child.move({ from: move.from, to: move.to, ...(move.promotion ? { promotion: move.promotion } : {}) });
    const score = searchBestMove(child, depth - 1, alpha, beta);
    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

function chooseComputerMove(game: Chess, difficulty: Difficulty): Move | null {
  const moves = game.moves({ verbose: true });
  if (!moves.length) return null;
  // Beginner deliberately selects among several plausible moves to keep play forgiving.
  if (difficulty === "beginner") {
    const ranked = moves.map((move) => {
      const candidate = new Chess(game.fen());
      candidate.move({ from: move.from, to: move.to, ...(move.promotion ? { promotion: move.promotion } : {}) });
      return { move, score: evaluatePosition(candidate) + Math.random() * 180 };
    }).sort((a, b) => a.score - b.score);
    return ranked[Math.floor(Math.random() * Math.min(5, ranked.length))]?.move ?? moves[0];
  }
  const depth = DIFFICULTIES[difficulty].depth;
  const scored = moves.map((move) => {
    const candidate = new Chess(game.fen());
    candidate.move({ from: move.from, to: move.to, ...(move.promotion ? { promotion: move.promotion } : {}) });
    const score = searchBestMove(candidate, depth - 1, -Infinity, Infinity);
    return { move, score: score + (Math.random() * (difficulty === "easy" ? 18 : difficulty === "medium" ? 4 : 0)) };
  });
  // The computer is Black, so it minimizes the White-perspective evaluation.
  scored.sort((a, b) => a.score - b.score);
  return scored[0]?.move ?? null;
}

function boardResult(game: Chess): "win" | "loss" | "draw" {
  if (game.isCheckmate()) return game.turn() === "b" ? "win" : "loss";
  return "draw";
}

export default function ComputerChess() {
  const gameRef = useRef(new Chess());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultSavedRef = useRef(false);
  const stockfishRef = useRef<StockfishClient | null>(null);
  const positionsRef = useRef<Array<{ ply: number; san: string; fen: string }>>([{ ply: 0, san: "Start position", fen: new Chess().fen() }]);
  const gameIdRef = useRef(`computer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState<Square | null>(null);
  const [botThinking, setBotThinking] = useState(false);
  const [result, setResult] = useState<"win" | "loss" | "draw" | null>(null);
  const [status, setStatus] = useState("You play White. Make a move to begin.");
  const [saveMessage, setSaveMessage] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [thinkMs, setThinkMs] = useState(700);
  const [engineReady, setEngineReady] = useState(false);
  const [engineError, setEngineError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisRows, setAnalysisRows] = useState<Array<{ ply: number; san: string; bestMove: string; score: string; depth: number }>>([]);
  const game = gameRef.current;
  const legalTargets = useMemo(() => selected ? game.moves({ square: selected, verbose: true }).map((move) => move.to) : [], [version, selected, game]);

  useEffect(() => {
    let mounted = true;
    try {
      const client = new StockfishClient();
      stockfishRef.current = client;
      client.bestMove(new Chess().fen(), 0, 100).then(() => { if (mounted) setEngineReady(true); }).catch((error: unknown) => { if (mounted) setEngineError(error instanceof Error ? error.message : "Could not load Stockfish."); });
    } catch (error) { setEngineError(error instanceof Error ? error.message : "Could not load Stockfish."); }
    return () => { mounted = false; if (timerRef.current) clearTimeout(timerRef.current); stockfishRef.current?.dispose(); stockfishRef.current = null; };
  }, []);

  async function saveFinishedGame(finalGame: Chess) {
    if (resultSavedRef.current) return;
    resultSavedRef.current = true;
    const gameResult = boardResult(finalGame);
    setResult(gameResult);
    setStatus(gameResult === "win" ? "Checkmate! You won." : gameResult === "loss" ? "The computer won this game. Review the moves and try again." : "The game ended in a draw.");
    try {
      const response = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityType: "game_completed",
          activityKey: gameIdRef.current,
          score: gameResult === "win" ? 100 : gameResult === "draw" ? 60 : 25,
          completed: true,
          metadata: { result: gameResult, moves: finalGame.history().length, pgn: finalGame.pgn().slice(0, 1800), opponent: `Stockfish (${DIFFICULTIES[difficulty].label})`, difficulty, skill: DIFFICULTIES[difficulty].skill, thinkMs },
        }),
      });
      if (response.status === 401) setSaveMessage("Game finished. Sign in to save it to your dashboard.");
      else if (response.ok) setSaveMessage("Game result saved to your player dashboard.");
      else setSaveMessage("Game finished, but its result could not be saved.");
    } catch {
      setSaveMessage("Game finished, but its result could not be saved. Check your connection.");
    }
  }

  function playComputerTurn() {
    setBotThinking(true);
    setStatus("The computer is thinking…");
    timerRef.current = setTimeout(async () => {
      timerRef.current = null;
      const nextGame = new Chess(gameRef.current.fen());
      try {
        if (!stockfishRef.current) throw new Error("Stockfish is not loaded. Check that /public/stockfish/stockfish.js and its WASM files are installed.");
        const engineMove = await stockfishRef.current.bestMove(nextGame.fen(), DIFFICULTIES[difficulty].skill, thinkMs);
        const uci = engineMove.bestMove;
        const move = nextGame.move({ from: uci.slice(0, 2) as Square, to: uci.slice(2, 4) as Square, ...(uci.length > 4 ? { promotion: uci[4] as "q" | "r" | "b" | "n" } : {}) });
        positionsRef.current = [...positionsRef.current, { ply: nextGame.history().length, san: move.san, fen: nextGame.fen() }];
        gameRef.current = nextGame;
        setVersion((value) => value + 1);
        setBotThinking(false);
        if (nextGame.isGameOver()) void saveFinishedGame(nextGame);
        else setStatus(nextGame.isCheck() ? "Stockfish gives check. Find a safe response." : "Your move.");
      } catch (error) {
        setBotThinking(false);
        setEngineError(error instanceof Error ? error.message : "Stockfish could not make a move.");
        setStatus("The chess engine could not move. Check the Stockfish installation and try a new game.");
      }
    }, 150);
  }

  function handleBoardMove(from: BoardSquare, to: BoardSquare) {
    const square = to as Square;
    const source = from as Square;
    if (botThinking || result || game.isGameOver() || game.turn() !== "w") return;
    const piece = game.get(source);
    const legalMove = game.moves({ square: source, verbose: true }).find((move) => move.to === square);
    if (!selected || selected !== source || !piece || piece.color !== "w" || !legalMove) {
      setSelected(null);
      setStatus("That is not a legal move. Select one of your white pieces and a highlighted destination.");
      return;
    }

    const nextGame = new Chess(game.fen());
    try {
      nextGame.move({ from: source, to: square, ...(legalMove.promotion ? { promotion: "q" } : {}) });
      const playedMove = nextGame.history({ verbose: true }).at(-1);
      positionsRef.current = [...positionsRef.current, { ply: nextGame.history().length, san: playedMove?.san ?? `${source}-${square}`, fen: nextGame.fen() }];
      gameRef.current = nextGame;
      setSelected(null);
      setVersion((value) => value + 1);
      if (nextGame.isGameOver()) void saveFinishedGame(nextGame);
      else playComputerTurn();
    } catch {
      setSelected(null);
      setStatus("That move could not be played. Try again.");
    }
  }

  function resetGame() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    gameRef.current = new Chess();
    positionsRef.current = [{ ply: 0, san: "Start position", fen: new Chess().fen() }];
    setAnalysisRows([]);
    setEngineError("");
    gameIdRef.current = `computer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    resultSavedRef.current = false;
    setVersion((value) => value + 1);
    setSelected(null);
    setBotThinking(false);
    setResult(null);
    setSaveMessage("");
    setStatus("You play White. Make a move to begin.");
  }

  async function analyzeCompletedGame() {
    if (!game.isGameOver()) return;
    if (!stockfishRef.current) { setEngineError("Stockfish is unavailable. Install the browser engine files in public/stockfish/."); return; }
    setAnalyzing(true); setAnalysisRows([]); setEngineError("");
    const rows: Array<{ ply: number; san: string; bestMove: string; score: string; depth: number }> = [];
    try {
      for (const position of positionsRef.current.filter((item) => !new Chess(item.fen).isGameOver())) {
        const result: StockfishResult = await stockfishRef.current.bestMove(position.fen, 12, Math.max(250, thinkMs));
        const score = result.score ? result.score.kind === "mate" ? `Mate in ${result.score.value}` : `${(result.score.value / 100).toFixed(2)} pawns` : "—";
        rows.push({ ply: position.ply, san: position.san, bestMove: result.bestMove, score, depth: result.depth });
        setAnalysisRows([...rows]);
      }
    } catch (error) { setEngineError(error instanceof Error ? error.message : "Game analysis failed."); }
    finally { setAnalyzing(false); }
  }

  function resign() {
    if (result || game.isGameOver() || botThinking) return;
    resultSavedRef.current = true;
    setResult("loss");
    setStatus("You resigned. Start a new game whenever you're ready.");
    setSaveMessage("Resigned games are not included in completed-game statistics.");
  }

  return (
    <section id="play-computer" className="scroll-mt-24 border border-shop-border bg-[#111111] p-5 text-[#F3EDE2] sm:p-8 lg:p-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(480px,620px)] xl:items-start">
        <div>
          <p className="shop-eyebrow text-[#F3EDE2]/45">Practice game · {DIFFICULTIES[difficulty].label} · White to move</p>
          <h2 className="shop-display mt-4 text-4xl leading-none sm:text-5xl">Play the computer.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#F3EDE2]/60">Choose a level to match your skills. Higher levels search further ahead and look for tactics. Games are saved to your dashboard when you are signed in.</p>
          <div className="mt-5 max-w-sm">
            <label htmlFor="computer-difficulty" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#F3EDE2]/65">Computer level</label>
            <select id="computer-difficulty" value={difficulty} onChange={(event) => { setDifficulty(event.target.value as Difficulty); resetGame(); }} disabled={botThinking} className="w-full border border-[#F3EDE2]/25 bg-[#191919] px-3 py-3 text-sm text-[#F3EDE2] outline-none focus:border-[#F3EDE2]/70 disabled:opacity-50">
              {Object.entries(DIFFICULTIES).map(([value, level]) => <option key={value} value={value}>{level.label}</option>)}
            </select>
            <p className="mt-2 text-xs leading-5 text-[#F3EDE2]/45">{DIFFICULTIES[difficulty].description}</p>
            <label htmlFor="computer-thinking-time" className="mb-2 mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#F3EDE2]/65">Thinking time</label>
            <select id="computer-thinking-time" value={thinkMs} onChange={(event) => setThinkMs(Number(event.target.value))} disabled={botThinking || analyzing} className="w-full border border-[#F3EDE2]/25 bg-[#191919] px-3 py-3 text-sm text-[#F3EDE2] outline-none focus:border-[#F3EDE2]/70 disabled:opacity-50">
              <option value={250}>Fast · 0.25 seconds</option><option value={500}>Quick · 0.5 seconds</option><option value={700}>Standard · 0.7 seconds</option><option value={1500}>Thoughtful · 1.5 seconds</option><option value={3000}>Deep · 3 seconds</option><option value={5000}>Very deep · 5 seconds</option>
            </select>
            <p className="mt-2 text-xs text-[#F3EDE2]/45">{engineReady ? "Stockfish ready" : engineError ? "Engine unavailable" : "Loading Stockfish…"}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#F3EDE2]/65"><span className="border border-[#F3EDE2]/20 px-3 py-2">Moves: {game.history().length}</span><span className="border border-[#F3EDE2]/20 px-3 py-2">Turn: {game.turn() === "w" ? "White" : "Black"}</span><span className="border border-[#F3EDE2]/20 px-3 py-2">{game.isCheck() ? "Check" : "No check"}</span></div>
          <p role="status" aria-live="polite" className="mt-5 min-h-12 text-sm font-semibold leading-6">{status}</p>
          {saveMessage && <p role="status" className="mt-2 text-xs leading-5 text-[#F3EDE2]/55">{saveMessage}{saveMessage.includes("Sign in") && <> <Link href="/auth/login?next=%2Flearn%23play-computer" className="underline underline-offset-4">Sign in</Link></>}</p>}
          {engineError && <p role="alert" className="mt-3 text-xs leading-5 text-amber-200">{engineError}</p>}
          <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={resetGame} className="bg-[#F3EDE2] px-5 py-3 text-xs font-bold text-[#111111] hover:opacity-85">New game</button><button type="button" disabled={Boolean(result) || game.isGameOver() || botThinking} onClick={resign} className="border border-[#F3EDE2]/25 px-5 py-3 text-xs font-semibold hover:border-[#F3EDE2]/60 disabled:opacity-40">Resign</button></div>
        </div>
        <div className="mx-auto w-full max-w-[620px]"><StandardChessBoard fen={game.fen()} selectedSquare={selected as BoardSquare | null} onSelectSquare={(square) => setSelected(square as Square | null)} legalTargets={legalTargets as BoardSquare[]} onMove={handleBoardMove} disabled={botThinking || Boolean(result) || game.isGameOver()} showCoordinates /><p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[#F3EDE2]/35">Select a piece, then select its destination</p></div>
      </div>
      {result && <div className="mt-8 border-t border-[#F3EDE2]/15 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-lg font-bold">Game analysis</h3><p className="mt-1 text-sm text-[#F3EDE2]/60">Review the engine's best move and evaluation for each position.</p></div><button type="button" onClick={() => void analyzeCompletedGame()} disabled={analyzing || !engineReady} className="bg-[#F3EDE2] px-5 py-3 text-xs font-bold text-[#111111] disabled:opacity-40">{analyzing ? "Analyzing positions…" : analysisRows.length ? "Analyze again" : "Analyze game"}</button></div>
        {analysisRows.length > 0 && <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><thead className="text-[#F3EDE2]/50"><tr><th className="py-2 pr-4">Ply</th><th className="py-2 pr-4">Played move</th><th className="py-2 pr-4">Engine best move (UCI)</th><th className="py-2 pr-4">Eval</th><th className="py-2">Depth</th></tr></thead><tbody>{analysisRows.map((row) => <tr key={`${row.ply}-${row.bestMove}`} className="border-t border-[#F3EDE2]/10"><td className="py-2 pr-4">{row.ply}</td><td className="py-2 pr-4">{row.san}</td><td className="py-2 pr-4 font-mono">{row.bestMove}</td><td className="py-2 pr-4">{row.score}</td><td className="py-2">{row.depth}</td></tr>)}</tbody></table></div>}
      </div>}
    </section>
  );
}
