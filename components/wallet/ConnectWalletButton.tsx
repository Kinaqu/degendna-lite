"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { shortAddress } from "@/lib/utils/addresses";

export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!connected) {
          return <Button onClick={openConnectModal}>Connect Wallet</Button>;
        }

        if (chain.unsupported) {
          return (
            <Button variant="danger" onClick={openChainModal}>
              Wrong Network
            </Button>
          );
        }

        return (
          <Button variant="outline" onClick={openAccountModal}>
            {shortAddress(account.address)}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
}
