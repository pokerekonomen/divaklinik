import { cn } from "@/lib/cn";

export function ClinicMap({ className, src }: { className?: string; src: string }) {
  return (
    <iframe
      title="Karta till Diva Tandklinik, Seminariegatan 10, Göteborg"
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={cn("h-80 w-full border-0", className)}
    />
  );
}
