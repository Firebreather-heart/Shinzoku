import { useState, useEffect } from 'react';
import Image from 'next/image';

interface InventoryProps {
  setActiveTab: (tab: string) => void;
}

export default function Inventory({ setActiveTab }: InventoryProps) {
  const [category, setCategory] = useState<'characters' | 'items'>('characters');
  const [inventory, setInventory] = useState<any[]>([]);

  // Use a cache object to store fetched items
  const [cache, setCache] = useState<{ [key: string]: any[] }>({
    characters: [],
    items: []
  });

  // On first load or category change, check cache first before fetching
  useEffect(() => {
    if (cache[category].length > 0) {
      // Use cached data if available
      setInventory(cache[category]);
    } else {
      // Simulate API fetch - in a real app this would be an API call
      const fetchInventory = async () => {
        // Simulating network request with timeout
        setTimeout(() => {
          let data;
          if (category === 'characters') {
            data = [
              {
                id: 1,
                name: "Shadow Warrior",
                description: "A fierce warrior from the shadow realm",
                type: "Melee",
                rarity: "rare",
                image: "/images/char.png",
                level: 5,
                stats: {
                  attack: 75,
                  defense: 60,
                  speed: 45
                },
                jutsu: "Shadow Strike"
              },
              {
                id: 2,
                name: "Swift Archer",
                description: "Master of the bow",
                type: "Range",
                rarity: "common",
                image: "/images/char.png",
                level: 3,
                stats: {
                  attack: 65,
                  defense: 40,
                  speed: 80
                },
                jutsu: "Rapid Fire"
              }
            ];
          } else {
            data = [
              {
                id: 3,
                name: "Health Potion",
                description: "Restores 50 HP",
                type: "Consumable",
                rarity: "common",
                image: "/images/item.png"
              },
              {
                id: 4,
                name: "Power Crystal",
                description: "+10 Attack",
                type: "Equipment",
                rarity: "rare",
                image: "/images/item.png"
              }
            ];
          }
          // Update both state and cache
          setInventory(data);
          setCache(prev => ({
            ...prev,
            [category]: data
          }));
        }, 300);
      };

      fetchInventory();
    }
  }, [category, cache]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setCategory('characters')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${category === 'characters'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          Characters
        </button>
        <button
          onClick={() => setCategory('items')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${category === 'items'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          Items
        </button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => (
          <div key={item.id}
            className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4 hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          >
            <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              {/* Using object-contain to ensure the full image is visible */}
              <Image
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
              {item.level && (
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#d3af37] to-[#b87333] flex items-center justify-center text-black font-bold shadow-lg">
                  {item.level}
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-[#d3af37] mb-1">{item.name}</h3>
            <p className={`text-sm ${getRarityColor(item.rarity)} mb-2`}>{item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} {item.type}</p>
            <p className="text-gray-400 text-sm mb-4">{item.description}</p>

            {item.jutsu && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-[#d3af37]">Jutsu: {item.jutsu}</h4>
              </div>
            )}

            {item.stats && (
              <div className="space-y-2 mt-2">
                {Object.entries(item.stats).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between items-center">
                    <span className="text-gray-400 capitalize">{stat}</span>
                    <div className="w-32 h-2 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#d3af37] to-[#b87333]"
                        style={{ width: `${value as number}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}