export type PersonalityType =
  | "sniper"
  | "meme_gambler"
  | "panic_seller"
  | "slow_accumulator"
  | "liquidity_hunter"
  | "smart_follower"
  | "bag_holder"
  | "rotator"
  | "fresh_wallet";

export type WalletMetrics = {
  averageHoldTime: number;
  tradeFrequency: number;
  newListingExposure: number;
  memeExposure: number;
  lossExitSpeed: number;
  profitHoldDuration: number;
  drawdownTolerance: number;
  tokenDiversity: number;
  liquidityPreference: number;
  securityRiskExposure: number;
  smartMoneyOverlap: number;
  realizedPnlPattern: number;
  volatilityExposure: number;
  averagePositionSize: number;
  winnerHoldRatio: number;
  loserHoldRatio: number;
};

export type WalletPersonalityResult = {
  walletAddress: string;
  personalityType: PersonalityType;
  personalityLabel: string;
  description: string;
  scores: Record<PersonalityType, number>;
  metrics: WalletMetrics;
  riskAppetite: "Low" | "Medium" | "High" | "Extreme";
  holdingStyle: "Fast" | "Balanced" | "Patient";
  exitDiscipline: "Weak" | "Medium" | "Strong";
  tokenPreference: string;
  degenScore: number;
  weaknessPreview: string;
};

export type RadarToken = {
  address: string;
  chain: string;
  symbol: string;
  name: string;
  logoURI?: string;
  ageMinutes?: number;
  priceChange24h?: number;
  volumeChange24h?: number;
  liquidity?: number;
  marketCap?: number;
  momentumScore: number;
  riskScore: number;
  liquidityScore: number;
  fitScore?: number;
  smartMoneyScore?: number;
  verdict: "Watch" | "Risky" | "Strong Fit" | "Avoid" | "Neutral";
  explanation: string[];
  warnings: string[];
};

export type NFTMetadataInput = {
  walletAddress: string;
  personality: WalletPersonalityResult;
  imageSvg: string;
};

export const personalityLabels: Record<PersonalityType, string> = {
  sniper: "The Sniper",
  meme_gambler: "The Meme Gambler",
  panic_seller: "The Panic Seller",
  slow_accumulator: "The Slow Accumulator",
  liquidity_hunter: "The Liquidity Hunter",
  smart_follower: "The Smart Follower",
  bag_holder: "The Bag Holder",
  rotator: "The Rotator",
  fresh_wallet: "Fresh Wallet",
};
