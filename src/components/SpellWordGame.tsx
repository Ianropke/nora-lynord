import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Trophy, Home, Check } from "lucide-react";
import confetti from "canvas-confetti";
import type { World } from "../data/words";
import { CorrectFeedback } from "./CorrectFeedback";

interface SpellWordGameProps {
  world: World;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

export function SpellWordGame({ world, onComplete, onBack }: SpellWordGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [correctWord, setCorrectWord] = useState("");

  const currentWordObj = world.words[currentWordIndex];
  const currentWord = currentWordObj?.text || "";

  const isLongWord = currentWord.length > 8;
  const isVeryLongWord = currentWord.length > 10;

  const slotSizeClass = isVeryLongWord
    ? "w-10 h-10 text-xl"
    : isLongWord
    ? "w-12 h-12 text-2xl"
    : "w-14 h-14 text-3xl";

  const keySizeClass = isVeryLongWord
    ? "w-11 h-11 text-xl"
    : isLongWord
    ? "w-13 h-13 text-2xl"
    : "w-16 h-16 text-3xl";

  const containerPaddingClass = isVeryLongWord
    ? "p-2 border-4 gap-1.5 min-h-[70px]"
    : isLongWord
    ? "p-3 border-4 gap-2 min-h-[80px]"
    : "p-4 border-8 gap-2 min-h-[90px]";

  const [selectedLetters, setSelectedLetters] = useState<{ id: string; char: string }[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ id: string; char: string }[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!currentWord) return;
    const a = new Audio(`/audio/${currentWord}.mp3`);
    a.play().catch(() => {});
    audioRef.current = a;
  };

  const scrambleLetters = (word: string) => {
    const letters = word.split("").map((char, index) => ({
      id: `${char}-${index}-${Date.now()}`,
      char,
    }));
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  };

  useEffect(() => {
    if (currentWordIndex < world.words.length) {
      setAvailableLetters(scrambleLetters(currentWord));
      setSelectedLetters([]);
      setTimeout(playAudio, 500);
    } else if (currentWordIndex > 0) {
      setIsDone(true);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentWordIndex, world]);

  const handleSelectLetter = (letter: { id: string; char: string }) => {
    if (isDone) return;
    setAvailableLetters(prev => prev.filter(l => l.id !== letter.id));
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    if (newSelected.length === currentWord.length) {
      const spelledWord = newSelected.map(l => l.char).join("");
      if (spelledWord === currentWord) {
        const correctAudio = new Audio("/audio/correct.mp3");
        correctAudio.play().catch(() => {});
        setScore(s => s + 1);
        setCorrectWord(currentWord);
        setShowCorrect(true);
        setTimeout(() => {
          setShowCorrect(false);
          setCurrentWordIndex(i => i + 1);
        }, 1200);
      } else {
        const wrongAudio = new Audio("/audio/wrong.mp3");
        wrongAudio.play().catch(() => {});
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setSelectedLetters([]);
          setAvailableLetters(scrambleLetters(currentWord));
        }, 800);
      }
    }
  };

  const handleDeselectLetter = (letter: { id: string; char: string }) => {
    setSelectedLetters(prev => prev.filter(l => l.id !== letter.id));
    setAvailableLetters(prev => [...prev, letter]);
  };

  // Show placeholder slots for unselected letters
  const emptySlots = currentWord.length - selectedLetters.length;

  return (
    <div className="min-h-screen bg-red-600 relative overflow-hidden font-sans flex flex-col">
      <CorrectFeedback show={showCorrect} word={correctWord} />
      {/* Pokédex-style top section */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-red-800" />

      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center mt-1">
        <button
          onClick={onBack}
          className="bg-white/20 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white/30 transition active:scale-90"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>
        <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-2xl font-black text-white flex items-center gap-2 text-lg">
          <Trophy className="w-6 h-6 text-yellow-400" />
          {score} / {world.words.length}
        </div>
      </div>

      {!isDone && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          {/* Audio button */}
          <button
            onClick={playAudio}
            className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center animate-bounce hover:scale-110 active:scale-90 transition-transform"
          >
            <Volume2 className="w-10 h-10 text-red-500" />
          </button>

          {/* Pokédex Screen */}
          <motion.div
            animate={isShaking ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className={`bg-cyan-100 rounded-xl ${containerPaddingClass} border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative flex items-center justify-center flex-wrap`}>
              {/* Pokédex indicator lights */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-2 bg-red-500 rounded-full shadow-md" />
              <div className="absolute -bottom-5 left-4 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-800" />
              <div className="absolute -bottom-5 left-10 w-4 h-4 bg-yellow-400 rounded-full border-2 border-gray-800" />
              <div className="absolute -bottom-5 left-16 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800" />

              {selectedLetters.map(letter => (
                <motion.button
                  key={`sel-${letter.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => handleDeselectLetter(letter)}
                  className={`${slotSizeClass} bg-white text-red-700 rounded-xl shadow-lg flex items-center justify-center font-black uppercase hover:scale-105 active:scale-90 border-2 border-gray-300`}
                >
                  {letter.char}
                </motion.button>
              ))}
              {[...Array(emptySlots)].map((_, i) => (
                <div
                  key={`slot-${i}`}
                  className={`${slotSizeClass} border-3 border-dashed border-gray-400 rounded-xl flex items-center justify-center bg-white/50`}
                >
                  <span className="text-gray-400">_</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Available letters */}
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-md w-full mt-4">
            {availableLetters.map(letter => (
              <motion.button
                key={`avail-${letter.id}`}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleSelectLetter(letter)}
                className={`${keySizeClass} bg-red-500 border-b-4 border-red-800 text-white rounded-2xl shadow-md flex items-center justify-center font-black uppercase hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all`}
              >
                {letter.char}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Completion screen */}
      {isDone && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4"
          >
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Super Stavet!</h2>
            <p className="text-gray-500 font-medium mb-2">Du er en sand Pokédex-mester!</p>
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
