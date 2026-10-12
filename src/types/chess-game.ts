export type ChessGameStatus = "active" | "completed" | "aborted";
export type ChessTimeControl = "bullet" | "blitz" | "rapid" | "custom";
export type ChessGameResult = "1-0" | "0-1" | "1/2-1/2" | "*";
export type ChessTermination =
  | "checkmate"
  | "stalemate"
  | "draw_agreement"
  | "threefold_repetition"
  | "fifty_move_rule"
  | "insufficient_material"
  | "timeout"
  | "resignation"
  | "aborted"
  | "other";

export type ChessGameRecord = {
  id: string;
  challenge_id: string | null;
  white_player_id: string;
  black_player_id: string;
  status: ChessGameStatus;
  time_control: ChessTimeControl;
  initial_time_ms: number;
  increment_ms: number;
  fen: string;
  pgn: string;
  ply: number;
  side_to_move: "w" | "b";
  white_time_ms: number;
  black_time_ms: number;
  clock_started_at: string;
  result: ChessGameResult | null;
  termination: ChessTermination | null;
  created_at: string;
  started_at: string;
  finished_at: string | null;
};

export type ChessGameMoveRecord = {
  id: number;
  game_id: string;
  ply: number;
  player_id: string;
  from_square: string;
  to_square: string;
  promotion: "q" | "r" | "b" | "n" | null;
  san: string;
  fen_after: string;
  created_at: string;
};

export const CHESS_TIME_CONTROLS = {
  bullet: [
    { label: "1+0 Bullet", initialTimeMs: 60_000, incrementMs: 0 },
    { label: "2+1 Bullet", initialTimeMs: 120_000, incrementMs: 1_000 },
  ],
  blitz: [
    { label: "3+0 Blitz", initialTimeMs: 180_000, incrementMs: 0 },
    { label: "3+2 Blitz", initialTimeMs: 180_000, incrementMs: 2_000 },
    { label: "5+0 Blitz", initialTimeMs: 300_000, incrementMs: 0 },
    { label: "5+3 Blitz", initialTimeMs: 300_000, incrementMs: 3_000 },
  ],
  rapid: [
    { label: "10+0 Rapid", initialTimeMs: 600_000, incrementMs: 0 },
    { label: "10+5 Rapid", initialTimeMs: 600_000, incrementMs: 5_000 },
    { label: "15+10 Rapid", initialTimeMs: 900_000, incrementMs: 10_000 },
  ],
} as const;
