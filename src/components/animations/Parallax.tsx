"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function Parallax({
  children,
  className = "",
  strength = 20,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;

      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;

      const distance = (viewportCenter - elementCenter) / viewportCenter;

      setOffset(distance * strength);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
        }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}