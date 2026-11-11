"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { cancelHold, completeBooking, reserveTime } from "@/app/boka/actions";
import { freeSlots } from "@/app/boka/slots";
import { serviceById, services, type Service } from "@/lib/booking-data";
import { clinic } from "@/lib/clinic";
import { cn } from "@/lib/cn";

type Confirmed = {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  minutes: number;
  name: string;
};

function monthMatrix(anchor: Date) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = Array.from({ length: start }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, month, day));
  return cells;
}

function iso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromIso(value: string) {
  return new Date(`${value}T12:00:00`);
}

function addDays(value: string, amount: number) {
  const date = fromIso(value);
  date.setDate(date.getDate() + amount);
  return iso(date);
}

function nextOpenDay() {
  const date = new Date();
  if (date.getHours() >= 16) date.setDate(date.getDate() + 1);
  return iso(date);
}

function pretty(date: string) {
  return fromIso(date).toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });
}

function ics(booking: Confirmed) {
  const [h, m] = booking.time.split(":").map(Number);
  const endTotal = h * 60 + m + booking.minutes;
  const stamp = booking.date.replaceAll("-", "");
  const start = `${stamp}T${booking.time.replace(":", "")}00`;
  const end = `${stamp}T${String(Math.floor(endTotal / 60)).padStart(2, "0")}${String(endTotal % 60).padStart(2, "0")}00`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Diva Tandklinik//SV",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Europe/Stockholm:${start}`,
    `DTEND;TZID=Europe/Stockholm:${end}`,
    `SUMMARY:Diva Tandklinik – ${booking.serviceName}`,
    "LOCATION:Seminariegatan 10\\, 413 13 Göteborg",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function BookingWizard({ initialService }: { initialService?: string }) {
  const known = services.some((item) => item.id === initialService);
  const [step, setStep] = useState(known ? 1 : 0);
  const [serviceId, setServiceId] = useState(known ? initialService! : "");
  const [cursor, setCursor] = useState(() => new Date());
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState("");
  const [holdId, setHoldId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<Confirmed | null>(null);
  const [infoId, setInfoId] = useState("");
  const [showMonth, setShowMonth] = useState(false);
  const service = serviceById(serviceId);
  const cells = useMemo(() => monthMatrix(cursor), [cursor]);
  const today = iso(new Date());
  const strip = date || nextOpenDay();

  async function loadDay(value: string, minutes: number) {
    setDate(value);
    setTime("");
    setError("");
    setLoadingSlots(true);
    try {
      setSlots(await freeSlots(value, minutes));
    } catch {
      setSlots([]);
      setError("Tiderna kunde inte hämtas. Försök igen eller ring kliniken.");
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    if (step === 1 && service && !date) void loadDay(nextOpenDay(), service.minutes);
    // Datumet hämtas en gång när tidsteget öppnas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, serviceId]);

  async function leaveHold() {
    if (!holdId) return;
    const id = holdId;
    setHoldId("");
    try {
      await cancelHold(id);
    } catch {
      setHoldId(id);
    }
  }

  async function goTo(index: number) {
    if (step === 2 && index < 2) await leaveHold();
    setError("");
    setStep(index);
  }

  function choose(item: Service) {
    setServiceId(item.id);
    setInfoId("");
    setStep(1);
    void loadDay(date || nextOpenDay(), item.minutes);
  }

  async function goToDetails(slot = time) {
    if (!serviceId || !date || !slot) {
      setError("Välj behandling, datum och tid.");
      return;
    }
    setTime(slot);
    setPending(true);
    setError("");
    try {
      if (holdId) await cancelHold(holdId);
      const result = await reserveTime({ serviceId, date, time: slot });
      if (!result.ok) {
        if (service) await loadDay(date, service.minutes);
        setError(result.error);
        return;
      }
      setHoldId(result.id);
      setStep(2);
    } catch {
      setError("Tiden kunde inte reserveras. Försök igen eller ring kliniken.");
    } finally {
      setPending(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("id", holdId);
    setPending(true);
    setError("");
    try {
      const result = await completeBooking(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone({
        id: result.booking.id,
        serviceName: result.booking.serviceName,
        date: result.booking.date,
        time: result.booking.time,
        minutes: result.booking.minutes,
        name: result.booking.name,
      });
    } catch {
      setError("Bokningen kunde inte sparas. Försök igen eller ring kliniken.");
    } finally {
      setPending(false);
    }
  }

  const calendarFile = useMemo(
    () => (done ? URL.createObjectURL(new Blob([ics(done)], { type: "text/calendar" })) : ""),
    [done],
  );
  useEffect(() => {
    return () => {
      if (calendarFile) URL.revokeObjectURL(calendarFile);
    };
  }, [calendarFile]);

  if (done && service) {
    return (
      <section className="rounded-[28px] bg-paper p-6 shadow-[0_16px_40px_rgba(29,36,71,0.06)] md:p-8">
        <p className="kicker">Bokningskvitto</p>
        <h2 className="mt-2 font-serif text-4xl">Tiden är reserverad</h2>
        <p className="mt-3 text-muted">
          {done.name}, du har bokat {done.serviceName.toLowerCase()} {pretty(done.date)} kl {done.time}. Behandlingen
          utförs av {clinic.dentist}. Bekräftelse via e-post och sms skickas när utskick är kopplat.
        </p>
        <dl className="mt-6 grid gap-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-line py-2"><dt>Plats</dt><dd>{clinic.street}, {clinic.city}</dd></div>
          <div className="flex justify-between gap-4 border-b border-line py-2"><dt>Tandläkare</dt><dd>{clinic.dentist}</dd></div>
          <div className="flex justify-between gap-4 py-2"><dt>Referens</dt><dd>{done.id.slice(0, 8)}</dd></div>
        </dl>
        <a href={calendarFile} download="diva-tandklinik.ics" className="mt-6 inline-flex h-12 items-center rounded-full bg-rose px-5 text-white">
          Lägg till i kalendern
        </a>
      </section>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div>
        <ol className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {["Behandling", "Tid", "Uppgifter"].map((label, index) => (
            <li key={label}>
              <button
                type="button"
                disabled={index > step}
                onClick={() => goTo(index)}
                className={cn("disabled:cursor-default", index === step ? "font-medium text-ink" : "text-muted")}
              >
                <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-sand text-xs text-rose">{index + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <m.div key={step} initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            {step === 0 ? <ServiceList infoId={infoId} setInfoId={setInfoId} onChoose={choose} /> : null}
            {step === 1 && service ? (
              <TimeStep
                service={service}
                date={date}
                strip={strip}
                today={today}
                slots={slots}
                time={time}
                loading={loadingSlots}
                pending={pending}
                error={error}
                showMonth={showMonth}
                cursor={cursor}
                cells={cells}
                onBack={() => goTo(0)}
                onPick={(value) => loadDay(value, service.minutes)}
                onContinue={goToDetails}
                onToggleMonth={() => setShowMonth((open) => !open)}
                onCursor={setCursor}
              />
            ) : null}
            {step === 2 && service ? (
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="rounded-[24px] bg-sand/70 p-5">
                  <p className="text-sm leading-relaxed">
                    Du bokar en <strong>{service.name.toLowerCase()}</strong>, {pretty(date)}, klockan <strong>{time}</strong>.
                    Behandlingen utförs av <strong>{clinic.dentist}</strong>
                    {service.priceLabel.includes("kr") ? <> och kostar <strong>{service.priceLabel}</strong></> : null}.
                  </p>
                  {service.priceNote ? <p className="mt-2 text-sm text-muted">{service.priceNote}</p> : null}
                  <p className="mt-2 text-sm text-muted">Tiden hålls i 10 minuter. Betalning sker på kliniken.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">Förnamn<input name="first" required autoComplete="given-name" className="h-12 rounded-2xl border border-line bg-paper px-3" /></label>
                  <label className="grid gap-1 text-sm">Efternamn<input name="last" required autoComplete="family-name" className="h-12 rounded-2xl border border-line bg-paper px-3" /></label>
                  <label className="grid gap-1 text-sm">Mobil<input name="phone" required type="tel" autoComplete="tel" className="h-12 rounded-2xl border border-line bg-paper px-3" /></label>
                  <label className="grid gap-1 text-sm">E-post<input name="email" required type="email" autoComplete="email" className="h-12 rounded-2xl border border-line bg-paper px-3" /></label>
                </div>
                <label className="flex gap-3 text-sm">
                  <input type="checkbox" name="calm" className="mt-1" />
                  <span>Jag är tandvårdsrädd och önskar extra försiktighet.</span>
                </label>
                <label className="grid gap-1 text-sm">
                  Meddelande till kliniken, valfritt
                  <textarea name="message" maxLength={400} placeholder="Till exempel hur du vill bli bemött. Lämna inga medicinska uppgifter här." className="min-h-24 rounded-2xl border border-line bg-paper px-3 py-2" />
                </label>
                <label className="flex gap-3 text-sm"><input type="checkbox" name="age" required className="mt-1" /><span>Jag är minst {clinic.minAge} år.</span></label>
                <label className="flex gap-3 text-sm">
                  <input type="checkbox" name="consent" required className="mt-1" />
                  <span>
                    Jag godkänner att uppgifterna används för att hantera besöket och har läst{" "}
                    <Link href="/privacy-policy" className="underline">integritetspolicyn</Link>.
                  </span>
                </label>
                {error ? <p className="text-sm text-alert" role="alert">{error}</p> : null}
                <div className="flex gap-2">
                  <button type="button" className="h-12 flex-1 rounded-full border border-line" onClick={() => goTo(1)}>Tillbaka</button>
                  <button disabled={pending} className="h-12 flex-1 rounded-full bg-rose text-white disabled:opacity-40">{pending ? "Bokar…" : "Bekräfta bokning"}</button>
                </div>
              </form>
            ) : null}
          </m.div>
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

function ServiceList({
  infoId,
  setInfoId,
  onChoose,
}: {
  infoId: string;
  setInfoId: (id: string) => void;
  onChoose: (service: Service) => void;
}) {
  return (
    <div className="grid gap-8">
      <ServiceGroup title="Hur kan vi hjälpa dig?" items={services.filter((item) => item.group === "vanlig")} infoId={infoId} setInfoId={setInfoId} onChoose={onChoose} />
      <ServiceGroup title="Fler tider" items={services.filter((item) => item.group === "mer")} infoId={infoId} setInfoId={setInfoId} onChoose={onChoose} />
    </div>
  );
}

function ServiceGroup({
  title,
  items,
  infoId,
  setInfoId,
  onChoose,
}: {
  title: string;
  items: Service[];
  infoId: string;
  setInfoId: (id: string) => void;
  onChoose: (service: Service) => void;
}) {
  return (
    <section>
      <h2 className="font-serif text-3xl">{title}</h2>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-paper">
        {items.map((item) => {
          const open = infoId === item.id;
          return (
            <li key={item.id}>
              <div className="flex items-stretch">
                <button type="button" onClick={() => onChoose(item)} className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left hover:bg-sand/50">
                  <span className="min-w-0">
                    <span className="block font-medium">{item.name}</span>
                    <span className="mt-0.5 block text-sm text-muted">{item.summary}</span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-label={`Mer om ${item.name}`}
                  onClick={() => setInfoId(open ? "" : item.id)}
                  className="grid w-12 shrink-0 place-items-center text-rose"
                >
                  i
                </button>
                <button type="button" onClick={() => onChoose(item)} aria-label={`Välj ${item.name}`} className="grid w-12 shrink-0 place-items-center text-muted">
                  →
                </button>
              </div>
              {open ? (
                <div className="px-4 pb-4 text-sm text-muted">
                  <p>{item.details}</p>
                  <p className="mt-2 text-ink">{item.minutes} minuter · {item.priceLabel}</p>
                  {item.priceNote ? <p className="mt-1">{item.priceNote}</p> : null}
                  {item.page ? <Link href={item.page} className="mt-2 inline-flex min-h-11 items-center text-rose-deep">Läs mer om behandlingen</Link> : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function TimeStep({
  service,
  date,
  strip,
  today,
  slots,
  time,
  loading,
  pending,
  error,
  showMonth,
  cursor,
  cells,
  onBack,
  onPick,
  onContinue,
  onToggleMonth,
  onCursor,
}: {
  service: Service;
  date: string;
  strip: string;
  today: string;
  slots: string[];
  time: string;
  loading: boolean;
  pending: boolean;
  error: string;
  showMonth: boolean;
  cursor: Date;
  cells: Array<Date | null>;
  onBack: () => void;
  onPick: (value: string) => void;
  onContinue: (slot: string) => void;
  onToggleMonth: () => void;
  onCursor: (date: Date) => void;
}) {
  const days = [0, 1, 2, 3, 4].map((offset) => addDays(strip, offset - 2));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-3xl">Välj tid</h2>
          <p className="mt-1 text-sm">{service.name}</p>
          <p className="text-sm text-muted">{clinic.name} · {clinic.dentist}</p>
        </div>
        <button type="button" onClick={onBack} className="h-10 rounded-full border border-line px-4 text-sm">Ändra behandling</button>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <button type="button" aria-label="Föregående dag" disabled={!date || date <= today} onClick={() => onPick(addDays(date, -1))} className="grid size-11 shrink-0 place-items-center rounded-full border border-line disabled:opacity-30">←</button>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:grid-cols-5">
          {days.map((value, index) => {
            const day = fromIso(value);
            const past = value < today;
            return (
              <button
                key={value}
                type="button"
                disabled={past}
                onClick={() => onPick(value)}
                className={cn("min-h-16 rounded-2xl border px-1 py-2 text-center", value === date ? "border-ink bg-ink text-cream" : "border-line bg-paper", past && "opacity-35", (index === 0 || index === 4) && "hidden sm:block")}
              >
                <span className="block text-xs capitalize">{day.toLocaleDateString("sv-SE", { weekday: "short" })}</span>
                <span className="font-serif text-lg">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
        <button type="button" aria-label="Senare dagar" onClick={() => onPick(addDays(date || strip, 1))} className="grid size-11 shrink-0 place-items-center rounded-full border border-line">→</button>
      </div>
      <button type="button" onClick={onToggleMonth} className="mt-3 text-sm text-rose-deep">{showMonth ? "Dölj kalender" : "Visa kalender"}</button>
      {showMonth ? (
        <div className="mt-3 rounded-[24px] border border-line bg-paper p-3">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" className="h-10 rounded-full px-3 hover:bg-sand" onClick={() => onCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Föregående månad">←</button>
            <p className="font-serif capitalize">{cursor.toLocaleDateString("sv-SE", { month: "long", year: "numeric" })}</p>
            <button type="button" className="h-10 rounded-full px-3 hover:bg-sand" onClick={() => onCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Nästa månad">→</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"].map((day) => <div key={day}>{day}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((cell, index) => {
              if (!cell) return <div key={`e-${index}`} />;
              const value = iso(cell);
              const past = value < today;
              return (
                <button key={value} type="button" disabled={past} onClick={() => onPick(value)} className={cn("h-10 rounded-full text-sm", value === date ? "bg-ink text-cream" : "hover:bg-sand", past && "text-muted/40")}>
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="mt-5 grid gap-2">
        {loading ? <p className="text-sm">Hämtar tider…</p> : slots.length ? slots.map((slot) => (
          <div key={slot} className={cn("flex items-center gap-3 rounded-2xl border px-3 py-3", time === slot ? "border-rose bg-blush" : "border-line bg-paper")}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-sm">{slot}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{clinic.dentist}</span>
              <span className="block text-sm text-muted">{service.minutes} min · {service.priceLabel}</span>
            </span>
            <button type="button" disabled={pending} onClick={() => onContinue(slot)} className="h-10 shrink-0 rounded-full bg-rose px-4 text-sm text-white disabled:opacity-40">
              {pending && time === slot ? "…" : "Boka"}
            </button>
          </div>
        )) : (
          <p className="text-sm">
            {date === today
              ? `Inga tider kvar idag. Nya tider visas fram till kl 17. Välj en senare dag eller ring ${clinic.phoneDisplay}.`
              : `Inga lediga tider den dagen. Prova ett annat datum eller ring ${clinic.phoneDisplay}.`}
          </p>
        )}
      </div>
      {error ? <p className="mt-3 text-sm text-alert" role="alert">{error}</p> : null}
    </div>
  );
}
