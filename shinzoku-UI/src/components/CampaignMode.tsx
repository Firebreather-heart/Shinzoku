import { useState } from 'react';
import InventoryPanel from './campaign/InventoryPanel';
import ShopPanel from './campaign/ShopPanel';
import GameWorldPanel from './campaign/GameWorldPanel';

export default function CampaignMode() {
  const [activePanel, setActivePanel] = useState<'world' | 'inventory' | 'shop'>('world');

  return (
    <div className="flex flex-col h-full w-full relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-[#1a0e05] before:h-24 before:opacity-60 after:absolute after:inset-x-0 after:bottom-0 after:bg-gradient-to-b after:from-transparent after:to-[#121826] after:h-24 after:opacity-60">
      {/* Nav tabs with blurred background for better readability against gradient */}
      <div className="flex gap-4 mb-6 sm:flex-row gap-4 w-full overflow-x-auto relative z-10 px-2 py-1">
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

      {/* Content panel with relative positioning to appear above the gradient overlays */}
      <div className="flex-1 relative z-10">
        {activePanel === 'world' && <GameWorldPanel />}
        {activePanel === 'inventory' && <InventoryPanel isOpen={activePanel === 'inventory'} />}
        {activePanel === 'shop' && <ShopPanel />}
      </div>
    </div>
  )
}