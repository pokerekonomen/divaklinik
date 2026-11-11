import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { ClinicMap } from "@/components/clinic-map";
import { TreatmentIcon } from "@/components/icons";
import { Drift, Spotlight } from "@/components/motion-bits";
import { Reveal } from "@/components/reveal";
import { clinic } from "@/lib/clinic";

const paths = [
  { href: "/akut-tandvard-goteborg", title: "Jag har ont", text: "Tandvärk, svullnad, skadad eller knäckt tand.", icon: "pulse" as const },
  { href: "/undersokning", title: "Jag vill undersöka tänderna", text: "Undersökning, rådgivning och förebyggande tandvård.", icon: "search" as const },
  { href: "/tandimplantat-goteborg", title: "Jag saknar en tand", text: "Bedömning av tandimplantat och andra alternativ.", icon: "implant" as const },
  { href: "/estetisk-tandvard", title: "Jag vill förbättra mitt leende", text: "Tandblekning, tandreglering och estetisk tandvård.", icon: "smile" as const },
];

const featured = [
  { href: "/allmantandvard-goteborg", title: "Allmän tandvård", text: "Undersökningar, lagningar och långsiktig hjälp för en frisk mun.", image: "/images/vantrum.webp", pos: "center" },
  { href: "/akut-tandvard-goteborg", title: "Akut tandvård", text: "Snabb hjälp vid tandvärk, svullnad, skadad eller knäckt tand.", image: "/images/behandlingsrum.webp", pos: "center" },
  { href: "/tandimplantat-goteborg", title: "Tandimplantat", text: "Individuell bedömning när en eller flera tänder behöver ersättas.", image: "/images/behandlingsrum-1280.webp", pos: "center top" },
  { href: "/tandreglering-goteborg", title: "Tandreglering", text: "Diskret tandreglering för vuxna med individuell planering.", image: "/images/hero-klinik.webp", pos: "center" },
  { href: "/tandblekning-goteborg", title: "Tandblekning", text: "Professionell tandblekning efter bedömning av tänder och munhälsa.", image: "/images/vantrum.webp", pos: "center bottom" },
  { href: "/rotfyllning-goteborg", title: "Rotfyllning", text: "Behandling när tandens pulpa är inflammerad eller infekterad.", image: "/images/hero-klinik.webp", pos: "left center" },
];

const reviews = [
  {
    name: "Nini M L",
    text: "Shahram är en riktigt skicklig, noggrann och vänlig tandläkare. Jag som annars tycker det är väldigt obehagligt med tandläkarbesök kände mig så väl omhändertagen och trygg.",
  },
  {
    name: "Stefan",
    text: "Jag har en enorm skräck för tandläkare. Shahram förklarar, är lugn, sätter patienten i centrum och gjorde allt för att jag skulle vara lugn. Utan tvekan den bästa tandläkaren jag har träffat.",
  },
  {
    name: "Marcus Lavsund",
    text: "Fantastiskt bemötande av Shahram som är lugn, pedagogisk och ärlig. Kommer definitivt på återbesök.",
  },
  {
    name: "Andreas",
    text: "Jag ville ha en second opinion om en visdomstand. Shahram var mycket professionell och jag blev mycket klokare på vad som egentligen var problemet och hur det kunde lösas.",
  },
];

