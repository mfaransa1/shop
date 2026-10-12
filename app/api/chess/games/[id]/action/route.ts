import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedSupabase, isRecord, errorMessage } from "@/lib/chess/server-game";

type Props = { params: Promise<{ id: string }> };
const actions = ["resign", "offer_draw", "accept_draw"] as const;

export async function POST(request: NextRequest, { params }: Props) {
  const auth = await getAuthenticatedSupabase();
  if ("response" in auth) return auth.response;
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 }); }
  if (!isRecord(body) || typeof body.action !== "string" || !actions.includes(body.action as typeof actions[number])) {
    return NextResponse.json({ error: "Choose resign, offer_draw or accept_draw." }, { status: 400 });
  }
  const { data, error } = await auth.supabase.rpc("shop_chess_game_action", { p_game_id: id, p_action: body.action });
  if (error || !data) {
    const mapped = errorMessage(error, "Could not complete that game action.");
    const status = /clock_not_expired|no_opponent_draw_offer|draw_already_offered/i.test(error?.message ?? "") ? 409 : mapped.status;
    const message = /no_opponent_draw_offer/i.test(error?.message ?? "") ? "There is no draw offer from your opponent." : /draw_already_offered/i.test(error?.message ?? "") ? "You already offered a draw." : mapped.message;
    return NextResponse.json({ error: message }, { status });
  }
  return NextResponse.json({ game: Array.isArray(data) ? data[0] : data });
}
