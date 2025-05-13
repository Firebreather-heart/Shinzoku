import { useState } from 'react';
import InventoryPanel from './campaign/InventoryPanel';
import ShopPanel from './campaign/ShopPanel';
import GameWorldPanel from './campaign/GameWorldPanel';

export default function CampaignMode() {
  const [activePanel, setActivePanel] = useState<'world' | 'inventory' | 'shop'>('world');

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActivePanel('world')}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${activePanel === 'world'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          World
        </button>
        <button
          onClick={() => setActivePanel('inventory')}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${activePanel === 'inventory'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActivePanel('shop')}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${activePanel === 'shop'
            ? 'bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold'
            : 'bg-black/30 text-[#d3af37] hover:bg-[#d3af37]/20 backdrop-blur-sm'
            }`}
        >
          Shop
        </button>
      </div>

      <div className="flex-1">
        {activePanel === 'world' && <GameWorldPanel />}
        {activePanel === 'inventory' && <InventoryPanel />}
        {activePanel === 'shop' && <ShopPanel />}
      </div>
    </div>
  )
}