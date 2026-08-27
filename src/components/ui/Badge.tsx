import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "dark"
  | "outline"
  | "accent"
  | "success"
  | "warning";

type BadgeSize = "sm" | "md" | "lg";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-shop-paper text-[#111111] border border-shop-border",

  dark:
    "bg-[#111111] text-[#F3EDE2] border border-[#111111]",

  outline:
    "bg-transparent text-[#111111] border border-[#111111]/20",

  accent:
    "bg-[#111111] text-[#F3EDE2] border border-[#111111]",

  success:
    "bg-[#111111] text-[#F3EDE2] border border-[#111111]",

  warning:
    "bg-shop-paper text-[#111111] border border-[#111111]/20",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 text-[7px]",
  md: "px-3 py-1.5 text-[8px]",
  lg: "px-4 py-2 text-[9px]",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex w-fit items-center justify-center",
        "font-bold uppercase tracking-[0.18em]",
        "leading-none",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}