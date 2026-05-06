"use client";

import { useEffect, useMemo } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkGuard } from "@/components/wallet/NetworkGuard";
import { NFTPreview } from "./NFTPreview";
import { MintStatus } from "./MintStatus";
import { degenDnaAbi } from "@/lib/blockchain/abi";
import { CONTRACT_ADDRESS, baseChain } from "@/lib/blockchain/config";
import { buildTokenUri } from "@/lib/nft/metadata";
import { generateDegenDnaSvg } from "@/lib/nft/svg";
import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export function MintPanel({
  personality,
  onMinted,
  onSkip,
}: {
  personality: WalletPersonalityResult;
  onMinted?: () => void;
  onSkip?: () => void;
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
    const imageSvg = generateDegenDnaSvg(personality);
    return buildTokenUri({ walletAddress: personality.walletAddress, personality, imageSvg });
  }, [personality]);

  useEffect(() => {
    if (isSuccess) onMinted?.();
  }, [isSuccess, onMinted]);

  function mint() {
    if (!CONTRACT_ADDRESS) return;
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
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge tone="default">Optional Base NFT</Badge>
            <CardTitle className="mt-3 text-2xl">Save your DegenDNA onchain</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Mint your wallet identity on Base, or skip the transaction and continue
              with full hackathon access.
            </p>
          </div>
          <MintStatus hash={hash} confirmed={isSuccess} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <NFTPreview personality={personality} />
        <div className="space-y-4">
          <NetworkGuard />
          <div className="rounded-xl border border-border bg-background/45 p-4">
            <p className="text-sm text-muted-foreground">Network</p>
            <p className="mt-1 font-semibold">Base</p>
          </div>
          <div className="rounded-xl border border-border bg-background/45 p-4">
            <p className="text-sm text-muted-foreground">Mint price</p>
            <p className="mt-1 font-mono font-semibold">{mintPrice ? formatEther(mintPrice) : "0.001"} ETH</p>
          </div>
          {!CONTRACT_ADDRESS ? (
            <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-amber-100">
              Add NEXT_PUBLIC_DEGENDNA_CONTRACT_ADDRESS after deploying the contract.
            </p>
          ) : null}
          <Button onClick={mint} disabled={!address || !CONTRACT_ADDRESS || isPending || confirming} className="w-full">
            {isPending || confirming ? "Minting..." : "Mint on Base"}
          </Button>
          {onSkip ? (
            <Button variant="ghost" onClick={onSkip} className="w-full bg-background/20 text-muted-foreground opacity-75 hover:opacity-100">
              Skip
            </Button>
          ) : null}
          {error ? <p className="text-sm text-danger">{error.message}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
