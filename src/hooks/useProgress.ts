import { useState, useCallback, useEffect } from "react";

export interface Progress {
  unlockedWorlds: number[];
  stars: number;
  hardWords: string[];
  completedWorlds: number[];
}

const STORAGE_KEY = "nora-lynord-progress";

const defaultProgress: Progress = {
  unlockedWorlds: [1],
  stars: 0,
  hardWords: [],
  completedWorlds: [],
};

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw);
    const completedWorlds = parsed.completedWorlds ?? [];
    
    // Self-heal: ensure unlockedWorlds goes up to max(completedWorlds) + 1
    let maxCompleted = 0;
    if (completedWorlds.length > 0) {
      maxCompleted = Math.max(...completedWorlds);
    }
    const requiredUnlocked = new Set<number>(parsed.unlockedWorlds ?? [1]);
    for (let i = 1; i <= Math.min(36, maxCompleted + 1); i++) {
      requiredUnlocked.add(i);
    }

    return {
      unlockedWorlds: Array.from(requiredUnlocked),
      stars: parsed.stars ?? 0,
      hardWords: parsed.hardWords ?? [],
      completedWorlds,
    };
  } catch {
    return { ...defaultProgress };
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const saveUpdater = useCallback((updater: (prev: Progress) => Progress) => {
    setProgress((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addStars = useCallback(
    (count: number) => {
      saveUpdater((prev) => ({ ...prev, stars: prev.stars + count }));
    },
    [saveUpdater]
  );

  const addHardWord = useCallback(
    (word: string) => {
      saveUpdater((prev) => {
        if (prev.hardWords.includes(word)) return prev;
        return { ...prev, hardWords: [...prev.hardWords, word] };
      });
    },
    [saveUpdater]
  );

  const removeHardWord = useCallback(
    (word: string) => {
      saveUpdater((prev) => ({
        ...prev,
        hardWords: prev.hardWords.filter((w) => w !== word),
      }));
    },
    [saveUpdater]
  );

  const unlockWorld = useCallback(
    (worldId: number) => {
      saveUpdater((prev) => {
        if (prev.unlockedWorlds.includes(worldId)) return prev;
        return { ...prev, unlockedWorlds: [...prev.unlockedWorlds, worldId] };
      });
    },
    [saveUpdater]
  );

  const completeWorld = useCallback(
    (worldId: number) => {
      saveUpdater((prev) => {
        const updated = { ...prev };
        if (!updated.completedWorlds.includes(worldId)) {
          updated.completedWorlds = [...updated.completedWorlds, worldId];
        }
        const nextWorld = worldId + 1;
        if (nextWorld <= 36 && !updated.unlockedWorlds.includes(nextWorld)) {
          updated.unlockedWorlds = [...updated.unlockedWorlds, nextWorld];
        }
        return updated;
      });
    },
    [saveUpdater]
  );

  const resetProgress = useCallback(() => {
    saveUpdater(() => ({ ...defaultProgress }));
  }, [saveUpdater]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setProgress(loadProgress());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return {
    progress,
    addStars,
    addHardWord,
    removeHardWord,
    unlockWorld,
    completeWorld,
    resetProgress,
  };
}
