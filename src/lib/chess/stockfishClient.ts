export type StockfishScore = { kind: "cp" | "mate"; value: number };
export type StockfishResult = { bestMove: string; score: StockfishScore | null; pv: string[]; depth: number };

const ENGINE_URL = "/stockfish/stockfish-19-lite-single.js";
const STARTUP_TIMEOUT_MS = 45_000;
const READY_TIMEOUT_MS = 15_000;

type LineListener = (line: string) => void;

/** Browser UCI client for Stockfish 19 Lite single-threaded WASM in public/stockfish. */
export class StockfishClient {
  private worker: Worker;
  private listeners = new Set<LineListener>();
  private ready: Promise<void>;
  private busy = false;
  private disposed = false;
  private startupError: Error | null = null;

  constructor() {
    try {
      this.worker = new Worker(ENGINE_URL);
    } catch (error) {
      throw new Error(`Could not create the Stockfish worker at ${ENGINE_URL}. ${this.errorText(error)}`);
    }

    this.worker.addEventListener("message", (event: MessageEvent<unknown>) => {
      const data = typeof event.data === "string" ? event.data : String(event.data ?? "");
      for (const line of data.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
        this.listeners.forEach((listener) => listener(line));
      }
    });

    this.worker.addEventListener("error", (event: ErrorEvent) => {
      const detail = event.message || "Unknown worker startup error";
      this.startupError = new Error(`Stockfish worker failed to load. Check ${ENGINE_URL} and its matching WASM file. ${detail}`);
      this.rejectAll(this.startupError);
    });

    this.worker.addEventListener("messageerror", () => {
      this.startupError = new Error("Stockfish worker returned a message that the browser could not decode.");
      this.rejectAll(this.startupError);
    });

    // Register the listener before sending `uci`; Stockfish may answer immediately.
    this.ready = this.command("uci", "uciok", STARTUP_TIMEOUT_MS)
      .then(() => this.command("isready", "readyok", READY_TIMEOUT_MS))
      .catch((error: unknown) => {
        const detail = this.errorText(error);
        throw new Error(
          `Stockfish failed to initialize at ${ENGINE_URL}. ` +
          `Confirm that public/stockfish/ contains stockfish-19-lite-single.js and ` +
          `stockfish-19-lite-single.wasm, with the original filenames preserved. ${detail}`,
        );
      });
  }

  private errorText(error: unknown): string {
    return error instanceof Error ? error.message : String(error ?? "Unknown error");
  }

  private rejectAll(error: Error): void {
    // Wake any pending protocol waiters immediately after a worker failure.
    for (const listener of [...this.listeners]) listener(`__stockfish_error__ ${error.message}`);
  }

  private waitFor(match: string, timeoutMs: number, capture?: (line: string) => void): Promise<void> {
    if (this.disposed) return Promise.reject(new Error("Stockfish client has been disposed."));
    if (this.startupError) return Promise.reject(this.startupError);

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeout);
        this.listeners.delete(listener);
      };
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Stockfish timed out waiting for ${match} after ${Math.round(timeoutMs / 1000)} seconds.`));
      }, timeoutMs);
      const listener = (line: string) => {
        if (line.startsWith("__stockfish_error__")) {
          cleanup();
          reject(new Error(line.replace("__stockfish_error__", "").trim()));
          return;
        }
        capture?.(line);
        if (line.includes(match)) {
          cleanup();
          resolve();
        }
      };
      this.listeners.add(listener);
    });
  }

  private command(command: string, expected: string, timeoutMs = READY_TIMEOUT_MS): Promise<void> {
    const response = this.waitFor(expected, timeoutMs);
    try {
      this.worker.postMessage(command);
    } catch (error) {
      return Promise.reject(new Error(`Could not send '${command}' to Stockfish. ${this.errorText(error)}`));
    }
    return response;
  }

  async configure(skill: number, thinkMs: number): Promise<void> {
    await this.ready;
    if (this.disposed) throw new Error("Stockfish client has been disposed.");
    const clampedSkill = Math.max(0, Math.min(20, Math.round(skill)));
    this.worker.postMessage(`setoption name Skill Level value ${clampedSkill}`);
    // Move Overhead is not thinking time; actual time is controlled by `go movetime` below.
    await this.command("isready", "readyok", READY_TIMEOUT_MS);
    void thinkMs; // Kept in the public API for compatibility with existing callers.
  }

  async bestMove(fen: string, skill: number, thinkMs: number): Promise<StockfishResult> {
    if (this.busy) throw new Error("Stockfish is already thinking. Please wait.");
    this.busy = true;
    try {
      await this.configure(skill, thinkMs);
      this.worker.postMessage(`position fen ${fen}`);
      const result: StockfishResult = { bestMove: "", score: null, pv: [], depth: 0 };
      const moveTime = Math.max(100, Math.min(10_000, Math.round(thinkMs)));
      const wait = this.waitFor("bestmove", moveTime + 15_000, (line) => {
        const depth = line.match(/\bdepth (\d+)/);
        if (depth) result.depth = Number(depth[1]);
        const score = line.match(/\bscore (cp|mate) (-?\d+)/);
        if (score) result.score = { kind: score[1] as "cp" | "mate", value: Number(score[2]) };
        const pv = line.match(/\bpv (.+)$/);
        if (pv) result.pv = pv[1].trim().split(/\s+/);
        const best = line.match(/^bestmove\s+(\S+)/);
        if (best) result.bestMove = best[1];
      });
      this.worker.postMessage(`go movetime ${moveTime}`);
      await wait;
      if (!result.bestMove || result.bestMove === "(none)" || result.bestMove === "0000") {
        throw new Error("Stockfish did not return a move. The position may already be terminal.");
      }
      return result;
    } finally {
      this.busy = false;
    }
  }

  stop(): void {
    if (!this.disposed) this.worker.postMessage("stop");
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.worker.terminate();
    this.listeners.clear();
  }
}
