import { useState } from 'react';
import InventoryPanel from './campaign/InventoryPanel';
import ShopPanel from './campaign/ShopPanel';
import GameWorldPanel from './campaign/GameWorldPanel';

export default function CampaignMode() {
  const [activePanel, setActivePanel] = useState<'world' | 'inventory' | 'shop'>('world');

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActivePanel('world')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${activePanel === 'world'
              ? 'bg-[#d3af37] text-black font-bold'
              : 'bg-[#1a0e05] text-[#d3af37] hover:bg-[#d3af37]/20'
            }`}
        >
          World
        </button>
        <button
          onClick={() => setActivePanel('inventory')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${activePanel === 'inventory'
              ? 'bg-[#d3af37] text-black font-bold'
              : 'bg-[#1a0e05] text-[#d3af37] hover:bg-[#d3af37]/20'
            }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActivePanel('shop')}
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${activePanel === 'shop'
              ? 'bg-[#d3af37] text-black font-bold'
              : 'bg-[#1a0e05] text-[#d3af37] hover:bg-[#d3af37]/20'
            }`}
        >
          Shop
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1">
        {activePanel === 'world' && <GameWorldPanel />}
        {activePanel === 'inventory' && <InventoryPanel />}
        {activePanel === 'shop' && <ShopPanel />}
      </div>
    </div>
  );