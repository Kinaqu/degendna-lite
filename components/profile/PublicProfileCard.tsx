"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { degenDnaAbi } from "@/lib/blockchain/abi";
import { CONTRACT_ADDRESS } from "@/lib/blockchain/config";
import { decodeTokenUri } from "@/lib/nft/metadata";
import { isEvmAddress, shortAddress } from "@/lib/utils/addresses";

export function PublicProfileCard({ wallet }: { wallet: string }) {
  const valid = isEvmAddress(wallet);
  const address = valid ? (wallet as `0x${string}`) : undefined;
  const { data: hasMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: degenDnaAbi,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(CONTRACT_ADDRESS && address) },
  });
  const { data: tokenId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: degenDnaAbi,
    functionName: "tokenOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(CONTRACT_ADDRESS && address && hasMinted) },
  });
  const { data: personality } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: degenDnaAbi,
    functionName: "personalityOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(CONTRACT_ADDRESS && address && hasMinted) },
  });
  const { data: tokenURI } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: degenDnaAbi,
    functionName: "tokenURI",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: Boolean(CONTRACT_ADDRESS && hasMinted && tokenId !== undefined) },
  });

  const metadata = useMemo(() => {
    if (!tokenURI || typeof tokenURI !== "string") return null;
    try {
      return decodeTokenUri(tokenURI);
    } catch {
      return null;
    }
  }, [tokenURI]);

  if (!CONTRACT_ADDRESS) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-muted-foreground">Contract address is not configured.</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasMinted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No DegenDNA minted yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-5 text-muted-foreground">{shortAddress(wallet)} has not minted a DegenDNA profile.</p>
          <Button asChild><Link href="/app">Analyze wallet</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Badge tone="success">Base NFT profile</Badge>
        <CardTitle className="mt-3 text-3xl">{String(personality || metadata?.name || "DegenDNA")}</CardTitle>
        <p className="text-sm text-muted-foreground">{shortAddress(wallet)}</p>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {metadata?.image ? <img src={metadata.image} alt={metadata.name} className="rounded-xl border border-border" /> : null}
        <div className="space-y-3">
          {metadata?.attributes?.map((attribute) => (
            <div key={attribute.trait_type} className="flex items-center justify-between rounded-lg border border-border bg-background/45 p-3 text-sm">
              <span className="text-muted-foreground">{attribute.trait_type}</span>
              <span className="font-semibold">{attribute.value}</span>
            </div>
          ))}
          <Button asChild variant="outline"><Link href="/app">Open radar</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
