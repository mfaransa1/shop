"use client";

import { CHESS_TIME_CONTROL_PRESETS } from "@/lib/chess/time-controls";

export default function ChessTimeControlSelect({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-semibold ${className}`}>
      Game time
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-shop-border bg-white px-3 py-3 font-normal text-shop-ink outline-none focus:border-shop-ink"
      >
        <optgroup label="Bullet — fast games">
          {CHESS_TIME_CONTROL_PRESETS.filter((preset) => preset.timeControl === "bullet").map((preset) => <option key={preset.key} value={preset.key}>{preset.label}</option>)}
        </optgroup>
        <optgroup label="Blitz — short games">
          {CHESS_TIME_CONTROL_PRESETS.filter((preset) => preset.timeControl === "blitz").map((preset) => <option key={preset.key} value={preset.key}>{preset.label}</option>)}
        </optgroup>
        <optgroup label="Rapid — longer games">
          {CHESS_TIME_CONTROL_PRESETS.filter((preset) => preset.timeControl === "rapid").map((preset) => <option key={preset.key} value={preset.key}>{preset.label}</option>)}
        </optgroup>
      </select>
    </label>
  );
}
