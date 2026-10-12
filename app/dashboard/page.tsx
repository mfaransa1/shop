import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LogoutButton from "@/components/auth/LogoutButton";
import ProfileEditor from "@/components/dashboard/ProfileEditor";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Player dashboard" };
export const dynamic = "force-dynamic";

type Rating = { time_control: "bullet" | "blitz" | "rapid"; rating: number; games_played: number; wins: number; draws: number; losses: number };

type Activity = {
  id: string;
  activity_type: string;
  activity_key: string;
  score: number;
  completed: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function activityLabel(activity: Activity) {
  if (activity.activity_type === "puzzle_solved") return "Daily chess puzzle";
  if (activity.activity_type === "lesson_completed") return String(activity.metadata?.title ?? "Beginner lesson");
  if (activity.activity_type === "game_completed") return `Game vs computer · ${String(activity.metadata?.result ?? "completed")}`;
  return "Learning activity";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");

  const activityWindowStart = new Date();
  activityWindowStart.setUTCDate(activityWindowStart.getUTCDate() - 89);
  activityWindowStart.setUTCHours(0, 0, 0, 0);

  const [profileResult, activityResult, puzzleCountResult, lessonCountResult, gameCountResult, bestScoreResult, ratingsResult] = await Promise.all([
    supabase.from("profiles").select("display_name, skill_level").eq("id", user.id).maybeSingle(),
    supabase.from("learning_activity").select("id, activity_type, activity_key, score, completed, metadata, created_at").eq("user_id", user.id).gte("created_at", activityWindowStart.toISOString()).order("created_at", { ascending: false }).limit(500),
    supabase.from("learning_activity").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("activity_type", "puzzle_solved").eq("completed", true),
    supabase.from("learning_activity").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("activity_type", "lesson_completed").eq("completed", true),
    supabase.from("learning_activity").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("activity_type", "game_completed").eq("completed", true),
    supabase.from("learning_activity").select("score").eq("user_id", user.id).eq("completed", true).order("score", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("chess_player_ratings").select("time_control, rating, games_played, wins, draws, losses").eq("player_id", user.id),
  ]);

  const profile = profileResult.data;
  const profileError = profileResult.error;
  const activityRows = activityResult.data;
  const activityError = activityResult.error || puzzleCountResult.error || lessonCountResult.error || gameCountResult.error || bestScoreResult.error;
  const activities = (activityRows ?? []) as Activity[];
  const puzzles = puzzleCountResult.count ?? 0;
  const lessons = lessonCountResult.count ?? 0;
  const games = gameCountResult.count ?? 0;
  const bestScore = bestScoreResult.data?.score ?? 0;
  const ratings = (ratingsResult.data ?? []) as Rating[];
  const ratingDataError = Boolean(ratingsResult.error);
  const ratingFor = (control: Rating["time_control"]) => ratings.find((rating) => rating.time_control === control);
  const completedActivities = activities.filter((activity) => activity.completed);
  const activityDateSet = new Set(completedActivities.map((activity) => activity.created_at.slice(0, 10)));
  const today = new Date();
  const utcDayKey = (date: Date) => date.toISOString().slice(0, 10);
  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (6 - index));
    const key = utcDayKey(date);
    const count = completedActivities.filter((activity) => activity.created_at.slice(0, 10) === key).length;
    return { key, label: date.toLocaleDateString("en-KE", { weekday: "short", timeZone: "UTC" }), count };
  });
  const activeDaysThisWeek = weeklyActivity.filter((day) => day.count > 0).length;
  let currentStreak = 0;
  const streakCursor = new Date();
  streakCursor.setUTCHours(0, 0, 0, 0);
  if (!activityDateSet.has(utcDayKey(streakCursor))) streakCursor.setUTCDate(streakCursor.getUTCDate() - 1);
  while (activityDateSet.has(utcDayKey(streakCursor)) && currentStreak < 90) {
    currentStreak += 1;
    streakCursor.setUTCDate(streakCursor.getUTCDate() - 1);
  }
  const totalCompleted = puzzles + lessons + games;
  const weeklyMax = Math.max(1, ...weeklyActivity.map((day) => day.count));
  const name = profile?.display_name || String(user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Player");
  const dataNotReady = Boolean(profileError || activityError);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-shop-cream pt-20 text-shop-ink">
        <section className="border-b border-shop-border bg-[#111111] text-[#F3EDE2]">
          <div className="shop-container py-16 md:py-24">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="shop-eyebrow text-[#F3EDE2]/45">Player area · SHoP</p>
                <h1 className="shop-display mt-5 text-6xl leading-[0.9] sm:text-7xl">Your next move,<br />{name}.</h1>
                <p className="mt-6 max-w-xl text-sm leading-7 text-[#F3EDE2]/55">Your learning, practice, and saved progress in one place. Kila hatua ina maana.</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </section>

        <section className="shop-container py-12 md:py-16">
          {dataNotReady && <div role="status" className="mb-8 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Your account is signed in, but the learning tables could not be loaded. Apply the player-learning SQL migration and refresh this page.</div>}

          <section className="mb-10" aria-labelledby="chess-ratings-heading">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="shop-eyebrow text-shop-muted">Your chess ratings</p><h2 id="chess-ratings-heading" className="shop-display mt-2 text-3xl sm:text-4xl">Earned at the board.</h2></div>
              <p className="max-w-lg text-xs leading-5 text-shop-muted">Ratings update after rated, completed player-vs-player games. New players start at 1200 in each time control.</p>
            </div>
            {ratingDataError ? <div role="status" className="mb-5 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Chess ratings could not be loaded. Check that migration 202610100002_chess_ratings.sql is applied, then refresh this dashboard.</div> : null}
            <div className="grid gap-3 sm:grid-cols-3">
              {(["bullet", "blitz", "rapid"] as const).map((control) => {
                const rating = ratingFor(control);
                return <article key={control} className="relative overflow-hidden border border-shop-border bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-shop-muted">{control} rating</p><span className="text-shop-muted" aria-hidden="true">♟</span></div><p className="shop-display mt-4 text-5xl leading-none">{rating?.rating ?? 1200}</p><div className="mt-4 flex items-center justify-between gap-2 text-xs text-shop-muted"><span>{rating?.games_played ?? 0} rated {rating?.games_played === 1 ? "game" : "games"}</span><span>{rating ? `${rating.wins}W · ${rating.draws}D · ${rating.losses}L` : "Provisional"}</span></div></article>;
              })}
            </div>
          </section>

          <nav aria-label="Player dashboard menu" className="mb-10 border border-shop-border bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="shop-eyebrow text-shop-muted">Player menu</p><h2 className="shop-display mt-3 text-3xl sm:text-4xl">Everything in one place.</h2></div>
              <p className="max-w-md text-xs leading-5 text-shop-muted">Jump to your training, community, achievements, and club activity.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { href: "/dashboard/play-computer", title: "Play vs computer", detail: "Start a game against the computer", tag: "PLAY NOW" },
                { href: "/community/players", title: "Play vs someone", detail: "Find online players and challenge someone", tag: "PLAYERS" },
                { href: "/learn/basics", title: "Learning path", detail: "Build your chess foundations", tag: "LEARN" },
                { href: "/dashboard/challenges", title: "Friend challenges", detail: "Send and manage invitations", tag: "PLAYERS" },
                { href: "/dashboard/history", title: "Game & activity history", detail: "Review your saved records", tag: "PROGRESS" },
                { href: "/dashboard/achievements", title: "Achievements", detail: "See your milestones", tag: "MILESTONES" },
                { href: "/dashboard/community-settings", title: "Community settings", detail: "Manage profile visibility and bio", tag: "PRIVACY" },
                { href: "/community/leaderboard", title: "Player leaderboard", detail: "Discover opted-in SHoP players", tag: "COMMUNITY" },
                { href: "/events", title: "Tournaments & events", detail: "Explore upcoming club events", tag: "CLUB" },
                { href: "/community", title: "Community", detail: "Visit the SHoP community", tag: "CONNECT" },
              ].map((item) => <Link key={item.href} href={item.href} className="group flex min-h-28 flex-col justify-between border border-shop-border p-4 transition-colors hover:border-shop-ink hover:bg-shop-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shop-ink">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted">{item.tag}</span>
                <span className="mt-4 flex items-start justify-between gap-3"><span><strong className="block text-sm">{item.title}</strong><span className="mt-1 block text-xs leading-5 text-shop-muted">{item.detail}</span></span><span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">→</span></span>
              </Link>)}
            </div>
          </nav>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Puzzles solved", value: puzzles, note: "Saved daily puzzle completions" },
              { label: "Lessons completed", value: lessons, note: "Beginner path progress" },
              { label: "Games completed", value: games, note: "Games against the computer" },
              { label: "Best activity score", value: bestScore, note: "Highest saved score" },
            ].map((stat) => <article key={stat.label} className="border border-shop-border bg-white p-6"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted">{stat.label}</p><p className="shop-display mt-5 text-5xl leading-none">{stat.value}</p><p className="mt-4 text-xs leading-5 text-shop-muted">{stat.note}</p></article>)}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="border border-shop-border bg-white p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted">Completed activities</p><p className="shop-display mt-4 text-4xl">{totalCompleted}</p><p className="mt-2 text-xs text-shop-muted">Saved across puzzles, lessons, and games</p></article>
            <article className="border border-shop-border bg-white p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted">Current streak</p><p className="shop-display mt-4 text-4xl">{currentStreak} <span className="text-base">{currentStreak === 1 ? "day" : "days"}</span></p><p className="mt-2 text-xs text-shop-muted">Based on saved completed activity</p></article>
            <article className="border border-shop-border bg-white p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted">Active days this week</p><p className="shop-display mt-4 text-4xl">{activeDaysThisWeek}<span className="text-base"> / 7</span></p><p className="mt-2 text-xs text-shop-muted">Days with at least one completion</p></article>
          </div>

          <section className="mt-12 border border-shop-border bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="shop-eyebrow text-shop-muted">Last seven days</p><h2 className="shop-display mt-3 text-4xl">Your practice rhythm.</h2></div><p className="text-xs text-shop-muted">Completed activities by day · UTC dates</p></div>
            <div className="mt-8 grid grid-cols-7 gap-2 sm:gap-4" aria-label="Completed learning activities in the last seven days">
              {weeklyActivity.map((day) => <div key={day.key} className="flex min-w-0 flex-col items-center gap-3"><div className="flex h-32 w-full max-w-12 items-end overflow-hidden bg-shop-cream"><div className="w-full bg-shop-ink transition-all" style={{ height: `${day.count === 0 ? 0 : Math.max(8, (day.count / weeklyMax) * 100)}%` }} title={`${day.count} completed activities`} /></div><span className="text-[10px] text-shop-muted">{day.label}</span><span className="font-mono text-xs">{day.count}</span></div>)}
            </div>
            {activities.length === 0 && <p className="mt-5 text-xs text-shop-muted">Complete a lesson, daily puzzle, or game while signed in to begin building this chart.</p>}
          </section>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="border border-shop-border bg-white p-6 sm:p-8">
              <p className="shop-eyebrow text-shop-muted">Continue learning</p>
              <h2 className="shop-display mt-4 text-4xl">Make today count.</h2>
              <div className="mt-7 divide-y divide-shop-border border-y border-shop-border">
                <Link href="/learn/basics" className="flex items-center justify-between gap-5 py-5 transition-transform hover:translate-x-1"><span><strong className="block text-sm">Beginner learning path</strong><span className="mt-1 block text-xs text-shop-muted">Board, pieces, check, and opening principles</span></span><span aria-hidden="true">→</span></Link>
                <Link href="/learn#daily-puzzle" className="flex items-center justify-between gap-5 py-5 transition-transform hover:translate-x-1"><span><strong className="block text-sm">Daily puzzle</strong><span className="mt-1 block text-xs text-shop-muted">Find the checkmate in one move</span></span><span aria-hidden="true">→</span></Link>
                <Link href="/learn#play-computer" className="flex items-center justify-between gap-5 py-5 transition-transform hover:translate-x-1"><span><strong className="block text-sm">Play the computer</strong><span className="mt-1 block text-xs text-shop-muted">Play a complete legal chess game</span></span><span aria-hidden="true">→</span></Link>
              </div>
            </section>

            <section className="border border-shop-border bg-white p-6 sm:p-8">
              <p className="shop-eyebrow text-shop-muted">Your profile</p>
              <h2 className="shop-display mt-4 text-4xl">Player details.</h2>
              <p className="mt-4 break-all text-xs text-shop-muted">{user.email}</p>
              <div className="mt-7"><ProfileEditor initialName={name} initialLevel={profile?.skill_level ?? "Beginner"} /></div>
            </section>
          </div>

          <section className="mt-12">
            <div className="flex flex-col gap-4 border-b border-shop-border pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="shop-eyebrow text-shop-muted">Saved records</p><h2 className="shop-display mt-3 text-4xl">Recent activity.</h2></div><span className="text-xs text-shop-muted">Activity from the last 90 days · {activities.length} records loaded</span></div>
            {activities.length === 0 ? <div className="border-b border-shop-border py-10"><p className="text-sm text-shop-muted">Your activity will appear here after you complete a puzzle, lesson, or game while signed in.</p></div> : <div className="divide-y divide-shop-border">{activities.slice(0, 10).map((activity) => <article key={activity.id} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"><div><p className="text-sm font-semibold">{activityLabel(activity)}</p><p className="mt-1 text-xs text-shop-muted">{new Date(activity.created_at).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</p></div><span className="text-xs text-shop-muted">{activity.completed ? "Completed" : "In progress"}</span><span className="font-mono text-sm">{activity.score} pts</span></article>)}</div>}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
