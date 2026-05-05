"use client";

import { useReadContract } from "wagmi";
import { degenDnaAbi } from "@/lib/blockchain/abi";
import { CONTRACT_ADDRESS } from "@/lib/blockchain/config";

export function useMintStatus(wallet?: `0x${string}`) {
  const enabled = Boolean(wallet && CONTRACT_ADDRESS);
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: degenDnaAbi,
    functionName: "hasMinted",
    args: wallet ? [wallet] : undefined,
    query: { enabled },
  });

  return {
    hasMinted: Boolean(data),
    isLoading,
    refetch,
    contractConfigured: Boolean(CONTRACT_ADDRESS),
  };
}
