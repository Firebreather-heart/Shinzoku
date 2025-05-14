'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton } from "./solana/solana-provider";

export default function Header() {
  const { publicKey } = useWallet();

  // Only show the header with disconnect button when wallet is connected
  if (!publicKey) return null;

  return (
    <div className="w-full bg-[#0f172a] border-b border-[#d3af37]/30 py-2">
      <div className="max-w-6xl mx-auto px-4 flex justify-end">
        <WalletDisconnectButton />
      </div>
    </div>
  );
}