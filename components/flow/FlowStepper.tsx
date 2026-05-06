const steps = ["Connect", "Analyze", "Radar", "Mint", "Unlock"];
const demoSteps = ["Demo", "Analyze", "Radar", "Unlocked", "Share"];

export function FlowStepper({ activeIndex, demoMode = false }: { activeIndex: number; demoMode?: boolean }) {
  const visibleSteps = demoMode ? demoSteps : steps;
  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {visibleSteps.map((step, index) => (
        <div
          key={step}
          className={`rounded-lg border px-3 py-2 text-sm ${
            index <= activeIndex
              ? "border-secondary/40 bg-secondary/10 text-cyan-100"
              : "border-border bg-card/50 text-muted-foreground"
          }`}
        >
          <span className="font-mono text-xs">0{index + 1}</span>
          <span className="ml-2 font-semibold">{step}</span>
        </div>
      ))}
    </div>
  );
}
