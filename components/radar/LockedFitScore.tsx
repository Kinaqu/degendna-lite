import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LockedFitScore() {
  return (
    <Badge tone="muted" className="gap-1">
      <Lock className="h-3 w-3" />
      Locked
    </Badge>
  );
}
