import { Lock, Sparkles } from "lucide-react";
import { buildFitExplanation } from "@/lib/scoring/explanations";
import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export function FitExplanation({
  token,
  personality,
  unlocked,
}: {
  token: RadarToken;
  personality?: WalletPersonalityResult;
  unlocked: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/45 p-4">
      <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
        {unlocked ? <Sparkles className="h-5 w-5 text-secondary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
        Wallet fit
      </h3>
      <p className="text-sm leading-6 text-muted-foreground">{buildFitExplanation(token, unlocked ? personality : undefined)}</p>
    </div>
  );
}
