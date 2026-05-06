"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "78c41a2e7c6048f2129c34b3be9fafbd";

const configuredBaseChainId = Number(process.env.NEXT_PUBLIC_BASE_CHAIN_ID || base.id);
export const baseChain = configuredBaseChainId === baseSepolia.id ? baseSepolia : base;

export const wagmiConfig = getDefaultConfig({
  appName: "DegenDNA Lite",
  projectId,
  chains: [baseChain],
  ssr: true,
});

export const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_DEGENDNA_CONTRACT_ADDRESS as `0x${string}` | undefined;
