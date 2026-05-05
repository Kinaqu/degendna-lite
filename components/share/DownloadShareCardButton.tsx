"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareCard } from "./ShareCard";
import type { RadarToken, WalletPersonalityResult } from "@/lib/scoring/personalityTypes";

export function DownloadShareCardButton({
  personality,
  topToken,
}: {
  personality: WalletPersonalityResult;
  topToken?: RadarToken;
}) {
  const ref = useRef<HTMLDivElement>(null);

  async function download() {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "degendna-card.png";
    link.href = dataUrl;
    link.click();
  }

  return (
    <div>
      <div className="pointer-events-none fixed -left-[9999px] top-0" ref={ref}>
        <ShareCard personality={personality} topToken={topToken} />
      </div>
      <Button variant="outline" onClick={download}>
        <Download className="h-4 w-4" /> Download share card
      </Button>
    </div>
  );
}
