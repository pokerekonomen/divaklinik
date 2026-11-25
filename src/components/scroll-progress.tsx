"use client";

import { m, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.2 });
  if (reduce) return null;
  return <m.div style={{ scaleX }} className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-rose" aria-hidden />;
}
