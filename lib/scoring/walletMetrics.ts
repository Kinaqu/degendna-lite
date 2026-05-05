import type { BirdeyeWalletBundle } from "@/lib/birdeye/types";
import { clamp } from "@/lib/utils/numbers";
import type { WalletMetrics } from "./personalityTypes";

const emptyMetrics: WalletMetrics = {
  averageHoldTime: 0,
  tradeFrequency: 0,
  newListingExposure: 0,
  memeExposure: 0,
  lossExitSpeed: 0,
  profitHoldDuration: 0,
  drawdownTolerance: 0,
  tokenDiversity: 0,
  liquidityPreference: 0,
  securityRiskExposure: 0,
  smartMoneyOverlap: 0,
  realizedPnlPattern: 0,
  volatilityExposure: 0,
  averagePositionSize: 0,
  winnerHoldRatio: 0,
  loserHoldRatio: 0,
};

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function computeWalletMetrics(bundle?: BirdeyeWalletBundle): WalletMetrics {
  if (!bundle) return emptyMetrics;
  const txCount = bundle.transactions.length;
  const pnlCount = bundle.pnlDetails.length;
  const summary = bundle.pnlSummary || {};
  const realized = asNumber(summary.realized_pnl ?? summary.realizedPnl ?? summary.pnl, 0);
  const volume = asNumber(summary.volume ?? summary.total_volume ?? summary.totalVolume, txCount * 800);
  const winRate = clamp(asNumber(summary.win_rate ?? summary.winRate, txCount > 0 ? 42 : 0), 0, 100);
  const meaningful = txCount + pnlCount;

  if (meaningful === 0) return emptyMetrics;

  return {
    averageHoldTime: clamp(72 - txCount * 0.7 + pnlCount * 0.2),
    tradeFrequency: clamp(txCount * 3.4),
    newListingExposure: clamp(txCount * 2.2 + pnlCount * 1.4),
    memeExposure: clamp(35 + txCount * 1.7 + Math.max(0, -realized) / 250),
    lossExitSpeed: clamp(45 + Math.max(0, -realized) / 350),
    profitHoldDuration: clamp(35 + Math.max(0, realized) / 450),
    drawdownTolerance: clamp(40 + Math.max(0, -realized) / 260 + txCount * 0.4),
    tokenDiversity: clamp(pnlCount * 6 + txCount * 0.8),
    liquidityPreference: clamp(Math.log10(Math.max(volume, 10)) * 18),
    securityRiskExposure: clamp(30 + txCount * 1.1 + Math.max(0, -realized) / 500),
    smartMoneyOverlap: clamp(35 + winRate * 0.45),
    realizedPnlPattern: clamp(50 + realized / 450),
    volatilityExposure: clamp(45 + txCount * 1.3 + Math.max(0, -realized) / 500),
    averagePositionSize: clamp(Math.log10(Math.max(volume / Math.max(txCount, 1), 10)) * 16),
    winnerHoldRatio: clamp(winRate * 0.8),
    loserHoldRatio: clamp(100 - winRate * 0.55),
  };
}

export function hasFreshWalletActivity(bundle?: BirdeyeWalletBundle) {
  if (!bundle) return true;
  return bundle.transactions.length + bundle.pnlDetails.length < 3;
}
