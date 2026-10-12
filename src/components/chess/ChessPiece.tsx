"use client";

import type { Color, PieceSymbol } from "chess.js";

type ChessPieceProps = {
  color: Color;
  type: PieceSymbol;
  className?: string;
};

const PIECES: Record<
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

export default function ChessPiece({
  color,
  type,
  className = "",
}: ChessPieceProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "select-none font-serif leading-none",
        "text-[8.6cqw] sm:text-[8.6cqw]",
        "max-w-full",
        "transition-transform duration-200",
        color === "w"
          ? "text-[#FFFDF7] [-webkit-text-stroke:0.7px_#6D6559] drop-shadow-[0_2px_2px_rgba(40,32,24,0.6)]"
          : "text-[#171614] drop-shadow-[0_1px_1px_rgba(255,255,255,0.22)]",
        className,
      ].join(" ")}
    >
      {PIECES[color][type]}
    </span>
  );
}