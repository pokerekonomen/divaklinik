import type { Metadata } from "next";
import { isAdmin, login, logout, setStatus } from "@/app/admin/actions";
import { listBookings, listMessages, type BookingRecord } from "@/lib/store";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ fel?: string }> }) {
  const params = await searchParams;
  const allowed = await isAdmin();
  if (!allowed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-4xl">Klinikens vy</h1>
        <p className="mt-3 text-sm text-muted">
          Intern lista för bokningar. Tvåfaktorsinloggning är inte kopplad i den här versionen.
        </p>
        <form action={login} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm">
            Lösenord
            <input name="password" type="password" required className="h-12 rounded-2xl border border-line px-3" />
          </label>
          {params.fel ? <p className="text-sm text-spark">Fel lösenord.</p> : null}
          <button className="h-12 rounded-full bg-ink text-cream">Logga in</button>
        </form>
      </div>
    );
  }

  const [bookings, messages] = await Promise.all([listBookings(), listMessages()]);
  const todayParts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => todayParts.find((item) => item.type === type)?.value ?? "";
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const now = Date.now();
  const active = bookings.filter((row) => row.status !== "cancelled" && !(row.status === "held" && row.expiresAt && new Date(row.expiresAt).getTime() < now));
  const todayRows = active.filter((row) => row.date === today);
  const upcoming = active.filter((row) => row.date > today);
  const cancelled = bookings.filter((row) => row.status === "cancelled");
  const newPatients = active.filter((row) => row.newPatient).length;
  const calm = active.filter((row) => row.message.includes("tandvårdsrädsla")).length;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Dagens bokningar</h1>
          <p className="mt-2 text-sm text-muted">Testbokningar. Ingenting är skrivet i journalen.</p>
        </div>
        <form action={logout}>
          <button className="h-11 rounded-full border border-line px-4">Logga ut</button>
        </form>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <p className="rounded-3xl bg-paper p-4"><span className="block font-serif text-3xl">{todayRows.length}</span><span className="text-sm text-muted">Idag</span></p>
        <p className="rounded-3xl bg-paper p-4"><span className="block font-serif text-3xl">{newPatients}</span><span className="text-sm text-muted">Nya patienter</span></p>
        <p className="rounded-3xl bg-paper p-4"><span className="block font-serif text-3xl">{calm}</span><span className="text-sm text-muted">Önskar extra försiktighet</span></p>
      </div>
      <BookingList title="Idag" rows={todayRows} empty="Inga tider idag." />
      <BookingList title="Kommande" rows={upcoming} empty="Inga kommande tider." />
      <BookingList title="Avbokade" rows={cancelled} empty="Inga avbokningar." />
      <h2 className="mt-10 font-serif text-2xl">Meddelanden</h2>
      <ul className="mt-3 space-y-3">
        {messages.length ? messages.map((message) => (
          <li key={message.id} className="rounded-2xl border border-line bg-paper p-4 text-sm">
            <p className="font-medium">{message.name} · {message.phone}</p>
            <p className="text-muted">{message.email}</p>
            <p className="mt-2">{message.message}</p>
          </li>
        )) : <li className="text-sm text-muted">Inga meddelanden.</li>}
      </ul>
    </div>
  );
}

function BookingList({ title, rows, empty }: { title: string; rows: BookingRecord[]; empty: string }) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">{title}</h2>
      {rows.length ? (
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
          {rows.map((row) => (
            <li key={row.id} className="grid gap-2 px-4 py-4 text-sm md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center">
              <p>
                <span className="block font-medium">{row.time}</span>
                <span className="text-muted">{row.date}</span>
              </p>
              <div>
                <p className="font-medium">{row.serviceName} · {row.minutes} min</p>
                <p>{row.name || "Reservation pågår"}</p>
                <p className="text-muted">
                  {row.phone ? <a href={`tel:${row.phone}`}>{row.phone}</a> : null}
                  {row.phone && row.email ? " · " : null}
                  {row.email ? <a href={`mailto:${row.email}`}>{row.email}</a> : null}
                </p>
                <p className="mt-1 flex flex-wrap gap-2 text-xs">
                  {row.newPatient ? <span className="rounded-full bg-sand px-2 py-1">Ny patient</span> : null}
                  {row.message.includes("tandvårdsrädsla") ? <span className="rounded-full bg-sand px-2 py-1">Extra försiktighet</span> : null}
                  <span className="rounded-full bg-sand px-2 py-1">{row.status === "confirmed" ? "Test, inte i journalen" : row.status === "held" ? "Reserverad" : "Avbokad"}</span>
                </p>
              </div>
              {row.status === "confirmed" ? (
                <form action={setStatus}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value="cancelled" />
                  <button className="h-10 rounded-full border border-line px-4">Avboka</button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      ) : <p className="mt-3 text-sm text-muted">{empty}</p>}
    </section>
  );
}
