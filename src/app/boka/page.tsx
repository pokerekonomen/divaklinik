import type { Metadata } from "next";
import Link from "next/link";
import { BookingWizard } from "@/components/booking-wizard";
import { clinic } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Boka tandläkartid",
  description: "Boka tandläkartid online hos Shahram Hamraz på Diva Tandklinik i Annedal, Göteborg.",
  alternates: { canonical: "/boka" },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ behandling?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-10 md:py-16 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
      <aside className="rounded-[28px] bg-paper p-6 shadow-[0_16px_40px_rgba(29,36,71,0.05)] lg:sticky lg:top-28">
        <p className="kicker">Onlinebokning</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight">Välj en ledig tid</h1>
        <p className="mt-3 text-sm text-muted">
          Följ stegen. Hittar du ingen tid som passar, eller är osäker på vad du ska boka, går det bra att ringa eller skriva.
        </p>
        <div className="mt-6 space-y-1 text-sm">
          <p className="font-medium">{clinic.name}</p>
          <p>{clinic.street}</p>
          <p>{clinic.postal} {clinic.city}</p>
          <p className="pt-3">Alla tider är hos {clinic.dentist}.</p>
          <p>Måndag–fredag 10:00–17:00</p>
          <p>Lördag–söndag 11:00–17:00</p>
        </div>
        <div className="mt-5 space-y-1 text-sm">
          <p>Telefon: <a href={`tel:${clinic.phoneTel}`} className="text-rose-deep">{clinic.phoneDisplay}</a></p>
          <p>E-post: <a href={`mailto:${clinic.email}`} className="text-rose-deep">{clinic.email}</a></p>
        </div>
        <Link href="/kontakt" className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-rose-deep">Kontakt & hitta hit →</Link>
        <p className="mt-5 text-sm text-muted">Patienter från {clinic.minAge} år. Betalning på kliniken. Delbetalning via Resurs Bank.</p>
      </aside>
      <BookingWizard initialService={params.behandling} />
    </div>
  );
}
