"use server";

import { saveMessage } from "@/lib/store";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(5).max(1000),
});

export async function sendMessage(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false as const, error: "Kontrollera att alla fält är ifyllda." };
  await saveMessage(parsed.data);
  return { ok: true as const };
}
