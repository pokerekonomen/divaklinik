import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-3 font-serif text-4xl">Sidan finns inte</h1>
      <p className="mt-3 text-muted">Adressen kan ha bytt namn. Gå tillbaka till startsidan eller behandlingarna.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="inline-flex h-11 items-center rounded-full bg-rose px-4 text-white">Startsida</Link>
        <Link href="/behandlingar" className="inline-flex h-11 items-center rounded-full border border-line px-4">Behandlingar</Link>
      </div>
    </div>
  );
}
