"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

type DrawerSide = "left" | "right";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: DrawerSide;
  className?: string;
  width?: string;
};

export default function Drawer({
  open,
  onClose,
  children,
  title,
  side = "right",
  className = "",
  width = "max-w-md",
}: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const isRight = side === "right";

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="presentation"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          title ? "drawer-title" : undefined
        }
        className={[
          "absolute top-0 flex h-full w-[min(92vw,32rem)] flex-col",
          "bg-shop-cream text-[#111111]",
          "shadow-2xl",
          width,
          isRight ? "right-0" : "left-0",
          "animate-[drawer-in_350ms_cubic-bezier(0.22,1,0.36,1)_both]",
          className,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-6 border-b border-shop-border px-6 py-5 sm:px-7">
          {title ? (
            <div>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-shop-muted">
                SHoP
              </span>

              <h2
                id="drawer-title"
                className="shop-display mt-2 text-3xl leading-none sm:text-4xl"
              >
                {title}
              </h2>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#111111]/15 text-lg transition-colors duration-200 hover:bg-[#111111] hover:text-[#F3EDE2]"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-7">
          {children}
        </div>
      </aside>
    </div>
  );
}