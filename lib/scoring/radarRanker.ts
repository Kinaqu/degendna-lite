import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import type { RadarToken, WalletPersonalityResult } from "./personalityTypes";
import { computeMomentumScore } from "./tokenMomentum";
import { computeRiskScore } from "./tokenRisk";
import { computeLiquidityScore } from "./tokenLiquidity";
import { computeFitScore } from "./tokenFit";

function tokenAddress(token: BirdeyeTokenListItem) {
  return token.address || token.tokenAddress || "0x0000000000000000000000000000000000000000";
}

function verdict(token: Pick<RadarToken, "momentumScore" | "riskScore" | "liquidityScore" | "fitScore">): RadarToken["verdict"] {
  if ((token.fitScore ?? 0) >= 78 && token.riskScore < 70) return "Strong Fit";
  if (token.riskScore > 82 || token.liquidityScore < 25) return "Avoid";
  if (token.riskScore > 65) return "Risky";
  if (token.momentumScore > 60) return "Watch";
  return "Neutral";
}

export function rankRadarTokens(
  sourceTokens: BirdeyeTokenListItem[],
  personality?: WalletPersonalityResult,
): RadarToken[] {
  return sourceTokens
    .map((source, index) => {
      const momentumScore = computeMomentumScore(source);
      const riskScore = computeRiskScore(source);
      const liquidityScore = computeLiquidityScore(source);
      const token: RadarToken = {
        address: tokenAddress(source),
        chain: "base",
        symbol: source.symbol || `MEME${index + 1}`,
        name: source.name || "Unknown Meme Token",
        logoURI: source.logoURI || source.logo_uri,
        ageMinutes: source.ageMinutes,
        priceChange24h: source.priceChange24hPercent ?? source.priceChange24h,
        volumeChange24h: source.volumeChange24h,
        liquidity: source.liquidity,
        marketCap: source.marketCap ?? source.mc,
        momentumScore,
        riskScore,
        liquidityScore,
        verdict: "Neutral",
        explanation: [],
        warnings: [],
      };
      token.fitScore = computeFitScore(token, personality);
      token.verdict = verdict(token);
      token.explanation = [
        momentumScore > 70 ? "Momentum is accelerating across price and volume signals." : "Momentum is present but not yet dominant.",
        liquidityScore > 70 ? "Liquidity is healthier than typical fresh meme launches." : "Liquidity needs monitoring before larger positions.",
      ];
      token.warnings = [
        ...(riskScore > 65 ? ["Risk flags are elevated for this setup."] : []),
        ...(liquidityScore < 40 ? ["Thin liquidity can amplify slippage and exits."] : []),
      ];
      return token;
    })
    .sort((a, b) => (b.fitScore ?? b.momentumScore) - (a.fitScore ?? a.momentumScore));
}
