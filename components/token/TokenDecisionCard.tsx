"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { shortAddress } from "@/lib/utils/addresses";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { RiskWarnings } from "./RiskWarnings";
import { FitExplanation } from "./FitExplanation";

export function TokenDecisionCard({
  token,
  personality,
  unlocked,
}: {
  token: RadarToken;
  personality?: WalletPersonalityResult;
  unlocked: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone={token.verdict === "Strong Fit" ? "success" : token.verdict === "Avoid" ? "danger" : "cyan"}>{token.verdict}</Badge>
            <CardTitle className="mt-3 text-3xl">{token.symbol}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{token.name} · Base · {shortAddress(token.address)}</p>
          </div>
          <div className="flex gap-2">
            {!unlocked ? (
              <Button asChild variant="outline">
                <Link href="/mint">Mint to unlock</Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="icon">
              <a href={`https://birdeye.so/token/${token.address}?chain=base`} target="_blank" rel="noreferrer" aria-label="Open Birdeye">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <ScoreBreakdown token={token} unlocked={unlocked} />
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold">Why it is ranked</h3>
          <div className="grid gap-2">
            {token.explanation.map((line) => (
              <p key={line} className="rounded-lg border border-border bg-background/45 p-3 text-sm leading-6 text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        </div>
        <RiskWarnings token={token} />
        <FitExplanation token={token} personality={personality} unlocked={unlocked} />
      </CardContent>
    </Card>
  );
}
