import { useState } from 'react';
import Image from 'next/image';
import { DungeonModel, DemonModel } from '@/types/DungeonModel';
// import { DemonModel } from '@/types/DemonModel';
import { ItemModel } from '@/types/ItemModel';
import DungeonDetail from './DungeonDetail';

interface DungeonListProps {
    dungeons: DungeonModel[];
    demons: DemonModel[];
    items: ItemModel[];
}

export default function DungeonList({ dungeons, demons, items }: DungeonListProps) {
    const [selectedDungeon, setSelectedDungeon] = useState<DungeonModel | null>(null);

    // Function to get difficulty class based on rank name
    const getDifficultyClass = (rank_name: string): string => {
        switch (rank_name) {
            case 'SSS':
            case 'SS':
            case 'S':
                return 'text-red-500';
            case 'A':
                return 'text-yellow-500';
            case 'B':
            case 'C':
                return 'text-blue-500';
            default:
                return 'text-green-500';
        }
    };

    // Function to get difficulty label based on rank
    const getDifficultyLabel = (rank: number): string => {
        if (rank >= 10000) return 'Hard';
        if (rank >= 7000) return 'Medium';
        if (rank >= 4000) return 'Normal';
        return 'Easy';
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-[#d3af37] mb-6">Dungeons</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dungeons.map((dungeon) => {
                    // Find the boss for this dungeon to display its image/info
                    const boss: DemonModel = dungeon.boss;

                    return (
                        <div
                            key={dungeon.dungeon_id}
                            className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-[#d3af37]/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                            onClick={() => setSelectedDungeon(dungeon)}
                        >
                            <div className="relative h-40">
                                <Image
                                    src={dungeon.image_url}
                                    alt={dungeon.name}
                                    width={400}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h3 className="text-xl font-bold text-white">{dungeon.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-300">Rank {dungeon.rank_name}</span>
                                        <span className={`text-xs font-semibold ${getDifficultyClass(dungeon.rank_name)}`}>
                                            {dungeon.rank_name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2" title={dungeon.description}>
                                    {dungeon.description}
                                </p>

                                {boss && (
                                    <div className="flex items-center bg-black/30 rounded-lg p-2 mb-3">
                                        <div className="relative w-10 h-10 mr-2">
                                            <Image
                                                src={boss.image_url}
                                                alt={boss.name}
                                                width={40}
                                                height={40}
                                                className="rounded object-cover w-full h-full"
                                            />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">B</div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-400">{boss.name}</h4>
                                            <p className="text-xs text-gray-400">Boss • {boss.type}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-400">
                                        <span className="text-[#d3af37]">{dungeon.rewards.exp} XP</span> •
                                        <span className="text-[#d3af37] ml-1">{dungeon.rewards.gold} Gold</span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {dungeon.members.length + 1} Demons
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedDungeon && (
                <DungeonDetail
                    dungeon={selectedDungeon}
                    demons={demons.filter(demon =>
                        demon._id === selectedDungeon.boss._id ||
                        selectedDungeon.members.some(member => member._id === demon._id)
                    )}
                    rewardItems={items.filter(item =>
                        selectedDungeon.rewards.items.some(reward => reward.item === item.shinzoku_id)
                    )}
                    onClose={() => setSelectedDungeon(null)}
                />
            )}
        </div>
    );
}