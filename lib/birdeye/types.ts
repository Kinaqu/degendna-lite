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
  price?: number;
  priceChange24hPercent?: number;
  priceChange24h?: number;
  price24hChangePercent?: number;
  volumeChange24h?: number;
  volume24hChangePercent?: number;
  volume24hUSD?: number;
  volume_24h_usd?: number;
  volume_24h_change_percent?: number;
  volume_4h_usd?: number;
  volume_4h_change_percent?: number;
  volume_2h_usd?: number;
  volume_2h_change_percent?: number;
  volume_1h_usd?: number;
  volume_1h_change_percent?: number;
  liquidity?: number;
  marketCap?: number;
  marketcap?: number;
  market_cap?: number;
  mc?: number;
  fdv?: number;
  createdAt?: string | number;
  recent_listing_time?: string | number;
  last_trade_unix_time?: number;
  ageMinutes?: number;
  rank?: number;
};

export type BirdeyeWalletBundle = {
  transactions: unknown[];
  pnlSummary?: Record<string, unknown>;
  pnlDetails: unknown[];
  balanceChanges: unknown[];
  errors?: string[];
};
