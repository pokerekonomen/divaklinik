"use server";

import { services } from "@/lib/booking-data";
import { confirmBooking, holdSlot, releaseHold } from "@/lib/store";
import { z } from "zod";

const hits = new Map<string, { count: number; reset: number }>();

function limited(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || row.reset < now) {
    hits.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  row.count += 1;
  return row.count > 12;
}

const holdSchema = z.object({
  serviceId: z.string(),
  practitionerId: z.enum(["forsta", "shahram"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

const confirmSchema = z.object({
  id: z.string().min(8),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(120),
  message: z.string().trim().max(400).optional().default(""),
  consent: z.literal("on"),
  age: z.literal("on"),
});

export async function reserveTime(input: z.infer<typeof holdSchema>, ip = "local") {
  if (limited(ip)) return { ok: false as const, error: "För många försök. Vänta en stund eller ring kliniken." };
  const parsed = holdSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Kontrollera valet och försök igen." };
  const service = services.find((item) => item.id === parsed.data.serviceId);
  if (!service) return { ok: false as const, error: "Välj en behandling." };
  return holdSlot({
    serviceId: service.id,
    serviceName: service.name,
    practitionerId: "shahram",
    date: parsed.data.date,
    time: parsed.data.time,
    minutes: service.minutes,
  });
}

export async function cancelHold(id: string) {
  if (id) await releaseHold(id);
}

export async function completeBooking(formData: FormData) {
  const first = String(formData.get("first") ?? "").trim();
  const last = String(formData.get("last") ?? "").trim();
  const combined = [first, last].filter(Boolean).join(" ");
  const note = formData.get("calm") === "on" ? "Önskar extra försiktighet på grund av tandvårdsrädsla." : "";
  const message = [note, String(formData.get("message") ?? "").trim()].filter(Boolean).join(" ");
  const parsed = confirmSchema.safeParse({
    id: formData.get("id"),
    name: combined || formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message,
    consent: formData.get("consent"),
    age: formData.get("age"),
  });
  if (!parsed.success) {
    return { ok: false as const, error: "Fyll i förnamn, efternamn, mobil och e-post, och godkänn villkoren. Du behöver vara minst 20 år." };
  }
  return confirmBooking(parsed.data.id, {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    message: parsed.data.message,
  });
}
