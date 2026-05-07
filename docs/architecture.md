# Architecture

DegenDNA Lite is a frontend-first Web3 MVP. Next.js renders the app, Birdeye supplies wallet and market data directly to the browser, TypeScript modules score the data locally, and Base stores NFT ownership plus self-contained token metadata.

No backend, API routes, database, Redis, Supabase, IPFS, Pinata, NFT.Storage, or custom indexer are used.

## Data Flow

1. wagmi reads the connected EVM wallet, or the user enters an EVM address for preview mode.
2. Browser-side Birdeye wrappers fetch wallet and token data.
3. `lib/scoring` computes wallet personality and radar scores.
4. Connected wallets see an NFT mint dialog with a Skip escape path.
5. Mint or Skip opens the full hackathon radar; entered-address preview opens the radar without mint.
6. LocalStorage stores cache and skip access.
