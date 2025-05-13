import { useState } from 'react';
import Image from 'next/image';

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: 'gems' | 'kino';
  image: string;
}

export default function ShopPanel() {
  const [category, setCategory] = useState<'gems' | 'characters' | 'items'>('gems');

  const gemPacks: ShopItem[] = [
    { id: 1, name: "Small Gem Pack", description: "100 Gems", price: 0.99, currency: 'kino', image: "/images/gem.png" },
    { id: 2, name: "Medium Gem Pack", description: "500 Gems", price: 4.99, currency: 'kino', image: "/images/gem.png" },
    { id: 3, name: "Large Gem Pack", description: "1200 Gems", price: 9.99, currency: 'kino', image: "/images/gem.png" },
  ];

  const characters: ShopItem[] = [
    { id: 4, name: "Shadow Warrior", description: "Melee Specialist", price: 300, currency: 'gems', image: "/images/char.png" },
    { id: 5, name: "Mystic Mage", description: "Magic Master", price: 500, currency: 'gems', image: "/images/char.png" },
    { id: 6, name: "Swift Archer", description: "Range Expert", price: 400, currency: 'gems', image: "/images/char.png" },
  ];

  const items: ShopItem[] = [
    { id: 7, name: "Health Potion", description: "Restore 50 HP", price: 100, currency: 'kino', image: "/images/potion1.png" },
    { id: 8, name: "Power Crystal", description: "+10 Attack", price: 50, currency: 'gems', image: "/images/item.png" },
    { id: 9, name: "Speed Boots", description: "+15% Movement", price: 200, currency: 'kino', image: "/images/item.png" },
  ];

  const getCurrentItems = () => {
    switch (category) {
      case 'gems': return gemPacks;
      case 'characters': return characters;
      case 'items': return items;
      default: return gemPacks;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      {/* Ensure this flex container itself doesn't get squeezed too much by its parent if it's also in a flex layout */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-6"> {/* Adjusted gap and added justify-center for better appearance if space allows */}
        <button
          onClick={() => setCategory('gems')}
          className={`
            px-3 py-1.5 text-xs 
            sm:px-4 sm:py-2 sm:text-sm 
            md:px-6 md:py-3 md:text-base 
            rounded-lg transition-all duration-300 
            ${category === 'gems'
              ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
              : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          Gem Packs
        </button>
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

      {/* Shop Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 pr-1">
        {getCurrentItems().map((item) => (
          <div key={item.id} className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4 hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <Image
                src={item.image}
                alt={item.name}
                width={64} // Set appropriate width
                height={64} // Set appropriate height
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-bold text-[#d3af37] mb-2">{item.name}</h3>
            <p className="text-gray-400 mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-[#d3af37] font-bold">
                {item.price} {item.currency === 'gems' ? '💎' : 'kino'}
              </span>
              <button className="px-4 py-2 bg-gradient-to-r from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] rounded-lg text-black font-semibold transition-all duration-300 hover:shadow-[0_0_10px_rgba(211,175,55,0.3)]">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}