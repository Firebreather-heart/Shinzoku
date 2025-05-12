"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  text: string;
  image: string;
}

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const gameIntroSlides: Slide[] = [
    {
      text: "In the days of old, the world thrived, life thrived and powerful creatures were born, then it happened, a great invasion the likes of which the world had never seen before...",
      image: "/images/slide1.jpg",
    },
    {
      text: "A new world formed, with it the era of men, with new kyo, they fought, bled and amassed treasures ...",
      image: "/images/slide2.jpg",
    },
    {
      text: "In the midst of this chaos, powers from beyond this world set their gaze once more upon this world, while the celestial mandate increased in strength",
      image: "/images/slide3.jpg",
    },
    {
      text: "You are a chosen one, with a unique and potent kyo, you have the power to change the world, to bring peace or destruction, the choice is yours...",
      image: "/images/slide4.jpg",
    },
    {
      text: "Every battle is a piece of the puzzle, fight, bleed, grow your purse and army, and become the strongest in the world...",
      image: "/images/slide5.jpg",
    },
  ];

  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-6 overflow-hidden">
      <div className="w-full max-w-md text-center 
                      bg-transparent lg:bg-[#121826] lg:shadow-2xl lg:rounded-2xl lg:p-8 lg:border lg:border-[#d3af37]">
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#f5f5dc]">
              Enter Your Name
            </h2>
            <input
              type="text"
              className="mt-4 p-3 w-full bg-[#1e293b] border border-[#d3af37] rounded-md text-center text-white focus:outline-none"
              placeholder="Choose a unique name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button
              className={`mt-6 px-6 py-2 text-lg rounded-lg ${
                playerName.trim()
                  ? "bg-[#b87333] hover:bg-[#cd7f32]"
                  : "bg-[#b87333] cursor-not-allowed"
              }`}
              onClick={() => playerName.trim() && setStep(1)}
              disabled={!playerName.trim()}
            >
              Continue
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step > 0 && step <= gameIntroSlides.length && (
            <motion.div
              key={`slide-${step}`}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="animate-fade-in"
            >
              {/* Image container */}
              <div className="relative mb-4 mx-auto">
                <Image
                  src={gameIntroSlides[step - 1].image}
                  alt={`Slide ${step}`}
                  width={300}
                  height={200}
                  className="rounded-md shadow-md w-full filter brightness-75 mx-auto"
                />
              </div>
              {/* Text container below the image */}
              <div className="px-4 py-2">
                <h2 className="text-xl font-semibold">
                  {gameIntroSlides[step - 1].text}
                </h2>
              </div>
              <button
                className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-[#b87333] hover:bg-[#cd7f32] text-white text-lg rounded-lg shadow-lg transition-all duration-300"
                onClick={() => setStep(step + 1)}
              >
                Next
                <svg
                  className="w-5 h-5 transform rotate-45"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 12l20-10v20L2 12z" />
                </svg>
              </button>
            </motion.div>
          )}

          {step > gameIntroSlides.length && (
            <motion.div
              key="welcome-slide"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="animate-fade-in"
            >
              <h2 className="text-3xl font-bold text-[#d3af37]">
                Welcome, {playerName}!
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Prepare yourself for an epic adventure in the realm of Shinzoku.
              </p>
              {/* Removed the start-game image */}
              <button
                className="mt-8 px-8 py-3 bg-gradient-to-r from-[#b87333] to-[#cd7f32] hover:from-[#cd7f32] hover:to-[#b87333] text-2xl font-bold rounded-full shadow-xl transition-all duration-300"
                onClick={onComplete}
              >
                Start Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}