import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join SHoP | Become Part of the Chess Community",
  description: "Apply to join Southside House of Pawns in Kawangware, Nairobi. Share your chess experience and interests through the SHoP membership application.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: "Join Southside House of Pawns",
    description: "Find your place at the board. Apply to join SHoP.",
    url: "/join",
    type: "website",
    images: [{ url: "/images/seo/shop-social-cover.webp", width: 1200, height: 630, alt: "Join the SHoP chess community" }],
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
