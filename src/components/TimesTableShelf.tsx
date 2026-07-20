import { useState } from "react";
import { ArrowLeft, Star, X } from "lucide-react";
import type { Progress } from "../hooks/useProgress";

interface TimesTableShelfProps {
  progress: Progress;
  onSelectTable: (tableId: number, mode: "mult" | "count") => void;
  onBack: () => void;
}

export function TimesTableShelf({ progress, onSelectTable, onBack }: TimesTableShelfProps) {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  
  const tables = Array.from({ length: 20 }, (_, i) => i + 1);
  
  // Calculate completed count as total medals earned (mult + count)
  const multCompleted = progress.completedTimesTables?.length ?? 0;
  const countCompleted = progress.completedTimesTablesCount?.length ?? 0;
  const totalMedals = multCompleted + countCompleted;

  return (
    <div className="min-h-full px-4 py-6 flex flex-col max-w-lg mx-auto relative">
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
          <h2 className="text-lg font-black text-white">Medaljer</h2>
          <p className="text-xs text-white/60 mt-1">
            Mester begge spil for at få guld-kronen! 👑
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2.5 rounded-full text-sm font-black shadow-lg">
          <Star className="w-5 h-5 fill-current" />
          <span>{totalMedals} / 40 Medaljer</span>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 flex-1 flex flex-col animate-slide-up stagger-1 border border-white/10 shadow-xl relative overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />
        
        <p className="text-white/80 text-center mb-6 font-bold text-lg relative z-10">
          Vælg en tabel at øve dig på!
        </p>

        <div className="grid grid-cols-4 gap-3 relative z-10">
          {tables.map((tableId, i) => {
            const hasMult = progress.completedTimesTables?.includes(tableId);
            const hasCount = progress.completedTimesTablesCount?.includes(tableId);
            const hasBoth = hasMult && hasCount;
            
            return (
              <button
                key={tableId}
                onClick={() => setSelectedTable(tableId)}
                className={`
                  btn-touch rounded-2xl aspect-square flex flex-col items-center justify-center relative overflow-hidden
                  animate-pop-in border border-white/10 shadow-lg transition-all duration-200
                  ${hasBoth 
                    ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-gray-900 border-yellow-300/50 shadow-[0_0_15px_rgba(250,204,21,0.35)] scale-105' 
                    : hasMult || hasCount
                    ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 text-white border-purple-400/30'
                    : 'glass hover:bg-white/20 active:scale-[0.95] text-white'}
                `}
                style={{ animationDelay: `${(i % 10) * 0.05}s` }}
              >
                {/* Crown for mastery of both modes */}
                {hasBoth && (
                  <div className="absolute top-1 right-1 animate-pulse-slow">
                    <span className="text-xs">👑</span>
                  </div>
                )}
                
                {/* Table Number */}
                <span className="text-2xl font-black mb-1">{tableId}</span>
                
                {/* Medals container */}
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
                  {hasCount && <span className="text-[10px]" title="Hop-tælling">🏃‍♂️</span>}
                  {hasMult && <span className="text-[10px]" title="Gange-Mester">⚔️</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drawer/Modal for selecting Mode */}
      {selectedTable !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4 transition-all duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedTable(null)} />
          
          <div className="glass-strong border border-white/20 rounded-3xl w-full max-w-sm p-6 relative z-10 animate-slide-up mb-8 shadow-2xl">
            <button 
              onClick={() => setSelectedTable(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white btn-touch"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-center text-white mb-1">
              {selectedTable}-tabellen
            </h3>
            <p className="text-xs text-white/40 text-center mb-6">
              Hvilken træning vil du prøve?
            </p>

            <div className="space-y-4">
              {/* Option 1: Hop-tælling (Count) */}
              <button
                onClick={() => {
                  onSelectTable(selectedTable, "count");
                  setSelectedTable(null);
                }}
                className={`
                  w-full btn-touch p-4 rounded-2xl flex items-center justify-between text-left border transition-all
                  ${progress.completedTimesTablesCount?.includes(selectedTable)
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500/50 text-white'
                    : 'glass hover:bg-white/10 border-white/5 text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏃‍♂️</span>
                  <div>
                    <span className="block font-bold text-sm">Tælleremse (Hop-tælling)</span>
                    <span className="block text-[10px] text-white/60">Hop i rækkefølge med tabellen!</span>
                  </div>
                </div>
                {progress.completedTimesTablesCount?.includes(selectedTable) && (
                  <span className="text-xl">🏃‍♂️ Medalje</span>
                )}
              </button>

              {/* Option 2: Gange-Mester (Mult) */}
              <button
                onClick={() => {
                  onSelectTable(selectedTable, "mult");
                  setSelectedTable(null);
                }}
                className={`
                  w-full btn-touch p-4 rounded-2xl flex items-center justify-between text-left border transition-all
                  ${progress.completedTimesTables?.includes(selectedTable)
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-yellow-500/50 text-white'
                    : 'glass hover:bg-white/10 border-white/5 text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <span className="block font-bold text-sm">Gange-Mester</span>
                    <span className="block text-[10px] text-white/60">Løs de svære regnestykker!</span>
                  </div>
                </div>
                {progress.completedTimesTables?.includes(selectedTable) && (
                  <span className="text-xl">⚔️ Medalje</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
