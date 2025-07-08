import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CharacterModel } from '@/types/CharacterModel';
import { IconUser, IconCheckCircle } from '@tabler/icons-react';

interface CharacterSelectionModalProps {
  availableCharacters: CharacterModel[];
  onStartBattle: (selectedCharacters: CharacterModel[]) => void;
  onCancel: () => void;
  maxSelections?: number;
}

export default function CharacterSelectionModal({
  availableCharacters,
  onStartBattle,
  onCancel,
  maxSelections = 5
}: CharacterSelectionModalProps) {
  const [selectedCharacters, setSelectedCharacters] = useState<CharacterModel[]>([]);

  const handleCharacterSelect = (character: CharacterModel) => {
    // If character is already selected, remove it
    if (selectedCharacters.some(c => c._id === character._id)) {
      setSelectedCharacters(prev => prev.filter(c => c._id !== character._id));
      return;
    }

    // If max selections reached, don't add more
    if (selectedCharacters.length >= maxSelections) {
      return;
    }

    // Add character to selected list
    setSelectedCharacters(prev => [...prev, character]);
  };

  const isCharacterSelected = (character: CharacterModel): boolean => {
    return selectedCharacters.some(c => c._id === character._id);
  };

  const handleStartBattle = () => {
    if (selectedCharacters.length > 0) {
      onStartBattle(selectedCharacters);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-[#d3af37]/50 rounded-xl p-6 max-w-4xl w-full shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#d3af37]">Select Your Team</h2>
          <div className="text-gray-400">
            {selectedCharacters.length} / {maxSelections} Selected
          </div>
        </div>

        {availableCharacters.length === 0 ? (
          <div className="bg-gray-800/50 p-6 text-center rounded-lg">
            <IconUser size={48} className="mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400">No characters available for battle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-[50vh] overflow-y-auto p-2">
            {availableCharacters.map((character) => (
              <div
                key={character._id}
                className={`bg-gradient-to-b from-gray-900/70 to-black/70 border rounded-lg overflow-hidden cursor-pointer transition-all ${isCharacterSelected(character)
                    ? 'border-[#d3af37] shadow-[0_0_15px_rgba(211,175,55,0.3)]'
                    : 'border-gray-700 hover:border-gray-500'
                  }`}
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="relative h-32 overflow-hidden">
                  {character.image_url && (
                    <Image
                      src={character.image_url}
                      alt={character.name}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-lg font-semibold text-white">{character.name}</h3>
                    <p className="text-sm text-gray-300">{character.rarity} • {character.rank_name}</p>
                  </div>

                  {isCharacterSelected(character) && (
                    <div className="absolute top-2 right-2 bg-[#d3af37] rounded-full">
                      <IconCheckCircle size={24} className="text-black" />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400">HP</div>
                      <div className="font-medium">{character.stats?.hp || '??'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">DMG</div>
                      <div className="font-medium">{character.stats?.dmg || '??'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">ARM</div>
                      <div className="font-medium">{character.stats?.armor || '??'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="py-2 px-6 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartBattle}
            disabled={selectedCharacters.length === 0}
            className={`py-2 px-6 rounded-lg transition-colors ${selectedCharacters.length === 0
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#d3af37] hover:bg-[#c2a030] text-black font-semibold'
              }`}
          >
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
}