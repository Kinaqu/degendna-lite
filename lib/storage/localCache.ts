type CacheRecord<T> = {
  value: T;
  createdAt: number;
};

export function getCache<T>(key: string, ttlMs: number): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheRecord<T>;
    if (Date.now() - parsed.createdAt > ttlMs) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify({ value, createdAt: Date.now() }));
}

export function walletAnalysisKey(wallet: string, chainId: number | string) {
  return `degendna:wallet-analysis:v2:${wallet.toLowerCase()}:${chainId}`;
}

export function radarKey(chainId: number | string, mode: string) {
  return `degendna:radar:v2:${chainId}:${mode}`;
}
