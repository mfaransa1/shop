"use client";

import { useMemo, useState } from "react";
import {
  standardBoardTheme,
  type BoardOrientation,
  type BoardPiece,
  type BoardSquare,
} from "./standardBoardTheme";

type Props = {
  /** Position in FEN notation. */
  fen: string;
  /** Called after a player selects a source square and destination square. Validate legality in the game controller/server. */
  onMove?: (from: BoardSquare, to: BoardSquare) => void | Promise<void>;
  /** Optional custom piece renderer, allowing SHoP's textured piece artwork to be reused. */
  renderPiece?: (piece: BoardPiece, square: BoardSquare) => React.ReactNode;
  orientation?: BoardOrientation;
  selectedSquare?: BoardSquare | null;
  onSelectSquare?: (square: BoardSquare | null) => void;
  legalTargets?: BoardSquare[];
  /** Compute legal destinations for the currently selected square. */
  getLegalTargets?: (square: BoardSquare) => BoardSquare[];
  lastMove?: { from: BoardSquare; to: BoardSquare } | null;
  checkedKingSquare?: BoardSquare | null;
  disabled?: boolean;
  showCoordinates?: boolean;
  className?: string;
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const ranks = [8, 7, 6, 5, 4, 3, 2, 1] as const;
const glyphs: Record<BoardPiece["color"], Record<BoardPiece["type"], string>> = {
  w: { k: "♔\uFE0E", q: "♕\uFE0E", r: "♖\uFE0E", b: "♗\uFE0E", n: "♘\uFE0E", p: "♙\uFE0E" },
  b: { k: "♚\uFE0E", q: "♛\uFE0E", r: "♜\uFE0E", b: "♝\uFE0E", n: "♞\uFE0E", p: "♟\uFE0E" },
};

function parseFen(fen: string): Map<BoardSquare, BoardPiece> {
  const board = new Map<BoardSquare, BoardPiece>();
  const placement = (fen.trim().split(/\s+/)[0] || "").split("/");
  if (placement.length !== 8) return board;
  const pieceMap: Record<string, BoardPiece["type"]> = { p: "p", n: "n", b: "b", r: "r", q: "q", k: "k" };
  placement.forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (/^[1-8]$/.test(char)) { fileIndex += Number(char); continue; }
      const type = pieceMap[char.toLowerCase()];
      if (!type || fileIndex > 7) continue;
      const square = `${files[fileIndex]}${8 - rowIndex}` as BoardSquare;
      board.set(square, { color: char === char.toUpperCase() ? "w" : "b", type });
      fileIndex += 1;
    }
  });
  return board;
}

export default function StandardChessBoard({
  fen, onMove, renderPiece, orientation = "white", selectedSquare = null, onSelectSquare,
  legalTargets = [], getLegalTargets, lastMove = null, checkedKingSquare = null,
  disabled = false, showCoordinates = true, className = "",
}: Props) {
  const pieces = useMemo(() => parseFen(fen), [fen]);
  const [localSelection, setLocalSelection] = useState<BoardSquare | null>(null);
  const selected = selectedSquare === null ? localSelection : selectedSquare;
  const targetSet = useMemo(() => new Set(selected && getLegalTargets ? getLegalTargets(selected) : legalTargets), [selected, getLegalTargets, legalTargets]);
  const displayedFiles = orientation === "white" ? [...files] : [...files].reverse();
  const displayedRanks = orientation === "white" ? [...ranks] : [...ranks].reverse();

  function clickSquare(square: BoardSquare) {
    if (disabled || !onMove) return;
    if (selected && selected !== square) {
      if (targetSet.has(square)) {
        void onMove(selected, square);
        if (selectedSquare === null) setLocalSelection(null);
        onSelectSquare?.(null);
        return;
      }
    }
    const piece = pieces.get(square);
    if (piece) {
      if (selectedSquare === null) setLocalSelection(square);
      onSelectSquare?.(square);
    } else {
      if (selectedSquare === null) setLocalSelection(null);
      onSelectSquare?.(null);
    }
  }

  return (
    <div className={`shop-chess-frame ${className}`} data-board-theme="shop-classic">
      <div className="shop-chess-board" role="grid" aria-label="Chess board">
        {displayedRanks.map((rank) => displayedFiles.map((file) => {
          const square = `${file}${rank}` as BoardSquare;
          const fileIndex = files.indexOf(file);
          const isLight = (fileIndex + rank) % 2 === 0;
          const piece = pieces.get(square);
          const isSelected = selected === square;
          const isTarget = targetSet.has(square);
          const isLastMove = lastMove?.from === square || lastMove?.to === square;
          const isCheck = checkedKingSquare === square;
          return (
            <button
              key={square}
              type="button"
              role="gridcell"
              aria-label={`${square}${piece ? `, ${piece.color === "w" ? "white" : "black"} ${piece.type}` : ""}`}
              className={`shop-chess-square ${isLight ? "is-light" : "is-dark"}${isSelected ? " is-selected" : ""}${isLastMove ? " is-last-move" : ""}${isCheck ? " is-check" : ""}`}
              onClick={() => clickSquare(square)}
              disabled={disabled || !onMove}
            >
              {showCoordinates && file === displayedFiles[0] && <span className="shop-rank-coordinate">{rank}</span>}
              {showCoordinates && rank === (orientation === "white" ? 1 : 8) && <span className="shop-file-coordinate">{file}</span>}
              {piece && <span className={`shop-chess-piece piece-${piece.color}`} aria-hidden="true">{renderPiece ? renderPiece(piece, square) : glyphs[piece.color][piece.type]}</span>}
              {isTarget && <span className={piece ? "shop-legal-capture" : "shop-legal-dot"} aria-hidden="true" />}
            </button>
          );
        }))}
      </div>
    </div>
  );
}
