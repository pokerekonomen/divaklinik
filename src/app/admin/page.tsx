import type { Metadata } from "next";
import { isAdmin, login, logout, setStatus } from "@/app/admin/actions";
import { listBookings, listMessages } from "@/lib/store";

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
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">Bokningar</h1>
        <form action={logout}>
          <button className="h-11 rounded-full border border-line px-4">Logga ut</button>
        </form>
      </div>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">När</th>
              <th className="px-4 py-3 font-medium">Behandling</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length ? bookings.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="px-4 py-3">{row.date} {row.time}</td>
                <td className="px-4 py-3">{row.serviceName}</td>
                <td className="px-4 py-3">{row.name || "—"}<br /><span className="text-muted">{row.phone} {row.email}</span></td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">
                  {row.status === "confirmed" ? (
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button className="underline">Avboka</button>
                    </form>
                  ) : null}
                </td>
              </tr>
            )) : (
              <tr><td className="px-4 py-6 text-muted" colSpan={5}>Inga bokningar ännu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
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
