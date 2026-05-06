# Birdeye Integration

Birdeye calls are centralized in `lib/birdeye`.

`birdeyeFetch<T>()`:

- Reads `NEXT_PUBLIC_BIRDEYE_API_KEY`.
- Sends `X-API-KEY` and `x-chain`.
- Adds query params or JSON POST bodies.
- Uses timeout, one retry, and short backoff for rate limits.
- Handles missing key, 429s, CORS/network errors, and permission errors without replacing real data with fixtures.

Endpoint paths are intentionally isolated in wrapper modules because Birdeye endpoint names may need adjustment.
