import { cache } from "react";
import { services as localServices, type Service } from "@/lib/booking-data";
import { clinic as localClinic } from "@/lib/clinic";
import { allDocs, type Doc, type Section } from "@/lib/content";
import { aboutLinks as localAbout, treatmentGroups as localGroups, type IconName, type NavLink } from "@/lib/navigation";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ds9qmuzt";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

type SanityImage = { asset?: { _ref?: string } } | null;
type RemotePage = {
  title?: string;
  slug?: string;
  kind?: string;
  h1?: string;
  lead?: string[];
  date?: string;
  image?: SanityImage;
  sections?: Array<{
    heading?: string;
    paragraphs?: string[];
    subsections?: Array<{ heading?: string; paragraphs?: string[] }>;
  }>;
};

export type SiteClinic = {
  name: string;
  legalName: string;
  dentist: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  street: string;
  postal: string;
  city: string;
  area: string;
  since: number;
  minAge: number;
  reviewLabel: string;
  reviews: number;
  maps: string;
  directions: string;
  mapEmbed: string;
  url: string;
  hours: ReadonlyArray<{ days: string; time: string }>;
  logoUrl: string;
  faviconUrl: string;
  topBar: string;
};
export type HomeContent = {
  kicker: string;
  h1: string;
  lead: string;
  heroUrl: string;
  reasons: Array<{ title: string; text: string }>;
  pathsHeading: string;
  pathsLead: string;
  paths: Array<{ href: string; title: string; text: string; icon: IconName }>;
  featuredHeading: string;
  featuredLead: string;
  featured: Array<{ href: string; title: string; text: string; image: string; pos: string }>;
  listeningHeading: string;
  listeningText: string[];
  listeningImage: string;
  reviewsHeading: string;
  reviewsLead: string;
  reviews: Array<{ name: string; text: string }>;
  locationHeading: string;
  locationText: string;
  locationImage: string;
  mapHeading: string;
};

const positions: Record<string, string> = {
  "/allmantandvard-goteborg": "center",
  "/akut-tandvard-goteborg": "center",
  "/tandimplantat-goteborg": "center",
  "/tandreglering-goteborg": "center",
  "/tandblekning-goteborg": "center",
  "/rotfyllning-goteborg": "center",
};

const treatmentImages: Record<string, string> = {
  "/allmantandvard-goteborg": "/images/behandlingar/allman-tandvard.webp",
  "/akut-tandvard-goteborg": "/images/behandlingar/akut-tandvard.webp",
  "/tandimplantat-goteborg": "/images/behandlingar/tandimplantat-modell.webp",
  "/tandreglering-goteborg": "/images/behandlingar/tandreglering.webp",
  "/tandblekning-goteborg": "/images/behandlingar/tandblekning.webp",
  "/rotfyllning-goteborg": "/images/behandlingar/rotfyllning.webp",
};

function imageUrl(image?: SanityImage) {
  const ref = image?.asset?._ref;
  if (!ref) return "";
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return "";
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}-${match[2]}.${match[3]}`;
}

const query = `{
  "clinic": *[_id == "klinik"][0],
  "home": *[_id == "startsida"][0],
  "menu": *[_id == "meny"][0],
  "booking": *[_id == "bokning"][0],
  "pages": *[_type == "page"]{
    title, "slug": slug.current, kind, h1, lead, date, image, sections
  }
}`;

async function load() {
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-11-15/data/query/${dataset}`);
  url.searchParams.set("query", query);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Sanity svarade inte");
  const json = (await response.json()) as { result?: Record<string, unknown> };
  return json.result ?? {};
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function clinicFrom(remote: Record<string, unknown> | undefined): SiteClinic {
  const hours = Array.isArray(remote?.hours)
    ? remote.hours
        .map((row) => {
          const item = row as { days?: string; time?: string };
          return { days: item.days ?? "", time: item.time ?? "" };
        })
        .filter((row) => row.days || row.time)
    : [];
  return {
    ...localClinic,
    name: text(remote?.name, localClinic.name),
    legalName: text(remote?.legalName, localClinic.legalName),
    dentist: text(remote?.dentist, localClinic.dentist),
    phoneDisplay: text(remote?.phoneDisplay, localClinic.phoneDisplay),
    phoneTel: text(remote?.phoneTel, localClinic.phoneTel),
    email: text(remote?.email, localClinic.email),
    street: text(remote?.street, localClinic.street),
    postal: text(remote?.postal, localClinic.postal),
    city: text(remote?.city, localClinic.city),
    area: text(remote?.area, localClinic.area),
    since: typeof remote?.since === "number" ? remote.since : localClinic.since,
    minAge: typeof remote?.minAge === "number" ? remote.minAge : localClinic.minAge,
    reviewLabel: text(remote?.reviewLabel, localClinic.reviewLabel),
    reviews: typeof remote?.reviews === "number" ? remote.reviews : localClinic.reviews,
    maps: text(remote?.maps, localClinic.maps),
    directions: text(remote?.directions, localClinic.directions),
    mapEmbed: text(remote?.mapEmbed, localClinic.mapEmbed),
    url: text(remote?.url, localClinic.url),
    hours: hours.length ? hours : localClinic.hours.map((row) => ({ ...row })),
    logoUrl: imageUrl(remote?.logo as SanityImage) || "/icon-192.png",
    faviconUrl: imageUrl(remote?.favicon as SanityImage) || "/images/favicon-32.png",
    topBar: text(remote?.topBar, "Delbetalning via Resurs Bank · Akuttid ofta samma dag · Tydligt kostnadsförslag"),
  };
}

