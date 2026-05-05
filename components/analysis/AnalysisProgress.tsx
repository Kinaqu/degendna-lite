"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

const steps = [
  "Reading wallet activity...",
  "Mapping token behavior...",
  "Checking entry timing...",
  "Measuring risk appetite...",
  "Building your radar...",
];

export function AnalysisProgress({ active = false, complete = false }: { active?: boolean; complete?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/45 p-4">
      <div className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
        {active && !complete ? <Loader2 className="h-5 w-5 animate-spin text-secondary" /> : <CheckCircle2 className="h-5 w-5 text-success" />}
        Wallet analysis
      </div>
      <div className="grid gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 rounded-lg bg-card/60 px-3 py-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${complete || active ? "bg-secondary" : "bg-muted-foreground/40"}`} />
            <span className={index === steps.length - 1 ? "text-foreground" : "text-muted-foreground"}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
