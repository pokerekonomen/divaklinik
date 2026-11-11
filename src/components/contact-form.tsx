"use client";

import { useState } from "react";
import { sendMessage } from "@/app/kontakt/actions";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const result = await sendMessage(formData);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return <p className="rounded-2xl bg-sand p-4">Tack. Meddelandet är sparat hos kliniken. Vid akuta besvär är det snabbare att ringa.</p>;
  }

  return (
    <form action={onSubmit} className="grid gap-3">
      <label className="grid gap-1 text-sm font-medium">
        Namn
        <input name="name" required autoComplete="name" className="h-12 rounded-2xl border border-line bg-paper px-3 text-base font-normal" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Mobil
        <input name="phone" required type="tel" autoComplete="tel" inputMode="tel" className="h-12 rounded-2xl border border-line bg-paper px-3 text-base font-normal" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        E-post
        <input name="email" required type="email" autoComplete="email" className="h-12 rounded-2xl border border-line bg-paper px-3 text-base font-normal" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Meddelande
        <textarea name="message" required minLength={5} className="min-h-32 rounded-2xl border border-line bg-paper px-3 py-3 text-base font-normal" />
      </label>
      {error ? <p className="text-sm text-alert" role="alert">{error}</p> : null}
      <button className="h-12 rounded-full bg-rose text-white">Skicka</button>
    </form>
  );
}
