"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import WalletConnect from "@/components/WalletConnect";
import Onboarding from "@/components/Onboarding";
import GameInterface from "@/components/GameInterface";
import { preloadAssetsWithProgress } from "@/lib/preloader";

export default function Home() {
  const { publicKey } = useWallet();
  const [isOnboardingComplete, setOnboardingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    if (publicKey) {
      console.log("Wallet Connected:", publicKey.toString());
    }
  }, [publicKey]);

  useEffect(() => {
    preloadAssetsWithProgress((loaded, total) => {
      const percent = Math.floor((loaded / total) * 100);
      setProgress(percent);
    })
      .then(() => {
        setAssetsLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to preload asset:", error);
      });
  }, []);

  if (!assetsLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="w-80 h-4 bg-gray-700 rounded overflow-hidden shadow-inner">
          <div className="h-full animate-glow" style={{ width: `${progress}%`, backgroundColor: '#d3af37' }} />
        </div>
        <p className="mt-4 text-lg font-mono tracking-wide">{progress}%</p>
        <p className="mt-1 text-sm font-mono opacity-70">Loading assets...</p>
      </div>
    );
  }

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