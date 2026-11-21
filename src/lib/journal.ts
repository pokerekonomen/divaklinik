import { muntraBookingDraft } from "@/lib/muntra-booking";
import { confirmBooking, holdSlot, listBookings, releaseHold, takenSlots, updateBooking } from "@/lib/store";

export type JournalMode = "test";

export type JournalHold = {
  serviceId: string;
  serviceName: string;
  practitionerId: "shahram";
  date: string;
  time: string;
  minutes: number;
};

export type JournalPatient = {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  newPatient: boolean;
  summary: string;
  location: string;
  price?: number;
};

const personnummer = /\b(?:19|20)?\d{6}[-+]?\d{4}\b/;
const muntraCeiling = 80;
const callBudget = 70;
const windowMs = 60_000;
const availabilityTtlMs = 60_000;
const slotWindowDays = 3;
const calls: number[] = [];
const availability = new Map<string, { at: number; rows: Awaited<ReturnType<typeof takenSlots>> }>();

const busyError = "Bokningen tar emot för många förfrågningar just nu. Vänta en minut eller ring kliniken.";

function allowCall() {
  const now = Date.now();
  while (calls.length && calls[0] <= now - windowMs) calls.shift();
  if (calls.length >= callBudget) return false;
  calls.push(now);
  return true;
}

function forgetAvailability() {
  availability.clear();
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

export function bookingPayloadError(patient: JournalPatient) {
  const text = `${patient.name}\n${patient.phone}\n${patient.email}\n${patient.message}`;
  if (personnummer.test(text)) {
    return "Lämna inte personnummer. Det hör hemma i journalsystemet, inte i webbokningen.";
  }
  return null;
}

export const journal = {
  mode: "test" as const,
  ceiling: muntraCeiling,
  budget: callBudget,
  async taken(date: string) {
    const cached = availability.get(date);
    if (cached && Date.now() - cached.at < availabilityTtlMs) {
      return { ok: true as const, rows: cached.rows };
    }
    if (!allowCall()) return { ok: false as const, error: busyError };
    const now = Date.now();
    let rows = cached?.rows ?? [];
    for (let offset = 0; offset < slotWindowDays; offset += 1) {
      const day = addDays(date, offset);
      const dayRows = await takenSlots(day);
      availability.set(day, { at: now, rows: dayRows });
      if (offset === 0) rows = dayRows;
    }
    return { ok: true as const, rows };
  },
  async hold(input: JournalHold) {
    if (!allowCall()) return { ok: false as const, error: busyError };
    forgetAvailability();
    return holdSlot(input);
  },
  async confirm(id: string, patient: JournalPatient) {
    const blocked = bookingPayloadError(patient);
    if (blocked) return { ok: false as const, error: blocked };
    const rows = await listBookings();
    const held = rows.find((row) => row.id === id);
    if (!held) return { ok: false as const, error: "Reservationen har gått ut. Välj tiden igen." };
    const draft = muntraBookingDraft({
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone,
      email: patient.email,
      message: patient.message,
      date: held.date,
      time: held.time,
      minutes: held.minutes,
      summary: patient.summary,
      location: patient.location,
      newPatient: patient.newPatient,
      price: patient.price,
    });
    if (!draft.ok) return draft;
    if (held.status === "held" && held.expiresAt && new Date(held.expiresAt).getTime() < Date.now()) {
      return { ok: false as const, error: "Reservationen har gått ut. Välj tiden igen." };
    }
    if (!allowCall()) return { ok: false as const, error: busyError };
    forgetAvailability();
    return confirmBooking(id, {
      ...patient,
      phone: draft.phone,
      dtstart: draft.draft.body.data.attributes.dtstart,
      dtend: draft.draft.body.data.attributes.dtend,
      summary: draft.draft.body.data.attributes.summary,
    });
  },
  async release(id: string) {
    if (!allowCall()) return;
    forgetAvailability();
    await releaseHold(id);
  },
  async cancel(id: string) {
    if (!allowCall()) return;
    forgetAvailability();
    await updateBooking(id, "cancelled");
  },
};
