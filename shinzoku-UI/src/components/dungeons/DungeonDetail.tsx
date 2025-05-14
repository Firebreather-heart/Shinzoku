import { useState } from 'react';
import Image from 'next/image';
import { DungeonModel } from '@/types/DungeonModel';
import { DemonModel } from '@/types/DemonModel';
import { ItemModel } from '@/types/ItemModel';
import DemonCard from '../cards/DemonCard';
import ItemCard from '../cards/ItemCard';

interface DungeonDetailProps {
    dungeon: DungeonModel;
    demons: DemonModel[];  // All demons in the dungeon, including boss
    rewardItems: ItemModel[];  // Items that can be dropped
    onClose: () => void;
}

export default function DungeonDetail({ dungeon, demons, rewardItems, onClose }: DungeonDetailProps) {
    const [selectedDemon, setSelectedDemon] = useState<DemonModel | null>(null);
    const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);
    const [isBoss, setIsBoss] = useState<boolean>(false);

    // Find the boss demon
    const boss = demons.find(demon => demon.shinzoku_id === dungeon.boss);

    // Filter out regular demons (not the boss)
    const regularDemons = demons.filter(demon => demon.shinzoku_id !== dungeon.boss);

    // Handle demon click to show details
    const handleDemonClick = (demon: DemonModel, boss: boolean = false) => {
        setSelectedDemon(demon);
        setIsBoss(boss);
    };

    // Handle reward item click
    const handleItemClick = (item: ItemModel) => {
        setSelectedItem(item);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
            <div
                className="bg-gradient-to-b from-gray-900 to-black border border-[#d3af37]/50 rounded-xl p-6 max-w-4xl w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with dungeon name and rank */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#d3af37]">{dungeon.name}</h2>
                    <div className="px-3 py-1 bg-[#d3af37]/20 rounded-md text-[#d3af37]">
                        Rank {dungeon.rank_name}
                    </div>
                </div>

                {/* Dungeon image */}
                <div className="relative mb-6">
                    <Image
                        src={dungeon.image_url}
                        alt={dungeon.name}
                        width={1000}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-8">{dungeon.description}</p>

                {/* Boss section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-red-500 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zm-1 4a1 1 0 00-1-1H8a1 1 0 100 2h2a1 1 0 001-1z" clipRule="evenodd" />
                        </svg>
                        Boss
                    </h3>

                    {boss && (
                        <div
                            className="bg-gradient-to-r from-red-900/30 to-black border border-red-500/30 rounded-lg p-4 cursor-pointer hover:bg-red-900/40 transition-colors"
                            onClick={() => handleDemonClick(boss, true)}
                        >
                            <div className="flex items-center">
                                <div className="relative w-16 h-16 mr-4">
                                    <Image
                                        src={boss.image_url}
                                        alt={boss.name}
                                        width={64}
                                        height={64}
                                        className="rounded-lg object-cover w-full h-full"
                                    />
                                    <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">B</div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-red-400">{boss.name}</h4>
                                    <p className="text-sm text-gray-400">{boss.type} • Rank {boss.rank_name}</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="text-sm text-gray-400">HP: {boss.stats.hp}</div>
                                    <div className="text-sm text-gray-400">DMG: {boss.stats.dmg}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Regular demons section */}
                {regularDemons.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-[#d3af37] mb-4">Demons</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {regularDemons.map((demon) => (
                                <div
                                    key={demon.shinzoku_id}
                                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-800/70 transition-colors"
                                    onClick={() => handleDemonClick(demon)}
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 mr-3">
                                            <Image
                                                src={demon.image_url}
                                                alt={demon.name}
                                                width={48}
                                                height={48}
                                                className="rounded object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">{demon.name}</h4>
                                            <p className="text-xs text-gray-400">{demon.type} • Rank {demon.rank_name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rewards section */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#d3af37] mb-4">Rewards</h3>
                    <div className="bg-gray-800/30 border border-[#d3af37]/20 rounded-lg p-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center bg-gray-900/70 px-3 py-2 rounded-md">
                                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 13.5v-1a1 1 0 10-2 0v1a1 1 0 102 0zm.53-7.197l-.08-.015A1.834 1.834 0 0010 8a1.834 1.834 0 00-1.45.288l-.08.015a1.043 1.043 0 01-1.35-.348.986.986 0 01.348-1.35A3.808 3.808 0 0110 6c1.261 0 2.415.47 3.277 1.241a.986.986 0 01-.734 1.645z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white font-semibold">{dungeon.rewards.exp} XP</span>
                            </div>
                            <div className="flex items-center bg-gray-900/70 px-3 py-2 rounded-md">
                                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.904 8.97a.75.75 0 11-1.308-.74 6.493 6.493 0 0110.808 0 .75.75 0 11-1.308.74 4.993 4.993 0 00-8.192 0z" />
                                    <path d="M10 10a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                                <span className="text-white font-semibold">{dungeon.rewards.gold} Gold</span>
                            </div>
                        </div>

                        <h4 className="text-sm font-medium text-[#d3af37] mb-2">Possible Item Drops:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {dungeon.rewards.items.map((rewardItem) => {
                                const item = rewardItems.find(i => i.shinzoku_id === rewardItem.item);
                                if (!item) return null;

                                return (
                                    <div
                                        key={item.shinzoku_id}
                                        className="bg-gray-800/70 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-700/50 transition-colors"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 mr-2 relative">
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-medium text-white text-sm">{item.name}</h5>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-400">{item.rarity}</p>
                                                    <p className="text-xs text-[#d3af37]">{rewardItem.dropRate}% drop</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Close button */}
                <button
                    className="w-full py-2 bg-[#d3af37] hover:bg-[#c2a030] text-black font-semibold rounded-lg transition-colors"
                    onClick={onClose}
                >
                    Close
                </button>

                {/* Modals for selected demon or item */}
                {selectedDemon && (
                    <DemonCard
                        demon={selectedDemon}
                        isBoss={isBoss}
                        onClose={() => setSelectedDemon(null)}
                    />
                )}

                {selectedItem && (
                    <ItemCard
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </div>
        </div>
    );
}