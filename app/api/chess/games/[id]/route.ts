import { NextResponse } from "next/server";
import { getAuthenticatedSupabase } from "@/lib/chess/server-game";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const auth = await getAuthenticatedSupabase();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const { error: joinError } = await auth.supabase.rpc("shop_join_chess_game", { p_game_id: id });
  if (joinError) {
    const message = joinError.message || "Could not join this chess game.";
    const status = /not_authorized|permission/i.test(message) ? 403 : /game_not_found/i.test(message) ? 404 : 503;
    return NextResponse.json({ error: message }, { status });
  }

  // Every participant poll asks the database to adjudicate deadlines/clocks.
  // The database remains authoritative; no browser-only timeout can award a result.
  const { error: clockError } = await auth.supabase.rpc("shop_check_chess_game_clock", { p_game_id: id });
  if (clockError) {
    console.error("[SHoP chess clock check]", { code: clockError.code, message: clockError.message });
    return NextResponse.json({ error: "Could not verify the game clock. Please refresh." }, { status: 503 });
  }

  const { data: game, error } = await auth.supabase.from("chess_games")
    .select("id, challenge_id, white_player_id, black_player_id, status, time_control, initial_time_ms, increment_ms, fen, pgn, ply, side_to_move, white_time_ms, black_time_ms, clock_started_at, result, termination, finished_at, white_ready, black_ready, started_at, first_move_deadline_at")
    .eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load this game." }, { status: 503 });
  if (!game) return NextResponse.json({ error: "Game not found or you are not a participant." }, { status: 404 });
  const { data: moves, error: movesError } = await auth.supabase.from("chess_game_moves")
    .select("id, game_id, ply, player_id, from_square, to_square, promotion, san, fen_after, created_at")
    .eq("game_id", id).order("ply", { ascending: true });
  if (movesError) return NextResponse.json({ error: "Could not load move history." }, { status: 503 });
  return NextResponse.json({ game, moves: moves ?? [] });
}
