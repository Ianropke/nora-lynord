import { ArrowLeft, Star, Calculator } from "lucide-react";
import type { Progress } from "../hooks/useProgress";

interface TimesTableShelfProps {
  progress: Progress;
  onSelectTable: (tableId: number) => void;
  onBack: () => void;
}

export function TimesTableShelf({ progress, onSelectTable, onBack }: TimesTableShelfProps) {
  const tables = Array.from({ length: 20 }, (_, i) => i + 1);
  const completedCount = progress.completedTimesTables?.length ?? 0;

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
          <span className="text-2xl">✖️</span>
          Noras Tabeller
        </h1>
        <div className="w-12" />
      </div>

      {/* Stats Card */}
      <div className="glass-strong rounded-3xl p-5 mb-8 animate-pop-in border border-white/10 flex justify-between items-center relative overflow-hidden pokeball-bg">
        <div>
          <h2 className="text-lg font-black text-white">Tabeller</h2>
          <p className="text-xs text-white/60 mt-1">
            Gennemfør for at få 10 stjerner! ⭐
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2.5 rounded-full text-sm font-black shadow-lg">
          <Star className="w-5 h-5 fill-current" />
          <span>{completedCount} / 20 Klaret</span>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 flex-1 flex flex-col animate-slide-up stagger-1 border border-white/10 shadow-xl relative overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />
        
        <p className="text-white/80 text-center mb-6 font-bold text-lg relative z-10">
          Vælg en tabel at øve dig på!
        </p>

        <div className="grid grid-cols-4 gap-3 relative z-10">
          {tables.map((tableId, i) => {
            const isCompleted = progress.completedTimesTables?.includes(tableId);
            return (
              <button
                key={tableId}
                onClick={() => onSelectTable(tableId)}
                className={`
                  btn-touch rounded-2xl aspect-square flex flex-col items-center justify-center relative overflow-hidden
                  animate-pop-in border border-white/10 shadow-lg transition-all duration-200
                  ${isCompleted 
                    ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-900 border-yellow-300/50' 
                    : 'glass hover:bg-white/20 active:scale-[0.95] text-white'}
                `}
                style={{ animationDelay: `${(i % 10) * 0.05}s` }}
              >
                <span className="text-2xl font-black">{tableId}</span>
                {isCompleted && (
                  <div className="absolute top-1 right-1">
                    <Star className="w-3.5 h-3.5 text-white/90 drop-shadow-md fill-current" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
