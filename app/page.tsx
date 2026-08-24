import Hero from "@/components/home/Hero";
import Impact from "@/components/home/Impact";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Impact />
      </main>
    </>
  );
}