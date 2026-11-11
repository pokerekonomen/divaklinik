import type { Metadata } from "next";
import { HomeView } from "@/components/home-view";

export const metadata: Metadata = {
  title: { absolute: "Tandläkare Göteborg | Privat tandklinik i Annedal | Diva" },
  description:
    "Privat tandläkare i Göteborg. Undersökning, akut tandvård, tandimplantat, tandreglering och tandblekning hos Diva Tandklinik i Annedal.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
