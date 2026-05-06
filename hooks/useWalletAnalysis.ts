"use client";

import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { getWalletBundle } from "@/lib/birdeye/wallet";
import { analyzeWalletPersonality } from "@/lib/scoring/personalityEngine";
import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { getCache, setCache, walletAnalysisKey } from "@/lib/storage/localCache";

const TTL = 1000 * 60 * 20;

export function useWalletAnalysis(wallet?: string) {
  const chainId = useChainId();
  const [personality, setPersonality] = useState<WalletPersonalityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setPersonality(null);
      setError(null);
    }, 0);
    return () => window.clearTimeout(id);
  }, [chainId, wallet]);

  const runAnalysis = useCallback(async () => {
    if (!wallet) {
      setError("Connect a wallet before running DegenDNA analysis.");
      return;
    }

    const targetWallet = wallet;
    setIsLoading(true);
    setError(null);
    try {
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
      if (bundle.errors?.length && bundle.transactions.length + bundle.pnlDetails.length < 3) {
        setError(
          "Birdeye wallet endpoints returned limited data for this API key, so the profile is based only on available public responses.",
        );
      }
    } catch (caught) {
      console.warn("[Wallet analysis] Birdeye wallet analysis unavailable", caught);
      setError("Real Birdeye wallet analysis is unavailable right now. Showing a limited fresh-wallet profile, not fake trading history.");
      setPersonality(analyzeWalletPersonality(targetWallet));
    } finally {
      setIsLoading(false);
    }
  }, [chainId, wallet]);

  return { personality, isLoading, error, runAnalysis, setPersonality };
}
