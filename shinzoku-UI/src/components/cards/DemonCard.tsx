import Image from 'next/image';
import { DemonModel } from '@/types/DemonModel';

interface DemonCardProps {
    demon: DemonModel;
    isBoss?: boolean;
    onClose: () => void;
}

export default function DemonCard({ demon, isBoss = false, onClose }: DemonCardProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
            <div
                className={`bg-gradient-to-b from-gray-900 to-black border ${isBoss ? 'border-red-500/70' : 'border-[#d3af37]/50'} rounded-xl p-6 max-w-md w-full shadow-lg`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with name and type */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#d3af37]">{demon.name}</h2>
                    <div className={`px-2 py-1 rounded-md text-sm ${isBoss ? 'bg-red-500/20 text-red-400' : 'bg-[#d3af37]/20 text-[#d3af37]'
                        }`}>
                        {isBoss ? 'Boss' : demon.type}
                    </div>
                </div>

                {/* Demon image and rank */}
                <div className="relative mb-6">
                    <Image
                        src={demon.image_url}
                        alt={demon.name}
                        width={400}
                        height={300}
                        className={`w-full h-auto rounded-lg object-cover ${isBoss ? 'border-2 border-red-500/50' : ''}`}
                    />
                    <div className="absolute top-2 right-2 px-3 py-1 bg-black/60 rounded-md text-white">
                        Rank {demon.rank_name}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">HP</div>
                        <div>{demon.stats.hp}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">DMG</div>
                        <div>{demon.stats.dmg}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">ARM</div>
                        <div>{demon.stats.armor}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">RNG</div>
                        <div>{demon.stats.range}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">SPD</div>
                        <div>{demon.stats.speed}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">KP</div>
                        <div>{demon.stats.kp}</div>
                    </div>
                </div>

                {/* Special abilities */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#d3af37] mb-2">Special Abilities</h3>
                    <div className="space-y-3">
                        {demon.special_abilities.map((ability, index) => (
                            <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="font-medium">{ability.name}</span>
                                    <span className="text-[#d3af37]">{ability.value} DMG</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400 mt-1">
                                    <span>{ability.jutsu_name}</span>
                                    <span>{ability.mp_cost} MP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger level for bosses */}
                {isBoss && (
                    <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                        <h3 className="text-red-400 font-semibold">⚠️ Danger Level: High</h3>
                        <p className="text-gray-300 text-sm mt-1">This is a dungeon boss with enhanced abilities.</p>
                    </div>
                )}

                {/* Close button */}
                <button
                    className={`w-full py-2 ${isBoss
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-[#d3af37] hover:bg-[#c2a030]'
                        } text-black font-semibold rounded-lg transition-colors`}
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}