# DegenDNA Lite

Find meme coins that fit your wallet.

DegenDNA Lite is a frontend-only personalized meme coin radar. It reads public EVM wallet activity, calls Birdeye directly from the browser, detects a wallet personality, ranks Base meme tokens by momentum/risk/liquidity/fit, and uses a simple Base ERC-721 NFT as an optional onchain identity.

## Why Traders Use It

- See a free meme radar without approvals or private keys.
- Understand wallet behavior as a simple trader personality.
- Connect a wallet for the NFT flow, or enter an address for preview mode.
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
  -> mint or skip opens the hackathon radar
  -> localStorage stores cache and skip access
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

## Hackathon Access

After wallet analysis, users can mint their DegenDNA NFT or press Skip. For the
hackathon build, both paths unlock the full client-side radar experience. Radar
tokens are not fixture-backed; they come from Birdeye token endpoints or show an
explicit unavailable state.

To protect the public API key, the app uses a light request budget: wallet analysis defaults to Birdeye PnL summary, radar defaults to trending tokens, and new listings are only requested if the trending response is too small.

## Hackathon Limitations

- Public API key is visible in the browser.
- Unlock gating is frontend-grade and transparent.
- Profiles are contract metadata only.
- No backend OG image generation, indexer, database, IPFS, or custom API routes.

## Production Improvements

- Secure API proxy or edge function.
- Server-side OG images.
- Indexer for faster public profiles.
- Private pro report generation.
- Notifications and alerting.
