"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

export function LandingEntryActions() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) router.push("/app");
  }, [address, isConnected, router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = walletAddress.trim();
    if (!isAddress(value)) {
      setError("Enter a valid EVM wallet address.");
      return;
    }
    setError(null);
    router.push(`/app?wallet=${value}`);
  }

  return (
    <div className="mt-8 max-w-2xl space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <ConnectWalletButton />
        <form onSubmit={submit} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
          <Input
            value={walletAddress}
            onChange={(event) => setWalletAddress(event.target.value)}
            placeholder="Enter wallet address"
            aria-label="Wallet address"
            className="h-12"
          />
          <Button type="submit" variant="outline" size="lg">
            Preview <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
      {error ? <p className="text-sm text-warning">{error}</p> : null}
    </div>
  );
}
