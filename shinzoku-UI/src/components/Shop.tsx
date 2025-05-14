import { useState } from "react";
import ShopInterface from "./shop/ShopInterface";

interface ShopProps {
  setActiveTab: (tab: "shop" | "home" | "inventory" | "battle") => void; // Prop for changing the active tab
}

export default function Shop({ setActiveTab }: ShopProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f172a] to-[#1e293b] flex flex-col items-center text-white">
      <div className="w-full px-2 md:px-6 py-8">
        <div className="w-full flex justify-start items-center mb-6">
          <button
            className="bg-[#d3af37] text-black mb-[5px] py-[12px] px-[30px] rounded-lg hover:bg-[#b89b2d] transition-all"
            onClick={() => setActiveTab("home")}
          >
            Back
          </button>
        </div>

        {/* Integrate our new ShopInterface component */}
        <ShopInterface />
      </div>
    </div>
  );
}