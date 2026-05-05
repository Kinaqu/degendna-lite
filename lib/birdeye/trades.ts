import { birdeyeFetch } from "./client";

export function getTokenTrades(address: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>[]>("/defi/txs/token", {
    chain,
    query: { address, limit: 50 },
    demoFallback: [],
  });
}
