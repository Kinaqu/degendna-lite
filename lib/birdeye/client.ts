import { getErrorMessage } from "@/lib/utils/errors";

const BASE_URL = "https://public-api.birdeye.so";
const DEFAULT_TIMEOUT = 9000;
const RETRY_DELAY_MS = 1400;

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
  method?: "GET" | "POST";
  body?: unknown;
  timeoutMs?: number;
};

function buildUrl(path: string, query?: FetchOptions<unknown>["query"]) {
  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseErrorMessage(response: Response) {
  try {
    const json = (await response.json()) as { message?: string; error?: string };
    return json.message || json.error || response.statusText;
  } catch {
    try {
      return (await response.text()) || response.statusText;
    } catch {
      return response.statusText;
    }
  }
}

async function requestOnce<T>(
  url: string,
  chain: string,
  timeoutMs: number,
  method: "GET" | "POST",
  body?: unknown,
) {
  const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  if (!apiKey) {
    throw new BirdeyeError("Missing NEXT_PUBLIC_BIRDEYE_API_KEY");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "X-API-KEY": apiKey,
        "x-chain": chain,
        accept: "application/json",
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await parseErrorMessage(response);
      const message = response.status === 429 ? "Birdeye rate limit reached" : detail;
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
  const method = options.method || "GET";
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT;

  try {
    return await requestOnce<T>(url, chain, timeoutMs, method, options.body);
  } catch (firstError) {
    const shouldRetry =
      firstError instanceof BirdeyeError
        ? firstError.status === 408 || firstError.status === undefined
        : true;
    if (!shouldRetry) {
      console.warn("[Birdeye]", path, getErrorMessage(firstError));
      throw firstError;
    }
    try {
      await sleep(RETRY_DELAY_MS);
      return await requestOnce<T>(url, chain, timeoutMs, method, options.body);
    } catch (secondError) {
      console.warn("[Birdeye]", path, getErrorMessage(secondError || firstError));
      throw secondError;
    }
  }
}
