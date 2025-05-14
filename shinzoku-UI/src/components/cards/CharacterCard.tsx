import { useState } from 'react';
import Image from 'next/image';
import { CharacterModel } from '@/types/CharacterModel';

interface CharacterCardProps {
    character: CharacterModel;
    onClose: () => void;
}

export default function CharacterCard({ character, onClose }: CharacterCardProps) {
    const [selectedItemSlots, setSelectedItemSlots] = useState<number[]>([]);

    // Function to handle item slot click
    const handleSlotClick = (index: number) => {
        if (selectedItemSlots.includes(index)) {
            setSelectedItemSlots(selectedItemSlots.filter(i => i !== index));
        } else {
            setSelectedItemSlots([...selectedItemSlots, index]);
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'common': return 'text-gray-300 border-gray-300';
            case 'rare': return 'text-blue-400 border-blue-400';
            case 'epic': return 'text-purple-400 border-purple-400';
            case 'legendary': return 'text-yellow-400 border-yellow-400';
            default: return 'text-gray-300 border-gray-300';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
            <div
                className="bg-gradient-to-b from-gray-900 to-black border border-[#d3af37]/50 rounded-xl p-6 max-w-md w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with name and rank */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#d3af37]">{character.name}</h2>
                    <div className="px-2 py-1 bg-[#d3af37]/20 rounded-md text-[#d3af37] text-sm">
                        Rank {character.rank_name}
                    </div>
                </div>

                {/* Character image and rarity */}
                <div className="relative mb-6">
                    <Image
                        src={character.image_url}
                        alt={character.name}
                        width={400}
                        height={300}
                        className="w-full h-auto rounded-lg object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-md ${getRarityColor(character.rarity)}`}>
                        {character.rarity}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">HP</div>
                        <div>{character.stats.hp}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">DMG</div>
                        <div>{character.stats.dmg}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">ARM</div>
                        <div>{character.stats.armor}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">RNG</div>
                        <div>{character.stats.range}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">SPD</div>
                        <div>{character.stats.speed}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#d3af37] font-bold">KP</div>
                        <div>{character.stats.kp}</div>
                    </div>
                </div>

                {/* Special abilities */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#d3af37] mb-2">Special Abilities</h3>
                    <div className="space-y-3">
                        {character.special_abilities.map((ability, index) => (
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

                {/* Item slots */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#d3af37] mb-2">Item Slots</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className={`w-full aspect-square border-2 rounded-lg flex items-center justify-center cursor-pointer
                  ${selectedItemSlots.includes(index)
                                        ? 'border-[#d3af37] bg-[#d3af37]/20'
                                        : 'border-gray-600 hover:border-gray-500'}`}
                                onClick={() => handleSlotClick(index)}
                            >
                                <span className="text-xs text-gray-400">{index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price info if available */}
                {character.price > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#d3af37] mb-1">Price</h3>
                        <p className="text-white">{character.price} Kino</p>
                    </div>
                )}

                {/* Close button */}
                <button
                    className="w-full py-2 bg-[#d3af37] hover:bg-[#c2a030] text-black font-semibold rounded-lg transition-colors"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}