'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletDisconnectButton } from './solana/solana-provider'

export default function Header() {
  const { publicKey } = useWallet()
  if (!publicKey) return null

  return (
    <header className="absolute top-4 right-4 z-50">
      <WalletDisconnectButton />
    </header>
  )
}