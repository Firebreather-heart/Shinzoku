"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import WalletConnect from "@/components/WalletConnect";
import Onboarding from "@/components/Onboarding";
import GameInterface from "@/components/GameInterface";

export default function Home() {
  const { publicKey } = useWallet();
  const [isOnboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (publicKey) {
      console.log("Wallet Connected:", publicKey.toString());
    }
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {!publicKey ? (
        <WalletConnect />
      ) : !isOnboardingComplete ? (
        <Onboarding onComplete={() => setOnboardingComplete(true)} />
      ) : (
        <>
          <GameInterface />                              
        </>
      )}
    </div>
  );
}
