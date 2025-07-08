"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CharacterModel } from '@/types/CharacterModel';
import { IconCheck, IconX, IconSwords } from '@tabler/icons-react';

interface CharacterSelectionProps {
  availableCharacters: CharacterModel[];
  onStartBattle: (selectedCharacters: CharacterModel[]) => void;
  onCancel: () => void;
  maxSelections?: number;
}

export default function CharacterSelection({
  availableCharacters,
  onStartBattle,
  onCancel,
  maxSelections = 5
}: CharacterSelectionProps) {
  const [selectedCharacters, setSelectedCharacters] = useState<CharacterModel[]>([]);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');

  const handleCharacterSelect = (character: CharacterModel) => {
    // Check if character is already selected
    if (selectedCharacters.some(c => c._id === character._id)) {
      setSelectedCharacters(selectedCharacters.filter(c => c._id !== character._id));
      return;
    }

    // Check if max selections reached
    if (selectedCharacters.length >= maxSelections) {
      setWarningMessage(`You can only select up to ${maxSelections} characters`);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
      return;
    }

    setSelectedCharacters([...selectedCharacters, character]);
  };

  const handleStartBattle = () => {
    if (selectedCharacters.length === 0) {
      setWarningMessage('You must select at least one character');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
      return;
    }

    onStartBattle(selectedCharacters);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50 items-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-[#d3af37]/50 rounded-xl p-6 max-w-4xl w-full shadow-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#d3af37]">Select Characters for Battle</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <IconX size={24} />
          </button>
        </div>

        {showWarning && (
          <div className="bg-red-900/30 border border-red-500/30 rounded p-2 mb-4 text-center">
            {warningMessage}
          </div>
        )}

        <div className="mb-4 bg-gray-800/50 p-3 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Selected: {selectedCharacters.length}/{maxSelections}</h3>
          {selectedCharacters.length === 0 ? (
            <p className="text-gray-400">No characters selected</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedCharacters.map(character => (
                <div
                  key={character._id}
                  className="flex items-center bg-gray-700/50 rounded-full pl-2 pr-3 py-1"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2 relative">
                    {character.image_url && (
                      <Image
                        src={character.image_url}
                        alt={character.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="text-sm">{character.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto mb-6">
          {availableCharacters.map(character => {
            const isSelected = selectedCharacters.some(c => c._id === character._id);
            return (
              <div
                key={character._id}
                className={`relative bg-gray-800/40 rounded-lg p-3 cursor-pointer border-2 transition-colors ${isSelected ? 'border-[#d3af37]' : 'border-transparent hover:border-[#d3af37]/50'
                  }`}
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                    {character.image_url && (
                      <Image
                        src={character.image_url}
                        alt={character.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{character.name}</h4>
                    <div className="grid grid-cols-2 gap-x-3 text-sm text-gray-300">
                      <span>HP: {character.stats.hp}</span>
                      <span>DMG: {character.stats.dmg}</span>
                      <span>ARM: {character.stats.armor}</span>
                      <span>SPD: {character.stats.speed}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#d3af37] text-black rounded-full p-1">
                      <IconCheck size={16} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg border border-[#d3af37]/50 text-[#d3af37] hover:bg-[#d3af37]/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartBattle}
            disabled={selectedCharacters.length === 0}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${selectedCharacters.length > 0
                ? 'bg-[#d3af37] hover:bg-[#c2a030] text-black'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              } transition-colors`}
          >
            <IconSwords size={20} />
            Start Battle
          </button>
        </div>
      </div>
    </div>
  );
}