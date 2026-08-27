import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "light";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#111111] text-[#F3EDE2] hover:-translate-y-0.5 hover:bg-[#222222]",

  secondary:
    "bg-shop-paper text-[#111111] hover:-translate-y-0.5",

  outline:
    "border border-[#111111]/20 bg-transparent text-[#111111] hover:-translate-y-0.5 hover:bg-shop-paper",

  ghost:
    "bg-transparent text-[#111111] hover:bg-shop-paper",

  light:
    "bg-[#F3EDE2] text-[#111111] hover:-translate-y-0.5 hover:bg-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-xs",
  md: "px-5 py-3.5 text-sm",
  lg: "px-7 py-4 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled = false,
  className = "",
  onClick,
  ariaLabel,
}: ButtonProps) {
  const classes = [
    "group inline-flex items-center justify-center gap-3",
    "font-semibold",
    "transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/40 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  const content = (
    <>
      <span>{children}</span>

      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}