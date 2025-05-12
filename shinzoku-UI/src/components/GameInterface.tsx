"use client";

import { useState } from "react";
import Image from "next/image";
import Shop from "./Shop";
import Inventory from "./Inventory";
import BattleSystem from "./BattleSystem";
import { IconArrowLeft } from "@tabler/icons-react";
import AnimatedHeartLogo from "./AnimatedLogo";

export default function GameInterface() {
  const [activeTab, setActiveTab] = useState<
    "home" | "inventory" | "shop" | "battle" | "story" | "campaign" | "challenge"
  >("home");

  const playerName = "Warrior_001";
  const playerRank = "Bronze";
  const kino = "3,000";
  const gems = 10;

  const handleBack = () => {
    setActiveTab("home");
  };

  const isHomeScreen = activeTab === "home";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      {/* Taller Header with adjusted layout */}
      <div className="w-full h-24 bg-gradient-to-r from-[#121826] to-[#1a2435] shadow-xl">
        <div className="h-full max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {!isHomeScreen && (
              <button onClick={handleBack} className="hover:opacity-80 transition-opacity">
                <IconArrowLeft size={24} className="text-[#d3af37]" />
              </button>
            )}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-[#d3af37]">{playerName}</h2>
              <span className="text-[#d3af37] text-sm opacity-90">{playerRank}</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[#d3af37] font-semibold">$Kino:</span>
              <span className="text-white text-lg">{kino}</span>
            </div>
            <div className="flex flex-col items-center mt-4">
              <span className="text-[#d3af37] text-xl">💎</span>
              <span className="text-white text-lg">{gems}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Main Content with Logo */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
        {activeTab === "home" && (
          <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4">
            <div className="mb-8">
              <AnimatedHeartLogo />
            </div>
            <h1 className="text-3xl font-bold text-[#d3af37] mb-8">
              Choose Your Path
            </h1>
            <div className="grid gap-6 w-full max-w-xl">
              <button
                className="w-full p-6 bg-[#121826] hover:bg-[#1a2435] rounded-xl border-2 border-[#d3af37] transition-all hover:scale-[1.02]"
                onClick={() => setActiveTab("story")}
              >
                <h3 className="text-2xl font-bold text-[#d3af37] mb-2">Story Mode</h3>
                <p className="text-gray-400">Uncover the ancient mysteries of Shinzoku</p>
              </button>
              <button
                className="w-full p-6 bg-[#121826] hover:bg-[#1a2435] rounded-xl border-2 border-[#d3af37] transition-all hover:scale-[1.02]"
                onClick={() => setActiveTab("campaign")}
              >
                <h3 className="text-2xl font-bold text-[#d3af37] mb-2">Campaign</h3>
                <p className="text-gray-400">Conquer territories and build your empire</p>
              </button>
              <button
                className="w-full p-6 bg-[#121826] hover:bg-[#1a2435] rounded-xl border-2 border-[#d3af37] transition-all hover:scale-[1.02]"
                onClick={() => setActiveTab("challenge")}
              >
                <h3 className="text-2xl font-bold text-[#d3af37] mb-2">Challenge Mode</h3>
                <p className="text-gray-400">Test your skills in epic battles</p>
              </button>
            </div>
          </div>
        )}

        {/* Other mode content */}
        {activeTab !== "home" && (
          <div className="bg-[#121826] rounded-xl border-2 border-[#d3af37] p-8">
            {activeTab === "story" && (
              <div>
                <h2 className="text-2xl font-bold text-[#3b82f6]">
                  Story Mode
                </h2>
                <p className="mt-2 text-gray-400">
                  Immerse yourself in a captivating narrative and unravel ancient mysteries.
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-lg rounded-lg shadow-lg"
                    onClick={() => setActiveTab("battle")}
                  >
                    Enter Battle
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-lg rounded-lg"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {activeTab === "campaign" && (
              <div>
                <h2 className="text-2xl font-bold text-[#3b82f6]">
                  Campaign Mode
                </h2>
                <p className="mt-2 text-gray-400">
                  Engage in epic campaigns to conquer territories and unlock rewards.
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-lg rounded-lg shadow-lg"
                    onClick={() => setActiveTab("battle")}
                  >
                    Enter Battle
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-lg rounded-lg"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {activeTab === "challenge" && (
              <div>
                <h2 className="text-2xl font-bold text-[#3b82f6]">
                  Challenge Mode
                </h2>
                <p className="mt-2 text-gray-400">
                  Test your skills in timed challenges and unique puzzles.
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-lg rounded-lg shadow-lg"
                    onClick={() => setActiveTab("battle")}
                  >
                    Enter Battle
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-lg rounded-lg"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {activeTab === "inventory" && (
              <Inventory setActiveTab={setActiveTab} />
            )}

            {activeTab === "shop" && <Shop setActiveTab={setActiveTab} />}

            {activeTab === "battle" && <BattleSystem />}
          </div>
        )}
      </div>
    </div>
  );
}