import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { CookieBanner } from "@/components/cookie-banner";
import { MotionProvider } from "@/components/motion-provider";
import { ScrollProgress } from "@/components/scroll-progress";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getSite } from "@/lib/cms";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: "500",
  display: "swap",
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-outfit",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { clinic } = await getSite();
  return {
    metadataBase: new URL(clinic.url),
    title: {
      default: "Tandläkare Göteborg | Diva Tandklinik",
      template: "%s | Diva Tandklinik",
    },
    description:
      "Privat tandläkare i Göteborg, Annedal. Undersökning, akut tandvård, implantat, tandreglering och tandblekning på Seminariegatan 10.",
    applicationName: clinic.name,
    icons: { icon: clinic.faviconUrl },
    openGraph: {
      locale: "sv_SE",
      siteName: clinic.name,
      type: "website",
      images: [{ url: "/images/hero-klinik.webp", width: 1280, height: 720, alt: clinic.name }],
    },
    robots: { index: true, follow: true },
  };
}

function jsonLdFor(clinic: Awaited<ReturnType<typeof getSite>>["clinic"]) {
  return {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": `${clinic.url}/#klinik`,
  name: clinic.name,
  legalName: clinic.legalName,
  url: clinic.url,
  telephone: clinic.phoneTel,
  email: clinic.email,
  image: `${clinic.url}/images/hero-klinik.webp`,
  medicalSpecialty: "https://schema.org/Dentistry",
  priceRange: "$$",
  currenciesAccepted: "SEK",
  paymentAccepted: "Kort, faktura, delbetalning",
  hasMap: clinic.maps,
  sameAs: [clinic.maps],
  isAcceptingNewPatients: true,
  availableService: [
    { "@type": "MedicalProcedure", name: "Akut tandvård" },
    { "@type": "MedicalProcedure", name: "Tandundersökning" },
    { "@type": "MedicalProcedure", name: "Tandblekning" },
    { "@type": "MedicalProcedure", name: "Tandreglering" },
    { "@type": "MedicalProcedure", name: "Tandimplantat" },
    { "@type": "MedicalProcedure", name: "Rotfyllning" },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    name: "Boka tid",
    target: `${clinic.url}/boka`,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: clinic.street,
    postalCode: clinic.postal,
    addressLocality: clinic.city,
    addressCountry: "SE",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "11:00", closes: "17:00" },
  ],
  areaServed: [
    { "@type": "City", name: "Göteborg" },
    { "@type": "Place", name: "Annedal" },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      name: "Akutundersökning för nya patienter",
      price: "390",
      priceCurrency: "SEK",
      description: "Klinisk undersökning vid akuta besvär. Bildtagning och eventuell behandling tillkommer.",
      url: `${clinic.url}/priser-tandlakare-goteborg`,
    },
    {
      "@type": "Offer",
      name: "Basundersökning",
      price: "690",
      priceCurrency: "SEK",
      description: "Fullständig undersökning, fyra röntgenbilder och kostnadsförslag. Ordinarie pris 1 990 kr.",
      url: `${clinic.url}/undersokning`,
    },
  ],
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { clinic, groups, about } = await getSite();
  const jsonLd = jsonLdFor(clinic);
  return (
    <html lang="sv" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>
        <MotionProvider>
        <ScrollProgress />
        <a
          href="#innehall"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
        >
          Hoppa till innehåll
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="bg-ink text-cream">
          <p className="px-4 py-1.5 text-center text-[11px] leading-5 sm:text-xs">{clinic.topBar}</p>
        </div>
        <Header clinic={clinic} treatmentGroups={groups} aboutLinks={about} logoUrl={clinic.logoUrl} />
        <main id="innehall">{children}</main>
        <Footer clinic={clinic} treatmentGroups={groups} />
        <CookieBanner />
        </MotionProvider>
      </body>
    </html>
  );
}
