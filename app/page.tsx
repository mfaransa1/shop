import type { Metadata } from "next";
import ChessJourney from "@/components/home/ChessJourney";
import Events from "@/components/home/Events";
import Hero from "@/components/home/Hero";
import Impact from "@/components/home/Impact";
import Mission from "@/components/home/Mission";
import SchoolImpact from "@/components/home/SchoolImpact";
import Sessions from "@/components/home/Sessions";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CommunityStories from "@/components/home/CommunityStories";
import HomeCTA from "@/components/home/HomeCTA";
import HomeAnnouncement from "@/components/home/HomeAnnouncement";

export const metadata: Metadata = {
  title: "SHoP | Southside House of Pawns — Chess in Kawangware",
  description: "Southside House of Pawns brings people together through chess in Kawangware, Nairobi. Learn, play, compete and help grow a welcoming chess community.",
  alternates: { canonical: "/" },
  openGraph: { title: "SHoP — Southside House of Pawns", description: "One board. Infinite possibilities. Building a stronger community through chess in Kawangware, Nairobi.", url: "/", type: "website", images: [{ url: "/images/seo/shop-social-cover.webp", width: 1200, height: 630, alt: "Southside House of Pawns chess community" }] },
  twitter: { card: "summary_large_image", title: "SHoP — Southside House of Pawns", description: "Building a stronger community through chess in Kawangware, Nairobi.", images: ["/images/seo/shop-social-cover.webp"] },
};

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeAnnouncement />
      <main>
        <Hero />
        <Impact />
        <Mission />
        <ChessJourney />
        <Sessions />
        <SchoolImpact />
        <Events />
        <CommunityStories />
        <HomeCTA />
        <Footer />
      </main>
    </>
  );
}
