import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Star,
  BookOpen,
  Gamepad2,
  ChevronRight,
  Volume2,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  Heart,
  Target,
  Layers,
  Cloud,
  Type,
  Fish,
  Train,
  Zap,
  Shield,
  Home,
  Check,
  Lock,
  RotateCcw
} from "lucide-react";
import confetti from "canvas-confetti";
import { worlds, regions, type World } from "./data/words";
import { useProgress } from "./hooks/useProgress";
import { playWord, stopAudio, preloadWords } from "./hooks/useAudio";


import { TrophyCabinet } from "./components/TrophyCabinet";
import { MemoryGame } from "./components/MemoryGame";
import { BalloonPopGame } from "./components/BalloonPopGame";
import { SpellWordGame } from "./components/SpellWordGame";
import { FishingGame } from "./components/FishingGame";
import { TrainGame } from "./components/TrainGame";


type Screen =
  | { type: "home" }
  | { type: "world-menu"; worldId: number }
  | { type: "listen"; worldId: number }
  | { type: "find"; worldId: number }
  | { type: "memory"; worldId: number }
  | { type: "balloon"; worldId: number }
  | { type: "spell"; worldId: number }
  | { type: "fishing"; worldId: number }
  | { type: "train"; worldId: number }
  | { type: "trophy-cabinet" };

