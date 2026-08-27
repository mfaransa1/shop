"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  strength?: number;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function MagneticButton({
  children,
  href,
  strength = 0.25,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");

  const handleMouseMove = (
    event: MouseEvent<
      HTMLAnchorElement | HTMLButtonElement
    >,
  ) => {
    if (disabled || !ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();

    const x =
      (event.clientX - (rect.left + rect.width / 2)) *
      strength;

    const y =
      (event.clientY - (rect.top + rect.height / 2)) *
      strength;

    setTransform(
      `translate3d(${x}px, ${y}px, 0)`,
    );
  };

  const handleMouseLeave = () => {
    setTransform("translate3d(0, 0, 0)");
  };

  const classes = [
    "inline-flex items-center justify-center",
    "transition-transform duration-300 ease-out",
    "will-change-transform",
    disabled
      ? "pointer-events-none opacity-40"
      : "",
    className,
  ].join(" ");

  const style = {
    transform,
  };

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      style={style}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {children}
    </button>
  );
}