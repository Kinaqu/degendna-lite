import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "cyan" | "success" | "warning" | "danger" | "muted";

const toneMap: Record<BadgeTone, string> = {
  default: "border-primary/40 bg-primary/12 text-violet-200",
  cyan: "border-secondary/40 bg-secondary/12 text-cyan-200",
  success: "border-success/40 bg-success/12 text-emerald-200",
  warning: "border-warning/40 bg-warning/12 text-amber-200",
  danger: "border-danger/40 bg-danger/12 text-red-200",
  muted: "border-border bg-muted text-muted-foreground",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneMap[tone],
        className,
      )}
      {...props}
    />
  );
}
