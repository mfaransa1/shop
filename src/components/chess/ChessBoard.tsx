"use client";

import type {
  Color,
  PieceSymbol,
  Square,
} from "chess.js";

import ChessPiece from "./ChessPiece";

type BoardPiece = {
  color: Color;
  type: PieceSymbol;
};

type ChessBoardProps = {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  selectedSquare?: Square | null;
  lastMove?: {
    from: Square;
    to: Square;
  } | null;
  disabled?: boolean;
  onSquareClick?: (square: Square) => void;
  showCoordinates?: boolean;
  flipped?: boolean;
  className?: string;
  hidePiece?: (square: Square, piece: BoardPiece) => boolean;
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function ChessBoard({
  board,
  selectedSquare = null,
  lastMove = null,
  disabled = false,
  onSquareClick,
  showCoordinates = true,
  flipped = false,
  className = "",
  hidePiece,
}: ChessBoardProps) {
  const rows = flipped
    ? [...board].reverse().map((row) => [...row].reverse())
    : board;

  return (
    <div
      className={[
        "relative aspect-square w-full overflow-hidden",
        "border border-[#111111]/10",
        "bg-[#111111]",
        className,
      ].join(" ")}
    >
      <div
        className="grid h-full w-full grid-cols-8 grid-rows-8"
        role="grid"
        aria-label="Chess board"
      >
        {rows.map((row, rowIndex) =>
          row.map((piece, columnIndex) => {
            const actualRowIndex = flipped
              ? 7 - rowIndex
              : rowIndex;

            const actualColumnIndex = flipped
              ? 7 - columnIndex
              : columnIndex;

            const file = files[actualColumnIndex];
            const rank = 8 - actualRowIndex;

            const square =
              `${file}${rank}` as Square;

            const isDark =
              (actualColumnIndex + rank) % 2 === 1;

            const isSelected =
              selectedSquare === square;

            const isLastMove =
              lastMove?.from === square ||
              lastMove?.to === square;

            const shouldHide =
              Boolean(
                piece &&
                  hidePiece?.(square, {
                    color: piece.color,
                    type: piece.type,
                  })
              );

            return (
              <button
                key={square}
                type="button"
                role="gridcell"
                disabled={disabled}
                onClick={() =>
                  onSquareClick?.(square)
                }
                aria-label={`Chess square ${square}${
                  piece
                    ? `, ${piece.color === "w" ? "white" : "black"} ${piece.type}`
                    : ""
                }`}
                className={[
                  "relative flex aspect-square min-h-0",
                  "items-center justify-center",
                  "overflow-hidden",
                  "font-serif",
                  "transition-colors duration-200",
                  "focus:z-10 focus:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-inset",
                  "focus-visible:ring-[#111111]/60",

                  isDark
                    ? "bg-[#D8D2C6]"
                    : "bg-[#F3EDE2]",

                  isSelected
                    ? "ring-2 ring-inset ring-[#111111]"
                    : "",

                  isLastMove
                    ? "bg-[#C8C0B2]"
                    : "",

                  !disabled
                    ? "hover:brightness-[0.96]"
                    : "",

                  disabled
                    ? "cursor-default"
                    : "cursor-pointer",
                ].join(" ")}
              >
                {/* Coordinates */}
                {showCoordinates &&
                  actualColumnIndex === 0 && (
                    <span
                      aria-hidden="true"
                      className={[
                        "pointer-events-none absolute",
                        "left-1 top-1 z-20",
                        "font-sans text-[7px] font-bold",
                        isDark
                          ? "text-[#F3EDE2]/70"
                          : "text-[#111111]/45",
                      ].join(" ")}
                    >
                      {rank}
                    </span>
                  )}

                {showCoordinates &&
                  rank === 1 && (
                    <span
                      aria-hidden="true"
                      className={[
                        "pointer-events-none absolute",
                        "bottom-1 left-1 z-20",
                        "font-sans text-[7px] font-bold",
                        isDark
                          ? "text-[#F3EDE2]/70"
                          : "text-[#111111]/45",
                      ].join(" ")}
                    >
                      {file}
                    </span>
                  )}

                {/* Selected square */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-1 z-10 border border-[#111111]/40"
                  />
                )}

                {/* Last move indicator */}
                {isLastMove && !isSelected && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#111111]/[0.035]"
                  />
                )}

                {/* Piece */}
                {piece && !shouldHide && (
                  <ChessPiece
                    color={piece.color}
                    type={piece.type}
                    className="relative z-20"
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}