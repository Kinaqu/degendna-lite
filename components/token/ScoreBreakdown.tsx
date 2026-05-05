import { ScoreBadge } from "@/components/radar/ScoreBadge";
import type { RadarToken } from "@/lib/scoring/personalityTypes";

export function ScoreBreakdown({ token, unlocked }: { token: RadarToken; unlocked: boolean }) {
  const rows = [
    ["Momentum", token.momentumScore, false],
    ["Risk", token.riskScore, true],
    ["Liquidity", token.liquidityScore, false],
    ["Fit For You", token.fitScore ?? 0, false],
  ] as const;
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {rows.map(([label, score, inverse]) => (
        <div key={label} className="rounded-lg border border-border bg-background/45 p-3">
          <p className="mb-2 text-xs uppercase text-muted-foreground">{label}</p>
          {label === "Fit For You" && !unlocked ? (
            <span className="text-sm text-muted-foreground">Locked</span>
          ) : (
            <ScoreBadge score={score} inverse={inverse} />
          )}
        </div>
      ))}
    </div>
  );
}
