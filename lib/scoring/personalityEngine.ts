import { demoPersonality } from "@/lib/demo/demoWallet";
import { clamp } from "@/lib/utils/numbers";
import { computeWalletMetrics, hasFreshWalletActivity } from "./walletMetrics";
import {
  personalityLabels,
  type PersonalityType,
  type WalletMetrics,
  type WalletPersonalityResult,
} from "./personalityTypes";
import type { BirdeyeWalletBundle } from "@/lib/birdeye/types";

function scorePersonalities(metrics: WalletMetrics): Record<PersonalityType, number> {
  return {
    sniper: clamp(metrics.newListingExposure * 0.35 + metrics.tradeFrequency * 0.25 + metrics.volatilityExposure * 0.25 + (100 - metrics.averageHoldTime) * 0.15),
    meme_gambler: clamp(metrics.memeExposure * 0.35 + metrics.volatilityExposure * 0.25 + metrics.securityRiskExposure * 0.2 + metrics.drawdownTolerance * 0.2),
    panic_seller: clamp(metrics.lossExitSpeed * 0.4 + metrics.loserHoldRatio * 0.3 + (100 - metrics.profitHoldDuration) * 0.2 + metrics.volatilityExposure * 0.1),
    slow_accumulator: clamp(metrics.averageHoldTime * 0.35 + metrics.profitHoldDuration * 0.3 + metrics.liquidityPreference * 0.2 + (100 - metrics.tradeFrequency) * 0.15),
    liquidity_hunter: clamp(metrics.liquidityPreference * 0.45 + metrics.averagePositionSize * 0.25 + (100 - metrics.securityRiskExposure) * 0.15 + metrics.tokenDiversity * 0.15),
    smart_follower: clamp(metrics.smartMoneyOverlap * 0.45 + metrics.winnerHoldRatio * 0.25 + metrics.realizedPnlPattern * 0.2 + metrics.tokenDiversity * 0.1),
    bag_holder: clamp(metrics.averageHoldTime * 0.35 + metrics.loserHoldRatio * 0.3 + metrics.drawdownTolerance * 0.25 + (100 - metrics.lossExitSpeed) * 0.1),
    rotator: clamp(metrics.tradeFrequency * 0.35 + metrics.tokenDiversity * 0.3 + (100 - metrics.averageHoldTime) * 0.2 + metrics.newListingExposure * 0.15),
    fresh_wallet: 0,
  };
}

function dominant(scores: Record<PersonalityType, number>) {
  return (Object.entries(scores) as [PersonalityType, number][]).sort((a, b) => b[1] - a[1])[0][0];
}

function describe(type: PersonalityType) {
  const descriptions: Record<PersonalityType, string> = {
    sniper: "This wallet is tuned for early entries, fast reads, and new-listing momentum.",
    meme_gambler: "This wallet accepts high volatility and often rotates through meme narratives.",
    panic_seller: "This wallet tends to exit quickly when volatility turns against it.",
    slow_accumulator: "This wallet prefers patience, stronger liquidity, and lower churn.",
    liquidity_hunter: "This wallet gravitates toward deeper pools and cleaner execution paths.",
    smart_follower: "This wallet often overlaps with stronger flows and avoids some low-quality setups.",
    bag_holder: "This wallet tolerates drawdowns and often holds losers longer than winners.",
    rotator: "This wallet moves quickly between narratives and reacts to changing momentum.",
    fresh_wallet: "There is not enough activity yet, so the radar starts in beginner-safe mode.",
  };
  return descriptions[type];
}

export function analyzeWalletPersonality(
  walletAddress: string,
  bundle?: BirdeyeWalletBundle,
  forceDemo = false,
): WalletPersonalityResult {
  if (forceDemo) return { ...demoPersonality, walletAddress };
  const fresh = hasFreshWalletActivity(bundle);
  const metrics = computeWalletMetrics(bundle);
  const scores = scorePersonalities(metrics);
  const personalityType = fresh ? "fresh_wallet" : dominant(scores);
  if (fresh) scores.fresh_wallet = 100;

  const degenScore = clamp(
    metrics.memeExposure * 0.28 +
      metrics.volatilityExposure * 0.24 +
      metrics.newListingExposure * 0.2 +
      metrics.tradeFrequency * 0.18 +
      metrics.securityRiskExposure * 0.1,
  );

  return {
    walletAddress,
    personalityType,
    personalityLabel: personalityLabels[personalityType],
    description: describe(personalityType),
    scores,
    metrics,
    riskAppetite:
      degenScore > 80 ? "Extreme" : degenScore > 62 ? "High" : degenScore > 38 ? "Medium" : "Low",
    holdingStyle:
      metrics.averageHoldTime < 35 ? "Fast" : metrics.averageHoldTime > 65 ? "Patient" : "Balanced",
    exitDiscipline:
      metrics.lossExitSpeed > 65 && metrics.winnerHoldRatio < 45
        ? "Weak"
        : metrics.lossExitSpeed < 40
          ? "Strong"
          : "Medium",
    tokenPreference:
      metrics.memeExposure > 65
        ? "Meme/New Listings"
        : metrics.liquidityPreference > 70
          ? "Liquid Momentum"
          : "Balanced DeFi",
    degenScore,
    weaknessPreview:
      metrics.lossExitSpeed > 60
        ? "Your wallet exits quickly under stress, so thin liquidity and sharp volatility are your main weak spots."
        : "Your wallet can overstay narratives; watch for momentum decay and liquidity exits.",
  };
}
