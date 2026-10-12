
import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedSupabase,
  isRecord,
} from "@/lib/chess/server-game";

const presets = {
  bullet: [[60_000, 0], [120_000, 1_000]],
  blitz: [
    [180_000, 0],
    [180_000, 2_000],
    [300_000, 0],
    [300_000, 3_000],
  ],
  rapid: [
    [600_000, 0],
    [600_000, 5_000],
    [900_000, 10_000],
  ],
} as const;

export async function GET() {
  try {
    const auth = await getAuthenticatedSupabase();

    if ("response" in auth) return auth.response;

    const { data, error } = await auth.supabase
      .from("chess_games")
      .select(
        "id, challenge_id, white_player_id, black_player_id, status, time_control, initial_time_ms, increment_ms, fen, pgn, ply, side_to_move, white_time_ms, black_time_ms, clock_started_at, result, termination, created_at, started_at, finished_at"
      )
      .or(
        `white_player_id.eq.${auth.user.id},black_player_id.eq.${auth.user.id}`
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[SHoP chess list]", {
        message: error.message,
        code: error.code,
      });

      return NextResponse.json(
        { error: "Could not load your games. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json({ games: data ?? [] });
  } catch (error) {
    console.error("[SHoP chess list unexpected error]", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while loading your games." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedSupabase();

    if ("response" in auth) return auth.response;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    if (
      !isRecord(body) ||
      typeof body.challengeId !== "string" ||
      !(
        body.timeControl === "bullet" ||
        body.timeControl === "blitz" ||
        body.timeControl === "rapid"
      ) ||
      typeof body.initialTimeMs !== "number" ||
      typeof body.incrementMs !== "number"
    ) {
      return NextResponse.json(
        { error: "Provide a challenge ID and a supported time control." },
        { status: 400 }
      );
    }

    const options = presets[body.timeControl];

    if (
      !options.some(
        ([initial, increment]) =>
          initial === body.initialTimeMs &&
          increment === body.incrementMs
      )
    ) {
      return NextResponse.json(
        { error: "Unsupported time preset." },
        { status: 400 }
      );
    }

    const { data, error } = await auth.supabase.rpc(
      "shop_start_chess_game",
      {
        p_challenge_id: body.challengeId,
        p_time_control: body.timeControl,
        p_initial_time_ms: body.initialTimeMs,
        p_increment_ms: body.incrementMs,
      }
    );

    if (error) {
      console.error("[SHoP chess start RPC]", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          error: "Could not start the game. Please try again.",
          ...(process.env.NODE_ENV === "development"
            ? {
                diagnostic: {
                  message: error.message,
                  code: error.code,
                  details: error.details,
                  hint: error.hint,
                },
              }
            : {}),
        },
        { status: 500 }
      );
    }

    const game = Array.isArray(data) ? data[0] : data;

    if (!isRecord(game) || typeof game.id !== "string") {
      console.error("[SHoP chess start RPC] No valid game returned.", {
        challengeId: body.challengeId,
        data,
      });

      return NextResponse.json(
        {
          error: "The server did not return a valid game. Please try again.",
        },
        { status: 500 }
      );
    }

    // Required success response: prevents Next.js receiving undefined.
    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error("[SHoP chess start unexpected error]", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while starting the game." },
      { status: 500 }
    );
  }
}
