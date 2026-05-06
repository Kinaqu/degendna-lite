"use client";

import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { getRadarSourceTokens } from "@/lib/birdeye/tokens";
import { rankRadarTokens } from "@/lib/scoring/radarRanker";
import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { getCache, radarKey, setCache } from "@/lib/storage/localCache";
import { getErrorMessage } from "@/lib/utils/errors";

const TTL = 1000 * 60 * 5;

export type RadarMode = "new" | "trending" | "meme" | "low-risk" | "momentum" | "best-fit";

export function useRadar(personality?: WalletPersonalityResult | null) {
  const chainId = useChainId();
  const [tokens, setTokens] = useState<RadarToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRadar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const key = radarKey(chainId, `real:${personality?.walletAddress || "base"}`);
      const cached = getCache<RadarToken[]>(key, TTL);
      if (cached) {
        setTokens(cached);
        return;
      }
      const source = await getRadarSourceTokens("base");
      const ranked = rankRadarTokens(source, personality || undefined);
      setCache(key, ranked);
      setTokens(ranked);
    } catch (caught) {
      console.warn("[Radar] Birdeye radar unavailable", caught);
      setError(`Real Birdeye radar data is unavailable right now: ${getErrorMessage(caught)}`);
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, [chainId, personality]);

  useEffect(() => {
    if (!personality) return;
    const id = window.setTimeout(() => void loadRadar(), 0);
    return () => window.clearTimeout(id);
  }, [personality, loadRadar]);

  return { tokens, isLoading, error, loadRadar };
}
