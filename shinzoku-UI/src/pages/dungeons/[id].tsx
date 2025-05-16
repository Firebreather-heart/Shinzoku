import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShinzokuAPI } from '@/services/ShinzokuAPI';
import { DungeonModel, DemonModel } from '@/types/DungeonModel';
// import { DemonModel } from '@/types/DemonModel';
import Layout from '@/components/layout/Layout';

export default function DungeonBattlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [dungeon, setDungeon] = useState<DungeonModel | null>(null);
  const [demons, setDemons] = useState<DemonModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDungeonData = async () => {
      if (!id) return;
      try {
        const dungeonData = await ShinzokuAPI.getDungeonById(id as string);
        if (dungeonData) {
          setDungeon(dungeonData);
          // Fetch all demons for this dungeon
          const demonPromises = [
            dungeonData.boss,
            ...dungeonData.members,
          ].map(demon => ShinzokuAPI.getDemonById(demon._id));

          const demonData = await Promise.all(demonPromises);
          setDemons(demonData.filter((demon): demon is DemonModel => demon !== null));
        }
      } catch (error) {
        console.error('Error fetching dungeon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDungeonData();
  }, [id]);

  if (loading || !dungeon) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3af37]"></div>
        </div>
      </Layout>
    );
  }

  const boss = demons.find(demon => demon._id === dungeon.boss._id);
  const regularDemons = demons.filter(demon => demon._id !== dungeon.boss._id);

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#d3af37] mb-4 hover:text-[#c2a030] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Campaign
          </button>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#d3af37]">{dungeon.name}</h1>
              <p className="text-gray-400 mt-2">{dungeon.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl text-[#d3af37]">Rank {dungeon.rank_name}</div>
              <div className="text-gray-400">
                Rewards: {dungeon.rewards.exp} XP • {dungeon.rewards.gold} Gold
              </div>
            </div>
          </div>

          {/* Dungeon Image */}
          <div className="relative w-full h-64 mb-8">
            <Image
              src={dungeon.image_url}
              alt={dungeon.name}
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* Boss Section */}
          {boss && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Boss</h2>
              <div className="bg-gradient-to-r from-red-900/30 to-black border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="relative w-24 h-24">
                    <Image
                      src={boss.image_url}
                      alt={boss.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-red-400">{boss.name}</h3>
                    <p className="text-gray-400">{boss.type} • Rank {boss.rank_name}</p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-gray-400">HP: {boss.stats.hp}</div>
                      <div className="text-gray-400">DMG: {boss.stats.dmg}</div>
                      <div className="text-gray-400">DEF: {boss.stats.armor}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Demons */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#d3af37] mb-4">Demons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularDemons.map((demon) => (
                <div
                  key={demon._id}
                  className="bg-gradient-to-r from-gray-900/50 to-black border border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center">
                    <div className="relative w-16 h-16">
                      <Image
                        src={demon.image_url}
                        alt={demon.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{demon.name}</h3>
                      <p className="text-gray-400 text-sm">{demon.type} • Rank {demon.rank_name}</p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-sm text-gray-400">HP: {demon.stats.hp}</div>
                        <div className="text-sm text-gray-400">DMG: {demon.stats.dmg}</div>
                        <div className="text-sm text-gray-400">DEF: {demon.stats.armor}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Battle Button */}
          <div className="flex justify-center">
            <button className="px-8 py-3 bg-[#d3af37] hover:bg-[#c2a030] text-black font-bold rounded-lg text-lg transition-colors">
              Start Battle
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}