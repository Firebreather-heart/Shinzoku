import { useState, useEffect, useRef } from 'react';
import { BattleSimulator, BattleEntity, BattleActionLog, BattleResult } from '@/services/BattleSimulator';
import BattleVisualizer from './BattleVisualizer';
import { CharacterModel } from '@/types/CharacterModel';

interface BattleScreenProps {
  characters: CharacterModel[];
  enemies: any[];
  onComplete: (result: BattleResult) => void;
  onCancel: () => void;
}

export default function BattleScreen({
  characters,
  enemies,
  onComplete,
  onCancel
}: BattleScreenProps) {
  const [battleState, setBattleState] = useState<'preparing' | 'in-progress' | 'completed'>('preparing');
  const [playerTeam, setPlayerTeam] = useState<BattleEntity[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<BattleEntity[]>([]);
  const [actionLogs, setActionLogs] = useState<BattleActionLog[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1000); // ms between moves

  const battleSimulator = useRef<BattleSimulator>(new BattleSimulator());
  const autoSimulationRef = useRef<NodeJS.Timeout | null>(null);

  const gridSize = { width: 15, height: 10 };

  // Initialize battle
  useEffect(() => {
    if (battleState === 'preparing') {
      try {
        battleSimulator.current.initializeBattle(characters, enemies);
        setPlayerTeam(battleSimulator.current.getPlayerTeam());
        setEnemyTeam(battleSimulator.current.getEnemyTeam());
        setActionLogs(battleSimulator.current.getBattleLog());
        setCurrentTurn(battleSimulator.current.getCurrentTurn());
        setBattleState('in-progress');
      } catch (error) {
        console.error("Failed to initialize battle:", error);
      }
    }

    // Cleanup function
    return () => {
      if (autoSimulationRef.current) {
        clearInterval(autoSimulationRef.current);
      }
    };
  }, [characters, enemies, battleState]);

  // Advance the battle by one step
  const simulateNextStep = () => {
    if (battleSimulator.current.getBattleState() === 'in-progress') {
      battleSimulator.current.simulateNextRound();
      setPlayerTeam([...battleSimulator.current.getPlayerTeam()]);
      setEnemyTeam([...battleSimulator.current.getEnemyTeam()]);
      setActionLogs([...battleSimulator.current.getBattleLog()]);
      setCurrentTurn(battleSimulator.current.getCurrentTurn());

      // Check if battle is complete
      if (battleSimulator.current.getBattleState() === 'completed') {
        const battleResult = battleSimulator.current.getBattleResult();
        setResult(battleResult);
        setBattleState('completed');
        setIsAutoSimulating(false);
        if (autoSimulationRef.current) {
          clearInterval(autoSimulationRef.current);
          autoSimulationRef.current = null;
        }
      }
    }
  };

  // Toggle auto simulation
  const toggleAutoSimulation = () => {
    if (isAutoSimulating) {
      if (autoSimulationRef.current) {
        clearInterval(autoSimulationRef.current);
        autoSimulationRef.current = null;
      }
      setIsAutoSimulating(false);
    } else {
      autoSimulationRef.current = setInterval(() => {
        simulateNextStep();
      }, simulationSpeed);
      setIsAutoSimulating(true);
    }
  };

  // Change simulation speed
  const handleSpeedChange = (speed: number) => {
    setSimulationSpeed(speed);
    if (isAutoSimulating && autoSimulationRef.current) {
      clearInterval(autoSimulationRef.current);
      autoSimulationRef.current = setInterval(() => {
        simulateNextStep();
      }, speed);
    }
  };

  // Complete the battle and return to the game
  const handleComplete = () => {
    if (result) {
      onComplete(result);
    } else if (battleSimulator.current.getBattleState() === 'completed') {
      const battleResult = battleSimulator.current.getBattleResult();
      onComplete(battleResult || {
        winner: 'player',
        turns: currentTurn,
        remainingPlayerEntities: playerTeam.filter(e => !e.isDead),
        remainingEnemyEntities: enemyTeam.filter(e => !e.isDead),
        playerDefeated: playerTeam.filter(e => e.isDead),
        enemyDefeated: enemyTeam.filter(e => e.isDead),
        logs: actionLogs
      });
    } else {
      onCancel();
    }
  };

  // Render battle result message
  const renderResultMessage = () => {
    if (!result) return null;

    return (
      <div className={`text-center p-6 ${result.winner === 'player'
          ? 'bg-gradient-to-br from-[#2c5282]/70 to-[#1a365d]/70 border border-blue-500/50'
          : 'bg-gradient-to-br from-[#822727]/70 to-[#5d1a1a]/70 border border-red-500/50'
        } rounded-lg shadow-lg mb-4`}>
        <h2 className="text-2xl font-bold mb-2">
          {result.winner === 'player' ? 'Victory!' : 'Defeat!'}
        </h2>
        <p className="mb-4">
          Battle completed in {result.turns} turns.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-blue-400 font-semibold mb-2">Your Team</h3>
            <p className="text-sm">
              {result.remainingPlayerEntities.length} survived<br />
              {result.playerDefeated.length} defeated
            </p>
          </div>
          <div>
            <h3 className="text-red-400 font-semibold mb-2">Enemy Team</h3>
            <p className="text-sm">
              {result.remainingEnemyEntities.length} survived<br />
              {result.enemyDefeated.length} defeated
            </p>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="px-6 py-3 bg-[#d3af37] hover:bg-[#c2a030] text-black font-bold rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#d3af37]">Battle Simulation</h2>
        <div className="flex items-center space-x-4">
          {/* Speed controls */}
          {battleState === 'in-progress' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Speed:</span>
              <button
                className={`px-2 py-1 rounded text-xs ${simulationSpeed === 2000 ? 'bg-[#d3af37] text-black' : 'bg-gray-700'}`}
                onClick={() => handleSpeedChange(2000)}
              >
                0.5x
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${simulationSpeed === 1000 ? 'bg-[#d3af37] text-black' : 'bg-gray-700'}`}
                onClick={() => handleSpeedChange(1000)}
              >
                1x
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${simulationSpeed === 500 ? 'bg-[#d3af37] text-black' : 'bg-gray-700'}`}
                onClick={() => handleSpeedChange(500)}
              >
                2x
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${simulationSpeed === 250 ? 'bg-[#d3af37] text-black' : 'bg-gray-700'}`}
                onClick={() => handleSpeedChange(250)}
              >
                4x
              </button>
            </div>
          )}

          {/* Action buttons */}
          {battleState === 'in-progress' ? (
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded"
                onClick={simulateNextStep}
                disabled={isAutoSimulating}
              >
                Next Step
              </button>
              <button
                className={`px-3 py-1 ${isAutoSimulating ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'} text-white rounded`}
                onClick={toggleAutoSimulation}
              >
                {isAutoSimulating ? 'Stop' : 'Auto'}
              </button>
            </div>
          ) : (
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Battle Result */}
      {battleState === 'completed' && renderResultMessage()}

      {/* Battle Visualizer */}
      <div className={`flex-1 ${battleState === 'completed' ? 'opacity-70' : ''}`}>
        <BattleVisualizer
          playerTeam={playerTeam}
          enemyTeam={enemyTeam}
          actionLogs={actionLogs}
          gridSize={gridSize}
          currentTurn={currentTurn}
        />
      </div>
    </div>
  );
}