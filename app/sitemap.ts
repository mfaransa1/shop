import type { MetadataRoute } from "next";
import { tournaments } from "@/data/events";
import { getPublishedBlogPosts } from "@/lib/shop-blog";

const siteUrl = "https://shopchess.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicRoutes = [
    "/", "/about", "/learn", "/learn/basics", "/community",
    "/community/players", "/community/leaderboard", "/schools",
    "/tournaments", "/blog", "/merch", "/support", "/partners", "/join", "/contact",
  ];

  const staticEntries = publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
    priority: route === "/" ? 1 : route === "/join" || route === "/learn" ? 0.85 : 0.7,
  }));

  const eventEntries = tournaments.map((tournament) => ({
    url: `${siteUrl}/events/${tournament.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const blogEntries = (await getPublishedBlogPosts()).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : undefined,
    changeFrequency: "monthly" as const,
    priority: post.featured ? 0.75 : 0.6,
  }));

  return [...staticEntries, ...eventEntries, ...blogEntries];
}
