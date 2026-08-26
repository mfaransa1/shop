"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Chess,
  type Color,
  type PieceSymbol,
  type Square,
} from "chess.js";

type Position = {
  from: Square;
  to: Square;
};

/*
 * SHoP Mate-in-One puzzle.
 *
 * 8  . . . . . . ♚ .
 * 7  . . . . . ♟ ♟ ♟
 * 6  . . . . . . . .
 * 5  . . . . . . . .
 * 4  . . . . . . . ♕
 * 3  . . . . . . . .
 * 2  . . . . . . . .
 * 1  . . . . . ♖ ♔ .
 *
 * White: Kg1, Rf1, Qh4
 * Black: Kg8, pawns f7/g7/h7
 *
 * Solution: Qd8#
 */
const PUZZLE_FEN =
  "6k1/5ppp/8/8/7Q/8/8/5RK1 w - - 0 1";

const SOLUTION: Position = {
  from: "h4",
  to: "d8",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

const pieceSymbols: Record<
  Color,
  Record<PieceSymbol, string>
> = {
  w: {
    k: "♔",
    q: "♕",
    r: "♖",
    b: "♗",
    n: "♘",
    p: "♙",
  },
  b: {
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  },
};

function getSquarePosition(square: Square) {
  const fileIndex = files.indexOf(square[0]);
  const rank = Number(square[1]);

  return {
    x: fileIndex * 12.5 + 6.25,
    y: (8 - rank) * 12.5 + 6.25,
  };
}

export default function ChessPuzzle() {
  const [game, setGame] = useState(
    () => new Chess(PUZZLE_FEN)
  );

  const [selectedSquare, setSelectedSquare] =
    useState<Square | null>(null);

  const [solved, setSolved] = useState(false);

  const [animating, setAnimating] = useState(false);

  const [lastMove, setLastMove] =
    useState<Position | null>(null);

  const [status, setStatus] = useState(
    "White to move · Find the checkmate"
  );

  const checkmateSound =
    useRef<HTMLAudioElement | null>(null);

  const animationTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const board = useMemo(
    () => game.board(),
    [game]
  );

  /*
   * Preload the real checkmate sound.
   */
  useEffect(() => {
    const audio = new Audio(
      "/sounds/checkmate.mp3"
    );

    audio.preload = "auto";
    audio.volume = 0.6;

    checkmateSound.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      checkmateSound.current = null;
    };
  }, []);

  /*
   * Responsive h4 → d8 geometry.
   */
  const animationFrom = getSquarePosition(
    SOLUTION.from
  );

  const animationTo = getSquarePosition(
    SOLUTION.to
  );

  const deltaX =
    animationTo.x - animationFrom.x;

  const deltaY =
    animationTo.y - animationFrom.y;

  const distance = Math.sqrt(
    deltaX * deltaX + deltaY * deltaY
  );

  const angle =
    (Math.atan2(deltaY, deltaX) * 180) /
    Math.PI;

  /*
   * ---------------------------------------------------------
   * Sound
   * ---------------------------------------------------------
   */

  function playCheckmateSound() {
    const audio = checkmateSound.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    audio.play().catch(() => {
      // Browser playback restrictions are ignored.
    });
  }

  /*
   * ---------------------------------------------------------
   * Reset
   * ---------------------------------------------------------
   */

  function resetPuzzle() {
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }

    if (checkmateSound.current) {
      checkmateSound.current.pause();
      checkmateSound.current.currentTime = 0;
    }

    setGame(new Chess(PUZZLE_FEN));
    setSelectedSquare(null);
    setSolved(false);
    setAnimating(false);
    setLastMove(null);
    setStatus(
      "White to move · Find the checkmate"
    );
  }

  /*
   * ---------------------------------------------------------
   * Animate the correct move
   * ---------------------------------------------------------
   */

  function animateSolution() {
    setSelectedSquare(null);
    setAnimating(true);
    setStatus("Good move...");

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const duration = reducedMotion ? 50 : 850;

    animationTimer.current = setTimeout(() => {
      animationTimer.current = null;

      const nextGame = new Chess(game.fen());

      try {
        const move = nextGame.move({
          from: SOLUTION.from,
          to: SOLUTION.to,
        });

        if (!move || !nextGame.isCheckmate()) {
          setAnimating(false);
          setStatus(
            "That move does not produce checkmate."
          );
          return;
        }

        setGame(nextGame);
        setLastMove(SOLUTION);
        setAnimating(false);
        setSolved(true);
        setStatus(
          "Excellent. Qd8# — Checkmate."
        );

        if (!reducedMotion) {
          playCheckmateSound();
        }
      } catch {
        setAnimating(false);
        setStatus(
          "Something went wrong. Try again."
        );
      }
    }, duration);
  }

  /*
   * ---------------------------------------------------------
   * Board interaction
   * ---------------------------------------------------------
   */

  function handleSquareClick(square: Square) {
    if (solved || animating) return;

    const piece = game.get(square);

    /*
     * First selection.
     */
    if (!selectedSquare) {
      if (!piece) {
        setStatus("Select the white queen.");
        return;
      }

      if (piece.color !== "w") {
        setStatus("It is White's move.");
        return;
      }

      if (square !== SOLUTION.from) {
        setStatus(
          "Look for the queen's winning move."
        );
        return;
      }

      setSelectedSquare(square);

      setStatus(
        "Queen selected. Find the winning square."
      );

      return;
    }

    /*
     * Deselect.
     */
    if (selectedSquare === square) {
      setSelectedSquare(null);

      setStatus(
        "White to move · Find the checkmate"
      );

      return;
    }

    /*
     * Validate attempted move.
     */
    try {
      const nextGame = new Chess(game.fen());

      const move = nextGame.move({
        from: selectedSquare,
        to: square,
      });

      if (!move) {
        setSelectedSquare(null);
        setStatus("That move is not legal.");
        return;
      }

      const correct =
        selectedSquare === SOLUTION.from &&
        square === SOLUTION.to &&
        nextGame.isCheckmate();

      if (correct) {
        animateSolution();
        return;
      }

      setSelectedSquare(null);

      setStatus(
        nextGame.isCheckmate()
          ? "That's checkmate, but not the puzzle solution."
          : "Legal move, but not the winning move."
      );
    } catch {
      setSelectedSquare(null);
      setStatus("That move is not legal.");
    }
  }

  /*
   * ---------------------------------------------------------
   * Keyboard shortcuts
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSquare(null);
        setStatus(
          "White to move · Find the checkmate"
        );
      }

      if (
        event.key.toLowerCase() === "r" &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        resetPuzzle();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
            PUZZLE / 01
          </span>

          <h3 className="shop-display mt-3 text-4xl leading-none sm:text-5xl">
            Find the move.
          </h3>
        </div>

        <span
          className={[
            "text-[10px] font-bold uppercase tracking-[0.18em]",
            solved
              ? "text-[#F3EDE2]"
              : "text-[#F3EDE2]/40",
          ].join(" ")}
        >
          {solved ? "Solved" : "Mate in 1"}
        </span>
      </div>

      {/* BOARD + INFO */}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        {/* BOARD */}

        <div className="mx-auto w-full max-w-[620px]">
          <div
            className={[
              "relative aspect-square overflow-hidden",
              "border border-[#F3EDE2]/10",
              solved
                ? "animate-[shop-checkmate_700ms_ease-out]"
                : "",
            ].join(" ")}
          >
            {/* CHESS BOARD */}

            <div className="grid h-full w-full grid-cols-8 grid-rows-8">
              {board.map((row, rowIndex) =>
                row.map((piece, columnIndex) => {
                  const file = files[columnIndex];
                  const rank = 8 - rowIndex;

                  const square =
                    `${file}${rank}` as Square;

                  const isDark =
                    (columnIndex + rank) % 2 === 1;

                  const isSelected =
                    selectedSquare === square;

                  const isLastMove =
                    lastMove?.from === square ||
                    lastMove?.to === square;

                  /*
                   * Hide original queen while the
                   * animated queen travels.
                   */
                  const hideOriginalQueen =
                    animating &&
                    square === SOLUTION.from;

                  return (
                    <button
                      key={square}
                      type="button"
                      disabled={
                        solved || animating
                      }
                      onClick={() =>
                        handleSquareClick(square)
                      }
                      aria-label={`Chess square ${square}`}
                      className={[
                        "relative flex min-h-0 aspect-square",
                        "items-center justify-center",
                        "font-serif",
                        "text-[clamp(1.8rem,7vw,4.5rem)]",
                        "leading-none",
                        "transition-colors duration-200",

                        isDark
                          ? "bg-[#F3EDE2]/20"
                          : "bg-[#F3EDE2]/[0.055]",

                        isSelected
                          ? "ring-2 ring-inset ring-[#F3EDE2]"
                          : "",

                        isLastMove
                          ? "bg-[#F3EDE2]/20"
                          : "",
                      ].join(" ")}
                    >
                      {/* Coordinates */}

                      {rank === 1 && (
                        <span className="pointer-events-none absolute bottom-1 left-1 font-sans text-[7px] font-bold text-[#F3EDE2]/35">
                          {file}
                        </span>
                      )}

                      {columnIndex === 0 && (
                        <span className="pointer-events-none absolute left-1 top-1 font-sans text-[7px] font-bold text-[#F3EDE2]/35">
                          {rank}
                        </span>
                      )}

                      {/* Selection */}

                      {isSelected && (
                        <span className="pointer-events-none absolute inset-1 border border-[#F3EDE2]/50" />
                      )}

                      {/* Piece */}

                      {piece &&
                        !hideOriginalQueen && (
                          <span
                            className={[
                              "relative z-10 select-none",

                              piece.color === "w"
                                ? "text-[#F3EDE2] drop-shadow-[0_4px_5px_rgba(0,0,0,0.35)]"
                                : "text-[#111111]",
                            ].join(" ")}
                          >
                            {
                              pieceSymbols[
                                piece.color
                              ][piece.type]
                            }
                          </span>
                        )}
                    </button>
                  );
                })
              )}
            </div>

            {/* ANIMATION LAYER */}

            {animating && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-40"
              >
                {/* Exact h4 → d8 trail */}

                <div
                  className="absolute h-[3px] origin-left rounded-full bg-[#F3EDE2]/75"
                  style={{
                    left: `${animationFrom.x}%`,
                    top: `${animationFrom.y}%`,
                    width: `${distance}%`,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "0 50%",
                    animation:
                      "shop-trail-grow 800ms cubic-bezier(0.22,1,0.36,1) forwards",
                  }}
                />

                {/* Moving queen */}

                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${animationFrom.x}%`,
                    top: `${animationFrom.y}%`,
                    width: "12.5%",
                    height: "12.5%",
                    transform:
                      "translate(-50%, -50%)",
                    ["--move-x" as string]:
                      `${deltaX}%`,
                    ["--move-y" as string]:
                      `${deltaY}%`,
                    animation:
                      "shop-queen-move 800ms cubic-bezier(0.22,1,0.36,1) forwards",
                  }}
                >
                  <span className="font-serif text-[clamp(1.8rem,7vw,4.5rem)] leading-none text-[#F3EDE2] drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)]">
                    ♕
                  </span>
                </div>
              </div>
            )}

            {/* SOLVED */}

            {solved && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute z-20 h-[12.5%] w-[12.5%] rounded-full border-2 border-[#F3EDE2]/60 animate-pulse"
                  style={{
                    left: "37.5%",
                    top: "0%",
                  }}
                />

                <div className="pointer-events-none absolute bottom-4 left-4 z-30">
                  <span className="bg-[#111111]/90 px-3 py-2 font-mono text-xs font-bold text-[#F3EDE2]">
                    Qd8#
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* INFORMATION */}

        <div>
          <div
            aria-live="polite"
            className="border-t border-[#F3EDE2]/15 pt-6"
          >
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
              POSITION
            </span>

            <p className="mt-4 text-sm leading-7 text-[#F3EDE2]/60">
              White has one move that ends the game.
              The queen is on h4. Can you find the
              checkmate?
            </p>

            <p
              className={[
                "mt-5 min-h-12 text-sm font-semibold leading-6",
                solved
                  ? "text-[#F3EDE2]"
                  : "text-[#F3EDE2]/80",
              ].join(" ")}
            >
              {status}
            </p>
          </div>

          <div className="mt-8 border-t border-[#F3EDE2]/15 pt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                YOUR MOVE
              </span>

              <span className="font-mono text-sm text-[#F3EDE2]/60">
                {selectedSquare
                  ? `${selectedSquare} → ?`
                  : solved
                    ? "Qd8#"
                    : "—"}
              </span>
            </div>
          </div>

          {!solved && (
            <div className="mt-8 border-t border-[#F3EDE2]/15 pt-6">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                HINT
              </span>

              <p className="mt-3 text-sm leading-6 text-[#F3EDE2]/50">
                Look for a queen move that checks the
                king and leaves no escape.
              </p>
            </div>
          )}

          {solved && (
            <div className="mt-8 border-t border-[#F3EDE2]/15 pt-6">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                SOLUTION
              </span>

              <p className="mt-3 text-sm leading-6 text-[#F3EDE2]/60">
                <strong className="text-[#F3EDE2]">
                  Qd8#
                </strong>{" "}
                delivers checkmate. The king has no legal
                escape square.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={resetPuzzle}
            className="mt-8 w-full border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold transition-all duration-300 hover:bg-[#F3EDE2] hover:text-[#111111]"
          >
            Reset puzzle
          </button>

          <p className="mt-4 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[#F3EDE2]/25">
            Press R to reset · Esc to cancel
          </p>
        </div>
      </div>
    </div>
  );
}