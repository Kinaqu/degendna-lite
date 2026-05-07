import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { generateDegenDnaSvg } from "@/lib/nft/svg";

export function NFTPreview({ personality }: { personality: WalletPersonalityResult }) {
  const svg = generateDegenDnaSvg(personality);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background/50 p-2">
      <div
        className="aspect-square overflow-hidden rounded-md"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
