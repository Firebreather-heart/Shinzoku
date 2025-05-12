"use client";

import { useState } from "react";
import Image from "next/image";
import Shop from "./Shop";
import Inventory from "./Inventory";
import BattleSystem from "./BattleSystem";

export default function GameInterface() {
  const [activeTab, setActiveTab] = useState<
    "home" | "inventory" | "shop" | "battle"
  >("home");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-6">
      {/* Top Section - User HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-[#121826] p-4 rounded-lg shadow-lg border border-[#3b82f6]">
        {/* Avatar & Rank */}
        <div className="flex items-center">
          <Image
            src="/images/avatar.png"
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="ml-3">
            <h2 className="text-lg font-bold text-[#3b82f6]">Warrior_001</h2>
            <p className="text-gray-400">
              Rank: <span className="text-yellow-500">Bronze</span>
            </p>
          </div>
        </div>

        {/* Resources */}
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-[#3b82f6] font-bold">$Kino</p>
            <p className="text-lg font-semibold">3,000</p>
          </div>
          <div className="text-center">
            <p className="text-[#3b82f6] font-bold">Gems</p>
            <p className="text-lg font-semibold">10</p>
          </div>
        </div>
      </div>

      {/* Game Content Section */}
      <div className="w-full max-w-4xl mt-8 p-6 bg-[#121826] rounded-xl shadow-lg border border-[#3b82f6] text-center">
        {activeTab === "home" && (
          <div>
            <h2 className="text-2xl font-bold text-[#3b82f6]">
              Welcome to the Battle Arena
            </h2>
            <p className="mt-2 text-gray-400">
              Prepare your warriors and claim your rewards.
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <button
                className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-lg rounded-lg"
                onClick={() => setActiveTab("inventory")}
              >
                View Inventory
              </button>
              <button
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-lg rounded-lg"
                onClick={() => setActiveTab("battle")}
              >
                Battle Now
              </button>
            </div>
          </div>
        )}

        {activeTab === "inventory" && <Inventory setActiveTab={setActiveTab} />}

        {activeTab === "shop" && <Shop setActiveTab={setActiveTab}/>}

        {activeTab === "battle" && <BattleSystem />}
      </div>
    </div>
  );
}