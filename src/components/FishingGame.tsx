import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, Trophy, Home } from "lucide-react";
import confetti from "canvas-confetti";
import type { World } from "../data/words";
import { CorrectFeedback } from "./CorrectFeedback";

interface FishingGameProps {
  world: World;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

interface Fish {
  id: string;
  word: string;
  y: number;
  speed: number;
  direction: 1 | -1;
  color: string;
}

const FISH_COLORS = ["bg-orange-500", "bg-red-500", "bg-yellow-500"];

export function FishingGame({ world, onComplete, onBack }: FishingGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [splash, setSplash] = useState<{x: number, y: number} | null>(null);
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
      setTimeout(playAudio, 500);
    } else if (currentWordIndex > 0) {
      setIsDone(true);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentWordIndex, world]);

  useEffect(() => {
    if (isDone || currentWordIndex >= world.words.length) return;

    const spawnFish = () => {
      setFishes(prev => {
        if (prev.length > 7) return prev;

        const words = world.words;
        const targetWord = currentWord;
        if (!targetWord) return prev;

        // Always ensure target word is on screen
        const hasTarget = prev.some(f => f.word === targetWord);
        let wordToSpawn: string;

        if (!hasTarget) {
          // Force spawn the target
          wordToSpawn = targetWord;
        } else if (Math.random() < 0.35) {
          // 35% chance to spawn another target
          wordToSpawn = targetWord;
        } else {
          // Spawn a random wrong word
          const wrongWords = words.filter(w => w.text !== targetWord);
          if (wrongWords.length > 0) {
            wordToSpawn = wrongWords[Math.floor(Math.random() * wrongWords.length)].text;
          } else {
            wordToSpawn = targetWord;
          }
        }

        const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

        const newFish: Fish = {
          id: Math.random().toString(36).substring(7),
          word: wordToSpawn,
          y: Math.random() * 50 + 30,
          speed: Math.random() * 4 + 8,
          direction,
          color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
        };
        return [...prev, newFish];
        return [...prev, newFish];
      });
    };

    spawnFish();
    setTimeout(spawnFish, 400);
    setTimeout(spawnFish, 800);
    const interval = setInterval(spawnFish, 900);
    return () => clearInterval(interval);
  }, [currentWord, world, isDone, currentWordIndex]);

  const removeFish = (id: string) => {
    setFishes(prev => prev.filter(f => f.id !== id));
  };

  const handleCatch = (fish: Fish, e: React.MouseEvent) => {
    if (isDone) return;

    // Show splash effect
    setSplash({ x: e.clientX, y: e.clientY });
    setTimeout(() => setSplash(null), 600);

    if (fish.word === currentWord) {
      const correctAudio = new Audio("/audio/correct.mp3");
      correctAudio.play().catch(() => {});
      setScore(s => s + 1);
      setFishes([]);
      setCorrectWord(currentWord);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        setCurrentWordIndex(i => i + 1);
      }, 1200);
    } else {
      const wrongAudio = new Audio("/audio/wrong.mp3");
      wrongAudio.play().catch(() => {});
      removeFish(fish.id);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 relative overflow-hidden font-sans">
      <CorrectFeedback show={showCorrect} word={correctWord} />
      {/* Water background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-blue-500 to-blue-900 pointer-events-none" />

      {/* Animated bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${10 + i * 12}%`,
              bottom: `${Math.random() * 30}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-white/30 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white/50 transition active:scale-90"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>

        <div className="bg-white/30 backdrop-blur-sm px-5 py-2 rounded-2xl font-black text-white flex items-center gap-2 text-lg">
          <Trophy className="w-6 h-6 text-yellow-300" />
          {score} / {world.words.length}
        </div>
      </div>

      {/* Audio + instruction */}
      {!isDone && (
        <div className="relative z-20 flex flex-col items-center gap-3 mt-4">
          <button
            onClick={playAudio}
            className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center animate-bounce hover:scale-110 active:scale-90 transition-transform"
          >
            <Volume2 className="w-10 h-10 text-blue-500" />
          </button>
          <div className="bg-white/90 px-6 py-2 rounded-full font-bold text-blue-800 shadow-md text-lg">
            🎣 Fang Magikarp med det rigtige ord!
          </div>
        </div>
      )}

      {/* Splash effect */}
      <AnimatePresence>
        {splash && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed w-16 h-16 rounded-full bg-white/60 pointer-events-none z-50"
            style={{ left: splash.x - 32, top: splash.y - 32 }}
          />
        )}
      </AnimatePresence>

      {/* Completion screen */}
      {isDone && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-blue-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4"
          >
            <div className="text-6xl mb-4">🐟</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Storfanger!</h2>
            <p className="text-gray-500 font-medium mb-2">Du fangede alle Magikarp!</p>
            <div className="text-yellow-400 text-2xl mb-6">⭐⭐⭐</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onBack}
                className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-2xl px-6 py-4 font-black text-lg flex items-center gap-2 transition shadow-lg"
              >
                <Home className="w-6 h-6" /> Tilbage
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Fish swimming area */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <AnimatePresence>
          {fishes.map(fish => (
            <motion.div
              key={fish.id}
              initial={{ x: fish.direction === 1 ? "-20vw" : "120vw" }}
              animate={{ x: fish.direction === 1 ? "120vw" : "-20vw" }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: fish.speed, ease: "linear" }}
              onAnimationComplete={() => removeFish(fish.id)}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ top: `${fish.y}%`, zIndex: Math.floor(fish.y) }}
              onClick={(e) => handleCatch(fish, e)}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className={`relative flex items-center justify-center px-6 py-3 rounded-[40px] shadow-lg ${fish.color} border-3 border-white/30`}
              >
                {/* Tail - on the back side based on direction */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[16px] border-y-transparent ${fish.direction === 1 ? `-left-6 border-r-[24px] ${fish.color.replace("bg-", "border-r-")}` : `-right-6 border-l-[24px] ${fish.color.replace("bg-", "border-l-")}`}`}
                />
                {/* Eye - on the front side based on direction */}
                <div className={`absolute ${fish.direction === 1 ? "right-3" : "left-3"} top-2 w-4 h-4 bg-white rounded-full border-2 border-black`}>
                  <div className="absolute right-0.5 top-0.5 w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                {/* Fin */}
                <div className={`absolute left-1/2 -top-3 w-6 h-4 ${fish.color} rounded-t-full border-2 border-white/30`} />

                {/* Crown for gold Magikarp */}
                {fish.color.includes("yellow") && (
                  <div className={`absolute ${fish.direction === 1 ? "right-6" : "left-6"} -top-4 text-lg`}>👑</div>
                )}

                <span
                  className="text-white font-black text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] relative z-10 px-2"
                >
                  {fish.word}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
