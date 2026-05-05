# Base Contract

`contracts/DegenDNA.sol` is a minimal ERC-721:

- One mint per wallet.
- Mint price.
- Stores tokenURI.
- Stores `hasMinted`, `tokenOf`, and `personalityOf`.
- Emits `PersonalityMinted`.
- Owner can update price and withdraw.

The contract does not score wallets or call Birdeye. All analysis stays client-side.
