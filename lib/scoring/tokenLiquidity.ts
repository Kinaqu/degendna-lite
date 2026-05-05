import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import { clamp } from "@/lib/utils/numbers";

export function computeLiquidityScore(token: BirdeyeTokenListItem) {
  const liquidityDepth = clamp(Math.log10(Math.max(token.liquidity ?? 1, 1)) * 17);
  const volumeLiquidityRatio = clamp(((token.volume24hUSD ?? 0) / Math.max(token.liquidity ?? 1, 1)) * 35);
  const pairActivity = clamp((token.volumeChange24h ?? 20) * 0.7);
  const tradeDistribution = clamp(55 - Math.abs(volumeLiquidityRatio - 45) * 0.4);
  return clamp(liquidityDepth * 0.45 + volumeLiquidityRatio * 0.2 + pairActivity * 0.2 + tradeDistribution * 0.15);
}
