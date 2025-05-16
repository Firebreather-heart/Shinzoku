import React, { useState } from 'react';
import Image from 'next/image';
import { CharacterModel } from '@/types/CharacterModel';
import NftMintingModal from '../nft/NftMintingModal';

interface CharacterListProps {
    characters: CharacterModel[];
}

export default function CharacterList({ characters }: CharacterListProps) {
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterModel | null>(null);
    const [showMintModal, setShowMintModal] = useState<boolean>(false);

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

    const handleCharacterClick = (character: CharacterModel) => {
        setSelectedCharacter(character);
    };

    const handleCloseDetails = () => {
        setSelectedCharacter(null);
    };

    const handleOpenMintModal = () => {
        setShowMintModal(true);
    };

    const handleCloseMintModal = () => {
        setShowMintModal(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                    <div
                        key={character.shinzoku_id}
                        onClick={() => handleCharacterClick(character)}
                        className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4 
                      hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 cursor-pointer
                      shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                    >
                        <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                            {/* Character Image with proper object-top positioning to show the head */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <Image
                                src={character.image_url || "/images/default_character.png"}
                                alt={character.name}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover object-top" // object-top ensures head is visible
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = '/images/default_character.png';
                                }}
                            />
                            <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-[#d3af37] text-sm">
                                {character.rank_name} Rank
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-[#d3af37] mb-1">{character.name}</h3>
                        <p className={`text-sm ${getRarityColor(character.rarity)} mb-2`}>{character.rarity}</p>

                        {/* Show primary jutsu if available */}
                        {character.special_abilities && character.special_abilities.length > 0 && (
                            <div className="mt-2 border-t border-gray-700/50 pt-2">
                                <p className="text-sm text-gray-400">Primary Jutsu</p>
                                <p className="text-md text-[#d3af37] font-semibold">{character.special_abilities[0].jutsu_name || character.special_abilities[0].name}</p>
                            </div>
                        )}

                        <div className="mt-3 flex justify-between items-center">
                            {character.price > 0 ? (
                                <div className="flex items-center">
                                    🌕
                                    <span className="ml-1 text-white font-bold">{character.price.toLocaleString()} sol</span>
                                </div>
                            ) : (
                                <span className="text-green-500 font-semibold">Free</span>
                            )}
                            <button className="px-3 py-1 bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold rounded hover:from-[#e1c158] hover:to-[#cd7f32] transition-all">
                                {character.price > 0 ? "Purchase" : "Claim"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Character Details Modal */}
            {selectedCharacter && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-b from-[#1a0e05] to-[#121826] max-w-2xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-[#d3af37] mb-4">{selectedCharacter.name}</h2>
                            <button
                                onClick={handleCloseDetails}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Character Image */}
                            <div className="w-full md:w-1/3 relative">
                                <div className="aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedCharacter.image_url || "/images/default_character.png"}
                                        alt={selectedCharacter.name}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="mt-2 text-center">
                                    <span className={`${getRarityColor(selectedCharacter.rarity)} font-bold`}>
                                        {selectedCharacter.rarity} • Rank {selectedCharacter.rank_name}
                                    </span>
                                </div>
                            </div>

                            {/* Character Stats and Abilities */}
                            <div className="w-full md:w-2/3">
                                <h3 className="text-xl font-semibold text-[#d3af37] mb-3">Stats</h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {Object.entries(selectedCharacter.stats).map(([stat, value]) => (
                                        <div key={stat} className="flex justify-between items-center">
                                            <span className="text-gray-400 capitalize">{stat}</span>
                                            <div className="w-24 h-2 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#d3af37] to-[#b87333]"
                                                    style={{ width: `${(value / 1500) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-xl font-semibold text-[#d3af37] mb-3">Special Abilities</h3>
                                <div className="space-y-4">
                                    {selectedCharacter.special_abilities && selectedCharacter.special_abilities.map((ability, index) => (
                                        <div
                                            key={index}
                                            className="bg-black/30 p-3 rounded-lg border border-[#d3af37]/20"
                                        >
                                            {/* Display jutsu_name as the primary name */}
                                            <h4 className="text-lg font-bold text-[#d3af37]">{ability.jutsu_name || ability.name}</h4>
                                            {ability.jutsu_name && ability.name !== ability.jutsu_name && (
                                                <p className="text-sm text-gray-400">{ability.name}</p>
                                            )}
                                            <div className="flex justify-between mt-2 text-sm">
                                                <span>Power: {ability.value}</span>
                                                <span>MP Cost: {ability.mp_cost}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    {/* {selectedCharacter.price > 0 ? (
                                        <button className="flex-1 py-3 bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold rounded-lg hover:from-[#e1c158] hover:to-[#cd7f32] transition-all">
                                            Purchase for {selectedCharacter.price.toLocaleString()} Sol
                                        </button>
                                    ) : (
                                        <button className="flex-1 py-3 bg-gradient-to-br from-green-600 to-green-800 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-700 transition-all">
                                            Claim for Free
                                        </button>
                                    )} */}

                                    {/* NFT Mint Button */}
                                    <button
                                        onClick={handleOpenMintModal}
                                        className="py-3 px-4 bg-gradient-to-br from-purple-600 to-blue-700 text-white font-bold rounded-lg hover:from-purple-500 hover:to-blue-600 transition-all"
                                    >
                                        Mint NFT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NFT Minting Modal */}
            {selectedCharacter && showMintModal && (
                <NftMintingModal
                    character={selectedCharacter}
                    isOpen={showMintModal}
                    onClose={handleCloseMintModal}
                />
            )}
        </>
    );
}


function IconCoin() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#d3af37]"
        >
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}