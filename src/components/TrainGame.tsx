import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, Trophy, Home, Check } from "lucide-react";
import confetti from "canvas-confetti";
import type { World } from "../data/words";
import { CorrectFeedback } from "./CorrectFeedback";

interface TrainGameProps {
  world: World;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

export function TrainGame({ world, onComplete, onBack }: TrainGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongOption, setWrongOption] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [correctWord, setCorrectWord] = useState("");

  const currentWordObj = world.words[currentWordIndex];
  const currentWord = currentWordObj?.text || "";
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!currentWord) return;
    const a = new Audio(`/audio/${currentWord}.mp3`);
    a.play().catch(() => {});
    audioRef.current = a;
  };

  useEffect(() => {
    if (currentWordIndex < world.words.length) {
      const words = world.words;
      const wrongOptions = words.map(w => w.text).filter(w => w !== currentWord);
      for (let i = wrongOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
      }
      const newOptions = [currentWord, ...wrongOptions.slice(0, 2)];
      for (let i = newOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
      }
      setOptions(newOptions);
      setSelectedOption(null);
      setWrongOption(null);
      setTimeout(playAudio, 800);
    } else if (currentWordIndex > 0) {
      setIsDone(true);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentWordIndex, world]);

  const handleSelect = (option: string) => {
    if (selectedOption !== null || isDone) return;

    if (option === currentWord) {
      setSelectedOption(option);
      const correctAudio = new Audio("/audio/correct.mp3");
      correctAudio.play().catch(() => {});
      setScore(s => s + 1);
      setCorrectWord(currentWord);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        setCurrentWordIndex(i => i + 1);
      }, 1500);
    } else {
      setWrongOption(option);
      const wrongAudio = new Audio("/audio/wrong.mp3");
      wrongAudio.play().catch(() => {});
      setTimeout(() => setWrongOption(null), 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-400 to-green-400 relative overflow-hidden font-sans flex flex-col">
      <CorrectFeedback show={showCorrect} word={correctWord} />
      {/* Landscape background */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-600 to-green-500 pointer-events-none" />
      {/* Fence */}
      <div className="absolute bottom-20 w-full pointer-events-none flex">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="w-4 h-8 bg-amber-700 border border-amber-800 mx-1 rounded-t-sm" />
        ))}
      </div>

      {/* Clouds */}
      <div className="absolute top-16 left-10 w-16 h-8 bg-white rounded-full opacity-60 pointer-events-none" />
      <div className="absolute top-12 left-20 w-20 h-10 bg-white rounded-full opacity-50 pointer-events-none" />
      <div className="absolute top-20 right-16 w-24 h-10 bg-white rounded-full opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-white/40 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white/60 transition active:scale-90"
        >
          <ArrowLeft className="w-7 h-7 text-sky-800" />
        </button>
        <div className="bg-white/40 backdrop-blur-sm px-5 py-2 rounded-2xl font-black text-sky-800 flex items-center gap-2 text-lg">
          <Trophy className="w-6 h-6 text-yellow-500" />
          {score} / {world.words.length}
        </div>
      </div>

      {!isDone && (
        <div className="flex-1 flex flex-col justify-between pb-6 relative z-10">
          {/* Audio button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={playAudio}
              className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center animate-bounce hover:scale-110 active:scale-90 transition-transform"
            >
              <Volume2 className="w-10 h-10 text-sky-500" />
            </button>
          </div>

          {/* Train Scene */}
          <div className="relative h-40 w-full flex items-end px-4 mb-4">
            {/* Rails */}
            <div className="absolute bottom-0 w-full h-3 bg-gray-600 rounded">
              <div className="absolute bottom-0 w-full flex gap-4 px-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-5 bg-gray-400 -mt-2 rounded-sm" />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentWordIndex}
                initial={{ x: "-110%" }}
                animate={{ x: selectedOption ? "120vw" : "5%" }}
                transition={selectedOption
                  ? { duration: 1, ease: "easeIn" }
                  : { type: "spring", duration: 1.2, bounce: 0.15 }
                }
                className="absolute bottom-3 flex items-end"
              >
                {/* Magnet Train Engine */}
                <div className="w-32 h-16 bg-gray-100 rounded-r-full rounded-tl-lg relative border-2 border-gray-300 shadow-xl overflow-hidden">
                  <div className="w-full h-2.5 bg-orange-500 absolute top-0" />
                  <div className="absolute top-3 right-3 w-12 h-6 bg-sky-700 rounded-r-full opacity-80" />
                  <div className="w-full h-2.5 bg-orange-500 absolute bottom-0" />
                  {/* Glow underneath */}
                  <div className="absolute -bottom-2 w-full h-3 bg-cyan-400/40 blur-sm" />
                </div>

                {/* Connector */}
                <div className="w-3 h-2 bg-gray-500 mb-3" />

                {/* Wagon */}
                <div className="w-36 h-16 bg-gray-100 rounded-md relative border-2 border-gray-300 shadow-xl overflow-hidden flex items-center justify-center">
                  <div className="w-full h-2.5 bg-orange-500 absolute top-0" />
                  <div className="w-full h-2.5 bg-orange-500 absolute bottom-0" />
                  <div className="absolute -bottom-2 w-full h-3 bg-cyan-400/40 blur-sm" />

                  {selectedOption ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-gray-800 font-black text-xl z-10"
                    >
                      {selectedOption} ✓
                    </motion.span>
                  ) : (
                    <div className="w-28 h-9 border-3 border-dashed border-gray-400 rounded-md flex items-center justify-center bg-white/60">
                      <span className="text-gray-400 font-bold text-lg">?</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Word options */}
          <div className="flex justify-center gap-3 px-4 flex-wrap">
            {options.map((option, i) => (
              <motion.button
                key={`${currentWordIndex}-${i}`}
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelect(option)}
                disabled={selectedOption !== null}
                className={`px-7 py-4 rounded-2xl shadow-lg border-4 border-b-8 font-black text-2xl transition-all ${
                  selectedOption === option
                    ? "bg-green-500 border-green-700 text-white scale-110"
                    : wrongOption === option
                    ? "bg-red-400 border-red-600 text-white animate-shake"
                    : "bg-yellow-400 border-yellow-600 text-yellow-900 hover:brightness-110 active:translate-y-1 active:border-b-4"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Completion screen */}
      {isDone && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-sky-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4"
          >
            <div className="text-6xl mb-4">🚄</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Toget kører!</h2>
            <p className="text-gray-500 font-medium mb-2">Du fyldte alle vognene!</p>
            <div className="text-yellow-400 text-2xl mb-6">⭐⭐⭐</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onComplete(3)}
                className="bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-2xl px-6 py-4 font-black text-lg flex items-center gap-2 transition shadow-lg"
              >
                <Check className="w-6 h-6" /> Fortsæt
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
