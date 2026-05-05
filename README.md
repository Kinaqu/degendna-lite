# DegenDNA Lite

Find meme coins that fit your wallet.

DegenDNA Lite is a frontend-only personalized meme coin radar. It reads public EVM wallet activity, calls Birdeye directly from the browser, detects a wallet personality, ranks Base meme tokens by momentum/risk/liquidity/fit, and uses a simple Base ERC-721 NFT to unlock pro insights.

## Why Traders Use It

- See a free meme radar without approvals or private keys.
- Understand wallet behavior as a simple trader personality.
- Unlock personalized fit scores, warnings, weakness report, watchlist, and share card after minting.
- Share a public DegenDNA profile backed by contract metadata.

This is behavioral and market analysis, not financial advice.

## Architecture

```text
Browser / Next.js App
  -> wagmi + RainbowKit reads wallet
  -> direct Birdeye public API calls
  -> client-side TypeScript scoring engines
  -> frontend-generated SVG + base64 JSON metadata
  -> Base ERC-721 mint stores tokenURI
  -> hasMinted(wallet) gates pro UI
  -> localStorage stores cache/watchlist
```

DegenDNA is intentionally frontend-first: all intelligence is computed client-side from Birdeye data, while Base is used only for ownership, payment, and NFT identity.

For hackathon simplicity, this MVP calls Birdeye directly from the frontend. In production, API keys should be moved behind a secure proxy or serverless edge function.

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_BIRDEYE_API_KEY=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_DEGENDNA_CONTRACT_ADDRESS=
```

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Contract Deployment

Install Foundry dependencies:

```bash
forge install OpenZeppelin/openzeppelin-contracts foundry-rs/forge-std
forge test
forge script contracts/script/Deploy.s.sol --rpc-url $BASE_RPC_URL --broadcast --verify
```

Set `NEXT_PUBLIC_DEGENDNA_CONTRACT_ADDRESS` to the deployed contract address.

## Demo Mode

Use `/app?demo=1` or the “Try Demo” button. Demo mode provides a wallet personality and radar tokens if Birdeye is unavailable or no key is configured.

## Hackathon Limitations

- Public API key is visible in the browser.
- Unlock gating is frontend-grade and transparent.
- Watchlist is local to the browser.
- Profiles are contract metadata only.
- No backend OG image generation, indexer, database, IPFS, or custom API routes.

## Production Improvements

- Secure API proxy or edge function.
- Database-backed profiles and cross-device watchlist.
- Server-side OG images.
- Indexer for faster public profiles.
- Private pro report generation.
- Notifications and alerting.
