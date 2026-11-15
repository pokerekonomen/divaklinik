import {createReadStream} from "node:fs";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {createClient} from "@sanity/client";
import {services} from "../../src/lib/booking-data.ts";
import {clinic} from "../../src/lib/clinic.ts";
import {guideImages} from "../../src/lib/guide-images.ts";
import {aboutLinks, treatmentGroups} from "../../src/lib/navigation.ts";

const root = path.resolve(import.meta.dirname, "../..");
const config = JSON.parse(await readFile(path.join(process.env.HOME, ".config/sanity/config.json"), "utf8"));
const client = createClient({
  projectId: "ds9qmuzt",
  dataset: "production",
  apiVersion: "2026-11-15",
  token: config.authToken,
  useCdn: false,
});

const uploaded = new Map();

async function image(rel) {
  if (!rel) return undefined;
  if (uploaded.has(rel)) return uploaded.get(rel);
  const filename = rel.replace(/^\//, "").replaceAll("/", "_");
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`, {filename});
  const ref = existing || (await client.assets.upload("image", createReadStream(path.join(root, "public", rel.replace(/^\//, ""))), {filename}))._id;
  const value = {_type: "image", asset: {_type: "reference", _ref: ref}};
  uploaded.set(rel, value);
  return value;
}

function keyed(items, prefix) {
  return items.map((item, index) => ({_key: `${prefix}${index}`, ...item}));
}

const docs = JSON.parse(await readFile(path.join(root, "src/content/documents.json"), "utf8"));
const pages = [];
for (const doc of docs) {
  const kind = ["treatment", "post", "about", "prices", "contact", "legal", "home"].includes(doc.kind) ? doc.kind : "other";
  pages.push({
    _id: `page-${doc.slug}`,
    _type: "page",
    title: doc.title,
    slug: {_type: "slug", current: doc.slug},
    kind,
    h1: doc.h1,
    lead: doc.lead ?? [],
    date: doc.date || undefined,
    image: await image(guideImages[doc.slug]),
    sections: keyed(
      (doc.sections ?? []).map((section, sectionIndex) => ({
        heading: section.heading,
        paragraphs: section.paragraphs ?? [],
        subsections: keyed(
          (section.subsections ?? []).map((sub) => ({
            heading: sub.heading,
            paragraphs: sub.paragraphs ?? [],
          })),
          `u${sectionIndex}-`,
        ),
      })),
      "s",
    ),
  });
}

const home = {
  _id: "startsida",
  _type: "homePage",
  kicker: "Privat tandläkare · Annedal",
  h1: "Tandläkare i Göteborg – trygg tandvård när du behöver den",
  lead: "Som privat tandläkare i Göteborg hjälper vi dig med personlig tandvård i Annedal, nära Linné och Vasastan.",
  heroImage: await image("/images/hero-klinik.webp"),
  reasons: keyed([
    {title: "Samma tandläkare", text: "Alla tider är hos Shahram Hamraz. Du möter samma person från första besöket till nästa steg."},
    {title: "Kostnad innan beslut", text: "Du får ett kostnadsförslag innan behandlingen börjar. Delbetalning kan göras via Resurs Bank."},
    {title: "Öppet även på helgen", text: "Lördag och söndag 11–17. Akuttid kan ofta erbjudas samma dag, beroende på tillgänglighet."},
  ], "r"),
  pathsHeading: "Vad behöver du hjälp med?",
  pathsLead: "Du behöver inte veta vilken behandling du behöver. Börja med det som bäst beskriver din situation så guidar vi dig vidare.",
  paths: keyed([
    {href: "/akut-tandvard-goteborg", title: "Jag har ont", text: "Tandvärk, svullnad, skadad eller knäckt tand.", icon: "pulse"},
    {href: "/undersokning", title: "Jag vill undersöka tänderna", text: "Undersökning, rådgivning och förebyggande tandvård.", icon: "search"},
    {href: "/tandimplantat-goteborg", title: "Jag saknar en tand", text: "Bedömning av tandimplantat och andra alternativ.", icon: "implant"},
    {href: "/estetisk-tandvard", title: "Jag vill förbättra mitt leende", text: "Tandblekning, tandreglering och estetisk tandvård.", icon: "smile"},
  ], "p"),
  featuredHeading: "Tandvård för det du behöver just nu",
  featuredLead: "Från en vanlig undersökning till akut hjälp, ersättning av saknade tänder och estetiska behandlingar. Välj ett område för att läsa mer om hur vi kan hjälpa dig.",
  featured: keyed([
    {href: "/allmantandvard-goteborg", title: "Allmän tandvård", text: "Undersökningar, lagningar och långsiktig hjälp för en frisk mun.", image: await image("/images/vantrum.webp")},
    {href: "/akut-tandvard-goteborg", title: "Akut tandvård", text: "Snabb hjälp vid tandvärk, svullnad, skadad eller knäckt tand.", image: await image("/images/behandlingsrum.webp")},
    {href: "/tandimplantat-goteborg", title: "Tandimplantat", text: "Individuell bedömning när en eller flera tänder behöver ersättas.", image: await image("/images/behandlingsrum-1280.webp")},
    {href: "/tandreglering-goteborg", title: "Tandreglering", text: "Diskret tandreglering för vuxna med individuell planering.", image: await image("/images/hero-klinik.webp")},
    {href: "/tandblekning-goteborg", title: "Tandblekning", text: "Professionell tandblekning efter bedömning av tänder och munhälsa.", image: await image("/images/vantrum.webp")},
    {href: "/rotfyllning-goteborg", title: "Rotfyllning", text: "Behandling när tandens pulpa är inflammerad eller infekterad.", image: await image("/images/hero-klinik.webp")},
  ], "f"),
  listeningHeading: "Trygg tandvård börjar med att du blir lyssnad på",
  listeningText: [
    "På Diva Tandklinik möter du tandläkare Shahram Hamraz. Här får du tydlig information om dina alternativ, kostnader och nästa steg innan behandlingen börjar.",
    "Känner du oro inför tandläkarbesök anpassar vi tempot och bemötandet efter dina behov. Målet är att du ska känna dig delaktig och trygg genom hela besöket.",
  ],
  listeningImage: await image("/images/behandlingsrum.webp"),
  reviewsHeading: "Vad våra patienter säger",
  reviewsLead: "Aktuella Google-omdömen hjälper dig att få en bild av hur andra patienter upplever bemötandet och vården på kliniken.",
  reviews: keyed([
    {name: "Nini M L", text: "Shahram är en riktigt skicklig, noggrann och vänlig tandläkare. Jag som annars tycker det är väldigt obehagligt med tandläkarbesök kände mig så väl omhändertagen och trygg."},
    {name: "Stefan", text: "Jag har en enorm skräck för tandläkare. Shahram förklarar, är lugn, sätter patienten i centrum och gjorde allt för att jag skulle vara lugn. Utan tvekan den bästa tandläkaren jag har träffat."},
    {name: "Marcus Lavsund", text: "Fantastiskt bemötande av Shahram som är lugn, pedagogisk och ärlig. Kommer definitivt på återbesök."},
    {name: "Andreas", text: "Jag ville ha en second opinion om en visdomstand. Shahram var mycket professionell och jag blev mycket klokare på vad som egentligen var problemet och hur det kunde lösas."},
  ], "o"),
  locationHeading: "Din tandläkare i Göteborg – nära Linné och Vasastan",
  locationText: "Hos oss får du personlig tandvård i en modern klinik på Seminariegatan 10. Vi hjälper både nya och återkommande patienter med planerad och akut tandvård.",
  locationImage: await image("/images/vantrum.webp"),
  mapHeading: "Diva Tandklinik i Annedal, Göteborg",
};

const clinicDoc = {
  _id: "klinik",
  _type: "clinicSettings",
  name: clinic.name,
  legalName: clinic.legalName,
  dentist: clinic.dentist,
  phoneDisplay: clinic.phoneDisplay,
  phoneTel: clinic.phoneTel,
  email: clinic.email,
  street: clinic.street,
  postal: clinic.postal,
  city: clinic.city,
  area: clinic.area,
  since: clinic.since,
  minAge: clinic.minAge,
  reviewLabel: clinic.reviewLabel,
  reviews: clinic.reviews,
  logo: await image("/icon-192.png"),
  favicon: await image("/images/favicon-32.png"),
  topBar: "Delbetalning via Resurs Bank · Akuttid ofta samma dag · Tydligt kostnadsförslag",
  hours: keyed(clinic.hours, "h"),
  maps: clinic.maps,
  directions: clinic.directions,
  mapEmbed: clinic.mapEmbed,
  url: clinic.url,
};

const menu = {
  _id: "meny",
  _type: "siteMenu",
  groups: keyed(
    treatmentGroups.map((group, groupIndex) => ({
      title: group.title,
      links: keyed(group.links, `l${groupIndex}-`),
    })),
    "g",
  ),
  about: keyed(aboutLinks, "a"),
};

const booking = {
  _id: "bokning",
  _type: "bookingSettings",
  intro: "Följ stegen. Hittar du ingen tid som passar, eller är osäker på vad du ska boka, går det bra att ringa eller skriva.",
  services: keyed(
    services.map((service) => ({
      serviceId: service.id,
      name: service.name,
      category: service.category,
      minutes: service.minutes,
      priceLabel: service.priceLabel,
      priceNote: service.priceNote,
      summary: service.summary,
      details: service.details,
      page: service.page,
      group: service.group,
    })),
    "b",
  ),
};

const transaction = client.transaction();
for (const doc of [clinicDoc, home, menu, booking, ...pages]) transaction.createOrReplace(doc);
await transaction.commit();
await client.delete("UvEoD1gVT1hfJt4gOXV9wG").catch(() => {});
const count = await client.fetch(`count(*[_type in ["page", "homePage", "clinicSettings", "siteMenu", "bookingSettings"]])`);
console.log(`Sparat ${pages.length} sidor. Dokument totalt: ${count}. Bilder: ${uploaded.size}.`);
