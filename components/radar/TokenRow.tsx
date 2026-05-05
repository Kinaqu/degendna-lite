"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LockedFitScore } from "./LockedFitScore";
import { ScoreBadge } from "./ScoreBadge";
import type { RadarToken } from "@/lib/scoring/personalityTypes";
import { formatCompact, formatPercent } from "@/lib/utils/numbers";

export function TokenRow({
  token,
  unlocked,
  onSelect,
  onAdd,
}: {
  token: RadarToken;
  unlocked: boolean;
  onSelect: (token: RadarToken) => void;
  onAdd?: (token: RadarToken) => void;
}) {
  return (
    <tr className="border-b border-border/70 align-middle last:border-b-0 hover:bg-muted/30">
      <td className="px-4 py-4">
        <button onClick={() => onSelect(token)} className="text-left">
          <p className="font-semibold text-foreground">{token.symbol}</p>
          <p className="text-xs text-muted-foreground">{token.name}</p>
        </button>
      </td>
      <td className="px-4 py-4 font-mono text-sm text-muted-foreground">{token.ageMinutes ? `${token.ageMinutes}m` : "-"}</td>
      <td className="px-4 py-4 font-mono text-sm text-secondary">{formatPercent(token.priceChange24h)}</td>
      <td className="px-4 py-4 font-mono text-sm text-muted-foreground">{formatPercent(token.volumeChange24h)}</td>
      <td className="px-4 py-4"><ScoreBadge score={token.momentumScore} /></td>
      <td className="px-4 py-4"><ScoreBadge score={token.riskScore} inverse /></td>
      <td className="px-4 py-4"><ScoreBadge score={token.liquidityScore} /></td>
      <td className="px-4 py-4">{unlocked && token.fitScore !== undefined ? <ScoreBadge score={token.fitScore} /> : <LockedFitScore />}</td>
      <td className="px-4 py-4"><Badge tone={token.verdict === "Strong Fit" ? "success" : token.verdict === "Avoid" ? "danger" : token.verdict === "Risky" ? "warning" : "cyan"}>{token.verdict}</Badge></td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onSelect(token)} aria-label={`Inspect ${token.symbol}`}>
            <Search className="h-4 w-4" />
          </Button>
          {unlocked && onAdd ? (
            <Button variant="ghost" size="icon" onClick={() => onAdd(token)} aria-label={`Add ${token.symbol}`}>
              <Plus className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{formatCompact(token.liquidity)}</p>
      </td>
    </tr>
  );
}
