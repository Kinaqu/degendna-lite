"use client";

import { useMemo, useState } from "react";
import type { RadarMode } from "@/hooks/useRadar";
import type { RadarToken } from "@/lib/scoring/personalityTypes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadarFilters } from "./RadarFilters";
import { RadarEmptyState } from "./RadarEmptyState";
import { TokenRow } from "./TokenRow";

function filterTokens(tokens: RadarToken[], mode: RadarMode, unlocked: boolean) {
  const sorted = [...tokens];
  if (mode === "low-risk") return sorted.sort((a, b) => a.riskScore - b.riskScore);
  if (mode === "momentum") return sorted.sort((a, b) => b.momentumScore - a.momentumScore);
  if (mode === "best-fit" && unlocked) return sorted.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));
  if (mode === "new") return sorted.sort((a, b) => (a.ageMinutes ?? 99999) - (b.ageMinutes ?? 99999));
  return sorted;
}

export function RadarTable({
  tokens,
  unlocked,
  onSelect,
}: {
  tokens: RadarToken[];
  unlocked: boolean;
  onSelect: (token: RadarToken) => void;
}) {
  const [mode, setMode] = useState<RadarMode>("trending");
  const visibleTokens = useMemo(() => filterTokens(tokens, mode, unlocked).slice(0, unlocked ? 12 : 5), [mode, tokens, unlocked]);
  if (!tokens.length) return <RadarEmptyState />;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <Badge tone="cyan">Live Birdeye radar</Badge>
          <h2 className="font-display text-2xl font-bold">Meme Radar</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            These tokens are ranked from live Birdeye market data and your wallet
            personality. Use the filters to sort by new listings, momentum, lower
            risk, or personal fit.
          </p>
        </div>
        <RadarFilters mode={mode} onModeChange={setMode} locked={!unlocked} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left">
          <thead className="border-b border-border bg-background/45 text-xs uppercase text-muted-foreground">
            <tr>
              {["Token", "Age", "Price %", "Volume %", "Momentum", "Risk", "Liquidity", "Fit For You", "Verdict", "Inspect"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleTokens.map((token) => (
              <TokenRow key={token.address} token={token} unlocked={unlocked} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
