import ChessJourney from "@/components/home/ChessJourney";
import Hero from "@/components/home/Hero";
import Impact from "@/components/home/Impact";
import Mission from "@/components/home/Mission";
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
      </main>
    </>
  );
}