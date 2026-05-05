import { getErrorMessage } from "@/lib/utils/errors";

const BASE_URL = "https://public-api.birdeye.so";
const DEFAULT_TIMEOUT = 9000;

export class BirdeyeError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "BirdeyeError";
  }
}

type FetchOptions<T> = {
  chain?: string;
  query?: Record<string, string | number | boolean | undefined>;
  demoFallback?: T;
  timeoutMs?: number;
};

function buildUrl(path: string, query?: FetchOptions<unknown>["query"]) {
  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function requestOnce<T>(url: string, chain: string, timeoutMs: number) {
  const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  if (!apiKey) {
    throw new BirdeyeError("Missing NEXT_PUBLIC_BIRDEYE_API_KEY");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        "x-chain": chain,
        accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const message = response.status === 429 ? "Birdeye rate limit reached" : response.statusText;
      throw new BirdeyeError(message, response.status);
    }

    const json = (await response.json()) as { data?: T; success?: boolean; message?: string };
    if (json.success === false) {
      throw new BirdeyeError(json.message || "Birdeye request failed");
    }
    return (json.data ?? json) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function birdeyeFetch<T>(
  path: string,
  options: FetchOptions<T> = {},
): Promise<T> {
  const chain = options.chain || "base";
  const url = buildUrl(path, options.query);

  try {
    return await requestOnce<T>(url, chain, options.timeoutMs || DEFAULT_TIMEOUT);
  } catch (firstError) {
    try {
      return await requestOnce<T>(url, chain, options.timeoutMs || DEFAULT_TIMEOUT);
    } catch (secondError) {
      console.warn("[Birdeye]", path, getErrorMessage(secondError || firstError));
      if (options.demoFallback !== undefined) return options.demoFallback;
      throw secondError;
    }
  }
}
