# Architecture

DegenDNA Lite is a frontend-first Web3 MVP. Next.js renders the app, Birdeye supplies wallet and market data directly to the browser, TypeScript modules score the data locally, and Base stores NFT ownership plus self-contained token metadata.

No backend, API routes, database, Redis, Supabase, IPFS, Pinata, NFT.Storage, or custom indexer are used.

## Data Flow

1. wagmi reads the connected EVM wallet.
2. Browser-side Birdeye wrappers fetch wallet and token data.
3. `lib/scoring` computes wallet personality and radar scores.
4. Free UI shows momentum, risk, and liquidity.
5. Base contract `hasMinted(wallet)` unlocks fit score and pro sections.
6. LocalStorage stores cache and watchlist.
