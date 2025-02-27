'use client'

import AnimatedHeartLogo from "@/components/AnimatedLogo"
import { WalletButton } from "../solana/solana-provider"

export default function DashboardFeature() {

  const handleWalletClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) =>
        console.error("Fullscreen request failed:", err)
      )
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6 bg-black">
        
      <h1 className="text-5xl font-bold text-red-500 animate-pulse">
        Shinzoku
      </h1>
      
      <AnimatedHeartLogo />
      <div onClick={handleWalletClick}>
        <WalletButton />
      </div>
 
    </div>
  )
}