import Link from "next/link";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { WalletStatus } from "@/components/wallet/WalletStatus";

export function FlowShell({
  children,
  demoMode,
}: {
  children: React.ReactNode;
  demoMode?: boolean;
}) {
  return (
    <main className="terminal-grid min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="font-display text-xl font-bold">
            DegenDNA <span className="text-secondary">Lite</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <WalletStatus demoMode={demoMode} />
            <ConnectWalletButton />
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
