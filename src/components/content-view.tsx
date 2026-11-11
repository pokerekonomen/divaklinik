import type { ReactNode } from "react";
import { CircleHelp, ClipboardCheck, Clock, HeartPulse, Info, MapPin, Phone, Search, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import { BookBar } from "@/components/book-bar";
import { FaqList } from "@/components/faq-list";
import { TreatmentIcon } from "@/components/icons";
import { Drift } from "@/components/motion-bits";
import { Reveal } from "@/components/reveal";
import { bodySections, type Doc, faqsOf, headingOf, leadOf } from "@/lib/content";
import { serviceForPage } from "@/lib/booking-data";
import { clinic } from "@/lib/clinic";
import { cn } from "@/lib/cn";
import { guideImages } from "@/lib/guide-images";
import { treatmentGroups } from "@/lib/navigation";

const images: Record<string, { src: string; alt: string }> = {
  "akut-tandvard-goteborg": { src: "/images/behandlingsrum.webp", alt: "Lugnt behandlingsrum i varma toner" },
  "knackt-tand-i-goteborg": { src: "/images/behandlingsrum.webp", alt: "Behandlingsrum utan patienter" },
  "rotfyllning-goteborg": { src: "/images/behandlingsrum.webp", alt: "Behandlingsstol i mjukt dagsljus" },
  "diva-tandklinik-goteborg": { src: "/images/vantrum.webp", alt: "Väntrummet på Diva Tandklinik" },
  tandvardsradsla: { src: "/images/hero-klinik.webp", alt: "Ljust väntrum med varm belysning" },
};

function imageFor(slug: string, title = "") {
  if (guideImages[slug]) return { src: guideImages[slug], alt: title };
  return images[slug] ?? { src: "/images/hero-klinik.webp", alt: "Diva Tandklinik, ljust och lugnt väntrum" };
}

function isLabel(line: string) {
  const text = line.trim();
  if (text.endsWith("→")) return false;
  return text.length < 48 && !/[.!?:+]/.test(text) && !/\d/.test(text);
}

function hrefFor(line: string) {
  if (!line.includes("→")) return null;
  const text = line.toLowerCase();
  if (text.includes("försäkringskassan")) return "https://www.forsakringskassan.se/privatperson/tandvard";
  if (text.includes("cookie")) return "/cookie-policy";
  if (text.includes("integritet") || text.includes("gdpr")) return "/privacy-policy";
  if (text.includes("pris") || text.includes("betalning") || text.includes("kostnad")) return "/priser";
  if (text.includes("knäckt") || text.includes("knackt")) return "/knackt-tand-i-goteborg";
  if (text.includes("rotfyll")) return "/rotfyllning-goteborg";
  if (text.includes("implantat") || text.includes("tandbro")) return "/tandimplantat-goteborg";
  if (text.includes("reglering")) return "/tandreglering-goteborg";
  if (text.includes("blekning")) return "/tandblekning-goteborg";
  if (text.includes("estetisk") || text.includes("krona")) return "/estetisk-tandvard";
  if (text.includes("rädsla")) return "/tandvardsradsla";
  if (text.includes("undersök")) return "/undersokning";
  if (text.includes("akut") || text.includes("tandvärk")) return "/akut-tandvard-goteborg";
  if (text.includes("kontakt") || text.includes("hitta") || text.includes("karta")) return "/kontakt";
  if (text.includes("ring")) return `tel:${clinic.phoneTel}`;
  if (text.includes("e-post")) return `mailto:${clinic.email}`;
  if (text.includes("boka")) return "/boka";
  return null;
}

type Piece = { kind: "link"; href: string; label: string } | { kind: "text"; text: string };

function pieces(lines: string[]): Piece[] {
  const items: Piece[] = [];
  for (const line of lines) {
    if (isLabel(line)) continue;
    const href = hrefFor(line);
    if (line.includes("→")) {
      if (href) items.push({ kind: "link", href, label: line.replace(/\s*→\s*$/, "") });
      continue;
    }
    items.push({ kind: "text", text: line });
  }
  return items;
}

function Prose({ lines, lead = false }: { lines: string[]; lead?: boolean }) {
  const items = pieces(lines);
  if (!items.length) return null;
  let textIndex = 0;
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) =>
        item.kind === "link" ? (
          <Link key={item.label} href={item.href} className="inline-flex min-h-11 items-center text-sm font-medium text-rose-deep">
            {item.label}
          </Link>
        ) : (
          <p key={item.text} className={lead && textIndex++ === 0 ? "text-lg leading-relaxed text-ink" : "text-[17px] leading-relaxed text-ink"}>
            {item.text}
          </p>
        ),
      )}
    </div>
  );
}

