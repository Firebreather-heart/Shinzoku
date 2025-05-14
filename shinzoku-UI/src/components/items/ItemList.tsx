import { useState } from 'react';
import Image from 'next/image';
import { ItemModel } from '@/types/ItemModel';
import ItemDetail from './ItemDetail';

interface ItemListProps {
    items: ItemModel[];
}

export default function ItemList({ items }: ItemListProps) {
    const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);

    // Helper function to get primary stat
    const getPrimaryStat = (item: ItemModel) => {
        const stats = item.stats;
        // Find the highest non-zero stat
        let highestStat = { name: '', value: 0 };

        for (const [name, value] of Object.entries(stats)) {
            if (value > highestStat.value) {
                highestStat = { name, value };
            }
        }

        return highestStat;
    };

    // Get CSS classes for rarity
    const getRarityClass = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'common': return 'border-gray-500';
            case 'uncommon': return 'border-green-500';
            case 'rare': return 'border-blue-500';
            case 'epic': return 'border-purple-500';
            case 'legendary': return 'border-yellow-500';
            default: return 'border-gray-500';
        }
    };

    // Handle item click
    const handleItemClick = (item: ItemModel) => {
        setSelectedItem(item);
    };

    // Close the item detail modal
    const handleCloseModal = () => {
        setSelectedItem(null);
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
                            className={`border ${getRarityClass(item.rarity)} rounded-xl overflow-hidden cursor-pointer 
                        transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg`}
                            onClick={() => setSelectedItem(item)}
                        >
                            <div className="relative h-40">
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    width={300}
                                    height={200}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = '/images/default_item.png';
                                    }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-white">{item.rarity}</span>
                                        <span className="text-xs text-[#d3af37]">Rank {item.rank_name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-3">
                                <h3 className="text-lg font-semibold text-[#d3af37] mb-1 truncate">{item.name}</h3>

                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-400 capitalize">{primaryStat.name}:</span>
                                        <span className="text-sm text-white ml-1">{primaryStat.value}</span>
                                    </div>

                                    {item.price > 0 && (
                                        <span className="text-sm font-semibold text-[#d3af37]">{item.price} SOL</span>
                                    )}
                                </div>

                                {item.special_abilities && item.special_abilities.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-700">
                                        <span className="text-xs text-blue-400">
                                            {item.special_abilities[0].jutsu_name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Item Detail Modal */}
            {selectedItem && (
                <ItemDetail
                    item={selectedItem}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}