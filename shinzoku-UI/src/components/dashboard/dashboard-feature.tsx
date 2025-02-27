'use client'

import { useState, useEffect, useRef } from "react";
import AnimatedHeartLogo from "@/components/AnimatedLogo";
import { WalletButton } from "../solana/solana-provider";

const playlist = [
  "/audio/spinandburst.mp3",
]

export default function DashboardFeature() {
  const [started, setStarted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(playlist[0]);
    audio.loop = false;
    audio.volume = 0.5;
    audio.preload = "auto";

    audio.addEventListener("canplaythrough", () => {
    setAudioReady(true);
    });
    
    const playNextTrack = () => { 
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(nextIndex);
      audio.src = playlist[nextIndex];
      audio.play().catch((err) => console.error("Audio playback failed:", err));
    }

    audio.addEventListener("ended", playNextTrack);
    

    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else  {
        audio.play().catch(err => console.error("Audio playback failed:", err));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    audio.addEventListener("error", (e) => {
      console.error("Audio failed to load:", e);
      setAudioReady(true);
    });
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("ended", playNextTrack);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
    };
  }, []);

  const handleStart = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) =>
        console.error("Fullscreen request failed:", err)
      );
    }
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch((err) =>
        console.error("Audio playback failed:", err)
      );
    }
  };

  if (!started) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        {!audioReady ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-red-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Loading resources...</p>
          </div>
        ) : (
          <button 
            onClick={handleStart}
            className="px-6 py-3 text-3xl font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
          >
            Start Game
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6 bg-black">
      <h1 className="text-5xl font-bold text-red-500 animate-pulse">
        Shinzoku
      </h1>
      
      <AnimatedHeartLogo />
      <WalletButton />
    </div>
  );
}