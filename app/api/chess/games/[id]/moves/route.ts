import { NextRequest, NextResponse } from "next/server";
import { Chess } from "chess.js";
import { getAuthenticatedSupabase, isRecord, errorMessage } from "@/lib/chess/server-game";

type Props = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Props) {
  const auth = await getAuthenticatedSupabase();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 }); }
  if (!isRecord(body) || typeof body.from !== "string" || typeof body.to !== "string" || (body.promotion !== undefined && body.promotion !== null && !["q", "r", "b", "n"].includes(String(body.promotion))) || typeof body.expectedPly !== "number" || !Number.isInteger(body.expectedPly) || body.expectedPly < 0) {
    return NextResponse.json({ error: "Provide valid from/to squares and the current move number." }, { status: 400 });
  }
  const { data: current, error: loadError } = await auth.supabase.from("chess_games")
    .select("id, white_player_id, black_player_id, status, fen, pgn, ply, side_to_move, white_time_ms, black_time_ms, clock_started_at, first_move_deadline_at")
    .eq("id", id).maybeSingle();
  if (loadError) return NextResponse.json({ error: "Could not load the current game." }, { status: 503 });
  if (!current) return NextResponse.json({ error: "Game not found or you are not a participant." }, { status: 404 });
  if (current.status !== "active") return NextResponse.json({ error: "This game is no longer active." }, { status: 409 });
  if (current.ply !== body.expectedPly) return NextResponse.json({ error: "The game changed. Refresh the board and try again.", code: "stale_position" }, { status: 409 });
  const expectedPlayer = current.side_to_move === "w" ? current.white_player_id : current.black_player_id;
  if (expectedPlayer !== auth.user.id) return NextResponse.json({ error: "It is not your turn." }, { status: 403 });

  let chess: Chess;
  try {
    chess = new Chess();
    if (current.pgn) chess.loadPgn(current.pgn);
    else chess.load(current.fen);
    // Prefer the persisted FEN as the canonical position; PGN supplies repetition history.
    if (chess.fen() !== current.fen) chess.load(current.fen);
    const move = chess.move({ from: body.from, to: body.to, ...(body.promotion ? { promotion: body.promotion as "q" | "r" | "b" | "n" } : {}) });
    if (!move) return NextResponse.json({ error: "That is not a legal chess move." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Could not validate the current chess position." }, { status: 409 });
  }

  let termination: string | null = null;
  let result: string | null = null;
  if (chess.isCheckmate()) { termination = "checkmate"; result = current.side_to_move === "w" ? "1-0" : "0-1"; }
  else if (chess.isStalemate()) { termination = "stalemate"; result = "1/2-1/2"; }
  else if (chess.isThreefoldRepetition()) { termination = "threefold_repetition"; result = "1/2-1/2"; }
  else if (chess.isDrawByFiftyMoves()) { termination = "fifty_move_rule"; result = "1/2-1/2"; }
  else if (chess.isInsufficientMaterial()) { termination = "insufficient_material"; result = "1/2-1/2"; }
  const { data, error } = await auth.supabase.rpc("shop_apply_chess_move", {
    p_game_id: id,
    p_expected_ply: body.expectedPly,
    p_player_id: auth.user.id,
    p_from_square: body.from,
    p_to_square: body.to,
    p_promotion: body.promotion ?? null,
    p_san: chess.history().at(-1) ?? "",
    p_fen_after: chess.fen(),
    p_pgn_after: chess.pgn(),
    p_next_side: chess.turn(),
    p_is_terminal: Boolean(termination),
    p_result: result,
    p_termination: termination,
  });
  if (error || !data) {
    const raw = error?.message ?? "";
    if (/first_move_deadline_expired/i.test(raw)) {
      return NextResponse.json({ error: "The first-move deadline passed. This game is being marked abandoned with no winner." }, { status: 409 });
    }
    if (/clock_expired/i.test(raw)) {
      return NextResponse.json({ error: "Your clock has expired. The game result is being recorded automatically." }, { status: 409 });
    }
    const mapped = errorMessage(error, "Move could not be saved. Refresh the board and try again.");
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
  const game = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ game, move: { from: body.from, to: body.to, promotion: body.promotion ?? null, san: chess.history().at(-1), fen: chess.fen() } });
}
