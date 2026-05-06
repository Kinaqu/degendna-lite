# Birdeye Integration

Birdeye calls are centralized in `lib/birdeye`.

`birdeyeFetch<T>()`:

- Reads `NEXT_PUBLIC_BIRDEYE_API_KEY`.
- Sends `X-API-KEY` and `x-chain`.
- Adds query params or JSON POST bodies.
- Uses timeout and one retry for transient network/timeout failures. Rate limits are surfaced without retry loops.
- Handles missing key, 429s, CORS/network errors, and permission errors without replacing real data with fixtures.

Default request budget:

- Landing page: 0 Birdeye requests.
- Wallet analysis: 1 Birdeye request to PnL summary.
- Radar: 1 Birdeye request to trending tokens, with a second new-listings request only when the trending response is too small.
- Hackathon skip access: same real-data budget as the mint path, with the full client-side radar unlocked immediately for presentation.

Endpoint paths are intentionally isolated in wrapper modules because Birdeye endpoint names may need adjustment.
