"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

export function Drift({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [22, -22]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <m.div ref={ref} style={{ y }} className={className}>
      {children}
    </m.div>
  );
}

export function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  function move(event: React.MouseEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - box.top}px`);
  }

  return (
    <div onMouseMove={move} className={cn("spotlight h-full", className)}>
      {children}
    </div>
  );
}
