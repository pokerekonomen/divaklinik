"use client";

import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "wait" | "show">("pending");

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMode("show");
          observer.disconnect();
        } else {
          setMode((current) => (current === "pending" ? "wait" : current));
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  if (reduce) return <div className={className}>{children}</div>;

  const waiting = mode === "wait";

  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
        animate={{
          opacity: waiting ? 0 : 1,
          y: waiting ? 16 : 0,
          scale: waiting ? 0.992 : 1,
        }}
        transition={{
          duration: 1.05,
          delay: mode === "show" ? delay : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
    >
      {children}
    </m.div>
  );
}
