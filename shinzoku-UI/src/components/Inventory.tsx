import { useState } from "react";

interface Item {
  id: number;
  name: string;
  type: string;
  imageUrl: string;
  value: number;
}

const sampleItems: Item[] = [
  {
    id: 1,
    name: "Warrior #001",
    type: "Character",
    imageUrl: "/images/warrior1.png",
    value: 300,
  },
  {
    id: 2,
    name: "Warrior #002",
    type: "Character",
    imageUrl: "/images/warrior2.png",
    value: 350,
  },
  {
    id: 3,
    name: "Gemstone",
    type: "Currency",
    imageUrl: "/images/gemstone.png",
    value: 50,
  },
  {
    id: 4,
    name: "$Kino",
    type: "Currency",
    imageUrl: "/images/kino.png",
    value: 200,
  },
];

interface InventoryProps {
  setActiveTab: (tab: "shop" | "home" | "inventory" | "battle") => void; // Prop for changing the active tab
}

export default function Inventory({ setActiveTab }: InventoryProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);  
  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f172a] to-[#1e293b] flex flex-col items-center text-white">
      <div className="max-w-4xl w-full px-6 py-8">
        <h1 className="text-4xl font-extrabold text-[#3b82f6] text-center">
          Your Inventory
        </h1>
        <p className="text-gray-400 text-center mt-2">
          Manage your characters, currency, and other items.
        </p>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {sampleItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#121826] border border-[#3b82f6] rounded-xl p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#1e293b]"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="absolute top-2 right-2 bg-[#3b82f6] text-white text-xs font-bold rounded-lg px-2 py-1">
                  {item.type}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-[#fff]">{item.name}</h2>
              <p className="text-gray-300 text-sm mt-1">
                Value: {item.value} $Kino
              </p>
            </div>
          ))}
        </div>

        <button
          className="w-full bg-[#3b82f6] text-white mt-[40px] py-2 rounded-lg hover:bg-[#2563eb] transition-all"
          onClick={() => setActiveTab("shop")}
        >
          Shop
        </button>

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#1e293b] p-8 rounded-xl max-w-lg w-full">
              <h2 className="text-2xl font-semibold text-[#3b82f6] mb-4">
                Item Details
              </h2>
              <div className="flex items-center gap-6 mb-4">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedItem.name}
                  </h3>
                  <p className="text-gray-400">{selectedItem.type}</p>
                  <p className="text-gray-300 mt-2">
                    Value: {selectedItem.value} $Kino
                  </p>
                </div>
              </div>
              <button
                className="w-full bg-[#3b82f6] text-white py-2 rounded-lg hover:bg-[#2563eb] transition-all"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}