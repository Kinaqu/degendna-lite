import { Badge } from "@/components/ui/badge";

const personalities = ["The Sniper", "The Meme Gambler", "The Liquidity Hunter", "The Rotator"];

export function PersonalityShowcase() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <Badge tone="cyan">Wallet DNA</Badge>
        <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <h2 className="font-display text-3xl font-bold">
            Your wallet has a personality. Your radar should too.
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {personalities.map((item) => (
              <div key={item} className="rounded-xl border border-border bg-background/45 p-4">
                <p className="font-display text-lg font-semibold">{item}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Scored from wallet behavior, token exposure, liquidity taste,
                  volatility tolerance, and exit patterns.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
