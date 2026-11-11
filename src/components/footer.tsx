import Link from "next/link";
import { clinic } from "@/lib/clinic";
import { treatmentGroups } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="gradient-deep border-t border-white/10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:gap-10 md:py-14">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-2xl">Diva Tandklinik</p>
          <p className="mt-3 text-sm text-cream/75">
            {clinic.street}
            <br />
            {clinic.postal} {clinic.city}
            <br />
            {clinic.area}, nära Linné och Vasastan
          </p>
          <p className="mt-4 text-sm">
            <a className="inline-flex min-h-11 items-center underline" href={`tel:${clinic.phoneTel}`}>
              {clinic.phoneDisplay}
            </a>
            <br />
            <a className="underline" href={`mailto:${clinic.email}`}>
              {clinic.email}
            </a>
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-cream/60 uppercase">Behandlingar</p>
          <ul className="mt-3 space-y-2 text-sm">
            {treatmentGroups.flatMap((group) => group.links).slice(0, 6).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-11 items-center hover:underline">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-cream/60 uppercase">Kliniken</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/diva-tandklinik-goteborg" className="inline-flex min-h-11 items-center hover:underline">Om oss</Link></li>
            <li><Link href="/priser-tandlakare-goteborg" className="inline-flex min-h-11 items-center hover:underline">Priser</Link></li>
            <li><Link href="/blogg" className="inline-flex min-h-11 items-center hover:underline">Guider</Link></li>
            <li><Link href="/kontakt" className="inline-flex min-h-11 items-center hover:underline">Kontakt</Link></li>
            <li><Link href="/boka" className="inline-flex min-h-11 items-center hover:underline">Boka tid</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs tracking-[0.14em] text-cream/60 uppercase">Öppettider</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/85">
            {clinic.hours.map((row) => (
              <li key={row.days} className="flex justify-between gap-4">
                <span>{row.days}</span>
                <span>{row.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-cream/70">Akuttid ofta samma dag, beroende på tillgänglighet.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 py-4 text-xs text-cream/70">
          <span>© {new Date().getFullYear()} {clinic.legalName}</span>
          <Link href="/privacy-policy" className="hover:underline">Integritetspolicy</Link>
          <Link href="/gdpr-policy" className="hover:underline">GDPR</Link>
          <Link href="/cookie-policy" className="hover:underline">Cookiepolicy</Link>
        </div>
      </div>
    </footer>
  );
}
