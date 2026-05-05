import { demoRadarTokens } from "@/lib/demo/demoRadar";
import { Badge } from "@/components/ui/badge";
import { formatPercent, scoreTone } from "@/lib/utils/numbers";

export function RadarPreview() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Badge>Radar preview</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold">Momentum, risk, liquidity, fit.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Free mode shows the radar. Minted wallets unlock the fit column,
            personalized warnings, and watchlist.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card/70">
          <div className="grid grid-cols-5 gap-4 border-b border-border px-4 py-3 text-xs uppercase text-muted-foreground">
            <span>Token</span>
            <span>Price</span>
            <span>Momentum</span>
            <span>Risk</span>
            <span>Fit</span>
          </div>
          {demoRadarTokens.slice(0, 4).map((token) => (
            <div key={token.address} className="grid grid-cols-5 gap-4 border-b border-border/70 px-4 py-4 text-sm last:border-b-0">
              <span className="font-semibold">{token.symbol}</span>
              <span className="font-mono text-secondary">{formatPercent(token.priceChange24h)}</span>
              <Badge tone={scoreTone(token.momentumScore)}>{Math.round(token.momentumScore)}</Badge>
              <Badge tone={scoreTone(token.riskScore, true)}>{Math.round(token.riskScore)}</Badge>
              <Badge tone="muted">Locked</Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
