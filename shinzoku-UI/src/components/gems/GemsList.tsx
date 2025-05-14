import React from 'react';
import Image from 'next/image';

interface GemsListProps {
    gems: {
        id: string;
        name: string;
        price: number;
        amount: number;
        image_url: string;
    }[];
}

export default function GemsList({ gems }: GemsListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {gems.map((gem) => (
                <div
                    key={gem.id}
                    className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4 
                    hover:from-[#d3af37]/10 hover:to-black/30 transition-all duration-300 
                    shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                >
                    <div className="aspect-square mb-4 relative overflow-hidden rounded-lg flex items-center justify-center">
                        {/* Use a default image if the specified one isn't available */}
                        <Image
                            src={gem.image_url || "/images/gemstone.png"}
                            alt={gem.name}
                            width={120}
                            height={120}
                            className="object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/images/gemstone.png';
                            }}
                        />
                    </div>

                    <h3 className="text-xl font-bold text-[#d3af37] mb-1">{gem.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                            <span className="text-2xl">💎</span>
                            <span className="ml-2 text-lg font-bold text-white">{gem.amount}</span>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-br from-[#d3af37] to-[#b87333] text-black font-bold rounded-lg hover:from-[#e1c158] hover:to-[#cd7f32] transition-all">
                            ${gem.price.toFixed(2)}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}