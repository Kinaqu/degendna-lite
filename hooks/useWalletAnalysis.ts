"use client";

import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { getWalletBundle } from "@/lib/birdeye/wallet";
import { demoPersonality } from "@/lib/demo/demoWallet";
import { analyzeWalletPersonality } from "@/lib/scoring/personalityEngine";
import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { getCache, setCache, walletAnalysisKey } from "@/lib/storage/localCache";

const TTL = 1000 * 60 * 20;

export function useWalletAnalysis(wallet?: string, demoMode = false) {
  const chainId = useChainId();
  const [personality, setPersonality] = useState<WalletPersonalityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    const targetWallet = wallet || demoPersonality.walletAddress;
    setIsLoading(true);
    setError(null);
    try {
      if (demoMode) {
        setPersonality({ ...demoPersonality, walletAddress: targetWallet });
        return;
      }

      const key = walletAnalysisKey(targetWallet, chainId);
      const cached = getCache<WalletPersonalityResult>(key, TTL);
      if (cached) {
        setPersonality(cached);
        return;
      }

      const bundle = await getWalletBundle(targetWallet, "base");
      const result = analyzeWalletPersonality(targetWallet, bundle);
      setCache(key, result);
      setPersonality(result);
    } catch (caught) {
      console.warn("[Wallet analysis] falling back to demo", caught);
      setError("Birdeye wallet analysis failed, using demo-safe data.");
      setPersonality({ ...demoPersonality, walletAddress: targetWallet });
    } finally {
      setIsLoading(false);
    }
  }, [chainId, demoMode, wallet]);

  useEffect(() => {
    if (!demoMode) return;
    const id = window.setTimeout(() => void runAnalysis(), 0);
    return () => window.clearTimeout(id);
  }, [demoMode, runAnalysis]);

  return { personality, isLoading, error, runAnalysis, setPersonality };
}
