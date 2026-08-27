"use client";

import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={[
        "group relative w-full overflow-hidden",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "flex w-max shrink-0",
          direction === "left"
            ? "animate-[marquee-left_var(--marquee-duration)_linear_infinite]"
            : "animate-[marquee-right_var(--marquee-duration)_linear_infinite]",
          pauseOnHover
            ? "group-hover:[animation-play-state:paused]"
            : "",
          "motion-reduce:animate-none",
        ].join(" ")}
        style={
          {
            "--marquee-duration": animationDuration,
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">
          {children}
        </div>

        <div
          aria-hidden="true"
          className="flex shrink-0 items-center"
        >
          {children}
        </div>
      </div>
    </div>
  );
}