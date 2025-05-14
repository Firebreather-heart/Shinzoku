import React from 'react';

interface GemPackage {
    id: number;
    amount: number;
    bonus?: number;
    price: number;
    currency: string;
    popular?: boolean;
    bestValue?: boolean;
}

interface GemsListProps {
    gemPackages: GemPackage[];
}

export default function GemsList({ gemPackages }: GemsListProps) {
    const handlePurchase = (pack: GemPackage) => {
        console.log(`Purchasing gem package: ${pack.amount} gems for ${pack.price} ${pack.currency}`);
        // Here you would integrate with payment processing or wallet connection
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gemPackages.map((pack) => (
                <div
                    key={pack.id}
                    className={`bg-gradient-to-b ${pack.bestValue
                            ? 'from-[#d3af37]/20 to-black/40 border-2 border-[#d3af37]'
                            : 'from-black/40 to-black/20 border border-gray-800'
                        } backdrop-blur-sm rounded-xl p-4 relative`}
                >
                    {/* Best Value or Popular tags */}
                    {(pack.bestValue || pack.popular) && (
                        <div className={`absolute -top-3 -right-2 ${pack.bestValue ? 'bg-[#d3af37]' : 'bg-blue-500'
                            } text-black text-xs font-bold py-1 px-3 rounded-full shadow-lg`}>
                            {pack.bestValue ? 'BEST VALUE' : 'POPULAR'}
                        </div>
                    )}

                    {/* Gem Icon and Amount */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <span className="text-5xl">💎</span>
                            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#d3af37] flex items-center justify-center text-black text-xs font-bold">
                                {pack.amount}
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-[#d3af37]">{pack.amount} Gems</h3>
                        {pack.bonus && (
                            <p className="text-sm text-green-400">+{pack.bonus} Bonus!</p>
                        )}
                        <p className="text-gray-300 font-semibold mt-2">{pack.price} {pack.currency}</p>
                    </div>

                    <button
                        onClick={() => handlePurchase(pack)}
                        className="w-full py-2 bg-gradient-to-br from-[#d3af37] to-[#b87333] hover:from-[#e1c158] hover:to-[#cd7f32] text-black font-bold rounded-lg transition-all duration-300"
                    >
                        Purchase
                    </button>
                </div>
            ))}
        </div>
    );
}