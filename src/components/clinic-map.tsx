import { clinic } from "@/lib/clinic";
import { cn } from "@/lib/cn";

export function ClinicMap({ className }: { className?: string }) {
  return (
    <iframe
      title="Karta till Diva Tandklinik, Seminariegatan 10, Göteborg"
      src={clinic.mapEmbed}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={cn("h-80 w-full border-0", className)}
    />
  );
}
