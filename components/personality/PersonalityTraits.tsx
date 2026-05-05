import { Badge } from "@/components/ui/badge";
import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export function PersonalityTraits({ personality }: { personality: WalletPersonalityResult }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone="warning">Risk: {personality.riskAppetite}</Badge>
      <Badge tone="cyan">Style: {personality.holdingStyle}</Badge>
      <Badge tone="default">Exit: {personality.exitDiscipline}</Badge>
      <Badge tone="muted">{personality.tokenPreference}</Badge>
    </div>
  );
}
