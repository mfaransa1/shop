export type ChessTimeControlPreset = {
  key: string;
  label: string;
  timeControl: "bullet" | "blitz" | "rapid";
  initialTimeMs: number;
  incrementMs: number;
};

export const CHESS_TIME_CONTROL_PRESETS: ChessTimeControlPreset[] = [
  { key: "bullet-1-0", label: "1+0 Bullet", timeControl: "bullet", initialTimeMs: 60_000, incrementMs: 0 },
  { key: "bullet-2-1", label: "2+1 Bullet", timeControl: "bullet", initialTimeMs: 120_000, incrementMs: 1_000 },
  { key: "blitz-3-0", label: "3+0 Blitz", timeControl: "blitz", initialTimeMs: 180_000, incrementMs: 0 },
  { key: "blitz-3-2", label: "3+2 Blitz", timeControl: "blitz", initialTimeMs: 180_000, incrementMs: 2_000 },
  { key: "blitz-5-0", label: "5+0 Blitz", timeControl: "blitz", initialTimeMs: 300_000, incrementMs: 0 },
  { key: "blitz-5-3", label: "5+3 Blitz", timeControl: "blitz", initialTimeMs: 300_000, incrementMs: 3_000 },
  { key: "rapid-10-0", label: "10+0 Rapid", timeControl: "rapid", initialTimeMs: 600_000, incrementMs: 0 },
  { key: "rapid-10-5", label: "10+5 Rapid", timeControl: "rapid", initialTimeMs: 600_000, incrementMs: 5_000 },
  { key: "rapid-15-10", label: "15+10 Rapid", timeControl: "rapid", initialTimeMs: 900_000, incrementMs: 10_000 },
];

export function getTimeControlPreset(key: unknown): ChessTimeControlPreset {
  if (typeof key === "string") {
    const found = CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === key);
    if (found) return found;
    // Backward-compatible links created by earlier SHoP builds.
    if (key === "blitz") return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === "blitz-3-0")!;
    if (key === "bullet") return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === "bullet-1-0")!;
    if (key === "rapid") return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === "rapid-10-0")!;
    if (key === "blitz-5") return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === "blitz-5-0")!;
    if (key === "rapid-10-5") return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === "rapid-10-5")!;
    if (key === "rapid-15-10") return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === "rapid-15-10")!;
  }
  return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.key === "blitz-3-0")!;
}

export function timeControlKeyFromValues(timeControl: string, initialTimeMs: number, incrementMs: number) {
  return CHESS_TIME_CONTROL_PRESETS.find((preset) => preset.timeControl === timeControl && preset.initialTimeMs === initialTimeMs && preset.incrementMs === incrementMs)?.key ?? "blitz-3-0";
}
