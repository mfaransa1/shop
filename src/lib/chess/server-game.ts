import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedSupabase() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { response: NextResponse.json({ error: "Sign in to access chess games." }, { status: 401 }) } as const;
  return { supabase, user } as const;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function errorMessage(error: { message?: string; code?: string } | null, fallback: string) {
  const message = error?.message ?? "";
  if (/not_authorized|42501/i.test(message) || error?.code === "42501") return { message: "You are not allowed to perform this action.", status: 403 };
  if (/game_not_found|P0002/i.test(message) || error?.code === "P0002") return { message: "Game not found.", status: 404 };
  if (/stale_position|40001/i.test(message) || error?.code === "40001") return { message: "The game changed. Refresh the board and try again.", status: 409 };
  if (/not_your_turn/i.test(message)) return { message: "It is not your turn.", status: 409 };
  if (/clock_expired/i.test(message)) return { message: "Your clock has expired.", status: 409 };
  if (/game_not_active/i.test(message)) return { message: "This game is no longer active.", status: 409 };
  return { message: fallback, status: 400 };
}
