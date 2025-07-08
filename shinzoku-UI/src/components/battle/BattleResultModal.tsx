import React from 'react';
import { IconCoins, IconTrophy, IconSkull, IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import { BattleResult } from "@/services/BattleSimulator";

interface BattleResultModalProps {
  result: BattleResult;
  onClose: () => void;
  onRestart: () => void;
}

const BattleResultModal: React.FC<BattleResultModalProps> = ({ result, onClose, onRestart }) => {
  const isPlayerWin = result.winner === 'player';

  // Calculate rewards (would normally come from backend)
  const expReward = 250;
  const goldReward = 500;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-[#d3af37]/50 rounded-xl max-w-lg w-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`p-6 ${isPlayerWin ? 'bg-[#d3af37]/20' : 'bg-red-900/20'} text-center relative`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 opacity-40"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-3">
              {isPlayerWin ? (
                <div className="w-20 h-20 bg-[#d3af37]/30 rounded-full flex items-center justify-center">
                  <IconTrophy className="text-[#d3af37]" size={42} stroke={1.5} />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center">
                  <IconSkull className="text-red-400" size={42} stroke={1.5} />
                </div>
              )}
            </div>
            <h2 className={`text-3xl font-bold ${isPlayerWin ? 'text-[#d3af37]' : 'text-red-400'} mb-1`}>
              {isPlayerWin ? 'Victory!' : 'Defeat!'}
            </h2>
            <p className="text-gray-300">
              {isPlayerWin
                ? `You've successfully defeated all enemies in ${result.turns} turns!`
                : `Your team was defeated after ${result.turns} turns.`}
            </p>
          </div>
        </div>

        {/* Battle stats */}
        <div className="p-6 border-b border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-[#d3af37] font-medium mb-2">Your Team</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Survivors:</span>
                  <span>{result.remainingPlayerEntities.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Casualties:</span>
                  <span>{result.playerDefeated.length}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-red-400 font-medium mb-2">Enemy Team</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Survivors:</span>
                  <span>{result.remainingEnemyEntities.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Defeated:</span>
                  <span>{result.enemyDefeated.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        {isPlayerWin && (
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-[#d3af37] font-medium mb-3">Rewards</h3>
            <div className="bg-[#d3af37]/10 rounded-lg p-3 mb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-900/40 rounded-full flex items-center justify-center text-blue-300">
                    XP
                  </div>
                  <span className="font-medium">Experience</span>
                </div>
                <span className="text-[#d3af37] font-bold">+{expReward}</span>
              </div>
            </div>

            <div className="bg-[#d3af37]/10 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-900/40 rounded-full flex items-center justify-center text-yellow-300">
                    <IconCoins size={18} />
                  </div>
                  <span className="font-medium">Kino</span>
                </div>
                <span className="text-[#d3af37] font-bold">+{goldReward}</span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Close
          </button>

          <button
            onClick={onRestart}
            className="flex-1 py-3 bg-[#d3af37] hover:bg-[#c2a030] text-black font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Battle Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleResultModal;