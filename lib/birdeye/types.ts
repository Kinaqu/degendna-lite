export type BirdeyeChain = "base" | "ethereum" | "bsc" | "solana" | string;

export type BirdeyeEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

export type BirdeyeTokenListItem = {
  address?: string;
  tokenAddress?: string;
  symbol?: string;
  name?: string;
  logoURI?: string;
  logo_uri?: string;
  priceChange24hPercent?: number;
  priceChange24h?: number;
  volumeChange24h?: number;
  volume24hUSD?: number;
  liquidity?: number;
  marketCap?: number;
  mc?: number;
  createdAt?: string | number;
  ageMinutes?: number;
  rank?: number;
};

export type BirdeyeWalletBundle = {
  transactions: unknown[];
  pnlSummary?: Record<string, unknown>;
  pnlDetails: unknown[];
  balanceChanges: unknown[];
};
