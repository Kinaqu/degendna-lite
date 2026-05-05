import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FlowActions({
  primaryLabel,
  onPrimary,
  disabled,
  secondary,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  secondary?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button onClick={onPrimary} disabled={disabled}>
        {primaryLabel} <ArrowRight className="h-4 w-4" />
      </Button>
      {secondary}
    </div>
  );
}
