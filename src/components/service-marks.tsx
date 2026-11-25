import type { ReactNode } from "react";
import Link from "next/link";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className="mark-draw h-16 w-16" aria-hidden {...stroke}>
      {children}
    </svg>
  );
}

function Estetik() {
  return (
    <Frame>
      <path d="M32 20c3.4 0 6 2.6 6 6 0 2-1 3.4-1.7 5.2l-1.6 10.6c-.3 1.5-1.3 2.4-2.7 2.4s-2.4-.9-2.7-2.4l-1.6-10.6c-.7-1.8-1.7-3.2-1.7-5.2 0-3.4 2.6-6 6-6Z" />
      <path d="M16 28c1.4-10 10-16 20-14" />
      <path d="M33.2 12.2 36.4 10l.6 4.2" />
      <path d="M48 36c-1.4 10-10 16-20 14" />
      <path d="M30.8 51.8 27.6 54l-.6-4.2" />
    </Frame>
  );
}

function Implantat() {
  return (
    <Frame>
      <path d="M23 9h18l-1.8 7H24.8L23 9Z" />
      <path d="M26 16h12l2.2 34.5c.2 2.4-1.8 4.5-4.2 4.5h-8c-2.4 0-4.4-2.1-4.2-4.5L26 16Z" />
      <path d="M20 25.5h24M21.5 34h21M23 42.5h18" />
    </Frame>
  );
}

function Krona() {
  return (
    <Frame>
      <path d="M32 8c6.4 0 11 4.6 11 10.6 0 2.6-1 4.4-2.2 6.4H23.2C22 23 21 21.2 21 18.6 21 12.6 25.6 8 32 8Z" />
      <path d="M23.2 25h17.6" />
      <path d="M24.4 25c.8 6 1.6 16 2.4 24.2.3 2.4 2 4 5.2 4s4.9-1.6 5.2-4c.8-8.2 1.6-18.2 2.4-24.2" />
    </Frame>
  );
}

function Allman() {
  return (
    <Frame>
      <path d="M13 42c1.2 9 8 15 19 15s17.8-6 19-15" />
      <rect x="16" y="28" width="6.5" height="12" rx="3" />
      <rect x="24.5" y="23" width="7" height="16" rx="3.2" />
      <rect x="33.5" y="23" width="7" height="16" rx="3.2" />
      <rect x="42.5" y="28" width="6.5" height="12" rx="3" />
    </Frame>
  );
}

function Undersokning() {
  return (
    <Frame>
      <path d="M27 8c5.4 0 9.6 4 9.6 9.6 0 3.4-1.6 5.6-2.8 8.6l-2.6 17.2c-.4 2.2-2 3.6-3.6 3.6s-3.2-1.4-3.6-3.6l-2.6-17.2c-1.2-3-2.8-5.2-2.8-8.6C18.6 12 22.8 8 27 8Z" />
      <circle cx="45" cy="43" r="8.5" />
      <path d="m51.2 49.2 6 6" />
    </Frame>
  );
}

function Blekning() {
  return (
    <Frame>
      <path d="M24 10c5.6 0 10 4.2 10 10 0 3.6-1.8 5.8-3 9L28.2 49c-.4 2.4-2.2 3.8-4 3.8s-3.6-1.4-4-3.8l-2.8-20c-1.2-3.2-3-5.4-3-9 0-5.8 4.4-10 10-10Z" />
      <path d="M47 12.5 48.6 16.6 52.8 18.2 48.6 19.8 47 23.9 45.4 19.8 41.2 18.2 45.4 16.6 47 12.5Z" />
      <path d="M54 26.5 55 29.1 57.6 30.1 55 31.1 54 33.7 53 31.1 50.4 30.1 53 29.1 54 26.5Z" />
    </Frame>
  );
}

const marks = [
  { href: "/estetisk-tandvard", label: "Estetisk tandvård", icon: Estetik },
  { href: "/tandimplantat-goteborg", label: "Tandimplantat", icon: Implantat },
  { href: "/nar-behovs-tandkrona-guide-skydd-goteborg", label: "Tandkronor", icon: Krona },
  { href: "/allmantandvard-goteborg", label: "Allmän tandvård", icon: Allman },
  { href: "/undersokning", label: "Tandundersökning", icon: Undersokning },
  { href: "/tandblekning-goteborg", label: "Tandblekning", icon: Blekning },
];

export function ServiceMarks() {
  return (
    <section className="bg-sand" aria-label="Behandlingar">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-3 gap-y-8 px-4 py-10 sm:grid-cols-3 lg:grid-cols-6">
        {marks.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group flex h-full flex-col items-center text-center">
              <span className="text-rose transition-transform duration-200 group-hover:-translate-y-0.5">
                <item.icon />
              </span>
              <span className="mt-3 max-w-[9.5rem] text-sm leading-snug text-ink">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
