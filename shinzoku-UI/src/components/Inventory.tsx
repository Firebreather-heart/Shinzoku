import { useState, useEffect } from 'react';
import { useNftInventory } from '@/hooks/useNftInventory';
import Image from 'next/image';

interface InventoryProps {
  setActiveTab: React.Dispatch<React.SetStateAction<"home" | "inventory" | "shop" | "battle" | "story" | "campaign" | "challenge">>;
  isOpen: boolean; // Add this prop to track when inventory is opened
}

export default function Inventory({ setActiveTab, isOpen }: InventoryProps) {
  const [activeCategory, setActiveCategory] = useState<'characters' | 'items'>('characters');
  const { characters, items, loading, error, refresh } = useNftInventory(isOpen);

  // Function to handle refresh button click
  const handleRefresh = () => refresh();

  // Add an effect to log when isOpen changes
  useEffect(() => {
    console.log("Inventory isOpen changed:", isOpen);
  }, [isOpen]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#d3af37]">My NFT Collection</h2>
        <button
          onClick={handleRefresh}
          className="py-2 px-4 bg-[#d3af37]/20 hover:bg-[#d3af37]/30 text-[#d3af37] rounded-lg transition-all flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-[#d3af37] border-t-transparent rounded-full animate-spin mr-2"></span>
              Scanning...
            </>
          ) : (
            <>Refresh</>
          )}
        </button>
      </div>

      {/* Tab selector */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`py-2 px-6 rounded-lg transition-all ${activeCategory === 'characters'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
          onClick={() => setActiveCategory('characters')}
        >
          Characters
        </button>
        <button
          className={`py-2 px-6 rounded-lg transition-all ${activeCategory === 'items'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
          onClick={() => setActiveCategory('items')}
        >
          Items
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-900/50 text-red-300 p-4 rounded-lg mb-6">
          <p className="font-bold">Error scanning wallet</p>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-[#d3af37] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-base text-[#d3af37]">Scanning your wallet for Shinzoku NFTs...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error &&
        ((activeCategory === 'characters' && characters.length === 0) ||
          (activeCategory === 'items' && items.length === 0)) && (
          <div className="bg-black/40 border border-gray-800 p-6 rounded-lg text-center">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeCategory === 'characters'
            ? characters.map((character) => (
              // Character card - similar to your CharacterList component
              <div
                key={character.shinzoku_id}
                className="bg-gradient-to-b from-[#1a0e05]/80 to-[#1a0e05]/40 hover:from-[#d3af37]/10 hover:to-[#1a0e05]/60 
                  transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(211,175,55,0.15)]
                  rounded-xl overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={character.image_url || ""}
                    alt={character.name}
                    width={250}
                    height={250}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">{character.rarity}</span>
                      <span className="text-xs text-[#d3af37]">Rank {character.rank_name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-lg font-semibold text-[#d3af37] mb-1 truncate">{character.name}</h3>

                  {/* <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400"></span>
                      <span className="text-sm text-white ml-1">{character.}</span>
                    </div>
                  </div> */}

                  {character.special_abilities && character.special_abilities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="text-xs text-blue-400">
                        {character.special_abilities[0].jutsu_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
            : items.map((item) => (
              // Item card - similar to your ItemList component
              <div
                key={item.shinzoku_id}
                className="bg-gradient-to-b from-[#1a0e05]/80 to-[#1a0e05]/40 hover:from-[#d3af37]/10 hover:to-[#1a0e05]/60 
                  transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(211,175,55,0.15)]
                  rounded-xl overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.image_url || ""}
                    alt={item.name}
                    width={250}
                    height={250}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">{item.rarity}</span>
                      <span className="text-xs text-[#d3af37]">Rank {item.rank_name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-lg font-semibold text-[#d3af37] mb-1 truncate">{item.name}</h3>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400">{Object.keys(item.stats)[0]}:</span>
                      <span className="text-sm text-white ml-1">{Object.values(item.stats)[0]}</span>
                    </div>
                  </div>

                  {item.special_abilities && item.special_abilities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="text-xs text-blue-400">
                        {item.special_abilities[0].jutsu_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}