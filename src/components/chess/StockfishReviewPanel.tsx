"use client";

import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import StandardChessBoard from "@/components/chess/StandardChessBoard";
import type { BoardSquare } from "@/components/chess/standardBoardTheme";

type Candidate = { rank: number; cp: number | null; mate: number | null; move: string; pv: string[] };
type Evaluation = { ply: number; cp: number | null; mate: number | null; bestMove: string; alternatives: Candidate[] };
type Quality = "Best move" | "Good" | "Inaccuracy" | "Mistake" | "Blunder" | "Not classified";
type MoveRecord = { ply: number; san: string; from_square: string; to_square: string; promotion: string | null };
type EngineState = "idle" | "loading" | "running" | "done" | "error";

const ENGINE_URL = "/stockfish/stockfish-19-lite-single.js";
const LOSS_THRESHOLDS = { inaccuracy: 50, mistake: 100, blunder: 200 };
const OPENING_LINES: Array<{ name: string; moves: string[] }> = [
  { name: "Ruy Lopez", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"] },
  { name: "Italian Game", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"] },
  { name: "Scotch Game", moves: ["e4", "e5", "Nf3", "Nc6", "d4"] },
  { name: "Sicilian Defence", moves: ["e4", "c5"] },
  { name: "French Defence", moves: ["e4", "e6"] },
  { name: "Caro-Kann Defence", moves: ["e4", "c6"] },
  { name: "Pirc Defence", moves: ["e4", "d6", "d4", "Nf6"] },
  { name: "Queen's Gambit", moves: ["d4", "d5", "c4"] },
  { name: "King's Indian Defence", moves: ["d4", "Nf6", "c4", "g6"] },
  { name: "London System", moves: ["d4", "d5", "Bf4"] },
  { name: "English Opening", moves: ["c4"] },
  { name: "Réti Opening", moves: ["Nf3", "d5", "c4"] },
  { name: "King's Pawn Opening", moves: ["e4"] },
  { name: "Queen's Pawn Opening", moves: ["d4"] },
];
function identifyOpening(moves: MoveRecord[]): string {
  const san = moves.map((move) => move.san);
  const match = OPENING_LINES.filter((line) => line.moves.every((move, index) => san[index] === move)).sort((a, b) => b.moves.length - a.moves.length)[0];
  return match?.name ?? (san.length >= 4 ? "Unclassified opening" : "Opening not yet established");
}

function sideToMove(fen: string): "w" | "b" {
  return fen.split(" ")[1] === "b" ? "b" : "w";
}

function toWhitePerspective(raw: number, fen: string): number {
  return sideToMove(fen) === "w" ? raw : -raw;
}

function uciToSan(fen: string, uci: string): string {
  if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(uci)) return uci || "—";
  try {
    const chess = new Chess(fen);
    const move = chess.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      ...(uci[4] ? { promotion: uci[4].toLowerCase() } : {}),
    });
    return move?.san ?? uci;
  } catch {
    return uci;
  }
}

function actualUci(move: MoveRecord): string {
  return `${move.from_square}${move.to_square}${move.promotion ?? ""}`.toLowerCase();
}

function pvToSan(fen: string, pv: string[]): string[] {
  try {
    const chess = new Chess(fen);
    const out: string[] = [];
    for (const uci of pv) {
      if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(uci)) break;
      const move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), ...(uci[4] ? { promotion: uci[4].toLowerCase() } : {}) });
      if (!move) break;
      out.push(move.san);
    }
    return out;
  } catch {
    return pv;
  }
}

function qualityFor(before: Evaluation | undefined, after: Evaluation | undefined, move: MoveRecord, fenBefore: string): { quality: Quality; lossCp: number | null } {
  if (!before || !after || before.cp === null || after.cp === null || before.mate !== null || after.mate !== null) {
    return { quality: "Not classified", lossCp: null };
  }
  const played = actualUci(move);
  if (played === before.bestMove.toLowerCase()) return { quality: "Best move", lossCp: 0 };
  const moverSign = sideToMove(fenBefore) === "w" ? 1 : -1;
  const beforeForMover = before.cp * moverSign;
  const afterForMover = after.cp * moverSign;
  const lossCp = Math.max(0, Math.round(beforeForMover - afterForMover));
  if (lossCp >= LOSS_THRESHOLDS.blunder) return { quality: "Blunder", lossCp };
  if (lossCp >= LOSS_THRESHOLDS.mistake) return { quality: "Mistake", lossCp };
  if (lossCp >= LOSS_THRESHOLDS.inaccuracy) return { quality: "Inaccuracy", lossCp };
  return { quality: "Good", lossCp };
}

