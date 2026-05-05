import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";

export function Hero() {
  return (
    <section className="terminal-grid relative px-5 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-between">
        <nav className="flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            DegenDNA <span className="text-secondary">Lite</span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/app">Open App</Link>
          </Button>
        </nav>

        <div className="grid items-center gap-10 py-14 lg:grid-cols-[1fr_460px]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Frontend-only meme coin radar on Base
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-7xl">
              Find meme coins that fit your wallet.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              DegenDNA analyzes your wallet behavior and ranks new meme tokens by
              momentum, risk, liquidity, and personal fit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/app">
                  Open My Radar <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/app?demo=1">Try Demo</Link>
              </Button>
            </div>
            <p className="mt-5 flex max-w-2xl items-start gap-2 text-sm leading-6 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              We only read public wallet activity. No approvals. No private keys.
              Mint only when you choose.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border bg-card/80 p-4 score-glow">
            <BorderBeam />
            <div className="rounded-xl border border-border bg-background/70 p-4 font-mono text-sm">
              <div className="mb-4 flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
              </div>
              {[
                "$ connect wallet",
                "> reading public activity...",
                "> mapping meme exposure...",
                "> ranking Base meme tokens...",
                "> fit scores locked until mint",
              ].map((line) => (
                <p key={line} className="py-1 text-muted-foreground">
                  <span className="text-secondary">{line.slice(0, 1)}</span>
                  {line.slice(1)}
                </p>
              ))}
              <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-4">
                <p className="text-xs uppercase text-muted-foreground">Detected</p>
                <p className="mt-1 font-display text-2xl font-bold text-violet-100">
                  The Meme Gambler
                </p>
                <p className="mt-3 text-muted-foreground">Degen score: 88/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
