import { useState, useEffect } from 'react';
import CharacterList from '../characters/CharacterList';
import ItemList from '../items/ItemList';
import DungeonList from '../dungeons/DungeonList';
import { CharacterModel } from '@/types/CharacterModel';
import { ItemModel } from '@/types/ItemModel';
import { DemonModel } from '@/types/DemonModel';
import { DungeonModel } from '@/types/DungeonModel';
import { ShinzokuAPI } from '@/services/ShinzokuAPI';

type TabType = 'characters' | 'items' | 'dungeons';

export default function ShopInterface() {
    const [activeTab, setActiveTab] = useState<TabType>('characters');
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [items, setItems] = useState<ItemModel[]>([]);
    const [demons, setDemons] = useState<DemonModel[]>([]);
    const [dungeons, setDungeons] = useState<DungeonModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use the API service to fetch data
                const [charactersData, itemsData, demonsData, dungeonsData] = await Promise.all([
                    ShinzokuAPI.getCharacters(),
                    ShinzokuAPI.getItems(),
                    ShinzokuAPI.getDemons(),
                    ShinzokuAPI.getDungeons()
                ]);

                // Update state with fetched data
                setCharacters(charactersData);
                setItems(itemsData);
                setDemons(demonsData);
                setDungeons(dungeonsData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="spinner w-12 h-12 border-4 border-[#d3af37] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center min-h-[400px] flex-col">
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 max-w-md text-center">
                        <p className="text-red-400 font-semibold mb-2">⚠️ {error}</p>
                        <p className="text-gray-400 text-sm">Using sample data instead.</p>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'characters':
                return <CharacterList characters={characters} />;
            case 'items':
                return <ItemList items={items} />;
            case 'dungeons':
                return <DungeonList dungeons={dungeons} demons={demons} items={items} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-[calc(100vh-150px)] bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
            <div className="w-full px-4 py-8">
                <h1 className="text-4xl font-bold text-[#d3af37] text-center mb-8">Shinzoku Shop</h1>

                {/* Navigation Tabs */}
                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        className={`px-6 py-3 rounded-lg transition-all duration-300 text-lg ${activeTab === 'characters'
                            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
                            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
                            }`}
                        onClick={() => setActiveTab('characters')}
                    >
                        Characters
                    </button>
                    <button
                        className={`px-6 py-3 rounded-lg transition-all duration-300 text-lg ${activeTab === 'items'
                            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
                            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
                            }`}
                        onClick={() => setActiveTab('items')}
                    >
                        Items
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-black/40 border border-[#d3af37]/30 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