function evaluationText(item: { cp: number | null; mate: number | null }): string {
  if (item.mate !== null) {
    const winningSide = item.mate > 0 ? "White" : "Black";
    return `Mate in ${Math.abs(item.mate)} for ${winningSide}`;
  }
  if (item.cp === null) return "Evaluation unavailable";
  return `${item.cp >= 0 ? "+" : "−"}${(Math.abs(item.cp) / 100).toFixed(2)} (${item.cp >= 0 ? "White" : "Black"} advantage)`;
}

function qualityClasses(quality: Quality): string {
  if (quality === "Blunder") return "border-rose-300 bg-rose-50 text-rose-900";
  if (quality === "Mistake") return "border-orange-300 bg-orange-50 text-orange-900";
  if (quality === "Inaccuracy") return "border-amber-300 bg-amber-50 text-amber-900";
  if (quality === "Best move") return "border-emerald-300 bg-emerald-50 text-emerald-900";
  if (quality === "Good") return "border-teal-200 bg-teal-50 text-teal-900";
  return "border-gray-200 bg-gray-50 text-gray-700";
}

export default function StockfishReviewPanel({ positions, moves, gameId }: { positions: string[]; moves: MoveRecord[]; gameId?: string }) {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<EngineState>("idle");
  const [status, setStatus] = useState("Analyze this game with Stockfish.");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [depth, setDepth] = useState(18);
  const [selectedPly, setSelectedPly] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    let alive = true;
    if (!gameId) return () => { alive = false; };
    (async () => {
      try {
        const response = await fetch(`/api/chess/games/${gameId}/analysis`, { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not load saved analysis.");
        if (alive && body.analysis?.positions && Array.isArray(body.analysis.positions)) {
          setEvaluations(body.analysis.positions as Evaluation[]);
          setDepth(Number(body.analysis.depth) || 18);
          setState("done");
          setStatus(`Loaded saved Stockfish analysis (depth ${body.analysis.depth}).`);
          setSaveStatus(`Saved ${new Date(body.analysis.updated_at).toLocaleString()}`);
        }
      } catch (error) {
        if (alive) setSaveStatus(error instanceof Error ? error.message : "Saved analysis could not be loaded.");
      }
    })();
    return () => { alive = false; };
  }, [gameId]);

  useEffect(() => () => { workerRef.current?.terminate(); workerRef.current = null; }, []);

  function stopWorker() {
    workerRef.current?.terminate();
    workerRef.current = null;
  }

  function analyze() {
    stopWorker();
    setEvaluations([]);
    setSelectedPly(0);
    setState("loading");
    setStatus("Starting Stockfish…");
    if (!positions.length) {
      setState("error");
      setStatus("No saved positions are available to analyze.");
      return;
    }
    try {
      const worker = new Worker(ENGINE_URL);
      workerRef.current = worker;
      const found = new Map<number, Evaluation>();
      let targetIndex = 0;
      let timeout: ReturnType<typeof setTimeout> | undefined;
      let positionCandidates = new Map<number, Candidate>();
      let positionFen = positions[0];

      const fail = (message: string) => {
        if (timeout) clearTimeout(timeout);
        stopWorker();
        setState("error");
        setStatus(message);
      };
      const armTimeout = () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fail("Stockfish timed out. Try a lower analysis depth or check the engine files."), 180000);
      };
      const sendPosition = () => {
        if (targetIndex >= positions.length) {
          if (timeout) clearTimeout(timeout);
          const result = [...found.values()].sort((a, b) => a.ply - b.ply);
          setEvaluations(result);
          setSelectedPly(0);
          setState("done");
          setStatus(`Analysis complete: ${result.length} of ${positions.length} positions evaluated at depth ${depth}.`);
          worker.postMessage("quit");
          worker.terminate();
          if (workerRef.current === worker) workerRef.current = null;
          if (gameId && result.length) {
            setSaveStatus("Saving analysis…");
            const byPly = new Map(result.map((item) => [item.ply, item]));
            const qualityRows = moves.map((move, i) => {
              const classified = qualityFor(byPly.get(i), byPly.get(i + 1), move, positions[i] ?? positions[0]);
              return { ply: move.ply, san: move.san, ...classified, best_move: byPly.get(i)?.bestMove ?? null };
            });
            const counts = {
              best: qualityRows.filter((row) => row.quality === "Best move").length,
              good: qualityRows.filter((row) => row.quality === "Good").length,
              inaccuracies: qualityRows.filter((row) => row.quality === "Inaccuracy").length,
              mistakes: qualityRows.filter((row) => row.quality === "Mistake").length,
              blunders: qualityRows.filter((row) => row.quality === "Blunder").length,
              unclassified: qualityRows.filter((row) => row.quality === "Not classified").length,
            };
            fetch(`/api/chess/games/${gameId}/analysis`, {
              method: "PUT", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ engine_version: "stockfish-19-lite-single", depth, positions: result, move_quality: qualityRows, summary: counts }),
            }).then(async (response) => {
              const body = await response.json();
              if (!response.ok) throw new Error(body.error || "Could not save analysis.");
              setSaveStatus(`Analysis saved at ${new Date(body.analysis.updated_at).toLocaleTimeString()}.`);
            }).catch((error: unknown) => setSaveStatus(error instanceof Error ? error.message : "Analysis could not be saved."));
          }
          return;
        }
        positionFen = positions[targetIndex];
        positionCandidates = new Map<number, Candidate>();
        setStatus(`Analyzing position ${targetIndex + 1} of ${positions.length}…`);
        armTimeout();
        worker.postMessage(`position fen ${positionFen}`);
        worker.postMessage(`go depth ${depth}`);
      };

      worker.onmessage = (event: MessageEvent<string>) => {
        const line = String(event.data ?? "").trim();
        if (line === "uciok") {
          worker.postMessage("setoption name MultiPV value 3");
          worker.postMessage("isready");
          return;
        }
        if (line === "readyok") {
          setState("running");
          sendPosition();
          return;
        }
        if (line.startsWith("info ") && line.includes(" score ")) {
          const rank = Number(line.match(/\bmultipv\s+(\d+)/)?.[1] ?? "1");
          const score = line.match(/\bscore\s+(cp|mate)\s+(-?\d+)/);
          const pv = line.match(/\bpv\s+(.+)$/)?.[1]?.trim().split(/\s+/) ?? [];
          if (!score || !pv.length) return;
          const raw = Number(score[2]);
          const cp = score[1] === "cp" ? toWhitePerspective(raw, positionFen) : null;
          const mate = score[1] === "mate" ? toWhitePerspective(raw, positionFen) : null;
          const existing = positionCandidates.get(rank);
          const lineDepth = Number(line.match(/\bdepth\s+(\d+)/)?.[1] ?? "0");
          const oldDepth = (existing as Candidate & { depth?: number } | undefined)?.depth ?? -1;
          if (lineDepth >= oldDepth) {
            positionCandidates.set(rank, Object.assign({ rank, cp, mate, move: pv[0], pv }, { depth: lineDepth }));
          }
          return;
        }
        if (line.startsWith("bestmove ")) {
          if (timeout) clearTimeout(timeout);
          const alternatives = [...positionCandidates.values()].sort((a, b) => a.rank - b.rank).map(({ rank, cp, mate, move, pv }) => ({ rank, cp, mate, move, pv }));
          const primary = alternatives[0];
          if (primary) {
            found.set(targetIndex, { ply: targetIndex, cp: primary.cp, mate: primary.mate, bestMove: primary.move, alternatives });
          }
          targetIndex += 1;
          sendPosition();
        }
      };
      worker.onerror = () => fail("Stockfish could not start. Check public/stockfish/stockfish-19-lite-single.js and its matching WASM/support files.");
      armTimeout();
      worker.postMessage("uci");
    } catch {
      setState("error");
      setStatus("Stockfish could not start. Check the browser engine installation and worker URL.");
    }
  }

  const evalByPly = new Map(evaluations.map((item) => [item.ply, item]));
  const report = moves.map((move, i) => {
    const before = evalByPly.get(i);
    const after = evalByPly.get(i + 1);
    const classified = qualityFor(before, after, move, positions[i] ?? positions[0]);
    const side = sideToMove(positions[i] ?? positions[0]) === "w" ? "White" : "Black";
    return { move, index: i + 1, side, before, after, ...classified };
  });
  const counts = {
    blunders: report.filter((r) => r.quality === "Blunder").length,
    mistakes: report.filter((r) => r.quality === "Mistake").length,
    inaccuracies: report.filter((r) => r.quality === "Inaccuracy").length,
    best: report.filter((r) => r.quality === "Best move").length,
    good: report.filter((r) => r.quality === "Good").length,
    unclassified: report.filter((r) => r.quality === "Not classified").length,
  };
  const current = evalByPly.get(selectedPly) ?? null;
  const currentFen = positions[selectedPly] ?? positions[0] ?? new Chess().fen();
  const bestMoveUci = current?.bestMove ?? "";
  const bestMoveHighlight = /^[a-h][1-8][a-h][1-8][qrbn]?$/i.test(bestMoveUci)
    ? { from: bestMoveUci.slice(0, 2) as BoardSquare, to: bestMoveUci.slice(2, 4) as BoardSquare }
    : null;
  const currentLine = current?.alternatives[0]?.pv ?? [];
  const maxAbs = Math.max(100, ...evaluations.map((item) => Math.abs(item.cp ?? 0)));
  const busy = state === "loading" || state === "running";

  return <section className="mt-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5" aria-label="Stockfish game analysis">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="font-bold">Stockfish Game Review</h3><p className="mt-1 text-sm text-gray-600">Deeper Stockfish evaluations, three candidate lines, opening identification and move-quality report.</p></div>
      <div className="flex flex-wrap items-center gap-2"><label className="text-sm" htmlFor="stockfish-depth">Depth</label><select id="stockfish-depth" className="rounded-lg border px-2 py-2 text-sm" value={depth} disabled={busy} onChange={(e) => setDepth(Number(e.target.value))}><option value={12}>12 · Quick</option><option value={15}>15 · Standard</option><option value={18}>18 · Deep</option><option value={20}>20 · Very deep</option><option value={22}>22 · Intensive</option></select><button onClick={analyze} disabled={busy || positions.length === 0} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Analyzing…" : state === "done" ? "Analyze again" : "Analyze game"}</button></div>
    </div>
    <p role="status" className={`mt-3 text-sm ${state === "error" ? "text-red-700" : "text-gray-600"}`}>{status}</p>
    {gameId && saveStatus && <p className="mt-1 text-xs text-gray-500" role="status">{saveStatus}</p>}
    {state === "error" && <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Confirm that the matching single-threaded browser JavaScript and WASM files are in public/stockfish/. Engine files are supplied separately.</p>}
    {evaluations.length > 0 && <>
      <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3"><p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Opening identification</p><p className="mt-1 text-lg font-bold text-indigo-950">{identifyOpening(moves)}</p><p className="mt-1 text-xs text-indigo-800">Based on the recorded opening move sequence; this is a practical opening label, not a full ECO database lookup.</p></div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {[ ["Best moves", counts.best], ["Good", counts.good], ["Inaccuracies", counts.inaccuracies], ["Mistakes", counts.mistakes], ["Blunders", counts.blunders], ["Unclassified", counts.unclassified] ].map(([label, value]) => <div key={String(label)} className="rounded-lg border p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}
      </div>
      <div className="mt-4 rounded-lg bg-gray-50 p-3"><p className="text-sm text-gray-500">Position {selectedPly} · White perspective</p><p className="text-lg font-bold">{current ? evaluationText(current) : "—"}</p></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)]">
        <div className="rounded-xl border bg-[#171916] p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-white"><div><p className="text-xs uppercase tracking-wider text-white/55">Analysis board</p><p className="font-semibold">Position {selectedPly} of {positions.length - 1}</p></div><div className="flex gap-2"><button type="button" onClick={() => setSelectedPly((value) => Math.max(0, value - 1))} disabled={selectedPly === 0} className="rounded-md border border-white/25 px-3 py-2 text-xs font-semibold disabled:opacity-35">Previous</button><button type="button" onClick={() => setSelectedPly((value) => Math.min(positions.length - 1, value + 1))} disabled={selectedPly >= positions.length - 1} className="rounded-md border border-white/25 px-3 py-2 text-xs font-semibold disabled:opacity-35">Next</button></div></div>
          <div className="mx-auto w-full max-w-[460px]"><StandardChessBoard fen={currentFen} disabled orientation="white" showCoordinates lastMove={bestMoveHighlight} className="w-full" /></div>
          <p className="mt-3 text-center text-xs text-white/60">Highlighted squares show Stockfish&apos;s recommended move.</p>
        </div>
        <div className="rounded-xl border p-4"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Recommended continuation</p><p className="mt-2 text-2xl font-bold">{current && bestMoveUci ? uciToSan(currentFen, bestMoveUci) : "Not available"}</p><p className="mt-1 text-sm text-gray-500">Best move from this position</p><div className="mt-4 border-t pt-4"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Principal variation</p><p className="mt-2 break-words text-sm leading-7">{currentLine.length ? pvToSan(currentFen, currentLine).slice(0, 12).join(" · ") : "No continuation available."}</p></div><div className="mt-4 border-t pt-4"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Position evaluation</p><p className="mt-2 text-xl font-bold">{current ? evaluationText(current) : "—"}</p></div></div>
      </div>
      <div className="mt-4"><p className="mb-2 text-sm font-semibold">Evaluation graph · White perspective</p><div className="flex h-36 items-center gap-[2px] overflow-x-auto rounded-lg border bg-white p-2" role="img" aria-label="Engine evaluation graph; teal bars indicate White advantage and rose bars indicate Black advantage"><div className="relative flex h-full min-w-full items-center">{evaluations.map((item) => { const value = item.cp ?? 0; const height = Math.max(3, Math.min(100, Math.abs(value) / maxAbs * 100)); return <button key={item.ply} title={`Position ${item.ply}: ${evaluationText(item)}`} onClick={() => setSelectedPly(item.ply)} className="relative flex h-full min-w-[7px] flex-1 items-center justify-center border-r border-gray-100" aria-label={`Select position ${item.ply}`}><span className={`absolute w-full rounded-sm ${value >= 0 ? "bg-teal-600" : "bg-rose-500"}`} style={{ height: `${height}%`, top: `${50 - height / 2}%`, opacity: selectedPly === item.ply ? 1 : 0.65 }} /></button>; })}</div></div><div className="mt-2 flex justify-between text-xs text-gray-500"><span>Black advantage</span><span>White advantage</span></div></div>
      <div className="mt-5"><h4 className="font-semibold">Best-move alternatives at selected position</h4><p className="mt-1 text-sm text-gray-500">Choose a position on the graph to inspect engine candidate lines.</p>{current?.alternatives.length ? <div className="mt-2 grid gap-2 sm:grid-cols-3">{current.alternatives.map((candidate) => <div key={`${current.ply}-${candidate.rank}`} className="rounded-lg border p-3"><p className="text-xs text-gray-500">Candidate {candidate.rank}</p><p className="mt-1 text-lg font-bold">{uciToSan(positions[current.ply], candidate.move)}</p><p className="text-sm">{evaluationText(candidate)}</p><p className="mt-2 break-words text-xs text-gray-500">Line: {pvToSan(positions[current.ply], candidate.pv).slice(0, 8).join(" ")}</p></div>)}</div> : <p className="mt-2 text-sm text-gray-500">No candidate lines for this position yet.</p>}</div>
      <div className="mt-5"><h4 className="font-semibold">Move-quality report</h4><p className="mt-1 text-sm text-gray-500">Heuristic thresholds: inaccuracy ≥ 0.50 pawns, mistake ≥ 1.00 pawn, blunder ≥ 2.00 pawns lost from the mover&apos;s perspective. Mate-score positions are left unclassified.</p><div className="mt-3 max-h-[480px] overflow-auto rounded-lg border"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-gray-50"><tr><th className="p-2">Move</th><th className="p-2">Player</th><th className="p-2">Quality</th><th className="p-2">Loss</th><th className="p-2">Engine alternative</th></tr></thead><tbody>{report.map((row) => <tr key={row.move.ply} className={`border-t ${selectedPly === row.index - 1 ? "bg-teal-50" : ""}`}><td className="p-2 font-semibold"><button type="button" onClick={() => setSelectedPly(row.index - 1)} className="text-left underline-offset-2 hover:underline">{row.index % 2 === 1 ? `${Math.ceil(row.index / 2)}.` : `${Math.ceil(row.index / 2)}…`} {row.move.san}</button></td><td className="p-2">{row.side}</td><td className="p-2"><span className={`inline-block rounded-full border px-2 py-1 text-xs font-semibold ${qualityClasses(row.quality)}`}>{row.quality}</span></td><td className="p-2">{row.lossCp === null ? "—" : `${(row.lossCp / 100).toFixed(2)}`}</td><td className="p-2">{row.before ? uciToSan(positions[row.index - 1], row.before.bestMove) : "—"}</td></tr>)}</tbody></table></div></div>
    </>}
  </section>;
}
