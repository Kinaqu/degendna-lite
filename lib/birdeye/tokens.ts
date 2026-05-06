import { birdeyeFetch } from "./client";
import type { BirdeyeTokenListItem } from "./types";

type TokenListResponse =
  | BirdeyeTokenListItem[]
  | {
      items?: BirdeyeTokenListItem[];
      tokens?: BirdeyeTokenListItem[];
      list?: BirdeyeTokenListItem[];
    };

const SOURCE_DELAY_MS = 900;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unwrap(response: TokenListResponse): BirdeyeTokenListItem[] {
  if (Array.isArray(response)) return response;
  return response.items || response.tokens || response.list || [];
}

async function safeSource(
  label: string,
  loader: () => Promise<BirdeyeTokenListItem[]>,
): Promise<{ label: string; items: BirdeyeTokenListItem[]; error?: string }> {
  try {
    return { label, items: await loader() };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Birdeye source failed";
    console.warn(`[Birdeye tokens] ${label}`, message);
    return { label, items: [], error: message };
  }
}

export async function getNewListings(chain = "base") {
  const response = await birdeyeFetch<TokenListResponse>("/defi/v3/token/list", {
    chain,
    query: {
      sort_by: "recent_listing_time",
      sort_type: "desc",
      limit: 25,
      min_liquidity: 1000,
    },
  });
  return unwrap(response);
}

export async function getTrendingTokens(chain = "base") {
  const response = await birdeyeFetch<TokenListResponse>("/defi/token_trending", {
    chain,
    query: {
      sort_by: "rank",
      sort_type: "asc",
      offset: 0,
      limit: 25,
    },
  });
  return unwrap(response);
}

export async function getMemeTokens(chain = "base") {
  const response = await birdeyeFetch<TokenListResponse>("/defi/v3/token/meme/list", {
    chain,
    query: {
      sort_by: "volume_24h_usd",
      sort_type: "desc",
      source: "all",
      limit: 25,
    },
  });
  return unwrap(response);
}

export async function getTokenOverview(address: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>>("/defi/token_overview", {
    chain,
    query: { address },
  });
}

export async function getRadarSourceTokens(chain = "base") {
  const sources = [
    await safeSource("trending", () => getTrendingTokens(chain)),
    await sleep(SOURCE_DELAY_MS).then(() => safeSource("new listings", () => getNewListings(chain))),
    await sleep(SOURCE_DELAY_MS).then(() => safeSource("meme list", () => getMemeTokens(chain))),
  ];

  const seen = new Set<string>();
  const tokens = sources
    .flatMap((source) => source.items)
    .filter((token) => {
      const address = (token.address || token.tokenAddress || "").toLowerCase();
      if (!address || seen.has(address)) return false;
      seen.add(address);
      return true;
    });

  if (!tokens.length) {
    const errors = sources.flatMap((source) => (source.error ? [`${source.label}: ${source.error}`] : []));
    throw new Error(errors.length ? errors.join("; ") : "Birdeye returned no radar tokens");
  }

  return tokens;
}
