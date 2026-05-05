import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export const demoWalletAddress = "0xDegen00000000000000000000000000000000BEEF";

export const demoPersonality: WalletPersonalityResult = {
  walletAddress: demoWalletAddress,
  personalityType: "meme_gambler",
  personalityLabel: "The Meme Gambler",
  description:
    "This wallet gravitates toward volatile meme rotations, enters early, and accepts high variance for momentum exposure.",
  scores: {
    sniper: 78,
    meme_gambler: 92,
    panic_seller: 41,
    slow_accumulator: 18,
    liquidity_hunter: 55,
    smart_follower: 61,
    bag_holder: 34,
    rotator: 83,
    fresh_wallet: 0,
  },
  metrics: {
    averageHoldTime: 18,
    tradeFrequency: 86,
    newListingExposure: 82,
    memeExposure: 91,
    lossExitSpeed: 66,
    profitHoldDuration: 31,
    drawdownTolerance: 74,
    tokenDiversity: 79,
    liquidityPreference: 52,
    securityRiskExposure: 69,
    smartMoneyOverlap: 58,
    realizedPnlPattern: 47,
    volatilityExposure: 88,
    averagePositionSize: 39,
    winnerHoldRatio: 28,
    loserHoldRatio: 62,
  },
  riskAppetite: "Extreme",
  holdingStyle: "Fast",
  exitDiscipline: "Weak",
  tokenPreference: "Meme/New Listings",
  degenScore: 88,
  weaknessPreview:
    "Your history shows weak exits during volatility spikes, so high-risk tokens need tighter monitoring.",
};
