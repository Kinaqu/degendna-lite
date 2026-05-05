import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalityTraits } from "./PersonalityTraits";
import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export function PersonalityCard({ personality }: { personality: WalletPersonalityResult }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <CardHeader>
        <p className="font-mono text-xs uppercase text-secondary">Detected wallet personality</p>
        <CardTitle className="text-3xl">{personality.personalityLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-5 max-w-2xl text-sm leading-6 text-muted-foreground">{personality.description}</p>
        <div className="mb-5 flex items-end gap-3">
          <span className="font-display text-6xl font-bold text-secondary">{Math.round(personality.degenScore)}</span>
          <span className="pb-2 font-mono text-sm text-muted-foreground">/100 degen score</span>
        </div>
        <PersonalityTraits personality={personality} />
      </CardContent>
    </Card>
  );
}
