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
        "text-[clamp(1.8rem,7vw,4.5rem)]",
        "transition-transform duration-200",
        color === "w"
          ? "text-[#F3EDE2] drop-shadow-[0_4px_5px_rgba(0,0,0,0.35)]"
          : "text-[#111111] drop-shadow-[0_2px_2px_rgba(255,255,255,0.08)]",
        className,
      ].join(" ")}
    >
      {PIECES[color][type]}
    </span>
  );
}