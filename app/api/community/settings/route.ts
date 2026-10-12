import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in to manage community privacy." }, { status: 401 });
  const { data, error } = await supabase.from("profiles").select("public_profile, show_on_leaderboard, bio").eq("id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "Community settings are unavailable. Apply the community migration first." }, { status: 503 });
  return NextResponse.json({ settings: data ?? { public_profile: false, show_on_leaderboard: false, bio: "" } });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in to manage community privacy." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!isRecord(body) || typeof body.publicProfile !== "boolean" || typeof body.showOnLeaderboard !== "boolean" || typeof body.bio !== "string") {
    return NextResponse.json({ error: "Invalid community settings." }, { status: 400 });
  }
  const bio = body.bio.trim();
  if (bio.length > 240) return NextResponse.json({ error: "Bio must be 240 characters or fewer." }, { status: 400 });
  const { data, error } = await supabase.from("profiles").update({ public_profile: body.publicProfile, show_on_leaderboard: body.showOnLeaderboard, bio, updated_at: new Date().toISOString() }).eq("id", user.id).select("public_profile, show_on_leaderboard, bio").single();
  if (error) return NextResponse.json({ error: "Could not save settings. Confirm the community migration is applied." }, { status: 503 });
  return NextResponse.json({ settings: data });
}
