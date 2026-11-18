import type { MetadataRoute } from "next";

const siteUrl = "https://shopchess.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "/", "/about", "/learn", "/learn/basics", "/community",
    "/community/players", "/community/leaderboard", "/schools",
    "/tournaments", "/merch", "/support", "/join", "/contact",
  ];

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/join" || route === "/learn" ? 0.85 : 0.7,
  }));
}
