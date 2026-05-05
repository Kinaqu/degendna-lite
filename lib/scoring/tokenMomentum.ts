import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import { clamp } from "@/lib/utils/numbers";

export function computeMomentumScore(token: BirdeyeTokenListItem) {
  const priceAcceleration = clamp(Math.abs(token.priceChange24hPercent ?? token.priceChange24h ?? 0));
  const volumeAcceleration = clamp(Math.log10(Math.max(token.volume24hUSD ?? token.volumeChange24h ?? 1, 1)) * 18);
  const tradeCountGrowth = clamp((token.volumeChange24h ?? 35) * 0.65);
  const buySellImbalance = clamp(55 + (token.priceChange24hPercent ?? token.priceChange24h ?? 0) * 0.2);
  const freshnessBonus = clamp(100 - (token.ageMinutes ?? 720) / 12);
  return clamp(
    priceAcceleration * 0.25 +
      volumeAcceleration * 0.25 +
      tradeCountGrowth * 0.2 +
      buySellImbalance * 0.2 +
      freshnessBonus * 0.1,
  );
}
