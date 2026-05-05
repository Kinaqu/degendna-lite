import { demoRadarTokens } from "@/lib/demo/demoRadar";
import { birdeyeFetch } from "./client";
import type { BirdeyeTokenListItem } from "./types";

type TokenListResponse = BirdeyeTokenListItem[] | { items?: BirdeyeTokenListItem[]; tokens?: BirdeyeTokenListItem[] };

function fallbackItems(): BirdeyeTokenListItem[] {
  return demoRadarTokens.map((token, rank) => ({
    address: token.address,
    symbol: token.symbol,
    name: token.name,
    ageMinutes: token.ageMinutes,
    priceChange24hPercent: token.priceChange24h,
    volumeChange24h: token.volumeChange24h,
    liquidity: token.liquidity,
    marketCap: token.marketCap,
    rank: rank + 1,
  }));
}

function unwrap(response: TokenListResponse): BirdeyeTokenListItem[] {
  if (Array.isArray(response)) return response;
  return response.items || response.tokens || [];
}

export async function getNewListings(chain = "base") {
  const response = await birdeyeFetch<TokenListResponse>("/defi/v2/tokens/new_listing", {
    chain,
    query: { limit: 25 },
    demoFallback: fallbackItems(),
  });
  return unwrap(response);
}

export async function getTrendingTokens(chain = "base") {
  const response = await birdeyeFetch<TokenListResponse>("/defi/token_trending", {
    chain,
    query: { limit: 25 },
    demoFallback: fallbackItems(),
  });
  return unwrap(response);
}

export async function getMemeTokens(chain = "base") {
  const response = await birdeyeFetch<TokenListResponse>("/defi/v2/tokens/meme", {
    chain,
    query: { limit: 25 },
    demoFallback: fallbackItems(),
  });
  return unwrap(response);
}

export async function getTokenOverview(address: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>>("/defi/token_overview", {
    chain,
    query: { address },
    demoFallback: {},
  });
}

export async function getRadarSourceTokens(chain = "base") {
  const [newListings, trending, meme] = await Promise.all([
    getNewListings(chain),
    getTrendingTokens(chain),
    getMemeTokens(chain),
  ]);

  const seen = new Set<string>();
  return [...newListings, ...trending, ...meme].filter((token) => {
    const address = (token.address || token.tokenAddress || "").toLowerCase();
    if (!address || seen.has(address)) return false;
    seen.add(address);
    return true;
  });
}
