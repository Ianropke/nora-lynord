import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, Trophy, Home } from "lucide-react";
import confetti from "canvas-confetti";
import type { World } from "../data/words";
import { CorrectFeedback } from "./CorrectFeedback";

interface BalloonPopGameProps {
  world: World;
  onComplete: (stars: number) => void;
  onBack: () => void;
}

interface Balloon {
  id: string;
  word: string;
  x: number;
  speed: number;
  color: string;
}

const BALLOON_COLORS = [
  "bg-purple-500", "bg-purple-600", "bg-pink-500", "bg-violet-500"
];

export function BalloonPopGame({ world, onComplete, onBack }: BalloonPopGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [popEffect, setPopEffect] = useState<{x: number, y: number} | null>(null);
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

    const spawnBalloon = () => {
      setBalloons(prev => {
        if (prev.length > 8) return prev;

        const words = world.words;
        const targetWord = currentWord;
        if (!targetWord) return prev;

        const hasTarget = prev.some(b => b.word === targetWord);
        let wordToSpawn: string;

        if (!hasTarget) {
          wordToSpawn = targetWord;
        } else if (Math.random() < 0.3) {
          wordToSpawn = targetWord;
        } else {
          const wrongWords = words.filter(w => w.text !== targetWord);
          if (wrongWords.length > 0) {
            wordToSpawn = wrongWords[Math.floor(Math.random() * wrongWords.length)].text;
          } else {
            wordToSpawn = targetWord;
          }
        }

        const newBalloon: Balloon = {
          id: Math.random().toString(36).substring(7),
          word: wordToSpawn,
          x: Math.random() * 70 + 15,
          speed: Math.random() * 3 + 8,
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        };
        return [...prev, newBalloon];
      });
    };

    spawnBalloon();
    setTimeout(spawnBalloon, 300);
    setTimeout(spawnBalloon, 600);
    setTimeout(spawnBalloon, 900);
    const interval = setInterval(spawnBalloon, 700);
    return () => clearInterval(interval);
  }, [currentWord, world, isDone, currentWordIndex]);

  const removeBalloon = (id: string) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
  };

  const handlePop = (balloon: Balloon, e: React.MouseEvent) => {
    if (isDone) return;

    setPopEffect({ x: e.clientX, y: e.clientY });
    setTimeout(() => setPopEffect(null), 500);

    if (balloon.word === currentWord) {
      const correctAudio = new Audio("/audio/correct.mp3");
      correctAudio.play().catch(() => {});
      setScore(s => s + 1);
      setBalloons([]);
      setCorrectWord(currentWord);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        setCurrentWordIndex(i => i + 1);
      }, 1200);
    } else {
      const wrongAudio = new Audio("/audio/wrong.mp3");
      wrongAudio.play().catch(() => {});
      removeBalloon(balloon.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-purple-900 relative overflow-hidden font-sans">
      <CorrectFeedback show={showCorrect} word={correctWord} />
      {/* Starry night background for Drifloon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.4 + Math.random() * 0.6,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-white/20 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white/40 transition active:scale-90"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>
        <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-2xl font-black text-white flex items-center gap-2 text-lg">
          <Trophy className="w-6 h-6 text-yellow-300" />
          {score} / {world.words.length}
        </div>
      </div>

      {/* Audio + instruction */}
      {!isDone && (
        <div className="relative z-20 flex flex-col items-center gap-3 mt-2">
          <button
            onClick={playAudio}
            className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center animate-bounce hover:scale-110 active:scale-90 transition-transform"
          >
            <Volume2 className="w-10 h-10 text-purple-500" />
          </button>
          <div className="bg-white/90 px-6 py-2 rounded-full font-bold text-purple-800 shadow-md text-lg">
            👻 Pop den rigtige Drifloon!
          </div>
        </div>
      )}

      {/* Pop effect */}
      <AnimatePresence>
        {popEffect && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed w-12 h-12 rounded-full bg-yellow-300/60 pointer-events-none z-50"
            style={{ left: popEffect.x - 24, top: popEffect.y - 24 }}
          />
        )}
      </AnimatePresence>

      {/* Completion screen */}
      {isDone && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-purple-900/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4"
          >
            <div className="text-6xl mb-4">👻</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Fantastisk!</h2>
            <p className="text-gray-500 font-medium mb-2">Du poppede alle Drifloons!</p>
            <div className="text-yellow-400 text-2xl mb-6">⭐⭐⭐</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onBack}
                className="bg-purple-500 hover:bg-purple-600 active:scale-95 text-white rounded-2xl px-6 py-4 font-black text-lg flex items-center gap-2 transition shadow-lg"
              >
                <Home className="w-6 h-6" /> Tilbage
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Balloons floating up */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.button
              key={balloon.id}
              initial={{ y: "110vh", x: `${balloon.x}vw` }}
              animate={{ y: "-30vh" }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: balloon.speed, ease: "linear" }}
              onAnimationComplete={() => removeBalloon(balloon.id)}
              onClick={(e) => handlePop(balloon, e)}
              className="absolute pointer-events-auto cursor-pointer flex flex-col items-center"
            >
              {/* Drifloon body */}
              <div className={`w-24 h-24 ${balloon.color} rounded-full shadow-lg flex items-center justify-center relative border-4 border-white/20 hover:brightness-110 active:scale-90 transition-transform`}>
                {/* Fluffy top */}
                <div className="absolute -top-3 w-10 h-5 bg-white rounded-full opacity-90" />
                {/* Yellow cross patch */}
                <div className="absolute text-yellow-300 font-bold text-2xl opacity-70 z-0">✖</div>
                {/* Reflection */}
                <div className="absolute top-3 left-3 w-3 h-6 bg-white/30 rounded-full rotate-12" />

                <span className="text-white font-black text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] z-10 bg-black/20 px-2 rounded-lg">
                  {balloon.word}
                </span>
              </div>
              {/* Strings */}
              <div className="flex gap-3 -mt-1">
                <div className="w-0.5 h-10 bg-yellow-400 rounded-b-full relative">
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-yellow-300 rounded-full" />
                </div>
                <div className="w-0.5 h-10 bg-yellow-400 rounded-b-full relative">
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-yellow-300 rounded-full" />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