const reviews = [
  { name: "Nini M L", text: "Shahram är en riktigt skicklig, noggrann och vänlig tandläkare. Jag som annars tycker det är väldigt obehagligt med tandläkarbesök kände mig så väl omhändertagen och trygg." },
  { name: "Stefan", text: "Jag har en enorm skräck för tandläkare. Shahram förklarar, är lugn, sätter patienten i centrum och gjorde allt för att jag skulle vara lugn." },
  { name: "Marcus Lavsund", text: "Fantastiskt bemötande av Shahram som är lugn, pedagogisk och ärlig. Kommer definitivt på återbesök." },
  { name: "Andreas", text: "Jag ville ha en second opinion om en visdomstand. Shahram var mycket professionell och jag blev mycket klokare på vad som egentligen var problemet." },
];

function iconFor(heading: string) {
  const text = heading.toLowerCase();
  if (/pris|kostar|betal/.test(text)) return Wallet;
  if (/rädd|oro|trygg/.test(text)) return Shield;
  if (/tid|steg|plan|öppet/.test(text)) return Clock;
  if (/boka|telefon|ring/.test(text)) return Phone;
  if (/karta|hitta|adress/.test(text)) return MapPin;
  if (/fråg/.test(text)) return CircleHelp;
  if (/undersök|bedöm|röntgen|sök/.test(text)) return Search;
  if (/värk|akut|svull|ont/.test(text)) return HeartPulse;
  if (/info|bra att|redo|passa/.test(text)) return Info;
  return ClipboardCheck;
}

function Mark({ children }: { children: ReactNode }) {
  return <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand text-sm font-medium text-rose">{children}</span>;
}

