import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/auth/",
        "/api/",
        "/chess/",
        "/merch/checkout/",
      ],
    },
    sitemap: "https://shopchess.vercel.app/sitemap.xml",
    host: "https://shopchess.vercel.app",
  };
}
