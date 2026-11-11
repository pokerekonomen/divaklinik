import type { MetadataRoute } from "next";
import { publicDocs } from "@/lib/content";
import { clinic } from "@/lib/clinic";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/behandlingar", "/blogg", "/kontakt", "/boka", "/priser-tandlakare-goteborg"];
  const reserved = new Set(["behandlingar", "blogg", "kontakt", "priser-tandlakare-goteborg"]);
  const pages = publicDocs().filter((doc) => !reserved.has(doc.slug));
  return [
    ...staticPaths.map((path) => ({
      url: `${clinic.url}${path || "/"}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...pages.map((doc) => ({
      url: `${clinic.url}/${doc.slug}`,
      lastModified: doc.modified,
      changeFrequency: "monthly" as const,
      priority: doc.kind === "treatment" ? 0.8 : 0.5,
    })),
  ];
}
