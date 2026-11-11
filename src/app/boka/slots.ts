"use server";

import { takenSlots } from "@/lib/store";

export async function freeSlots(date: string, minutes: number) {
  const day = new Date(`${date}T12:00:00`);
  if (Number.isNaN(day.getTime())) return [];
  const weekend = day.getDay() === 0 || day.getDay() === 6;
  const start = weekend ? 11 : 10;
  const taken = await takenSlots(date);
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
      const busy = taken.some((row) => {
        const [bookedHour, bookedMinute] = row.time.split(":").map(Number);
        const booked = bookedHour * 60 + bookedMinute;
        return begin < booked + row.minutes && booked < end;
      });
      if (!busy) slots.push(label);
    }
  }
  return slots;
}
