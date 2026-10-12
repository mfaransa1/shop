import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComputerChess from "@/components/learn/ComputerChess";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Play vs Computer | SHoP" };
export const dynamic = "force-dynamic";

export default async function PlayComputerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=%2Fdashboard%2Fplay-computer");

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-shop-paper">
        <div className="shop-container py-8 sm:py-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-shop-muted hover:text-shop-ink">← Back to dashboard</Link>
          <header className="mb-8 mt-8">
            <p className="shop-eyebrow text-[#007F79]">Practice arena</p>
            <h1 className="shop-display mt-3 text-5xl leading-none sm:text-6xl">Play vs computer.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-shop-muted">Play a complete game against the SHoP computer opponent. Your moves are checked for legality, and completed games can be saved to your player dashboard.</p>
          </header>
          <ComputerChess />
        </div>
      </main>
      <Footer />
    </>
  );
}
