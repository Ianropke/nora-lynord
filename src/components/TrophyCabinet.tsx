import { Trophy, Star, ArrowLeft } from "lucide-react";
import type { Progress } from "../hooks/useProgress";
import { worlds } from "../data/words";

interface TrophyCabinetProps {
  progress: Progress;
  onBack: () => void;
}

const PRIZES = [
  { stars: 10, name: "Pokéball", emoji: "🔴" },
  { stars: 25, name: "Pikachu Bamse", emoji: "⚡" },
  { stars: 50, name: "Great Ball", emoji: "🔵" },
  { stars: 75, name: "Eevee Bamse", emoji: "🦊" },
  { stars: 100, name: "Ultra Ball", emoji: "🟡" },
  { stars: 120, name: "Mew Bamse", emoji: "✨" },
  { stars: 150, name: "Master Ball", emoji: "🟣" },
  { stars: 200, name: "Lugia Bamse", emoji: "🌊" },
  { stars: 240, name: "Guld Pokal", emoji: "🏆" },
];

export function TrophyCabinet({ progress, onBack }: TrophyCabinetProps) {
  // Compute how many badges were earned
  const earnedBadges = worlds.filter((w) =>
    progress.completedWorlds.includes(w.id)
  );

  return (
    <div className="min-h-full px-4 py-6 flex flex-col max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <button
          onClick={onBack}
          className="btn-touch glass rounded-full p-3 hover:bg-white/20 transition-colors"
          aria-label="Gå tilbage"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl font-black text-white text-center flex-1">
          Præmieskab
        </h1>
        <div className="w-12" />
      </div>

      <div className="space-y-8 pb-12">
        {/* Star Prizes Section */}
        <div className="glass-strong rounded-3xl p-6 animate-pop-in">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <h2 className="text-xl font-bold text-white">Stjerne-præmier</h2>
            <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-bold text-white">
              {progress.stars} ⭐
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {PRIZES.map((prize) => {
              const unlocked = progress.stars >= prize.stars;
              return (
                <div
                  key={prize.stars}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${
                    unlocked
                      ? "bg-white/20 shadow-lg animate-float"
                      : "bg-black/20 opacity-50 grayscale"
                  }`}
                >
                  <span className="text-4xl mb-2 drop-shadow-md">
                    {unlocked ? prize.emoji : "❓"}
                  </span>
                  <span className="text-xs font-bold text-white text-center leading-tight">
                    {unlocked ? prize.name : `${prize.stars} ⭐`}
                  </span>
                  {unlocked && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-full animate-bounce">
                      NY!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Section */}
        <div className="glass-strong rounded-3xl p-6 animate-pop-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Gym Badges</h2>
            <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-bold text-white">
              {earnedBadges.length} / {worlds.length}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {worlds.map((world) => {
              const unlocked = progress.completedWorlds.includes(world.id);
              return (
                <div
                  key={world.id}
                  className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${
                    unlocked
                      ? "bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-xl scale-100 hover:scale-110"
                      : "bg-black/20 scale-95 opacity-30"
                  }`}
                  title={world.name}
                >
                  {unlocked ? world.emoji : "🔒"}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
