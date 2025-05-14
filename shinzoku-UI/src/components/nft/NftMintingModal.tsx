import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { CharacterModel } from '@/types/CharacterModel';
import { ItemModel } from '@/types/ItemModel';
import { mintNFT, NftType } from '@/utils/nftMinting';

interface NftMintingModalProps {
  character?: CharacterModel;
  item?: ItemModel;
  isOpen: boolean;
  onClose: () => void;
}

export default function NftMintingModal({ character, item, isOpen, onClose }: NftMintingModalProps) {
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

  const assetName = character ? character.name : item ? item.name : '';
  const assetId = character ? character.shinzoku_id : item ? item.shinzoku_id : '';
  const assetType = character ? NftType.CHARACTER : NftType.ITEM;

  const handleMintNFT = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setResult({
        success: false,
        error: 'Please connect your wallet first'
      });
      return;
    }

    if (!assetId || !assetName) {
      setResult({
        success: false,
        error: 'Missing asset information'
      });
      return;
    }

    setIsMinting(true);
    setResult(null);

    try {
      const mintResult = await mintNFT(
        connection,
        wallet,
        assetId,
        assetName,
        assetType
      );

      // Updated error handling to match what mintNFT returns
      setResult({
        success: mintResult.success,
        mintAddress: mintResult.mintAddress,
        signature: mintResult.signature,
        error: typeof mintResult.errorMessage === 'string'
          ? mintResult.errorMessage
          : mintResult.errorMessage
            ? JSON.stringify(mintResult.errorMessage)
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

  const assetTypeText = character ? 'Character' : 'Item';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#1a0e05] border-2 border-[#d3af37] rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#d3af37]">Mint {assetTypeText} NFT</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-white mb-2">
            You are about to mint <span className="text-[#d3af37] font-semibold">{assetName}</span> as an NFT.
          </p>
          <p className="text-gray-400 text-sm">
            This will create a permanent token on the Solana blockchain representing your {assetTypeText.toLowerCase()}.
          </p>
        </div>

        {result && (
          <div className={`mb-4 p-3 rounded-lg ${result.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
            {result.success ? (
              <>
                <p className="font-bold mb-1">Success!</p>
                <p className="text-sm mb-1">
                  NFT Mint Address: <span className="font-mono">{result.mintAddress}</span>
                </p>
                <p className="text-sm">
                  <a
                    href={`https://explorer.solana.com/address/${result.mintAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View on Solana Explorer
                  </a>
                </p>
              </>
            ) : (
              <>
                <p className="font-bold mb-1">Error</p>
                <p className="text-sm">{result.error}</p>
              </>
            )}
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            disabled={isMinting}
          >
            Cancel
          </button>
          <button
            onClick={handleMintNFT}
            className={`flex-1 py-3 px-4 bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold rounded-lg 
            hover:from-[#e1c158] hover:to-[#cd7f32] transition-all ${isMinting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isMinting}
          >
            {isMinting ? (
              <div className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Minting...
              </div>
            ) : (
              'Mint NFT'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}