import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/dm-serif-display/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SHoP — Southside House of Pawns",
    template: "%s — SHoP",
  },
  description:
    "Southside House of Pawns is a chess community in Kawangware using chess to bring young people together, develop talent and create positive opportunities.",
  keywords: [
    "SHoP",
    "Southside House of Pawns",
    "Kawangware chess",
    "Kenya chess",
    "youth chess",
    "chess community",
  ],
  authors: [{ name: "Southside House of Pawns" }],
  creator: "Southside House of Pawns",
  metadataBase: new URL("https://shop.example.com"),
  openGraph: {
    title: "SHoP — Southside House of Pawns",
    description:
      "One board. Infinite possibilities. Building a stronger community through chess.",
    type: "website",
    siteName: "SHoP",
  },
  icons: {
    icon: "/images/brand/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}