import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in to see online players." }, { status: 401 });
  const { data, error } = await supabase.rpc("get_shop_online_players");
  if (error) return NextResponse.json({ error: "Online players are unavailable. Apply migration 202610090011_online_players.sql." }, { status: 503 });
  return NextResponse.json({ players: data ?? [], checkedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in to update your online status." }, { status: 401 });
  const { error } = await supabase.rpc("shop_touch_player_presence");
  if (error) return NextResponse.json({ error: "Could not update online status. Apply migration 202610090011_online_players.sql." }, { status: 503 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
