"use client";

import type { ReactNode } from "react";

export type ChessMove = {
  san: string;
  from?: string;
  to?: string;
};

type MoveNotationProps = {
  moves: ChessMove[];
  currentMove?: number;
  onMoveClick?: (index: number) => void;
  title?: string;
  emptyMessage?: string;
  className?: string;
  footer?: ReactNode;
};

export default function MoveNotation({
  moves,
  currentMove = -1,
  onMoveClick,
  title = "Moves",
  emptyMessage = "No moves yet.",
  className = "",
  footer,
}: MoveNotationProps) {
  return (
    <div
      className={[
        "w-full border border-[#111111]/10 bg-[#F3EDE2]",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#111111]/10 px-5 py-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#111111]/50">
          {title}
        </span>

        <span className="font-mono text-[9px] text-[#111111]/35">
          {moves.length} {moves.length === 1 ? "MOVE" : "MOVES"}
        </span>
      </div>

      {/* Move list */}
      <div className="max-h-[260px] overflow-y-auto">
        {moves.length === 0 ? (
          <div className="px-5 py-8">
            <p className="text-sm text-[#111111]/40">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {moves.map((move, index) => {
              const moveNumber = Math.floor(index / 2) + 1;
              const isWhiteMove = index % 2 === 0;
              const isCurrent = index === currentMove;

              const content = (
                <>
                  <span className="mr-3 font-mono text-[9px] text-[#111111]/30">
                    {isWhiteMove ? `${moveNumber}.` : "..."}
                  </span>

                  <span
                    className={
                      isCurrent
                        ? "font-semibold text-[#111111]"
                        : "text-[#111111]/70"
                    }
                  >
                    {move.san}
                  </span>
                </>
              );

              if (onMoveClick) {
                return (
                  <button
                    key={`${index}-${move.san}`}
                    type="button"
                    onClick={() => onMoveClick(index)}
                    className={[
                      "min-h-[48px] border-b border-[#111111]/[0.07]",
                      "px-4 py-3 text-left text-sm",
                      "transition-colors duration-200",
                      "hover:bg-[#111111]/[0.04]",
                      "focus:outline-none focus-visible:ring-2",
                      "focus-visible:ring-inset focus-visible:ring-[#111111]/40",
                      isCurrent
                        ? "bg-[#111111]/[0.06]"
                        : "",
                    ].join(" ")}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div
                  key={`${index}-${move.san}`}
                  className={[
                    "min-h-[48px] border-b border-[#111111]/[0.07]",
                    "px-4 py-3 text-left text-sm",
                    isCurrent
                      ? "bg-[#111111]/[0.06]"
                      : "",
                  ].join(" ")}
                >
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-[#111111]/10 px-5 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}