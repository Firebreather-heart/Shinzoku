"use client";

import { useState, useRef, useEffect } from "react"; // Added useRef and useEffect
import { IconArrowLeft, IconCoin } from "@tabler/icons-react";
import AnimatedHeartLogo from "./AnimatedLogo";
import CampaignMode from "./campaign/CampaignMode";
import Shop from './Shop';
import BattleSystem from './BattleSystem';

// Helper function to format currency values
const formatCurrencyValue = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  if (isNaN(num)) {
    return String(value); // Return original if not a valid number
  }

  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    const kValue = (num / 1000);
    return (kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)) + 'K';
  } else if (num < 1000000000) {
    const mValue = (num / 1000000);
    return (mValue % 1 === 0 ? mValue.toFixed(0) : mValue.toFixed(1)) + 'M';
  } else {
    const bValue = (num / 1000000000);
    return (bValue % 1 === 0 ? bValue.toFixed(0) : bValue.toFixed(1)) + 'B';
  }
};

export default function GameInterface() {
  const [activeTab, setActiveTab] = useState<
    "home" | "inventory" | "shop" | "battle" | "story" | "campaign" | "challenge"
  >("home");

  const playerName = "Warrior_001"; // Original player name
  const playerRank = "Bronze";    // Original player rank
  const kino = "3,000";           // Original kino value (string)
  const gems = 10;                // Original gems value (number)

  const playerInitial = playerName.charAt(0).toUpperCase();
  const fullPlayerInfo = `${playerName} (${playerRank})`;

  const [tooltip, setTooltip] = useState<{ text: string; elementRect: DOMRect | null }>({ text: '', elementRect: null });
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShowTooltip = (fullText: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setTooltip({ text: fullText, elementRect: event.currentTarget.getBoundingClientRect() });
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltip({ text: '', elementRect: null });
    }, 3000); // Hide after 3 seconds
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);


  const handleBack = () => {
    setActiveTab("home");
  };

  const isHomeScreen = activeTab === "home";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      {/* Header */}
      <div className="w-full h-12 md:h-14 lg:h-16 relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="h-full w-full max-w-[1200px] mx-auto px-6 flex justify-between items-center relative">
          {/* Left side - Player info */}
          <div className="flex items-center gap-3 sm:gap-4"> {/* Adjusted gap */}
            {!isHomeScreen && (
              <button onClick={handleBack} className="p-1 hover:opacity-80 transition-opacity">
                <IconArrowLeft size={28} className="text-[#d3af37]" />
              </button>
            )}
            <div
              className="w-10 h-10 md:w-11 md:h-11 bg-[#d3af37]/25 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
              onClick={(e) => handleShowTooltip(fullPlayerInfo, e)}
              title={fullPlayerInfo} // Native tooltip for accessibility
            >
              <span className="text-lg md:text-xl font-bold text-[#d3af37]">
                {playerInitial}
              </span>
            </div>
          </div>

          {/* Right side - Currency */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8"> {/* Responsive gap */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => handleShowTooltip(`Kino: ${kino}`, e)}
              title={`Kino: ${kino}`}
            >
              <IconCoin
                size={24} // Slightly smaller for consistency
                className="text-[#d3af37] animate-[spin_4s_linear_infinite]"
                style={{ transform: "rotateY(45deg)" }}
              />
              <span className="text-white text-base sm:text-lg md:text-xl font-semibold">
                {formatCurrencyValue(kino)}
              </span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => handleShowTooltip(`Gems: ${gems}`, e)}
              title={`Gems: ${gems}`}
            >
              <span className="text-2xl md:text-3xl">💎</span> {/* Adjusted size slightly */}
              <span className="text-white text-base sm:text-lg md:text-xl font-semibold">
                {formatCurrencyValue(gems)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip Display */}
      {tooltip.elementRect && tooltip.text && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.elementRect.bottom + 8, // 8px below the element
            left: Math.min(
              Math.max(tooltip.elementRect.left + (tooltip.elementRect.width / 2), 75),
              window.innerWidth - 75
            ),
            transform: 'translateX(-50%)', // Adjust for centering
            maxWidth: '250px',
            minWidth: 'auto', // Let content define width
          }}
          className="bg-black/80 border border-[#d3af37]/50 text-white text-xs py-1 px-2.5 rounded-md shadow-lg z-[100] whitespace-nowrap"
        >
          {tooltip.text}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] w-full py-8  pb-32">
          {activeTab === "home" && (
            <div className="flex flex-col items-center w-full mx-auto">
              <div className="transform scale-90 sm:scale-100 lg:scale-110 mb-8">
                <AnimatedHeartLogo />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d3af37] mb-8 text-shadow-game">
                Choose Your Path
              </h1>

              <div className="grid gap-6 lg:gap-8 w-full lg:w-[70%] xl:w-[60%] mx-auto px-5">
                <button
                  className="w-full p-6 bg-gradient-to-br from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] 
                  rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden group"
                  onClick={() => setActiveTab("story")}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent glint-animation"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2 text-shadow-light">Story Mode</h3>
                </button>
                <button
                  className="w-full p-6 bg-gradient-to-br from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] 
                  rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden group"
                  onClick={() => setActiveTab("campaign")}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent glint-animation"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2 text-shadow-light">Campaign</h3>
                </button>
                <button
                  className="w-full p-6 bg-gradient-to-br from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] 
                  rounded-xl shadow-lg transition-all hover:scale-[1.02] relative overflow-hidden group"
                  onClick={() => setActiveTab("challenge")}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent glint-animation"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2 text-shadow-light">Challenge Mode</h3>
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
                <div className="w-full max-w-[1200px] mx-auto bg-gradient-to-b from-[#1a0e05] to-[#121826] rounded-xl shadow-[0_0_15px_rgba(211,175,55,0.1)] overflow-hidden">
                  <CampaignMode />
                </div>
              )}

              {activeTab === "inventory" && (
                // @ts-ignore TODO: fix type later
                <Inventory setActiveTab={setActiveTab} />
              )}

              {activeTab === "shop" && <Shop setActiveTab={setActiveTab} />}

              {activeTab === "battle" && <BattleSystem />}
            </div>
          )}
        </div>
      </div>
      {/* Bottom Navigation Buttons - No changes here, assuming they are fine */}
      <div className="fixed bottom-8 w-full flex justify-between items-center px-8 z-50">
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
    </div>
  );
}