function linksOf(value: unknown, fallback: NavLink[]): NavLink[] {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item) => {
    const link = item as Partial<NavLink>;
    return {
      href: link.href || "/",
      title: link.title || "",
      text: link.text || "",
      icon: (link.icon || "tooth") as IconName,
    };
  });
}

function homeFrom(remote: Record<string, unknown> | undefined, fallback: HomeContent): HomeContent {
  if (!remote) return fallback;
  const reasons = Array.isArray(remote.reasons) ? remote.reasons.map((item) => item as { title?: string; text?: string }).filter((item) => item.title) : [];
  const paths = Array.isArray(remote.paths) ? remote.paths.map((item) => item as HomeContent["paths"][number]).filter((item) => item.href && item.title) : [];
  const featured = Array.isArray(remote.featured)
    ? remote.featured
        .map((item) => {
          const card = item as { href?: string; title?: string; text?: string; image?: SanityImage };
          return {
            href: card.href || "/",
            title: card.title || "",
            text: card.text || "",
            image: imageUrl(card.image) || treatmentImages[card.href || ""] || "/images/hero-klinik.webp",
            pos: positions[card.href || ""] || "center",
          };
        })
        .filter((item) => item.title)
    : [];
  const reviews = Array.isArray(remote.reviews) ? remote.reviews.map((item) => item as { name?: string; text?: string }).filter((item) => item.name && item.text) : [];
  const listening = Array.isArray(remote.listeningText) ? remote.listeningText.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  return {
    ...fallback,
    kicker: text(remote.kicker, fallback.kicker),
    h1: text(remote.h1, fallback.h1),
    lead: text(remote.lead, fallback.lead),
    heroUrl: imageUrl(remote.heroImage as SanityImage) || fallback.heroUrl,
    reasons: reasons.length ? reasons.map((item) => ({ title: item.title || "", text: item.text || "" })) : fallback.reasons,
    pathsHeading: text(remote.pathsHeading, fallback.pathsHeading),
    pathsLead: text(remote.pathsLead, fallback.pathsLead),
    paths: paths.length ? paths.map((item) => ({ ...item, icon: (item.icon || "tooth") as IconName })) : fallback.paths,
    featuredHeading: text(remote.featuredHeading, fallback.featuredHeading),
    featuredLead: text(remote.featuredLead, fallback.featuredLead),
    featured: featured.length ? featured : fallback.featured,
    listeningHeading: text(remote.listeningHeading, fallback.listeningHeading),
    listeningText: listening.length ? listening : fallback.listeningText,
    listeningImage: imageUrl(remote.listeningImage as SanityImage) || fallback.listeningImage,
    reviewsHeading: text(remote.reviewsHeading, fallback.reviewsHeading),
    reviewsLead: text(remote.reviewsLead, fallback.reviewsLead),
    reviews: reviews.length ? reviews.map((item) => ({ name: item.name || "", text: item.text || "" })) : fallback.reviews,
    locationHeading: text(remote.locationHeading, fallback.locationHeading),
    locationText: text(remote.locationText, fallback.locationText),
    locationImage: imageUrl(remote.locationImage as SanityImage) || fallback.locationImage,
    mapHeading: text(remote.mapHeading, fallback.mapHeading),
  };
}

