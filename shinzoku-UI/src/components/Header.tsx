'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton } from './solana/solana-provider';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Header() {
  const { publicKey } = useWallet();
  const [hasAirdroppedToday, setHasAirdroppedToday] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    const lastAirdrop = localStorage.getItem(`airdrop-${publicKey.toBase58()}`);
    const today = new Date().toDateString();
    if (lastAirdrop === today) {
      setHasAirdroppedToday(true);
    } else {
      setHasAirdroppedToday(false);
    }
  }, [publicKey]);

  const handleAirdrop = async () => {
    if (!publicKey || hasAirdroppedToday) return;

    setIsRequesting(true);
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature, 'confirmed');
      localStorage.setItem(`airdrop-${publicKey.toBase58()}`, new Date().toDateString());
      setHasAirdroppedToday(true);
      setToast({ message: '✅ Airdrop successful: 2 SOL received!', type: 'success' });
    } catch (err) {
      console.error('❌ Airdrop failed:', err);
      setToast({ message: '❌ Airdrop failed. Please try again later.', type: 'error' });
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!publicKey) return null;

  return (
    <div className="w-full bg-[#0f172a] border-b border-[#d3af37]/30 py-2 relative">
      <div className="max-w-6xl mx-auto px-4 flex justify-end items-center space-x-4">
        <button
          onClick={handleAirdrop}
          disabled={hasAirdroppedToday || isRequesting}
          className={`btn btn-xs md:btn-sm ${hasAirdroppedToday
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-[#D4A017] hover:bg-blue-200'
            } text-white`}
        >
          {hasAirdroppedToday
            ? 'Airdrop Received'
            : isRequesting
              ? 'Requesting...'
              : 'Request 2 SOL Airdrop'}
        </button>
        <WalletDisconnectButton />
      </div>
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
