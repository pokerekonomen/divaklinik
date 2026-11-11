export type NavLink = {
  href: string;
  title: string;
  text: string;
  icon: IconName;
};

export type IconName =
  | "tooth"
  | "pulse"
  | "search"
  | "root"
  | "implant"
  | "align"
  | "wisdom"
  | "crack"
  | "spark"
  | "smile"
  | "calm"
  | "syringe";

export const treatmentGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Vanlig tandvård och akuta besvär",
    links: [
      { href: "/allmantandvard-goteborg", title: "Allmän tandvård", text: "Undersökning och lagning", icon: "tooth" },
      { href: "/undersokning", title: "Tandundersökning", text: "Kontroll och nästa steg", icon: "search" },
      { href: "/akut-tandvard-goteborg", title: "Akut tandvård", text: "Tandvärk och svullnad", icon: "pulse" },
      { href: "/rotfyllning-goteborg", title: "Rotfyllning", text: "När tanden värker", icon: "root" },
      { href: "/knackt-tand-i-goteborg", title: "Knäckt tand", text: "Sprucken eller skadad tand", icon: "crack" },
    ],
  },
  {
    title: "Ersätta och korrigera",
    links: [
      { href: "/tandimplantat-goteborg", title: "Tandimplantat", text: "Ersätta en saknad tand", icon: "implant" },
      { href: "/tandreglering-goteborg", title: "Tandreglering", text: "ClearCorrect för vuxna", icon: "align" },
      { href: "/visdomstandskirurgi", title: "Visdomstand", text: "Bedömning och kirurgi", icon: "wisdom" },
    ],
  },
  {
    title: "Leende och trygghet",
    links: [
      { href: "/tandblekning-goteborg", title: "Tandblekning", text: "Ljusare tänder", icon: "spark" },
      { href: "/estetisk-tandvard", title: "Estetisk tandvård", text: "Skalfasader och form", icon: "smile" },
      { href: "/tandvardsradsla", title: "Tandvårdsrädsla", text: "Lugnt tempo, du kan pausa", icon: "calm" },
      { href: "/injektionsbehandlingar-goteborg", title: "Injektioner", text: "Utförs av samarbetspartner", icon: "syringe" },
    ],
  },
];

export const aboutLinks = [
  { href: "/diva-tandklinik-goteborg", title: "Om kliniken", text: "Annedal sedan 2016" },
  { href: "/diva-tandklinik-goteborg#tandlakaren", title: "Tandläkaren", text: "Shahram Hamraz" },
  { href: "/#omdomen", title: "Omdömen", text: "Utmärkt på Google" },
];

export const treatmentHrefs = treatmentGroups.flatMap((group) => group.links.map((link) => link.href));
