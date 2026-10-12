import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in to view challenges." }, { status: 401 });
  const { data, error } = await supabase
    .from("friend_challenges")
    .select("id, challenger_id, challenged_id, status, message, created_at, responded_at")
    .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: "Challenges are unavailable. Check the database migration." }, { status: 503 });

  const otherIds = [...new Set((data ?? []).map((item) => item.challenger_id === user.id ? item.challenged_id : item.challenger_id))];
  const names = new Map<string, string>();
  if (otherIds.length) {
    const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", otherIds);
    for (const profile of profiles ?? []) names.set(profile.id, profile.display_name);
  }
  return NextResponse.json({ challenges: (data ?? []).map((item) => ({
    ...item,
    direction: item.challenger_id === user.id ? "sent" : "received",
    other_player_name: names.get(item.challenger_id === user.id ? item.challenged_id : item.challenger_id) ?? "SHoP player",
  })) });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in to challenge a player." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!isObject(body)) return NextResponse.json({ error: "Choose a player to challenge." }, { status: 400 });
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 240) : "";
  let target: { id: string; display_name: string } | null = null;

  // Profile links use a stable player UUID, so duplicate display names are not a problem.
  if (typeof body.playerId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.playerId)) {
    // Use a SECURITY DEFINER RPC because profile-row RLS may correctly prevent
    // direct reads of another player's private profile row.
    const { data, error } = await supabase.rpc("get_shop_public_challenge_target", {
      player_uuid: body.playerId,
      player_display_name: null,
    });
    if (error) return NextResponse.json({ error: "Player lookup is unavailable. Apply migration 202610090012_challenge_target_lookup.sql." }, { status: 503 });
    const row = Array.isArray(data) ? data[0] : null;
    target = row ? { id: row.player_id, display_name: row.display_name } : null;
    if (!target) return NextResponse.json({ error: "This player is not currently available for public challenges." }, { status: 404 });
  } else if (typeof body.displayName === "string") {
    const displayName = body.displayName.trim().replace(/\s+/g, " ");
    if (displayName.length < 2 || displayName.length > 60) return NextResponse.json({ error: "Display name must be 2–60 characters." }, { status: 400 });
    const { data: matches, error: lookupError } = await supabase.rpc("get_shop_public_challenge_target", {
      player_uuid: null,
      player_display_name: displayName,
    });
    if (lookupError) return NextResponse.json({ error: "Player lookup is unavailable. Apply migration 202610090012_challenge_target_lookup.sql." }, { status: 503 });
    if (!matches?.length) return NextResponse.json({ error: "No public player found with that exact display name. Try the online players directory." }, { status: 404 });
    if (matches.length > 1) return NextResponse.json({ error: "That display name is not unique. Open the player's profile from the online directory instead." }, { status: 409 });
    target = { id: matches[0].player_id, display_name: matches[0].display_name };
  } else return NextResponse.json({ error: "Choose a player from the online directory." }, { status: 400 });

  if (!target) return NextResponse.json({ error: "Player could not be found." }, { status: 404 });
  if (target.id === user.id) return NextResponse.json({ error: "You cannot challenge yourself." }, { status: 400 });

  const { data: existing } = await supabase.from("friend_challenges").select("id")
    .eq("challenger_id", user.id).eq("challenged_id", target.id).eq("status", "pending").limit(1);
  if (existing?.length) return NextResponse.json({ error: "You already have a pending invitation to this player." }, { status: 409 });

  const { data, error } = await supabase.from("friend_challenges").insert({
    challenger_id: user.id, challenged_id: target.id, message, status: "pending",
  }).select("id, status, created_at").single();
  if (error) return NextResponse.json({ error: "Could not send invitation. Please try again." }, { status: 400 });
  return NextResponse.json({ challenge: data, message: "Challenge invitation sent." }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in to respond." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!isObject(body) || typeof body.id !== "string" || !["accepted", "declined"].includes(String(body.status))) {
    return NextResponse.json({ error: "Choose accept or decline for a valid invitation." }, { status: 400 });
  }
  const status = body.status as "accepted" | "declined";
  const { data, error } = await supabase.from("friend_challenges").update({ status, responded_at: new Date().toISOString() })
    .eq("id", body.id).eq("challenged_id", user.id).eq("status", "pending")
    .select("id, status, responded_at").maybeSingle();
  if (error) return NextResponse.json({ error: "Could not update invitation." }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Invitation not found or already answered." }, { status: 404 });
  return NextResponse.json({ challenge: data, message: status === "accepted" ? "Invitation accepted." : "Invitation declined." });
}
