import { useState, useEffect } from 'react';
import { useNftInventory } from '@/hooks/useNftInventory';
import Image from 'next/image';

interface InventoryProps {
  setActiveTab: (tab: string) => void;
  isOpen: boolean; // Add this prop to track when inventory is opened
}

export default function Inventory({ setActiveTab, isOpen }: InventoryProps) {
  const [activeCategory, setActiveCategory] = useState<'characters' | 'items'>('characters');
  const { characters, items, loading, error, refresh } = useNftInventory(isOpen);

  // Log when the component renders with isOpen status
  console.log("Inventory component rendered, isOpen:", isOpen);

  // Function to handle refresh button click
  const handleRefresh = () => {
    console.log("Manual refresh requested");
    refresh();
  };

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
            : 'bg-gray-700 text-white'
            }`}
          onClick={() => setActiveCategory('characters')}
        >
          Characters
        </button>
        <button
          className={`py-2 px-6 rounded-lg transition-all ${activeCategory === 'items'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-gray-700 text-white'
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

      {/* Empty state */}
      {!loading && !error &&
        ((activeCategory === 'characters' && characters.length === 0) ||
          (activeCategory === 'items' && items.length === 0)) && (
          <div className="bg-gray-800/50 text-gray-300 p-6 rounded-lg text-center">
            <p className="text-xl">You don't have any Shinzoku {activeCategory} as NFTs yet.</p>
            <p className="mt-2">Visit the shop to claim or purchase {activeCategory}.</p>
          </div>
        )}

      {/* Character/Item Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategory === 'characters'
            ? characters.map((character) => (
              // Character card - similar to your CharacterList component
              <div
                key={character.shinzoku_id}
                className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4 
                    hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 cursor-pointer
                    shadow-[0_0_15px_rgba(0,0,0,0.2)]"
              >
                <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <Image
                    src={character.image_url || "/images/default_character.png"}
                    alt={character.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/default_character.png';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-[#d3af37] text-sm">
                    {character.rank_name} Rank
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#d3af37] mb-1">{character.name}</h3>
                <p className="text-sm mb-2">{character.rarity}</p>

                {character.special_abilities && character.special_abilities.length > 0 && (
                  <div className="mt-2 border-t border-gray-700/50 pt-2">
                    <p className="text-sm text-gray-400">Primary Jutsu</p>
                    <p className="text-md text-[#d3af37] font-semibold">{character.special_abilities[0].jutsu_name}</p>
                  </div>
                )}

                {/* Always show 5 item slots for characters */}
                <div className="mt-3 grid grid-cols-5 gap-1">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-md bg-gray-800/40 border border-gray-700/50"
                    />
                  ))}
                </div>
              </div>
            ))
            : items.map((item) => (
              // Item card - similar to your ItemList component
              <div
                key={item.shinzoku_id}
                className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4 
                    hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 cursor-pointer
                    shadow-[0_0_15px_rgba(0,0,0,0.2)]"
              >
                <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <Image
                    src={item.image_url || "/images/default_item.png"}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/default_item.png';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-[#d3af37] text-sm">
                    {item.rank_name} Rank
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#d3af37] mb-1">{item.name}</h3>
                <p className="text-sm mb-2">{item.rarity}</p>

                {/* Primary stat */}
                {item.stats && Object.keys(item.stats).length > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400 capitalize">{Object.keys(item.stats)[0]}:</span>
                      <span className="text-sm text-white ml-1">
                        {Object.values(item.stats)[0]}
                      </span>
                    </div>
                  </div>
                )}

                {item.special_abilities && item.special_abilities.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-xs text-blue-400">
                      {item.special_abilities[0].jutsu_name}
                    </span>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}