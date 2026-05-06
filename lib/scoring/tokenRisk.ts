import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import { clamp } from "@/lib/utils/numbers";

function priceChange(token: BirdeyeTokenListItem) {
  return token.price24hChangePercent ?? token.priceChange24hPercent ?? token.priceChange24h ?? 0;
}

function volumeChange(token: BirdeyeTokenListItem) {
  return token.volume24hChangePercent ?? token.volume_24h_change_percent ?? token.volumeChange24h ?? token.volume_4h_change_percent ?? 0;
}

function marketCap(token: BirdeyeTokenListItem) {
  return token.market_cap ?? token.marketcap ?? token.marketCap ?? token.mc ?? token.fdv ?? 0;
}

export function computeRiskScore(token: BirdeyeTokenListItem) {
  const liquidity = token.liquidity ?? 0;
  const securityRisk = clamp(35 + (token.ageMinutes !== undefined && token.ageMinutes < 60 ? 20 : 0));
  const holderConcentration = clamp(45 + marketCap(token) / Math.max(liquidity * 20, 1));
  const lowLiquidityRisk = clamp(100 - Math.log10(Math.max(liquidity, 10)) * 17);
  const whaleDominance = clamp(35 + priceChange(token) * 0.08);
  const abnormalTradePattern = clamp(volumeChange(token) * 0.35);
  return clamp(
    securityRisk * 0.3 +
      holderConcentration * 0.25 +
      lowLiquidityRisk * 0.25 +
      whaleDominance * 0.1 +
      abnormalTradePattern * 0.1,
  );
}
