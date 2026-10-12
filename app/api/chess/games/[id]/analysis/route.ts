import { NextResponse } from "next/server";
import { getAuthenticatedSupabase } from "@/lib/chess/server-game";

type Props = { params: Promise<{ id: string }> };
const MAX_JSON_CHARS = 1_500_000;

export async function GET(_request: Request, { params }: Props) {
  const auth = await getAuthenticatedSupabase();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const { data: game, error: gameError } = await auth.supabase
    .from("chess_games").select("id, white_player_id, black_player_id")
    .eq("id", id).maybeSingle();
  if (gameError) return NextResponse.json({ error: "Could not verify game access." }, { status: 503 });
  if (!game || ![game.white_player_id, game.black_player_id].includes(auth.user.id)) {
    return NextResponse.json({ error: "Game not found or access denied." }, { status: 404 });
  }

  const { data, error } = await auth.supabase.from("chess_game_analyses")
    .select("game_id, analyzed_by, engine_version, depth, positions, move_quality, summary, analyzed_at, updated_at")
    .eq("game_id", id).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load saved analysis. Apply the Phase 4.8 migration." }, { status: 503 });
  return NextResponse.json({ analysis: data ?? null });
}

export async function PUT(request: Request, { params }: Props) {
  const auth = await getAuthenticatedSupabase();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const { data: game, error: gameError } = await auth.supabase
    .from("chess_games").select("id, white_player_id, black_player_id")
    .eq("id", id).maybeSingle();
  if (gameError) return NextResponse.json({ error: "Could not verify game access." }, { status: 503 });
  if (!game || ![game.white_player_id, game.black_player_id].includes(auth.user.id)) {
    return NextResponse.json({ error: "Game not found or access denied." }, { status: 404 });
  }

  let raw: string;
  try { raw = await request.text(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (raw.length > MAX_JSON_CHARS) return NextResponse.json({ error: "Analysis is too large to save." }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = JSON.parse(raw) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const depth = Number(body.depth);
  const positions = body.positions;
  const moveQuality = body.move_quality;
  const summary = body.summary;
  if (!Number.isInteger(depth) || depth < 1 || depth > 30 || !Array.isArray(positions) || positions.length > 1000 || !Array.isArray(moveQuality) || moveQuality.length > 1000 || !summary || typeof summary !== "object" || Array.isArray(summary)) {
    return NextResponse.json({ error: "Analysis payload is invalid." }, { status: 400 });
  }
  if (positions.some((item) => !item || typeof item !== "object") || moveQuality.some((item) => !item || typeof item !== "object")) {
    return NextResponse.json({ error: "Analysis rows are invalid." }, { status: 400 });
  }

  const payload = {
    game_id: id,
    analyzed_by: auth.user.id,
    engine_version: typeof body.engine_version === "string" ? body.engine_version.slice(0, 80) : "stockfish-browser",
    depth,
    positions,
    move_quality: moveQuality,
    summary,
    analyzed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await auth.supabase.from("chess_game_analyses")
    .upsert(payload, { onConflict: "game_id" })
    .select("game_id, analyzed_by, engine_version, depth, positions, move_quality, summary, analyzed_at, updated_at")
    .single();
  if (error) return NextResponse.json({ error: "Could not save analysis. Confirm the Phase 4.8 migration is applied." }, { status: 503 });
  return NextResponse.json({ analysis: data });
}
