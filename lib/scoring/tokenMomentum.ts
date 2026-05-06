import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import { clamp } from "@/lib/utils/numbers";

function priceChange(token: BirdeyeTokenListItem) {
  return token.price24hChangePercent ?? token.priceChange24hPercent ?? token.priceChange24h ?? 0;
}

function volumeChange(token: BirdeyeTokenListItem) {
  return token.volume24hChangePercent ?? token.volume_24h_change_percent ?? token.volumeChange24h ?? token.volume_4h_change_percent ?? 0;
}

function volumeUsd(token: BirdeyeTokenListItem) {
  return token.volume24hUSD ?? token.volume_24h_usd ?? token.volume_4h_usd ?? token.volume_1h_usd ?? 0;
}

export function computeMomentumScore(token: BirdeyeTokenListItem) {
  const price = priceChange(token);
  const volumeDelta = volumeChange(token);
  const priceAcceleration = clamp(Math.abs(price));
  const volumeAcceleration = clamp(Math.log10(Math.max(volumeUsd(token) || volumeDelta, 1)) * 18);
  const tradeCountGrowth = clamp((volumeDelta || 35) * 0.65);
  const buySellImbalance = clamp(55 + price * 0.2);
  const freshnessBonus = clamp(100 - (token.ageMinutes ?? 720) / 12);
  return clamp(
    priceAcceleration * 0.25 +
      volumeAcceleration * 0.25 +
      tradeCountGrowth * 0.2 +
      buySellImbalance * 0.2 +
      freshnessBonus * 0.1,
  );
}
