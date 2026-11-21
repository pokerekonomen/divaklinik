export type MuntraBookingDraft = {
  query: {
    phone_number_cell: string;
    e_mail_address: string;
    first_name: string;
    last_name: string;
  };
  body: {
    data: {
      attributes: {
        class: "PUBLIC";
        summary: string;
        text: string;
        dtstart: string;
        dtend: string;
        reschedulable: true;
        duration_in_minutes: number;
        description: string;
        location: string;
        transparent: false;
        status: "CONFIRMED";
        price?: number;
        booked_by_patient: true;
        new_patient: boolean;
        patient_declaration_allowed: false;
        referral_source: "divatandklinik.se";
      };
    };
  };
};

const personnummer = /\b(?:19|20)?\d{6}[-+]?\d{4}\b/;

export function swedishMobile(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  const digits = compact.startsWith("+") ? `+${compact.slice(1).replace(/\D/g, "")}` : compact.replace(/\D/g, "");
  let national = "";
  if (digits.startsWith("+46")) national = digits.slice(3).replace(/^0/, "");
  else if (digits.startsWith("0046")) national = digits.slice(4).replace(/^0/, "");
  else if (digits.startsWith("0")) national = digits.slice(1);
  else national = digits;
  if (!/^7\d{8}$/.test(national)) return null;
  return `+46${national}`;
}

export function stockholmDateTime(date: string, time: string, extraMinutes = 0) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + extraMinutes;
  const shifted = new Date(Date.UTC(year, month - 1, day + Math.floor(total / 1440)));
  const minutes = ((total % 1440) + 1440) % 1440;
  const wall = `${shifted.toISOString().slice(0, 10)}T${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:00`;
  const zone = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Stockholm",
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date(`${wall}Z`))
    .find((part) => part.type === "timeZoneName")?.value ?? "GMT+1";
  const match = zone.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  const sign = match?.[1] ?? "+";
  const hours = String(match?.[2] ?? "1").padStart(2, "0");
  const mins = String(match?.[3] ?? "0").padStart(2, "0");
  return `${wall}${sign}${hours}:${mins}`;
}

export function priceAmount(label: string) {
  const match = label.match(/(\d[\d\s]*)\s*kr/);
  if (!match) return undefined;
  const amount = Number(match[1].replace(/\s/g, ""));
  return Number.isFinite(amount) ? amount : undefined;
}

export function muntraBookingDraft(input: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  time: string;
  minutes: number;
  summary: string;
  location: string;
  newPatient: boolean;
  price?: number;
}) {
  const phone = swedishMobile(input.phone);
  if (!phone) return { ok: false as const, error: "Ange ett svenskt mobilnummer, till exempel 070 123 45 67." };
  const text = `${input.firstName}\n${input.lastName}\n${phone}\n${input.email}\n${input.message}`;
  if (personnummer.test(text)) {
    return { ok: false as const, error: "Lämna inte personnummer. Det hör hemma i journalsystemet, inte i webbokningen." };
  }
  const description = input.message.trim() || "Bokad via divatandklinik.se. Inga medicinska uppgifter lämnade.";
  const draft: MuntraBookingDraft = {
    query: {
      phone_number_cell: phone,
      e_mail_address: input.email.trim(),
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
    },
    body: {
      data: {
        attributes: {
          class: "PUBLIC",
          summary: input.summary,
          text: description,
          dtstart: stockholmDateTime(input.date, input.time),
          dtend: stockholmDateTime(input.date, input.time, input.minutes),
          reschedulable: true,
          duration_in_minutes: input.minutes,
          description,
          location: input.location,
          transparent: false,
          status: "CONFIRMED",
          ...(input.price === undefined ? {} : { price: input.price }),
          booked_by_patient: true,
          new_patient: input.newPatient,
          patient_declaration_allowed: false,
          referral_source: "divatandklinik.se",
        },
      },
    },
  };
  return { ok: true as const, phone, draft };
}
