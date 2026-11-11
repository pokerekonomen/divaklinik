import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diva Tandklinik",
    short_name: "Diva",
    description: "Privat tandläkare i Annedal, Göteborg.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6fafc",
    theme_color: "#005f6c",
    lang: "sv",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
