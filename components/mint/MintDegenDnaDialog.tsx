"use client";

import { useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NetworkGuard } from "@/components/wallet/NetworkGuard";
import { degenDnaAbi } from "@/lib/blockchain/abi";
import { CONTRACT_ADDRESS, baseChain } from "@/lib/blockchain/config";
import { buildTokenUri } from "@/lib/nft/metadata";
import { generateDegenDnaSvg } from "@/lib/nft/svg";
import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { NFTPreview } from "./NFTPreview";
import { MintStatus } from "./MintStatus";

export function MintDegenDnaDialog({
  open,
  personality,
  onMinted,
  onSkip,
}: {
  open: boolean;
  personality: WalletPersonalityResult | null;
  onMinted: () => void;
  onSkip: () => void;
}) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: degenDnaAbi,
    functionName: "mintPrice",
    query: { enabled: Boolean(CONTRACT_ADDRESS) },
  });

  const tokenURI = useMemo(() => {
    if (!personality) return "";
    const imageSvg = generateDegenDnaSvg(personality);
    return buildTokenUri({ walletAddress: personality.walletAddress, personality, imageSvg });
  }, [personality]);

  useEffect(() => {
    if (isSuccess) onMinted();
  }, [isSuccess, onMinted]);

  function mint() {
    if (!CONTRACT_ADDRESS || !personality) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: degenDnaAbi,
      functionName: "mintPersonalityNFT",
      args: [tokenURI, personality.personalityLabel],
      value: mintPrice ?? parseEther("0.001"),
      chainId: baseChain.id,
    });
  }

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/72 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-4 bottom-4 z-50 max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] focus:outline-none sm:left-1/2 sm:right-auto sm:top-1/2 sm:bottom-auto sm:w-[min(860px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2">
          {personality ? (
            <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
              <NFTPreview personality={personality} />
              <div className="space-y-4">
                <div>
                  <Badge tone="default">Connected wallet mode</Badge>
                  <Dialog.Title className="mt-3 font-display text-3xl font-bold">
                    Mint your DegenDNA NFT
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
                    There is no demo version for connected wallets. Mint your identity
                    on Base or skip the transaction to continue with full hackathon access.
                  </Dialog.Description>
                </div>

                <div className="rounded-xl border border-border bg-background/45 p-4">
                  <p className="font-mono text-xs uppercase text-secondary">Wallet personality</p>
                  <p className="mt-2 font-display text-2xl font-semibold">{personality.personalityLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{personality.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Degen score</p>
                      <p className="mt-1 font-mono text-lg font-semibold text-secondary">{Math.round(personality.degenScore)}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <p className="mt-1 font-semibold">{personality.riskAppetite}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Style</p>
                      <p className="mt-1 font-semibold">{personality.holdingStyle}</p>
                    </div>
                  </div>
                </div>

                <NetworkGuard />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/45 p-4">
                    <p className="text-sm text-muted-foreground">Network</p>
                    <p className="mt-1 font-semibold">Base</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/45 p-4">
                    <p className="text-sm text-muted-foreground">Mint price</p>
                    <p className="mt-1 font-mono font-semibold">{mintPrice ? formatEther(mintPrice) : "0.001"} ETH</p>
                  </div>
                </div>
                {!CONTRACT_ADDRESS ? (
                  <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-amber-100">
                    Add NEXT_PUBLIC_DEGENDNA_CONTRACT_ADDRESS after deploying the contract.
                  </p>
                ) : null}
                <MintStatus hash={hash} confirmed={isSuccess} />
                <Button onClick={mint} disabled={!address || !CONTRACT_ADDRESS || isPending || confirming} className="w-full">
                  {isPending || confirming ? "Minting..." : "Mint NFT"}
                </Button>
                <Button variant="ghost" onClick={onSkip} className="w-full bg-background/20 text-muted-foreground opacity-75 hover:opacity-100">
                  Skip
                </Button>
                {error ? <p className="text-sm text-danger">{error.message}</p> : null}
              </div>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
