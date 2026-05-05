import { demoPersonality } from "@/lib/demo/demoWallet";
import { birdeyeFetch } from "./client";
import type { BirdeyeWalletBundle } from "./types";

export async function getWalletTransactions(wallet: string, chain = "base") {
  return birdeyeFetch<unknown[]>("/wallet/tx_list", {
    chain,
    query: { wallet, limit: 50 },
    demoFallback: [],
  });
}

export async function getWalletPnlSummary(wallet: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>>("/wallet/v2/pnl/summary", {
    chain,
    query: { wallet },
    demoFallback: { demo: true, degenScore: demoPersonality.degenScore },
  });
}

export async function getWalletPnlDetails(wallet: string, chain = "base") {
  return birdeyeFetch<unknown[]>("/wallet/v2/pnl/details", {
    chain,
    query: { wallet, limit: 50 },
    demoFallback: [],
  });
}

export async function getWalletBalanceChanges(wallet: string, chain = "base") {
  return birdeyeFetch<unknown[]>("/wallet/balance_change", {
    chain,
    query: { wallet, limit: 50 },
    demoFallback: [],
  });
}

export async function getWalletBundle(wallet: string, chain = "base"): Promise<BirdeyeWalletBundle> {
  const [transactions, pnlSummary, pnlDetails, balanceChanges] = await Promise.all([
    getWalletTransactions(wallet, chain),
    getWalletPnlSummary(wallet, chain),
    getWalletPnlDetails(wallet, chain),
    getWalletBalanceChanges(wallet, chain),
  ]);

  return {
    transactions,
    pnlSummary,
    pnlDetails,
    balanceChanges,
  };
}
