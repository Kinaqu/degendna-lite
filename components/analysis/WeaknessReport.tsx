import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildWeaknessReport } from "@/lib/scoring/explanations";
import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export function WeaknessReport({ personality }: { personality: WalletPersonalityResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Weakness Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {buildWeaknessReport(personality).map((item) => (
            <p key={item} className="rounded-lg border border-border bg-background/45 p-3 text-sm leading-6 text-muted-foreground">
              {item}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
