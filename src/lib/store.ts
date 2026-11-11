import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type BookingRecord = {
  id: string;
  serviceId: string;
  serviceName: string;
  practitionerId: string;
  date: string;
  time: string;
  minutes: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "held" | "confirmed" | "cancelled";
  createdAt: string;
  expiresAt?: string;
};

export type MessageRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
};

const dir = path.join(process.cwd(), "data");
const bookingFile = path.join(dir, "bookings.json");
const messageFile = path.join(dir, "messages.json");

async function readList<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeList<T>(file: string, rows: T[]) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(rows, null, 2));
}

function active(row: BookingRecord, now = Date.now()) {
  if (row.status === "cancelled") return false;
  if (row.status === "held" && row.expiresAt && new Date(row.expiresAt).getTime() < now) return false;
  return true;
}

function minutesOf(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function overlaps(start: number, length: number, otherStart: number, otherLength: number) {
  return start < otherStart + otherLength && otherStart < start + length;
}

export async function takenSlots(date: string) {
  const rows = await readList<BookingRecord>(bookingFile);
  return rows
    .filter((row) => row.date === date && active(row))
    .map((row) => ({ time: row.time, minutes: row.minutes, practitionerId: row.practitionerId }));
}

export async function holdSlot(input: Omit<BookingRecord, "id" | "status" | "createdAt" | "expiresAt" | "name" | "phone" | "email" | "message">) {
  const rows = await readList<BookingRecord>(bookingFile);
  const start = minutesOf(input.time);
  const clash = rows.some(
    (row) => row.date === input.date && active(row) && overlaps(start, input.minutes, minutesOf(row.time), row.minutes),
  );
  if (clash) return { ok: false as const, error: "Tiden hann bli bokad. Välj en annan tid." };
  const record: BookingRecord = {
    ...input,
    id: randomUUID(),
    name: "",
    phone: "",
    email: "",
    message: "",
    status: "held",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };
  rows.push(record);
  await writeList(bookingFile, rows);
  return { ok: true as const, id: record.id };
}

export async function confirmBooking(
  id: string,
  details: Pick<BookingRecord, "name" | "phone" | "email" | "message">,
) {
  const rows = await readList<BookingRecord>(bookingFile);
  const row = rows.find((item) => item.id === id);
  if (!row || !active(row) || row.status === "cancelled") {
    return { ok: false as const, error: "Reservationen har gått ut. Välj tiden igen." };
  }
  const start = minutesOf(row.time);
  const clash = rows.some(
    (item) =>
      item.id !== id &&
      item.date === row.date &&
      item.status === "confirmed" &&
      overlaps(start, row.minutes, minutesOf(item.time), item.minutes),
  );
  if (clash) return { ok: false as const, error: "Tiden är redan bokad." };
  row.name = details.name;
  row.phone = details.phone;
  row.email = details.email;
  row.message = details.message;
  row.status = "confirmed";
  row.expiresAt = undefined;
  await writeList(bookingFile, rows);
  return { ok: true as const, booking: row };
}

export async function releaseHold(id: string) {
  const rows = await readList<BookingRecord>(bookingFile);
  const next = rows.filter((row) => !(row.id === id && row.status === "held"));
  if (next.length !== rows.length) await writeList(bookingFile, next);
}

export async function listBookings() {
  const rows = await readList<BookingRecord>(bookingFile);
  return rows.sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1));
}

export async function updateBooking(id: string, status: BookingRecord["status"]) {
  const rows = await readList<BookingRecord>(bookingFile);
  const row = rows.find((item) => item.id === id);
  if (!row) return;
  row.status = status;
  await writeList(bookingFile, rows);
}

export async function saveMessage(input: Omit<MessageRecord, "id" | "createdAt">) {
  const rows = await readList<MessageRecord>(messageFile);
  rows.push({ ...input, id: randomUUID(), createdAt: new Date().toISOString() });
  await writeList(messageFile, rows);
}

export async function listMessages() {
  return readList<MessageRecord>(messageFile);
}
