import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export function ShareToXButton({
  personality,
  topToken,
}: {
  personality: WalletPersonalityResult;
  topToken?: RadarToken;
}) {
  const text = `I found my DegenDNA.\nWallet type: ${personality.personalityLabel}\nRisk: ${personality.riskAppetite}\nTop fit: ${topToken?.symbol || "Locked"}\nYour wallet has a personality. Your radar should too.`;
  return (
    <Button asChild variant="outline">
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
        <Send className="h-4 w-4" /> Share to X
      </a>
    </Button>
  );
}