export function HomeView() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src="/images/hero-klinik.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f6fafc] via-[#f6fafc]/94 to-[#f6fafc]/20" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:min-h-[40rem] md:grid-cols-[minmax(0,1.15fr)_minmax(240px,340px)] md:py-20">
          <div>
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Privat tandläkare · Annedal</p>
            <h1 className="mt-3 max-w-xl font-serif text-[2rem] leading-[1.08] break-words text-balance sm:text-5xl md:text-6xl">
              Tandläkare i Göteborg – trygg tandvård när du behöver den
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted">
              Som privat tandläkare i Göteborg hjälper vi dig med personlig tandvård i Annedal, nära Linné och Vasastan.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 min-[420px]:flex">
              <Link href="/boka" className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-5 text-white">Boka tid</Link>
              <Link href="/kontakt" className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-5">Kontakta oss</Link>
            </div>
            <p className="mt-6 w-fit max-w-full rounded-full bg-paper px-4 py-2 text-sm shadow-[0_8px_24px_rgba(29,36,71,0.08)]">
              <span className="text-spark">★★★★★</span> {clinic.reviewLabel}
              <span className="text-muted"> · {clinic.reviews}</span>
            </p>
          </div>
          <div className="grid gap-3">
            {[
              { icon: MapPin, title: `${clinic.street}`, text: `${clinic.postal} ${clinic.city} · ${clinic.area}` },
              { icon: Clock, title: "Öppet alla dagar", text: "Mån–fre 10–17 · lör–sön 11–17" },
              { icon: Phone, title: clinic.phoneDisplay, text: "Akuttid ofta samma dag" },
            ].map((card) => (
              <div key={card.title} className="flex items-start gap-3 rounded-2xl bg-paper/95 p-4 shadow-[0_10px_30px_rgba(29,36,71,0.08)] backdrop-blur-sm">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-rose">
                  <card.icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{card.title}</span>
                  <span className="block text-sm text-muted">{card.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Samma tandläkare", text: "Alla tider är hos Shahram Hamraz. Du möter samma person från första besöket till nästa steg." },
            { title: "Kostnad innan beslut", text: "Du får ett kostnadsförslag innan behandlingen börjar. Delbetalning kan göras via Resurs Bank." },
            { title: "Öppet även på helgen", text: "Lördag och söndag 11–17. Akuttid kan ofta erbjudas samma dag, beroende på tillgänglighet." },
          ].map((card) => (
            <article key={card.title} className="rounded-[24px] bg-paper p-6 shadow-[0_8px_28px_rgba(29,36,71,0.05)]">
              <h2 className="font-serif text-2xl">{card.title}</h2>
              <p className="mt-3 text-sm text-muted">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center md:py-24">
        <h2 className="font-serif text-4xl md:text-5xl">Vad behöver du hjälp med?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">Du behöver inte veta vilken behandling du behöver. Börja med det som bäst beskriver din situation så guidar vi dig vidare.</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {paths.map((item) => (
            <Spotlight key={item.href} className="h-full overflow-hidden rounded-2xl">
              <Link href={item.href} className="lift group flex h-full flex-col items-center rounded-2xl bg-sand px-4 py-8">
                <TreatmentIcon name={item.icon} className="size-8 text-rose" />
                <span className="mt-4 font-medium">{item.title}</span>
                <span className="mt-1 text-sm text-muted">{item.text}</span>
              </Link>
            </Spotlight>
          ))}
        </div>
        <div className="mx-auto mt-3 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            { href: "/boka", title: "Boka tid", icon: Calendar },
            { href: "/kontakt", title: "Hitta hit", icon: MapPin },
            { href: `tel:${clinic.phoneTel}`, title: "Ring oss", icon: Phone },
          ].map((item) => (
            <a key={item.title} href={item.href} className="lift flex flex-col items-center rounded-2xl bg-sand/70 px-4 py-8">
              <item.icon className="size-7 text-rose" aria-hidden />
              <span className="mt-3 text-sm font-medium">{item.title}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="font-serif text-3xl md:text-4xl">Tandvård för det du behöver just nu</h2>
        <p className="mt-2 max-w-2xl text-muted">Från en vanlig undersökning till akut hjälp, ersättning av saknade tänder och estetiska behandlingar. Välj ett område för att läsa mer om hur vi kan hjälpa dig.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <Link key={item.href} href={item.href} className="lift group overflow-hidden rounded-3xl border border-line bg-paper">
              <img src={item.image} alt="" style={{ objectPosition: item.pos }} className="h-44 w-full object-cover" />
              <span className="block p-5">
                <span className="block font-medium">{item.title}</span>
                <span className="mt-1 block text-sm text-muted">{item.text}</span>
                <span className="mt-3 block text-sm font-medium text-rose-deep">Läs mer</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/behandlingar" className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-cream">
            Alla behandlingar
          </Link>
        </div>
      </section>

      <Reveal>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="overflow-hidden rounded-[28px]">
          <Drift>
            <img src="/images/behandlingsrum.webp" alt="Behandlingsrum på Diva Tandklinik" className="h-72 w-full object-cover md:h-96" />
          </Drift>
        </div>
        <div>
          <h2 className="font-serif text-4xl text-balance">Trygg tandvård börjar med att du blir lyssnad på</h2>
          <p className="mt-4 text-muted">
            På Diva Tandklinik möter du tandläkare Shahram Hamraz. Här får du tydlig information om dina alternativ, kostnader och nästa steg innan behandlingen börjar.
          </p>
          <p className="mt-3 text-muted">
            Känner du oro inför tandläkarbesök anpassar vi tempot och bemötandet efter dina behov. Målet är att du ska känna dig delaktig och trygg genom hela besöket.
          </p>
          <Link href="/diva-tandklinik-goteborg" className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-rose-deep">
            Om kliniken
          </Link>
        </div>
      </section>
      </Reveal>

      <section id="omdomen" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="text-sm">
          <span className="text-spark">★★★★★</span> <span className="font-medium">{clinic.reviewLabel}</span>
          <span className="text-muted"> · {clinic.reviews} omdömen</span>
        </p>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl text-balance md:text-5xl">Vad våra patienter säger</h2>
        <figure className="mt-8 max-w-3xl">
          <blockquote className="font-serif text-2xl leading-snug text-balance md:text-3xl">{reviews[0].text}</blockquote>
          <figcaption className="mt-4 text-sm text-muted">{reviews[0].name}</figcaption>
        </figure>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reviews.slice(1).map((review) => (
            <figure key={review.name} className="rounded-[24px] bg-paper p-5 shadow-[0_8px_28px_rgba(29,36,71,0.05)]">
              <blockquote className="text-[15px] leading-relaxed">{review.text}</blockquote>
              <figcaption className="mt-4 text-sm text-muted">{review.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Reveal>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24" id="tandlakaren">
        <div className="overflow-hidden rounded-[28px]">
          <Drift>
            <img src="/images/vantrum.webp" alt="Väntrummet på Diva Tandklinik i Annedal" className="h-72 w-full object-cover md:h-[420px]" />
          </Drift>
        </div>
        <div>
          <h2 className="font-serif text-4xl text-balance">Din tandläkare i Göteborg – nära Linné och Vasastan</h2>
          <p className="mt-4 text-muted">
            Hos oss får du personlig tandvård i en modern klinik på {clinic.street}. Vi hjälper både nya och återkommande patienter med planerad och akut tandvård.
          </p>
          <ul className="mt-5 space-y-1 text-sm">
            <li>{clinic.street}, {clinic.postal} {clinic.city}</li>
            <li>Telefon: {clinic.phoneDisplay}</li>
            <li>{clinic.email}</li>
            <li>Måndag–fredag 10:00–17:00</li>
            <li>Lördag–söndag 11:00–17:00</li>
            <li>Spårvagn linje 2, hållplats Seminariegatan. Besöksparkering finns. Flexlinjen stannar vid kliniken.</li>
          </ul>
          <p className="mt-3 text-sm text-muted">Akuta besvär? Ring {clinic.phoneDisplay}</p>
          <div className="mt-6 grid grid-cols-1 gap-2 min-[420px]:flex">
            <Link href="/boka" className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-5 text-white">Boka tid</Link>
            <a href={clinic.directions} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-5">
              Hitta hit
            </a>
          </div>
        </div>
      </section>
      </Reveal>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-serif text-3xl">Diva Tandklinik i Annedal, Göteborg</h2>
        <div className="mt-6 overflow-hidden rounded-[28px] border border-line bg-paper md:grid md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="p-6">
            <p className="font-medium">{clinic.street}</p>
            <p className="text-muted">{clinic.postal} {clinic.city}</p>
            <p className="mt-4 text-sm text-muted">Spårvagn: hållplats Seminariegatan</p>
            <p className="text-sm text-muted">Bil: besöksparkering finns</p>
            <p className="text-sm text-muted">Område: Annedal, nära Linné och Vasastan</p>
            <Link href="/kontakt" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-rose-deep">Kontaktuppgifter och öppettider</Link>
          </div>
          <ClinicMap className="h-80 md:h-full md:min-h-80" />
        </div>
      </section>
    </>
  );
}
