"use client";

import { useState } from "react";
import Image from "next/image";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const gameIntroSlides = [
    "In a distant future, a war-torn land seeks heroes to restore balance...",
    "Ancient warriors awaken to fight for control of mystical gemstones...",
    "Your journey begins now. Will you rise as a legend?",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-6">
      <div className="bg-[#121826] shadow-2xl rounded-2xl p-8 w-full max-w-md text-center border border-[#3b82f6]">
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#3b82f6]">
              Enter Your Name
            </h2>
            <input
              type="text"
              className="mt-4 p-3 w-full bg-[#1e293b] border border-[#3b82f6] rounded-md text-center text-white focus:outline-none"
              placeholder="Choose a unique name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button
              className={`mt-6 px-6 py-2 text-lg rounded-lg ${
                playerName.trim()
                  ? "bg-[#3b82f6] hover:bg-[#2563eb]"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              onClick={() => playerName.trim() && setStep(1)}
              disabled={!playerName.trim()}
            >
              Continue
            </button>
          </div>
        )}

        {step > 0 && step <= gameIntroSlides.length && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold">
              {gameIntroSlides[step - 1]}
            </h2>
            <button
              className="mt-6 px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-lg rounded-lg"
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          </div>
        )}

        {step > gameIntroSlides.length && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[#3b82f6]">
              Welcome, {playerName}!
            </h2>
            <p className="mt-2 text-gray-400">Your adventure starts now.</p>
            <Image
              src="/images/start-game.png"
              alt="Game Start"
              width={200}
              height={200}
              className="mx-auto my-4"
            />
            <button
              className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-lg rounded-lg"
              onClick={onComplete}
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
