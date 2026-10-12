import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Achievements | SHoP" };
export const dynamic = "force-dynamic";

type Achievement = {
  achievement_key: string;
  title: string;
  description: string;
  category: string;
  current_value: number;
  target_value: number;
  unlocked: boolean;
};

const categoryOrder = ["Learning", "Tactics", "Play", "Consistency", "Milestones"];

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard/achievements");

  const { data, error } = await supabase.rpc("get_my_shop_achievements");
  const achievements = (data ?? []) as Achievement[];
  const unlockedCount = achievements.filter((item) => item.unlocked).length;
  const grouped = categoryOrder.map((category) => ({
    category,
    items: achievements.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-shop-cream pt-20 text-shop-ink">
        <section className="bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-14 md:py-20">
            <p className="shop-eyebrow text-[#F3EDE2]/55">Player dashboard · Milestones</p>
            <h1 className="shop-display mt-4 text-5xl sm:text-7xl">Earned, not given.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F3EDE2]/70">
              Achievements are unlocked by completed learning records. Keep practising, study patterns, and build your chess habits one step at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="border border-white/20 px-5 py-4"><p className="shop-eyebrow text-white/50">Unlocked</p><p className="mt-2 text-3xl font-semibold">{unlockedCount}<span className="text-base text-white/45"> / {achievements.length}</span></p></div>
              <div className="border border-white/20 px-5 py-4"><p className="shop-eyebrow text-white/50">Still to earn</p><p className="mt-2 text-3xl font-semibold">{Math.max(0, achievements.length - unlockedCount)}</p></div>
            </div>
          </div>
        </section>
        <section className="shop-container py-10 md:py-14">
          {error ? (
            <div role="status" className="border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
              Achievements are not available yet. Apply migration <code>202610090008_achievements.sql</code> after the player-learning migration, then refresh this page.
            </div>
          ) : achievements.length === 0 ? (
            <div className="border border-shop-border bg-white p-8">
              <h2 className="shop-display text-3xl">Your first milestone is waiting.</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-shop-muted">Complete a lesson, solve a puzzle, or finish a game. Your achievements will appear here from your saved activity.</p>
              <Link href="/learn" className="mt-6 inline-block border border-shop-border px-5 py-3 text-sm font-semibold">Start learning →</Link>
            </div>
          ) : (
            <>
              {grouped.map((group) => (
                <section key={group.category} className="mb-10">
                  <p className="shop-eyebrow text-shop-muted">{group.category}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => {
                      const progress = Math.min(100, Math.round((Number(item.current_value) / Math.max(1, Number(item.target_value))) * 100));
                      return (
                        <article key={item.achievement_key} className={`border p-5 ${item.unlocked ? "border-shop-ink bg-white" : "border-shop-border bg-white/60"}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div><p className="shop-eyebrow text-shop-muted">{item.unlocked ? "Achievement unlocked" : "In progress"}</p><h2 className="shop-display mt-2 text-2xl">{item.title}</h2></div>
                            <span aria-label={item.unlocked ? "Unlocked" : "Locked"} className={`flex h-10 w-10 shrink-0 items-center justify-center border text-lg ${item.unlocked ? "border-shop-ink bg-shop-ink text-shop-cream" : "border-shop-border text-shop-muted"}`}>{item.unlocked ? "✓" : "♟"}</span>
                          </div>
                          <p className="mt-3 min-h-12 text-sm leading-6 text-shop-muted">{item.description}</p>
                          <div className="mt-5 flex items-center justify-between text-xs text-shop-muted"><span>Progress</span><span className="font-semibold text-shop-ink">{Math.min(Number(item.current_value), Number(item.target_value))} / {item.target_value}</span></div>
                          <div className="mt-2 h-2 overflow-hidden bg-shop-cream"><div className="h-full bg-shop-ink transition-all" style={{ width: `${progress}%` }} /></div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
              <div className="flex flex-wrap gap-3 border-t border-shop-border pt-6">
                <Link href="/dashboard" className="border border-shop-border px-5 py-3 text-sm font-semibold hover:bg-white">Back to dashboard</Link>
                <Link href="/learn" className="bg-shop-ink px-5 py-3 text-sm font-semibold text-shop-cream hover:bg-shop-ink/90">Continue learning →</Link>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
