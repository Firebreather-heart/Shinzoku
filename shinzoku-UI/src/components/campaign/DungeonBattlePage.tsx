import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DungeonModel, DemonModel } from '@/types/DungeonModel';
import { CharacterModel } from '@/types/CharacterModel';
import { ShinzokuAPI } from '@/services/ShinzokuAPI';
import { useNftInventory } from '@/hooks/useNftInventory';
import AutoBattleSystem from '../battle/AutoBattleSystem';
import { BattleActionLog } from '@/services/BattleSimulator';

interface DungeonBattlePageProps {
  dungeonId: string;
  onBack: () => void;
}

export default function DungeonBattlePage({ dungeonId, onBack }: DungeonBattlePageProps) {
  const [dungeon, setDungeon] = useState<DungeonModel | null>(null);
  const [demons, setDemons] = useState<DemonModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<CharacterModel[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Get characters from inventory
  const { characters, loading: inventoryLoading } = useNftInventory(true);

  useEffect(() => {
    const fetchDungeonData = async () => {
      try {
        const dungeonData = await ShinzokuAPI.getDungeonById(dungeonId);
        if (dungeonData) {
          setDungeon(dungeonData);
          // Set difficulty based on dungeon rank
          if (dungeonData.rank_name) {
            const rankName = dungeonData.rank_name.toUpperCase();
            if (['S', 'SS', 'SSS'].includes(rankName)) {
              setDifficulty('hard');
            } else if (['A', 'B'].includes(rankName)) {
              setDifficulty('medium');
            } else {
              setDifficulty('easy');
            }
          }

          // Fetch all demons for this dungeon
          const demonPromises = [
            dungeonData.boss,
            ...dungeonData.members,
          ].map(demon => ShinzokuAPI.getDemonById(demon._id));

          const demonData = await Promise.all(demonPromises);
          setDemons(demonData.filter((demon: DemonModel | null): demon is DemonModel => demon !== null));
        }
      } catch (error) {
        console.error('Error fetching dungeon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDungeonData();
  }, [dungeonId]);

  const toggleCharacterSelection = (character: CharacterModel) => {
    if (isBattleStarted) return;

    const isSelected = selectedCharacters.some(c => c.shinzoku_id === character.shinzoku_id);
    if (isSelected) {
      setSelectedCharacters(selectedCharacters.filter(c => c.shinzoku_id !== character.shinzoku_id));
    } else {
      if (selectedCharacters.length < 4) {
        setSelectedCharacters([...selectedCharacters, character]);
      }
    }
  };

  const startBattle = () => {
    if (selectedCharacters.length === 0) return;
    setIsBattleStarted(true);
  };

  const handleBattleComplete = (result: { victory: boolean; logs: BattleActionLog[] }) => {
    // Handle rewards, experience, etc.
    console.log('Battle completed:', result);

    // You can add reward processing logic here
    if (result.victory) {
      // Process rewards: XP, items, etc.
      alert(`Victory! You've earned ${dungeon?.rewards.exp} XP and ${dungeon?.rewards.gold} Gold!`);
    } else {
      alert('Defeat! Better luck next time.');
    }
  };

  if (loading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3af37]"></div>
      </div>
    );
  }

  const boss = demons.find(demon => demon._id === dungeon?.boss._id);
  const regularDemons = demons.filter(demon => demon._id !== dungeon?.boss._id);

  return (
    <div className="p-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-[#d3af37] mb-4 hover:text-[#c2a030] transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Campaign
      </button>

      <div className="max-w-6xl mx-auto">
        {!isBattleStarted ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#d3af37]">{dungeon?.name}</h1>
                <p className="text-gray-400 mt-2">{dungeon?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl text-[#d3af37]">Rank {dungeon?.rank_name}</div>
                <div className="text-gray-400">
                  Rewards: {dungeon?.rewards.exp} XP • {dungeon?.rewards.gold} Gold
                </div>
              </div>
            </div>

            {/* Dungeon Image */}
            <div className="relative w-full h-64 mb-8">
              {dungeon?.image_url && (
                <Image
                  src={dungeon.image_url}
                  alt={dungeon.name}
                  fill
                  className="object-cover rounded-xl"
                />
              )}
            </div>

            {/* Character Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#d3af37] mb-4">Select Your Squad (Max 4)</h2>

              {characters.length === 0 ? (
                <div className="bg-gray-800/50 p-6 text-center rounded-lg">
                  <p className="text-gray-400">No characters found in your inventory.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {characters.map(character => (
                    <div
                      key={character.shinzoku_id}
                      onClick={() => toggleCharacterSelection(character)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedCharacters.some(c => c.shinzoku_id === character.shinzoku_id)
                          ? 'border-[#d3af37] bg-[#d3af37]/10'
                          : 'border-gray-800 hover:border-gray-700'
                        }`}
                    >
                      <div className="aspect-square bg-gray-900 rounded mb-3 overflow-hidden">
                        {character.image_url && (
                          <Image
                            src={character.image_url}
                            alt={character.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <h3 className="font-medium text-[#d3af37]">{character.name}</h3>
                      <div className="mt-1 flex flex-col text-sm text-gray-400">
                        <span>HP: {character.stats.hp}</span>
                        <span>DMG: {character.stats.dmg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <button
                onClick={startBattle}
                disabled={selectedCharacters.length === 0}
                className={`px-8 py-3 rounded-lg text-lg transition-colors ${selectedCharacters.length > 0
                    ? 'bg-[#d3af37] hover:bg-[#c2a030] text-black font-bold'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Start Battle
              </button>
            </div>
          </>
        ) : (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-[#d3af37] mb-6">Battle in Progress</h2>
            <AutoBattleSystem
              playerCharacters={selectedCharacters}
              enemies={[...regularDemons, boss].filter(Boolean)}
              difficulty={difficulty}
              onBattleComplete={handleBattleComplete}
              autoStart={false}
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsBattleStarted(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Return to Dungeon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}