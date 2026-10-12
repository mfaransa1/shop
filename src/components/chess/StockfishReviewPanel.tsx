"use client";

import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";

type Candidate = { rank: number; cp: number | null; mate: number | null; move: string; pv: string[] };
type Evaluation = { ply: number; cp: number | null; mate: number | null; bestMove: string; alternatives: Candidate[] };
type Quality = "Best move" | "Good" | "Inaccuracy" | "Mistake" | "Blunder" | "Not classified";
type MoveRecord = { ply: number; san: string; from_square: string; to_square: string; promotion: string | null };
type EngineState = "idle" | "loading" | "running" | "done" | "error";

const ENGINE_URL = "/stockfish/stockfish-19-lite-single.js";
const LOSS_THRESHOLDS = { inaccuracy: 50, mistake: 100, blunder: 200 };

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
    const side = item.mate > 0 ? "side to move wins" : "side to move loses";
    return `Mate ${item.mate > 0 ? "in" : "against in"} ${Math.abs(item.mate)} (${side})`;
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
  const [depth, setDepth] = useState(12);
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
          setDepth(Number(body.analysis.depth) || 12);
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
        timeout = setTimeout(() => fail("Stockfish timed out. Check the engine files and browser console, then try again."), 90000);
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
  const maxAbs = Math.max(100, ...evaluations.map((item) => Math.abs(item.cp ?? 0)));
  const busy = state === "loading" || state === "running";

  return <section className="mt-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5" aria-label="Stockfish game analysis">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="font-bold">Stockfish Game Review</h3><p className="mt-1 text-sm text-gray-600">Engine evaluations, best-move alternatives and move-quality report.</p></div>
      <div className="flex flex-wrap items-center gap-2"><label className="text-sm" htmlFor="stockfish-depth">Depth</label><select id="stockfish-depth" className="rounded-lg border px-2 py-2 text-sm" value={depth} disabled={busy} onChange={(e) => setDepth(Number(e.target.value))}><option value={8}>8</option><option value={10}>10</option><option value={12}>12</option><option value={15}>15</option></select><button onClick={analyze} disabled={busy || positions.length === 0} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Analyzing…" : state === "done" ? "Analyze again" : "Analyze game"}</button></div>
    </div>
    <p role="status" className={`mt-3 text-sm ${state === "error" ? "text-red-700" : "text-gray-600"}`}>{status}</p>
    {gameId && saveStatus && <p className="mt-1 text-xs text-gray-500" role="status">{saveStatus}</p>}
    {state === "error" && <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Confirm that the matching single-threaded browser JavaScript and WASM files are in public/stockfish/. Engine files are supplied separately.</p>}
    {evaluations.length > 0 && <>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {[ ["Best moves", counts.best], ["Good", counts.good], ["Inaccuracies", counts.inaccuracies], ["Mistakes", counts.mistakes], ["Blunders", counts.blunders], ["Unclassified", counts.unclassified] ].map(([label, value]) => <div key={String(label)} className="rounded-lg border p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}
      </div>
      <div className="mt-4 rounded-lg bg-gray-50 p-3"><p className="text-sm text-gray-500">Position {selectedPly} · White perspective</p><p className="text-lg font-bold">{current ? evaluationText(current) : "—"}</p></div>
      <div className="mt-4"><p className="mb-2 text-sm font-semibold">Evaluation graph · White perspective</p><div className="flex h-36 items-center gap-[2px] overflow-x-auto rounded-lg border bg-white p-2" role="img" aria-label="Engine evaluation graph; teal bars indicate White advantage and rose bars indicate Black advantage"><div className="relative flex h-full min-w-full items-center">{evaluations.map((item) => { const value = item.cp ?? 0; const height = Math.max(3, Math.min(100, Math.abs(value) / maxAbs * 100)); return <button key={item.ply} title={`Position ${item.ply}: ${evaluationText(item)}`} onClick={() => setSelectedPly(item.ply)} className="relative flex h-full min-w-[7px] flex-1 items-center justify-center border-r border-gray-100" aria-label={`Select position ${item.ply}`}><span className={`absolute w-full rounded-sm ${value >= 0 ? "bg-teal-600" : "bg-rose-500"}`} style={{ height: `${height}%`, top: `${50 - height / 2}%`, opacity: selectedPly === item.ply ? 1 : 0.65 }} /></button>; })}</div></div><div className="mt-2 flex justify-between text-xs text-gray-500"><span>Black advantage</span><span>White advantage</span></div></div>
      <div className="mt-5"><h4 className="font-semibold">Best-move alternatives at selected position</h4><p className="mt-1 text-sm text-gray-500">Choose a position on the graph to inspect engine candidate lines.</p>{current?.alternatives.length ? <div className="mt-2 grid gap-2 sm:grid-cols-3">{current.alternatives.map((candidate) => <div key={`${current.ply}-${candidate.rank}`} className="rounded-lg border p-3"><p className="text-xs text-gray-500">Candidate {candidate.rank}</p><p className="mt-1 text-lg font-bold">{uciToSan(positions[current.ply], candidate.move)}</p><p className="text-sm">{evaluationText(candidate)}</p><p className="mt-2 break-words text-xs text-gray-500">Line: {pvToSan(positions[current.ply], candidate.pv).slice(0, 8).join(" ")}</p></div>)}</div> : <p className="mt-2 text-sm text-gray-500">No candidate lines for this position yet.</p>}</div>
      <div className="mt-5"><h4 className="font-semibold">Move-quality report</h4><p className="mt-1 text-sm text-gray-500">Heuristic thresholds: inaccuracy ≥ 0.50 pawns, mistake ≥ 1.00 pawn, blunder ≥ 2.00 pawns lost from the mover&apos;s perspective. Mate-score positions are left unclassified.</p><div className="mt-3 max-h-[480px] overflow-auto rounded-lg border"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-gray-50"><tr><th className="p-2">Move</th><th className="p-2">Player</th><th className="p-2">Quality</th><th className="p-2">Loss</th><th className="p-2">Engine alternative</th></tr></thead><tbody>{report.map((row) => <tr key={row.move.ply} className="border-t"><td className="p-2 font-semibold">{row.index % 2 === 1 ? `${Math.ceil(row.index / 2)}.` : `${Math.ceil(row.index / 2)}…`} {row.move.san}</td><td className="p-2">{row.side}</td><td className="p-2"><span className={`inline-block rounded-full border px-2 py-1 text-xs font-semibold ${qualityClasses(row.quality)}`}>{row.quality}</span></td><td className="p-2">{row.lossCp === null ? "—" : `${(row.lossCp / 100).toFixed(2)}`}</td><td className="p-2">{row.before ? uciToSan(positions[row.index - 1], row.before.bestMove) : "—"}</td></tr>)}</tbody></table></div></div>
    </>}
  </section>;
}
