"use client";

import { AlertTriangle } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { baseChain } from "@/lib/blockchain/config";

export function NetworkGuard() {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  if (!isConnected || chainId === baseChain.id) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-sm text-amber-100">
        <AlertTriangle className="h-4 w-4" />
        Minting requires Base. Analysis can still run from public wallet data.
      </p>
      <Button size="sm" variant="outline" onClick={() => switchChain({ chainId: baseChain.id })} disabled={isPending}>
        Switch to Base
      </Button>
    </div>
  );
}
