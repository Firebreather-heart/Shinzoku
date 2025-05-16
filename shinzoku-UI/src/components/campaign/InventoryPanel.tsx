import { useState, useEffect } from 'react';
import { useNftInventory } from '@/hooks/useNftInventory';
import Image from 'next/image';

interface InventoryPanelProps {
  isOpen?: boolean;
}

export default function InventoryPanel({ isOpen = false }: InventoryPanelProps) {
  const [activeCategory, setActiveCategory] = useState<'characters' | 'items'>('characters');
  const { characters, items, loading, error, refresh } = useNftInventory(isOpen);

  useEffect(() => {
    console.log("InventoryPanel isOpen changed:", isOpen);
    if (isOpen) {
      console.log("InventoryPanel is open, should trigger scan");
    }
  }, [isOpen]);

  // Function to handle refresh button click
  const handleRefresh = () => {
    console.log("Manual refresh requested");
    refresh();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#d3af37]">My NFT Collection</h2>
        <button
          onClick={handleRefresh}
          className="py-2 px-4 bg-[#d3af37]/20 hover:bg-[#d3af37]/30 text-[#d3af37] rounded-lg transition-all flex items-center text-sm"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-[#d3af37] border-t-transparent rounded-full animate-spin mr-2"></span>
              Scanning...
            </>
          ) : (
            <>Refresh</>
          )}
        </button>
      </div>

      {/* Tab selector */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`py-1 px-4 rounded-lg transition-all text-sm ${activeCategory === 'characters'
              ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
              : 'bg-gray-700 text-white'
            }`}
          onClick={() => setActiveCategory('characters')}
        >
          Characters ({characters.length})
        </button>
        <button
          className={`py-1 px-4 rounded-lg transition-all text-sm ${activeCategory === 'items'
              ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
              : 'bg-gray-700 text-white'
            }`}
          onClick={() => setActiveCategory('items')}
        >
          Items ({items.length})
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-[#d3af37] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-base text-[#d3af37]">Scanning your wallet for Shinzoku NFTs...</p>
        </div>
      )}

      {/* Error display */}
      {error && !loading && (
        <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm">
          <p className="font-bold">Error scanning wallet</p>
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-xs"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error &&
        ((activeCategory === 'characters' && characters.length === 0) ||
          (activeCategory === 'items' && items.length === 0)) && (
          <div className="bg-gray-800/50 text-gray-300 p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-3 opacity-50">
              {activeCategory === 'characters' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No {activeCategory} found</h3>
            <p className="text-gray-400 text-sm">You don't have any Shinzoku {activeCategory} as NFTs in your connected wallet.</p>
          </div>
        )}

      {/* Character/Item Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {activeCategory === 'characters'
            ? characters.map((character) => (
              <div
                key={character.shinzoku_id}
                className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-3 
                    hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 cursor-pointer
                    shadow-[0_0_15px_rgba(0,0,0,0.2)]"
              >
                <div className="aspect-square mb-2 relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <Image
                    src={character.image_url || "/images/default_character.png"}
                    alt={character.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/default_character.png';
                    }}
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[#d3af37] text-xs">
                    {character.rank_name || "Unknown"} Rank
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#d3af37] truncate">{character.name}</h3>
                <p className="text-xs text-gray-400">{character.rarity || "Common"}</p>
              </div>
            ))
            : items.map((item) => (
              <div
                key={item.shinzoku_id}
                className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-3 
                    hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 cursor-pointer
                    shadow-[0_0_15px_rgba(0,0,0,0.2)]"
              >
                <div className="aspect-square mb-2 relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <Image
                    src={item.image_url || "/images/default_item.png"}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/default_item.png';
                    }}
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[#d3af37] text-xs">
                    {item.rank_name || "Unknown"}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#d3af37] truncate">{item.name}</h3>
                <p className="text-xs text-gray-400">{item.rarity || "Common"}</p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}