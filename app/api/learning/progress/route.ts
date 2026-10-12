import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ACTIVITY_TYPES = new Set(["puzzle_solved", "lesson_completed", "game_completed"]);
const MAX_METADATA_BYTES = 3000;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Sign in to view saved progress." }, { status: 401 });

    const { data, error } = await supabase
      .from("learning_activity")
      .select("id, activity_type, activity_key, score, completed, metadata, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: "Learning progress is not available yet. Check the database migration." }, { status: 503 });
    return NextResponse.json({ activities: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Learning progress is not configured." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Sign in to save learning progress." }, { status: 401 });

    const body: unknown = await request.json();
    if (!isPlainObject(body)) return NextResponse.json({ error: "Invalid activity payload." }, { status: 400 });

    const activityType = body.activityType;
    const activityKey = body.activityKey;
    const score = body.score;
    const completed = body.completed;
    const metadata = body.metadata ?? {};

    if (typeof activityType !== "string" || !ACTIVITY_TYPES.has(activityType)) {
      return NextResponse.json({ error: "Unsupported activity type." }, { status: 400 });
    }
    if (typeof activityKey !== "string" || activityKey.length < 3 || activityKey.length > 120 || !/^[a-zA-Z0-9:_-]+$/.test(activityKey)) {
      return NextResponse.json({ error: "Invalid activity key." }, { status: 400 });
    }
    if (typeof score !== "number" || !Number.isInteger(score) || score < 0 || score > 10000) {
      return NextResponse.json({ error: "Score must be a whole number between 0 and 10000." }, { status: 400 });
    }
    if (typeof completed !== "boolean" || !isPlainObject(metadata)) {
      return NextResponse.json({ error: "Invalid activity details." }, { status: 400 });
    }
    if (JSON.stringify(metadata).length > MAX_METADATA_BYTES) {
      return NextResponse.json({ error: "Activity details are too large." }, { status: 413 });
    }

    // A stable allowlist prevents arbitrary activity names from entering the record.
    const allowedKeys: Record<string, RegExp> = {
      lesson_completed: /^lesson:(board-basics|piece-movement|check-and-mate|opening-principles|tactics-basics|endgame-basics)$/,
      puzzle_solved: /^daily-puzzle:\d{4}-\d{2}-\d{2}$/,
      game_completed: /^computer-[a-zA-Z0-9-]{8,100}$/,
    };
    if (!allowedKeys[activityType].test(activityKey)) {
      return NextResponse.json({ error: "Unknown learning activity." }, { status: 400 });
    }
    if (activityType === "lesson_completed" && (!completed || score !== 100)) {
      return NextResponse.json({ error: "Complete the lesson knowledge check before saving it." }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_shop_learning_activity", {
      p_activity_type: activityType,
      p_activity_key: activityKey,
      p_score: score,
      p_completed: completed,
      p_metadata: metadata,
    });

    if (error) return NextResponse.json({ error: "Could not save progress. Apply migration 202610090006_learning_integrity.sql and try again." }, { status: 503 });
    return NextResponse.json({ activity: data, saved: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Could not save progress. Please try again." }, { status: 400 });
  }
}
