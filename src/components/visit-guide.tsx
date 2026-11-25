"use client";

import { m } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { SplitHeading } from "@/components/split-heading";
import { visitOptions } from "@/lib/visit-options";
import { cn } from "@/lib/cn";

export function VisitGuide({ embedded = false }: { embedded?: boolean }) {
  const [id, setId] = useState(visitOptions[0].id);
  const current = visitOptions.find((item) => item.id === id) ?? visitOptions[0];

  return (
    <section className={embedded ? undefined : "mx-auto max-w-6xl px-4 py-16 md:py-20"}>
      <SplitHeading className="font-serif text-3xl text-balance md:text-4xl">Vad kan besöket kosta?</SplitHeading>
      <p className="mt-3 max-w-2xl text-muted">
        Välj det som ligger närmast. Priserna som står i kronor är satta. Övriga besök får ett kostnadsförslag efter bedömning, innan något påbörjas.
      </p>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Typ av besök">
        {visitOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === current.id}
            onClick={() => setId(item.id)}
            className={cn(
              "h-11 shrink-0 rounded-full border px-4 text-sm transition-transform active:scale-[0.98]",
              item.id === current.id ? "border-ink bg-ink text-cream" : "border-line bg-paper",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <m.div
        key={current.id}
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 rounded-[28px] bg-paper p-6 shadow-[0_12px_32px_rgba(29,36,71,0.05)]"
      >
        <p className="font-serif text-3xl">{current.price}</p>
        <p className="mt-1 text-sm text-muted">{current.minutes} minuter · Shahram Hamraz</p>
        <p className="mt-3 max-w-2xl">{current.note}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={current.book} className="inline-flex h-12 items-center rounded-full bg-rose px-5 text-white">Boka den här tiden</Link>
          <Link href={current.href} className="inline-flex h-12 items-center rounded-full border border-line px-5">Läs om behandlingen</Link>
        </div>
      </m.div>
      <div className="mt-6 overflow-x-auto rounded-[28px] border border-line bg-paper">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Orientering om tid och pris hos Diva Tandklinik</caption>
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Besök</th>
              <th className="px-4 py-3 font-medium">Tid</th>
              <th className="px-4 py-3 font-medium">Pris</th>
              <th className="px-4 py-3 font-medium">Att veta</th>
            </tr>
          </thead>
          <tbody>
            {visitOptions.map((item) => (
              <tr key={item.id} className={cn("border-t border-line", item.id === current.id && "bg-sand/70")}>
                <td className="px-4 py-3 font-medium">{item.label}</td>
                <td className="px-4 py-3">{item.minutes} min</td>
                <td className="px-4 py-3">{item.price}</td>
                <td className="px-4 py-3 text-muted">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
