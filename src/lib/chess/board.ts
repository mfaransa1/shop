import type { Color, PieceSymbol, Square } from "chess.js";

export type DisplayPiece = { square: Square; color: Color; type: PieceSymbol };
export type DisplayBoard = (DisplayPiece | null)[][];

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function toDisplayBoard(board: ({ color: Color; type: PieceSymbol } | null)[][]): DisplayBoard {
  return board.map((row, rowIndex) => row.map((piece, columnIndex) => {
    if (!piece) return null;
    return { ...piece, square: `${FILES[columnIndex]}${8 - rowIndex}` as Square };
  }));
}
