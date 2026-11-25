"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Tag = "h1" | "h2";

export function SplitHeading({
  as = "h2",
  children,
  className,
}: {
  as?: Tag;
  children: string;
  className?: string;
}) {
  const TagName = as;
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const root = ref.current;
    if (!root) return;
    let cancelled = false;
    let restore: (() => void) | undefined;

    const run = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      const chars = splitChars(el, children);
      const below = el.getBoundingClientRect().top > window.innerHeight * 0.9;
      const ctx = gsap.context(() => {
        if (below) {
          gsap.set(chars, { yPercent: 110 });
          gsap.to(chars, {
            yPercent: 0,
            duration: 0.72,
            stagger: 0.016,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        } else {
          gsap.fromTo(
            chars,
            { color: "#5f8f98" },
            { color: "#1d2447", duration: 0.55, stagger: 0.014, ease: "power2.out" },
          );
        }
      }, el);
      restore = () => {
        ctx.revert();
        el.textContent = children;
        el.removeAttribute("aria-label");
      };
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    void run();
    return () => {
      cancelled = true;
      restore?.();
    };
  }, [children, reduce]);

  return (
    <TagName ref={ref} className={className}>
      {children}
    </TagName>
  );
}

function splitChars(el: HTMLElement, text: string) {
  el.textContent = "";
  el.setAttribute("aria-label", text);
  const chars: HTMLSpanElement[] = [];
  for (const part of text.split(/(\s+)/)) {
    if (/^\s+$/.test(part)) {
      el.append(part);
      continue;
    }
    const word = document.createElement("span");
    word.style.display = "inline-block";
    word.style.whiteSpace = "nowrap";
    for (const char of Array.from(part)) {
      const clip = document.createElement("span");
      clip.style.display = "inline-block";
      clip.style.overflow = "hidden";
      clip.style.verticalAlign = "bottom";
      const glyph = document.createElement("span");
      glyph.textContent = char;
      glyph.setAttribute("aria-hidden", "true");
      glyph.style.display = "inline-block";
      clip.append(glyph);
      word.append(clip);
      chars.push(glyph);
    }
    el.append(word);
  }
  return chars;
}
