import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Imports
imports = """import { TrophyCabinet } from "./components/TrophyCabinet";
import { MemoryGame } from "./components/MemoryGame";
import { BalloonPopGame } from "./components/BalloonPopGame";
import { SpellWordGame } from "./components/SpellWordGame";
import { FishingGame } from "./components/FishingGame";
import { TrainGame } from "./components/TrainGame";
"""
content = re.sub(r'import \{ TrophyCabinet \}.*?import \{ MemoryGame \} from "\./components/MemoryGame";', imports, content, flags=re.DOTALL)

# 2. Screen type
screen_type = """type Screen =
  | { type: "home" }
  | { type: "world-menu"; worldId: number }
  | { type: "listen"; worldId: number }
  | { type: "find"; worldId: number }
  | { type: "memory"; worldId: number }
  | { type: "balloon"; worldId: number }
  | { type: "spell"; worldId: number }
  | { type: "fishing"; worldId: number }
  | { type: "train"; worldId: number }
  | { type: "trophy-cabinet" };"""
content = re.sub(r'type Screen =.*?\| \{ type: "trophy-cabinet" \};', screen_type, content, flags=re.DOTALL)

# 3. WorldMenuScreen parameters
on_select = """onSelectMode: (mode: "listen" | "find" | "memory" | "balloon" | "spell" | "fishing" | "train") => void;"""
content = re.sub(r'onSelectMode: \(mode: "listen" \| "find" \| "memory"\) => void;', on_select, content)

# 4. WorldMenuScreen modes array
modes_replacement = """const modes = [
    {
      key: "listen" as const,
      icon: BookOpen,
      title: "Lyt og Lær",
      desc: "Tryk på ordene og hør dem",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      key: "find" as const,
      icon: Gamepad2,
      title: "Fang Ordet!",
      desc: "Find det rigtige ord",
      gradient: "from-red-600 to-orange-500",
    },
    {
      key: "memory" as const,
      icon: Gamepad2,
      title: "Vendespil",
      desc: "Find to ens ord",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      key: "balloon" as const,
      icon: Gamepad2,
      title: "Ballon-pop",
      desc: "Pop den rigtige ballon",
      gradient: "from-sky-400 to-indigo-500",
    },
    {
      key: "spell" as const,
      icon: Gamepad2,
      title: "Stav Ordet",
      desc: "Byg ordet rigtigt",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      key: "fishing" as const,
      icon: Gamepad2,
      title: "Fiskedam",
      desc: "Fang den rigtige fisk",
      gradient: "from-cyan-400 to-blue-600",
    },
    {
      key: "train" as const,
      icon: Gamepad2,
      title: "Ord-Toget",
      desc: "Fyld vognen med ordet",
      gradient: "from-green-400 to-yellow-500",
    },
  ];"""
content = re.sub(r'const modes = \[\s*\{\s*key: "listen".*?\];', modes_replacement, content, flags=re.DOTALL)

# 5. App routing render
routing = """        {screen.type === "memory" && (
          <MemoryGame
            world={worlds[screen.worldId - 1]}
            onComplete={(stars) => completeWorld(screen.worldId, stars)}
            onBack={() => setScreen({ type: "world-menu", worldId: screen.worldId })}
          />
        )}

        {screen.type === "balloon" && (
          <BalloonPopGame
            world={worlds[screen.worldId - 1]}
            onComplete={(stars) => completeWorld(screen.worldId, stars)}
            onBack={() => setScreen({ type: "world-menu", worldId: screen.worldId })}
          />
        )}

        {screen.type === "spell" && (
          <SpellWordGame
            world={worlds[screen.worldId - 1]}
            onComplete={(stars) => completeWorld(screen.worldId, stars)}
            onBack={() => setScreen({ type: "world-menu", worldId: screen.worldId })}
          />
        )}

        {screen.type === "fishing" && (
          <FishingGame
            world={worlds[screen.worldId - 1]}
            onComplete={(stars) => completeWorld(screen.worldId, stars)}
            onBack={() => setScreen({ type: "world-menu", worldId: screen.worldId })}
          />
        )}

        {screen.type === "train" && (
          <TrainGame
            world={worlds[screen.worldId - 1]}
            onComplete={(stars) => completeWorld(screen.worldId, stars)}
            onBack={() => setScreen({ type: "world-menu", worldId: screen.worldId })}
          />
        )}"""
content = re.sub(r'\{screen\.type === "memory".*?</MemoryGame>\s*\n\s*\)}', routing, content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Updated App.tsx")
