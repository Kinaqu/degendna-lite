import { birdeyeFetch } from "./client";
import type { BirdeyeWalletBundle } from "./types";

type WalletListResponse = unknown[] | { items?: unknown[]; list?: unknown[]; data?: unknown[] };

const WALLET_DELAY_MS = 900;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unwrapList(response: WalletListResponse): unknown[] {
  if (Array.isArray(response)) return response;
  return response.items || response.list || response.data || [];
}

async function safeCall<T>(
  label: string,
  loader: () => Promise<T>,
): Promise<{ label: string; data?: T; error?: string }> {
  try {
    return { label, data: await loader() };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Birdeye wallet endpoint failed";
    console.warn(`[Birdeye wallet] ${label}`, message);
    return { label, error: message };
  }
}

export async function getWalletTransactions(wallet: string, chain = "base") {
  const response = await birdeyeFetch<WalletListResponse>("/v1/wallet/tx_list", {
    chain,
    query: { wallet, limit: 50 },
  });
  return unwrapList(response);
}

export async function getWalletPnlSummary(wallet: string, chain = "base") {
  return birdeyeFetch<Record<string, unknown>>("/wallet/v2/pnl/summary", {
    chain,
    query: { wallet, duration: "all" },
  });
}

export async function getWalletPnlDetails(wallet: string, chain = "base") {
  const response = await birdeyeFetch<WalletListResponse>("/wallet/v2/pnl/details", {
    chain,
    method: "POST",
    body: {
      wallet,
      duration: "all",
      sort_by: "last_trade",
      sort_type: "desc",
      limit: 50,
      offset: 0,
    },
  });
  return unwrapList(response);
}

export async function getWalletBalanceChanges(wallet: string, chain = "base") {
  const response = await birdeyeFetch<WalletListResponse>("/wallet/balance_change", {
    chain,
    query: { wallet, limit: 50 },
  });
  return unwrapList(response);
}

export async function getWalletBundle(wallet: string, chain = "base"): Promise<BirdeyeWalletBundle> {
  const tx = await safeCall("transactions", () => getWalletTransactions(wallet, chain));
  await sleep(WALLET_DELAY_MS);
  const pnlSummary = await safeCall("pnl summary", () => getWalletPnlSummary(wallet, chain));
  await sleep(WALLET_DELAY_MS);
  const pnlDetails = await safeCall("pnl details", () => getWalletPnlDetails(wallet, chain));
  await sleep(WALLET_DELAY_MS);
  const balanceChanges = await safeCall("balance changes", () => getWalletBalanceChanges(wallet, chain));

  return {
    transactions: tx.data || [],
    pnlSummary: pnlSummary.data,
    pnlDetails: pnlDetails.data || [],
    balanceChanges: balanceChanges.data || [],
    errors: [tx, pnlSummary, pnlDetails, balanceChanges].flatMap((result) =>
      result.error ? [`${result.label}: ${result.error}`] : [],
    ),
  };
}
