import React, { useState, useEffect } from 'react';
import { BattleSimulator, BattleState, BattleEntity, BattleActionLog, DifficultyLevel } from '../../services/BattleSimulator';
import { characterToBattleEntity, demonToBattleEntity } from '../../utils/battleAdapters';
import BattleLog from './BattleLog';
import BattleResultModal from './BattleResultModal';

interface AutoBattleSystemProps {
  playerCharacters: any[];
  enemies: any[];
  onBattleComplete?: (result: { victory: boolean; logs: BattleActionLog[] }) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  gridSize?: { width: number; height: number };
  autoStart?: boolean;
}

const AutoBattleSystem: React.FC<AutoBattleSystemProps> = ({
  playerCharacters,
  enemies,
  onBattleComplete,
  difficulty = 'medium',
  gridSize = { width: 8, height: 8 },
  autoStart = false
}) => {
  const [simulator, setSimulator] = useState<BattleSimulator | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [showResult, setShowResult] = useState(false);
  const [battleComplete, setBattleComplete] = useState(false);

  // Initialize the battle simulator when components mounts
  useEffect(() => {
    initializeBattle();
  }, [playerCharacters, enemies, difficulty, gridSize]);

  // Auto-start battle if specified
  useEffect(() => {
    if (autoStart && simulator && !isSimulating && !battleState?.isCompleted) {
      startBattleSimulation();
    }
  }, [autoStart, simulator]);

  const initializeBattle = () => {
    // Convert characters and enemies to battle entities
    const playerTeam: BattleEntity[] = playerCharacters.map((char, index) =>
      characterToBattleEntity(char)
    );

    const enemyTeam: BattleEntity[] = enemies.map((enemy, index) =>
      demonToBattleEntity(enemy)
    );

    // Create a new simulator instance
    const newSimulator = new BattleSimulator(
      playerTeam,
      enemyTeam,
      gridSize.width,
      gridSize.height,
      difficulty as DifficultyLevel
    );

    setSimulator(newSimulator);
    setBattleState(newSimulator.getCurrentState());
    setCurrentTurn(1);
    setShowResult(false);
    setBattleComplete(false);
  };

  const simulateTurn = () => {
    if (!simulator || battleState?.isCompleted) return;

    const newState = simulator.simulateTurn();
    setBattleState(newState);
    setCurrentTurn(newState.turn);

    if (newState.isCompleted) {
      setIsSimulating(false);
      setBattleComplete(true);
      setShowResult(true);

      if (onBattleComplete) {
        onBattleComplete({
          victory: newState.result?.playerVictory || false,
          logs: newState.actionLogs
        });
      }
    }
  };

  const startBattleSimulation = () => {
    if (!simulator || battleState?.isCompleted) return;

    setIsSimulating(true);

    // Calculate delay based on simulation speed
    const delayMap = {
      'slow': 1000,
      'medium': 500,
      'fast': 200
    };

    const delay = delayMap[simulationSpeed];

    const intervalId = setInterval(() => {
      simulateTurn();

      if (battleState?.isCompleted) {
        clearInterval(intervalId);
        setIsSimulating(false);
      }
    }, delay);

    return () => clearInterval(intervalId);
  };

  const simulateEntireBattle = () => {
    if (!simulator || battleState?.isCompleted) return;

    const finalState = simulator.simulateEntireMatch();
    setBattleState(finalState);
    setCurrentTurn(finalState.turn);
    setBattleComplete(true);
    setShowResult(true);

    if (onBattleComplete) {
      onBattleComplete({
        victory: finalState.result?.playerVictory || false,
        logs: finalState.actionLogs
      });
    }
  };

  const restartBattle = () => {
    initializeBattle();
  };

  const changeSimulationSpeed = (speed: 'slow' | 'medium' | 'fast') => {
    setSimulationSpeed(speed);
  };

  // If battle state isn't loaded yet, show loading
  if (!battleState) {
    return <div className="flex items-center justify-center h-64">Loading battle...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Battle Teams Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-3">Your Team</h3>
          <div className="grid grid-cols-2 gap-3">
            {battleState.playerTeam.map(character => (
              <div key={character.id} className={`p-3 rounded-lg ${character.isDead ? 'bg-gray-100 opacity-50' : 'bg-white'}`}>
                <div className="font-medium">{character.name}</div>
                <div className="mt-1 text-sm">
                  <div className="flex justify-between mb-1">
                    <span>HP:</span>
                    <span className={character.hp < character.maxHp * 0.3 ? 'text-red-600' : ''}>{character.hp}/{character.maxHp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MP:</span>
                    <span>{character.mp}/{character.maxMp}</span>
                  </div>
                </div>
                {character.isDead && (
                  <div className="text-red-600 text-xs mt-1 font-medium">Defeated</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <h3 className="font-bold text-red-800 mb-3">Enemy Team</h3>
          <div className="grid grid-cols-2 gap-3">
            {battleState.enemyTeam.map(enemy => (
              <div key={enemy.id} className={`p-3 rounded-lg ${enemy.isDead ? 'bg-gray-100 opacity-50' : 'bg-white'}`}>
                <div className="font-medium">{enemy.name}</div>
                <div className="mt-1 text-sm">
                  <div className="flex justify-between mb-1">
                    <span>HP:</span>
                    <span className={enemy.hp < enemy.maxHp * 0.3 ? 'text-red-600' : ''}>{enemy.hp}/{enemy.maxHp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MP:</span>
                    <span>{enemy.mp}/{enemy.maxMp}</span>
                  </div>
                </div>
                {enemy.isDead && (
                  <div className="text-red-600 text-xs mt-1 font-medium">Defeated</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Controls */}
      <div className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg">
        <div className="text-lg font-bold">Turn: {currentTurn}</div>
        <div className="flex gap-2">
          <button
            onClick={simulateTurn}
            disabled={isSimulating || battleState.isCompleted}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next Turn
          </button>

          <button
            onClick={startBattleSimulation}
            disabled={isSimulating || battleState.isCompleted}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            Auto-Simulate
          </button>

          <button
            onClick={() => setIsSimulating(false)}
            disabled={!isSimulating}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            Stop
          </button>

          <button
            onClick={simulateEntireBattle}
            disabled={isSimulating || battleState.isCompleted}
            className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
          >
            Skip to End
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <span>Speed:</span>
          <select
            value={simulationSpeed}
            onChange={(e) => changeSimulationSpeed(e.target.value as any)}
            className="px-2 py-1 border rounded"
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      {/* Battle Log */}
      <div className="border border-gray-300 rounded-lg overflow-hidden h-[500px]">
        <BattleLog
          logs={battleState.actionLogs}
          currentTurn={currentTurn}
        />
      </div>

      {/* Battle Result Modal */}
      {showResult && battleState.result && (
        <BattleResultModal
          result={battleState.result}
          onClose={() => setShowResult(false)}
          onRestart={restartBattle}
        />
      )}
    </div>
  );
};

export default AutoBattleSystem;