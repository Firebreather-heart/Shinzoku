"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BattleEntity, BattleActionLog, BattlePosition } from '@/services/BattleSimulator';

interface BattleVisualizerProps {
  playerTeam: BattleEntity[];
  enemyTeam: BattleEntity[];
  actionLogs: BattleActionLog[];
  gridSize: { width: number; height: number };
  currentTurn: number;
}

export default function BattleVisualizer({
  playerTeam,
  enemyTeam,
  actionLogs,
  gridSize,
  currentTurn
}: BattleVisualizerProps) {
  const [displayedLogs, setDisplayedLogs] = useState<BattleActionLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Update displayed logs when a new action is added
  useEffect(() => {
    setDisplayedLogs(actionLogs);

    // Scroll to bottom of logs
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [actionLogs]);

  // Get entity at specific grid position
  const getEntityAtPosition = (x: number, y: number): BattleEntity | null => {
    const allEntities = [...playerTeam, ...enemyTeam];
    return allEntities.find(entity => !entity.isDead && entity.position.x === x && entity.position.y === y) || null;
  };

  // Render entity on grid
  const renderEntityOnGrid = (entity: BattleEntity) => {
    const isPlayer = playerTeam.includes(entity);
    return (
      <div
        key={entity.id}
        className={`absolute transform transition-all duration-300 w-10 h-10 rounded-full overflow-hidden border-2 ${isPlayer
            ? 'border-blue-500'
            : entity.type === 'demon' && entity.hp > 1000
              ? 'border-red-600'
              : 'border-red-400'
          }`}
        style={{
          left: `calc(${(entity.position.x / gridSize.width) * 100}% - 15px)`,
          top: `calc(${(entity.position.y / gridSize.height) * 100}% - 15px)`,
          opacity: entity.isDead ? 0.3 : 1
        }}
      >
        {/* Entity icon or image */}
        <div
          className={`w-full h-full flex items-center justify-center text-xs font-bold ${isPlayer ? 'bg-blue-700' : 'bg-red-700'
            }`}
        >
          {entity.name.substring(0, 2).toUpperCase()}
        </div>

        {/* HP indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div
            className={`h-full ${isPlayer ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${(entity.hp / entity.maxHp) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Find latest action for an entity
  const getLatestActionForEntity = (entityId: string): BattleActionLog | null => {
    return [...actionLogs]
      .reverse()
      .find(log => log.sourceId === entityId || log.targetId === entityId) || null;
  };

  // Format action log message
  const formatLogMessage = (log: BattleActionLog) => {
    return (
      <div
        key={`${log.turn}-${log.timestamp}`}
        className={`px-3 py-2 mb-1 rounded text-sm ${log.actionType === 'attack'
            ? 'bg-red-900/30 border-l-2 border-red-500'
            : log.actionType === 'special'
              ? 'bg-purple-900/30 border-l-2 border-purple-500'
              : log.actionType === 'move'
                ? 'bg-blue-900/30 border-l-2 border-blue-500'
                : 'bg-gray-900/30 border-l-2 border-gray-500'
          }`}
      >
        <div className="flex items-start">
          <span className="text-gray-400 mr-2">T{log.turn}:</span>
          <span>{log.message}</span>
        </div>
        {(log.damage || log.healing) && (
          <div className="mt-1 text-xs">
            {log.damage && <span className="text-red-400">-{log.damage} HP</span>}
            {log.healing && <span className="text-green-400">+{log.healing} HP</span>}
          </div>
        )}
      </div>
    );
  };

  // Create a grid representation with entities
  const grid: (BattleEntity | null)[][] = Array(gridSize.height)
    .fill(null)
    .map(() => Array(gridSize.width).fill(null));

  // Place player team on grid
  playerTeam.forEach(entity => {
    if (entity.position.y >= 0 &&
      entity.position.y < gridSize.height &&
      entity.position.x >= 0 &&
      entity.position.x < gridSize.width) {
      grid[entity.position.y][entity.position.x] = entity;
    }
  });

  // Place enemy team on grid
  enemyTeam.forEach(entity => {
    if (entity.position.y >= 0 &&
      entity.position.y < gridSize.height &&
      entity.position.x >= 0 &&
      entity.position.x < gridSize.width) {
      grid[entity.position.y][entity.position.x] = entity;
    }
  });

  // Get the latest logs (last 5)
  const recentLogs = [...actionLogs].reverse().slice(0, 5);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full w-full">
      {/* Battle Grid */}
      <div className="md:w-3/5 h-full overflow-auto">
        <div className="bg-gradient-to-r from-[#1a0e05]/80 to-[#121826]/80 p-4 rounded-lg border border-[#d3af37]/20 h-full">
          <h3 className="text-lg font-semibold text-[#d3af37] mb-2">Battle Arena - Turn {currentTurn}</h3>
          <div className="overflow-auto">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize.width}, minmax(30px, 1fr))` }}>
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      aspect-square min-w-[30px] min-h-[30px]
                      border flex items-center justify-center relative
                      ${cell ? (cell.type === 'character'
                        ? 'border-blue-500/50 bg-blue-900/30'
                        : (cell.type === 'boss'
                          ? 'border-red-600/70 bg-red-900/40'
                          : 'border-red-500/50 bg-red-900/30')
                      )
                        : (
                          (colIndex === 0 || colIndex === gridSize.width - 1 || rowIndex === 0 || rowIndex === gridSize.height - 1)
                            ? 'border-gray-700/50 bg-gray-800/20'
                            : 'border-gray-700/20 bg-transparent'
                        )}
                      ${!cell && (colIndex + rowIndex) % 2 === 0 ? 'bg-gray-800/5' : ''}
                    `}
                  >
                    {cell && !cell.isDead && (
                      <div className={`
                        w-full h-full flex items-center justify-center relative
                        ${cell.type === 'character' ? 'text-blue-400' : (cell.type === 'boss' ? 'text-red-400' : 'text-red-300')}
                        font-bold
                      `}>
                        {/* Entity identifier */}
                        <span className="text-xs sm:text-sm">{cell.name.charAt(0)}</span>

                        {/* Health bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900">
                          <div
                            className={`h-full ${cell.type === 'character' ? 'bg-blue-500' : (cell.type === 'boss' ? 'bg-red-600' : 'bg-red-500')
                              }`}
                            style={{ width: `${Math.max(0, (cell.hp / cell.maxHp) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Information Panel */}
      <div className="md:w-2/5 h-full flex flex-col">
        {/* Teams Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Player Team */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <h4 className="text-blue-400 font-semibold mb-2">Your Team</h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {playerTeam.map(entity => (
                <div key={entity.id} className={`flex items-center text-sm ${entity.isDead ? 'opacity-50' : ''}`}>
                  <div className="w-6 h-6 bg-blue-900/50 rounded-full flex items-center justify-center mr-2 text-xs">
                    {entity.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs truncate max-w-[100px]">{entity.name}</span>
                      <span className="text-xs">
                        {entity.isDead ? 'Defeated' : `${entity.hp}/${entity.maxHp}`}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-900 mt-1">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${entity.isDead ? 0 : Math.max(0, (entity.hp / entity.maxHp) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enemy Team */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <h4 className="text-red-400 font-semibold mb-2">Enemy Team</h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {enemyTeam.map(entity => (
                <div key={entity.id} className={`flex items-center text-sm ${entity.isDead ? 'opacity-50' : ''}`}>
                  <div className={`w-6 h-6 ${entity.type === 'boss' ? 'bg-red-800/70' : 'bg-red-900/50'
                    } rounded-full flex items-center justify-center mr-2 text-xs`}>
                    {entity.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs truncate max-w-[100px]">{entity.name}</span>
                      <span className="text-xs">
                        {entity.isDead ? 'Defeated' : `${entity.hp}/${entity.maxHp}`}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-900 mt-1">
                      <div
                        className={`h-full ${entity.type === 'boss' ? 'bg-red-600' : 'bg-red-500'}`}
                        style={{ width: `${entity.isDead ? 0 : Math.max(0, (entity.hp / entity.maxHp) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-gray-900/40 border border-gray-700/50 rounded-lg p-3 flex-1 overflow-hidden">
          <h4 className="text-[#d3af37] font-semibold mb-2">Battle Log</h4>
          <div className="overflow-y-auto h-full max-h-[300px]">
            <div className="space-y-2">
              {recentLogs.map((log, index) => {
                // Determine log styling based on action type
                let logStyle = "text-gray-300";
                if (log.actionType === 'attack') logStyle = "text-red-400";
                if (log.actionType === 'special') logStyle = "text-purple-400";
                if (log.actionType === 'status') logStyle = "text-[#d3af37]";
                if (log.actionType === 'move') logStyle = "text-green-400";

                return (
                  <div key={index} className="text-sm">
                    <span className="text-gray-500 text-xs">[{log.turn}]</span>
                    <span className={logStyle}> {log.message}</span>
                  </div>
                );
              })}
              {actionLogs.length === 0 && (
                <div className="text-gray-500 text-sm">No actions recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}