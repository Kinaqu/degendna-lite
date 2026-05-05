"use client";

import { useEffect, useState } from "react";
import type { RadarToken } from "@/lib/scoring/personalityTypes";
import { addWatchlistToken, readWatchlist, removeWatchlistToken, writeWatchlist } from "@/lib/storage/watchlist";

export function useLocalWatchlist(wallet?: string) {
  const [items, setItems] = useState<RadarToken[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => setItems(readWatchlist(wallet)), 0);
    return () => window.clearTimeout(id);
  }, [wallet]);

  function add(token: RadarToken) {
    if (!wallet) return;
    setItems(addWatchlistToken(wallet, token));
  }

  function remove(address: string) {
    if (!wallet) return;
    setItems(removeWatchlistToken(wallet, address));
  }

  function clear() {
    if (!wallet) return;
    writeWatchlist(wallet, []);
    setItems([]);
  }

  return { items, add, remove, clear };
}