// ────────────────────────────────────────────────────────────
// Pokéball SVG component
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// Floating Pokéball particles
// ────────────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 8 + Math.random() * 12,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 4,
      opacity: 0.06 + Math.random() * 0.08,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <Pokeball size={p.size} />
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Badge counter (replaces star counter)
// ────────────────────────────────────────────────────────────
function BadgeCounter({ count }: { count: number }) {
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <div className="flex items-center gap-2 badge-counter rounded-full px-4 py-2 shadow-lg">
      <Zap
        className={`w-5 h-5 fill-current ${
          animate ? "animate-bounce-star" : ""
        }`}
      />
      <span className="text-lg font-black">{count}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Back button
// ────────────────────────────────────────────────────────────
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="btn-touch glass rounded-full p-3 hover:bg-white/20 transition-colors"
      aria-label="Gå tilbage"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// HOME SCREEN
// ────────────────────────────────────────────────────────────
function HomeScreen({
  onSelectWorld,
  onOpenTrophies,
  progress,
}: {
  onSelectWorld: (worldId: number) => void;
  onOpenTrophies: () => void;
  progress: ReturnType<typeof useProgress>["progress"];
}) {
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0].id);

  return (
    <div className="min-h-full px-4 py-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <div>
          <div className="flex items-center gap-2">
            <Pokeball size={28} />
            <h1 className="text-2xl font-black tracking-tight poke-title">
              Noras Pokédex
            </h1>
          </div>
          <p className="text-white/40 text-sm mt-1 ml-1">
            {progress.completedWorlds.length} / {worlds.length} badges optjent
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <BadgeCounter count={progress.stars} />
          <button 
            onClick={onOpenTrophies}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-5 py-2.5 rounded-full text-sm font-black shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 active:scale-95 transition-all"
          >
            <Trophy className="w-5 h-5 fill-current" />
            Præmieskab!
          </button>
        </div>
      </div>

      {/* Trainer card */}
      <div className="glass rounded-2xl p-4 mb-5 animate-slide-up pokeball-bg border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2.5 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
            <Shield className="w-6 h-6 text-white relative z-10" />
          </div>
          <div>
            <p className="font-extrabold text-white text-lg">Træner Nora</p>
            <p className="text-xs text-white/60">
              {progress.completedWorlds.length === 0
                ? "Begynder – start dit eventyr!"
                : progress.completedWorlds.length < 6
                ? "Ord-Træner i træning! 💪"
                : progress.completedWorlds.length < 12
                ? "Erfaren Ord-Mester! ⚡"
                : "Pokémon Ord-Champion! 🏆"}
            </p>
          </div>
        </div>
      </div>



      {/* Region Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide animate-slide-up">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setSelectedRegionId(region.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              selectedRegionId === region.id
                ? "bg-white text-purple-900 shadow-md scale-105"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* Route Grid */}
      <div className="grid grid-cols-2 gap-3">
        {regions.find(r => r.id === selectedRegionId)?.worlds.map((world, i) => {
          const isUnlocked = progress.unlockedWorlds.includes(world.id);
          const isCompleted = progress.completedWorlds.includes(world.id);
          return (
            <button
              key={world.id}
              onClick={() => isUnlocked && onSelectWorld(world.id)}
              disabled={!isUnlocked}
              className={`
                btn-touch rounded-2xl p-4 text-left relative overflow-hidden
                animate-pop-in stagger-${i + 1}
                ${isUnlocked ? `world-${(world.id - 1) % 12 + 1} shadow-lg hover:shadow-xl hover:scale-[1.03]` : "bg-black/30 border border-white/5"}
                transition-all duration-200
              `}
              style={{ opacity: 0 }}
              id={`world-${world.id}`}
            >
              {/* Badge earned */}
              {isCompleted && (
                <div className="absolute top-2.5 right-2.5 bg-yellow-400 rounded-full p-1 shadow">
                  <Trophy className="w-3.5 h-3.5 text-gray-900" />
                </div>
              )}

              {/* Lock */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Lock className="w-8 h-8 text-white/30" />
                </div>
              )}

              <div className={!isUnlocked ? "opacity-30 grayscale" : ""}>
                <span className="text-3xl block mb-1.5 drop-shadow-sm">{world.emoji}</span>
                <h2 className="text-sm font-extrabold leading-tight text-white drop-shadow-md">
                  {world.name}
                </h2>
                <p className="text-[11px] text-white/80 mt-0.5 font-medium">
                  Rute {world.id} · {world.words.length} ord
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// WORLD MENU (Select mode)
// ────────────────────────────────────────────────────────────
function WorldMenuScreen({
  world,
  onBack,
  onSelectMode,
}: {
  world: World;
  onBack: () => void;
  onSelectMode: (mode: "listen" | "find" | "memory" | "balloon" | "spell" | "fishing" | "train") => void;
}) {
  const modes = [
    {
      key: "listen" as const,
      icon: BookOpen,
      title: "Lyt og Lær",
      desc: "Tryk på ordene og hør dem",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      key: "find" as const,
      icon: Target,
      title: "Fang Ordet!",
      desc: "Find det rigtige ord",
      gradient: "from-red-600 to-orange-500",
    },
    {
      key: "memory" as const,
      icon: Layers,
      title: "Vendespil",
      desc: "Find to ens ord",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      key: "balloon" as const,
      icon: Cloud,
      title: "Ballon-pop",
      desc: "Pop den rigtige ballon",
      gradient: "from-sky-400 to-indigo-500",
    },
    {
      key: "spell" as const,
      icon: Type,
      title: "Stav Ordet",
      desc: "Byg ordet rigtigt",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      key: "fishing" as const,
      icon: Fish,
      title: "Fiskedam",
      desc: "Fang den rigtige fisk",
      gradient: "from-cyan-400 to-blue-600",
    },
    {
      key: "train" as const,
      icon: Train,
      title: "Ord-Toget",
      desc: "Fyld vognen med ordet",
      gradient: "from-green-400 to-yellow-500",
    },
  ];

  return (
    <div className="min-h-full px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 animate-slide-up">
        <BackButton onClick={onBack} />
        <div>
          <h1 className="text-xl font-black">
            {world.emoji} {world.name}
          </h1>
          <p className="text-white/40 text-sm">Rute {world.id} · Vælg en øvelse</p>
        </div>
      </div>

      {/* Words preview */}
      <div className="glass rounded-2xl p-4 mb-6 animate-pop-in pokeball-bg">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">
          Ord i denne rute
        </p>
        <div className="flex flex-wrap gap-2">
          {world.words.map((w) => (
            <span
              key={w.id}
              className="bg-white/10 rounded-full px-3 py-1 text-sm font-semibold"
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>

      {/* Mode cards */}
      <div className="space-y-3">
        {modes.map((mode, i) => (
          <button
            key={mode.key}
            onClick={() => onSelectMode(mode.key)}
            className={`
              btn-touch w-full rounded-2xl p-5 flex items-center gap-4
              bg-gradient-to-r ${mode.gradient}
              shadow-lg hover:shadow-xl hover:scale-[1.02]
              transition-all duration-200
              animate-pop-in stagger-${i + 2}
            `}
            style={{ opacity: 0 }}
            id={`mode-${mode.key}`}
          >
            <div className="bg-white/20 rounded-xl p-3">
              <mode.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-extrabold">{mode.title}</h3>
              <p className="text-white/80 text-sm">{mode.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MODE 1: LYT OG LÆR (no auto-play — user taps to hear)
// ────────────────────────────────────────────────────────────
function ListenScreen({
  world,
  onBack,
}: {
  world: World;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const word = world.words[index];

  useEffect(() => {
    preloadWords(world.words.map((w) => w.text));
  }, [world]);

  // NO auto-play — user must tap
  useEffect(() => {
    return () => { stopAudio(); };
  }, [word.text]);

  const handleSpeak = useCallback(() => {
    playWord(word.text);
  }, [word.text]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setIndex((i) => Math.min(world.words.length - 1, i + 1));

  return (
    <div className="min-h-full px-4 py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <BackButton onClick={onBack} />
        <span className="text-white/50 font-bold text-sm">
          {index + 1} / {world.words.length}
        </span>
        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
          style={{
            width: `${((index + 1) / world.words.length) * 100}%`,
          }}
        />
      </div>

      {/* Word display — tap to hear */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <button
          onClick={handleSpeak}
          className="animate-pop-in mb-6"
          style={{ opacity: 0 }}
          aria-label={`Læs ordet ${word.text} højt`}
        >
          <div className="glass-strong rounded-3xl px-12 py-10 flex flex-col items-center gap-4 hover:bg-white/15 active:scale-95 transition-all animate-float">
            <span className="text-7xl sm:text-8xl font-black tracking-wide text-white animate-electric-glow">
              {word.text}
            </span>
            <div className="flex items-center gap-2 text-yellow-400">
              <Volume2 className="w-6 h-6" />
              <span className="text-sm font-bold">Tryk for at lytte</span>
            </div>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-auto pt-4 animate-slide-up">
        <button
          onClick={prev}
          disabled={index === 0}
          className="btn-touch glass rounded-2xl px-6 py-3 font-bold disabled:opacity-30 transition-opacity"
        >
          ← Forrige
        </button>
        <button
          onClick={next}
          disabled={index === world.words.length - 1}
          className="btn-touch glass rounded-2xl px-6 py-3 font-bold disabled:opacity-30 transition-opacity"
        >
          Næste →
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MODE 2: FANG ORDET (Touch quiz)
// ────────────────────────────────────────────────────────────
function FindScreen({
  world,
  onBack,
  progress,
  addStars,
  addHardWord,
  completeWorld,
}: {
  world: World;
  onBack: () => void;
  progress: ReturnType<typeof useProgress>["progress"];
  addStars: (n: number) => void;
  addHardWord: (w: string) => void;
  completeWorld: (id: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [correct, setCorrect] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  const word = world.words[index];

  const generateOptions = useCallback(
    (currentWord: string) => {
      const allWords = worlds.flatMap((w) => w.words.map((wo) => wo.text));
      const others = allWords.filter((w) => w !== currentWord);
      const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 2);
      const opts = [currentWord, ...shuffled].sort(() => Math.random() - 0.5);
      setOptions(opts);
    },
    []
  );

  useEffect(() => {
    preloadWords(world.words.map((w) => w.text));
  }, [world]);

  useEffect(() => {
    if (!finished) {
      generateOptions(word.text);
      setCorrect(null);
      setShakeId(null);
      const timer = setTimeout(() => playWord(word.text), 400);
      return () => {
        clearTimeout(timer);
        stopAudio();
      };
    }
  }, [index, word.text, generateOptions, finished]);

  const handlePick = (picked: string) => {
    if (correct) return;

    if (picked === word.text) {
      setCorrect(picked);
      addStars(1);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#FACC15", "#E3350D", "#2563EB", "#34d399"],
      });

      setTimeout(() => {
        if (index < world.words.length - 1) {
          setIndex((i) => i + 1);
        } else {
          if (mistakes === 0) {
            completeWorld(world.id);
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
      setShakeId(picked);
      setMistakes((m) => m + 1);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  const handleReplay = () => playWord(word.text);

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
            {perfect ? "Gotcha!" : "Godt klaret!"}
          </h2>
          <p className="text-white/60 mb-6">
            {perfect
              ? `Alle ${world.words.length} ord fanget! Du fik en ny badge! ⚡`
              : `Du havde ${mistakes} fejl. Træn videre og prøv igen!`}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="btn-touch glass rounded-2xl px-5 py-3 font-bold flex items-center gap-2"
            >
              <Home className="w-5 h-5" /> Hjem
            </button>
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
    <div className="min-h-full px-4 py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-slide-up">
        <BackButton onClick={onBack} />
        <span className="text-white/50 font-bold text-sm">
          {index + 1} / {world.words.length}
        </span>
        <BadgeCounter count={progress.stars} />
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-yellow-400 transition-all duration-500"
          style={{
            width: `${((index + 1) / world.words.length) * 100}%`,
          }}
        />
      </div>

      {/* Speaker */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <button
          onClick={handleReplay}
          className="mb-10 animate-pop-in"
          style={{ opacity: 0 }}
          aria-label="Hør ordet igen"
        >
          <div className="glass-strong rounded-full p-8 animate-pulse-glow hover:bg-white/15 transition-colors">
            <Volume2 className="w-14 h-14 text-yellow-400" />
          </div>
          <p className="text-center text-white/40 text-sm mt-3">
            Tryk for at høre ordet
          </p>
        </button>

        {/* Options */}
        <div className="w-full max-w-sm space-y-4">
          {options.map((opt, i) => {
            const isCorrectPick = correct === opt;
            const isShaking = shakeId === opt;
            return (
              <button
                key={`${index}-${opt}-${i}`}
                onClick={() => handlePick(opt)}
                className={`
                  btn-touch w-full rounded-2xl py-5 text-3xl font-black
                  transition-all duration-200
                  ${
                    isCorrectPick
                      ? "bg-gradient-to-r from-green-500 to-emerald-400 scale-105 shadow-xl"
                      : isShaking
                      ? "bg-red-500/50 animate-shake"
                      : "glass-strong hover:bg-white/15"
                  }
                  animate-pop-in stagger-${i + 1}
                `}
                style={{ opacity: 0 }}
                disabled={!!correct}
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

// ────────────────────────────────────────────────────────────
// MODE 3: SIG ORDET (Microphone)
// ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────
// APP (Root)
// ────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: "home" });
  const { progress, addStars, addHardWord, completeWorld } = useProgress();

  const goHome = () => setScreen({ type: "home" });

  const goWorldMenu = (worldId: number) =>
    setScreen({ type: "world-menu", worldId });

  const getWorld = (id: number) => worlds.find((w) => w.id === id)!;

  // iOS audio context init
  const initialized = useRef(false);
  useEffect(() => {
    const handler = () => {
      if (!initialized.current) {
        initialized.current = true;
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const buf = ctx.createBuffer(1, 1, 22050);
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.connect(ctx.destination);
          src.start(0);
        } catch {}
        if ("speechSynthesis" in window) {
          window.speechSynthesis.getVoices();
        }
      }
    };
    document.addEventListener("touchstart", handler, { once: true });
    document.addEventListener("click", handler, { once: true });
    return () => {
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("click", handler);
    };
  }, []);

  const goTrophies = () => setScreen({ type: "trophy-cabinet" });

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Background container */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col">
        {screen.type === "home" && (
          <HomeScreen 
            onSelectWorld={goWorldMenu} 
            onOpenTrophies={goTrophies}
            progress={progress} 
          />
        )}
        {screen.type === "trophy-cabinet" && (
          <TrophyCabinet progress={progress} onBack={goHome} />
        )}
        {screen.type === "world-menu" && (
          <WorldMenuScreen
            world={getWorld(screen.worldId)}
            onBack={goHome}
            onSelectMode={(mode) =>
              setScreen({ type: mode, worldId: screen.worldId })
            }
          />
        )}
        {screen.type === "listen" && (
          <ListenScreen
            world={getWorld(screen.worldId)}
            onBack={() => goWorldMenu(screen.worldId)}
          />
        )}
        {screen.type === "find" && (
          <FindScreen
            world={getWorld(screen.worldId)}
            onBack={() => goWorldMenu(screen.worldId)}
            progress={progress}
            addStars={addStars}
            addHardWord={addHardWord}
            completeWorld={completeWorld}
          />
        )}
        {screen.type === "memory" && (
          <MemoryGame
            world={getWorld(screen.worldId)}
            onBack={() => goWorldMenu(screen.worldId)}
            addStars={addStars}
            completeWorld={completeWorld}
          />
        )}

        {screen.type === "balloon" && (
          <BalloonPopGame
            world={getWorld(screen.worldId)}
            onBack={() => goWorldMenu(screen.worldId)}
            onComplete={(stars) => {
              addStars(stars);
              completeWorld(screen.worldId);
              goWorldMenu(screen.worldId);
            }}
          />
        )}

        {screen.type === "spell" && (
          <SpellWordGame
            world={getWorld(screen.worldId)}
            onBack={() => goWorldMenu(screen.worldId)}
            onComplete={(stars) => {
              addStars(stars);
              completeWorld(screen.worldId);
              goWorldMenu(screen.worldId);
            }}
          />
        )}

        {screen.type === "fishing" && (
          <FishingGame
            world={getWorld(screen.worldId)}
            onBack={() => goWorldMenu(screen.worldId)}
            onComplete={(stars) => {
              addStars(stars);
              completeWorld(screen.worldId);
              goWorldMenu(screen.worldId);
            }}
          />
        )}

        {screen.type === "train" && (
          <TrainGame
            world={getWorld(screen.worldId)}
            onBack={() => goWorldMenu(screen.worldId)}
            onComplete={(stars) => {
              addStars(stars);
              completeWorld(screen.worldId);
              goWorldMenu(screen.worldId);
            }}
          />
        )}
      </div>
    </div>
  );
}
