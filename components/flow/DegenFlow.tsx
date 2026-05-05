"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { ArrowDown, Lock, Sparkles } from "lucide-react";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { WeaknessReport } from "@/components/analysis/WeaknessReport";
import { MintPanel } from "@/components/mint/MintPanel";
import { PersonalityCard } from "@/components/personality/PersonalityCard";
import { RadarTable } from "@/components/radar/RadarTable";
import { DownloadShareCardButton } from "@/components/share/DownloadShareCardButton";
import { ShareToXButton } from "@/components/share/ShareToXButton";
import { TokenDecisionCard } from "@/components/token/TokenDecisionCard";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalWatchlist } from "@/hooks/useLocalWatchlist";
import { useMintStatus } from "@/hooks/useMintStatus";
import { useRadar } from "@/hooks/useRadar";
import { useWalletAnalysis } from "@/hooks/useWalletAnalysis";
import { demoPersonality } from "@/lib/demo/demoWallet";
import type { RadarToken } from "@/lib/scoring/personalityTypes";
import { FlowActions } from "./FlowActions";
import { FlowShell } from "./FlowShell";
import { FlowStepper } from "./FlowStepper";

export function DegenFlow({
  initialDemo = false,
  initialTokenAddress,
  focus = "app",
}: {
  initialDemo?: boolean;
  initialTokenAddress?: string;
  focus?: "app" | "radar" | "mint" | "token";
}) {
  const { address, isConnected } = useAccount();
  const [demoMode, setDemoMode] = useState(initialDemo);
  const [demoUnlocked, setDemoUnlocked] = useState(false);
  const [selectedToken, setSelectedToken] = useState<RadarToken | null>(null);
  const wallet = demoMode ? demoPersonality.walletAddress : address;
  const { personality, isLoading, error, runAnalysis } = useWalletAnalysis(wallet, demoMode);
  const { tokens, isLoading: radarLoading, error: radarError } = useRadar(personality, demoMode);
  const mintStatus = useMintStatus(address);
  const { refetch: refetchMintStatus } = mintStatus;
  const unlocked = Boolean(mintStatus.hasMinted || demoUnlocked);
  const { items: watchlist, add, remove, clear } = useLocalWatchlist(wallet);
  const topFit = useMemo(() => [...tokens].sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0))[0], [tokens]);
  const handleMinted = useCallback(() => {
    void refetchMintStatus();
  }, [refetchMintStatus]);

  const deepLinkedToken = useMemo(() => {
    if (!initialTokenAddress || !tokens.length) return null;
    return tokens.find((item) => item.address.toLowerCase() === initialTokenAddress.toLowerCase()) || tokens[0];
  }, [initialTokenAddress, tokens]);
  const activeToken = selectedToken || deepLinkedToken;

  const activeIndex = !wallet ? 0 : !personality ? 1 : !unlocked ? (focus === "mint" ? 3 : 2) : 4;

  return (
    <FlowShell demoMode={demoMode}>
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
              Connect an EVM wallet or use demo mode. DegenDNA reads public wallet
              activity, computes a personality, ranks meme tokens, and unlocks
              full fit analysis through a Base NFT.
            </p>
            <div className="rounded-lg border border-border bg-background/45 p-3 text-sm text-muted-foreground">
              This is behavioral and market analysis, not financial advice.
            </div>
            {!wallet ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <ConnectWalletButton />
                <Button variant="outline" onClick={() => setDemoMode(true)}>Try demo radar</Button>
              </div>
            ) : (
              <FlowActions
                primaryLabel={personality ? "Refresh Analysis" : "Analyze Wallet"}
                onPrimary={runAnalysis}
                disabled={isLoading || (!isConnected && !demoMode)}
                secondary={!demoMode ? <Button variant="outline" onClick={() => setDemoMode(true)}>Try Demo</Button> : null}
              />
            )}
            {error ? <p className="text-sm text-warning">{error}</p> : null}
            {radarError ? <p className="text-sm text-warning">{radarError}</p> : null}
          </CardContent>
        </Card>

        <AnalysisProgress active={isLoading || radarLoading} complete={Boolean(personality && tokens.length)} />
      </section>

      {personality ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <PersonalityCard personality={personality} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-warning" />
                Pro unlock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Minting your DegenDNA NFT unlocks full radar rows, fit scores,
                warnings, local watchlist, weakness report, and share card.
              </p>
              {unlocked ? (
                <Badge tone="success">Unlocked</Badge>
              ) : (
                <a href="#mint" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                  Go to mint <ArrowDown className="h-4 w-4" />
                </a>
              )}
              {demoMode && !demoUnlocked ? (
                <Button variant="outline" onClick={() => setDemoUnlocked(true)}>Simulate demo unlock</Button>
              ) : null}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {personality ? (
        <section id="radar" className="mt-6">
          <RadarTable tokens={tokens} unlocked={unlocked} onSelect={setSelectedToken} onAdd={add} />
        </section>
      ) : null}

      {activeToken ? (
        <section id="token" className="mt-6">
          <TokenDecisionCard token={activeToken} personality={personality || undefined} unlocked={unlocked} onAdd={add} />
        </section>
      ) : null}

      {personality ? (
        <section id="mint" className="mt-6">
          <MintPanel personality={personality} onMinted={handleMinted} />
        </section>
      ) : null}

      {personality && unlocked ? (
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
    </FlowShell>
  );
}
