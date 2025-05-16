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
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-gold-500 p-4">
      <div className="w-full max-w-[600px] bg-[#1a0e05] border border-[#d3af37] shadow-gold rounded-2xl p-6 md:p-8 text-center">
        {step === 0 && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#f5f5dc] mb-4">
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
              className={`mt-6 px-6 py-3 text-lg md:text-xl rounded-lg ${playerName.trim()
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
                  width={400}
                  height={300}
                  className="rounded-md shadow-md w-full filter brightness-75 mx-auto"
                />
              </div>
              {/* Text container below the image */}
              <div className="px-4 py-2">
                <h2 className="text-xl md:text-2xl font-semibold">
                  {gameIntroSlides[step - 1].text}
                </h2>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-base bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg shadow-lg transition-all duration-300"
                  onClick={() => setStep(gameIntroSlides.length + 1)}
                >
                  Skip
                </button>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 text-lg md:text-xl bg-[#b87333] hover:bg-[#cd7f32] text-white rounded-lg shadow-lg transition-all duration-300"
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
              </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#d3af37]">
                Welcome, {playerName}!
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-400">Your adventure starts now.</p>
              <button
                className="mt-8 px-8 py-4 text-2xl md:text-xl bg-gradient-to-r from-[#b87333] to-[#cd7f32] hover:from-[#cd7f32] hover:to-[#b87333] rounded-lg shadow-xl transition-all duration-300"
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