export const clinic = {
  name: "Diva Tandklinik",
  legalName: "Diva Tandklinik AB",
  phoneDisplay: "073-942 80 84",
  phoneTel: "+46739428084",
  email: "info@divatandklinik.se",
  street: "Seminariegatan 10",
  postal: "413 13",
  city: "Göteborg",
  area: "Annedal",
  since: 2016,
  minAge: 20,
  reviews: 125,
  reviewLabel: "Utmärkt på Google",
  maps: "https://www.google.com/maps/search/?api=1&query=Diva+Tandklinik+Seminariegatan+10+Göteborg",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Diva+Tandklinik,+Seminariegatan+10,+413+13+Göteborg",
  mapEmbed:
    "https://maps.google.com/maps?q=Diva+Tandklinik,+Seminariegatan+10,+413+13+Göteborg&hl=sv&z=16&output=embed",
  hours: [
    { days: "Måndag–fredag", time: "10:00–17:00" },
    { days: "Lördag–söndag", time: "11:00–17:00" },
  ],
  dentist: "Shahram Hamraz",
  url: "https://divatandklinik.se",
} as const;

export function isOpenHour(day: number, hour: number) {
  const weekend = day === 0 || day === 6;
  const start = weekend ? 11 : 10;
  return hour >= start && hour < 17;
}
