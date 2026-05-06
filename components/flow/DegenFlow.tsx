"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { CheckCircle2, Sparkles } from "lucide-react";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { WeaknessReport } from "@/components/analysis/WeaknessReport";
import { MintPanel } from "@/components/mint/MintPanel";
import { PersonalityCard } from "@/components/personality/PersonalityCard";
import { RadarTable } from "@/components/radar/RadarTable";
import { DownloadShareCardButton } from "@/components/share/DownloadShareCardButton";
import { ShareToXButton } from "@/components/share/ShareToXButton";
import { TokenPreviewDialog } from "@/components/token/TokenPreviewDialog";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalWatchlist } from "@/hooks/useLocalWatchlist";
import { useMintStatus } from "@/hooks/useMintStatus";
import { useRadar } from "@/hooks/useRadar";
import { useWalletAnalysis } from "@/hooks/useWalletAnalysis";
import type { RadarToken } from "@/lib/scoring/personalityTypes";
import { FlowActions } from "./FlowActions";
import { FlowShell } from "./FlowShell";
import { FlowStepper } from "./FlowStepper";

function skipAccessKey(wallet: string) {
  return `degendna:hackathon-access:${wallet.toLowerCase()}`;
}

export function DegenFlow({
  initialTokenAddress,
  focus = "app",
}: {
  initialTokenAddress?: string;
  focus?: "app" | "radar" | "mint" | "token";
}) {
  const { address, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<RadarToken | null>(null);
  const [skippedMint, setSkippedMint] = useState(false);
  const [mintConfirmed, setMintConfirmed] = useState(false);
  const wallet = address;
  const { personality, isLoading, error, runAnalysis } = useWalletAnalysis(wallet);
  const { tokens, isLoading: radarLoading, error: radarError } = useRadar(personality);
  const mintStatus = useMintStatus(address);
  const { refetch: refetchMintStatus } = mintStatus;
  const hasAccess = Boolean(skippedMint || mintConfirmed || mintStatus.hasMinted);
  const { items: watchlist, add, remove, clear } = useLocalWatchlist(wallet);
  const topFit = useMemo(() => [...tokens].sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0))[0], [tokens]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSelectedToken(null);
      setMintConfirmed(false);
      setSkippedMint(wallet ? window.localStorage.getItem(skipAccessKey(wallet)) === "1" : false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [wallet]);

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

  const activeIndex = !wallet ? 0 : !personality ? 1 : !hasAccess ? 2 : 4;

  return (
    <FlowShell>
      <div className="mb-6">
        <FlowStepper activeIndex={activeIndex} />
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <Card className="relative overflow-hidden">
          <div className="absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full bg-secondary/15 blur-3xl" />
          <CardHeader>
            <Badge tone="cyan">Guided radar flow</Badge>
            <CardTitle className="mt-3 text-4xl">Your wallet has a personality. Your radar should too.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-6 text-muted-foreground">
              Connect an EVM wallet, get a client-side DegenDNA summary, then mint
              your identity or skip the transaction for full hackathon access.
            </p>
            <div className="rounded-lg border border-border bg-background/45 p-3 text-sm text-muted-foreground">
              This is behavioral and market analysis, not financial advice.
            </div>
            {!wallet ? (
              <ConnectWalletButton />
            ) : (
              <FlowActions
                primaryLabel={personality ? "Refresh Analysis" : "Analyze Wallet"}
                onPrimary={runAnalysis}
                disabled={isLoading || !isConnected}
              />
            )}
            {error ? <p className="text-sm text-warning">{error}</p> : null}
            {radarError ? <p className="text-sm text-warning">{radarError}</p> : null}
          </CardContent>
        </Card>

        <AnalysisProgress active={isLoading || radarLoading} complete={Boolean(personality && tokens.length)} />
      </section>

      {personality && !hasAccess ? (
        <section id="access" className="mt-6 grid gap-6 lg:grid-cols-[1fr_520px] lg:items-start">
          <PersonalityCard personality={personality} />
          <MintPanel personality={personality} onMinted={handleMinted} onSkip={handleSkipMint} />
        </section>
      ) : null}

      {personality && hasAccess ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <PersonalityCard personality={personality} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Access enabled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {mintStatus.hasMinted || mintConfirmed
                  ? "Your NFT access is active. All radar, fit, warning, watchlist, and sharing tools are available."
                  : "Hackathon access is active. All radar, fit, warning, watchlist, and sharing tools are available."}
              </p>
              <Badge tone="success">{mintStatus.hasMinted || mintConfirmed ? "NFT access" : "Skipped mint"}</Badge>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {personality && hasAccess ? (
        <section id="radar" className="mt-6">
          <RadarTable tokens={tokens} unlocked={hasAccess} onSelect={setSelectedToken} onAdd={add} />
        </section>
      ) : null}

      {personality && hasAccess ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <WeaknessReport personality={personality} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Share and watchlist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <DownloadShareCardButton personality={personality} topToken={topFit} />
                <ShareToXButton personality={personality} topToken={topFit} />
              </div>
              <div className="rounded-xl border border-border bg-background/45 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Local watchlist</p>
                  <Button size="sm" variant="ghost" onClick={clear}>Clear</Button>
                </div>
                <Badge tone="muted">Local only</Badge>
                <div className="mt-3 grid gap-2">
                  {watchlist.length ? watchlist.map((token) => (
                    <div key={token.address} className="flex items-center justify-between rounded-lg bg-card/60 px-3 py-2 text-sm">
                      <span>{token.symbol}</span>
                      <button onClick={() => remove(token.address)} className="text-muted-foreground hover:text-danger">Remove</button>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">Add tokens from the radar.</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <TokenPreviewDialog
        token={selectedToken}
        personality={personality || undefined}
        unlocked={hasAccess}
        onClose={() => setSelectedToken(null)}
        onAdd={add}
      />
    </FlowShell>
  );
}
