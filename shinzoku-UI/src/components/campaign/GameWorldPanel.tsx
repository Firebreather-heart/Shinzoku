import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DungeonModel } from '@/types/DungeonModel';
import { ShinzokuAPI } from '@/services/ShinzokuAPI';
import DungeonBattlePage from './DungeonBattlePage';

export default function GameWorldPanel() {
  const [dungeons, setDungeons] = useState<DungeonModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDungeonId, setSelectedDungeonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDungeons = async () => {
      try {
        const dungeonData = await ShinzokuAPI.getDungeons();
        setDungeons(dungeonData);
      } catch (error) {
        console.error('Error fetching dungeons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDungeons();
  }, []);

  // Function to get difficulty class based on rank name
  const getDifficultyClass = (rank_name: string): string => {
    switch (rank_name) {
      case 'SSS':
      case 'SS':
      case 'S':
        return 'text-red-500';
      case 'A':
        return 'text-yellow-500';
      case 'B':
      case 'C':
        return 'text-blue-500';
      default:
        return 'text-green-500';
    }
  };

  if (selectedDungeonId) {
    return (
      <DungeonBattlePage
        dungeonId={selectedDungeonId}
        onBack={() => setSelectedDungeonId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d3af37]"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dungeons Section */}
      <div className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4">
        <h2 className="text-2xl font-bold text-[#d3af37] mb-4">Available Dungeons</h2>
        <div className="space-y-4">
          {dungeons.map((dungeon) => (
            <button
              key={dungeon._id}
              onClick={() => {
                setSelectedDungeonId(dungeon._id);
              }}
              className="w-full p-4 rounded-lg bg-gradient-to-r from-[#1a0e05]/80 to-[#1a0e05]/40 hover:from-[#d3af37]/10 hover:to-[#1a0e05]/60 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(211,175,55,0.15)]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={dungeon.image_url}
                      alt={dungeon.name}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#d3af37]">{dungeon.name}</h3>
                    <p className="text-sm text-gray-400">{dungeon.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#d3af37]">
                    {dungeon.rewards.exp} XP • {dungeon.rewards.gold} Gold
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Rank {dungeon.rank_name}</span>
                    <span className={`text-xs font-semibold ${getDifficultyClass(dungeon.rank_name)}`}>
                      {dungeon.rank_name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {dungeon.members.length + 1} Demons
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Preview Section */}
      <div className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4">
        <h2 className="text-2xl font-bold text-[#d3af37] mb-4">World Map</h2>
        <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Map Coming Soon</span>
        </div>
      </div>
    </div>
  );
}