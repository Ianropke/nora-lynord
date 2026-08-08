import { Calculator, ArrowLeft, Lock, Star } from "lucide-react";
import type { Progress } from "../hooks/useProgress";
import { mathQuizzes, mathRegions } from "../data/math";

interface MathShelfProps {
  progress: Progress;
  onSelectQuiz: (quizId: string) => void;
  onBack: () => void;
}

export function MathShelf({ progress, onSelectQuiz, onBack }: MathShelfProps) {
  // Helper to determine if a math region is unlocked
  const isRegionUnlocked = (regionId: string): boolean => {
    if (regionId === "kanto") return true;
    
    // Check if unlocked via word trainer (for first 4 regions)
    if (regionId === "johto" && progress.unlockedWorlds.includes(13)) return true;
    if (regionId === "hoenn" && progress.unlockedWorlds.includes(25)) return true;
    if (regionId === "sinnoh" && progress.unlockedWorlds.includes(37)) return true;

    // Region sequence unlocking: previous region's quizzes must all be completed
    const regionOrder = ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar"];
    const idx = regionOrder.indexOf(regionId);
    if (idx > 0) {
      const prevRegionId = regionOrder[idx - 1];
      if (!isRegionUnlocked(prevRegionId)) return false;
      const prevQuizzes = mathQuizzes.filter(q => q.regionId === prevRegionId);
      return prevQuizzes.every(q => progress.completedMathQuizzes?.includes(q.id));
    }
    return false;
  };

  const completedQuizzesCount = progress.completedMathQuizzes?.length ?? 0;

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
          <Calculator className="w-6 h-6 text-blue-400" />
          Noras Regnehjørne
        </h1>
        <div className="w-12" />
      </div>

      {/* Stats Card */}
      <div className="glass-strong rounded-3xl p-5 mb-8 animate-pop-in border border-white/10 flex justify-between items-center relative overflow-hidden pokeball-bg">
        <div>
          <h2 className="text-lg font-black text-white">Regne-Udfordringer</h2>
          <p className="text-xs text-white/60 mt-1">
            Løs opgaver og optjen 10 stjerner pr. opgave! ⭐
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2.5 rounded-full text-sm font-black shadow-lg">
          <Star className="w-5 h-5 fill-current" />
          <span>{completedQuizzesCount} / {mathQuizzes.length} Klaret</span>
        </div>
      </div>

      {/* Quizzes grid by Region */}
      <div className="space-y-8 pb-12">
        {mathRegions.map((region) => {
          const unlocked = isRegionUnlocked(region.id);
          const regionQuizzes = mathQuizzes.filter((q) => q.regionId === region.id);

          return (
            <div key={region.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{region.badgeEmoji}</span>
                  <div>
                    <h3 className="font-extrabold text-white text-lg leading-tight">{region.name}</h3>
                    <p className="text-xs text-white/50">{region.description}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/20">
                        🇩🇰 {region.dkGrade}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/20">
                        🇮🇳 {region.inGrade}
                      </span>
                    </div>
                  </div>
                </div>
                {!unlocked && (
                  <span className="text-xs bg-black/40 text-white/50 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                    <Lock className="w-3 h-3" /> Låst
                  </span>
                )}
              </div>

              <div className={`grid grid-cols-1 gap-3 ${!unlocked ? "opacity-40 pointer-events-none" : ""}`}>
                {regionQuizzes.map((quiz) => {
                  const isCompleted = progress.completedMathQuizzes?.includes(quiz.id);

                  return (
                    <button
                      key={quiz.id}
                      onClick={() => unlocked && onSelectQuiz(quiz.id)}
                      className={`
                        btn-touch w-full rounded-2xl p-4 flex items-center gap-4 text-left relative overflow-hidden
                        glass hover:bg-white/10 active:scale-[0.99] transition-all border border-white/5
                      `}
                    >
                      {/* Completion star status */}
                      {isCompleted && (
                        <div className="absolute top-2.5 right-2.5 bg-yellow-400 rounded-full p-1 shadow animate-bounce">
                          <Star className="w-3.5 h-3.5 text-gray-900 fill-current" />
                        </div>
                      )}

                      <div className="bg-white/10 rounded-xl p-3 text-3xl">
                        {quiz.emoji}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold text-white leading-tight text-base">
                          {quiz.title}
                        </h4>
                        <p className="text-xs text-white/60 mt-1 flex items-center gap-1.5 font-medium">
                          <span>Med: {quiz.pokemon}</span>
                          <span>•</span>
                          <span>{quiz.questions.length} opgaver</span>
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
