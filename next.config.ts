import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/tandlakare-goteborg",
        destination: "/",
        permanent: true,
      },
      {
        source: "/boka-tandlakartid-online",
        destination: "/boka",
        permanent: true,
      },
      {
        source: "/integritetspolicy",
        destination: "/privacy-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
