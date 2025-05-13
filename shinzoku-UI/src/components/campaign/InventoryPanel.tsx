import { useState } from 'react';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  type: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  level?: number;
  stats?: {
    [key: string]: number;
  };
}

export default function InventoryPanel() {
  const [category, setCategory] = useState<'characters' | 'items'>('characters');

  const characters: InventoryItem[] = [
    {
      id: 1,
      name: "Shadow Warrior",
      description: "A fierce warrior from the shadow realm",
      type: "Melee",
      rarity: "rare",
      image: "/images/char1.png",
      level: 5,
      stats: {
        attack: 75,
        defense: 60,
        speed: 45
      }
    },
    {
      id: 2,
      name: "Swift Archer",
      description: "Master of the bow",
      type: "Range",
      rarity: "common",
      image: "/images/char2.png",
      level: 3,
      stats: {
        attack: 65,
        defense: 40,
        speed: 80
      }
    }
  ];

  const items: InventoryItem[] = [
    {
      id: 3,
      name: "Health Potion",
      description: "Restores 50 HP",
      type: "Consumable",
      rarity: "common",
      image: "/images/potion1.png"
    },
    {
      id: 4,
      name: "Power Crystal",
      description: "+10 Attack",
      type: "Equipment",
      rarity: "rare",
      image: "/images/crystal1.png"
    }
  ];

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
        {(category === 'characters' ? characters : items).map((item) => (
          <div key={item.id}
            className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4 hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          >
            <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
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

            {item.stats && (
              <div className="space-y-2">
                {Object.entries(item.stats).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between items-center">
                    <span className="text-gray-400 capitalize">{stat}</span>
                    <div className="w-32 h-2 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#d3af37] to-[#b87333]"
                        style={{ width: `${value}%` }}
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