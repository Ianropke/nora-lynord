import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Check, RotateCcw, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";
import { mathQuizzes } from "../data/math";

function speakMath(text: string) {
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const formatted = text
      .replace(/\+/g, " plus ")
      .replace(/-/g, " minus ")
      .replace(/×|\*/g, " gange ")
      .replace(/=/g, " er ");
    const utterance = new SpeechSynthesisUtterance(formatted);
    utterance.lang = "da-DK";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

// Use an SVG Pokeball for the final screen
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

interface MathQuizProps {
  quizId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function MathQuiz({ quizId, onBack, onComplete }: MathQuizProps) {
  const quiz = mathQuizzes.find((q) => q.id === quizId);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [shakeId, setShakeId] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  // Shuffle options when index changes
  useEffect(() => {
    if (quiz && !finished) {
      const q = quiz.questions[index];
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
      setCorrect(null);
      setShakeId(null);
    }
  }, [index, quiz, finished]);

  if (!quiz) {
    return (
      <div className="p-6 text-center">
        <p className="text-white text-lg">Opgaverne blev ikke fundet.</p>
        <button onClick={onBack} className="btn-touch glass rounded-xl px-4 py-2 mt-4 text-white font-bold">
          Tilbage
        </button>
      </div>
    );
  }

  const question = quiz.questions[index];

  const handlePick = (picked: number) => {
    if (correct !== null) return; // already answered

    if (picked === question.answer) {
      setCorrect(picked);

      // Mini confetti
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#FACC15", "#34d399"],
      });

      setTimeout(() => {
        if (index < quiz.questions.length - 1) {
          setIndex((i) => i + 1);
        } else {
          // Finished the whole quiz
          if (mistakes === 0) {
            const duration = 3000;
            const end = Date.now() + duration;
            const fire = () => {
              confetti({
                particleCount: 80,
                spread: 100,
                origin: { x: Math.random(), y: Math.random() * 0.5 },
                colors: ["#FACC15", "#E3350D", "#2563EB", "#7AC74C", "#F95587"],
              });
              if (Date.now() < end) requestAnimationFrame(fire);
            };
            fire();
          }
          setFinished(true);
        }
      }, 800);
    } else {
      // Wrong answer
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
            {perfect ? "Super regnet!" : "Godt forsøgt!"}
          </h2>
          <p className="text-white/60 mb-6">
            {perfect
              ? `Alle ${quiz.questions.length} stykker regnet rigtigt!`
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
                className="btn-touch bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl px-5 py-3 font-bold flex items-center gap-2"
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

  return (
    <div className="min-h-full px-4 py-6 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <button
          onClick={onBack}
          className="btn-touch glass rounded-full p-3 hover:bg-white/20 transition-colors"
          aria-label="Gå tilbage"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <span className="text-white/60 font-bold text-sm">
          Opgave {index + 1} / {quiz.questions.length}
        </span>
        <div className="w-12 text-right">
          <span className="text-2xl">{quiz.emoji}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
          style={{
            width: `${((index) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8 animate-pop-in text-center flex flex-col items-center gap-3" style={{ opacity: 0 }}>
          <div className="glass-strong rounded-[3rem] p-10 flex flex-col items-center gap-4 bg-gradient-to-b from-white/10 to-transparent border border-white/20 shadow-2xl">
            <span className="text-7xl sm:text-8xl font-black tracking-wide text-white drop-shadow-md">
              {question.question}
            </span>
          </div>
          <button
            onClick={() => speakMath(question.question)}
            className="btn-touch glass px-4 py-2 rounded-full text-white/80 hover:text-white text-xs font-bold flex items-center gap-2 border border-white/10"
          >
            <Volume2 className="w-4 h-4 text-blue-300" />
            <span>Hør opgaven</span>
          </button>
          <p className="text-white/50 font-bold mt-2 text-sm uppercase tracking-widest">
            Hvad er svaret?
          </p>
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
                      : "bg-white border-gray-300 text-blue-900 hover:bg-gray-50 active:border-b-0 active:translate-y-1"
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
