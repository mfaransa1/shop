import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/dm-serif-display/400.css";
import "./globals.css";
import WhatsAppFloatingButton from "@/components/layout/WhatsAppFloatingButton";
import OnlinePresence from "@/components/community/OnlinePresence";
import GlobalChallengeNotifications from "@/components/community/GlobalChallengeNotifications";

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
  metadataBase: new URL("https://shopchess.vercel.app"),
  openGraph: {
    title: "SHoP — Southside House of Pawns",
    description:
      "One board. Infinite possibilities. Building a stronger community through chess.",
    type: "website",
    siteName: "SHoP",
    images: [{ url: "/images/seo/shop-social-cover.webp", width: 1200, height: 630, alt: "Young people playing chess in the SHoP community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHoP — Southside House of Pawns",
    description: "Building a stronger community through chess in Kawangware, Nairobi.",
    images: ["/images/seo/shop-social-cover.webp"],
  },
  icons: {
    icon: "/images/brand/favicon.svg",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://shopchess.vercel.app/#organization",
      name: "Southside House of Pawns",
      alternateName: "SHoP",
      url: "https://shopchess.vercel.app/",
      logo: {
        "@type": "ImageObject",
        url: "https://shopchess.vercel.app/images/brand/logo-mark.svg",
      },
      email: "shopchesske@gmail.com",
      description: "A chess community in Kawangware, Nairobi, Kenya, using chess to bring people together and create learning and playing opportunities.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kawangware",
        addressRegion: "Nairobi County",
        addressCountry: "KE",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://shopchess.vercel.app/#website",
      url: "https://shopchess.vercel.app/",
      name: "SHoP — Southside House of Pawns",
      publisher: { "@id": "https://shopchess.vercel.app/#organization" },
      inLanguage: "en-KE",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <OnlinePresence />
        <GlobalChallengeNotifications />
        <WhatsAppFloatingButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}