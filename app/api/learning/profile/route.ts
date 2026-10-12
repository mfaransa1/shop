import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LEVELS = new Set(["Beginner", "Developing", "Competitive"]);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });

    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) return NextResponse.json({ error: "Invalid profile details." }, { status: 400 });
    const values = body as Record<string, unknown>;
    const displayName = typeof values.displayName === "string" ? values.displayName.trim() : "";
    const skillLevel = values.skillLevel;

    if (displayName.length < 2 || displayName.length > 60) return NextResponse.json({ error: "Your name must be between 2 and 60 characters." }, { status: 400 });
    if (typeof skillLevel !== "string" || !LEVELS.has(skillLevel)) return NextResponse.json({ error: "Choose a valid learning level." }, { status: 400 });

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName, skill_level: skillLevel, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select("id, display_name, skill_level")
      .single();

    if (error) return NextResponse.json({ error: "Could not save your profile. Confirm the player learning migration has been applied." }, { status: 503 });
    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: "Could not save your profile. Please try again." }, { status: 400 });
  }
}
