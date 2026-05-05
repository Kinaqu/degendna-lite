import type { RadarToken, WalletPersonalityResult } from "./personalityTypes";

export function buildWeaknessReport(personality: WalletPersonalityResult) {
  return [
    personality.weaknessPreview,
    personality.metrics.securityRiskExposure > 60
      ? "You have tolerated risky contracts before; security warnings should carry extra weight."
      : "Your history shows some preference for cleaner setups.",
    personality.metrics.loserHoldRatio > personality.metrics.winnerHoldRatio
      ? "Your losers tend to stay open longer than winners, which can hurt fast meme rotations."
      : "Your exit timing is relatively balanced compared with your risk appetite.",
  ];
}

export function buildFitExplanation(token: RadarToken, personality?: WalletPersonalityResult) {
  if (!personality || token.fitScore === undefined) {
    return "Mint your DegenDNA NFT on Base to unlock wallet-specific fit analysis.";
  }
  if (token.fitScore >= 75) {
    return `${token.symbol} matches your ${personality.personalityLabel} profile because momentum and liquidity align with your historical behavior.`;
  }
  if (token.fitScore >= 50) {
    return `${token.symbol} has partial fit, but one or more risk or liquidity signals conflict with your wallet history.`;
  }
  return `${token.symbol} may not fit your wallet because its risk and liquidity profile conflict with your past behavior.`;
}
