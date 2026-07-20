import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

function Pokeball({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="48" fill="#E3350D" stroke="#222" strokeWidth="4" />
      <rect x="2" y="48" width="96" height="4" fill="#222" />
      <circle cx="50" cy="50" r="48" fill="white" clipPath="inset(50% 0 0 0)" stroke="#222" strokeWidth="4" />
      <rect x="2" y="48" width="96" height="4" fill="#222" />
      <circle cx="50" cy="50" r="16" fill="white" stroke="#222" strokeWidth="4" />
      <circle cx="50" cy="50" r="8" fill="#222" />
    </svg>
  );
}

interface Question {
  question: string;
  answer: number;
  options: number[];
  sequence?: (number | string)[]; // Used in count mode
}

interface TimesTableGameProps {
  tableId: number;
  mode: "mult" | "count";
  onBack: () => void;
  onComplete: () => void;
}

export function TimesTableGame({ tableId, mode, onBack, onComplete }: TimesTableGameProps) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [shakeId, setShakeId] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  // Generate the 10 questions for this table
  const questions = useMemo(() => {
    const qs: Question[] = [];
    for (let i = 1; i <= 10; i++) {
      const answer = i * tableId;
      const opts = new Set<number>();
      opts.add(answer);
      
      // Generate wrong answers
      while (opts.size < 4) {
        const isCommonError = Math.random() > 0.5;
        let wrongAns = 0;
        
        if (isCommonError) {
          const wrongI = i + (Math.random() > 0.5 ? 1 : -1);
          wrongAns = (wrongI > 0 ? wrongI : 2) * tableId;
        } else {
          const offset = Math.floor(Math.random() * 5) + 1;
          wrongAns = answer + (Math.random() > 0.5 ? offset : -offset);
        }
        
        if (wrongAns > 0 && wrongAns !== answer) {
          opts.add(wrongAns);
        }
      }

      if (mode === "mult") {
        qs.push({
          question: `${i} × ${tableId}`,
          answer: answer,
          options: Array.from(opts)
        });
      } else {
        // "count" mode: Skip counting sequence (5 elements window)
        // Select start index (clamped so sequence doesn't exceed 10)
        // i goes from 1 to 10
        // Pick start index between i-4 and i
        const start = Math.max(1, Math.min(6, i - Math.floor(Math.random() * 5)));
        const sequence: (number | string)[] = [];
        
        for (let j = 0; j < 5; j++) {
          const currentMult = start + j;
          if (currentMult === i) {
            sequence.push("?");
          } else {
            sequence.push(currentMult * tableId);
          }
        }

        qs.push({
          question: `Hvad mangler i rækken?`,
          answer: answer,
          options: Array.from(opts),
          sequence: sequence
        });
      }
    }
    // Shuffle the questions
    return qs.sort(() => Math.random() - 0.5);
  }, [tableId, mode]);

  // Shuffle options for the current question
  useEffect(() => {
    if (!finished && questions.length > 0) {
      const q = questions[index];
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
      setCorrect(null);
      setShakeId(null);
    }
  }, [index, questions, finished]);

  const question = questions[index];

  const handlePick = (picked: number) => {
    if (correct !== null) return;

    if (picked === question.answer) {
      setCorrect(picked);

      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#FACC15", "#34d399", "#A855F7"],
      });

      setTimeout(() => {
        if (index < questions.length - 1) {
          setIndex((i) => i + 1);
        } else {
          if (mistakes === 0) {
            const duration = 3000;
            const end = Date.now() + duration;
            const fire = () => {
              confetti({
                particleCount: 80,
                spread: 100,
                origin: { x: Math.random(), y: Math.random() * 0.5 },
                colors: ["#FACC15", "#E3350D", "#2563EB", "#7AC74C", "#A855F7"],
              });
              if (Date.now() < end) requestAnimationFrame(fire);
            };
            fire();
          }
          setFinished(true);
        }
      }, 800);
    } else {
      setShakeId(picked);
      setMistakes((m) => m + 1);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  if (finished) {
    const perfect = mistakes === 0;
    return (
      <div className="min-h-full px-4 py-6 flex flex-col items-center justify-center">
        <div className="glass-strong rounded-3xl p-8 text-center max-w-sm animate-pop-in" style={{ opacity: 0 }}>
          {perfect ? (
            <div className="animate-catch-bounce inline-block mb-4">
              <Pokeball size={64} />
            </div>
          ) : (
            <span className="text-6xl block mb-4">👏</span>
          )}
          <h2 className="text-3xl font-black mb-2">
            {perfect 
              ? `${tableId}-tabellen er klaret!` 
              : "Godt forsøgt!"}
          </h2>
          <p className="text-white/60 mb-6">
            {perfect
              ? `Flot klaret! Du fik 10 stjerner for ${mode === "count" ? "tælleremsen" : "gange-mesteren"}!`
              : `Du havde ${mistakes} fejl. Træn videre og prøv igen!`}
          </p>
          <div className="flex gap-3 justify-center">
            {perfect ? (
              <button
                onClick={onComplete}
                className="btn-touch bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-2xl px-6 py-3 font-bold flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <Check className="w-5 h-5" /> Få 10 ⭐
              </button>
            ) : (
              <button
                onClick={onBack}
                className="btn-touch glass text-white rounded-2xl px-6 py-3 font-bold flex items-center gap-2 shadow-lg"
              >
                Tilbage
              </button>
            )}
            
            {!perfect && (
              <button
                onClick={() => {
                  setIndex(0);
                  setMistakes(0);
                  setFinished(false);
                }}
                className="btn-touch bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl px-5 py-3 font-bold flex items-center gap-2 shadow-lg hover:brightness-110"
              >
                <RotateCcw className="w-4 h-4" />
                Prøv igen
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-full px-4 py-6 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <button
          onClick={onBack}
          className="btn-touch glass rounded-full p-3 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <span className="text-white/60 font-bold text-sm">
          {mode === "count" ? "🏃‍♂️ Tælleremse" : "⚔️ Gange-Mester"} • Opgave {index + 1} / {questions.length}
        </span>
        <div className="w-12 text-right">
          <span className="text-2xl font-black text-white">{tableId}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500"
          style={{ width: `${((index) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-10 animate-pop-in text-center w-full" style={{ opacity: 0 }}>
          {mode === "mult" ? (
            <div className="glass-strong rounded-[3rem] p-10 flex flex-col items-center gap-4 bg-gradient-to-b from-white/10 to-transparent border border-white/20 shadow-2xl inline-block">
              <span className="text-7xl sm:text-8xl font-black tracking-wide text-white drop-shadow-md whitespace-nowrap">
                {question.question}
              </span>
            </div>
          ) : (
             // Skip counting layout (2, 4, ?, 8, 10)
             <div className="flex flex-col items-center gap-6 w-full">
               <div className="glass-strong rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 flex justify-center items-center gap-0.5 sm:gap-2 bg-gradient-to-b from-white/10 to-transparent border border-white/20 shadow-2xl w-full max-w-full overflow-hidden">
                 {question.sequence?.map((num, idx) => {
                   const isGap = num === "?";
                   return (
                     <div key={idx} className="flex items-center">
                       <div className={`
                         rounded-xl sm:rounded-2xl w-11 h-11 sm:w-16 sm:h-16 flex items-center justify-center text-base sm:text-2xl font-black
                         transition-all duration-300
                         ${isGap
                           ? correct !== null
                             ? "bg-green-500 text-white scale-110 border-2 border-green-400"
                             : "bg-purple-900/40 border-2 border-dashed border-purple-400 text-purple-300 animate-pulse"
                           : "bg-white/10 text-white border border-white/10"}
                       `}>
                         {isGap && correct !== null ? correct : num}
                       </div>
                       {idx < 4 && (
                         <span className="text-white/20 text-xs sm:text-lg font-black mx-1 sm:mx-2">➔</span>
                       )}
                     </div>
                   );
                 })}
               </div>
               <p className="text-white/70 font-bold text-sm">Hvad skal stå i stedet for ?</p>
             </div>
          )}
          {mode === "mult" && (
            <p className="text-white/50 font-bold mt-6 text-sm uppercase tracking-widest">
              Hvad er svaret?
            </p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 w-full px-2">
          {options.map((opt, i) => {
            const isCorrectPick = correct === opt;
            const isShaking = shakeId === opt;
            return (
              <button
                key={`${index}-${opt}-${i}`}
                onClick={() => handlePick(opt)}
                className={`
                  btn-touch rounded-3xl py-6 text-4xl font-black
                  transition-all duration-200 border-b-4 
                  ${
                    isCorrectPick
                      ? "bg-green-500 border-green-700 text-white scale-105 shadow-xl"
                      : isShaking
                      ? "bg-red-500 border-red-700 text-white animate-shake"
                      : "bg-white border-gray-300 text-purple-900 hover:bg-gray-50 active:border-b-0 active:translate-y-1"
                  }
                  animate-pop-in stagger-${i + 1}
                `}
                style={{ opacity: 0 }}
                disabled={correct !== null}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
