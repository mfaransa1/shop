"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  closeOnOverlayClick?: boolean;
};

export default function Modal({
  open,
  onClose,
  children,
  title,
  className = "",
  closeOnOverlayClick = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-[#111111]/75 backdrop-blur-sm"
        onClick={
          closeOnOverlayClick
            ? onClose
            : undefined
        }
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          title ? "modal-title" : undefined
        }
        className={[
          "relative z-10 w-full max-w-2xl overflow-hidden",
          "border border-shop-border bg-shop-cream text-[#111111]",
          "shadow-2xl",
          className,
        ].join(" ")}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between gap-6 border-b border-shop-border px-6 py-5 sm:px-7">
            <h2
              id="modal-title"
              className="shop-display text-3xl leading-none sm:text-4xl"
            >
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#111111]/15 text-lg transition-colors duration-200 hover:bg-[#111111] hover:text-[#F3EDE2]"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-7">
          {children}
        </div>

        {/* Close button when there is no title */}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-[#111111]/15 bg-shop-cream text-lg transition-colors duration-200 hover:bg-[#111111] hover:text-[#F3EDE2]"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}