import type { NFTMetadataInput } from "@/lib/scoring/personalityTypes";
import { toBase64 } from "./base64";

export function buildNftMetadata({ walletAddress, personality, imageSvg }: NFTMetadataInput) {
  return {
    name: `DegenDNA - ${personality.personalityLabel}`,
    description:
      "A self-contained on-chain wallet personality NFT generated from Birdeye-powered wallet behavior analysis.",
    image: `data:image/svg+xml;base64,${toBase64(imageSvg)}`,
    attributes: [
      { trait_type: "Personality", value: personality.personalityLabel },
      { trait_type: "Risk Appetite", value: personality.riskAppetite },
      { trait_type: "Holding Style", value: personality.holdingStyle },
      { trait_type: "Exit Discipline", value: personality.exitDiscipline },
      { trait_type: "Token Preference", value: personality.tokenPreference },
      { trait_type: "Degen Score", value: Math.round(personality.degenScore) },
      { trait_type: "Wallet", value: walletAddress },
    ],
  };
}

export function buildTokenUri(input: NFTMetadataInput) {
  return `data:application/json;base64,${toBase64(JSON.stringify(buildNftMetadata(input)))}`;
}

export function decodeTokenUri(uri: string) {
  const base64 = uri.replace("data:application/json;base64,", "");
  return JSON.parse(typeof window === "undefined" ? Buffer.from(base64, "base64").toString("utf8") : decodeURIComponent(escape(window.atob(base64)))) as {
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string | number }[];
  };
}
