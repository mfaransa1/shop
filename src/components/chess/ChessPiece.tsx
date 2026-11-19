"use client";

import type { Color, PieceSymbol } from "chess.js";

type ChessPieceProps = {
  color: Color;
  type: PieceSymbol;
  className?: string;
  size?: number | string;
};

const pieceNames: Record<PieceSymbol, string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

/**
 * Cburnett chess-piece artwork by Colin M. L. Burnett (GPL-2.0-or-later).
 * Each piece is loaded as its original SVG asset; keep this component shared
 * by every chess board so all game modes render the same artwork.
 */
export default function ChessPiece({
  color,
  type,
  className = "",
  size = "96%",
}: ChessPieceProps) {
  const side = color === "w" ? "w" : "b";
  const name = `${side}${type.toUpperCase()}`;

  return (
    <img
      src={`/pieces/${name}.svg`}
      alt={`${color === "w" ? "White" : "Black"} ${pieceNames[type]}`}
      draggable={false}
      decoding="async"
      className={`shop-piece-art shop-piece-${side} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
