import type { RadarToken, WalletPersonalityResult } from "./personalityTypes";
import { clamp } from "@/lib/utils/numbers";

export function computeFitScore(token: RadarToken, personality?: WalletPersonalityResult) {
  if (!personality) return undefined;
  const p = personality.metrics;
  const personalityCompatibility =
    personality.personalityType === "meme_gambler" || personality.personalityType === "sniper"
      ? token.momentumScore * 0.65 + (100 - token.riskScore) * 0.15 + p.memeExposure * 0.2
      : personality.personalityType === "liquidity_hunter"
        ? token.liquidityScore * 0.65 + (100 - token.riskScore) * 0.25 + token.momentumScore * 0.1
        : token.liquidityScore * 0.35 + token.momentumScore * 0.35 + (100 - token.riskScore) * 0.3;
  const historicalSuccessPattern = clamp(p.winnerHoldRatio + p.realizedPnlPattern * 0.45);
  const riskToleranceMatch = clamp(100 - Math.abs(token.riskScore - p.drawdownTolerance));
  const liquidityMatch = clamp(100 - Math.abs(token.liquidityScore - p.liquidityPreference));
  return clamp(
    personalityCompatibility * 0.4 +
      historicalSuccessPattern * 0.25 +
      riskToleranceMatch * 0.2 +
      liquidityMatch * 0.15,
  );
}
