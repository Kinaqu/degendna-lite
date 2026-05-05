import { AlertTriangle } from "lucide-react";
import type { RadarToken } from "@/lib/scoring/personalityTypes";

export function RiskWarnings({ token }: { token: RadarToken }) {
  const warnings = token.warnings.length ? token.warnings : ["No severe warning in the current client-side scan."];
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
        <AlertTriangle className="h-5 w-5 text-warning" />
        What looks risky
      </h3>
      <div className="grid gap-2">
        {warnings.map((warning) => (
          <p key={warning} className="rounded-lg border border-warning/20 bg-warning/10 p-3 text-sm leading-6 text-amber-100">
            {warning}
          </p>
        ))}
      </div>
    </div>
  );
}
