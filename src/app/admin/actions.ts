"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateBooking, type BookingRecord } from "@/lib/store";

function expectedToken() {
  const secret = process.env.ADMIN_SECRET || "diva-local-secret";
  return createHmac("sha256", secret).update("diva-admin").digest("hex");
}

export async function isAdmin() {
  const jar = await cookies();
  const value = jar.get("diva_admin")?.value ?? "";
  const expected = expectedToken();
  if (value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD || "diva-demo";
  if (password !== expected) redirect("/admin?fel=1");
  const jar = await cookies();
  jar.set("diva_admin", expectedToken(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete("diva_admin");
  redirect("/admin");
}

export async function setStatus(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as BookingRecord["status"];
  if (id && (status === "confirmed" || status === "cancelled")) await updateBooking(id, status);
  redirect("/admin");
}
