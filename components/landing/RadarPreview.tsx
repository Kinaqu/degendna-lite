import { Badge } from "@/components/ui/badge";

const previewRows = [
  ["Live source", "Birdeye trending", "1 request"],
  ["Wallet analysis", "PnL summary", "1 request"],
  ["Unlock state", "Demo: instant", "No mint"],
  ["Pro mode", "Base NFT", "Optional"],
];

export function RadarPreview() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <Badge>Low-request live flow</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold">Live data loads only when the radar opens.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            The landing page does not spend Birdeye quota. Demo and connected-wallet flows fetch live data inside the guided app.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card/70">
          <div className="grid grid-cols-3 gap-4 border-b border-border px-4 py-3 text-xs uppercase text-muted-foreground">
            <span>Step</span>
            <span>Data</span>
            <span>Budget</span>
          </div>
          {previewRows.map(([step, data, budget]) => (
            <div key={step} className="grid grid-cols-3 gap-4 border-b border-border/70 px-4 py-4 text-sm last:border-b-0">
              <span className="font-semibold">{step}</span>
              <span className="text-muted-foreground">{data}</span>
              <Badge tone={budget === "Optional" ? "muted" : "cyan"}>{budget}</Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
