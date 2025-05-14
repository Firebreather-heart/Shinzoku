import { useState } from 'react';
import Image from 'next/image';
import { ItemModel } from '@/types/ItemModel';
import ItemCard from '../cards/ItemCard';

interface ItemListProps {
    items: ItemModel[];
}

export default function ItemList({ items }: ItemListProps) {
    const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);

    // Function to get rarity class
    const getRarityClass = (rarity: string): string => {
        switch (rarity.toLowerCase()) {
            case 'common': return 'border-gray-400 bg-gray-900/50';
            case 'rare': return 'border-blue-400 bg-blue-900/20';
            case 'epic': return 'border-purple-400 bg-purple-900/20';
            case 'legendary': return 'border-yellow-400 bg-yellow-900/20';
            default: return 'border-gray-400 bg-gray-900/50';
        }
    };

    // Function to get rarity text class
    const getRarityTextClass = (rarity: string): string => {
        switch (rarity.toLowerCase()) {
            case 'common': return 'text-gray-300';
            case 'rare': return 'text-blue-400';
            case 'epic': return 'text-purple-400';
            case 'legendary': return 'text-yellow-400';
            default: return 'text-gray-300';
        }
    };

    // Function to determine the primary stat of the item
    const getPrimaryStat = (item: ItemModel): { name: string, value: number } => {
        // Find the highest stat
        const stats = [
            { name: 'HP', value: item.stats.hp },
            { name: 'DMG', value: item.stats.dmg },
            { name: 'ARM', value: item.stats.armor },
            { name: 'RNG', value: item.stats.range },
            { name: 'SPD', value: item.stats.speed },
            { name: 'KP', value: item.stats.kp }
        ];

        return stats.reduce((highest, current) =>
            current.value > highest.value ? current : highest, stats[0]);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-[#d3af37] mb-6">Items</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => {
                    const primaryStat = getPrimaryStat(item);

                    return (
                        <div
                            key={item.shinzoku_id}
                            className={`border ${getRarityClass(item.rarity)} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg`}
                            onClick={() => setSelectedItem(item)}
                        >
                            <div className="relative h-40">
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    width={300}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs font-semibold text-white">
                                    Rank {item.rank_name}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                    <span className={`text-xs font-semibold ${getRarityTextClass(item.rarity)}`}>
                                        {item.rarity}
                                    </span>
                                </div>

                                {/* Display primary stat boost */}
                                {primaryStat.value > 0 && (
                                    <div className="mt-2 mb-3 bg-black/30 rounded-lg p-2 flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Primary Bonus:</span>
                                        <span className="font-semibold text-[#d3af37]">+{primaryStat.value} {primaryStat.name}</span>
                                    </div>
                                )}

                                {/* Special ability preview */}
                                {item.special_abilities.length > 0 && (
                                    <div className="text-xs text-gray-400 mb-3">
                                        <span className="text-[#d3af37]">Special:</span> {item.special_abilities[0].name}
                                    </div>
                                )}

                                {/* Item price */}
                                <div className="mt-2 text-sm font-medium text-[#d3af37]">
                                    {item.price} Kino
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Display item card when selected */}
            {selectedItem && (
                <ItemCard
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}