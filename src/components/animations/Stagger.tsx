"use client";

import { useEffect, useRef, useState } from "react";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function Stagger({
  children,
  className = "",
  delay = 100,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={
        {
          "--stagger-delay": `${delay}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}