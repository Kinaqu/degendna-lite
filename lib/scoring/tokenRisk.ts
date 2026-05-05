import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import { clamp } from "@/lib/utils/numbers";

export function computeRiskScore(token: BirdeyeTokenListItem) {
  const liquidity = token.liquidity ?? 0;
  const securityRisk = clamp(35 + (token.ageMinutes !== undefined && token.ageMinutes < 60 ? 20 : 0));
  const holderConcentration = clamp(45 + (token.marketCap ?? token.mc ?? 0) / Math.max(liquidity * 20, 1));
  const lowLiquidityRisk = clamp(100 - Math.log10(Math.max(liquidity, 10)) * 17);
  const whaleDominance = clamp(35 + (token.priceChange24hPercent ?? token.priceChange24h ?? 0) * 0.08);
  const abnormalTradePattern = clamp((token.volumeChange24h ?? 0) * 0.35);
  return clamp(
    securityRisk * 0.3 +
      holderConcentration * 0.25 +
      lowLiquidityRisk * 0.25 +
      whaleDominance * 0.1 +
      abnormalTradePattern * 0.1,
  );
}
