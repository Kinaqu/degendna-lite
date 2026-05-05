"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "DEMO_PROJECT_ID";

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
