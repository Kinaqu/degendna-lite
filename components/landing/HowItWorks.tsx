import { Badge } from "@/components/ui/badge";

const steps = [
  "Connect wallet.",
  "Detect your trading personality.",
  "Open your personalized meme radar.",
  "Mint on Base to unlock fit scores and warnings.",
];

export function HowItWorks() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Badge tone="cyan">How it works</Badge>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-xl border border-border bg-card/70 p-5">
              <p className="font-mono text-sm text-secondary">0{index + 1}</p>
              <p className="mt-3 font-display text-xl font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
