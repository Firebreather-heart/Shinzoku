import { useState, useEffect } from 'react';
import { CharacterModel } from '@/types/CharacterModel';
import { ItemModel } from '@/types/ItemModel';
import { ShinzokuAPI } from '@/services/ShinzokuAPI';
import CharacterList from '../characters/CharacterList';
import ItemList from '../items/ItemList';
import DungeonList from '../dungeons/DungeonList';

export default function ShopPanel() {
  const [category, setCategory] = useState<'characters' | 'items' | 'dungeons'>('characters');
  const [characters, setCharacters] = useState<CharacterModel[]>([]);
  const [items, setItems] = useState<ItemModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SHINZOKU_API_KEY || 'shinzoku-katen-kyotsu-tensa-zangetsu'}`
        };

        const [charactersData, itemsData] = await Promise.all([
          ShinzokuAPI.getCharacters(),
          ShinzokuAPI.getItems(),
        ]);

        setCharacters(charactersData);
        setItems(itemsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-6">
        <button
          onClick={() => setCategory('characters')}
          className={`
            px-3 py-1.5 text-xs 
            sm:px-4 sm:py-2 sm:text-sm 
            md:px-6 md:py-3 md:text-base 
            rounded-lg transition-all duration-300 
            ${category === 'characters'
              ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
              : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          Characters
        </button>
        <button
          onClick={() => setCategory('items')}
          className={`
            px-3 py-1.5 text-xs 
            sm:px-4 sm:py-2 sm:text-sm 
            md:px-6 md:py-3 md:text-base 
            rounded-lg transition-all duration-300 
            ${category === 'items'
              ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
              : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          Items
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="spinner w-12 h-12 border-4 border-[#d3af37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[300px] flex-col">
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 max-w-md text-center">
              <p className="text-red-400 font-semibold mb-2">⚠️ {error}</p>
              <p className="text-gray-400 text-sm">Using sample data instead.</p>
            </div>
          </div>
        ) : (
          <>
            {category === 'characters' && <CharacterList characters={characters} />}
            {category === 'items' && <ItemList items={items} />}
          </>
        )}
      </div>
    </div>
  );
}