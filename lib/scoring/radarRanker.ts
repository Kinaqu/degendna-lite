import type { BirdeyeTokenListItem } from "@/lib/birdeye/types";
import type { RadarToken, WalletPersonalityResult } from "./personalityTypes";
import { computeMomentumScore } from "./tokenMomentum";
import { computeRiskScore } from "./tokenRisk";
import { computeLiquidityScore } from "./tokenLiquidity";
import { computeFitScore } from "./tokenFit";

function tokenAddress(token: BirdeyeTokenListItem) {
  return token.address || token.tokenAddress || "0x0000000000000000000000000000000000000000";
}

function priceChange(token: BirdeyeTokenListItem) {
  return token.price24hChangePercent ?? token.priceChange24hPercent ?? token.priceChange24h;
}

function volumeChange(token: BirdeyeTokenListItem) {
  return token.volume24hChangePercent ?? token.volume_24h_change_percent ?? token.volumeChange24h ?? token.volume_4h_change_percent;
}

function marketCap(token: BirdeyeTokenListItem) {
  return token.market_cap ?? token.marketcap ?? token.marketCap ?? token.mc ?? token.fdv;
}

function ageMinutes(token: BirdeyeTokenListItem) {
  if (token.ageMinutes !== undefined) return token.ageMinutes;
  const raw = token.recent_listing_time ?? token.createdAt ?? token.last_trade_unix_time;
  if (raw === undefined) return undefined;
  const timestamp =
    typeof raw === "number"
      ? raw < 10_000_000_000
        ? raw * 1000
        : raw
      : Date.parse(String(raw));
  if (!Number.isFinite(timestamp)) return undefined;
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  return minutes > 60 * 24 * 365 ? undefined : minutes;
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
      const normalizedSource = { ...source, ageMinutes: ageMinutes(source) };
      const momentumScore = computeMomentumScore(normalizedSource);
      const riskScore = computeRiskScore(normalizedSource);
      const liquidityScore = computeLiquidityScore(normalizedSource);
      const token: RadarToken = {
        address: tokenAddress(normalizedSource),
        chain: "base",
        symbol: normalizedSource.symbol || `MEME${index + 1}`,
        name: normalizedSource.name || "Unknown Meme Token",
        logoURI: normalizedSource.logoURI || normalizedSource.logo_uri,
        ageMinutes: normalizedSource.ageMinutes,
        priceChange24h: priceChange(normalizedSource),
        volumeChange24h: volumeChange(normalizedSource),
        liquidity: normalizedSource.liquidity,
        marketCap: marketCap(normalizedSource),
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
