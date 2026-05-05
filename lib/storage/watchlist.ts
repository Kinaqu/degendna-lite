import type { RadarToken } from "@/lib/scoring/personalityTypes";

export function watchlistKey(wallet: string) {
  return `degendna:watchlist:${wallet.toLowerCase()}`;
}

export function readWatchlist(wallet?: string): RadarToken[] {
  if (!wallet || typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(watchlistKey(wallet)) || "[]") as RadarToken[];
  } catch {
    return [];
  }
}

export function writeWatchlist(wallet: string, tokens: RadarToken[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(watchlistKey(wallet), JSON.stringify(tokens));
}

export function addWatchlistToken(wallet: string, token: RadarToken) {
  const current = readWatchlist(wallet);
  if (current.some((item) => item.address.toLowerCase() === token.address.toLowerCase())) {
    return current;
  }
  const next = [token, ...current].slice(0, 20);
  writeWatchlist(wallet, next);
  return next;
}

export function removeWatchlistToken(wallet: string, address: string) {
  const next = readWatchlist(wallet).filter(
    (item) => item.address.toLowerCase() !== address.toLowerCase(),
  );
  writeWatchlist(wallet, next);
  return next;
}
