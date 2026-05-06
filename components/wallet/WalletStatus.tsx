"use client";

import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { shortAddress } from "@/lib/utils/addresses";

export function WalletStatus() {
  const { address, isConnected } = useAccount();
  if (!isConnected) return <Badge tone="muted">Wallet not connected</Badge>;
  return <Badge tone="success">{shortAddress(address)}</Badge>;
}
