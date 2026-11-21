"use server";

import { journal } from "@/lib/journal";

function weekday(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

function shiftDate(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

export async function soonestSlot(minutes: number) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  const start = `${part("year")}-${part("month")}-${part("day")}`;
  for (let offset = 0; offset < 6; offset += 1) {
    const date = shiftDate(start, offset);
    const result = await freeSlots(date, minutes);
    if (result.error) return { ok: false as const, error: result.error };
    if (result.slots[0]) return { ok: true as const, date, time: result.slots[0] };
  }
  return { ok: true as const, date: "", time: "" };
}

export async function freeSlots(date: string, minutes: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { slots: [] as string[] };
  const weekend = weekday(date) === 0 || weekday(date) === 6;
  const start = weekend ? 11 : 10;
  const taken = await journal.taken(date);
  if (!taken.ok) return { slots: [] as string[], error: taken.error };
  const nowParts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const part = (type: string) => nowParts.find((item) => item.type === type)?.value ?? "0";
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const nowMinutes = Number(part("hour")) * 60 + Number(part("minute")) + 60;
  const slots: string[] = [];
  for (let hour = start; hour < 17; hour += 1) {
    for (const minute of [0, 30]) {
      const end = hour * 60 + minute + minutes;
      if (end > 17 * 60) continue;
      const begin = hour * 60 + minute;
      const label = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      if (date === today && begin < nowMinutes) continue;
      const busy = taken.rows.some((row) => {
        const [bookedHour, bookedMinute] = row.time.split(":").map(Number);
        const booked = bookedHour * 60 + bookedMinute;
        return begin < booked + row.minutes && booked < end;
      });
      if (!busy) slots.push(label);
    }
  }
  return { slots };
}
