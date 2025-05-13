"use client";

import { useState } from "react";
import { IconArrowLeft, IconCoin } from "@tabler/icons-react";
import AnimatedHeartLogo from "./AnimatedLogo";
import CampaignMode from "./campaign/CampaignMode";

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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      {/* Header */}
      <div className="w-full h-24 md:h-28 lg:h-32 bg-[#1a0e05] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d3af37]/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/images/header-pattern.png')] opacity-10"></div>
        <div className="h-full w-full max-w-[1200px] mx-auto px-6 flex justify-between items-center relative">
          {/* Left side - Player info */}
          <div className="flex items-center gap-6">
            {!isHomeScreen && (
              <button onClick={handleBack} className="hover:opacity-80 transition-opacity">
                <IconArrowLeft size={28} className="text-[#d3af37]" />
              </button>
            )}
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold text-[#d3af37] text-shadow-game">{playerName}</h2>
              <span className="text-[#d3af37] text-lg md:text-xl opacity-90">{playerRank}</span>
            </div>
          </div>

          {/* Right side - Currency */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <IconCoin
                size={28}
                className="text-[#d3af37] animate-[spin_4s_linear_infinite]"
                style={{ transform: "rotateY(45deg)" }}
              />
              <span className="text-white text-xl md:text-2xl font-semibold">{kino}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl md:text-4xl">💎</span>
              <span className="text-white text-xl md:text-2xl font-semibold">{gems}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="fixed bottom-8 w-full flex justify-between items-center px-8 z-50">
        {/* Left side - Gift box */}
        <div className={`${!isHomeScreen ? 'invisible' : ''} w-24`}>
          {isHomeScreen && (
            <div className="relative">
              <button className="p-2 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(211,175,55,0.6)] active:scale-95">
                <img src="/images/icon1.png" alt="Gift Box" className="w-20 h-20 transform hover:rotate-3 transition-transform" />
              </button>
              <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                1
              </div>
            </div>
          )}
        </div>

        <div className="w-24"></div>

        {/* Right side - Mailbox */}
        <div className={`${!isHomeScreen ? 'invisible' : ''} w-24`}>
          {isHomeScreen && (
            <div className="relative">
              <button className="p-2 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(211,175,55,0.6)] active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-[#d3af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] w-full py-8 px-5 pb-32">
          {activeTab === "home" && (
            <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto">
              <div className="transform scale-90 sm:scale-100 lg:scale-110 mb-8">
                <AnimatedHeartLogo />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d3af37] mb-8 text-shadow-game">
                Choose Your Path
              </h1>

              <div className="grid gap-6 lg:gap-8 w-full sm:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto">
                <button
                  className="w-full p-6 bg-gradient-to-br from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] 
                  rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden group"
                  onClick={() => setActiveTab("story")}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent glint-animation"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2 text-shadow-light">Story Mode</h3>
                  {/* <p className="text-[#121826] text-lg">Uncover the ancient mysteries of Shinzoku</p> */}
                </button>
                <button
                  className="w-full p-6 bg-gradient-to-br from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] 
                  rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden group"
                  onClick={() => setActiveTab("campaign")}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent glint-animation"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2 text-shadow-light">Campaign</h3>
                  {/* <p className="text-[#121826]">Conquer territories and build your empire</p> */}
                </button>
                <button
                  className="w-full p-6 bg-gradient-to-br from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] 
                  rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden group"
                  onClick={() => setActiveTab("challenge")}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent glint-animation"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2 text-shadow-light">Challenge Mode</h3>
                  {/* <p className="text-[#121826]">Test your skills in epic battles</p> */}
                </button>
              </div>
            </div>
          )}

          {activeTab !== "home" && (
            <div className="w-full max-w-[1200px] mx-auto bg-gradient-to-b from-[#1a0e05] to-[#121826] p-6 lg:p-12 rounded-xl shadow-[0_0_15px_rgba(211,175,55,0.1)]">
              {activeTab === "story" && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-[#d3af37] mb-4">Coming Soon!</h2>
                  <p className="text-xl text-gray-400 mb-6">Story Mode is currently under development.</p>
                  <button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-lg rounded-lg"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                </div>
              )}

              {activeTab === "challenge" && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-[#d3af37] mb-4">Coming Soon!</h2>
                  <p className="text-xl text-gray-400 mb-6">Challenge Mode is currently under development.</p>
                  <button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-lg rounded-lg"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                </div>
              )}

              {activeTab === "campaign" && (
                <CampaignMode />
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
    </div>
  );
}