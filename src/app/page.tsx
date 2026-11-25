import type { Metadata } from "next";
import { HomeView } from "@/components/home-view";

export const metadata: Metadata = {
  title: { absolute: "Tandläkare Göteborg | Privat tandklinik i Annedal | Diva" },
    description:
    "Tandläkare i Göteborg och privat tandklinik i Annedal. Akut tandvård, undersökning, implantat, tandreglering och tandblekning. Öppet alla dagar.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
