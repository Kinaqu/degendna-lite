"use client";

import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { getRadarSourceTokens } from "@/lib/birdeye/tokens";
import { demoRadarTokens } from "@/lib/demo/demoRadar";
import { rankRadarTokens } from "@/lib/scoring/radarRanker";
import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { getCache, radarKey, setCache } from "@/lib/storage/localCache";

const TTL = 1000 * 60 * 5;

export type RadarMode = "new" | "trending" | "meme" | "low-risk" | "momentum" | "best-fit";

export function useRadar(personality?: WalletPersonalityResult | null, demoMode = false) {
  const chainId = useChainId();
  const [tokens, setTokens] = useState<RadarToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRadar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (demoMode) {
        setTokens(demoRadarTokens);
        return;
      }
      const key = radarKey(chainId, personality?.walletAddress || "base");
      const cached = getCache<RadarToken[]>(key, TTL);
      if (cached) {
        setTokens(cached);
        return;
      }
      const source = await getRadarSourceTokens("base");
      const ranked = rankRadarTokens(source, personality || undefined);
      const usable = ranked.length ? ranked : demoRadarTokens;
      setCache(key, usable);
      setTokens(usable);
    } catch (caught) {
      console.warn("[Radar] falling back to demo", caught);
      setError("Birdeye radar failed, using demo-safe radar.");
      setTokens(demoRadarTokens);
    } finally {
      setIsLoading(false);
    }
  }, [chainId, demoMode, personality]);

  useEffect(() => {
    if (!personality && !demoMode) return;
    const id = window.setTimeout(() => void loadRadar(), 0);
    return () => window.clearTimeout(id);
  }, [personality, demoMode, loadRadar]);

  return { tokens, isLoading, error, loadRadar };
}
