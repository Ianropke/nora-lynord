import { BookOpen, Trophy, ArrowLeft, Lock, Star } from "lucide-react";
import type { Progress } from "../hooks/useProgress";
import { stories, type Story } from "../data/stories";
import { regions } from "../data/words";

interface StoryShelfProps {
  progress: Progress;
  onSelectStory: (storyId: string) => void;
  onBack: () => void;
}

export function StoryShelf({ progress, onSelectStory, onBack }: StoryShelfProps) {
  // Helper to determine if a region is unlocked
  const isRegionUnlocked = (regionId: string) => {
    if (regionId === "kanto") return true;
    if (regionId === "johto") return progress.unlockedWorlds.includes(13);
    if (regionId === "hoenn") return progress.unlockedWorlds.includes(25);
    if (regionId === "sinnoh") return progress.unlockedWorlds.includes(37);
    return false;
  };

  const completedStoriesCount = progress.completedStories?.length ?? 0;

  return (
    <div className="min-h-full px-4 py-6 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <button
          onClick={onBack}
          className="btn-touch glass rounded-full p-3 hover:bg-white/20 transition-colors"
          aria-label="Gå tilbage"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl font-black text-white text-center flex-1 poke-title flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-yellow-400" />
          Noras Læsehjørne
        </h1>
        <div className="w-12" />
      </div>

      {/* Stats Card */}
      <div className="glass-strong rounded-3xl p-5 mb-8 animate-pop-in border border-white/10 flex justify-between items-center relative overflow-hidden pokeball-bg">
        <div>
          <h2 className="text-lg font-black text-white">Din bogreol</h2>
          <p className="text-xs text-white/60 mt-1">
            Læs historier og optjen 10 stjerner pr. bog! ⭐
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2.5 rounded-full text-sm font-black shadow-lg">
          <Star className="w-5 h-5 fill-current" />
          <span>{completedStoriesCount} / {stories.length} Læst</span>
        </div>
      </div>

      {/* Books grid by Region */}
      <div className="space-y-8 pb-12">
        {regions.map((region) => {
          const unlocked = isRegionUnlocked(region.id);
          const regionStories = stories.filter((s) => s.regionId === region.id);

          return (
            <div key={region.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{region.id === "kanto" ? "🔴" : region.id === "johto" ? "🔵" : region.id === "hoenn" ? "🟢" : "🟡"}</span>
                <h3 className="font-extrabold text-white text-lg">{region.name}</h3>
                {!unlocked && (
                  <span className="text-xs bg-black/40 text-white/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Låst
                  </span>
                )}
              </div>

              <div className={`grid grid-cols-1 gap-3 ${!unlocked ? "opacity-40 pointer-events-none" : ""}`}>
                {regionStories.map((story) => {
                  const isRead = progress.completedStories?.includes(story.id);

                  return (
                    <button
                      key={story.id}
                      onClick={() => unlocked && onSelectStory(story.id)}
                      className={`
                        btn-touch w-full rounded-2xl p-4 flex items-center gap-4 text-left relative overflow-hidden
                        glass hover:bg-white/10 active:scale-[0.99] transition-all border border-white/5
                      `}
                    >
                      {/* Read status icon */}
                      {isRead && (
                        <div className="absolute top-2.5 right-2.5 bg-yellow-400 rounded-full p-1 shadow animate-bounce">
                          <Star className="w-3.5 h-3.5 text-gray-900 fill-current" />
                        </div>
                      )}

                      <div className="bg-white/10 rounded-xl p-3 text-3xl">
                        {story.emoji}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold text-white leading-tight text-base">
                          {story.title}
                        </h4>
                        <p className="text-xs text-white/60 mt-1 flex items-center gap-1.5 font-medium">
                          <span>Med: {story.pokemon}</span>
                          <span>•</span>
                          <span>Træningsbøger</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
