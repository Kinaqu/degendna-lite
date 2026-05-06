import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import { clamp } from "@/lib/utils/numbers";

function volumeChange(token: BirdeyeTokenListItem) {
  return token.volume24hChangePercent ?? token.volume_24h_change_percent ?? token.volumeChange24h ?? token.volume_4h_change_percent ?? 20;
}

function volumeUsd(token: BirdeyeTokenListItem) {
  return token.volume24hUSD ?? token.volume_24h_usd ?? token.volume_4h_usd ?? token.volume_1h_usd ?? 0;
}

export function computeLiquidityScore(token: BirdeyeTokenListItem) {
  const liquidityDepth = clamp(Math.log10(Math.max(token.liquidity ?? 1, 1)) * 17);
  const volumeLiquidityRatio = clamp((volumeUsd(token) / Math.max(token.liquidity ?? 1, 1)) * 35);
  const pairActivity = clamp(volumeChange(token) * 0.7);
  const tradeDistribution = clamp(55 - Math.abs(volumeLiquidityRatio - 45) * 0.4);
  return clamp(liquidityDepth * 0.45 + volumeLiquidityRatio * 0.2 + pairActivity * 0.2 + tradeDistribution * 0.15);
}
