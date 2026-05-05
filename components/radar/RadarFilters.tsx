"use client";

import type { RadarMode } from "@/hooks/useRadar";

const filters: { value: RadarMode; label: string }[] = [
  { value: "new", label: "New" },
  { value: "trending", label: "Trending" },
  { value: "meme", label: "Meme" },
  { value: "low-risk", label: "Low Risk" },
  { value: "momentum", label: "High Momentum" },
  { value: "best-fit", label: "Best Fit" },
];

export function RadarFilters({
  mode,
  onModeChange,
  locked,
}: {
  mode: RadarMode;
  onModeChange: (mode: RadarMode) => void;
  locked?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const disabled = locked && filter.value === "best-fit";
        return (
          <button
            key={filter.value}
            disabled={disabled}
            onClick={() => onModeChange(filter.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              mode === filter.value
                ? "border-secondary/60 bg-secondary/15 text-cyan-100"
                : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
            } disabled:cursor-not-allowed disabled:opacity-45`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
