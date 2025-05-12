import { useState, useEffect } from "react";

interface Character {
  name: string;
  health: number;
  attack: number;
  defense: number;
  imageUrl: string;
}

interface Dungeon {
  name: string;
  rank: string;
  boss: Character;
  rewards: string[];
}

const initialCharacters: Character[] = [
  {
    name: "Warrior A",
    health: 100,
    attack: 30,
    defense: 20,
    imageUrl: "/images/warrior1.png",
  },
  {
    name: "Warrior B",
    health: 120,
    attack: 25,
    defense: 25,
    imageUrl: "/images/warrior2.png",
  },
];

const initialDungeon: Dungeon = {
  name: "The Forbidden Cave",
  rank: "E",
  boss: {
    name: "Cave Boss",
    health: 200,
    attack: 40,
    defense: 30,
    imageUrl: "/images/boss.png",
  },
  rewards: ["$Kino", "Gemstone", "Star"],
};

const BattleSystem: React.FC = () => {
  const [battleMode, setBattleMode] = useState<"story" | "campaign" | "challenge">("campaign");
  const [selectedSquad, setSelectedSquad] = useState<Character[]>([]);
  const [battleOutcome, setBattleOutcome] = useState<string | null>(null);
  const [battleInProgress, setBattleInProgress] = useState<boolean>(false);
  const [dungeon, setDungeon] = useState<Dungeon>(initialDungeon);

  useEffect(() => {
    if (selectedSquad.length === 0) {
      setBattleOutcome(null);
    }
  }, [selectedSquad]);

  const startBattle = () => {
    setBattleInProgress(true);
    setBattleOutcome(null);
    
    // Simulate battle process
    setTimeout(() => {
      const outcome = simulateBattle(selectedSquad, dungeon.boss);
      setBattleOutcome(outcome);
      setBattleInProgress(false);
    }, 3000); // Simulated battle duration
  };

  const simulateBattle = (squad: Character[], boss: Character): string => {
    let squadHealth = squad.reduce((sum, character) => sum + character.health, 0);
    let bossHealth = boss.health;

    while (squadHealth > 0 && bossHealth > 0) {
      squad.forEach((character) => {
        if (bossHealth > 0) {
          // Each character attacks the boss
          bossHealth -= Math.max(0, character.attack - boss.defense);
        }
      });

      if (bossHealth <= 0) {
        return "Victory! You defeated the boss.";
      }

      // Boss attacks back
      squadHealth -= Math.max(0, boss.attack - squad.reduce((sum, char) => sum + char.defense, 0));
      if (squadHealth <= 0) {
        return "Defeat... Your squad has been wiped out.";
      }
    }

    return "Draw! Both sides are too powerful!";
  };

  const handleSquadSelection = (character: Character) => {
    setSelectedSquad((prevSquad) => {
      if (prevSquad.includes(character)) {
        return prevSquad.filter((char) => char !== character);
      }
      return [...prevSquad, character];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1e293b] to-[#0f172a] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold text-[#3b82f6] mb-6">Battle System</h1>
      
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-lg ${battleMode === "story" ? "bg-[#3b82f6]" : "bg-[#4b5563]"} text-white`}
          onClick={() => setBattleMode("story")}
        >
          Story Mode
        </button>
        <button
          className={`px-6 py-2 rounded-lg ${battleMode === "campaign" ? "bg-[#3b82f6]" : "bg-[#4b5563]"} text-white`}
          onClick={() => setBattleMode("campaign")}
        >
          Campaign Mode
        </button>
        <button
          className={`px-6 py-2 rounded-lg ${battleMode === "challenge" ? "bg-[#3b82f6]" : "bg-[#4b5563]"} text-white`}
          onClick={() => setBattleMode("challenge")}
        >
          Challenge Mode
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#fff] mb-4">Choose Your Squad</h2>
        <div className="flex gap-6">
          {initialCharacters.map((character) => (
            <div
              key={character.name}
              className="bg-[#121826] border border-[#3b82f6] rounded-xl p-4 cursor-pointer hover:bg-[#3b82f6] transition-all"
              onClick={() => handleSquadSelection(character)}
            >
              <img src={character.imageUrl} alt={character.name} className="w-24 h-24 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-semibold">{character.name}</h3>
              <p className="text-sm text-gray-400">Health: {character.health}</p>
              <p className="text-sm text-gray-400">Attack: {character.attack}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-[#fff] mb-4">Dungeon: {dungeon.name}</h3>
          <div className="bg-[#121826] border border-[#3b82f6] rounded-xl p-6">
            <img
              src={dungeon.boss.imageUrl}
              alt={dungeon.boss.name}
              className="w-36 h-36 object-cover rounded-lg mb-4 mx-auto"
            />
            <h3 className="text-2xl font-semibold">{dungeon.boss.name}</h3>
            <p className="text-sm text-gray-400">Boss Rank: {dungeon.rank}</p>
            <p className="text-sm text-gray-400">Rewards: {dungeon.rewards.join(", ")}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            className="bg-[#3b82f6] text-white py-2 px-8 rounded-lg font-bold text-lg hover:bg-[#2563eb] transition-all"
            onClick={startBattle}
            disabled={battleInProgress || selectedSquad.length === 0}
          >
            {battleInProgress ? "Battle in Progress..." : "Start Battle"}
          </button>
        </div>

        {battleOutcome && (
          <div className="mt-8 text-xl font-semibold text-[#fff]">
            <h3>{battleOutcome}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleSystem;