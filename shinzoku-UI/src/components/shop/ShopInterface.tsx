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

                // Fallback to sample data in case of error
                setCharacters(sampleCharacters);
                setItems(sampleItems);
                setDemons(sampleDemons);
                setDungeons(sampleDungeons);
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

// Sample data as fallback - these would be used only if API fails
const sampleCharacters: CharacterModel[] = [
    {
        shinzoku_id: "shinzok_abcdef1234567890",
        name: "Naruto Uzumaki",
        stats: {
            hp: 100,
            armor: 10,
            dmg: 50,
            range: 3,
            speed: 30,
            kp: 150
        },
        image_url: "/images/char.png",
        special_abilities: [
            {
                name: "Rasengan",
                value: 100,
                mp_cost: 25,
                jutsu_name: "Spirited Burst",
                rank: 1500
            },
            {
                name: "Shadow Clone",
                value: 75,
                mp_cost: 15,
                jutsu_name: "Multiple Bodies",
                rank: 1200
            }
        ],
        price: 0,
        rarity: "Rare",
        rank: 8500,
        rank_name: "C"
    },
    {
        shinzoku_id: "shinzok_bcdefg1234567890",
        name: "Sasuke Uchiha",
        stats: {
            hp: 90,
            armor: 8,
            dmg: 60,
            range: 2,
            speed: 35,
            kp: 140
        },
        image_url: "/images/char.png",
        special_abilities: [
            {
                name: "Chidori",
                value: 110,
                mp_cost: 30,
                jutsu_name: "Lightning Blade",
                rank: 1600
            }
        ],
        price: 5000,
        rarity: "Epic",
        rank: 9000,
        rank_name: "B"
    }
];

const sampleItems: ItemModel[] = [
    {
        shinzoku_id: "item_abcdef1234567890",
        name: "Shadow Blade",
        stats: {
            hp: 0,
            armor: 5,
            dmg: 30,
            range: 1,
            speed: 10,
            kp: 0
        },
        special_abilities: [
            {
                name: "Shadow Strike",
                value: 50,
                mp_cost: 15,
                jutsu_name: "Darkness Slash",
                rank: 800
            }
        ],
        image_url: "/images/item.png",
        price: 2500,
        rarity: "Epic",
        rank: 5800,
        rank_name: "D"
    },
    {
        shinzoku_id: "item_bcdefg1234567890",
        name: "Healing Crystal",
        stats: {
            hp: 50,
            armor: 0,
            dmg: 0,
            range: 0,
            speed: 5,
            kp: 20
        },
        special_abilities: [
            {
                name: "Rejuvenation",
                value: 40,
                mp_cost: 10,
                jutsu_name: "Life Force",
                rank: 700
            }
        ],
        image_url: "/images/item.png",
        price: 1800,
        rarity: "Rare",
        rank: 4200,
        rank_name: "E"
    }
];

const sampleDemons: DemonModel[] = [
    {
        shinzoku_id: "demon_abcdef1234567890",
        name: "Shadow Fiend",
        stats: {
            hp: 200,
            armor: 20,
            dmg: 75,
            range: 2,
            speed: 25,
            kp: 180
        },
        image_url: "/images/char.png",
        special_abilities: [
            {
                name: "Dark Nova",
                value: 120,
                mp_cost: 40,
                jutsu_name: "Void Explosion",
                rank: 2000
            }
        ],
        type: "Elite",
        rank: 9500,
        rank_name: "B"
    },
    {
        shinzoku_id: "demon_bcdefg1234567890",
        name: "Flame Wraith",
        stats: {
            hp: 150,
            armor: 15,
            dmg: 80,
            range: 3,
            speed: 30,
            kp: 160
        },
        image_url: "/images/char.png",
        special_abilities: [
            {
                name: "Inferno",
                value: 100,
                mp_cost: 35,
                jutsu_name: "Soul Burn",
                rank: 1800
            }
        ],
        type: "Normal",
        rank: 7000,
        rank_name: "C"
    },
    {
        shinzoku_id: "demon_cdefgh1234567890",
        name: "Frost Phantom",
        stats: {
            hp: 130,
            armor: 12,
            dmg: 65,
            range: 4,
            speed: 35,
            kp: 140
        },
        image_url: "/images/char.png",
        special_abilities: [
            {
                name: "Blizzard",
                value: 90,
                mp_cost: 30,
                jutsu_name: "Winter's Grasp",
                rank: 1600
            }
        ],
        type: "Normal",
        rank: 6500,
        rank_name: "C"
    }
];

const sampleDungeons: DungeonModel[] = [
    {
        dungeon_id: "dungeon_abcdef1234567890",
        name: "Dark Forest Cavern",
        description: "A dangerous cavern in the heart of the dark forest, home to powerful shadow beasts",
        image_url: "/images/dungeon.jpg",
        boss: "demon_abcdef1234567890",
        members: [
            "demon_bcdefg1234567890",
            "demon_cdefgh1234567890"
        ],
        rank: 12000,
        rank_name: "A",
        rewards: {
            exp: 500,
            gold: 300,
            items: [
                {
                    item: "item_abcdef1234567890",
                    dropRate: 15
                },
                {
                    item: "item_bcdefg1234567890",
                    dropRate: 5
                }
            ]
        }
    }
];