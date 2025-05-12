'use client'

import dynamic from 'next/dynamic'
import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletError } from '@solana/wallet-adapter-base'
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useCluster } from '../cluster/cluster-data-access'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false,
})

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const endpoint = useMemo(() => cluster.endpoint, [cluster])
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}

export function WalletDisconnectButton({ className }: { className?: string }) {
  const { disconnect } = useWallet()
  const [showModal, setShowModal] = useState(false)

  const handleDisconnect = async () => {
    await disconnect()
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`btn btn-xs md:btn-sm ${className || ''}`}
      >
        Disconnect
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 text-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-[#3b82f6]">
            <h2 className="text-xl font-bold mb-4 text-center">Disconnect Wallet</h2>
            <p className="mb-6 text-center">
              Are you sure you want to disconnect your wallet?
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="btn btn-sm bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleDisconnect} 
                className="btn btn-sm bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
