import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { CookieBanner } from "@/components/cookie-banner";
import { MotionProvider } from "@/components/motion-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { clinic } from "@/lib/clinic";
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

export const metadata: Metadata = {
  metadataBase: new URL(clinic.url),
  title: {
    default: "Tandläkare Göteborg | Diva Tandklinik",
    template: "%s | Diva Tandklinik",
  },
  description:
    "Privat tandläkare i Göteborg, Annedal. Undersökning, akut tandvård, implantat, tandreglering och tandblekning på Seminariegatan 10.",
  applicationName: clinic.name,
  openGraph: {
    locale: "sv_SE",
    siteName: clinic.name,
    type: "website",
    images: [{ url: "/images/hero-klinik.webp", width: 1280, height: 720, alt: "Diva Tandklinik" }],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
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
  areaServed: "Göteborg",
  makesOffer: {
    "@type": "Offer",
    name: "Akutundersökning för nya patienter",
    price: "390",
    priceCurrency: "SEK",
    description: "Klinisk undersökning vid akuta besvär. Bildtagning och eventuell behandling tillkommer.",
    url: `${clinic.url}/priser-tandlakare-goteborg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>
        <MotionProvider>
        <a
          href="#innehall"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
        >
          Hoppa till innehåll
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="bg-ink text-cream">
          <p className="px-4 py-1.5 text-center text-[11px] leading-5 sm:hidden">Akuttid ofta samma dag · Kostnadsförslag innan start</p>
          <p className="mx-auto hidden max-w-6xl flex-wrap gap-x-3 px-4 py-2 text-center text-xs tracking-wide sm:flex md:justify-center">
            <span>Delbetalning via Resurs Bank</span>
            <span aria-hidden>·</span>
            <span>Akuttid ofta samma dag</span>
            <span aria-hidden>·</span>
            <span>Tydligt kostnadsförslag</span>
          </p>
        </div>
        <Header />
        <main id="innehall">{children}</main>
        <Footer />
        <CookieBanner />
        </MotionProvider>
      </body>
    </html>
  );
}
