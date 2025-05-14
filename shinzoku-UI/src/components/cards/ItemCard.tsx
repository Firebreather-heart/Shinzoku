import Image from 'next/image';
import { ItemModel } from '@/types/ItemModel';

interface ItemCardProps {
    item: ItemModel;
    onClose: () => void;
}

export default function ItemCard({ item, onClose }: ItemCardProps) {
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
                    <h2 className="text-2xl font-bold text-[#d3af37]">{item.name}</h2>
                    <div className="px-2 py-1 bg-[#d3af37]/20 rounded-md text-[#d3af37] text-sm">
                        Rank {item.rank_name}
                    </div>
                </div>

                {/* Item image and rarity */}
                <div className="relative mb-6">
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        width={400}
                        height={300}
                        className="w-full h-auto rounded-lg object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-md ${getRarityColor(item.rarity)}`}>
                        {item.rarity}
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#d3af37] mb-2">Stats Boost</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {item.stats.hp > 0 && (
                            <div className="text-center">
                                <div className="text-[#d3af37] font-bold">HP</div>
                                <div>+{item.stats.hp}</div>
                            </div>
                        )}
                        {item.stats.dmg > 0 && (
                            <div className="text-center">
                                <div className="text-[#d3af37] font-bold">DMG</div>
                                <div>+{item.stats.dmg}</div>
                            </div>
                        )}
                        {item.stats.armor > 0 && (
                            <div className="text-center">
                                <div className="text-[#d3af37] font-bold">ARM</div>
                                <div>+{item.stats.armor}</div>
                            </div>
                        )}
                        {item.stats.range > 0 && (
                            <div className="text-center">
                                <div className="text-[#d3af37] font-bold">RNG</div>
                                <div>+{item.stats.range}</div>
                            </div>
                        )}
                        {item.stats.speed > 0 && (
                            <div className="text-center">
                                <div className="text-[#d3af37] font-bold">SPD</div>
                                <div>+{item.stats.speed}</div>
                            </div>
                        )}
                        {item.stats.kp > 0 && (
                            <div className="text-center">
                                <div className="text-[#d3af37] font-bold">KP</div>
                                <div>+{item.stats.kp}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special abilities */}
                {item.special_abilities.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#d3af37] mb-2">Special Abilities</h3>
                        <div className="space-y-3">
                            {item.special_abilities.map((ability, index) => (
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
                )}

                {/* Price info */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#d3af37] mb-1">Price</h3>
                    <p className="text-white">{item.price} Kino</p>
                </div>

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