"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { LandingEntryActions } from "@/components/landing/LandingEntryActions";
import { MintDegenDnaDialog } from "@/components/mint/MintDegenDnaDialog";
import { RadarTable } from "@/components/radar/RadarTable";
import { TokenPreviewDialog } from "@/components/token/TokenPreviewDialog";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMintStatus } from "@/hooks/useMintStatus";
import { useRadar } from "@/hooks/useRadar";
import { useWalletAnalysis } from "@/hooks/useWalletAnalysis";
import type { RadarToken } from "@/lib/scoring/personalityTypes";
import { shortAddress } from "@/lib/utils/addresses";
import { FlowShell } from "./FlowShell";

function skipAccessKey(wallet: string) {
  return `degendna:hackathon-access:${wallet.toLowerCase()}`;
}

export function DegenFlow({
  initialWalletAddress,
  initialTokenAddress,
  focus = "app",
}: {
  initialWalletAddress?: string;
  initialTokenAddress?: string;
  focus?: "app" | "radar" | "mint" | "token";
}) {
  const { address: connectedAddress, isConnected } = useAccount();
  const manualWallet = useMemo(() => {
    const value = initialWalletAddress?.trim();
    return value && isAddress(value) ? value : undefined;
  }, [initialWalletAddress]);
  const isPreviewMode = Boolean(!connectedAddress && manualWallet);
  const wallet = connectedAddress || manualWallet;
  const [selectedToken, setSelectedToken] = useState<RadarToken | null>(null);
  const [skippedMint, setSkippedMint] = useState(false);
  const [mintConfirmed, setMintConfirmed] = useState(false);
  const { personality, isLoading, error, runAnalysis } = useWalletAnalysis(wallet);
  const { tokens, isLoading: radarLoading, error: radarError } = useRadar(personality);
  const mintStatus = useMintStatus(connectedAddress);
  const { refetch: refetchMintStatus } = mintStatus;
  const hasAccess = Boolean(isPreviewMode || skippedMint || mintConfirmed || mintStatus.hasMinted);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSelectedToken(null);
      setMintConfirmed(false);
      setSkippedMint(wallet && connectedAddress ? window.localStorage.getItem(skipAccessKey(wallet)) === "1" : false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [connectedAddress, wallet]);

  useEffect(() => {
    if (!wallet || personality || isLoading) return;
    const id = window.setTimeout(() => void runAnalysis(), 120);
    return () => window.clearTimeout(id);
  }, [wallet, personality, isLoading, runAnalysis]);

  const handleMinted = useCallback(() => {
    setMintConfirmed(true);
    void refetchMintStatus();
  }, [refetchMintStatus]);

  const handleSkipMint = useCallback(() => {
    if (wallet && typeof window !== "undefined") {
      window.localStorage.setItem(skipAccessKey(wallet), "1");
    }
    setSkippedMint(true);
  }, [wallet]);

  const deepLinkedToken = useMemo(() => {
    if (!initialTokenAddress || !tokens.length) return null;
    return tokens.find((item) => item.address.toLowerCase() === initialTokenAddress.toLowerCase()) || tokens[0];
  }, [initialTokenAddress, tokens]);

  useEffect(() => {
    if (focus !== "token" || !deepLinkedToken) return;
    const id = window.setTimeout(() => setSelectedToken(deepLinkedToken), 0);
    return () => window.clearTimeout(id);
  }, [deepLinkedToken, focus]);

  const mintDialogOpen = Boolean(
    personality && connectedAddress && isConnected && !hasAccess && !mintStatus.isLoading,
  );

  return (
    <FlowShell>
      {!wallet ? (
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <Badge tone="cyan">Start</Badge>
            <CardTitle className="mt-3 text-3xl">Choose how to scan a wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-6 text-muted-foreground">
              Connect your wallet for the NFT flow, or enter any EVM address to open
              a preview radar without connecting.
            </p>
            <LandingEntryActions />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-background/45 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge tone={isPreviewMode ? "warning" : "success"}>
                {isPreviewMode ? "Address preview mode" : "Connected wallet mode"}
              </Badge>
              <p className="mt-3 font-display text-2xl font-semibold">
                Wallet analysis and token radar
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                DegenDNA reads public wallet activity, builds a simple personality
                profile, then ranks live Base tokens by momentum, risk, liquidity,
                and fit for this wallet.
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {wallet ? shortAddress(wallet) : null}
              </p>
            </div>
            {!connectedAddress ? <ConnectWalletButton /> : null}
          </div>

          <AnalysisProgress active={isLoading || radarLoading} complete={Boolean(personality && tokens.length)} />

          {error ? <p className="text-sm text-warning">{error}</p> : null}
          {radarError ? <p className="text-sm text-warning">{radarError}</p> : null}

          {personality && hasAccess ? (
            <section id="radar">
              <RadarTable tokens={tokens} unlocked={hasAccess} onSelect={setSelectedToken} />
            </section>
          ) : null}
        </div>
      )}

      <MintDegenDnaDialog
        open={mintDialogOpen}
        personality={personality}
        onMinted={handleMinted}
        onSkip={handleSkipMint}
      />

      <TokenPreviewDialog
        token={selectedToken}
        personality={personality || undefined}
        unlocked={hasAccess}
        onClose={() => setSelectedToken(null)}
      />
    </FlowShell>
  );
}
