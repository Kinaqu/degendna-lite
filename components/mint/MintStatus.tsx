import { Badge } from "@/components/ui/badge";

export function MintStatus({ hash, confirmed }: { hash?: string; confirmed?: boolean }) {
  if (confirmed) return <Badge tone="success">Mint confirmed</Badge>;
  if (hash) return <Badge tone="cyan">Transaction pending</Badge>;
  return <Badge tone="muted">Not minted</Badge>;
}
