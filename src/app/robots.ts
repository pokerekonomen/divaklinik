import type { MetadataRoute } from "next";
import { clinic } from "@/lib/clinic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
    sitemap: `${clinic.url}/sitemap.xml`,
    host: clinic.url,
  };
}
