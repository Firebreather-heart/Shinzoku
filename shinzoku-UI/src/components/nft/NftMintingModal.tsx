import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { CharacterModel } from '@/types/CharacterModel';
import { mintCharacterNFT } from '@/utils/nftMinting';

interface NftMintingModalProps {
  character: CharacterModel;
  isOpen: boolean;
  onClose: () => void;
}

export default function NftMintingModal({ character, isOpen, onClose }: NftMintingModalProps) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    mintAddress?: string;
    signature?: string;
    error?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleMintNFT = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setResult({
        success: false,
        error: 'Please connect your wallet first'
      });
      return;
    }

    setIsMinting(true);
    setResult(null);

    try {
      // Use shinzoku_id instead of id to match the CharacterModel interface
      const mintResult = await mintCharacterNFT(
        connection,
        wallet,
        character.shinzoku_id,
        character.name
      );

      // Make sure we convert any object error to a string
      setResult({
        success: mintResult.success,
        mintAddress: mintResult.mintAddress,
        signature: mintResult.signature,
        error: typeof mintResult.errorMessage === 'string'
          ? mintResult.errorMessage
          : mintResult.errorMessage
            ? JSON.stringify(mintResult.errorMessage)
            : mintResult.error
              ? typeof mintResult.error === 'string'
                ? mintResult.error
                : 'An error occurred during minting'
              : undefined
      });
    } catch (err: any) {
      console.error('Error in mint flow:', err);
      setResult({
        success: false,
        error: typeof err === 'string' ? err : err?.message || 'An unexpected error occurred'
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#1a0e05] border-2 border-[#d3af37] rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#d3af37]">Mint {character.name} NFT</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-32 h-32 overflow-hidden rounded-lg">
              {character.image_url && (
                <img
                  src={character.image_url}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-[#f5deb3]">
              You are about to mint <span className="font-bold">{character.name}</span> as an NFT on the Solana blockchain.
            </p>
            {character.rarity && (
              <p className="text-sm text-gray-400">
                Rarity: <span className="text-[#d3af37]">{character.rarity}</span>
              </p>
            )}
          </div>
        </div>

        {!result ? (
          <button
            onClick={handleMintNFT}
            disabled={isMinting || !wallet.connected}
            className={`w-full py-3 ${isMinting || !wallet.connected
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-br from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600'
              } text-white font-bold rounded-lg transition-all`}
          >
            {isMinting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Minting...
              </div>
            ) : !wallet.connected ? (
              'Connect Wallet First'
            ) : (
              'Mint NFT'
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {result.success ? (
              <div className="text-center space-y-3">
                <div className="text-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-500">NFT Minted Successfully!</h3>

                {result.mintAddress && (
                  <div className="text-sm">
                    <p className="text-gray-400 mb-1">Mint Address:</p>
                    <p className="font-mono text-xs bg-black bg-opacity-30 p-2 rounded overflow-x-auto">
                      {result.mintAddress}
                    </p>
                  </div>
                )}

                {result.signature && (
                  <div className="mt-2">
                    <a
                      href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors underline text-sm"
                    >
                      View on Solana Explorer
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="text-red-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-500">Minting Failed</h3>
                {result.error && (
                  <p className="text-sm text-red-400 bg-red-900 bg-opacity-20 p-3 rounded">
                    {result.error}
                  </p>
                )}
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
              >
                Close
              </button>

              {!result.success && (
                <button
                  onClick={handleMintNFT}
                  className="flex-1 py-3 bg-gradient-to-br from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 text-white font-bold rounded-lg transition-all"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}