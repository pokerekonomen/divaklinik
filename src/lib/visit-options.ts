export type VisitOption = {
  id: string;
  label: string;
  minutes: number;
  price: string;
  note: string;
  href: string;
  book: string;
};

export const visitOptions: VisitOption[] = [
  {
    id: "akut",
    label: "Akut, ny patient",
    minutes: 30,
    price: "390 kr",
    note: "Priset gäller undersökningen. Bildtagning och eventuell behandling tillkommer. Tid finns ofta samma dag, beroende på tillgänglighet.",
    href: "/akut-tandvard-goteborg",
    book: "/boka?behandling=akuttid",
  },
  {
    id: "bas",
    label: "Basundersökning",
    minutes: 60,
    price: "690 kr",
    note: "Ordinarie pris 1 990 kr. Fullständig undersökning, fyra röntgenbilder och kostnadsförslag.",
    href: "/undersokning",
    book: "/boka?behandling=bas",
  },
  {
    id: "blekning",
    label: "Tandblekning",
    minutes: 30,
    price: "Pris vid konsultation",
    note: "Tänder och tandkött bedöms först. Blekning bokas när underlaget är lämpligt.",
    href: "/tandblekning-goteborg",
    book: "/boka?behandling=blekning",
  },
  {
    id: "reglering",
    label: "Tandreglering",
    minutes: 60,
    price: "Pris vid konsultation",
    note: "ClearCorrect för vuxna. Kliniken använder inte Invisalign. Själva behandlingen bokas efter undersökning.",
    href: "/tandreglering-goteborg",
    book: "/boka?behandling=clearcorrect",
  },
  {
    id: "implantat",
    label: "Tandimplantat",
    minutes: 40,
    price: "Pris vid konsultation",
    note: "En bedömning när en tand saknas. Kostnad och tidplan tas fram efter undersökningen.",
    href: "/tandimplantat-goteborg",
    book: "/boka?behandling=implantat",
  },
  {
    id: "rot",
    label: "Rotfyllning",
    minutes: 30,
    price: "Pris efter undersökning",
    note: "Besöket är en bedömning. Själva rotfyllningen planeras när du sett alternativ och kostnad.",
    href: "/rotfyllning-goteborg",
    book: "/boka?behandling=rot",
  },
];

export const homeFaqs = [
  {
    question: "Vad kostar en akuttid hos Diva Tandklinik?",
    answer: "Akutundersökning för nya patienter kostar 390 kr. Priset gäller undersökningen. Bildtagning och eventuell behandling tillkommer.",
  },
  {
    question: "Var ligger kliniken och när har ni öppet?",
    answer: "Diva Tandklinik ligger på Seminariegatan 10 i Annedal, Göteborg. Måndag till fredag 10–17 och lördag till söndag 11–17.",
  },
  {
    question: "Vilken tandläkare träffar jag?",
    answer: "Alla tider är hos Shahram Hamraz. Du möter samma tandläkare från första besöket.",
  },
  {
    question: "Tar ni emot barn?",
    answer: "Kliniken tar emot patienter från 20 år.",
  },
];

export const extraFaqs: Record<string, { question: string; answer: string }[]> = {
  "akut-tandvard-goteborg": [
    {
      question: "Kan jag få en akuttid samma dag i Göteborg?",
      answer: "Akuttid erbjuds ofta samma dag under öppettiderna, beroende på tillgänglighet. Ring 073-942 80 84 om besvären inte kan vänta.",
    },
    {
      question: "Vad ingår i priset 390 kr?",
      answer: "390 kr är akutundersökningen för dig som inte tidigare varit patient. Bildtagning och eventuell behandling tillkommer och prissätts innan den börjar.",
    },
  ],
  "tandblekning-goteborg": [
    {
      question: "Kan jag bleka tänderna direkt?",
      answer: "Nej. Tänder och tandkött bedöms först. Blekning bokas när underlaget är lämpligt, och tandsten tas bort innan om det behövs.",
    },
  ],
  "tandreglering-goteborg": [
    {
      question: "Använder ni Invisalign?",
      answer: "Nej. Diva Tandklinik använder ClearCorrect, genomskinliga skenor för vuxna. En plan tas fram efter undersökning.",
    },
  ],
  "priser-tandlakare-goteborg": [
    {
      question: "När får jag veta vad behandlingen kostar?",
      answer: "Du får ett kostnadsförslag innan behandlingen börjar. Betalning sker på kliniken. Delbetalning kan göras via Resurs Bank.",
    },
    {
      question: "Vad kostar en basundersökning?",
      answer: "Basundersökning utförd av tandläkare kostar 690 kr. Ordinarie pris är 1 990 kr. I priset ingår fullständig undersökning, fyra röntgenbilder och kostnadsförslag.",
    },
  ],
  undersokning: [
    {
      question: "Vad kostar en tandundersökning?",
      answer: "Basundersökning kostar 690 kr, mot ordinarie 1 990 kr. Den omfattar fullständig undersökning, fyra röntgenbilder och kostnadsförslag.",
    },
  ],
};
