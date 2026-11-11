"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const open = !localStorage.getItem("diva-consent");
    setVisible(open);
    document.documentElement.style.setProperty("--cookie-space", open ? "148px" : "0px");
    return () => document.documentElement.style.setProperty("--cookie-space", "0px");
  }, []);

  if (!visible) return null;

  function choose(value: "all" | "necessary") {
    localStorage.setItem("diva-consent", value);
    document.documentElement.style.setProperty("--cookie-space", "0px");
    setVisible(false);
  }

  return (
    <div className="enter fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" role="dialog" aria-label="Cookies">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-line bg-paper p-4 shadow-[0_12px_40px_rgba(44,33,30,0.16)] sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          Nödvändiga cookies håller bokningen igång. Statistik används bara om du godkänner.{" "}
          <Link href="/cookie-policy" className="underline">
            Cookiepolicy
          </Link>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:w-64 sm:shrink-0">
          <button type="button" className="h-11 rounded-full border border-line text-sm" onClick={() => choose("necessary")}>
            Avvisa
          </button>
          <button type="button" className="h-11 rounded-full bg-ink text-sm text-cream" onClick={() => choose("all")}>
            Godkänn
          </button>
        </div>
      </div>
    </div>
  );
}
