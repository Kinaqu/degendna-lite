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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function normalizedPercent(value: unknown, fallback = 0) {
  const number = asNumber(value, fallback);
  return Math.abs(number) <= 1 ? number * 100 : number;
}

function summaryParts(bundle?: BirdeyeWalletBundle) {
  const raw = asRecord(bundle?.pnlSummary);
  const summary = asRecord(raw.summary ?? raw);
  const counts = asRecord(summary.counts);
  const cashflow = asRecord(summary.cashflow_usd ?? summary.cashflow);
  const pnl = asRecord(summary.pnl);
  const totalBuy = asNumber(counts.total_buy ?? counts.totalBuy);
  const totalSell = asNumber(counts.total_sell ?? counts.totalSell);
  const totalTrade = asNumber(counts.total_trade ?? counts.totalTrade, totalBuy + totalSell);
  const totalWin = asNumber(counts.total_win ?? counts.totalWin);
  const totalLoss = asNumber(counts.total_loss ?? counts.totalLoss);
  const uniqueTokens = asNumber(summary.unique_tokens ?? summary.uniqueTokens);
  const winRate = clamp(normalizedPercent(counts.win_rate ?? counts.winRate, totalTrade > 0 ? (totalWin / Math.max(totalTrade, 1)) * 100 : 0));
  const invested = asNumber(cashflow.total_invested ?? cashflow.totalInvested);
  const sold = asNumber(cashflow.total_sold ?? cashflow.totalSold);
  const realized = asNumber(pnl.realized_profit_usd ?? pnl.realizedProfitUsd ?? summary.realized_pnl ?? summary.realizedPnl ?? summary.pnl);
  const realizedPercent = normalizedPercent(pnl.realized_profit_percent ?? pnl.realizedProfitPercent);
  const unrealized = asNumber(pnl.unrealized_usd ?? pnl.unrealizedUsd);
  const avgProfit = asNumber(pnl.avg_profit_per_trade_usd ?? pnl.avgProfitPerTradeUsd);
  const volume = asNumber(summary.volume ?? summary.total_volume ?? summary.totalVolume, invested + sold);

  return {
    totalTrade,
    totalBuy,
    totalSell,
    totalWin,
    totalLoss,
    uniqueTokens,
    winRate,
    invested,
    sold,
    realized,
    realizedPercent,
    unrealized,
    avgProfit,
    volume,
  };
}

export function computeWalletMetrics(bundle?: BirdeyeWalletBundle): WalletMetrics {
  if (!bundle) return emptyMetrics;
  const txCount = bundle.transactions.length;
  const pnlCount = bundle.pnlDetails.length;
  const summary = summaryParts(bundle);
  const realized = summary.realized;
  const realizedPercent = summary.realizedPercent;
  const volume = summary.volume || (txCount + pnlCount) * 800;
  const totalTrade = summary.totalTrade || txCount + pnlCount;
  const uniqueTokens = summary.uniqueTokens || pnlCount;
  const winRate = summary.winRate || (totalTrade > 0 ? 42 : 0);
  const lossRate = clamp(100 - winRate);
  const buySellSkew = summary.totalBuy + summary.totalSell > 0 ? summary.totalBuy / Math.max(summary.totalBuy + summary.totalSell, 1) : 0.5;
  const meaningful = totalTrade + uniqueTokens + (volume > 0 ? 1 : 0);

  if (meaningful === 0) return emptyMetrics;

  return {
    averageHoldTime: clamp(64 - totalTrade * 0.45 + Math.max(0, realizedPercent) * 0.18 + uniqueTokens * 0.45),
    tradeFrequency: clamp(totalTrade * 2.4 + uniqueTokens * 1.2),
    newListingExposure: clamp(uniqueTokens * 2.4 + totalTrade * 0.65 + (buySellSkew > 0.58 ? 12 : 0)),
    memeExposure: clamp(28 + uniqueTokens * 2.1 + totalTrade * 0.55 + Math.abs(realizedPercent) * 0.25),
    lossExitSpeed: clamp(28 + lossRate * 0.55 + Math.max(0, -summary.avgProfit) / 80 + Math.max(0, -realizedPercent) * 0.35),
    profitHoldDuration: clamp(30 + winRate * 0.32 + Math.max(0, realizedPercent) * 0.4),
    drawdownTolerance: clamp(24 + summary.totalLoss * 3.2 + Math.max(0, -realizedPercent) * 0.7 + Math.max(0, -realized) / 300),
    tokenDiversity: clamp(uniqueTokens * 4.2),
    liquidityPreference: clamp(Math.log10(Math.max(volume, 10)) * 18),
    securityRiskExposure: clamp(24 + uniqueTokens * 1.6 + totalTrade * 0.35 + Math.max(0, -realizedPercent) * 0.25),
    smartMoneyOverlap: clamp(28 + winRate * 0.5 + Math.max(0, realizedPercent) * 0.18),
    realizedPnlPattern: clamp(50 + realizedPercent * 0.7 + realized / 600),
    volatilityExposure: clamp(34 + uniqueTokens * 1.7 + totalTrade * 0.55 + Math.abs(realizedPercent) * 0.35),
    averagePositionSize: clamp(Math.log10(Math.max(volume / Math.max(totalTrade, 1), 10)) * 16),
    winnerHoldRatio: clamp(winRate * 0.82 + Math.max(0, realizedPercent) * 0.12),
    loserHoldRatio: clamp(lossRate * 0.78 + Math.max(0, -realizedPercent) * 0.15),
  };
}

export function hasFreshWalletActivity(bundle?: BirdeyeWalletBundle) {
  if (!bundle) return true;
  const summary = summaryParts(bundle);
  const meaningful = bundle.transactions.length + bundle.pnlDetails.length + summary.totalTrade + summary.uniqueTokens;
  return meaningful < 3;
}