function SectionBlock({ section, index, note = false, bookHref = "/boka" }: { section: Doc["sections"][number]; index: number; note?: boolean; bookHref?: string }) {
  const subs = section.subsections.filter((sub) => pieces(sub.paragraphs).length > 0);
  const steps = !note && subs.length >= 3 && pieces(section.paragraphs).length === 0;
  const row = !note && subs.length >= 2 && subs.length <= 4 && pieces(section.paragraphs).length > 0 && !/kostar|pris/i.test(section.heading);
  const highlight = /390 kr/i.test(section.heading) && subs.length === 0;
  const booking = /boka/i.test(section.heading) && subs.length === 0;
  if (booking) {
    const intro = section.paragraphs.filter((line) => !/seminariegatan|telefon:/i.test(line));
    return (
      <section id={anchor(section.heading, index)} className="rounded-[28px] border border-line bg-paper p-6 md:grid md:grid-cols-[1.2fr_.8fr] md:gap-10 md:p-10">
        <div>
          <div className="flex items-start gap-3">
            <Mark><ClipboardCheck className="size-5" aria-hidden /></Mark>
            <h2 className="min-w-0 font-serif text-3xl text-balance">{section.heading}</h2>
          </div>
          <Prose lines={intro} />
          <div className="mt-5 grid grid-cols-1 gap-2 min-[420px]:flex">
            <Link href={bookHref} className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-5 text-white">Boka tid</Link>
            <a href={`tel:${clinic.phoneTel}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 text-ink">
              <Phone className="size-4" aria-hidden />
              Ring {clinic.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="mt-6 space-y-3 rounded-2xl border border-line bg-sand p-5 text-sm text-ink md:mt-0">
          <p className="flex items-start gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-rose" aria-hidden /><span><span className="block font-medium">{clinic.name}</span>{clinic.street}<br />{clinic.postal} {clinic.city}</span></p>
          <p className="flex items-center gap-3"><Phone className="size-5 shrink-0 text-rose" aria-hidden />{clinic.phoneDisplay}</p>
          <p className="flex items-center gap-3"><Clock className="size-5 shrink-0 text-rose" aria-hidden />Mån–fre 10–17 · lör–sön 11–17</p>
        </div>
      </section>
    );
  }
  if (note) {
    const NoteIcon = iconFor(section.heading);
    return (
      <div className="space-y-3">
        <section id={anchor(section.heading, index)} className="rounded-[28px] border border-line bg-sand p-6 md:p-8">
          <div className="flex items-start gap-3">
            <Mark><NoteIcon className="size-5" aria-hidden /></Mark>
            <h2 className="min-w-0 font-serif text-2xl text-balance text-ink">{section.heading}</h2>
          </div>
          <Prose lines={section.paragraphs} />
        </section>
        {subs.map((sub) => {
          const SubIcon = iconFor(sub.heading);
          return (
            <section key={sub.heading} className="rounded-[28px] border border-line bg-sand p-6 md:p-8">
              <div className="flex items-start gap-3">
                <Mark><SubIcon className="size-5" aria-hidden /></Mark>
                <h3 className="min-w-0 font-serif text-xl text-ink">{sub.heading}</h3>
              </div>
              <Prose lines={sub.paragraphs} />
            </section>
          );
        })}
      </div>
    );
  }
  const HeadIcon = iconFor(section.heading);
  return (
    <section id={anchor(section.heading, index)} className={highlight ? "rounded-[28px] border border-line bg-sand px-6 py-8 md:px-10" : undefined}>
      <div className="flex items-start gap-3">
        <Mark><HeadIcon className="size-5" aria-hidden /></Mark>
        <h2 className="min-w-0 font-serif text-3xl text-balance text-ink md:text-4xl">{section.heading}</h2>
      </div>
      <Prose lines={section.paragraphs} lead />
      {steps ? (
        <ol className="mt-6 space-y-5 rounded-[28px] border border-line bg-paper p-5 md:p-6">
          {subs.map((sub, step) => (
            <li key={sub.heading} className="flex gap-4">
              <Mark>{step + 1}</Mark>
              <span className="min-w-0">
                <span className="block font-medium text-ink">{sub.heading}</span>
                <Prose lines={sub.paragraphs} />
              </span>
            </li>
          ))}
        </ol>
      ) : subs.length ? (
        <div className={cn("mt-8 grid gap-3", row && subs.length >= 4 ? "sm:grid-cols-2 xl:grid-cols-4" : row ? "md:grid-cols-3" : "sm:grid-cols-2")}>
          {subs.map((sub, step) => {
            const SubIcon = iconFor(sub.heading);
            return (
              <div key={sub.heading} className="rounded-2xl border border-line bg-paper p-4">
                <Mark>{row ? step + 1 : <SubIcon className="size-5" aria-hidden />}</Mark>
                <h3 className="mt-3 font-medium text-ink">{sub.heading}</h3>
                <Prose lines={sub.paragraphs} />
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function anchor(value: string, index: number) {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "avsnitt"}-${index}`;
}

function crumbs(doc: Doc, h1: string) {
  const current: { href?: string; label: string } = { label: h1 };
  if (doc.kind === "post") return [{ href: "/", label: "Start" }, { href: "/blogg", label: "Guider" }, current];
  if (doc.kind === "treatment") return [{ href: "/", label: "Start" }, { href: "/behandlingar", label: "Behandlingar" }, current];
  return [{ href: "/", label: "Start" }, current];
}

export function ContentView({ doc }: { doc: Doc }) {
  const h1 = headingOf(doc);
  const kicker = doc.lead.find((line) => line.includes("·"));
  const lead = leadOf(doc).filter((line) => !isLabel(line) && !line.includes("→"));
  const sections = bodySections(doc);
  const faqs = faqsOf(doc);
  const image = imageFor(doc.slug, h1);
  const related = treatmentGroups
    .flatMap((group) => group.links)
    .filter((link) => link.href !== `/${doc.slug}`)
    .slice(0, 4);
  const service = serviceForPage(doc.slug);
  const bookHref = service ? `/boka?behandling=${service}` : "/boka";
  const showBook = doc.kind === "treatment" || doc.kind === "prices";
  const visible = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => pieces(section.paragraphs).length > 0 || section.subsections.some((sub) => pieces(sub.paragraphs).length > 0));
  const flow: Array<
    | { type: "single"; section: Doc["sections"][number]; index: number }
    | { type: "pair"; main: Doc["sections"][number]; side: Doc["sections"][number]; index: number; sideIndex: number }
  > = [];
  for (let i = 0; i < visible.length; i++) {
    const current = visible[i];
    const next = visible[i + 1];
    const note =
      next &&
      next.section.subsections.length <= 1 &&
      pieces(next.section.paragraphs).length > 0 &&
      pieces(next.section.paragraphs).length <= 3 &&
      !/boka/i.test(next.section.heading);
    const canPair = Boolean(note && (current.section.subsections.length >= 2 || /kostar/i.test(current.section.heading)) && !/boka/i.test(current.section.heading));
    if (canPair && next) {
      flow.push({ type: "pair", main: current.section, side: next.section, index: current.index, sideIndex: next.index });
      i += 1;
    } else {
      flow.push({ type: "single", section: current.section, index: current.index });
    }
  }
  const trail = crumbs(doc, h1);
  const faqHeading = doc.sections.find((section) => /frågor/i.test(section.heading))?.heading ?? "Vanliga frågor";
  const isBooking = (section: Doc["sections"][number]) => /boka/i.test(section.heading) && section.subsections.length === 0;
  const pageFlow = doc.kind === "treatment" ? flow.filter((block) => block.type === "pair" || !isBooking(block.section)) : flow;
  const bookingFlow = doc.kind === "treatment" ? flow.filter((block): block is Extract<typeof block, { type: "single" }> => block.type === "single" && isBooking(block.section)) : [];

  const pageUrl = `${clinic.url}/${doc.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": doc.kind === "post" ? "BlogPosting" : doc.kind === "treatment" ? "MedicalWebPage" : "WebPage",
    headline: h1,
    name: h1,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: doc.date,
    dateModified: doc.modified,
    image: `${clinic.url}${image.src}`,
    author: { "@type": "Organization", name: clinic.name, url: clinic.url },
    publisher: {
      "@type": "Organization",
      name: clinic.name,
      logo: { "@type": "ImageObject", url: `${clinic.url}/icon-512.png` },
    },
    ...(doc.kind === "treatment" ? { about: { "@type": "MedicalProcedure", name: h1 } } : {}),
    ...(doc.kind === "prices"
      ? {
          mainEntity: {
            "@type": "Offer",
            name: "Akutundersökning för nya patienter",
            price: "390",
            priceCurrency: "SEK",
            description: "Klinisk undersökning vid akuta besvär för dig som inte tidigare varit patient. Bildtagning och eventuell behandling tillkommer.",
            url: pageUrl,
          },
        }
      : {}),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${clinic.url}${item.href}` } : { item: pageUrl }),
    })),
  };

  return (
    <article className={showBook ? "pb-book" : undefined}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {doc.kind === "treatment" ? (
        <header className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-2 md:py-14">
          <div>
            <nav aria-label="Brödsmulor">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                {trail.map((item, index) => (
                  <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {index > 0 ? <span aria-hidden>/</span> : null}
                    {item.href && index < trail.length - 1 ? (
                      <Link href={item.href} className="hover:text-ink hover:underline">{item.label}</Link>
                    ) : (
                      <span className="text-ink" aria-current="page">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            {kicker ? <p className="kicker mt-4">{kicker}</p> : null}
            <h1 className="mt-3 font-serif text-4xl leading-[1.08] break-words text-balance sm:text-5xl">{h1}</h1>
            {lead.map((line) => (
              <p key={line} className="mt-4 max-w-xl text-muted">{line}</p>
            ))}
            <div className="mt-6 grid grid-cols-1 gap-2 min-[420px]:flex">
              <Link href={service ? `/boka?behandling=${service}` : "/boka"} className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-5 text-white">
                Boka tid
              </Link>
              <a href="#innehall" className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-5">
                Läs mer
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px] bg-sand">
            <img src={image.src} alt={image.alt} className="h-72 w-full object-cover md:h-[420px]" />
          </div>
        </header>
      ) : null}
      {doc.kind !== "treatment" ? (
      <header className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 md:grid-cols-[1.15fr_.85fr] md:gap-8 md:py-14 [&>*]:min-w-0">
        <div className="enter">
          <nav aria-label="Brödsmulor">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              {trail.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden>/</span> : null}
                  {item.href && index < trail.length - 1 ? (
                    <Link href={item.href} className="hover:text-ink hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-ink" aria-current="page">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="kicker mt-4">
            {doc.kind === "post" ? "Guide" : doc.kind === "legal" ? "Juridisk information" : "Diva Tandklinik · Göteborg"}
          </p>
          <h1 className="mt-3 max-w-full font-serif text-3xl leading-[1.08] break-words sm:text-4xl md:text-5xl">{h1}</h1>
          {h1 !== doc.h1 ? <p className="mt-3 text-muted">{doc.h1}</p> : null}
          {doc.kind === "post" ? (
            <time className="mt-3 block text-sm text-muted" dateTime={doc.date}>
              {new Date(doc.date).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          ) : null}
          {lead[0] ? <p className="mt-5 max-w-xl text-lg text-ink/90">{lead[0]}</p> : null}
          {lead.slice(1).map((line) => (
            <p key={line} className="mt-3 max-w-xl text-muted">
              {line}
            </p>
          ))}
          {showBook ? (
            <div className="mt-6 grid grid-cols-1 gap-2 min-[420px]:flex">
              <Link href={service ? `/boka?behandling=${service}` : "/boka"} className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-5 text-white">
                Boka tid
              </Link>
              <a href={`tel:${clinic.phoneTel}`} className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-5">
                Ring {clinic.phoneDisplay}
              </a>
            </div>
          ) : null}
        </div>
        <div className="enter d3 overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(29,36,71,0.08)]">
          <Drift>
            <img
              src={image.src}
              alt={image.alt}
              className="aspect-[16/10] h-auto max-h-60 w-full max-w-full scale-105 object-cover sm:max-h-none sm:aspect-[4/3]"
            />
          </Drift>
        </div>
      </header>
      ) : null}

      {doc.kind === "legal" ? (
        <aside className="mx-auto mb-8 max-w-3xl px-4">
          <div className="rounded-2xl border border-line bg-blush/60 p-4 text-sm">
            <p className="font-medium">Att godkänna före lansering</p>
            <p className="mt-1 text-muted">
              Texten nedan är klinikens policy, oförändrad i sak, senast uppdaterad 4 oktober 2026. Det som kan behöva
              justeras tekniskt är att sajten kan driftas hos Vercel, att bokningen ligger på den egna sidan i stället
              för en extern bokning, och att WordPress och Trustindex inte längre laddas. Google Maps visas på
              startsidan och kontaktsidan. Statistik startar bara efter samtycke om ett mät-id kopplas in.
            </p>
          </div>
        </aside>
      ) : null}

      <div id="innehall" className={cn("mx-auto max-w-6xl gap-16 px-4 py-16 md:py-20", doc.kind !== "legal" && doc.kind !== "treatment" && doc.kind !== "prices" && "lg:grid lg:grid-cols-[minmax(0,1fr)_280px]")}>
        <div className={cn("min-w-0 space-y-20", doc.kind === "treatment" || doc.kind === "prices" ? "max-w-none" : "max-w-3xl")}>
          {pageFlow.map((block) =>
            block.type === "pair" ? (
              <div key={block.main.heading} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <SectionBlock section={block.main} index={block.index} bookHref={bookHref} />
                <SectionBlock section={block.side} index={block.sideIndex} note bookHref={bookHref} />
              </div>
            ) : (
              <SectionBlock key={block.section.heading} section={block.section} index={block.index} bookHref={bookHref} />
            ),
          )}

          <FaqList heading={faqHeading} items={faqs} />

          {doc.kind === "treatment" ? (
            <>
              <section>
                <h2 className="font-serif text-3xl md:text-4xl">Fler vägar vidare</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {related.map((link) => (
                    <Link key={link.href} href={link.href} className="lift group flex h-full flex-col rounded-2xl border border-line bg-paper p-4">
                      <span className="flex size-10 items-center justify-center rounded-full bg-sand text-rose">
                        <TreatmentIcon name={link.icon} className="size-5" />
                      </span>
                      <span className="mt-3 block font-medium text-ink">{link.title}</span>
                      <span className="mt-1 block text-sm text-ink">{link.text}</span>
                    </Link>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="font-serif text-3xl md:text-4xl">Så upplever patienter Diva Tandklinik</h2>
                <p className="mt-3 text-sm">
                  <span className="text-spark">★★★★★</span> <span className="font-medium">{clinic.reviewLabel}</span>
                  <span className="text-muted"> · {clinic.reviews} omdömen</span>
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {reviews.map((review) => (
                    <figure key={review.name} className="rounded-2xl border border-line bg-paper p-5">
                      <p className="text-sm text-spark" aria-hidden>★★★★★</p>
                      <blockquote className="mt-2 text-[15px] leading-relaxed">{review.text}</blockquote>
                      <figcaption className="mt-3 text-sm text-muted">{review.name}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
              {bookingFlow.map((block) => (
                <SectionBlock key={block.section.heading} section={block.section} index={block.index} bookHref={bookHref} />
              ))}
            </>
          ) : null}
        </div>

        {doc.kind !== "legal" && doc.kind !== "treatment" && doc.kind !== "prices" ? (
          <aside className="mt-12 space-y-6 lg:mt-0">
            {sections.length > 1 ? (
              <nav aria-label="På den här sidan" className="hidden lg:block">
                <p className="kicker">På den här sidan</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {sections.map((section, index) => (
                    <li key={section.heading}>
                      <a href={`#${anchor(section.heading, index)}`} className="block leading-snug text-ink/80 hover:text-rose">
                        {section.heading}
                      </a>
                    </li>
                  ))}
                  {faqs.length ? (
                    <li>
                      <a href="#fragor" className="block leading-snug text-ink/80 hover:text-rose">Vanliga frågor</a>
                    </li>
                  ) : null}
                </ul>
              </nav>
            ) : null}
            <div className="space-y-4 lg:sticky lg:top-24">
            <div className="gradient-aqua rounded-3xl p-5">
              <h2 className="font-serif text-2xl">Nästa steg</h2>
              <p className="mt-2 text-sm text-muted">
                Boka en tid på Seminariegatan 10 eller ring {clinic.phoneDisplay} om du vill beskriva besvären först.
              </p>
              <div className="mt-4 grid gap-2">
                <Link href={service ? `/boka?behandling=${service}` : "/boka"} className="inline-flex h-11 items-center justify-center rounded-full bg-rose px-4 text-sm text-white">
                  Boka tid
                </Link>
                <a href={`tel:${clinic.phoneTel}`} className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-paper text-sm">
                  Ring {clinic.phoneDisplay}
                </a>
              </div>
            </div>
            {doc.kind === "treatment" ? (
              <div className="rounded-3xl border border-line bg-paper p-4">
                <p className="kicker">Relaterat</p>
                <ul className="mt-3 space-y-1">
                  {related.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="flex items-start gap-3 rounded-2xl px-2 py-2 hover:bg-sand">
                        <TreatmentIcon name={link.icon} className="mt-0.5 size-5 text-rose" />
                        <span>
                          <span className="block text-sm font-medium">{link.title}</span>
                          <span className="block text-sm text-muted">{link.text}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            </div>
          </aside>
        ) : null}
      </div>
      {showBook ? <BookBar service={service} /> : null}
    </article>
  );
}
