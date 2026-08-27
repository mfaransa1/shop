"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number | null;
  suffix?: string;
  duration?: number;
}

export default function Counter({
  value,
  suffix = "",
  duration = 1400,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element || value === null || started) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setCount(value);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setStarted(true);
        observer.unobserve(element);

        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease-out cubic
          const easedProgress =
            1 - Math.pow(1 - progress, 3);

          setCount(
            progress === 1
              ? value
              : Math.round(value * easedProgress),
          );

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value, duration, started]);

  if (value === null) {
    return <span ref={ref}>—</span>;
  }

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}