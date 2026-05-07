"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { shortAddress } from "@/lib/utils/addresses";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { RiskWarnings } from "./RiskWarnings";
import { FitExplanation } from "./FitExplanation";

export function TokenPreviewDialog({
  token,
  personality,
  unlocked,
  onClose,
}: {
  token: RadarToken | null;
  personality?: WalletPersonalityResult;
  unlocked: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={Boolean(token)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-4 bottom-4 z-50 max-h-[88vh] overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-[0_24px_90px_rgba(0,0,0,0.42)] focus:outline-none sm:left-1/2 sm:right-auto sm:top-1/2 sm:bottom-auto sm:w-[min(760px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2">
          {token ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge tone={token.verdict === "Strong Fit" ? "success" : token.verdict === "Avoid" ? "danger" : "cyan"}>
                    {token.verdict}
                  </Badge>
                  <Dialog.Title className="mt-3 font-display text-3xl font-bold">
                    {token.symbol}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    {token.name} · Base · {shortAddress(token.address)}
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" aria-label="Close token preview">
                    <X className="h-4 w-4" />
                  </Button>
                </Dialog.Close>
              </div>

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

              <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
                <Button asChild variant="outline" className="sm:flex-1">
                  <Link href={`/token/${token.address}`}>Open token page</Link>
                </Button>
                <Button asChild variant="outline" className="sm:flex-1">
                  <a href={`https://birdeye.so/token/${token.address}?chain=base`} target="_blank" rel="noreferrer">
                    Open Birdeye <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
