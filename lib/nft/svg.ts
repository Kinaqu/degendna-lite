import type { WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { shortAddress } from "@/lib/utils/addresses";

const themes: Record<string, { a: string; b: string; c: string }> = {
  sniper: { a: "#22D3EE", b: "#8B5CF6", c: "#10B981" },
  meme_gambler: { a: "#8B5CF6", b: "#F59E0B", c: "#22D3EE" },
  panic_seller: { a: "#EF4444", b: "#F59E0B", c: "#94A3B8" },
  slow_accumulator: { a: "#10B981", b: "#22D3EE", c: "#8B5CF6" },
  liquidity_hunter: { a: "#22D3EE", b: "#10B981", c: "#F8FAFC" },
  smart_follower: { a: "#10B981", b: "#8B5CF6", c: "#22D3EE" },
  bag_holder: { a: "#F59E0B", b: "#8B5CF6", c: "#EF4444" },
  rotator: { a: "#8B5CF6", b: "#22D3EE", c: "#F59E0B" },
  fresh_wallet: { a: "#94A3B8", b: "#22D3EE", c: "#8B5CF6" },
};

export function generateDegenDnaSvg(personality: WalletPersonalityResult) {
  const theme = themes[personality.personalityType];
  return `<svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="900" fill="#080A0F"/>
  <path d="M0 170C170 70 260 120 420 62C590 0 720 55 900 18V900H0Z" fill="${theme.a}" opacity=".16"/>
  <path d="M80 160H820V740H80Z" rx="34" fill="#11141C" stroke="${theme.b}" stroke-width="3"/>
  <circle cx="715" cy="205" r="86" fill="${theme.a}" opacity=".18"/>
  <circle cx="190" cy="690" r="104" fill="${theme.b}" opacity=".14"/>
  <path d="M190 462C260 342 326 562 396 442C468 318 530 584 608 434C656 340 706 392 750 330" fill="none" stroke="${theme.c}" stroke-width="12" stroke-linecap="round"/>
  <text x="120" y="155" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="34" font-weight="700">DegenDNA</text>
  <text x="120" y="275" fill="${theme.a}" font-family="Arial, sans-serif" font-size="58" font-weight="800">${personality.personalityLabel}</text>
  <text x="120" y="342" fill="#94A3B8" font-family="monospace" font-size="24">${shortAddress(personality.walletAddress)}</text>
  <text x="120" y="514" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="130" font-weight="900">${Math.round(personality.degenScore)}</text>
  <text x="345" y="494" fill="#94A3B8" font-family="Arial, sans-serif" font-size="24" font-weight="700">DEGEN</text>
  <text x="345" y="532" fill="#94A3B8" font-family="Arial, sans-serif" font-size="24" font-weight="700">SCORE</text>
  <text x="120" y="645" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="28">Risk: ${personality.riskAppetite}</text>
  <text x="120" y="692" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="28">Style: ${personality.holdingStyle}</text>
  <text x="120" y="739" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="28">Preference: ${personality.tokenPreference}</text>
  <text x="120" y="810" fill="#94A3B8" font-family="Arial, sans-serif" font-size="22">Find meme coins that fit your wallet.</text>
</svg>`;
}
