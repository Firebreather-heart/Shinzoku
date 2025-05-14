import { useState } from 'react';
import Image from 'next/image';
import { ItemModel } from '@/types/ItemModel';
import NftMintingModal from '../nft/NftMintingModal';

interface ItemDetailProps {
    item: ItemModel;
    onClose: () => void;
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
    const [showMintModal, setShowMintModal] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleOpenMintModal = () => {
        setShowMintModal(true);
    };

    const handleCloseMintModal = () => {
        setShowMintModal(false);
    };

    // Get styling based on item rarity
    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'common': return 'text-gray-300';
            case 'uncommon': return 'text-green-400';
            case 'rare': return 'text-blue-400';
            case 'epic': return 'text-purple-400';
            case 'legendary': return 'text-yellow-400';
            default: return 'text-gray-300';
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75">
                <div className="bg-[#1a0e05] border-2 border-[#d3af37] rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#d3af37]">{item.name}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-1/3">
                            <div className="aspect-square relative rounded-lg overflow-hidden mb-4 bg-gray-800">
                                {imageError ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-gray-500">{item.name}</span>
                                    </div>
                                ) : (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${getRarityColor(item.rarity)} bg-black/30`}>
                                    {item.rarity}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm text-white bg-black/30">
                                    Rank {item.rank_name}
                                </span>
                            </div>

                            {item.price > 0 && (
                                <div className="bg-black/30 rounded-lg p-3 text-center mb-4">
                                    <p className="text-sm text-gray-400 mb-1">Price</p>
                                    <p className="text-xl font-bold text-[#d3af37]">{item.price.toLocaleString()} SOL</p>
                                </div>
                            )}
                        </div>

                        <div className="w-full sm:w-2/3">
                            <h3 className="text-lg font-semibold text-white mb-3">Item Stats</h3>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {Object.entries(item.stats).map(([stat, value]) => {
                                    if (value === 0) return null; // Skip stats with 0 value
                                    return (
                                        <div key={stat} className="bg-black/20 rounded-lg p-3">
                                            <p className="text-gray-400 text-sm capitalize">{stat}</p>
                                            <p className="text-white font-semibold">{value}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {item.special_abilities && item.special_abilities.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold text-white mb-3">Special Abilities</h3>
                                    <div className="space-y-4 mb-6">
                                        {item.special_abilities.map((ability, index) => (
                                            <div key={index} className="bg-black/20 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-[#d3af37] font-medium">{ability.jutsu_name}</h4>
                                                    <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">
                                                        MP: {ability.mp_cost}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-300">
                                                    {ability.name} • Value: {ability.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="mt-6 flex gap-3">
                                <button
                                    className="flex-1 py-3 bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold rounded-lg hover:from-[#e1c158] hover:to-[#cd7f32] transition-all"
                                    onClick={handleOpenMintModal}
                                >
                                    Mint as NFT
                                </button>
                                <button
                                    className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showMintModal && (
                <NftMintingModal
                    item={item}
                    isOpen={showMintModal}
                    onClose={handleCloseMintModal}
                />
            )}
        </>
    );
}