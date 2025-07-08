import React, { useEffect, useRef } from 'react';
import { BattleActionLog } from '../../services/BattleSimulator';

interface BattleLogProps {
    logs: BattleActionLog[];
    currentTurn: number;
}

const BattleLog: React.FC<BattleLogProps> = ({ logs, currentTurn }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new logs come in
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // Group logs by turn
    const logsByTurn: { [turn: number]: BattleActionLog[] } = {};
    logs.forEach(log => {
        if (!logsByTurn[log.turn]) {
            logsByTurn[log.turn] = [];
        }
        logsByTurn[log.turn].push(log);
    });

    return (
        <div className="flex flex-col h-full">
            <div className="p-3 bg-gray-800 text-white font-bold border-b border-gray-700">
                Battle Log
            </div>
            <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50"
            >
                {Object.entries(logsByTurn).map(([turn, turnLogs]) => (
                    <div key={`turn-${turn}`} className="mb-4">
                        <div className="text-sm font-bold border-b pb-1 mb-2 text-gray-800">
                            Turn {turn}
                        </div>
                        <div className="flex flex-col gap-2">
                            {turnLogs.map((log, index) => {
                                // Find entity info from log content to determine if it's a player or enemy
                                const messageContent = log.message;
                                const isPlayerAction = logs.findIndex(l => l.turn === parseInt(turn) && l.entityId === log.entityId) % 2 === 0;

                                return (
                                    <div
                                        key={`log-${turn}-${index}`}
                                        className={`relative p-3 rounded-lg ${isPlayerAction
                                                ? 'bg-blue-50 border-l-4 border-blue-500 ml-2 mr-8'
                                                : 'bg-red-50 border-l-4 border-red-500 ml-8 mr-2'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs text-white ${log.actionType === 'attack' ? 'bg-red-500' :
                                                    log.actionType === 'move' ? 'bg-blue-500' :
                                                        log.actionType === 'special' ? 'bg-purple-500' :
                                                            'bg-gray-500'
                                                }`}>
                                                {log.actionType.toUpperCase()}
                                            </span>
                                            <span className={`text-sm flex-1 ${isPlayerAction ? 'text-blue-800' : 'text-red-800'}`}>
                                                {log.message}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {logs.length === 0 && (
                    <div className="text-gray-500 italic p-4 text-center">
                        No actions yet. Battle will begin soon.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BattleLog;