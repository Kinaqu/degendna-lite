import { birdeyeFetch } from "./client";

export function getTokenPrice(address: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>>("/defi/price", {
    chain,
    query: { address },
    demoFallback: {},
  });
}

export function getPriceStats(address: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>>("/defi/price_volume/single", {
    chain,
    query: { address },
    demoFallback: {},
  });
}
