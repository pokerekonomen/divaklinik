import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClinicMap } from "@/components/clinic-map";
import { ContactForm } from "@/components/contact-form";
import { clinic } from "@/lib/clinic";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageSeo.kontakt.title,
  description: pageSeo.kontakt.description,
  alternates: { canonical: "/kontakt" },
};

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-3xl border border-line bg-paper p-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sand text-rose">{icon}</span>
      <div className="min-w-0">
        <p className="kicker">{label}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontakta Diva Tandklinik",
    url: `${clinic.url}/kontakt`,
    mainEntity: { "@id": `${clinic.url}/#klinik` },
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      <div className="max-w-3xl">
        <p className="kicker">Annedal, Göteborg</p>
        <h1 className="mt-3 font-serif text-3xl leading-[1.08] text-balance sm:text-5xl">Kontakta Diva Tandklinik i Annedal</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Ring, skriv eller boka online. Vid tandvärk, svullnad eller en skadad tand är telefonen snabbast.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-2 min-[420px]:flex">
          <a href={`tel:${clinic.phoneTel}`} className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-5 text-white">
            Ring {clinic.phoneDisplay}
          </a>
          <Link href="/boka" className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-5">
            Boka tid
          </Link>
        </div>
      </div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="grid gap-3">
          <Fact icon={<Phone className="size-5" aria-hidden />} label="Telefon">
            <a className="text-lg font-medium underline" href={`tel:${clinic.phoneTel}`}>{clinic.phoneDisplay}</a>
          </Fact>
          <Fact icon={<Mail className="size-5" aria-hidden />} label="E-post">
            <a className="break-all font-medium underline" href={`mailto:${clinic.email}`}>{clinic.email}</a>
          </Fact>
          <Fact icon={<MapPin className="size-5" aria-hidden />} label="Adress">
            <p>
              {clinic.street}<br />{clinic.postal} {clinic.city}
            </p>
            <a className="mt-1 inline-flex text-sm font-medium text-rose-deep underline" href={clinic.directions} target="_blank" rel="noopener noreferrer">
              Vägbeskrivning
            </a>
          </Fact>
          <div className="gradient-aqua rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-paper text-rose">
                <Clock className="size-5" aria-hidden />
              </span>
              <h2 className="font-serif text-2xl">Öppettider</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {clinic.hours.map((row) => (
                <li key={row.days} className="flex justify-between gap-4 border-b border-line/80 pb-2 text-sm last:border-0">
                  <span>{row.days}</span>
                  <span className="font-medium">{row.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">
              Spårvagn till hållplats Seminariegatan, linje 2. Besöksparkering finns. Flexlinjen stannar vid Seminariegatan 10.
            </p>
          </div>
        </div>

        <div className="gradient-card rounded-[28px] border border-line p-5 shadow-[0_16px_40px_rgba(29,36,71,0.06)] md:p-7">
          <h2 className="font-serif text-3xl">Skriv till oss</h2>
          <p className="mt-2 mb-5 text-sm text-muted">Lämna inga journaluppgifter i formuläret. Beskriv kort vad du vill ha hjälp med.</p>
          <ContactForm />
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-[28px] border border-line bg-paper">
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 py-4">
          <div>
            <p className="kicker">Hitta hit</p>
            <h2 className="mt-1 font-serif text-2xl">Seminariegatan 10</h2>
          </div>
          <a className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm font-medium" href={clinic.directions} target="_blank" rel="noopener noreferrer">
            Vägbeskrivning
          </a>
        </div>
        <ClinicMap className="h-80 md:h-[440px]" />
      </section>
    </div>
  );
}
