export default function GameWorldPanel() {
  const dungeons = [
    { id: 1, name: "Forest of Echoes", level: "1-5", players: 3, status: "Open" },
    { id: 2, name: "Crystal Caves", level: "5-10", players: 1, status: "Open" },
    { id: 3, name: "Shadow Temple", level: "10-15", players: 0, status: "Locked" },
  ];

  const nearbyPlayers = [
    { id: 1, name: "DragonSlayer", level: 4, status: "In Battle" },
    { id: 2, name: "MysticMage", level: 3, status: "Available" },
    { id: 3, name: "ShadowHunter", level: 5, status: "In Dungeon" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dungeons Section */}
      <div className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4">
        <h2 className="text-2xl font-bold text-[#d3af37] mb-4">Available Dungeons</h2>
        <div className="space-y-4">
          {dungeons.map((dungeon) => (
            <button
              key={dungeon.id}
              disabled={dungeon.status === "Locked"}
              className={`w-full p-4 rounded-lg ${dungeon.status === "Locked"
                ? "bg-gray-800/50 opacity-50 cursor-not-allowed"
                : "bg-gradient-to-r from-[#1a0e05]/80 to-[#1a0e05]/40 hover:from-[#d3af37]/10 hover:to-[#1a0e05]/60"
                } transition-all duration-300 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(211,175,55,0.15)]`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[#d3af37]">{dungeon.name}</h3>
                  <p className="text-sm text-gray-400">Level {dungeon.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#d3af37]">{dungeon.players} players</p>
                  <p className="text-sm text-gray-400">{dungeon.status}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Players Section */}
      <div className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-4">
        <h2 className="text-2xl font-bold text-[#d3af37] mb-4">Nearby Players</h2>
        <div className="space-y-4">
          {nearbyPlayers.map((player) => (
            <div
              key={player.id}
              className="p-4 rounded-lg bg-gradient-to-r from-[#1a0e05]/80 to-[#1a0e05]/40 hover:from-[#d3af37]/10 hover:to-[#1a0e05]/60 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(211,175,55,0.15)]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[#d3af37]">{player.name}</h3>
                  <p className="text-sm text-gray-400">Level {player.level}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${player.status === "Available"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
                  } backdrop-blur-sm`}>
                  {player.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}