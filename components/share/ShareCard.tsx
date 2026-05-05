import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";
import { shortAddress } from "@/lib/utils/addresses";

export function ShareCard({
  personality,
  topToken,
}: {
  personality: WalletPersonalityResult;
  topToken?: RadarToken;
}) {
  return (
    <div className="w-[760px] rounded-3xl border border-[#263244] bg-[#080A0F] p-10 text-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <p className="font-sans text-2xl font-bold">DegenDNA <span className="text-[#22D3EE]">Lite</span></p>
        <p className="font-mono text-sm text-[#94A3B8]">{shortAddress(personality.walletAddress)}</p>
      </div>
      <div className="mt-14">
        <p className="font-mono text-sm uppercase text-[#22D3EE]">Wallet type</p>
        <h2 className="mt-3 font-sans text-6xl font-black">{personality.personalityLabel}</h2>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#263244] bg-[#11141C] p-5">
          <p className="text-sm text-[#94A3B8]">Degen score</p>
          <p className="mt-2 font-mono text-4xl text-[#22D3EE]">{Math.round(personality.degenScore)}</p>
        </div>
        <div className="rounded-2xl border border-[#263244] bg-[#11141C] p-5">
          <p className="text-sm text-[#94A3B8]">Risk</p>
          <p className="mt-2 text-3xl font-bold text-[#F59E0B]">{personality.riskAppetite}</p>
        </div>
        <div className="rounded-2xl border border-[#263244] bg-[#11141C] p-5">
          <p className="text-sm text-[#94A3B8]">Top fit</p>
          <p className="mt-2 text-3xl font-bold text-[#10B981]">{topToken?.symbol || "Locked"}</p>
        </div>
      </div>
      <p className="mt-12 text-2xl text-[#F8FAFC]">Find meme coins that fit your wallet.</p>
    </div>
  );
}
