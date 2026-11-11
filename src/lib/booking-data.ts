export type Service = {
  id: string;
  name: string;
  category: string;
  minutes: number;
  priceLabel: string;
  priceNote?: string;
  summary: string;
  details: string;
  page?: string;
  group: "vanlig" | "mer";
};

export const services: Service[] = [
  {
    id: "akuttid",
    name: "Akuttid",
    category: "Akut",
    minutes: 30,
    priceLabel: "390 kr",
    priceNote: "Nya patienter. Priset gäller undersökningen. Bildtagning och eventuell behandling tillkommer.",
    summary: "Tandvärk, svullnad eller en skadad tand. Ofta samma dag.",
    details: "Akutundersökning för dig som inte tidigare varit patient hos kliniken. Akuttid erbjuds i mån av lediga tider under öppettiderna.",
    page: "/akut-tandvard-goteborg",
    group: "vanlig",
  },
  {
    id: "bas-tio",
    name: "Basundersökning inför tiotandvård",
    category: "Undersökning",
    minutes: 60,
    priceLabel: "Pris efter bedömning",
    summary: "En basundersökning med extra tid för rådgivning inför tiotandvården.",
    details: "För dig som vill förstå vad som kan gälla från året du fyller 67. Undersökning, röntgen och förebyggande vård ingår inte i tiotandvårdsstödet. Shahram går igenom vad som kan omfattas i just din plan.",
    page: "/undersokning",
    group: "vanlig",
  },
  {
    id: "bas",
    name: "Basundersökning utförd av tandläkare",
    category: "Undersökning",
    minutes: 60,
    priceLabel: "690 kr",
    priceNote: "Ordinarie pris 1 990 kr. Fullständig undersökning, fyra röntgenbilder och kostnadsförslag.",
    summary: "Fullständig undersökning, fyra röntgenbilder och kostnadsförslag.",
    details: "Tänder, tandkött och bett bedöms. Du får veta vad som är friskt, vad som behöver följas upp och vad nästa steg kostar innan något påbörjas.",
    page: "/undersokning",
    group: "vanlig",
  },
  {
    id: "hygien",
    name: "Hygienistbehandling",
    category: "Förebyggande",
    minutes: 45,
    priceLabel: "Pris efter bedömning",
    summary: "Utförd av legitimerad tandläkare, inte av en separat hygienist.",
    details: "Tandstensborttagning och förebyggande behandling hos Shahram Hamraz. Tempot anpassas om du är känslig eller känner oro.",
    page: "/allmantandvard-goteborg",
    group: "vanlig",
  },
  {
    id: "clearcorrect",
    name: "Konsultation osynlig tandställning",
    category: "Tandreglering",
    minutes: 60,
    priceLabel: "Pris vid konsultation",
    summary: "ClearCorrect, 60 minuter. Kliniken använder inte Invisalign.",
    details: "Rådgivning inför tandreglering med genomskinliga skenor för vuxna. En plan tas fram efter undersökning. Det här är inte en bokning av själva behandlingen.",
    page: "/tandreglering-goteborg",
    group: "vanlig",
  },
  {
    id: "blekning",
    name: "Tandblekning",
    category: "Estetik",
    minutes: 30,
    priceLabel: "Pris vid konsultation",
    summary: "Bedömning före professionell blekning.",
    details: "Tänder och tandkött bedöms först. Blekning bokas när underlaget är lämpligt. Tandsten tas bort innan, om det behövs.",
    page: "/tandblekning-goteborg",
    group: "vanlig",
  },
  {
    id: "knackt",
    name: "Knäckt eller skadad tand",
    category: "Akut",
    minutes: 30,
    priceLabel: "390 kr",
    priceNote: "Nya patienter. Undersökning. Bildtagning och behandling tillkommer.",
    summary: "Sprucken, knäckt eller utslagen tand.",
    details: "Samma akuta undersökning, bokad när tanden är skadad. Ring om du har kraftig blödning eller svullnad som ökar.",
    page: "/knackt-tand-i-goteborg",
    group: "mer",
  },
  {
    id: "radsla",
    name: "Lugnt första besök",
    category: "Trygghet",
    minutes: 40,
    priceLabel: "Pris efter bedömning",
    summary: "För dig med tandvårdsrädsla. Långsammare tempo och tydlig information.",
    details: "Du behöver inte beskriva besvär i formuläret. Säg att du är orolig, så läggs besöket upp i din takt.",
    page: "/tandvardsradsla",
    group: "mer",
  },
  {
    id: "implantat",
    name: "Konsultation tandimplantat",
    category: "Konsultation",
    minutes: 40,
    priceLabel: "Pris vid konsultation",
    summary: "När en eller flera tänder saknas.",
    details: "Bedömning av implantat och andra sätt att ersätta tanden. Kostnad och tidplan tas fram efter undersökningen.",
    page: "/tandimplantat-goteborg",
    group: "mer",
  },
  {
    id: "rot",
    name: "Bedömning inför rotfyllning",
    category: "Behandling",
    minutes: 30,
    priceLabel: "Pris efter undersökning",
    summary: "När en tand värker eller pulpan behöver bedömas.",
    details: "Besöket är en bedömning. Själva rotfyllningen planeras efter att du sett alternativ och kostnad.",
    page: "/rotfyllning-goteborg",
    group: "mer",
  },
  {
    id: "estetisk",
    name: "Konsultation estetisk tandvård",
    category: "Estetik",
    minutes: 40,
    priceLabel: "Pris vid konsultation",
    summary: "Skalfasader, form och färg.",
    details: "Genomgång av vad som är möjligt och vad som behöver göras först, till exempel rengöring eller lagning.",
    page: "/estetisk-tandvard",
    group: "mer",
  },
  {
    id: "visdom",
    name: "Bedömning visdomstand",
    category: "Kirurgi",
    minutes: 30,
    priceLabel: "Pris efter bedömning",
    summary: "Besvär eller en second opinion om en visdomstand.",
    details: "Shahram bedömer om tanden behöver tas bort, följas eller lämnas. Ingrepp bokas separat.",
    page: "/visdomstandskirurgi",
    group: "mer",
  },
];

export function serviceById(id: string) {
  return services.find((service) => service.id === id);
}

const pageToService: Record<string, string> = {
  undersokning: "bas",
  "akut-tandvard-goteborg": "akuttid",
  "knackt-tand-i-goteborg": "knackt",
  tandvardsradsla: "radsla",
  "rotfyllning-goteborg": "rot",
  "tandimplantat-goteborg": "implantat",
  "tandreglering-goteborg": "clearcorrect",
  "tandblekning-goteborg": "blekning",
  "estetisk-tandvard": "estetisk",
  visdomstandskirurgi: "visdom",
  "allmantandvard-goteborg": "bas",
};

export function serviceForPage(slug: string) {
  return pageToService[slug] ?? "";
}