const fallbackHome: HomeContent = {
  kicker: "Privat tandläkare · Annedal",
  h1: "Tandläkare i Göteborg – trygg tandvård när du behöver den",
  lead: "Som privat tandläkare i Göteborg hjälper vi dig med personlig tandvård i Annedal, nära Linné och Vasastan.",
  heroUrl: "/images/hero-klinik.webp",
  reasons: [],
  pathsHeading: "Vad behöver du hjälp med?",
  pathsLead: "Du behöver inte veta vilken behandling du behöver. Börja med det som bäst beskriver din situation så guidar vi dig vidare.",
  paths: [],
  featuredHeading: "Tandvård för det du behöver just nu",
  featuredLead: "Från en vanlig undersökning till akut hjälp, ersättning av saknade tänder och estetiska behandlingar. Välj ett område för att läsa mer om hur vi kan hjälpa dig.",
  featured: [],
  listeningHeading: "Trygg tandvård börjar med att du blir lyssnad på",
  listeningText: [],
  listeningImage: "/images/behandlingsrum.webp",
  reviewsHeading: "Vad våra patienter säger",
  reviewsLead: "Aktuella Google-omdömen hjälper dig att få en bild av hur andra patienter upplever bemötandet och vården på kliniken.",
  reviews: [],
  locationHeading: "Din tandläkare i Göteborg – nära Linné och Vasastan",
  locationText: "Hos oss får du personlig tandvård i en modern klinik på Seminariegatan 10. Vi hjälper både nya och återkommande patienter med planerad och akut tandvård.",
  locationImage: "/images/vantrum.webp",
  mapHeading: "Diva Tandklinik i Annedal, Göteborg",
};

function pageFrom(remote: RemotePage, local?: Doc): Doc {
  const sections: Section[] = (remote.sections ?? [])
    .filter((section) => section.heading || section.paragraphs?.length)
    .map((section) => ({
      heading: section.heading || "",
      paragraphs: section.paragraphs ?? [],
      subsections: (section.subsections ?? [])
        .filter((sub) => sub.heading || sub.paragraphs?.length)
        .map((sub) => ({ heading: sub.heading || "", level: 3, paragraphs: sub.paragraphs ?? [] })),
    }));
  return {
    id: local?.id ?? 0,
    slug: remote.slug || local?.slug || "",
    kind: remote.kind || local?.kind || "other",
    title: remote.title || local?.title || "",
    link: local?.link ?? "",
    date: remote.date || local?.date || "",
    modified: local?.modified ?? "",
    h1: remote.h1 || local?.h1 || remote.title || "",
    lead: remote.lead?.length ? remote.lead : local?.lead ?? [],
    sections: sections.length ? sections : local?.sections ?? [],
    chars: local?.chars ?? 0,
    fromSanity: true,
    imageUrl: imageUrl(remote.image) || undefined,
  };
}

export const getSite = cache(async () => {
  let remote: Record<string, unknown> = {};
  try {
    remote = await load();
  } catch {
    remote = {};
  }
  const pages = new Map<string, Doc>();
  const localBySlug = new Map(allDocs().map((doc) => [doc.slug, doc]));
  for (const doc of allDocs()) pages.set(doc.slug, doc);
  const remotePages = Array.isArray(remote.pages) ? (remote.pages as RemotePage[]) : [];
  for (const page of remotePages) {
    if (!page.slug) continue;
    pages.set(page.slug, pageFrom(page, localBySlug.get(page.slug)));
  }
  const menu = remote.menu as { groups?: Array<{ title?: string; links?: NavLink[] }>; about?: NavLink[] } | undefined;
  const groups = Array.isArray(menu?.groups) && menu.groups.length
    ? menu.groups.map((group, index) => ({
        title: group.title || localGroups[index]?.title || "Behandlingar",
        links: linksOf(group.links, localGroups[index]?.links ?? []),
      }))
    : localGroups;
  const booking = remote.booking as { services?: Array<Record<string, unknown>> } | undefined;
  const services: Service[] = Array.isArray(booking?.services) && booking.services.length
    ? booking.services.map((item) => ({
        id: String(item.serviceId || ""),
        name: String(item.name || ""),
        category: String(item.category || ""),
        minutes: Number(item.minutes || 30),
        priceLabel: String(item.priceLabel || ""),
        priceNote: item.priceNote ? String(item.priceNote) : undefined,
        summary: String(item.summary || ""),
        details: String(item.details || ""),
        page: item.page ? String(item.page) : undefined,
        group: item.group === "mer" ? "mer" as const : "vanlig" as const,
      })).filter((item) => item.id && item.name)
    : localServices;
  return {
    clinic: clinicFrom(remote.clinic as Record<string, unknown> | undefined),
    home: homeFrom(remote.home as Record<string, unknown> | undefined, fallbackHome),
    groups,
    about: linksOf(menu?.about, localAbout.map((link) => ({ ...link, icon: "tooth" as const }))),
    services,
    pages,
  };
});

export async function resolveDoc(slug: string) {
  const site = await getSite();
  return site.pages.get(slug);
}

export async function resolvePosts() {
  const site = await getSite();
  return [...site.pages.values()].filter((doc) => doc.kind === "post").sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getServices() {
  return (await getSite()).services;
}
