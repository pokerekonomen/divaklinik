import type { Metadata } from "next";
import Link from "next/link";
import { TreatmentIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { clinic } from "@/lib/clinic";
import { treatmentGroups } from "@/lib/navigation";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageSeo.behandlingar.title,
  description: pageSeo.behandlingar.description,
  alternates: { canonical: "/behandlingar" },
};

export default function TreatmentsPage() {
  const links = treatmentGroups.flatMap((group) => group.links);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tandvårdsbehandlingar i Göteborg",
    itemListElement: links.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.title,
      url: `${clinic.url}${link.href}`,
    })),
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <p className="kicker">Annedal, Göteborg</p>
      <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-[1.08] break-words sm:text-5xl md:text-6xl">Tandvårdsbehandlingar i Göteborg</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink">
        Från undersökning och akut hjälp till implantat, tandreglering, visdomstand och tandblekning. Är du osäker börjar vi med en undersökning.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/boka" className="inline-flex h-12 items-center rounded-full bg-rose px-5 text-white">Boka tid</Link>
        <Link href="/priser-tandlakare-goteborg" className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-5">Se priser</Link>
      </div>
      <div className="mt-12 space-y-12">
        {treatmentGroups.map((group) => (
          <Reveal key={group.title}>
          <section>
            <h2 className="font-serif text-2xl">{group.title}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className="lift group flex items-start gap-4 rounded-2xl border border-line bg-paper p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-rose">
                    <TreatmentIcon name={link.icon} className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-ink">{link.title}</span>
                    <span className="block text-sm text-ink">{link.text}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
