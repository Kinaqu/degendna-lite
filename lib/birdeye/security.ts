import { birdeyeFetch } from "./client";

export function getTokenSecurity(address: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>>("/defi/token_security", {
    chain,
    query: { address },
    demoFallback: {},
  });
}
