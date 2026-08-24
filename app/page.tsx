import ChessJourney from "@/components/home/ChessJourney";
import Events from "@/components/home/Events";
import Hero from "@/components/home/Hero";
import HomeCTA from "@/components/home/HomeCTA";
import Impact from "@/components/home/Impact";
import Mission from "@/components/home/Mission";
import SchoolImpact from "@/components/home/SchoolImpact";
import Sessions from "@/components/home/Sessions";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Impact />
        <Mission />
        <ChessJourney />
        <Sessions />
        <SchoolImpact />
        <Events />
        <HomeCTA />
        <Footer />
      </main>
    </>
  );
}